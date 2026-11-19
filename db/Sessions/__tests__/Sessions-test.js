import { randomUUID } from 'node:crypto';
import { rmSync } from 'node:fs';
import { join } from 'node:path';
import { DatabaseSync } from 'node:sqlite';
import { Platform } from 'react-native';
import { initializeDatabase } from '../../../api/startup';
import { checkAchievementsAfterGame } from '../../Achievements/AchievementTracker';
import { unlockAchievement } from '../../Achievements/Achievements';
import { discardSession, finishSession, flushPendingSessionAwards, getSession, inspectSessions, isDailyCompleted, listSessions, saveSession, startSession } from '../Sessions';

describe('SQLite sessions', () => {
    let sqlite;
    let db;
    const identity = { gameId: 1, mode: 'Classic', difficulty: 'Easy' };
    const snapshot = { version: 1, data: { board: [1, 2] }, elapsedMs: 42 };

    function connect(file) {
        sqlite = new DatabaseSync(file);
        db = {
            execAsync: async sql => sqlite.exec(sql),
            getFirstAsync: async (sql, params = []) => sqlite.prepare(sql).get(...params) ?? null,
            getAllAsync: async (sql, params = []) => sqlite.prepare(sql).all(...params),
            runAsync: async (sql, params = []) => sqlite.prepare(sql).run(...params),
            withTransactionAsync: async task => {
                sqlite.exec('BEGIN');
                try {
                    await task();
                    sqlite.exec('COMMIT');
                } catch (error) {
                    sqlite.exec('ROLLBACK');
                    throw error;
                }
            },
        };
        db.withExclusiveTransactionAsync = async task => db.withTransactionAsync(() => task({ ...db }));
    }

    beforeEach(async () => {
        connect(':memory:');
        await initializeDatabase(db);
    });
    afterEach(() => sqlite?.close());

    it('requires an exact replacement guard and prevents old or stale writes', async () => {
        const first = await startSession(db, identity, snapshot);
        const saved = await saveSession(db, first.id, { ...snapshot, elapsedMs: 100 }, first.revision);
        expect(saved.revision).toBe(1);
        await expect(saveSession(db, first.id, snapshot, 0)).rejects.toThrow('stale');
        await expect(startSession(db, { ...identity, difficulty: 'Hard' }, snapshot)).rejects.toThrow('replacement');
        const second = await startSession(db, { ...identity, difficulty: 'Hard' }, snapshot, first.id);
        await expect(startSession(db, identity, snapshot, first.id)).rejects.toThrow('replacement');
        await expect(saveSession(db, first.id, snapshot, 1)).rejects.toThrow('finished');
        expect(await getSession(db, first.id)).toBeNull();
        expect((await listSessions(db)).map(item => item.id)).toEqual([second.id]);
    });

    it('retains the old session when creating its replacement fails', async () => {
        const first = await startSession(db, identity, snapshot);
        const run = db.runAsync;
        db.runAsync = async (sql, params) => {
            if (sql.startsWith('INSERT INTO GameSessions')) throw new Error('injected failure');
            return run(sql, params);
        };
        await expect(startSession(db, identity, snapshot, first.id)).rejects.toThrow('injected failure');
        expect(await getSession(db, first.id)).toEqual(first);
    });

    it('serializes competing writes on the web transaction path', async () => {
        const os = Platform.OS;
        Platform.OS = 'web';
        try {
            const exclusive = jest.spyOn(db, 'withExclusiveTransactionAsync');
            const starts = await Promise.allSettled([startSession(db, identity, snapshot), startSession(db, identity, snapshot)]);
            expect(starts.filter(item => item.status === 'fulfilled')).toHaveLength(1);
            expect(exclusive).not.toHaveBeenCalled();
        } finally {
            Platform.OS = os;
        }
    });

    it('does not roll back an unrelated open web transaction when BEGIN fails', async () => {
        const os = Platform.OS;
        Platform.OS = 'web';
        try {
            sqlite.exec("BEGIN; UPDATE Users SET name = 'Unrelated change'");
            await expect(startSession(db, identity, snapshot)).rejects.toThrow('within a transaction');
            sqlite.exec('COMMIT');
            expect(sqlite.prepare('SELECT name FROM Users').get().name).toBe('Unrelated change');
            await expect(startSession(db, identity, snapshot)).resolves.toMatchObject({ identity });
        } finally {
            Platform.OS = os;
        }
    });

    it('does not expose in-flight session state to cooperating web readers', async () => {
        const os = Platform.OS;
        Platform.OS = 'web';
        try {
            const first = await startSession(db, identity, snapshot);
            const run = db.runAsync;
            db.runAsync = async (sql, params) => {
                if (sql.startsWith('INSERT INTO GameSessions')) throw new Error('injected failure');
                return run(sql, params);
            };
            const replacing = startSession(db, identity, snapshot, first.id);
            const reading = listSessions(db);
            await expect(replacing).rejects.toThrow('injected failure');
            await expect(reading).resolves.toEqual([first]);
        } finally {
            Platform.OS = os;
        }
    });

    it('serializes competing starts, revisions, and terminal retries', async () => {
        const starts = await Promise.allSettled([startSession(db, identity, snapshot), startSession(db, identity, snapshot)]);
        expect(starts.filter(item => item.status === 'fulfilled')).toHaveLength(1);
        const session = starts.find(item => item.status === 'fulfilled').value;
        const saves = await Promise.allSettled([saveSession(db, session.id, snapshot, 0), saveSession(db, session.id, snapshot, 0)]);
        expect(saves.filter(item => item.status === 'fulfilled')).toHaveLength(1);
        await Promise.all([
            finishSession(db, session.id, 'win', [{ metric: 'timeScore', score: 12 }]),
            finishSession(db, session.id, 'win', [{ metric: 'timeScore', score: 12 }]),
        ]);
        expect(sqlite.prepare('SELECT metric, score FROM Scores ORDER BY id').all())
            .toEqual([{ metric: 'result', score: 1 }, { metric: 'timeScore', score: 12 }]);
        expect(sqlite.prepare('SELECT COUNT(*) AS count FROM SessionAchievementWork').get().count).toBe(1);
        await expect(finishSession(db, session.id, 'loss', [])).rejects.toThrow('different outcome');
        await expect(saveSession(db, session.id, snapshot, 1)).rejects.toThrow('finished');
    });

    it('rolls back all terminal writes on error and supports a retry', async () => {
        const session = await startSession(db, identity, snapshot);
        const run = db.runAsync;
        db.runAsync = async (sql, params) => {
            if (sql.startsWith('INSERT INTO SessionAchievementWork')) throw new Error('injected failure');
            return run(sql, params);
        };
        await expect(finishSession(db, session.id, 'win', [])).rejects.toThrow('injected failure');
        expect(sqlite.prepare('SELECT COUNT(*) AS count FROM Scores').get().count).toBe(0);
        expect(await getSession(db, session.id)).not.toBeNull();
        db.runAsync = run;
        await finishSession(db, session.id, 'win', []);
        expect(sqlite.prepare('SELECT COUNT(*) AS count FROM Scores').get().count).toBe(1);
    });

    it.each([
        ['points', "CREATE TRIGGER award_error BEFORE UPDATE OF totalPoints ON Users BEGIN SELECT RAISE(ABORT, 'award error'); END"],
        ['acknowledgment', "CREATE TRIGGER award_error BEFORE DELETE ON SessionAchievementWork BEGIN SELECT RAISE(ABORT, 'award error'); END"],
    ])('retains the work and outcome after an award %s failure', async (_stage, trigger) => {
        const session = await startSession(db, identity, snapshot);
        await finishSession(db, session.id, 'win', []);
        sqlite.exec(trigger);
        await expect(flushPendingSessionAwards(db)).rejects.toThrow('award error');

        expect(sqlite.prepare('SELECT sessionId FROM SessionAchievementWork').all()).toEqual([{ sessionId: session.id }]);
        expect(sqlite.prepare('SELECT * FROM UserAchievements').all()).toEqual([]);
        expect(sqlite.prepare('SELECT totalPoints FROM Users').get().totalPoints).toBe(0);
        expect(sqlite.prepare('SELECT outcome FROM GameSessions').get().outcome).toBe('win');
        expect(sqlite.prepare('SELECT COUNT(*) AS count FROM Scores').get().count).toBe(1);

        sqlite.exec('DROP TRIGGER award_error');
        await flushPendingSessionAwards(db);
        expect(sqlite.prepare('SELECT * FROM SessionAchievementWork').all()).toEqual([]);
        expect(sqlite.prepare('SELECT totalPoints FROM Users').get().totalPoints).toBe(10);
        expect(sqlite.prepare('SELECT unlocked FROM UserAchievements WHERE achievementId = 1').get().unlocked).toBe(1);
    });

    it('guards points against overlapping legacy evaluation, flushes, and re-finalization', async () => {
        const { id: userId } = sqlite.prepare('SELECT id FROM Users').get();
        const sessions = [];
        for (let i = 0; i < 2; i++) {
            const { id } = await startSession(db, identity, snapshot);
            await finishSession(db, id, 'win', []);
            sessions.push(id);
        }
        await Promise.all([
            checkAchievementsAfterGame(db, userId, 'Sudoku'),
            flushPendingSessionAwards(db),
            flushPendingSessionAwards(db),
        ]);
        await finishSession(db, sessions[0], 'win', []);
        await expect(unlockAchievement(db, userId, 1)).resolves.toBeNull();
        expect(sqlite.prepare('SELECT * FROM SessionAchievementWork').all()).toEqual([]);
        expect(sqlite.prepare('SELECT totalPoints FROM Users').get().totalPoints).toBe(10);
        expect(sqlite.prepare('SELECT progress FROM UserAchievements WHERE achievementId = 101').get().progress).toBe(2);
    });

    it('can flush pending awards after reopening the database', async () => {
        const file = join(__dirname, `session-awards-${randomUUID()}.db`);
        sqlite.close();
        sqlite = undefined;
        try {
            connect(file);
            await initializeDatabase(db);
            const { id } = await startSession(db, identity, snapshot);
            await finishSession(db, id, 'win', []);
            sqlite.close();
            sqlite = undefined;

            connect(file);
            await initializeDatabase(db);
            expect(sqlite.prepare('SELECT sessionId FROM SessionAchievementWork').get().sessionId).toBe(id);
            await flushPendingSessionAwards(db);
            expect(sqlite.prepare('SELECT * FROM SessionAchievementWork').all()).toEqual([]);
            expect(sqlite.prepare('SELECT totalPoints FROM Users').get().totalPoints).toBe(10);
        } finally {
            sqlite?.close();
            sqlite = undefined;
            rmSync(file, { force: true });
        }
    });

    it('separates Daily slots and pins completion to the original date and difficulty', async () => {
        const daily = { ...identity, mode: 'Daily Challenge', dailyDate: '2026-11-18' };
        const original = await startSession(db, daily, snapshot);
        const tomorrow = { ...daily, dailyDate: '2026-11-19' };
        await startSession(db, tomorrow, snapshot);
        await startSession(db, { ...daily, difficulty: 'Hard' }, snapshot);
        await finishSession(db, original.id, 'win', []);
        expect(await isDailyCompleted(db, daily)).toBe(true);
        expect(await isDailyCompleted(db, tomorrow)).toBe(false);
        expect(await isDailyCompleted(db, { ...daily, difficulty: 'Hard' })).toBe(false);
        await expect(startSession(db, daily, snapshot)).rejects.toThrow('already completed');
    });

    it('does not convert abandonment, draw, or stopped to legacy results', async () => {
        for (const outcome of ['abandoned', 'draw', 'stopped']) {
            const session = await startSession(db, identity, snapshot);
            await finishSession(db, session.id, outcome, []);
        }
        expect(sqlite.prepare("SELECT COUNT(*) AS count FROM Scores WHERE metric = 'result'").get().count).toBe(0);
    });

    it('rejects invalid snapshots and reports corrupt saves', async () => {
        await expect(startSession(db, identity, { ...snapshot, data: { bad: undefined } })).rejects.toThrow('Invalid snapshot');
        await expect(startSession(db, { ...identity, mode: 'Daily Challenge', dailyDate: '2026-02-30' }, snapshot)).rejects.toThrow('date');
        const session = await startSession(db, identity, snapshot);
        const valid = await startSession(db, { ...identity, mode: 'Frenzy' }, snapshot);
        sqlite.prepare('UPDATE GameSessions SET snapshot = ? WHERE id = ?').run('bad json', session.id);
        await expect(getSession(db, session.id)).rejects.toThrow();
        const inventory = await inspectSessions(db);
        expect(inventory.find(entry => entry.id === session.id)?.run).toBeNull();
        expect(inventory.find(entry => entry.id === valid.id)?.run).toEqual(valid);
        await discardSession(db, session.id);
        expect((await listSessions(db)).map(entry => entry.id)).toEqual([valid.id]);
    });
});
