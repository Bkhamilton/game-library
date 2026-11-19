import games from '@/data/games.json';
import sudokuAchievements from '@/data/achievements/sudoku.json';
import minesweeperAchievements from '@/data/achievements/minesweeper.json';
import wordSearchAchievements from '@/data/achievements/word-search.json';
import crosswordAchievements from '@/data/achievements/crossword.json';
import ostrichHaulAchievements from '@/data/achievements/ostrich-haul.json';
import gogobirdAchievements from '@/data/achievements/gogobird.json';
import game2048Achievements from '@/data/achievements/2048.json';
import memoryMatchAchievements from '@/data/achievements/memory-match.json';
import connectFourAchievements from '@/data/achievements/connect-four.json';
import simonSaysAchievements from '@/data/achievements/simon-says.json';
import generalAchievements from '@/data/achievements/general.json';

const DATABASE_VERSION = 2;

const createSessionTables = async (db) => {
    await db.execAsync(`
        CREATE TABLE IF NOT EXISTS GameSessions (
            id TEXT PRIMARY KEY NOT NULL,
            slotKey TEXT NOT NULL,
            gameId INTEGER NOT NULL,
            mode TEXT NOT NULL,
            difficulty TEXT NOT NULL,
            dailyDate TEXT,
            snapshot TEXT NOT NULL,
            revision INTEGER NOT NULL DEFAULT 0,
            outcome TEXT,
            createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
            finishedAt DATETIME,
            FOREIGN KEY (gameId) REFERENCES Games(id)
        );
        CREATE UNIQUE INDEX IF NOT EXISTS idx_sessions_active_slot
            ON GameSessions(slotKey) WHERE outcome IS NULL;
        CREATE TABLE IF NOT EXISTS DailyCompletions (
            gameId INTEGER NOT NULL,
            mode TEXT NOT NULL,
            difficulty TEXT NOT NULL,
            dailyDate TEXT NOT NULL,
            sessionId TEXT NOT NULL UNIQUE,
            PRIMARY KEY (gameId, mode, difficulty, dailyDate),
            FOREIGN KEY (sessionId) REFERENCES GameSessions(id)
        );
        CREATE TABLE IF NOT EXISTS SessionAchievementWork (
            sessionId TEXT PRIMARY KEY NOT NULL,
            FOREIGN KEY (sessionId) REFERENCES GameSessions(id)
        );
    `);
};

const createTables = async (db) => {
    await db.execAsync(`
        CREATE TABLE IF NOT EXISTS Users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT NOT NULL,
            name TEXT NOT NULL,
            totalPoints INTEGER DEFAULT 0,
            createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
        );
        CREATE TABLE IF NOT EXISTS Games (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            description TEXT
        );
        CREATE TABLE IF NOT EXISTS Scores (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            gameId INTEGER NOT NULL,
            score INTEGER NOT NULL,
            metric TEXT NOT NULL,
            difficulty TEXT NOT NULL,
            createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (gameId) REFERENCES Games(id)
        );
        CREATE TABLE IF NOT EXISTS Achievements (
            id INTEGER PRIMARY KEY,
            title TEXT NOT NULL,
            description TEXT NOT NULL,
            tier TEXT,
            points INTEGER DEFAULT 0,
            icon TEXT,
            category TEXT,
            criteria TEXT NOT NULL
        );
        CREATE TABLE IF NOT EXISTS UserAchievements (
            userId INTEGER NOT NULL,
            achievementId INTEGER NOT NULL,
            progress INTEGER DEFAULT 0,
            unlocked BOOLEAN DEFAULT 0,
            unlockedAt DATETIME,
            FOREIGN KEY (userId) REFERENCES Users(id),
            FOREIGN KEY (achievementId) REFERENCES Achievements(id),
            UNIQUE(userId, achievementId)
        );

        -- Performance indexes for frequently queried columns
        CREATE INDEX IF NOT EXISTS idx_scores_gameid ON Scores(gameId);
        CREATE INDEX IF NOT EXISTS idx_scores_metric ON Scores(metric);
        CREATE INDEX IF NOT EXISTS idx_scores_gameid_metric ON Scores(gameId, metric);
        CREATE INDEX IF NOT EXISTS idx_scores_gameid_metric_difficulty ON Scores(gameId, metric, difficulty);
        CREATE INDEX IF NOT EXISTS idx_scores_createdat ON Scores(createdAt);
        CREATE INDEX IF NOT EXISTS idx_userachievements_userid ON UserAchievements(userId);
        CREATE INDEX IF NOT EXISTS idx_userachievements_unlocked ON UserAchievements(userId, unlocked);
        CREATE INDEX IF NOT EXISTS idx_games_title ON Games(title);
    `);
};

const checkTableColumns = async (db) => {
    const requiredColumns = {
        Users: ['id', 'username', 'name', 'totalPoints', 'createdAt'],
        Games: ['id', 'title', 'description'],
        Scores: ['id', 'gameId', 'score', 'metric', 'difficulty', 'createdAt'],
        Achievements: ['id', 'title', 'description', 'tier', 'points', 'icon', 'category', 'criteria'],
        UserAchievements: ['userId', 'achievementId', 'progress', 'unlocked', 'unlockedAt'],
    };

    for (const [table, required] of Object.entries(requiredColumns)) {
        const columns = await db.getAllAsync(`PRAGMA table_info(${table})`);
        const names = new Set(columns.map(({ name }) => name.toLowerCase()));
        const missing = required.filter(name => !names.has(name.toLowerCase()));
        if (missing.length > 0) {
            throw new Error(`Incompatible database: ${table} is missing ${missing.join(', ')}.`);
        }
    }
};

const seedDatabase = async (db) => {
    await db.runAsync(
        `INSERT INTO Users (username, name)
         SELECT ?, ? WHERE NOT EXISTS (SELECT 1 FROM Users)`,
        ['john_doe', 'John Doe']
    );

    for (const game of games) {
        await db.runAsync(
            `INSERT INTO Games (id, title, description) VALUES (?, ?, ?)
             ON CONFLICT(id) DO NOTHING`,
            [game.id, game.title, game.description]
        );
    }

    const achievementsData = [
        ...sudokuAchievements,
        ...minesweeperAchievements,
        ...wordSearchAchievements,
        ...crosswordAchievements,
        ...ostrichHaulAchievements,
        ...gogobirdAchievements,
        ...game2048Achievements,
        ...memoryMatchAchievements,
        ...connectFourAchievements,
        ...simonSaysAchievements,
        ...generalAchievements
    ];
    for (const achievement of achievementsData) {
        const { id, title, description, tier, points, icon, category, criteria } = achievement;
        await db.runAsync(
            `INSERT INTO Achievements (id, title, description, tier, points, icon, category, criteria)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?)
             ON CONFLICT(id) DO NOTHING`,
            [id, title, description, tier, points, icon, category, JSON.stringify(criteria)]
        );
    }
};

export const initializeDatabase = async (db) => {
    // SQLiteProvider waits for onInit before mounting database consumers.
    await db.withTransactionAsync(async () => {
        const { user_version: version } = await db.getFirstAsync('PRAGMA user_version');
        if (version === DATABASE_VERSION) {
            return;
        }
        if (version !== 0 && version !== 1) {
            throw new Error(`Unsupported database version ${version}; expected ${DATABASE_VERSION}.`);
        }

        if (version === 0) {
            await createTables(db);
            await checkTableColumns(db);
            await seedDatabase(db);
        }
        await createSessionTables(db);
        await db.execAsync(`PRAGMA user_version = ${DATABASE_VERSION}`);
    });
};