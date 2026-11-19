import React from 'react';
import { beforeEach, expect, it, jest } from '@jest/globals';
import { Text } from 'react-native';
import { render, screen } from '@testing-library/react-native';
import { StoredGameSession } from '../Session/StoredGameSession';
import { getSession, startSession } from '@/db/Sessions/Sessions';

const mockRefresh = jest.fn();
const mockDb = {};
const mockRouter = { canGoBack: jest.fn(), back: jest.fn(), replace: jest.fn() };
let mockParams: Record<string, string>;

jest.mock('expo-router', () => ({
    useRouter: () => mockRouter,
    useLocalSearchParams: () => mockParams,
}));
jest.mock('expo-sqlite', () => ({ useSQLiteContext: () => mockDb }));
jest.mock('@/contexts/GameSessionContext', () => ({ useGameSessions: () => ({ refresh: mockRefresh }) }));
jest.mock('@/db/Sessions/Sessions', () => ({ getSession: jest.fn(), startSession: jest.fn() }));
jest.mock('@/utils/DailyChallenge', () => ({
    getDailyKey: () => '2026-11-19',
    readLegacyDailyCompletion: async () => false,
}));
jest.mock('@/components/animations', () => ({ LoadingSpinner: () => null }));
jest.mock('@/components/Themed', () => require('react-native'));

const create = jest.fn(() => 'new board');
const validate = (value: unknown): value is string => typeof value === 'string';
const renderWrapper = () => render(
    <StoredGameSession title="Sudoku" version={1} create={create} validate={validate} instructions="Fill the board">
        {({ state, run, restored }) => (
            <Text>{`${state} · ${run.identity.dailyDate} · ${restored ? 'paused' : 'ready'}`}</Text>
        )}
    </StoredGameSession>
);

beforeEach(() => {
    jest.clearAllMocks();
    mockParams = { sessionId: 'old' };
});

it('restores a Daily checkpoint without regenerating or using today’s date', async () => {
    jest.mocked(getSession).mockResolvedValue({
        id: 'old', identity: { gameId: 1, mode: 'Daily Challenge', difficulty: 'Hard', dailyDate: '2026-11-18' },
        revision: 7, snapshot: { version: 1, elapsedMs: 2000, data: 'existing board' },
    });
    await renderWrapper();
    expect(await screen.findByText('existing board · 2026-11-18 · paused')).toBeTruthy();
    expect(create).not.toHaveBeenCalled();
    expect(startSession).not.toHaveBeenCalled();
});

it('reports an incompatible version without replacing the save', async () => {
    const log = jest.spyOn(console, 'error').mockImplementation(() => {});
    jest.mocked(getSession).mockResolvedValue({
        id: 'old', identity: { gameId: 1, mode: 'Classic', difficulty: 'Easy' },
        revision: 0, snapshot: { version: 2, elapsedMs: 0, data: 'existing board' },
    });

    try {
        await renderWrapper();
        expect(await screen.findByText(/no longer compatible/)).toBeTruthy();
        expect(startSession).not.toHaveBeenCalled();
    } finally {
        log.mockRestore();
    }
});

it('provides saved identity to compatibility validation and retains a rejected save', async () => {
    const log = jest.spyOn(console, 'error').mockImplementation(() => {});
    jest.mocked(getSession).mockResolvedValue({
        id: 'old', identity: { gameId: 1, mode: 'Classic', difficulty: 'Hard' },
        revision: 0, snapshot: { version: 1, elapsedMs: 0, data: 'easy board' },
    });
    const validateIdentity = (value: unknown, identity: { difficulty: string }): value is string =>
        typeof value === 'string' && identity.difficulty === 'Easy';
    try {
        await render(<StoredGameSession title="Sudoku" version={1} create={create}
            validate={validateIdentity} instructions="Fill the board">{() => null}</StoredGameSession>);
        expect(await screen.findByText(/no longer compatible/)).toBeTruthy();
        expect(startSession).not.toHaveBeenCalled();
    } finally { log.mockRestore(); }
});
