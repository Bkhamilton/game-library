import AsyncStorage from '@react-native-async-storage/async-storage';

export const createTables = async (db) => {
    // Your table creation logic here
    await db.execAsync(`
        CREATE TABLE IF NOT EXISTS Games (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            description TEXT
        );
        CREATE TABLE IF NOT EXISTS Scores (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            gameId INTEGER NOT NULL,
            score INTEGER NOT NULL,
            metric TEXT NOT NULL,
            createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (gameId) REFERENCES Games(id)
        );  
    `);
};

export const setupDatabase = async (db) => {
    // Your database setup logic here
    await createTables(db);
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