import AsyncStorage from '@react-native-async-storage/async-storage';
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
import { insertGame } from '@/db/Games/Games';
import { insertUser } from '@/db/Users/Users';
import { insertAchievement } from '@/db/Achievements/Achievements';

export const createTables = async (db) => {
    // Your table creation logic here
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

export const dropTables = async (db) => {
    // Your table deletion logic here
    await db.execAsync(`
        DROP TABLE IF EXISTS Users;
        DROP TABLE IF EXISTS Games;
        DROP TABLE IF EXISTS Scores;
        DROP TABLE IF EXISTS Achievements;
        DROP TABLE IF EXISTS UserAchievements;
    `);
};

export const syncData = async (db) => {
    // Add Users and Games data to the database
    const user = {
        username: 'john_doe',
        name: 'John Doe'
    };
    await insertUser(db, user);

    const gamesData = games;
    for (const game of gamesData) {
        await insertGame(db, game);
    }

    // Add achievements data to the database
    // Combine all achievement files into one array
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
        await insertAchievement(db, achievement);
    }
}
    

export const setupDatabase = async (db) => {
    // Your database setup logic here
    await dropTables(db);
    await createTables(db);
    await syncData(db);
};

export const initializeDatabase = async (db) => {
    try {
        const isFirstLaunch = await AsyncStorage.getItem('isFirstLaunch');
        if (isFirstLaunch === null) {
            // First time launch
            await setupDatabase(db);
            await AsyncStorage.setItem('isFirstLaunch', 'false');
        }
        // Open a connection to the SQLite database.
    } catch (error) {
        console.error("Error initializing database:", error);
    }
};