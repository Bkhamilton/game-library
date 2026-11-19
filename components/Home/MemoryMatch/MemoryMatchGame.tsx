import React, { useEffect } from 'react';
import { StyleSheet } from 'react-native';
import { Text, View } from '@/components/Themed';
import { SessionControls, SessionResult } from '@/components/Session';
import { StoredGameSession, type StoredGameProps } from '@/components/Session/StoredGameSession';
import { useGameSession } from '@/hooks/useGameSession';
import { getBoardSize, getMaxIncorrectGuesses } from '@/utils/MemoryMatchGenerator';
import MemoryMatchBoard from './MemoryMatchBoard';
import MemoryMatchHeader from './MemoryMatchHeader';
import { createMemorySnapshot, isMemorySnapshot, resolveMemoryPair, type MemorySnapshot } from './MemoryMatchSession';

export default function MemoryMatchGame() {
    return <StoredGameSession title="Memory Match" version={1}
        create={identity => createMemorySnapshot(identity.difficulty)} validate={isMemorySnapshot}
        instructions="Find every matching pair before reaching the incorrect guess limit. Pause or leave to save your progress.">
        {props => <MemoryMatchRun {...props} />}
    </StoredGameSession>;
}

export function MemoryMatchRun({ run, state, restored, checkpoint, finalize, restart, home, openHelp }: StoredGameProps<MemorySnapshot>) {
    const difficulty = run.identity.difficulty;
    const limit = getMaxIncorrectGuesses(difficulty);
    const size = getBoardSize(difficulty);
    const session = useGameSession<MemorySnapshot, 'win' | 'loss'>({
        initialState: state,
        restored: restored ? { state, elapsedMs: run.snapshot.elapsedMs, revision: run.revision } : undefined,
        checkpoint,
        onTerminal: async (outcome, snapshot) => {
            await checkpoint(snapshot);
            await finalize(outcome, [
                { metric: 'totalScore', score: snapshot.state.matches },
                { metric: 'mistakes', score: snapshot.state.mistakes },
                ...(outcome === 'win' ? [{ metric: 'timeScore', score: Math.floor(snapshot.elapsedMs / 1000) }] : []),
            ]);
        },
    });
    const { isActive, runToken } = session;
    useEffect(() => {
        if (!isActive) return;
        const s = session.getSnapshot().state;
        if (s.outcome) { void session.finish(s.outcome, runToken); return; }
        if (s.phase !== 'preview' && s.flipped.length !== 2) return;
        const delay = s.phase === 'preview' ? 1500 :
            s.cards[s.flipped[0]].value === s.cards[s.flipped[1]].value ? 600 : 1000;
        const timer = setTimeout(() => {
            session.change(previous => previous.phase === 'preview'
                ? { ...previous, phase: 'play', cards: previous.cards.map(card => ({ ...card, isFlipped: false })) }
                : resolveMemoryPair(previous, limit), runToken);
        }, delay);
        return () => clearTimeout(timer);
    }, [isActive, runToken, session.state, limit]);

    const press = (index: number) => {
        const s = session.getSnapshot().state;
        if (s.outcome || s.phase !== 'play' || s.flipped.length >= 2 ||
            !s.cards[index] || s.cards[index].isFlipped || s.cards[index].isMatched) return;
        session.change({ ...s, cards: s.cards.map((card, i) => i === index ? { ...card, isFlipped: true } : card),
            flipped: [...s.flipped, index] }, runToken);
    };
    return <View style={styles.container}>
        <MemoryMatchHeader incorrectGuesses={session.state.mistakes} maxIncorrectGuesses={limit}
            matches={session.state.matches} totalPairs={size.rows * size.cols / 2} elapsedMs={session.elapsedMs} />
        <SessionControls status={session.status} isSaving={session.isSaving} error={session.error}
            onStart={session.start} onPause={session.pause} onResume={session.resume} onRetry={session.retry}
            onLeave={() => session.leave(home)} onHelp={openHelp} onRestart={() => restart()} />
        <View pointerEvents={isActive ? 'auto' : 'none'} accessibilityElementsHidden={!isActive}
            importantForAccessibility={isActive ? 'auto' : 'no-hide-descendants'}>
            <MemoryMatchBoard cards={session.state.cards} onCardPress={press} difficulty={difficulty} />
        </View>
        {session.status === 'terminal' && <SessionResult title={session.state.outcome === 'win' ? 'You won!' : 'Game over'}
            disabled={!session.isTerminalSaved} onReplay={() => session.leave(() => restart())} onHome={() => session.leave(home)}>
            <Text>{session.state.matches} pairs matched</Text>
        </SessionResult>}
    </View>;
}
const styles = StyleSheet.create({ container: { flex: 1, alignItems: 'center', paddingTop: 24 } });
