import * as SQLite from 'expo-sqlite';

// Function to get all games
export const getGames = async (db) => {
    try {
        const allRows = await db.getAllAsync('SELECT * FROM Games');
        return allRows;
    } catch (error) {
        console.error('Error getting games:', error);
        throw error;
    }
};

// Function to insert a game
export const insertGame = async (db, game) => {
    try {
        const result = await db.runAsync('INSERT INTO Games (id, title, description) VALUES (?, ?, ?)', [game.id, game.title, game.description]);
        console.log(result);
        return result.lastInsertRowId;
    } catch (error) {
        console.error('Error inserting game:', error);
        throw error;
    }
};

// Function to update a game
export const updateGame = async (db, gameId, title, description) => {
    try {
        await db.runAsync('UPDATE Games SET title = ?, description = ? WHERE id = ?', [title, description, gameId]);
        console.log("Game updated");
    } catch (error) {
        console.error('Error updating game:', error);
        throw error;
    }
};

// Function to delete a game
export const deleteGame = async (db, gameId) => {
    try {
        await db.runAsync('DELETE FROM Games WHERE id = ?', [gameId]);
    } catch (error) {
        console.error('Error deleting game:', error);
        throw error;
    }
};
