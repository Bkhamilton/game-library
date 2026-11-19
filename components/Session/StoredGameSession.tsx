import React, { useEffect, useRef, useState, type ReactNode } from 'react';
import { Alert, Button, Modal, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';
import { getSessionGame } from '@/constants/GameSessionRoutes';
import { useGameSessions } from '@/contexts/GameSessionContext';
import { finishSession, getSession, saveSession, startSession, type SessionIdentity, type SessionMetric, type SessionOutcome, type StoredSession } from '@/db/Sessions/Sessions';
import type { SessionSnapshot } from '@/hooks/useGameSession';
import { getDailyKey, readLegacyDailyCompletion } from '@/utils/DailyChallenge';
import { Text, View } from '@/components/Themed';
import { LoadingSpinner } from '@/components/animations';

export type StoredGameProps<T> = {
    run: StoredSession;
    state: T;
    restored: boolean;
    checkpoint: (snapshot: SessionSnapshot<T>) => Promise<unknown>;
    finalize: (outcome: SessionOutcome, metrics: SessionMetric[]) => Promise<void>;
    restart: (difficulty?: string) => void;
    home: () => void;
    openHelp: () => void;
};

type Props<T> = {
    title: string;
    version: number;
    create: (identity: SessionIdentity) => T;
    validate: (data: unknown, identity: SessionIdentity) => data is T;
    instructions: string;
    children: (props: StoredGameProps<T>) => ReactNode;
};

export function StoredGameSession<T>({ title, version, create, validate, instructions, children }: Props<T>) {
    const router = useRouter();
    const db = useSQLiteContext();
    const { refresh } = useGameSessions();
    const { sessionId, replaceSessionId, mode, difficulty, dailyDate, replay } = useLocalSearchParams<{
        sessionId?: string; replaceSessionId?: string; mode?: string; difficulty?: string; dailyDate?: string; replay?: string;
    }>();
    const [loaded, setLoaded] = useState<{
        run: StoredSession; state: T; restored: boolean; revision: { current: number };
    } | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [retry, setRetry] = useState(0);
    const [help, setHelp] = useState(false);
    const [finishedId, setFinishedId] = useState<string>();
    const adapter = useRef({ create, validate });
    adapter.current = { create, validate };

    useEffect(() => {
        let current = true;
        const open = async () => {
            const game = getSessionGame(title);
            if (!game) throw new Error('Unknown game.');
            const selectedMode = mode ?? game.modes[0];
            const selectedDifficulty = difficulty ?? game.difficulties[0];
            if (!game.modes.includes(selectedMode) || !game.difficulties.includes(selectedDifficulty)) {
                throw new Error('Unknown game mode or difficulty.');
            }
            if (sessionId) {
                const run = await getSession(db, sessionId);
                if (!run || run.identity.gameId !== game.id) throw new Error('Saved game no longer exists.');
                const { data } = run.snapshot;
                if (run.snapshot.version !== version || !adapter.current.validate(data, run.identity) ||
                    !game.modes.includes(run.identity.mode) || !game.difficulties.includes(run.identity.difficulty)) {
                    throw new Error('This saved game is no longer compatible. It has not been replaced.');
                }
                if (current) {
                    setLoaded({ run, state: data, restored: true, revision: { current: run.revision } });
                }
            } else {
                const date = selectedMode === 'Daily Challenge' ? dailyDate ?? getDailyKey() : undefined;
                const identity = { gameId: game.id, mode: selectedMode, difficulty: selectedDifficulty, dailyDate: date };
                if (date && await readLegacyDailyCompletion(title, selectedDifficulty, date)) {
                    throw new Error('This Daily Challenge is already complete.');
                }
                if (!current) return;
                const state = adapter.current.create(identity);
                if (!adapter.current.validate(state, identity)) throw new Error('Could not prepare a valid game.');
                const run = await startSession(db, identity, { version, data: state, elapsedMs: 0 }, replaceSessionId);
                void refresh();
                if (current) {
                    setLoaded({ run, state, restored: false, revision: { current: run.revision } });
                    setHelp(true);
                }
            }
        };
        // Defer opening until this route's effect survives setup/cleanup.
        void Promise.resolve().then(() => {
            if (current) return open();
        }).catch(cause => {
            console.error('Could not open game session:', cause);
            if (current) setError(cause instanceof Error ? cause.message : 'Could not open this game.');
        });
        return () => { current = false; };
    }, [db, title, version, sessionId, replaceSessionId, mode, difficulty, dailyDate, replay, retry, refresh]);

    const home = () => {
        if (router.canGoBack()) router.back();
        else router.replace('/');
    };

    if (error) return (
        <View>
            <Text accessibilityRole="alert">{error}</Text>
            <Button title="Retry" onPress={() => { setError(null); setRetry(current => current + 1); }} />
            <Button title="Back to games" onPress={home} />
        </View>
    );
    if (!loaded) return <LoadingSpinner size="large" />;

    const { run, state, restored, revision } = loaded;
    const restart = (nextDifficulty = run.identity.difficulty) => {
        const game = getSessionGame(title);
        if (!game) return;
        const launch = () => router.replace({
            pathname: game.pathname,
            params: {
                mode: run.identity.mode,
                difficulty: nextDifficulty,
                dailyDate: run.identity.dailyDate,
                replaceSessionId: finishedId === run.id ? undefined : run.id,
                replay: run.id,
            },
        });
        if (finishedId === run.id) launch();
        else Alert.alert('Restart game?', 'Your unfinished progress will be replaced.', [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Restart', style: 'destructive', onPress: launch },
        ]);
    };

    return (
        <>
            <React.Fragment key={run.id}>
                {children({
                    run, state, restored, restart, home, openHelp: () => setHelp(true),
                    checkpoint: async snapshot => {
                        const saved = await saveSession(db, run.id,
                            { version, data: snapshot.state, elapsedMs: snapshot.elapsedMs }, revision.current);
                        revision.current = saved.revision;
                    },
                    finalize: async (outcome, metrics) => {
                        await finishSession(db, run.id, outcome, metrics);
                        setFinishedId(run.id);
                        void refresh();
                    },
                })}
            </React.Fragment>
            <Modal visible={help} animationType="slide" onRequestClose={() => setHelp(false)}>
                <View style={{ flex: 1 }}>
                    <SafeAreaView style={{ flex: 1 }}>
                        <ScrollView contentContainerStyle={{ padding: 24 }}>
                            <Text accessibilityRole="header">{title}: How to play</Text>
                            <Text>{instructions}</Text>
                            <Text>{`Mode: ${run.identity.mode} · Difficulty: ${run.identity.difficulty}`}</Text>
                            <Button title="Close help" onPress={() => setHelp(false)} />
                        </ScrollView>
                    </SafeAreaView>
                </View>
            </Modal>
        </>
    );
}
