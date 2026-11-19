import React, { useEffect, useRef, useState } from 'react';
import { Alert, Button, StyleSheet } from 'react-native';
import { Text, View } from '@/components/Themed';
import { SessionControls, SessionResult } from '@/components/Session';
import { StoredGameSession, type StoredGameProps } from '@/components/Session/StoredGameSession';
import { useGameSession } from '@/hooks/useGameSession';
import GameHeader from '../GameHeader/GameHeader';
import WordSearchBoard from './WordSearchBoard';
import WordSearchWords from './WordSearchWords';
import { createWordSearchSnapshot, isWordSearchSnapshot, nextWordSearchLevel, selectWordSearchCell,
    type WordSearchSnapshot } from './WordSearchSession';

const instructions = 'Select adjacent letters to find each word. Complete levels for points in Endless, ' +
    'or stop to record your progress. Pause or leave to save your run.';

export default function WordSearchGame() {
    return <StoredGameSession title="Word Search" version={1}
        create={identity => createWordSearchSnapshot(identity.difficulty)}
        validate={isWordSearchSnapshot} instructions={instructions}>
        {props => <WordSearchRun {...props} />}
    </StoredGameSession>;
}

export function WordSearchRun({ run, state, restored, checkpoint, finalize, restart, home, openHelp }: StoredGameProps<WordSearchSnapshot>) {
    const { mode, difficulty } = run.identity;
    const [outcome, setOutcome] = useState<'win' | 'stopped' | null>(null);
    const terminal = useRef(false);
    const session = useGameSession<WordSearchSnapshot, 'win' | 'stopped'>({
        initialState: state,
        restored: restored ? { state, elapsedMs: run.snapshot.elapsedMs, revision: run.revision } : undefined,
        checkpoint,
        onTerminal: async (result, snapshot) => {
            await checkpoint(snapshot);
            await finalize(result, mode === 'Endless' ? [
                { metric: 'endlessLevel', score: snapshot.state.level },
                { metric: 'endlessScore', score: snapshot.state.score },
                { metric: 'endlessWordsFound', score: snapshot.state.wordsFound },
                { metric: 'endlessHintsUsed', score: snapshot.state.hintsUsed },
            ] : [
                { metric: 'wordsFound', score: snapshot.state.wordsFound },
                { metric: 'hintsUsed', score: snapshot.state.hintsUsed },
                { metric: 'timeScore', score: Math.floor(snapshot.elapsedMs / 1000) },
            ]);
        },
    });
    const finish = (result: 'win' | 'stopped') => {
        if (terminal.current) return;
        terminal.current = true;
        setOutcome(result);
        void session.finish(result, session.runToken);
    };
    useEffect(() => {
        if (!session.isActive) return;
        if (session.state.stopped) { finish('stopped'); return; }
        if (session.state.foundWords.length !== session.state.wordBank.length) return;
        if (mode === 'Endless') {
            try {
                session.change(previous => previous.foundWords.length === previous.wordBank.length
                    ? nextWordSearchLevel(previous, difficulty) : previous, session.runToken);
            } catch {
                Alert.alert('Could not generate the next level', 'Your progress is safe. Pause and resume to retry.');
            }
        }
        else finish('win');
    }, [session.isActive, session.state, session.runToken, mode, difficulty]);
    const select = (row: number, col: number) => {
        if (terminal.current) return;
        let won = false;
        let accepted: boolean;
        try {
            accepted = session.change(previous => {
                if (previous.stopped || previous.level !== session.state.level) return previous;
                const next = selectWordSearchCell(previous, row, col);
                if (!next) return previous;
                if (next.foundWords.length === next.wordBank.length) {
                    if (mode === 'Endless') return nextWordSearchLevel(next, difficulty);
                    won = true;
                }
                return next;
            }, session.runToken);
        } catch {
            Alert.alert('Could not generate the next level', 'Your progress is safe. Select the last letter again to retry.');
            return;
        }
        if (accepted && won) finish('win');
    };
    const seconds = Math.floor(session.elapsedMs / 1000);
    const clock = `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, '0')}`;
    return <View style={styles.container}>
        <GameHeader centerContent={<Text accessibilityLabel={`Elapsed time ${clock}`}>{clock}</Text>}
            rightContent={<Text>{session.state.foundWords.length}/{session.state.wordBank.length}</Text>} />
        {mode === 'Endless' && <Text>Level {session.state.level} · Score {session.state.score}</Text>}
        <SessionControls status={session.status} isSaving={session.isSaving} error={session.error}
            onStart={session.start} onPause={session.pause} onResume={session.resume} onRetry={session.retry}
            onLeave={() => session.leave(home)} onHelp={openHelp}
            onRestart={session.state.stopped ? undefined : () => restart()} />
        {mode === 'Endless' && session.isActive && <Button title="Stop" onPress={() => {
            if (session.change(previous => ({ ...previous, stopped: true }), session.runToken)) finish('stopped');
        }} />}
        <View pointerEvents={session.isActive ? 'auto' : 'none'} accessibilityElementsHidden={!session.isActive}
            importantForAccessibility={session.isActive ? 'auto' : 'no-hide-descendants'}>
            <WordSearchBoard key={session.runToken} grid={session.state.grid} handleCellPress={select} />
            <WordSearchWords wordBank={session.state.wordBank} foundWords={session.state.foundWords}
                wordColors={session.state.wordColors} />
        </View>
        {session.status === 'terminal' && <SessionResult title={outcome === 'win' ? 'You won!' : 'Run stopped'}
            disabled={!session.isTerminalSaved} onReplay={() => session.leave(() => restart())}
            onHome={() => session.leave(home)}>
            <Text>{session.state.wordsFound} words found</Text>
            {mode === 'Endless' && <Text>Level {session.state.level} · Score {session.state.score}</Text>}
        </SessionResult>}
    </View>;
}

const styles = StyleSheet.create({ container: { flex: 1, alignItems: 'center', paddingTop: 24 } });
