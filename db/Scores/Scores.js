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
export const insertScore = async (db, gameId, score, metric, difficulty) => {
    try {
        const result = await db.runAsync('INSERT INTO Scores (gameId, score, metric, difficulty) VALUES (?, ?, ?, ?)', [gameId, score, metric, difficulty]);
        return result.lastInsertRowId;
    } catch (error) {
        console.error('Error inserting score:', error);
        throw error;
    }
};

// Function to insert a high score
export const insertHighScore = async (db, gameId, score, difficulty) => {
    try {
        const metric = 'highScore';
        await insertScore(db, gameId, score, metric, difficulty);
    } catch (error) {
        console.error('Error inserting high score:', error);
        throw error;
    }
};

// Function to insert a result (win or loss)
export const insertResult = async (db, gameId, result, difficulty) => {
    try {
        const metric = 'result';
        await insertScore(db, gameId, result, metric, difficulty);
    } catch (error) {
        console.error('Error inserting result:', error);
        throw error;
    }
};

// Function to insert a win
export const insertWin = async (db, gameId, difficulty) => {
    await insertResult(db, gameId, 1, difficulty);
}

// Function to insert a loss
export const insertLoss = async (db, gameId, difficulty) => {
    await insertResult(db, gameId, 0, difficulty);
}

// Function to insert a time score
export const insertTimeScore = async (db, gameId, time, difficulty) => {
    try {
        const metric = 'timeScore';
        await insertScore(db, gameId, time, metric, difficulty);
    } catch (error) {
        console.error('Error inserting time score:', error);
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
