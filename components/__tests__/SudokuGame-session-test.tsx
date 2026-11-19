import React from 'react';
import { act, fireEvent, render, screen } from '@testing-library/react-native';
import { AppState } from 'react-native';
import { afterEach, beforeEach, expect, it, jest } from '@jest/globals';
import { SudokuRun } from '@/components/Home/Sudoku/SudokuGame';
import type { SudokuSnapshot } from '@/components/Home/Sudoku/SudokuSession';
import type { StoredGameProps } from '@/components/Session/StoredGameSession';

let mockInput: (row: number, col: number, value: string) => void;
let mockBoard: number[][];
jest.mock('@/components/Home/Sudoku/SudokuBoard', () => ({
    __esModule: true,
    default: (props: { handleInputChange: typeof mockInput; board: number[][] }) => {
        mockInput = props.handleInputChange;
        mockBoard = props.board;
        return null;
    },
}));
jest.mock('@/components/Session/StoredGameSession', () => ({ StoredGameSession: () => null }));
jest.mock('@react-native-async-storage/async-storage', () =>
    require('@react-native-async-storage/async-storage/jest/async-storage-mock'));
jest.mock('@/hooks/useTheme', () => ({
    __esModule: true, default: () => ({ text: '#111', background: '#fff' }),
}));
jest.mock('@/components/animations', () => ({
    ShakeView: ({ children }: { children: React.ReactNode }) => children,
    GameVictoryConfetti: () => null,
}));
jest.mock('expo-router', () => {
    const React = require('react');
    return {
        useFocusEffect: (effect: () => (() => void)) => React.useEffect(effect, [effect]),
        usePreventRemove: () => () => {},
    };
});

let clock: number;
const solution = Array.from({ length: 9 }, (_, i) =>
    Array.from({ length: 9 }, (_, j) => (i * 3 + Math.floor(i / 3) + j) % 9 + 1));
const snapshot = (blanks = 2): SudokuSnapshot => {
    const board = solution.map(row => [...row]);
    for (let j = 0; j < blanks; j++) board[0][j] = 0;
    return { board, givens: board.map(row => [...row]), solution, mistakes: 0, frenzyResetAtMs: 0 };
};
const setup = async (overrides: Partial<StoredGameProps<SudokuSnapshot>> = {}, mode = 'Classic') => {
    const state = overrides.state ?? snapshot();
    const props: StoredGameProps<SudokuSnapshot> = {
        state, restored: false,
        run: { id: 'sudoku-1', revision: 0, identity: { gameId: 1, mode, difficulty: 'Easy' },
            snapshot: { version: 1, data: state, elapsedMs: 0 } },
        checkpoint: jest.fn(async () => {}),
        finalize: jest.fn(async () => {}),
        restart: jest.fn(), home: jest.fn(), openHelp: jest.fn(), ...overrides,
    };
    await render(<SudokuRun {...props} />);
    return props;
};
const start = async () => { await fireEvent.press(screen.getByRole('button', { name: 'Start' })); };
beforeEach(() => {
    jest.useFakeTimers();
    clock = 0;
    jest.spyOn(performance, 'now').mockImplementation(() => clock);
    Object.defineProperty(AppState, 'currentState', { configurable: true, value: 'active' });
    jest.spyOn(AppState, 'addEventListener').mockReturnValue({ remove: jest.fn() });
});
afterEach(() => {
    jest.restoreAllMocks();
    jest.useRealTimers();
});

it('gates ready input and counts rapid mistakes atomically, recording the fourth exactly once', async () => {
    const props = await setup();
    await act(() => { mockInput(0, 0, '9'); });
    expect(props.checkpoint).not.toHaveBeenCalled();
    await start();
    await act(() => {
        for (let i = 0; i < 6; i++) mockInput(0, 0, '9');
    });
    expect(screen.getByText('Game over')).toBeTruthy();
    expect(props.finalize).toHaveBeenCalledTimes(1);
    expect(props.finalize).toHaveBeenCalledWith('loss', [{ metric: 'mistakes', score: 4 }]);
});

it('wins after three mistakes on a correct last entry and ignores rapid post-win input', async () => {
    const props = await setup({ state: { ...snapshot(1), mistakes: 3 } });
    await start();
    clock = 2250;
    await act(() => {
        mockInput(0, 0, '1');
        mockInput(0, 0, '9');
        mockInput(0, 0, '1');
    });
    expect(props.finalize).toHaveBeenCalledTimes(1);
    expect(props.finalize).toHaveBeenCalledWith('win', [
        { metric: 'mistakes', score: 3 }, { metric: 'timeScore', score: 2 },
    ]);
    expect(screen.getByText('You won!')).toBeTruthy();
    await fireEvent.press(screen.getByRole('button', { name: 'Play again' }));
    expect(props.restart).toHaveBeenCalledTimes(1);
});

it('rejects a Frenzy move at the exact deadline before the display tick and finalizes once', async () => {
    const props = await setup({}, 'Frenzy');
    await start();
    clock = 15000;
    await act(() => { mockInput(0, 0, '1'); mockInput(0, 0, '1'); });
    expect(mockBoard[0][0]).toBe(0);
    expect(props.finalize).toHaveBeenCalledTimes(1);
    expect(props.finalize).toHaveBeenCalledWith('loss', [{ metric: 'mistakes', score: 0 }]);
});

it('resets Frenzy on correct entries, freezes on pause, and expires only after explicit resume', async () => {
    const props = await setup({}, 'Frenzy');
    await start();
    clock = 14000;
    await act(() => { mockInput(0, 0, '1'); });
    expect(screen.getByLabelText('Time remaining 0:15')).toBeTruthy();
    await fireEvent.press(screen.getByRole('button', { name: 'Pause' }));
    clock = 100000;
    await act(() => { jest.advanceTimersByTime(1000); mockInput(0, 1, '2'); });
    expect(mockBoard[0][1]).toBe(0);
    expect(props.finalize).not.toHaveBeenCalled();
    await fireEvent.press(screen.getByRole('button', { name: 'Resume' }));
    clock = 115000;
    await act(() => { jest.advanceTimersByTime(100); });
    expect(props.finalize).toHaveBeenCalledWith('loss', [{ metric: 'mistakes', score: 0 }]);
});

it('restores Daily paused with saved time and board, pauses for help, then saves before leaving', async () => {
    const state = snapshot();
    state.board[0][0] = 1;
    const props = await setup({
        state, restored: true,
        run: { id: 'daily-1', revision: 5,
            identity: { gameId: 1, mode: 'Daily Challenge', difficulty: 'Easy', dailyDate: '2026-11-18' },
            snapshot: { version: 1, data: state, elapsedMs: 32000 } },
    });
    expect(screen.getByText('Paused — resume when you are ready')).toBeTruthy();
    expect(screen.getByLabelText('Elapsed time 0:32')).toBeTruthy();
    expect(mockBoard[0][0]).toBe(1);
    await act(() => { mockInput(0, 1, '2'); });
    expect(props.finalize).not.toHaveBeenCalled();
    await fireEvent.press(screen.getByRole('button', { name: 'Resume' }));
    clock = 2000;
    await fireEvent.press(screen.getByRole('button', { name: 'How to play' }));
    expect(screen.getByText('Paused — resume when you are ready')).toBeTruthy();
    expect(props.openHelp).toHaveBeenCalledTimes(1);
    await fireEvent.press(screen.getByRole('button', { name: 'Save and leave' }));
    expect(props.checkpoint).toHaveBeenLastCalledWith(expect.objectContaining({ state, elapsedMs: 34000 }));
    expect(props.home).toHaveBeenCalledTimes(1);
});

it('keeps outcome actions disabled on finalization failure and retries the same result', async () => {
    const finalize = jest.fn<StoredGameProps<SudokuSnapshot>['finalize']>()
        .mockRejectedValueOnce(new Error('disk full')).mockResolvedValue(undefined);
    const props = await setup({ state: snapshot(1), finalize });
    await start();
    await act(() => { mockInput(0, 0, '1'); });
    await fireEvent.press(screen.getByRole('button', { name: 'Home' }));
    expect(props.home).not.toHaveBeenCalled();
    await fireEvent.press(screen.getByRole('button', { name: 'Retry' }));
    expect(finalize).toHaveBeenCalledTimes(2);
    await fireEvent.press(screen.getByRole('button', { name: 'Home' }));
    expect(props.home).toHaveBeenCalledTimes(1);
});

it('invalidates captured board input across pause and resume', async () => {
    await setup();
    await start();
    const staleInput = mockInput;
    await fireEvent.press(screen.getByRole('button', { name: 'Pause' }));
    await fireEvent.press(screen.getByRole('button', { name: 'Resume' }));
    await act(() => { staleInput(0, 0, '1'); });
    expect(mockBoard[0][0]).toBe(0);
    await act(() => { mockInput(0, 0, '1'); });
    expect(mockBoard[0][0]).toBe(1);
});

it('recovers a checkpointed Daily win after resume and does not offer replay', async () => {
    const props = await setup({ state: snapshot(0), restored: true }, 'Daily Challenge');
    expect(props.finalize).not.toHaveBeenCalled();
    await fireEvent.press(screen.getByRole('button', { name: 'Resume' }));
    expect(props.finalize).toHaveBeenCalledWith('win', [
        { metric: 'mistakes', score: 0 }, { metric: 'timeScore', score: 0 },
    ]);
    expect(screen.queryByRole('button', { name: 'Play again' })).toBeNull();
    expect(screen.getByRole('button', { name: 'Home' })).toBeTruthy();
});
