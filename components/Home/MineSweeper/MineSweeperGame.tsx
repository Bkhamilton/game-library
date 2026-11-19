import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet } from 'react-native';
import { Text, View } from '@/components/Themed';
import { GameVictoryConfetti, ShakeView } from '@/components/animations';
import { SessionControls, SessionResult } from '@/components/Session';
import { StoredGameSession, type StoredGameProps } from '@/components/Session/StoredGameSession';
import { useGameSession } from '@/hooks/useGameSession';
import { getRemainingMineCount, setSize } from '@/utils/MineSweeperGenerator';
import useTheme from '@/hooks/useTheme';
import Cell from './Cell';
import MineSweeperHeader from './MineSweeperHeader';
import { applyMineSweeperMove, createMineSweeperSnapshot, isMineSweeperSnapshot,
    mineSweeperFlags, mineSweeperOutcome, type MineSweeperSnapshot } from './MineSweeperSession';

export interface CellProps {
    isRevealed: boolean;
    isFlagged: boolean;
    isMine: boolean;
    adjacentMines: number;
}

const instructions = 'Reveal every safe cell. Tap to reveal and long press to flag a suspected mine. ' +
    'Your first reveal is safe. Pause or leave to save, and resume when you return.';

export default function MineSweeperGame() {
    return <StoredGameSession title="Minesweeper" version={1}
        create={identity => createMineSweeperSnapshot(identity.difficulty)}
        validate={isMineSweeperSnapshot} instructions={instructions}>
        {props => <MineSweeperRun {...props} />}
    </StoredGameSession>;
}

export function MineSweeperRun({ run, state, restored, checkpoint, finalize, restart, home, openHelp }: StoredGameProps<MineSweeperSnapshot>) {
    const [outcome, setOutcome] = useState<'win' | 'loss' | null>(null);
    const [confetti, setConfetti] = useState(false);
    const [shake, setShake] = useState(0);
    const terminalRequested = useRef(false);
    const { primary } = useTheme();
    const session = useGameSession<MineSweeperSnapshot, 'win' | 'loss'>({
        initialState: state,
        restored: restored ? { state, elapsedMs: run.snapshot.elapsedMs, revision: run.revision } : undefined,
        checkpoint,
        onTerminal: async (result, snapshot) => {
            await checkpoint(snapshot);
            const flags = mineSweeperFlags(snapshot.state);
            await finalize(result, [
                { metric: 'minesFlagged', score: flags.correct },
                { metric: 'mistakes', score: flags.incorrect },
                ...(result === 'win' ? [{ metric: 'timeScore', score: Math.floor(snapshot.elapsedMs / 1000) }] : []),
            ]);
        },
    });
    const finish = (result: 'win' | 'loss') => {
        if (terminalRequested.current) return;
        terminalRequested.current = true;
        setOutcome(result);
        if (result === 'win') setConfetti(true);
        else setShake(previous => previous + 1);
        void session.finish(result, session.runToken);
    };
    useEffect(() => {
        if (!session.isActive || terminalRequested.current) return;
        const result = mineSweeperOutcome(session.state);
        if (result) finish(result);
    }, [session.isActive, session.runToken, session.state]);

    const handleCellClick = (row: number, col: number, flag: boolean) => {
        if (!session.isActive || terminalRequested.current) return;
        const cell = session.getSnapshot().state.board[row]?.[col];
        if (!cell || cell.isRevealed || (!flag && cell.isFlagged)) return;
        const result: { outcome?: 'win' | 'loss' } = {};
        const accepted = session.change(previous => {
            const move = applyMineSweeperMove(previous, row, col, flag);
            result.outcome = move?.outcome;
            return move?.snapshot ?? previous;
        }, session.runToken);
        if (accepted && result.outcome) finish(result.outcome);
    };
    return <View style={styles.container}>
        <MineSweeperHeader minesCount={getRemainingMineCount(run.identity.difficulty, session.state.board)}
            elapsedMs={session.elapsedMs} />
        <SessionControls status={session.status} isSaving={session.isSaving} error={session.error}
            onStart={session.start} onPause={session.pause} onResume={session.resume}
            onRetry={session.retry} onLeave={() => session.leave(home)} onHelp={openHelp} onRestart={() => restart()} />
        <View pointerEvents={session.isActive ? 'auto' : 'none'}
            accessibilityElementsHidden={!session.isActive}
            importantForAccessibility={session.isActive ? 'auto' : 'no-hide-descendants'}>
            <ShakeView trigger={shake}>
                <View style={[styles.board, { borderColor: primary }]}>
                    {session.state.board.map((row, r) => <View key={r} style={styles.row}>
                        {row.map((cell, c) => <Cell key={`${r}-${c}`} revealed={cell.isRevealed}
                            flagged={cell.isFlagged} mine={cell.isMine} adjacentMines={cell.adjacentMines}
                            onPress={() => handleCellClick(r, c, false)}
                            onLongPress={() => handleCellClick(r, c, true)} size={setSize(run.identity.difficulty)} />)}
                    </View>)}
                </View>
            </ShakeView>
        </View>
        {session.status === 'terminal' && <SessionResult title={outcome === 'win' ? 'You won!' : 'Game over'}
            disabled={!session.isTerminalSaved} onReplay={() => session.leave(() => restart())}
            onHome={() => session.leave(home)}>
            <Text>{mineSweeperFlags(session.state).correct} correct flags</Text>
        </SessionResult>}
        <GameVictoryConfetti visible={confetti} onComplete={() => setConfetti(false)} />
    </View>;
}

const styles = StyleSheet.create({
    container: { flex: 1, alignItems: 'center', paddingTop: 24 },
    board: { borderWidth: 4 },
    row: { flexDirection: 'row' },
});
