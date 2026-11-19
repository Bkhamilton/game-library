import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet } from 'react-native';
import { View, Text } from '@/components/Themed';
import { SessionControls, SessionResult } from '@/components/Session';
import { StoredGameSession, type StoredGameProps } from '@/components/Session/StoredGameSession';
import { useGameSession } from '@/hooks/useGameSession';
import useTheme from '@/hooks/useTheme';
import { addToSequence, calculatePlaybackSpeed, getDifficultySettings, getTileColors } from '@/utils/SimonSaysGenerator';
import ColorTile from './ColorTile';
import SimonSaysHeader from './SimonSaysHeader';
import { createSimonSnapshot, isSimonSnapshot, type SimonSnapshot } from './SimonSaysSession';

export default function SimonSaysGame() {
    return <StoredGameSession title="Simon Says" version={1} create={createSimonSnapshot} validate={isSimonSnapshot}
        instructions="Watch the sequence, then repeat it. A wrong tile ends the run. After an interruption the current sequence is replayed.">
        {props => <SimonSaysRun {...props} />}
    </StoredGameSession>;
}

export function SimonSaysRun({ run, state, restored, checkpoint, finalize, restart, home, openHelp }: StoredGameProps<SimonSnapshot>) {
    const [activeTile, setActiveTile] = useState<number | null>(null);
    const flashTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
    const activation = useRef<number | null>(null);
    const { primary } = useTheme();
    const settings = getDifficultySettings(run.identity.difficulty);
    const colors = getTileColors(run.identity.difficulty);
    const session = useGameSession<SimonSnapshot, 'loss'>({
        initialState: state,
        restored: restored ? { state, elapsedMs: run.snapshot.elapsedMs, revision: run.revision } : undefined,
        checkpoint,
        onTerminal: async (outcome, snapshot) => {
            await checkpoint(snapshot);
            await finalize(outcome, [{ metric: 'highScore', score: snapshot.state.completed }]);
        },
    });
    const { isActive, runToken } = session;
    useEffect(() => {
        if (!isActive) return;
        if (activation.current !== runToken) {
            activation.current = runToken;
            const s = session.getSnapshot().state;
            if (s.phase === 'input' && !s.outcome) {
                session.change({ ...s, phase: 'showing', input: [] }, runToken);
            }
        }
    }, [isActive, runToken]);
    useEffect(() => {
        if (!isActive) { setActiveTile(null); return; }
        const s = session.getSnapshot().state;
        if (s.outcome) { void session.finish(s.outcome, runToken); return; }
        if (s.phase === 'countdown' || s.phase === 'next') {
            const timer = setTimeout(() => {
                session.change(previous => previous.phase === 'countdown' && previous.countdown > 1
                    ? { ...previous, countdown: previous.countdown - 1 }
                    : { ...previous, countdown: 0, phase: 'showing',
                        sequence: addToSequence(previous.sequence, settings.tileCount), input: [] }, runToken);
            }, 1000);
            return () => clearTimeout(timer);
        }
        if (s.phase !== 'showing') return;
        let cancelled = false;
        let timer: ReturnType<typeof setTimeout>;
        const speed = calculatePlaybackSpeed(s.sequence.length, settings);
        const play = (index: number) => {
            if (cancelled || !session.change(previous => previous, runToken)) return;
            if (index >= s.sequence.length) {
                setActiveTile(null);
                session.change(previous => ({ ...previous, phase: 'input', input: [] }), runToken);
                return;
            }
            setActiveTile(s.sequence[index]);
            timer = setTimeout(() => {
                if (cancelled || !session.change(previous => previous, runToken)) return;
                setActiveTile(null);
                timer = setTimeout(() => play(index + 1), speed * 0.4);
            }, speed * 0.6);
        };
        play(0);
        return () => { cancelled = true; clearTimeout(timer); setActiveTile(null); };
    }, [isActive, runToken, session.state, settings]);
    useEffect(() => () => {
        if (flashTimer.current) clearTimeout(flashTimer.current);
    }, [isActive, runToken]);

    const press = (tile: number) => {
        const s = session.getSnapshot().state;
        if (s.phase !== 'input' || s.outcome) return;
        const correct = s.sequence[s.input.length] === tile;
        const input = correct ? [...s.input, tile] : s.input;
        const complete = correct && input.length === s.sequence.length;
        if (!session.change({ ...s, input, outcome: correct ? null : 'loss',
            phase: complete ? 'next' : s.phase, completed: complete ? s.sequence.length : s.completed }, runToken)) return;
        setActiveTile(tile);
        if (flashTimer.current) clearTimeout(flashTimer.current);
        flashTimer.current = setTimeout(() => {
            if (session.change(previous => previous, runToken)) setActiveTile(null);
        }, 200);
    };
    const { rows, cols } = settings.gridLayout;
    const tileSize = Math.min(320 / cols, 320 / rows);
    return <View style={styles.container}>
        <SimonSaysHeader round={session.state.sequence.length} elapsedMs={session.elapsedMs} />
        <SessionControls status={session.status} isSaving={session.isSaving} error={session.error}
            onStart={session.start} onPause={session.pause} onResume={session.resume} onRetry={session.retry}
            onLeave={() => session.leave(home)} onHelp={openHelp} onRestart={() => restart()} />
        <View style={[styles.board, { borderColor: primary }]} pointerEvents={isActive ? 'auto' : 'none'}
            accessibilityElementsHidden={!isActive} importantForAccessibility={isActive ? 'auto' : 'no-hide-descendants'}>
            {session.state.phase === 'countdown' ? <Text style={styles.countdown}>{session.state.countdown}</Text> :
                Array.from({ length: rows }, (_, row) => <View key={row} style={styles.row}>
                    {colors.slice(row * cols, (row + 1) * cols).map((color, col) => {
                        const index = row * cols + col;
                        return <ColorTile key={index} color={color} isActive={activeTile === index}
                            onPress={() => press(index)} disabled={!isActive || session.state.phase !== 'input' || !!session.state.outcome}
                            size={tileSize} />;
                    })}
                </View>)}
        </View>
        <Text>{session.state.phase === 'input' ? 'Your turn! Repeat the sequence.' :
            session.state.phase === 'showing' ? 'Watch carefully!' : 'Get ready...'}</Text>
        {session.status === 'terminal' && <SessionResult title="Game over" disabled={!session.isTerminalSaved}
            onReplay={() => session.leave(() => restart())} onHome={() => session.leave(home)}>
            <Text>Highest completed round: {session.state.completed}</Text>
        </SessionResult>}
    </View>;
}
const styles = StyleSheet.create({
    container: { flex: 1, alignItems: 'center', paddingTop: 24 },
    board: { width: 360, height: 360, justifyContent: 'center', alignItems: 'center', marginVertical: 20 },
    row: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center' },
    countdown: { fontSize: 80, fontWeight: 'bold' },
});
