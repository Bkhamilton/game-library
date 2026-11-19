import React, { useEffect, useMemo, useRef, useState } from 'react';
import { StyleSheet } from 'react-native';
import { Text, View } from '@/components/Themed';
import { ShakeView, GameVictoryConfetti } from '@/components/animations';
import { SessionControls, SessionResult } from '@/components/Session';
import { StoredGameSession, type StoredGameProps } from '@/components/Session/StoredGameSession';
import { useGameSession } from '@/hooks/useGameSession';
import SudokuBoard from './SudokuBoard';
import SudokuHeader from './SudokuHeader';
import {
    applySudokuMove, createSudokuSnapshot, frenzyDurationMs, isSudokuSnapshot,
    type SudokuSnapshot,
} from './SudokuSession';

const instructions = 'Fill each row, column and 3×3 box with the numbers 1–9. Select a cell, then a number. ' +
    'Classic ends after four mistakes. In Frenzy, each correct entry resets the countdown. ' +
    'Pause or leave to save your progress; resume explicitly when you return.';

export default function SudokuGame() {
    return (
        <StoredGameSession title="Sudoku" version={1}
            create={identity => createSudokuSnapshot(identity.difficulty, identity.dailyDate)}
            validate={isSudokuSnapshot} instructions={instructions}>
            {props => <SudokuRun {...props} />}
        </StoredGameSession>
    );
}

export function SudokuRun({ run, state, restored, checkpoint, finalize, restart, home, openHelp }: StoredGameProps<SudokuSnapshot>) {
    const { mode, difficulty } = run.identity;
    const [selectedNumber, setSelectedNumber] = useState<number | null>(null);
    const [errorShakeTrigger, setErrorShakeTrigger] = useState(0);
    const [showVictoryConfetti, setShowVictoryConfetti] = useState(false);
    const [outcome, setOutcome] = useState<'win' | 'loss' | null>(null);
    const terminalRequested = useRef(false);
    const session = useGameSession<SudokuSnapshot, 'win' | 'loss'>({
        initialState: state,
        restored: restored ? { state, elapsedMs: run.snapshot.elapsedMs, revision: run.revision } : undefined,
        checkpoint,
        onTerminal: async (result, snapshot) => {
            await checkpoint(snapshot);
            await finalize(result, [
                { metric: 'mistakes', score: snapshot.state.mistakes },
                ...(result === 'win' ? [{ metric: 'timeScore', score: Math.floor(snapshot.elapsedMs / 1000) }] : []),
            ]);
        },
    });
    const initialNumbers = useMemo(() => {
        const givens: Record<string, boolean> = {};
        session.state.givens.forEach((row, i) => row.forEach((digit, j) => {
            if (digit) givens[`${i}-${j}`] = true;
        }));
        return givens;
    }, [session.state.givens]);
    const durationMs = mode === 'Frenzy' ? frenzyDurationMs(difficulty) : 0;
    const remainingMs = Math.max(0, Math.min(durationMs,
        durationMs - (session.elapsedMs - session.state.frenzyResetAtMs)));

    const finish = (result: 'win' | 'loss') => {
        if (terminalRequested.current) return;
        terminalRequested.current = true;
        setOutcome(result);
        if (result === 'win') setShowVictoryConfetti(true);
        void session.finish(result, session.runToken);
    };

    useEffect(() => {
        if (!session.isActive || terminalRequested.current) return;
        // A crash between the last checkpoint and finalization must not reopen a completed board.
        if (session.state.board.every(row => row.every(Boolean))) finish('win');
        else if ((mode === 'Classic' && session.state.mistakes >= 4) ||
            (mode === 'Frenzy' && remainingMs <= 0)) finish('loss');
    }, [session.isActive, session.elapsedMs, session.state, mode, remainingMs]);

    const handleInputChange = (row: number, col: number, value: string) => {
        if (!session.isActive || terminalRequested.current) return;
        const snapshot = session.getSnapshot();
        if (mode === 'Frenzy' && snapshot.elapsedMs - snapshot.state.frenzyResetAtMs >= durationMs) {
            if (session.change(previous => previous, session.runToken)) finish('loss');
            return;
        }
        const move = applySudokuMove(snapshot.state, row, col, Number(value), mode, snapshot.elapsedMs);
        if (!move || !session.change(move.snapshot, session.runToken)) return;
        if (move.mistake) setErrorShakeTrigger(previous => previous + 1);
        if (move.outcome) finish(move.outcome);
    };

    return (
        <View style={styles.container}>
            <SudokuHeader wrongCount={session.state.mistakes} mode={mode}
                elapsedMs={session.elapsedMs} remainingMs={remainingMs} />
            <SessionControls status={session.status} isSaving={session.isSaving} error={session.error}
                onStart={session.start} onPause={session.pause} onResume={session.resume}
                onRetry={session.retry} onLeave={() => session.leave(home)}
                onHelp={openHelp} onRestart={() => restart()} />
            <View pointerEvents={session.isActive ? 'auto' : 'none'}
                accessibilityElementsHidden={!session.isActive}
                importantForAccessibility={session.isActive ? 'auto' : 'no-hide-descendants'}>
                <ShakeView trigger={errorShakeTrigger}>
                    <SudokuBoard key={session.runToken} board={session.state.board}
                        handleInputChange={handleInputChange} selectedNumber={selectedNumber}
                        initialNumbers={initialNumbers} selectNumber={value => {
                            if (value === null || session.isActive) setSelectedNumber(value);
                        }} />
                </ShakeView>
            </View>
            {session.status === 'terminal' && (
                <SessionResult title={outcome === 'win' ? 'You won!' : 'Game over'}
                    disabled={!session.isTerminalSaved}
                    onReplay={mode === 'Daily Challenge' ? undefined : () => session.leave(() => restart())}
                    onHome={() => session.leave(home)}>
                    <Text>{session.state.mistakes} mistakes</Text>
                </SessionResult>
            )}
            <GameVictoryConfetti visible={showVictoryConfetti} onComplete={() => setShowVictoryConfetti(false)} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, alignItems: 'center', paddingTop: 24 },
});
