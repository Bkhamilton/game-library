import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { useSQLiteContext } from 'expo-sqlite';
import { discardSession, flushPendingSessionAwards, inspectSessions, type StoredSession } from '@/db/Sessions/Sessions';
import { getSessionGameById } from '@/constants/GameSessionRoutes';
import { sessionSnapshotValidators } from '@/components/Session/sessionSnapshotValidators';

type Summary = Pick<StoredSession, 'id' | 'identity'>;

const GameSessionContext = createContext<{
    runs: Summary[];
    unavailable: { id: string; gameId: number }[];
    loading: boolean;
    error: Error | null;
    refresh: () => Promise<void>;
    discard: (id: string) => Promise<void>;
} | null>(null);

export function GameSessionProvider({ children }: { children: ReactNode }) {
    const db = useSQLiteContext();
    const [runs, setRuns] = useState<Summary[]>([]);
    const [unavailable, setUnavailable] = useState<{ id: string; gameId: number }[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);
    const request = useRef(0);

    const refresh = useCallback(async () => {
        const current = ++request.current;
        try {
            const saved = await inspectSessions(db);
            if (request.current !== current) return;
            const valid: Summary[] = [];
            const invalid: typeof unavailable = [];
            for (const { id, gameId, run, cause } of saved) {
                const game = getSessionGameById(gameId);
                if (!game) continue;
                if (!run || run.snapshot.version !== 1 || !game.modes.includes(run.identity.mode) ||
                    !game.difficulties.includes(run.identity.difficulty) ||
                    !sessionSnapshotValidators[game.title](run.snapshot.data, run.identity)) {
                    if (cause) console.error('Could not read saved game:', cause);
                    invalid.push({ id, gameId });
                } else {
                    valid.push({ id, identity: run.identity });
                }
            }
            setRuns(valid);
            setUnavailable(invalid);
            setError(null);
        } catch (cause) {
            if (request.current !== current) return;
            const failure = cause instanceof Error ? cause : new Error('Could not load saved games.');
            console.error('Could not load saved games:', failure);
            setError(failure);
        } finally {
            if (request.current === current) setLoading(false);
        }
        try {
            await flushPendingSessionAwards(db);
        } catch (cause) {
            console.error('Could not process saved game awards; will retry:', cause);
        }
    }, [db]);

    useEffect(() => {
        void refresh();
        return () => { request.current++; };
    }, [refresh]);

    const discard = useCallback(async (id: string) => {
        await discardSession(db, id);
        await refresh();
    }, [db, refresh]);
    const value = useMemo(() => ({ runs, unavailable, loading, error, refresh, discard }),
        [runs, unavailable, loading, error, refresh, discard]);
    return <GameSessionContext.Provider value={value}>{children}</GameSessionContext.Provider>;
}

export function useGameSessions() {
    const context = useContext(GameSessionContext);
    if (!context) throw new Error('Game session access requires GameSessionProvider.');
    return context;
}
