import { DatabaseSync } from 'node:sqlite';
import { initializeDatabase } from '../startup';
import games from '../../data/games.json';
import sudokuAchievements from '../../data/achievements/sudoku.json';

describe('SQLite startup', () => {
    let sqlite;
    let db;

    beforeEach(() => {
        sqlite = new DatabaseSync(':memory:');
        db = {
            execAsync: async sql => sqlite.exec(sql),
            getFirstAsync: async sql => sqlite.prepare(sql).get(),
            getAllAsync: async sql => sqlite.prepare(sql).all(),
            runAsync: async (sql, params) => sqlite.prepare(sql).run(...params),
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
    });

    afterEach(() => sqlite.close());

    const readVersion = () => sqlite.prepare('PRAGMA user_version').get().user_version;
    const readTables = () => sqlite.prepare(
        "SELECT name FROM sqlite_schema WHERE type = 'table' AND name NOT LIKE 'sqlite_%' ORDER BY name"
    ).all().map(row => row.name);

    it('sets up an empty database once and does not reseed on relaunch', async () => {
        await initializeDatabase(db);

        expect(readVersion()).toBe(2);
        expect(readTables()).toEqual(['Achievements', 'DailyCompletions', 'GameSessions', 'Games', 'Scores', 'SessionAchievementWork', 'UserAchievements', 'Users']);
        expect(sqlite.prepare('SELECT username, name FROM Users').all()).toEqual([
            { username: 'john_doe', name: 'John Doe' },
        ]);
        expect(sqlite.prepare('SELECT id, title, description FROM Games ORDER BY id').all())
            .toEqual([...games].sort((a, b) => a.id - b.id));
        const { id, title, criteria } = sudokuAchievements[0];
        expect(sqlite.prepare('SELECT title, criteria FROM Achievements WHERE id = ?').get(id))
            .toEqual({ title, criteria: JSON.stringify(criteria) });

        const run = jest.spyOn(db, 'runAsync');
        await initializeDatabase(db);
        expect(run).not.toHaveBeenCalled();
    });

    it('adopts a compatible unversioned database without overwriting existing records', async () => {
        await initializeDatabase(db);
        sqlite.exec(`
            PRAGMA user_version = 0;
            UPDATE Users SET username = 'dev', name = 'Dev Profile', totalPoints = 10;
            UPDATE Games SET description = 'Local description' WHERE id = 1;
            UPDATE Achievements SET title = 'Local achievement' WHERE id = 1;
            INSERT INTO Scores (gameId, score, metric, difficulty) VALUES (1, 42, 'time', 'easy');
            INSERT INTO UserAchievements (userId, achievementId, progress, unlocked) VALUES (1, 1, 1, 1);
            DELETE FROM Games WHERE id = 3;
            DELETE FROM Achievements WHERE id = 101;
        `);

        await initializeDatabase(db);

        expect(readVersion()).toBe(2);
        expect(sqlite.prepare('SELECT id, username, name, totalPoints FROM Users').all())
            .toEqual([{ id: 1, username: 'dev', name: 'Dev Profile', totalPoints: 10 }]);
        expect(sqlite.prepare('SELECT gameId, score FROM Scores').all()).toEqual([{ gameId: 1, score: 42 }]);
        expect(sqlite.prepare('SELECT userId, achievementId, progress, unlocked FROM UserAchievements').all())
            .toEqual([{ userId: 1, achievementId: 1, progress: 1, unlocked: 1 }]);
        expect(sqlite.prepare('SELECT description FROM Games WHERE id = 1').get().description)
            .toBe('Local description');
        expect(sqlite.prepare('SELECT title FROM Achievements WHERE id = 1').get().title)
            .toBe('Local achievement');
        expect(sqlite.prepare('SELECT title FROM Games WHERE id = 3').get().title)
            .toBe(games.find(game => game.id === 3).title);
        expect(sqlite.prepare('SELECT title FROM Achievements WHERE id = 101').get().title)
            .toBe(sudokuAchievements.find(achievement => achievement.id === 101).title);
    });

    it('rolls back setup and the version marker if interrupted before commit, then can retry', async () => {
        const exec = db.execAsync;
        db.execAsync = async sql => {
            await exec(sql);
            if (sql.startsWith('PRAGMA user_version =')) {
                throw new Error('Simulated setup failure');
            }
        };

        await expect(initializeDatabase(db)).rejects.toThrow('Simulated setup failure');
        expect(readVersion()).toBe(0);
        expect(readTables()).toEqual([]);

        db.execAsync = exec;
        await initializeDatabase(db);
        expect(readVersion()).toBe(2);
        expect(sqlite.prepare('SELECT COUNT(*) AS count FROM Users').get().count).toBe(1);
    });

    it('rejects an incompatible unversioned database without changing its contents', async () => {
        sqlite.exec("CREATE TABLE Users (name TEXT); INSERT INTO Users VALUES ('Dev Profile')");

        await expect(initializeDatabase(db)).rejects.toThrow('Incompatible database: Users');
        expect(readVersion()).toBe(0);
        expect(readTables()).toEqual(['Users']);
        expect(sqlite.prepare('SELECT name FROM Users').all()).toEqual([{ name: 'Dev Profile' }]);
    });

    it('does not open a database marked with an unsupported version', async () => {
        sqlite.exec('PRAGMA user_version = 3');

        await expect(initializeDatabase(db)).rejects.toThrow('Unsupported database version 3');
        expect(readVersion()).toBe(3);
        expect(readTables()).toEqual([]);
    });

    it('upgrades a version 1 database and rolls back an interrupted migration', async () => {
        await initializeDatabase(db);
        sqlite.exec(`
            DROP TABLE SessionAchievementWork;
            DROP TABLE DailyCompletions;
            DROP TABLE GameSessions;
            PRAGMA user_version = 1;
            INSERT INTO Scores (gameId, score, metric, difficulty) VALUES (1, 123, 'timeScore', 'Easy');
        `);
        const exec = db.execAsync;
        db.execAsync = async sql => {
            await exec(sql);
            if (sql.startsWith('PRAGMA user_version =')) throw new Error('Migration failed');
        };
        await expect(initializeDatabase(db)).rejects.toThrow('Migration failed');
        expect(readVersion()).toBe(1);
        expect(readTables()).not.toContain('GameSessions');
        db.execAsync = exec;
        await initializeDatabase(db);
        expect(readVersion()).toBe(2);
        expect(sqlite.prepare('SELECT score FROM Scores').get().score).toBe(123);
    });
});
