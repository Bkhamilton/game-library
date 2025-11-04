import { getGameIdByTitle } from "../Games/Games";
import { formatTime } from '@/utils/helpers';

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

// Function to get total wins
export const getTotalWins = async (db) => {
    try {
        const allRows = await db.getAllAsync('SELECT * FROM Scores WHERE metric = "result" AND score > 0');
        return allRows.length;
    } catch (error) {
        console.error('Error getting total wins:', error);
        throw error;
    }
};

// Function to get total losses
export const getTotalLosses = async (db) => {
    try {
        const allRows = await db.getAllAsync('SELECT * FROM Scores WHERE metric = "result" AND score < 0');
        return allRows.length;
    } catch (error) {
        console.error('Error getting total losses:', error);
        throw error;
    }
};

// Function to get scores by game
export const getGameScores = async (db, gameId) => {
    try {
        const allRows = await db.getAllAsync('SELECT * FROM Scores WHERE gameId = ?', [gameId]);
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
        const allRows = await db.getAllAsync('SELECT * FROM Scores WHERE metric = ? AND gameId = ? ORDER BY score DESC LIMIT 5', ['highScore', gameId]);
        return allRows;
    } catch (error) {
        console.error('Error getting high scores:', error);
        throw error;
    }
};

// Function to get highest score of any game
export const getHighestScore = async (db) => {
    try {
        const allRows = await db.getAllAsync('SELECT * FROM Scores WHERE metric = "highScore" ORDER BY score DESC LIMIT 1');
        return allRows.length > 0 ? allRows[0].score : 0; // Return the highest score or null if no scores
    } catch (error) {
        console.error('Error getting highest score:', error);
        throw error;
    }
}

// Function to get fastest time of any game
export const getFastestTime = async (db) => {
    try {
        const allRows = await db.getAllAsync('SELECT * FROM Scores WHERE metric = "timeScore" ORDER BY score ASC LIMIT 1');
        return allRows.length > 0 ? formatTime(allRows[0].score) : '0:00';
    } catch (error) {
        console.error('Error getting fastest time:', error);
        throw error;
    }
};

// Function to get streak of any game
export const getStreak = async (db) => {
    try {
        const allRows = await db.getAllAsync('SELECT * FROM Scores WHERE metric = "streak" ORDER BY score DESC LIMIT 1');
        return allRows;
    } catch (error) {
        console.error('Error getting streak:', error);
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
        const allRows = await db.getAllAsync('SELECT score, COUNT(*) as count FROM Scores WHERE metric = ? AND gameId = ? GROUP BY score', ['result', gameId]);
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
        let params;
        if (metric === 'result') {
            query = 'SELECT * FROM Scores WHERE gameId = ? AND metric = ? AND score > 0 LIMIT 1';
            params = [gameId, metric];
        } else if (metric === 'highScore') {
            query = 'SELECT * FROM Scores WHERE gameId = ? AND metric = ? AND score > ? ORDER BY score DESC LIMIT 1';
            params = [gameId, metric, threshold];
        } else {
            throw new Error('Invalid metric');
        }
        const allRows = await db.getAllAsync(query, params);
        return allRows.length > 0;
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

// Function to return stats by title: title is one word from the following array ['Wins', 'Fastest Time', 'Streak']
export const getStatByTitle = async (db, title) => {
    try {
        switch (title) {
            case 'Wins':
                return await getTotalWins(db);
            case 'Fastest Time':
                return await getFastestTime(db);
            case 'Streak':
                return await getStreak(db);
            case 'High Score':
                return await getHighestScore(db);
            default:
                throw new Error('Invalid title');
        }
    } catch (error) {
        console.error('Error getting stat by title:', error);
        throw error;
    }
}