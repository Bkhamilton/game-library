import * as SQLite from 'expo-sqlite';

// Function to get all scores
export const getScores = async (db) => {
    try {
        const allRows = await db.getAllAsync('SELECT * FROM Scores');
        return allRows;
    } catch (error) {
        console.error('Error getting scores:', error);
        throw error;
    }
};

// Function to insert a score
export const insertScore = async (db, gameId, score, metric) => {
    try {
        const result = await db.runAsync('INSERT INTO Scores (gameId, score, metric) VALUES (?, ?, ?)', [gameId, score, metric]);
        console.log(result);
        return result.lastInsertRowId;
    } catch (error) {
        console.error('Error inserting score:', error);
        throw error;
    }
};

// Function to update a score
export const updateScore = async (db, scoreId, gameId, score, metric) => {
    try {
        await db.runAsync('UPDATE Scores SET gameId = ?, score = ?, metric = ? WHERE id = ?', [gameId, score, metric, scoreId]);
        console.log("Score updated");
    } catch (error) {
        console.error('Error updating score:', error);
        throw error;
    }
};

// Function to delete a score
export const deleteScore = async (db, scoreId) => {
    try {
        await db.runAsync('DELETE FROM Scores WHERE id = ?', [scoreId]);
    } catch (error) {
        console.error('Error deleting score:', error);
        throw error;
    }
};
