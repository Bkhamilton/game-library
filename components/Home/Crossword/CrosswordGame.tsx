import React, { useEffect, useRef, useState } from 'react';
import { Alert, Button, StyleSheet } from 'react-native';
import { Text, View } from '@/components/Themed';
import { SessionControls, SessionResult } from '@/components/Session';
import { StoredGameSession, type StoredGameProps } from '@/components/Session/StoredGameSession';
import { useGameSession } from '@/hooks/useGameSession';
import GameHeader from '../GameHeader/GameHeader';
import CrosswordGrid from './CrosswordGrid';
import CrosswordWords from './CrosswordWords';
import { applyCrosswordGuess, createCrosswordSnapshot, isCrosswordSnapshot, nextCrosswordLevel,
    type CrosswordSnapshot, type PlacedWord } from './CrosswordSession';

const instructions = 'Select a clue or a cell, then enter the answer. Four incorrect guesses end the run. ' +
    'Complete levels for points in Endless, or stop to record your progress. Pause or leave to save.';

export default function CrosswordGame() {
    return <StoredGameSession title="Crossword" version={1}
        create={identity => createCrosswordSnapshot(identity.difficulty)}
        validate={isCrosswordSnapshot} instructions={instructions}>
        {props => <CrosswordRun {...props} />}
    </StoredGameSession>;
}

export function CrosswordRun({ run, state, restored, checkpoint, finalize, restart, home, openHelp }: StoredGameProps<CrosswordSnapshot>) {
    const { mode, difficulty } = run.identity;
    const [active, setActive] = useState<{ index: number; row: number; col: number } | null>(null);
    const [outcome, setOutcome] = useState<'win' | 'loss' | 'stopped' | null>(null);
    const terminal = useRef(false);
    const session = useGameSession<CrosswordSnapshot, 'win' | 'loss' | 'stopped'>({
        initialState: state,
        restored: restored ? { state, elapsedMs: run.snapshot.elapsedMs, revision: run.revision } : undefined,
        checkpoint,
        onTerminal: async (result, snapshot) => {
            await checkpoint(snapshot);
            await finalize(result, mode === 'Endless' ? [
                { metric: 'endlessLevel', score: snapshot.state.level },
                { metric: 'endlessScore', score: snapshot.state.score },
                { metric: 'endlessCorrectWords', score: snapshot.state.correctWords },
                { metric: 'endlessHintsUsed', score: snapshot.state.hintsUsed },
            ] : [
                { metric: 'correctWords', score: snapshot.state.correctWords },
                { metric: 'hintsUsed', score: snapshot.state.hintsUsed },
                ...(result === 'win' ? [{ metric: 'timeScore', score: Math.floor(snapshot.elapsedMs / 1000) }] : []),
            ]);
        },
    });
    const finish = (result: 'win' | 'loss' | 'stopped') => {
        if (terminal.current) return;
        terminal.current = true;
        setOutcome(result);
        void session.finish(result, session.runToken);
    };
    useEffect(() => {
        if (!session.isActive) { setActive(null); return; }
        if (session.state.stopped) finish('stopped');
        else if (session.state.wrongCount >= 4) finish('loss');
        else if (session.state.guessedWords.length === session.state.placedWords.length) {
            if (mode === 'Endless') {
                try {
                    session.change(previous => previous.guessedWords.length === previous.placedWords.length
                        ? nextCrosswordLevel(previous, difficulty) : previous, session.runToken);
                } catch {
                    Alert.alert('Could not generate the next level', 'Your progress is safe. Pause and resume to retry.');
                }
            }
            else finish('win');
        }
    }, [session.isActive, session.state, session.runToken, mode, difficulty]);

    const choose = (index: number, row: number, col: number) => {
        if (session.isActive && !terminal.current && !session.getSnapshot().state.stopped) setActive({ index, row, col });
    };
    const cellPress = (row: number, col: number) => {
        const index = session.getSnapshot().state.placedWords.findIndex(word => {
            const p = word.startPosition;
            return !session.getSnapshot().state.guessedWords.includes(word.word) &&
                (p.direction === 'horizontal' ? row === p.row && col >= p.col && col < p.col + word.word.length :
                    col === p.col && row >= p.row && row < p.row + word.word.length);
        });
        if (index >= 0) choose(index, row, col);
    };
    const submit = (guess: string) => {
        if (!active || terminal.current) return;
        let result: 'win' | 'loss' | undefined;
        let accepted: boolean;
        try {
            accepted = session.change(previous => {
                if (previous.stopped || previous.level !== session.state.level) return previous;
                const next = applyCrosswordGuess(previous, active.index, guess);
                if (!next) return previous;
                if (next.wrongCount >= 4) result = 'loss';
                else if (next.guessedWords.length === next.placedWords.length) {
                    if (mode === 'Endless') return nextCrosswordLevel(next, difficulty);
                    result = 'win';
                }
                return next;
            }, session.runToken);
        } catch {
            Alert.alert('Could not generate the next level', 'Your progress is safe. Submit the answer again to retry.');
            return;
        }
        setActive(null);
        if (accepted && result) finish(result);
    };
    const seconds = Math.floor(session.elapsedMs / 1000);
    const clock = `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, '0')}`;
    const guessed = session.state.placedWords.filter(word => session.state.guessedWords.includes(word.word));
    return <View style={styles.container}>
        <GameHeader leftContent={<Text>{session.state.wrongCount}/4</Text>}
            centerContent={<Text accessibilityLabel={`Elapsed time ${clock}`}>{clock}</Text>}
            rightContent={<Text>{guessed.length}/{session.state.placedWords.length}</Text>} />
        {mode === 'Endless' && <Text>Level {session.state.level} · Score {session.state.score}</Text>}
        <SessionControls status={session.status} isSaving={session.isSaving} error={session.error}
            onStart={session.start} onPause={session.pause} onResume={session.resume} onRetry={session.retry}
            onLeave={() => session.leave(home)} onHelp={openHelp}
            onRestart={session.state.stopped ? undefined : () => restart()} />
        {mode === 'Endless' && session.isActive && <Button title="Stop" onPress={() => {
            if (session.change(previous => ({ ...previous, stopped: true }), session.runToken)) finish('stopped');
        }} />}
        {session.isActive && <View style={styles.game}>
            <CrosswordGrid key={session.runToken} grid={session.state.grid} placedWords={session.state.placedWords}
                guessedWords={guessed} activeCell={active} onCellPress={cellPress} onGuessSubmit={submit} />
            <CrosswordWords wordsToFind={session.state.placedWords} guessedWords={guessed}
                onCluePress={(word: PlacedWord) => choose(session.state.placedWords.indexOf(word),
                    word.startPosition.row, word.startPosition.col)} />
        </View>}
        {session.status === 'terminal' && <SessionResult
            title={outcome === 'win' ? 'You won!' : outcome === 'stopped' ? 'Run stopped' : 'Game over'}
            disabled={!session.isTerminalSaved} onReplay={() => session.leave(() => restart())}
            onHome={() => session.leave(home)}>
            <Text>{session.state.correctWords} correct words</Text>
            {mode === 'Endless' && <Text>Level {session.state.level} · Score {session.state.score}</Text>}
        </SessionResult>}
    </View>;
}

const styles = StyleSheet.create({
    container: { flex: 1, alignItems: 'center', paddingTop: 24 },
    game: { flex: 1, width: '100%', alignItems: 'center' },
});
