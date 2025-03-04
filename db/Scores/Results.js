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

// Function to get all high scores
export const getHighScores = async (db) => {
    try {
        const allRows = await db.getAllAsync('SELECT * FROM Scores WHERE metric = "highScore"');
        return allRows;
    } catch (error) {
        console.error('Error getting high scores:', error);
        throw error;
    }
};

// Function to get high scores by game
export const getHighScoreByGame = async (db, gameId) => {
    try {
        const allRows = await db.getAllAsync(`SELECT * FROM Scores WHERE metric = "highScore" AND gameId = "${gameId}"`);
        return allRows;
    } catch (error) {
        console.error('Error getting high scores:', error);
        throw error;
    }
};

// Function to get all results
export const getResults = async (db) => {
    try {
        const allRows = await db.getAllAsync('SELECT * FROM Scores WHERE metric = "result"');
        return allRows;
    } catch (error) {
        console.error('Error getting results:', error);
        throw error;
    }
};

// Function to get count of wins and losses from results
export const getWinLossCount = async (db) => {
    try {
        const allRows = await db.getAllAsync('SELECT result, COUNT(*) as count FROM Scores WHERE metric = "result" GROUP BY result');
        return allRows;
    } catch (error) {
        console.error('Error getting win loss count:', error);
        throw error;
    }
};

// Function to get win loss count by game
export const getWinLossCountByGame = async (db, gameId) => {
    try {
        const allRows = await db.getAllAsync(`SELECT result, COUNT(*) as count FROM Scores WHERE metric = "result" AND gameId = "${gameId}" GROUP BY result`);
        return allRows;
    } catch (error) {
        console.error('Error getting win loss count:', error);
        throw error;
    }
};