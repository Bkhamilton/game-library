import React, { useEffect } from 'react';
import { StyleSheet } from 'react-native';
import { View, Text } from '@/components/Themed';
import { SessionControls, SessionResult } from '@/components/Session';
import { StoredGameSession, type StoredGameProps } from '@/components/Session/StoredGameSession';
import { useGameSession } from '@/hooks/useGameSession';
import { getAIMove } from '@/utils/ConnectFourGenerator';
import ConnectFourBoard from './ConnectFourBoard';
import ConnectFourHeader from './ConnectFourHeader';
import { connectMove, createConnectSnapshot, isConnectSnapshot, type ConnectSnapshot } from './ConnectFourSession';

export default function ConnectFourGame() {
    return <StoredGameSession title="Connect Four" version={1} create={createConnectSnapshot} validate={isConnectSnapshot}
        instructions="Drop discs to make four in a row before the computer. Pause or leave to save your progress.">
        {props => <ConnectFourRun {...props} />}
    </StoredGameSession>;
}

export function ConnectFourRun({ run, state, restored, checkpoint, finalize, restart, home, openHelp }: StoredGameProps<ConnectSnapshot>) {
    const session = useGameSession<ConnectSnapshot, 'win' | 'loss' | 'draw'>({
        initialState: state,
        restored: restored ? { state, elapsedMs: run.snapshot.elapsedMs, revision: run.revision } : undefined,
        checkpoint,
        onTerminal: async (outcome, snapshot) => {
            await checkpoint(snapshot);
            await finalize(outcome, [
                { metric: outcome === 'win' ? 'moves' : `${outcome}Moves`, score: snapshot.state.moves },
                { metric: outcome === 'win' ? 'timeScore' : `${outcome}TimeScore`, score: Math.floor(snapshot.elapsedMs / 1000) },
            ]);
        },
    });
    const { isActive, runToken } = session;
    useEffect(() => {
        if (!isActive) return;
        const s = session.getSnapshot().state;
        if (s.outcome) { void session.finish(s.outcome, runToken); return; }
        if (s.countdown !== null) {
            const timer = setTimeout(() => session.change(previous => ({
                ...previous, countdown: previous.countdown === null || previous.countdown <= 1 ? null : previous.countdown - 1,
            }), runToken), 1000);
            return () => clearTimeout(timer);
        }
        if (s.player !== 'ai') return;
        const timer = setTimeout(() => {
            session.change(previous => {
                if (previous.player !== 'ai' || previous.outcome) return previous;
                const col = getAIMove(previous.board, run.identity.difficulty);
                return col < 0 ? { ...previous, outcome: 'draw' } : connectMove(previous, col) ?? previous;
            }, runToken);
        }, 500);
        return () => clearTimeout(timer);
    }, [isActive, runToken, session.state, run.identity.difficulty]);

    const press = (col: number) => {
        const s = session.getSnapshot().state;
        if (s.player !== 'player') return;
        const next = connectMove(s, col);
        if (next) session.change(next, runToken);
    };
    return <View style={styles.container}>
        <ConnectFourHeader score={session.state.moves} elapsedMs={session.elapsedMs} />
        <SessionControls status={session.status} isSaving={session.isSaving} error={session.error}
            onStart={session.start} onPause={session.pause} onResume={session.resume} onRetry={session.retry}
            onLeave={() => session.leave(home)} onHelp={openHelp} onRestart={() => restart()} />
        {session.state.countdown !== null && <Text>{session.state.countdown}</Text>}
        <ConnectFourBoard board={session.state.board} onColumnPress={press}
            isGameRunning={isActive && session.state.countdown === null && session.state.player === 'player' && !session.state.outcome} />
        {session.status === 'terminal' && <SessionResult
            title={session.state.outcome === 'win' ? 'You won!' : session.state.outcome === 'draw' ? 'Draw' : 'Game over'}
            disabled={!session.isTerminalSaved} onReplay={() => session.leave(() => restart())} onHome={() => session.leave(home)}>
            <Text>{session.state.moves} moves</Text>
        </SessionResult>}
    </View>;
}
const styles = StyleSheet.create({ container: { flex: 1, alignItems: 'center', paddingTop: 24 } });
