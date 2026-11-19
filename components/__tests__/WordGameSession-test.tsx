import React from 'react';
import { act, fireEvent, render, screen } from '@testing-library/react-native';
import { Alert, AppState } from 'react-native';
import { afterEach, beforeEach, expect, it, jest } from '@jest/globals';
import { CrosswordRun } from '@/components/Home/Crossword/CrosswordGame';
import { WordSearchRun } from '@/components/Home/WordSearch/WordSearchGame';
import { applyCrosswordGuess, isCrosswordSnapshot, type CrosswordSnapshot } from '@/components/Home/Crossword/CrosswordSession';
import { isWordSearchSnapshot, selectWordSearchCell, type WordSearchSnapshot } from '@/components/Home/WordSearch/WordSearchSession';
import * as crosswordSession from '@/components/Home/Crossword/CrosswordSession';
import * as wordSearchSession from '@/components/Home/WordSearch/WordSearchSession';
import type { StoredGameProps } from '@/components/Session/StoredGameSession';

let crosswordInput: { onCellPress: (r: number, c: number) => void; onGuessSubmit: (guess: string) => void };
let searchInput: { handleCellPress: (r: number, c: number) => void; grid: WordSearchSnapshot['grid'] };
jest.mock('@/components/Home/Crossword/CrosswordGrid', () => (props: typeof crosswordInput) => {
    crosswordInput = props; return null;
});
jest.mock('@/components/Home/Crossword/CrosswordWords', () => () => null);
jest.mock('@/components/Home/WordSearch/WordSearchBoard', () => (props: typeof searchInput) => {
    searchInput = props; return null;
});
jest.mock('@/components/Home/WordSearch/WordSearchWords', () => () => null);
jest.mock('@/components/Session/StoredGameSession', () => ({ StoredGameSession: () => null }));
jest.mock('@/hooks/useTheme', () => ({ __esModule: true, default: () => ({ text: '#111', background: '#fff' }) }));
jest.mock('expo-router', () => {
    const React = require('react');
    return { useFocusEffect: (effect: () => () => void) => React.useEffect(effect, [effect]),
        usePreventRemove: () => () => {} };
});

const crossword = (): CrosswordSnapshot => ({
    grid: [['C', 'A', 'T'], ['', '', ''], ['', '', '']],
    placedWords: [{ word: 'CAT', clue: 'A cat', startPosition: { row: 0, col: 0, direction: 'horizontal' } }],
    guessedWords: [], wrongCount: 0, hintsUsed: 0, level: 1, score: 0, correctWords: 0, stopped: false,
});
const search = (): WordSearchSnapshot => ({
    grid: ['CAT', 'DOG', 'RAT'].map(row => [...row].map(letter => ({
        letter, selected: false, partOfWord: true, isFound: false, partOfFoundWord: false,
    }))),
    wordBank: ['CAT', 'DOG'], foundWords: [], wordColors: {}, hintsUsed: 0, level: 1, score: 0, wordsFound: 0, stopped: false,
});
const propsFor = <T,>(state: T, mode = 'Classic', restored = false): StoredGameProps<T> => ({
    state, restored,
    run: { id: 'run', revision: 3, identity: { gameId: 1, mode, difficulty: 'Easy' },
        snapshot: { version: 1, data: state, elapsedMs: restored ? 32000 : 0 } },
    checkpoint: jest.fn(async () => {}), finalize: jest.fn(async () => {}),
    restart: jest.fn(), home: jest.fn(), openHelp: jest.fn(),
});
beforeEach(() => {
    jest.useFakeTimers();
    Object.defineProperty(AppState, 'currentState', { configurable: true, value: 'active' });
    jest.spyOn(AppState, 'addEventListener').mockReturnValue({ remove: jest.fn() });
});
afterEach(() => { jest.restoreAllMocks(); jest.useRealTimers(); });

it('validates exact stored content and rejects invalid or duplicate progress', () => {
    const c = crossword();
    expect(isCrosswordSnapshot(JSON.parse(JSON.stringify(c)))).toBe(true);
    expect(isCrosswordSnapshot({ ...c, grid: [['X']] })).toBe(false);
    expect(applyCrosswordGuess(c, 0, 'wrong')?.wrongCount).toBe(1);
    const found = applyCrosswordGuess(c, 0, 'cat')!;
    expect(applyCrosswordGuess(found, 0, 'CAT')).toBeNull();
    const s = search();
    expect(isWordSearchSnapshot(JSON.parse(JSON.stringify(s)))).toBe(true);
    expect(isWordSearchSnapshot({ ...s, wordBank: ['NOTONBOARD'] })).toBe(false);
    const partial = selectWordSearchCell(s, 0, 0)!;
    expect(s.grid[0][0].selected).toBe(false);
    expect(partial.grid[0][0].selected).toBe(true);
});

it('restores word search paused, saves selected letters, and records a classic win once', async () => {
    const state = search();
    state.grid[0][0].selected = true;
    const props = propsFor(state, 'Classic', true);
    await render(<WordSearchRun {...props} />);
    expect(screen.getByText('Paused — resume when you are ready')).toBeTruthy();
    expect(screen.getByLabelText('Elapsed time 0:32')).toBeTruthy();
    await act(() => searchInput.handleCellPress(0, 1));
    expect(searchInput.grid[0][1].selected).toBe(false);
    await fireEvent.press(screen.getByRole('button', { name: 'Resume' }));
    await act(() => { searchInput.handleCellPress(0, 1); searchInput.handleCellPress(0, 2); });
    await act(() => { searchInput.handleCellPress(1, 0); searchInput.handleCellPress(1, 1); searchInput.handleCellPress(1, 2); });
    expect(props.finalize).toHaveBeenCalledTimes(1);
    expect(props.finalize).toHaveBeenCalledWith('win', expect.arrayContaining([
        { metric: 'wordsFound', score: 2 }, { metric: 'hintsUsed', score: 0 },
    ]));
});

it('crossword counts only valid new answers and fourth wrong answer ends once', async () => {
    const props = propsFor({ ...crossword(), wrongCount: 3 });
    await render(<CrosswordRun {...props} />);
    await fireEvent.press(screen.getByRole('button', { name: 'Start' }));
    await act(() => crosswordInput.onCellPress(0, 0));
    await act(() => { crosswordInput.onGuessSubmit('wrong'); crosswordInput.onGuessSubmit('wrong'); });
    expect(props.finalize).toHaveBeenCalledTimes(1);
    expect(props.finalize).toHaveBeenCalledWith('loss', expect.arrayContaining([{ metric: 'correctWords', score: 0 }]));
});

it('records a crossword win with its last answer and saved active time', async () => {
    const props = propsFor({ ...crossword(), wrongCount: 3 }, 'Classic', true);
    await render(<CrosswordRun {...props} />);
    expect(screen.getByText('Paused — resume when you are ready')).toBeTruthy();
    await fireEvent.press(screen.getByRole('button', { name: 'Resume' }));
    await act(() => crosswordInput.onCellPress(0, 0));
    await act(() => { crosswordInput.onGuessSubmit('cat'); crosswordInput.onGuessSubmit('bad'); });
    expect(props.finalize).toHaveBeenCalledTimes(1);
    expect(props.finalize).toHaveBeenCalledWith('win', expect.arrayContaining([
        { metric: 'correctWords', score: 1 }, { metric: 'timeScore', score: 32 },
    ]));
});

it('saves partial word selection before leaving and rejects input captured before pause', async () => {
    const props = propsFor(search());
    await render(<WordSearchRun {...props} />);
    await fireEvent.press(screen.getByRole('button', { name: 'Start' }));
    const stale = searchInput.handleCellPress;
    await act(() => stale(0, 0));
    await fireEvent.press(screen.getByRole('button', { name: 'Pause' }));
    await fireEvent.press(screen.getByRole('button', { name: 'Resume' }));
    await act(() => stale(0, 1));
    expect(searchInput.grid[0][1].selected).toBe(false);
    await fireEvent.press(screen.getByRole('button', { name: 'Save and leave' }));
    expect(props.checkpoint).toHaveBeenLastCalledWith(expect.objectContaining({
        state: expect.objectContaining({ grid: expect.arrayContaining([
            expect.arrayContaining([expect.objectContaining({ letter: 'C', selected: true })]),
        ]) }),
    }));
    expect(props.home).toHaveBeenCalledTimes(1);
});

it('stopping an endless run is distinct from a win and saves metrics', async () => {
    const props = propsFor({ ...search(), level: 3, score: 300, wordsFound: 10 }, 'Endless');
    await render(<WordSearchRun {...props} />);
    await fireEvent.press(screen.getByRole('button', { name: 'Start' }));
    await fireEvent.press(screen.getByRole('button', { name: 'Stop' }));
    expect(screen.getByText('Run stopped')).toBeTruthy();
    expect(props.checkpoint).toHaveBeenLastCalledWith(expect.objectContaining({
        state: expect.objectContaining({ stopped: true }),
    }));
    expect((props.checkpoint as jest.Mock).mock.invocationCallOrder.at(-1))
        .toBeLessThan((props.finalize as jest.Mock).mock.invocationCallOrder[0]);
    expect(props.finalize).toHaveBeenCalledWith('stopped', expect.arrayContaining([
        { metric: 'endlessLevel', score: 3 }, { metric: 'endlessScore', score: 300 }, { metric: 'endlessWordsFound', score: 10 },
    ]));
});

it.each(['crossword', 'search'])('recovers a checkpointed %s stop before accepting gameplay', async game => {
    if (game === 'crossword') {
        const props = propsFor({ ...crossword(), stopped: true, level: 2, score: 100 }, 'Endless', true);
        await render(<CrosswordRun {...props} />);
        expect(props.finalize).not.toHaveBeenCalled();
        expect(screen.queryByRole('button', { name: 'Restart' })).toBeNull();
        await fireEvent.press(screen.getByRole('button', { name: 'Resume' }));
        expect(props.finalize).toHaveBeenCalledWith('stopped', expect.arrayContaining([
            { metric: 'endlessLevel', score: 2 }, { metric: 'endlessScore', score: 100 },
        ]));
    } else {
        const props = propsFor({ ...search(), stopped: true, level: 2, score: 100 }, 'Endless', true);
        await render(<WordSearchRun {...props} />);
        expect(props.finalize).not.toHaveBeenCalled();
        expect(screen.queryByRole('button', { name: 'Restart' })).toBeNull();
        await fireEvent.press(screen.getByRole('button', { name: 'Resume' }));
        expect(props.finalize).toHaveBeenCalledWith('stopped', expect.arrayContaining([
            { metric: 'endlessLevel', score: 2 }, { metric: 'endlessScore', score: 100 },
        ]));
    }
    expect(screen.getByText('Run stopped')).toBeTruthy();
});

it('offers a restart through the shared controls', async () => {
    const props = propsFor(search());
    await render(<WordSearchRun {...props} />);
    await fireEvent.press(screen.getByRole('button', { name: 'Restart' }));
    expect(props.restart).toHaveBeenCalledTimes(1);
});

it('generates restorable word searches at each difficulty', () => {
    for (const difficulty of ['Easy', 'Medium', 'Hard']) {
        const state = wordSearchSession.createWordSearchSnapshot(difficulty);
        expect(isWordSearchSnapshot(JSON.parse(JSON.stringify(state)))).toBe(true);
    }
});

it('generates bounded restorable crosswords without modifying the source word bank', () => {
    const words = require('@/data/wordsList.json') as string[];
    const length = words.length;
    for (const difficulty of ['Easy', 'Medium', 'Hard']) {
        const state = crosswordSession.createCrosswordSnapshot(difficulty);
        expect(isCrosswordSnapshot(JSON.parse(JSON.stringify(state)))).toBe(true);
    }
    expect(words).toHaveLength(length);
});

it('advances a completed word search in one checkpoint, ignoring duplicate old-level input', async () => {
    const state = { ...search(), wordBank: ['CAT'] };
    const advance = jest.spyOn(wordSearchSession, 'nextWordSearchLevel').mockImplementation(previous => ({
        ...search(), level: previous.level + 1, score: previous.score + 100 * previous.level,
        wordsFound: previous.wordsFound,
    }));
    const props = propsFor(state, 'Endless');
    await render(<WordSearchRun {...props} />);
    await fireEvent.press(screen.getByRole('button', { name: 'Start' }));
    await act(() => {
        searchInput.handleCellPress(0, 0); searchInput.handleCellPress(0, 1);
        searchInput.handleCellPress(0, 2); searchInput.handleCellPress(0, 2);
    });
    expect(advance).toHaveBeenCalledTimes(1);
    expect(props.checkpoint).toHaveBeenLastCalledWith(expect.objectContaining({
        state: expect.objectContaining({ level: 2, score: 100, wordsFound: 1, foundWords: [] }),
    }));
    expect(props.finalize).not.toHaveBeenCalled();
});

it('retains the old level and allows retry if next-level generation fails', async () => {
    const state = { ...search(), wordBank: ['CAT'] };
    const advance = jest.spyOn(wordSearchSession, 'nextWordSearchLevel')
        .mockImplementationOnce(() => { throw new Error('generation failed'); })
        .mockImplementation(previous => ({ ...search(), level: previous.level + 1,
            score: previous.score + 100, wordsFound: previous.wordsFound }));
    const alert = jest.spyOn(Alert, 'alert').mockImplementation(() => {});
    const props = propsFor(state, 'Endless');
    await render(<WordSearchRun {...props} />);
    await fireEvent.press(screen.getByRole('button', { name: 'Start' }));
    await act(() => {
        searchInput.handleCellPress(0, 0); searchInput.handleCellPress(0, 1); searchInput.handleCellPress(0, 2);
    });
    expect(alert).toHaveBeenCalledTimes(1);
    expect(searchInput.grid[0][2].selected).toBe(false);
    await act(() => searchInput.handleCellPress(0, 2));
    expect(advance).toHaveBeenCalledTimes(2);
    expect(props.checkpoint).toHaveBeenLastCalledWith(expect.objectContaining({
        state: expect.objectContaining({ level: 2, score: 100 }),
    }));
});

it('advances crossword once with score and board together and stops without a win', async () => {
    const advance = jest.spyOn(crosswordSession, 'nextCrosswordLevel').mockImplementation(previous => ({
        ...crossword(), level: previous.level + 1, score: previous.score + 100 * previous.level,
        correctWords: previous.correctWords,
    }));
    const props = propsFor(crossword(), 'Endless');
    await render(<CrosswordRun {...props} />);
    await fireEvent.press(screen.getByRole('button', { name: 'Start' }));
    await act(() => crosswordInput.onCellPress(0, 0));
    await act(() => { crosswordInput.onGuessSubmit('cat'); crosswordInput.onGuessSubmit('cat'); });
    expect(advance).toHaveBeenCalledTimes(1);
    expect(props.checkpoint).toHaveBeenLastCalledWith(expect.objectContaining({
        state: expect.objectContaining({ level: 2, score: 100, correctWords: 1, guessedWords: [] }),
    }));
    await fireEvent.press(screen.getByRole('button', { name: 'Stop' }));
    expect(props.finalize).toHaveBeenCalledWith('stopped', expect.arrayContaining([
        { metric: 'endlessLevel', score: 2 }, { metric: 'endlessScore', score: 100 },
    ]));
});
