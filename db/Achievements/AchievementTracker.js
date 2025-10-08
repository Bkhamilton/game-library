import { getGameIdByTitle } from '@/db/Games/Games';
import { 
    getUserAchievements, 
    unlockAchievement, 
    updateAchievementProgress,
    isAchievementUnlocked 
} from '@/db/Achievements/Achievements';

// Function to check if criteria is met
const checkCriteria = async (db, criteria) => {
    try {
        const { game, metric, threshold, operator } = criteria;
        
        // Handle metrics that require game ID
        if (game) {
            const gameId = await getGameIdByTitle(db, game);
            
            let query;
            if (metric === 'result') {
                // Count wins (score > 0)
                query = `SELECT COUNT(*) as count FROM Scores WHERE gameId = ? AND metric = ? AND score > 0`;
                const result = await db.getAllAsync(query, [gameId, metric]);
                return result[0].count >= threshold;
            } else if (metric === 'highScore') {
                // Check if there's a high score above threshold
                query = `SELECT MAX(score) as maxScore FROM Scores WHERE gameId = ? AND metric = ?`;
                const result = await db.getAllAsync(query, [gameId, metric]);
                return (result[0].maxScore || 0) >= threshold;
            } else if (metric === 'time') {
                // Check for time-based achievements
                if (operator === 'less_than') {
                    // Check if there's at least one game completed under the threshold time
                    query = `SELECT MIN(score) as minTime FROM Scores WHERE gameId = ? AND metric = 'timeScore' AND score > 0`;
                    const result = await db.getAllAsync(query, [gameId]);
                    return result[0].minTime && result[0].minTime <= threshold;
                }
            } else if (metric === 'totalCorrectWords') {
                // Sum all correct words across all games
                query = `SELECT SUM(score) as total FROM Scores WHERE gameId = ? AND metric = 'correctWords'`;
                const result = await db.getAllAsync(query, [gameId]);
                return (result[0].total || 0) >= threshold;
            } else if (metric === 'totalWordsFound') {
                // Sum all words found across all games
                query = `SELECT SUM(score) as total FROM Scores WHERE gameId = ? AND metric = 'wordsFound'`;
                const result = await db.getAllAsync(query, [gameId]);
                return (result[0].total || 0) >= threshold;
            } else if (metric === 'noHints') {
                // Count games where hints used is 0
                query = `SELECT COUNT(*) as count FROM Scores WHERE gameId = ? AND metric = 'hintsUsed' AND score = 0`;
                const result = await db.getAllAsync(query, [gameId]);
                return result[0].count >= threshold;
            }
        }
        
        // For unsupported metrics, return false (not yet implemented)
        // This prevents errors when checking achievements with metrics that aren't tracked yet
        console.log(`Metric '${metric}' is not yet supported for achievement tracking`);
        return false;
    } catch (error) {
        console.error('Error checking criteria:', error);
        throw error;
    }
};

// Function to get current progress for an achievement
const getProgressForAchievement = async (db, criteria) => {
    try {
        const { game, metric, threshold, operator } = criteria;
        
        // Handle metrics that require game ID
        if (game) {
            const gameId = await getGameIdByTitle(db, game);
            
            let query;
            if (metric === 'result') {
                // Count wins (score > 0)
                query = `SELECT COUNT(*) as count FROM Scores WHERE gameId = ? AND metric = ? AND score > 0`;
                const result = await db.getAllAsync(query, [gameId, metric]);
                return Math.min(result[0].count, threshold);
            } else if (metric === 'highScore') {
                // Get the highest score
                query = `SELECT MAX(score) as maxScore FROM Scores WHERE gameId = ? AND metric = ?`;
                const result = await db.getAllAsync(query, [gameId, metric]);
                return Math.min(result[0].maxScore || 0, threshold);
            } else if (metric === 'time') {
                // Get progress for time-based achievements
                if (operator === 'less_than') {
                    // Get the minimum time achieved
                    query = `SELECT MIN(score) as minTime FROM Scores WHERE gameId = ? AND metric = 'timeScore' AND score > 0`;
                    const result = await db.getAllAsync(query, [gameId]);
                    // For "less than" achievements, progress is the threshold minus the best time
                    // If best time is less than threshold, return threshold (100% progress)
                    const minTime = result[0].minTime || threshold;
                    return minTime <= threshold ? threshold : minTime;
                }
            } else if (metric === 'totalCorrectWords') {
                // Sum all correct words across all games
                query = `SELECT SUM(score) as total FROM Scores WHERE gameId = ? AND metric = 'correctWords'`;
                const result = await db.getAllAsync(query, [gameId]);
                return Math.min(result[0].total || 0, threshold);
            } else if (metric === 'totalWordsFound') {
                // Sum all words found across all games
                query = `SELECT SUM(score) as total FROM Scores WHERE gameId = ? AND metric = 'wordsFound'`;
                const result = await db.getAllAsync(query, [gameId]);
                return Math.min(result[0].total || 0, threshold);
            } else if (metric === 'noHints') {
                // Count games where hints used is 0
                query = `SELECT COUNT(*) as count FROM Scores WHERE gameId = ? AND metric = 'hintsUsed' AND score = 0`;
                const result = await db.getAllAsync(query, [gameId]);
                return Math.min(result[0].count, threshold);
            }
        }
        
        // For unsupported metrics, return 0 (not yet implemented)
        return 0;
    } catch (error) {
        console.error('Error getting progress:', error);
        return 0;
    }
};

// Main function to check all achievements for a user
export const checkAllAchievements = async (db, userId) => {
    try {
        const achievements = await getUserAchievements(db, userId);
        const newlyUnlocked = [];
        
        for (const achievement of achievements) {
            // Skip if already unlocked
            if (achievement.unlocked) {
                continue;
            }
            
            // Get current progress
            const currentProgress = await getProgressForAchievement(db, achievement.criteria);
            
            // Update progress
            await updateAchievementProgress(db, userId, achievement.id, currentProgress);
            
            // Check if criteria is met
            const isMet = await checkCriteria(db, achievement.criteria);
            
            if (isMet) {
                const unlockedAchievement = await unlockAchievement(db, userId, achievement.id);
                newlyUnlocked.push(unlockedAchievement);
            }
        }
        
        return newlyUnlocked;
    } catch (error) {
        console.error('Error checking all achievements:', error);
        throw error;
    }
};

// Function to check achievements after a game is completed
export const checkAchievementsAfterGame = async (db, userId, gameTitle) => {
    try {
        const achievements = await getUserAchievements(db, userId);
        const newlyUnlocked = [];
        
        // Filter achievements related to this game
        const gameAchievements = achievements.filter(a => 
            !a.unlocked && a.criteria.game === gameTitle
        );
        
        for (const achievement of gameAchievements) {
            const currentProgress = await getProgressForAchievement(db, achievement.criteria);
            await updateAchievementProgress(db, userId, achievement.id, currentProgress);
            
            const isMet = await checkCriteria(db, achievement.criteria);
            if (isMet) {
                const unlockedAchievement = await unlockAchievement(db, userId, achievement.id);
                newlyUnlocked.push(unlockedAchievement);
            }
        }
        
        return newlyUnlocked;
    } catch (error) {
        console.error('Error checking achievements after game:', error);
        throw error;
    }
};

// Function to get achievement completion percentage for a user
export const getAchievementCompletionPercentage = async (db, userId) => {
    try {
        const achievements = await getUserAchievements(db, userId);
        const totalAchievements = achievements.length;
        const unlockedAchievements = achievements.filter(a => a.unlocked).length;
        
        return totalAchievements > 0 ? (unlockedAchievements / totalAchievements) * 100 : 0;
    } catch (error) {
        console.error('Error getting achievement completion percentage:', error);
        return 0;
    }
};
