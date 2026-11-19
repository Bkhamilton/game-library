import React from 'react';
import { act, fireEvent, render, screen } from '@testing-library/react-native';
import { AppState } from 'react-native';
import { afterEach, beforeEach, expect, it, jest } from '@jest/globals';
import { MemoryMatchRun } from '@/components/Home/MemoryMatch/MemoryMatchGame';
import { createMemorySnapshot, isMemorySnapshot, type MemorySnapshot } from '@/components/Home/MemoryMatch/MemoryMatchSession';
import { ConnectFourRun } from '@/components/Home/ConnectFour/ConnectFourGame';
import { connectMove, createConnectSnapshot, isConnectSnapshot, type ConnectSnapshot } from '@/components/Home/ConnectFour/ConnectFourSession';
import { SimonSaysRun } from '@/components/Home/SimonSays/SimonSaysGame';
import { isSimonSnapshot, type SimonSnapshot } from '@/components/Home/SimonSays/SimonSaysSession';
import type { StoredGameProps } from '@/components/Session/StoredGameSession';
import * as connect from '@/utils/ConnectFourGenerator';

let mockMemoryPress: (index: number) => void;
let mockCards: MemorySnapshot['cards'];
let mockConnectPress: (col: number) => void;
let mockBoard: ConnectSnapshot['board'];
let mockTiles: Array<{ onPress: () => void; isActive: boolean }> = [];
jest.mock('@/components/Home/MemoryMatch/MemoryMatchBoard', () => ({
    __esModule: true, default: (props: { cards: typeof mockCards; onCardPress: typeof mockMemoryPress }) => {
        mockMemoryPress = props.onCardPress; mockCards = props.cards; return null;
    },
}));
jest.mock('@/components/Home/ConnectFour/ConnectFourBoard', () => ({
    __esModule: true, default: (props: { board: typeof mockBoard; onColumnPress: typeof mockConnectPress }) => {
        mockConnectPress = props.onColumnPress; mockBoard = props.board; return null;
    },
}));
jest.mock('@/components/Home/SimonSays/ColorTile', () => ({
    __esModule: true, default: (props: { color: string; onPress: () => void; isActive: boolean }) => {
        const index = ['red', 'blue', 'green', 'yellow', 'purple', 'orange', 'pink', 'cyan', 'lime'].indexOf(props.color);
        mockTiles[index] = props; return null;
    },
}));
jest.mock('@/components/Session/StoredGameSession', () => ({ StoredGameSession: () => null }));
jest.mock('@/hooks/useTheme', () => ({ __esModule: true, default: () => ({ text: '#111', background: '#fff', primary: '#aaa' }) }));
jest.mock('expo-router', () => {
    const React = require('react');
    return { useFocusEffect: (effect: () => (() => void)) => React.useEffect(effect, [effect]),
        usePreventRemove: () => () => {} };
});

function props<T>(state: T, restored = true): StoredGameProps<T> {
    return { state, restored, run: { id: 'run', revision: 1,
        identity: { gameId: 1, mode: 'Classic', difficulty: 'Easy' },
        snapshot: { version: 1, data: state, elapsedMs: 12000 } },
        checkpoint: jest.fn(async () => {}), finalize: jest.fn(async () => {}),
        restart: jest.fn(), home: jest.fn(), openHelp: jest.fn() };
}
const resume = async () => { await fireEvent.press(screen.getByRole('button', { name: 'Resume' })); };
const pause = async () => { await fireEvent.press(screen.getByRole('button', { name: 'Pause' })); };
const tick = async (ms: number) => { await act(() => { jest.advanceTimersByTime(ms); }); };
beforeEach(() => {
    jest.useFakeTimers();
    Object.defineProperty(AppState, 'currentState', { configurable: true, value: 'active' });
    jest.spyOn(AppState, 'addEventListener').mockReturnValue({ remove: jest.fn() });
    mockTiles = [];
});
afterEach(() => { jest.restoreAllMocks(); jest.useRealTimers(); });

it('resumes a pending memory pair only after explicit resume, cancelling its delay on pause', async () => {
    const state = createMemorySnapshot('Easy');
    state.phase = 'play';
    const other = state.cards.findIndex(c => c.value !== state.cards[0].value);
    state.flipped = [0, other];
    state.cards = state.cards.map((c, i) => ({ ...c, isFlipped: i === 0 || i === other }));
    const p = props(state);
    await render(<MemoryMatchRun {...p} />);
    await tick(2000);
    expect(mockCards[0].isFlipped).toBe(true);
    await resume();
    await tick(400);
    await pause();
    await tick(2000);
    expect(mockCards[0].isFlipped).toBe(true);
    await resume();
    await tick(1000);
    expect(mockCards[0].isFlipped).toBe(false);
    expect(p.finalize).not.toHaveBeenCalled();
});

it('records the final memory pair rather than the previous pair count', async () => {
    const state = createMemorySnapshot('Easy');
    state.phase = 'play';
    const value = state.cards[0].value;
    state.cards = state.cards.map(c => ({ ...c, isMatched: c.value !== value, isFlipped: c.value === value }));
    state.flipped = state.cards.map((c, i) => c.value === value ? i : -1).filter(i => i >= 0);
    state.matches = 7;
    const p = props(state);
    await render(<MemoryMatchRun {...p} />);
    await resume(); await tick(600);
    expect(p.finalize).toHaveBeenCalledWith('win', expect.arrayContaining([{ metric: 'totalScore', score: 8 }]));
    expect(p.finalize).toHaveBeenCalledTimes(1);
});

it('cancels a pending AI turn during pause and rejects stale player callbacks after resume', async () => {
    const ai = jest.spyOn(connect, 'getAIMove').mockReturnValue(1);
    const state: ConnectSnapshot = { ...createConnectSnapshot(), countdown: null };
    const p = props(state);
    await render(<ConnectFourRun {...p} />);
    await resume();
    const stale = mockConnectPress;
    await act(() => { mockConnectPress(0); });
    expect(mockBoard[5][0]).toBe('player');
    await pause(); await tick(1000);
    expect(ai).not.toHaveBeenCalled();
    await resume();
    await act(() => { stale(2); });
    await tick(500);
    expect(ai).toHaveBeenCalledTimes(1);
    expect(mockBoard[5][1]).toBe('ai');
    expect(mockBoard[5][2]).toBe('empty');
});

it('finishes a restored draw distinctly without a loss', async () => {
    const sequence = [2, 2, 1, 2, 5, 2, 2, 2, 4, 3, 5, 3, 1, 4, 6, 6, 1, 4, 6, 4, 3,
        5, 3, 5, 6, 5, 4, 1, 0, 4, 6, 1, 1, 6, 3, 3, 0, 0, 5, 0, 0, 0];
    let state: ConnectSnapshot = { ...createConnectSnapshot(), countdown: null };
    for (const col of sequence) state = connectMove(state, col)!;
    expect(state.outcome).toBe('draw');
    expect(isConnectSnapshot(state)).toBe(true);
    const p = props(state);
    await render(<ConnectFourRun {...p} />);
    await resume();
    expect(p.finalize).toHaveBeenCalledWith('draw', [
        { metric: 'drawMoves', score: 21 }, { metric: 'drawTimeScore', score: 12 },
    ]);
    expect(screen.getByText('Draw')).toBeTruthy();
});

it('does not execute pending AI work after unmount', async () => {
    const ai = jest.spyOn(connect, 'getAIMove').mockReturnValue(1);
    const state: ConnectSnapshot = { ...createConnectSnapshot(), countdown: null };
    const p = props(state);
    const rendered = await render(<ConnectFourRun {...p} />);
    await resume();
    await act(() => { mockConnectPress(0); });
    await rendered.unmount(); await tick(1000);
    expect(ai).not.toHaveBeenCalled();
    expect(p.finalize).not.toHaveBeenCalled();
});

it('replays a restored Simon input round and records only completed rounds', async () => {
    const state: SimonSnapshot = { sequence: [0, 1], input: [0], phase: 'input', countdown: 0, completed: 1, outcome: null };
    const p = props(state);
    await render(<SimonSaysRun {...p} />);
    await tick(2000);
    expect(p.finalize).not.toHaveBeenCalled();
    await resume();
    await act(() => { mockTiles[2].onPress(); });
    expect(p.finalize).not.toHaveBeenCalled();
    await tick(780); await tick(780);
    await act(() => { mockTiles[2].onPress(); });
    expect(p.finalize).toHaveBeenCalledWith('loss', [{ metric: 'highScore', score: 1 }]);
    expect(p.finalize).toHaveBeenCalledTimes(1);
});

it('restarts Simon playback after pause rather than advancing while inactive', async () => {
    const state: SimonSnapshot = { sequence: [0, 1], input: [], phase: 'showing', countdown: 0, completed: 1, outcome: null };
    const p = props(state);
    await render(<SimonSaysRun {...p} />);
    await resume();
    expect(mockTiles[0].isActive).toBe(true);
    await pause();
    await tick(3000);
    expect(mockTiles[0].isActive).toBe(false);
    await resume();
    expect(mockTiles[0].isActive).toBe(true);
    await tick(760); await tick(760);
    await act(() => { mockTiles[0].onPress(); mockTiles[1].onPress(); mockTiles[2].onPress(); });
    expect(p.finalize).not.toHaveBeenCalled();
    expect(p.checkpoint).toHaveBeenLastCalledWith(expect.objectContaining({
        state: expect.objectContaining({ phase: 'next', completed: 2 }),
    }));
});

it('rejects malformed saved turn state instead of resuming it', () => {
    const identity = { gameId: 1, mode: 'Classic', difficulty: 'Easy' };
    expect(isMemorySnapshot(createMemorySnapshot('Hard'), identity)).toBe(false);
    expect(isSimonSnapshot({ sequence: [5], input: [], phase: 'showing',
        countdown: 0, completed: 0, outcome: null }, identity)).toBe(false);
    const memory = createMemorySnapshot('Easy');
    memory.cards[0].value = 'bad pair';
    expect(isMemorySnapshot(memory)).toBe(false);
    const connectState = createConnectSnapshot();
    connectState.board[0][0] = 'player';
    expect(isConnectSnapshot(connectState)).toBe(false);
    expect(isSimonSnapshot({ sequence: [0], input: [1], phase: 'input',
        countdown: 0, completed: 0, outcome: null })).toBe(false);
});
