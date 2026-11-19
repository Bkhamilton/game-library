import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useSQLiteContext } from 'expo-sqlite';
import { View, Text } from '@/components/Themed';
import { SessionControls, SessionResult } from '@/components/Session';
import { StoredGameSession, type StoredGameProps } from '@/components/Session/StoredGameSession';
import { useGameSession } from '@/hooks/useGameSession';
import useTheme from '@/hooks/useTheme';
import { getHighestTile, move } from '@/utils/TwoZeroFourEightGenerator';
import TwoZeroFourEightBoard from './TwoZeroFourEightBoard';
import TwoZeroFourEightHeader from './TwoZeroFourEightHeader';
import { applyTileMove, createTileSnapshot, isTileSnapshot, tileOutcome, type TileSnapshot } from './TwoZeroFourEightSession';

const instructions = 'Use the arrows to slide tiles. Equal tiles merge and add to your score. ' +
    'Reach 2048 to win; no legal moves ends the game. Pause or leave to save, then resume explicitly.';

export default function TwoZeroFourEightGame() {
    return <StoredGameSession title="2048" version={1}
        create={identity => createTileSnapshot(identity.difficulty)} validate={isTileSnapshot} instructions={instructions}>
        {props => <TwoZeroFourEightRun {...props} />}
    </StoredGameSession>;
}

export function TwoZeroFourEightRun({ run, state, restored, checkpoint, finalize, restart, home, openHelp }: StoredGameProps<TileSnapshot>) {
    const db = useSQLiteContext();
    const { primary, text } = useTheme();
    const [highScore, setHighScore] = useState(0);
    const [outcome, setOutcome] = useState<'win' | 'loss' | null>(null);
    const terminalRequested = useRef(false);
    const session = useGameSession<TileSnapshot, 'win' | 'loss'>({
        initialState: state,
        restored: restored ? { state, elapsedMs: run.snapshot.elapsedMs, revision: run.revision } : undefined,
        checkpoint,
        onTerminal: async (result, snapshot) => {
            await checkpoint(snapshot);
            await finalize(result, [
                { metric: 'highScore', score: snapshot.state.score },
                { metric: 'totalScore', score: snapshot.state.score },
                { metric: 'moves', score: snapshot.state.moves },
                { metric: 'highestTile', score: getHighestTile(snapshot.state.board) },
                ...(result === 'win' ? [{ metric: 'timeScore', score: Math.floor(snapshot.elapsedMs / 1000) }] : []),
            ]);
        },
    });
    useEffect(() => {
        let current = true;
        void db.getFirstAsync<{ score: number }>(
            'SELECT MAX(score) AS score FROM Scores WHERE metric = ? AND gameId = ? AND difficulty = ?',
            ['highScore', run.identity.gameId, run.identity.difficulty],
        ).then(row => { if (current) setHighScore(row?.score ?? 0); })
            .catch(error => { if (current) console.error('Could not load high score:', error); });
        return () => { current = false; };
    }, [db, run.identity.gameId, run.identity.difficulty]);
    const finish = (result: 'win' | 'loss') => {
        if (terminalRequested.current) return;
        terminalRequested.current = true;
        setOutcome(result);
        void session.finish(result, session.runToken);
    };
    useEffect(() => {
        if (!session.isActive || terminalRequested.current) return;
        const result = tileOutcome(session.state);
        if (result) finish(result);
    }, [session.isActive, session.runToken, session.state]);
    const handleMove = (direction: 'up' | 'down' | 'left' | 'right') => {
        if (!session.isActive || terminalRequested.current) return;
        if (!move(session.getSnapshot().state.board, direction).moved) return;
        const result: { outcome?: 'win' | 'loss' } = {};
        const accepted = session.change(previous => {
            const move = applyTileMove(previous, direction);
            result.outcome = move?.outcome;
            return move?.snapshot ?? previous;
        }, session.runToken);
        if (accepted && result.outcome) finish(result.outcome);
    };
    const arrow = (direction: 'up' | 'down' | 'left' | 'right', icon: 'arrow-upward' | 'arrow-downward' | 'arrow-back' | 'arrow-forward') =>
        <TouchableOpacity style={[styles.arrowButton, { backgroundColor: primary }]}
            accessibilityRole="button" accessibilityLabel={`Move ${direction}`}
            onPress={() => handleMove(direction)} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
            <MaterialIcons name={icon} size={32} color={text} />
        </TouchableOpacity>;
    return <View style={styles.container}>
        <TwoZeroFourEightHeader highScore={highScore} elapsedMs={session.elapsedMs} />
        <SessionControls status={session.status} isSaving={session.isSaving} error={session.error}
            onStart={session.start} onPause={session.pause} onResume={session.resume}
            onRetry={session.retry} onLeave={() => session.leave(home)} onHelp={openHelp} onRestart={() => restart()} />
        <Text style={styles.score}>Score: {session.state.score}</Text>
        <Text style={styles.instructions}>Tap arrows to move tiles</Text>
        <View pointerEvents={session.isActive ? 'auto' : 'none'}
            accessibilityElementsHidden={!session.isActive}
            importantForAccessibility={session.isActive ? 'auto' : 'no-hide-descendants'}>
            <TwoZeroFourEightBoard board={session.state.board} />
            <View style={styles.controlsContainer}>
                <View style={styles.topRow}>{arrow('up', 'arrow-upward')}</View>
                <View style={styles.bottomRow}>
                    {arrow('left', 'arrow-back')}{arrow('down', 'arrow-downward')}{arrow('right', 'arrow-forward')}
                </View>
            </View>
        </View>
        {session.status === 'terminal' && <SessionResult title={outcome === 'win' ? 'You won!' : 'Game over'}
            disabled={!session.isTerminalSaved} onReplay={() => session.leave(() => restart())}
            onHome={() => session.leave(home)}>
            <Text>Score: {session.state.score} · Moves: {session.state.moves}</Text>
        </SessionResult>}
    </View>;
}

const styles = StyleSheet.create({
    container: { flex: 1, alignItems: 'center', paddingTop: 24 },
    score: { fontSize: 28, fontWeight: 'bold', marginBottom: 10, marginTop: 10 },
    instructions: { fontSize: 14, opacity: 0.6, marginBottom: 20 },
    controlsContainer: { marginTop: 30, alignItems: 'center' },
    topRow: { marginBottom: 8 },
    bottomRow: { flexDirection: 'row', justifyContent: 'center', gap: 8 },
    arrowButton: { justifyContent: 'center', alignItems: 'center', padding: 20, borderRadius: 12, minWidth: 80, minHeight: 80 },
});
