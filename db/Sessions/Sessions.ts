import type { SQLiteDatabase } from 'expo-sqlite';
import { evaluateAchievementsInTransaction } from '../Achievements/AchievementTracker';
import { serializeSessionDatabase, withSessionDatabaseTransaction } from './Transaction';

export type SessionIdentity = {
    gameId: number;
    mode: string;
    difficulty: string;
    dailyDate?: string;
};
export type SessionSnapshot = { version: number; data: unknown; elapsedMs: number };
export type StoredSession = { id: string; identity: SessionIdentity; snapshot: SessionSnapshot; revision: number };
export type SessionOutcome = 'win' | 'loss' | 'draw' | 'abandoned' | 'stopped';
export type SessionMetric = { metric: string; score: number };

type SessionRow = {
    id: string;
    gameId: number;
    mode: string;
    difficulty: string;
    dailyDate: string | null;
    snapshot: string;
    revision: number;
    outcome: SessionOutcome | null;
};

function validateIdentity(identity: SessionIdentity): void {
    if (!identity || !Number.isSafeInteger(identity.gameId) || identity.gameId <= 0 ||
        typeof identity.mode !== 'string' || !identity.mode.trim() ||
        typeof identity.difficulty !== 'string' || !identity.difficulty.trim()) {
        throw new Error('Invalid session identity');
    }
    if (identity.mode === 'Daily Challenge') {
        const date = identity.dailyDate;
        if (typeof date !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(date) ||
            Number.isNaN(Date.parse(`${date}T00:00:00Z`)) ||
            new Date(`${date}T00:00:00Z`).toISOString().slice(0, 10) !== date) {
            throw new Error('Invalid Daily session date');
        }
    } else if (identity.dailyDate !== undefined) {
        throw new Error('Only Daily sessions have a date');
    }
}

function validateJson(value: unknown, seen: Set<object>): void {
    if (value === null || typeof value === 'string' || typeof value === 'boolean') return;
    if (typeof value === 'number' && Number.isFinite(value)) return;
    if (typeof value !== 'object' || seen.has(value)) throw new Error('Invalid snapshot data');
    if (!Array.isArray(value) && Object.getPrototypeOf(value) !== Object.prototype) {
        throw new Error('Invalid snapshot data');
    }
    seen.add(value);
    if (Array.isArray(value)) {
        for (let i = 0; i < value.length; i++) {
            if (!(i in value)) throw new Error('Invalid snapshot data');
            validateJson(value[i], seen);
        }
    } else {
        for (const child of Object.values(value)) validateJson(child, seen);
    }
    seen.delete(value);
}

function serializeSnapshot(snapshot: SessionSnapshot): string {
    if (!snapshot || !Number.isSafeInteger(snapshot.version) || snapshot.version < 1 ||
        typeof snapshot.elapsedMs !== 'number' || !Number.isFinite(snapshot.elapsedMs) || snapshot.elapsedMs < 0) {
        throw new Error('Invalid session snapshot');
    }
    validateJson(snapshot.data, new Set());
    return JSON.stringify({ version: snapshot.version, data: snapshot.data, elapsedMs: snapshot.elapsedMs });
}

function slotKey(identity: SessionIdentity): string {
    return JSON.stringify(identity.mode === 'Daily Challenge'
        ? [identity.gameId, identity.mode, identity.difficulty, identity.dailyDate]
        : [identity.gameId, identity.mode]);
}

function readSession(row: SessionRow): StoredSession {
    const identity: SessionIdentity = {
        gameId: row.gameId, mode: row.mode, difficulty: row.difficulty,
        ...(row.dailyDate === null ? {} : { dailyDate: row.dailyDate }),
    };
    validateIdentity(identity);
    const snapshot = JSON.parse(row.snapshot) as SessionSnapshot;
    serializeSnapshot(snapshot);
    if (!Number.isSafeInteger(row.revision) || row.revision < 0) throw new Error('Invalid session revision');
    return { id: row.id, identity, snapshot, revision: row.revision };
}

export async function listSessions(db: SQLiteDatabase): Promise<StoredSession[]> {
    return serializeSessionDatabase(db, async () => {
        const rows = await db.getAllAsync<SessionRow>('SELECT * FROM GameSessions WHERE outcome IS NULL ORDER BY createdAt, id');
        return rows.map(readSession);
    });
}

export async function inspectSessions(db: SQLiteDatabase) {
    return serializeSessionDatabase(db, async () => {
        const rows = await db.getAllAsync<SessionRow>('SELECT * FROM GameSessions WHERE outcome IS NULL ORDER BY createdAt, id');
        return rows.map(row => {
            try {
                return { id: row.id, gameId: row.gameId, run: readSession(row), cause: null };
            } catch (cause) {
                return { id: row.id, gameId: row.gameId, run: null, cause };
            }
        });
    });
}

export async function discardSession(db: SQLiteDatabase, id: string) {
    await withSessionDatabaseTransaction(db, async tx => {
        await tx.runAsync(
            "UPDATE GameSessions SET outcome = 'abandoned', finishedAt = CURRENT_TIMESTAMP WHERE id = ? AND outcome IS NULL",
            [id],
        );
    });
}

async function readActiveSession(db: SQLiteDatabase, id: string): Promise<StoredSession | null> {
    const row = await db.getFirstAsync<SessionRow>('SELECT * FROM GameSessions WHERE id = ? AND outcome IS NULL', [id]);
    return row ? readSession(row) : null;
}

export function getSession(db: SQLiteDatabase, id: string): Promise<StoredSession | null> {
    return serializeSessionDatabase(db, () => readActiveSession(db, id));
}

async function readDailyCompleted(db: SQLiteDatabase, identity: SessionIdentity): Promise<boolean> {
    validateIdentity(identity);
    if (identity.mode !== 'Daily Challenge') throw new Error('Expected Daily session identity');
    const row = await db.getFirstAsync('SELECT 1 FROM DailyCompletions WHERE gameId = ? AND mode = ? AND difficulty = ? AND dailyDate = ?',
        [identity.gameId, identity.mode, identity.difficulty, identity.dailyDate!]);
    return row !== null;
}

export function isDailyCompleted(db: SQLiteDatabase, identity: SessionIdentity): Promise<boolean> {
    return serializeSessionDatabase(db, () => readDailyCompleted(db, identity));
}

export async function startSession(db: SQLiteDatabase, identity: SessionIdentity, snapshot: SessionSnapshot, expectedPreviousId?: string): Promise<StoredSession> {
    validateIdentity(identity);
    const encoded = serializeSnapshot(snapshot);
    return withSessionDatabaseTransaction(db, async tx => {
        const key = slotKey(identity);
        const previous = await tx.getFirstAsync<{ id: string }>('SELECT id FROM GameSessions WHERE slotKey = ? AND outcome IS NULL', [key]);
        if ((previous?.id ?? undefined) !== expectedPreviousId) throw new Error('Session slot changed; replacement not confirmed');
        if (identity.mode === 'Daily Challenge' && await readDailyCompleted(tx, identity)) throw new Error('Daily challenge already completed');
        if (previous) {
            await tx.runAsync("UPDATE GameSessions SET outcome = 'abandoned', finishedAt = CURRENT_TIMESTAMP WHERE id = ? AND outcome IS NULL", [previous.id]);
        }
        const random = await tx.getFirstAsync<{ id: string }>('SELECT lower(hex(randomblob(16))) AS id');
        if (!random) throw new Error('Unable to allocate session ID');
        await tx.runAsync('INSERT INTO GameSessions (id, slotKey, gameId, mode, difficulty, dailyDate, snapshot) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [random.id, key, identity.gameId, identity.mode, identity.difficulty, identity.dailyDate ?? null, encoded]);
        return { id: random.id, identity: { ...identity }, snapshot: JSON.parse(encoded), revision: 0 };
    });
}

export async function saveSession(db: SQLiteDatabase, id: string, snapshot: SessionSnapshot, revision: number): Promise<StoredSession> {
    const encoded = serializeSnapshot(snapshot);
    if (!Number.isSafeInteger(revision) || revision < 0) throw new Error('Invalid session revision');
    return withSessionDatabaseTransaction(db, async tx => {
        const result = await tx.runAsync('UPDATE GameSessions SET snapshot = ?, revision = revision + 1 WHERE id = ? AND outcome IS NULL AND revision = ?', [encoded, id, revision]);
        if (result.changes !== 1) throw new Error('Session is missing, finished, or stale');
        const session = await readActiveSession(tx, id);
        if (!session) throw new Error('Session is missing');
        return session;
    });
}

export async function finishSession(db: SQLiteDatabase, id: string, outcome: SessionOutcome, metrics: SessionMetric[]): Promise<void> {
    if (!['win', 'loss', 'draw', 'abandoned', 'stopped'].includes(outcome) || !Array.isArray(metrics)) throw new Error('Invalid session outcome');
    const names = new Set<string>();
    for (const entry of metrics) {
        if (!entry || typeof entry.metric !== 'string' || !entry.metric.trim() || entry.metric === 'result' ||
            !Number.isSafeInteger(entry.score) || names.has(entry.metric)) throw new Error('Invalid session metric');
        names.add(entry.metric);
    }
    if (outcome === 'abandoned' && metrics.length) throw new Error('Abandoned sessions cannot record metrics');
    await withSessionDatabaseTransaction(db, async tx => {
        const row = await tx.getFirstAsync<SessionRow>('SELECT * FROM GameSessions WHERE id = ?', [id]);
        if (!row) throw new Error('Session not found');
        if (row.outcome !== null) {
            if (row.outcome !== outcome) throw new Error('Session already finished with a different outcome');
            return;
        }
        const session = readSession(row);
        if (outcome === 'win' && session.identity.mode === 'Daily Challenge') {
            await tx.runAsync('INSERT INTO DailyCompletions (gameId, mode, difficulty, dailyDate, sessionId) VALUES (?, ?, ?, ?, ?)',
                [row.gameId, row.mode, row.difficulty, row.dailyDate!, id]);
        }
        if (outcome === 'win' || outcome === 'loss') {
            await tx.runAsync('INSERT INTO Scores (gameId, score, metric, difficulty) VALUES (?, ?, ?, ?)',
                [row.gameId, outcome === 'win' ? 1 : 0, 'result', row.difficulty]);
        }
        for (const metric of metrics) {
            await tx.runAsync('INSERT INTO Scores (gameId, score, metric, difficulty) VALUES (?, ?, ?, ?)',
                [row.gameId, metric.score, metric.metric, row.difficulty]);
        }
        await tx.runAsync('UPDATE GameSessions SET outcome = ?, finishedAt = CURRENT_TIMESTAMP WHERE id = ? AND outcome IS NULL', [outcome, id]);
        if (outcome !== 'abandoned') await tx.runAsync('INSERT INTO SessionAchievementWork (sessionId) VALUES (?)', [id]);
    });
}

/**
 * Retry after database initialization, foregrounding, and successful outcomes.
 * A rejection leaves the work pending; it does not undo a saved outcome.
 */
export async function flushPendingSessionAwards(db: SQLiteDatabase): Promise<void> {
    await withSessionDatabaseTransaction(db, async tx => {
        // Eligibility is cumulative, so evaluate each affected game once per flush.
        const games = await tx.getAllAsync<{ title: string | null }>(`
            SELECT DISTINCT g.title
            FROM SessionAchievementWork w
            LEFT JOIN GameSessions s ON s.id = w.sessionId
            LEFT JOIN Games g ON g.id = s.gameId
        `);
        if (games.length === 0) return;
        const user = await tx.getFirstAsync<{ id: number }>('SELECT id FROM Users ORDER BY id LIMIT 1');
        if (!user) throw new Error('Cannot process session awards without a local user');
        for (const { title } of games) {
            if (title === null) throw new Error('Session award work references a missing game');
            await evaluateAchievementsInTransaction(tx, user.id, title);
        }
        await tx.runAsync('DELETE FROM SessionAchievementWork');
    });
}
