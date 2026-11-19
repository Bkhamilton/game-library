import React from 'react';
import { act, fireEvent, render, screen } from '@testing-library/react-native';
import { AppState } from 'react-native';
import { afterEach, beforeEach, expect, it, jest } from '@jest/globals';
import { MineSweeperRun } from '@/components/Home/MineSweeper/MineSweeperGame';
import { TwoZeroFourEightRun } from '@/components/Home/TwoZeroFourEight/TwoZeroFourEightGame';
import { createMineSweeperSnapshot, type MineSweeperSnapshot } from '@/components/Home/MineSweeper/MineSweeperSession';
import type { TileSnapshot } from '@/components/Home/TwoZeroFourEight/TwoZeroFourEightSession';
import type { StoredGameProps } from '@/components/Session/StoredGameSession';
import { initializeBoard } from '@/utils/MineSweeperGenerator';

let mockCells: { onPress: () => void; onLongPress: () => void }[] = [];
let mockBoard: TileSnapshot['board'];
jest.mock('@/components/Home/MineSweeper/Cell', () => ({
    __esModule: true, default: (props: { onPress: () => void; onLongPress: () => void }) => {
        mockCells.push(props);
        return null;
    },
}));
jest.mock('@/components/Home/TwoZeroFourEight/TwoZeroFourEightBoard', () => ({
    __esModule: true, default: (props: { board: TileSnapshot['board'] }) => { mockBoard = props.board; return null; },
}));
jest.mock('@/components/Session/StoredGameSession', () => ({ StoredGameSession: () => null }));
jest.mock('expo-sqlite', () => ({ useSQLiteContext: () => ({ getFirstAsync: async () => ({ score: 0 }) }) }));
jest.mock('@react-native-async-storage/async-storage', () =>
    require('@react-native-async-storage/async-storage/jest/async-storage-mock'));
jest.mock('@/hooks/useTheme', () => ({
    __esModule: true, default: () => ({ text: '#111', background: '#fff', primary: '#333' }),
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
let mockAppChange: (state: string) => void;
function props<T>(state: T, restored = false): StoredGameProps<T> {
    return {
        state, restored,
        run: { id: 'run', revision: 3, identity: { gameId: 1, mode: 'Classic', difficulty: 'Easy' },
            snapshot: { version: 1, data: state, elapsedMs: restored ? 32000 : 0 } },
        checkpoint: jest.fn(async () => {}), finalize: jest.fn(async () => {}),
        restart: jest.fn(), home: jest.fn(), openHelp: jest.fn(),
    };
}
const tileState = (): TileSnapshot => ({ difficulty: 'Medium', score: 100, moves: 7, board: [
    [1024, 1024, null, null], [2, 4, 2, 4], [4, 2, 4, 2], [2, 4, 2, 4],
] });
beforeEach(() => {
    mockCells = [];
    jest.useFakeTimers();
    clock = 0;
    jest.spyOn(performance, 'now').mockImplementation(() => clock);
    Object.defineProperty(AppState, 'currentState', { configurable: true, value: 'active' });
    jest.spyOn(AppState, 'addEventListener').mockImplementation((event, listener) => {
        if (event === 'change') mockAppChange = listener as (state: string) => void;
        return { remove: jest.fn() };
    });
});
afterEach(() => { jest.restoreAllMocks(); jest.useRealTimers(); });

it('restores mines paused, rejects stale input and saves active elapsed time before leaving', async () => {
    const state = createMineSweeperSnapshot('Easy');
    const p = props(state, true);
    await render(<MineSweeperRun {...p} />);
    expect(screen.getByLabelText('Elapsed time 0:32')).toBeTruthy();
    const stale = mockCells[0].onLongPress;
    await act(() => stale());
    expect(p.checkpoint).not.toHaveBeenCalled();
    await fireEvent.press(screen.getByRole('button', { name: 'Resume' }));
    await act(() => stale());
    expect(p.checkpoint).toHaveBeenCalledTimes(1);
    const current = mockCells.slice(-64)[0].onLongPress;
    await act(() => current());
    clock = 2000;
    await fireEvent.press(screen.getByRole('button', { name: 'Save and leave' }));
    expect(p.checkpoint).toHaveBeenLastCalledWith(expect.objectContaining({
        elapsedMs: 34000, state: expect.objectContaining({ firstMoveMade: false }),
    }));
    expect(p.home).toHaveBeenCalledTimes(1);
    const saved = (p.checkpoint as jest.Mock).mock.calls.at(-1)![0] as { state: MineSweeperSnapshot };
    expect(saved.state.board[0][0].isFlagged).toBe(true);
});

it('records the final mine reveal exactly once with saved flag metrics', async () => {
    const board = initializeBoard('Easy');
    const mine = board.flat().find(cell => cell.isMine)!;
    mine.isFlagged = true;
    const safe = board.flat().filter(cell => !cell.isMine);
    safe.slice(1).forEach(cell => { cell.isRevealed = true; });
    const last = safe[0];
    const state: MineSweeperSnapshot = { difficulty: 'Easy', board, firstMoveMade: true };
    const p = props(state);
    await render(<MineSweeperRun {...p} />);
    await fireEvent.press(screen.getByRole('button', { name: 'Start' }));
    const click = mockCells.slice(-64)[last.row * 8 + last.col].onPress;
    clock = 2200;
    await act(() => { click(); click(); });
    expect(p.finalize).toHaveBeenCalledTimes(1);
    expect(p.finalize).toHaveBeenCalledWith('win', [
        { metric: 'minesFlagged', score: 1 }, { metric: 'mistakes', score: 0 }, { metric: 'timeScore', score: 2 },
    ]);
    expect(screen.getByText('You won!')).toBeTruthy();
});

it('restores 2048 paused and finalizes the final board and score once; retries failed persistence', async () => {
    const p = props(tileState(), true);
    p.run.identity.difficulty = 'Medium';
    const finalize = jest.fn<StoredGameProps<TileSnapshot>['finalize']>()
        .mockRejectedValueOnce(new Error('disk full')).mockResolvedValue(undefined);
    p.finalize = finalize;
    await render(<TwoZeroFourEightRun {...p} />);
    expect(screen.getByLabelText('Elapsed time 0:32')).toBeTruthy();
    expect(mockBoard[0][0]).toBe(1024);
    await fireEvent.press(screen.getByRole('button', { name: 'Resume' }));
    clock = 2000;
    await fireEvent.press(screen.getByRole('button', { name: 'Move left' }));
    expect(finalize).toHaveBeenCalledWith('win', [
        { metric: 'highScore', score: 2148 }, { metric: 'totalScore', score: 2148 },
        { metric: 'moves', score: 8 }, { metric: 'highestTile', score: 2048 }, { metric: 'timeScore', score: 34 },
    ]);
    await fireEvent.press(screen.getByRole('button', { name: 'Home' }));
    expect(p.home).not.toHaveBeenCalled();
    await fireEvent.press(screen.getByRole('button', { name: 'Retry' }));
    expect(finalize).toHaveBeenCalledTimes(2);
    await fireEvent.press(screen.getByRole('button', { name: 'Home' }));
    expect(p.home).toHaveBeenCalledTimes(1);
});

it('freezes 2048 on background and accepts moves only after resume', async () => {
    const state: TileSnapshot = { difficulty: 'Medium', score: 0, moves: 0, board: [
        [2, null, null, null], [null, null, null, null], [null, null, null, null], [null, null, null, null],
    ] };
    const p = props(state);
    p.run.identity.difficulty = 'Medium';
    await render(<TwoZeroFourEightRun {...p} />);
    await fireEvent.press(screen.getByRole('button', { name: 'Start' }));
    clock = 5000;
    await act(() => mockAppChange('background'));
    clock = 100000;
    await act(() => mockAppChange('active'));
    expect(screen.getByText('Paused — resume when you are ready')).toBeTruthy();
    expect(screen.getByLabelText('Elapsed time 0:05')).toBeTruthy();
    await fireEvent.press(screen.getByRole('button', { name: 'Resume' }));
    expect(mockBoard[0][0]).toBe(2);
    await fireEvent.press(screen.getByRole('button', { name: 'Move right' }));
    expect(mockBoard[0][3]).toBe(2);
});

it('recovers a checkpointed loss only after explicit resume', async () => {
    const state: TileSnapshot = { difficulty: 'Medium', score: 40, moves: 9, board: [
        [2, 4, 2, 4], [4, 2, 4, 2], [2, 4, 2, 4], [4, 2, 4, 2],
    ] };
    const p = props(state, true);
    p.run.identity.difficulty = 'Medium';
    await render(<TwoZeroFourEightRun {...p} />);
    expect(p.finalize).not.toHaveBeenCalled();
    await fireEvent.press(screen.getByRole('button', { name: 'Resume' }));
    expect(p.finalize).toHaveBeenCalledWith('loss', [
        { metric: 'highScore', score: 40 }, { metric: 'totalScore', score: 40 },
        { metric: 'moves', score: 9 }, { metric: 'highestTile', score: 4 },
    ]);
});
