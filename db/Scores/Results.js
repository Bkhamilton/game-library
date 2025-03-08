import { getGameIdByTitle } from "../Games/Games";

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

// Function to get scores by game
export const getGameScores = async (db, gameId) => {
    try {
        const allRows = await db.getAllAsync(`SELECT * FROM Scores WHERE gameId = "${gameId}"`);
        return allRows;
    } catch (error) {
        console.error('Error getting scores:', error);
        throw error;
    }
}

// Function to get all high scores
export const getHighScores = async (db) => {
    try {
        const allRows = await db.getAllAsync('SELECT * FROM Scores WHERE metric = "highScore" ORDER BY score DESC"');
        return allRows;
    } catch (error) {
        console.error('Error getting high scores:', error);
        throw error;
    }
};

// Function to get high scores by game
export const getHighScoreByGame = async (db, gameId) => {
    try {
        const allRows = await db.getAllAsync(`SELECT * FROM Scores WHERE metric = "highScore" AND gameId = "${gameId}" ORDER BY SCORE DESC LIMIT 5`);
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
        const allRows = await db.getAllAsync('SELECT score AS result, COUNT(*) as count FROM Scores WHERE metric = "result" GROUP BY result');
        return allRows;
    } catch (error) {
        console.error('Error getting win loss count:', error);
        throw error;
    }
};

// Function to get win loss count by game
export const getWinLossCountByGame = async (db, gameId) => {
    try {
        const allRows = await db.getAllAsync(`SELECT score, COUNT(*) as count FROM Scores WHERE metric = "result" AND gameId = "${gameId}" GROUP BY score`);
        return allRows;
    } catch (error) {
        console.error('Error getting win loss count:', error);
        throw error;
    }
};

// Function to check if criteria is met
export const checkCriteria = async (db, gameId, metric, threshold) => {
    try {
        let query;
        if (metric === 'result') {
            query = `SELECT * FROM Scores WHERE gameId = "${gameId}" AND metric = "${metric}" AND score = "${threshold}"`;
        } else if (metric === 'highScore') {
            query = `SELECT * FROM Scores WHERE gameId = "${gameId}" AND metric = "${metric}" AND score > ${threshold} ORDER BY score DESC LIMIT 1`;
        } else {
            throw new Error('Invalid metric');
        }
        const allRows = await db.getAllAsync(query);
        return allRows;
    } catch (error) {
        console.error('Error checking criteria:', error);
        throw error;
    }
};

// Function to check for achievement
export const checkForAchievement = async (db, criteria) => {
    try {
        const gameId = await getGameIdByTitle(db, criteria.game);
        const { metric, threshold } = criteria;
        return await checkCriteria(db, gameId, metric, threshold);
    } catch (error) {
        console.error('Error checking for achievement:', error);
        throw error;
    }
}