import { getGameIdByTitle } from '@/db/Games/Games';
import { 
    getUserAchievements, 
    unlockAchievement, 
    updateAchievementProgress,
    isAchievementUnlocked 
} from '@/db/Achievements/Achievements';

// Cache for game IDs to avoid repeated lookups
const gameIdCache = new Map();

// Helper function to get game ID with caching
const getCachedGameId = async (db, gameTitle) => {
    if (gameIdCache.has(gameTitle)) {
        return gameIdCache.get(gameTitle);
    }
    const gameId = await getGameIdByTitle(db, gameTitle);
    gameIdCache.set(gameTitle, gameId);
    return gameId;
};

// Batch query function to get stats for multiple achievements at once
const batchGetAchievementStats = async (db, achievements) => {
    try {
        // Group achievements by game to minimize queries
        const statsByGame = new Map();
        
        // Get all unique game IDs
        const gameIds = new Set();
        for (const achievement of achievements) {
            if (achievement.criteria.game) {
                const gameId = await getCachedGameId(db, achievement.criteria.game);
                gameIds.add(gameId);
            }
        }
        
        // Batch fetch all stats for all games in one query
        if (gameIds.size > 0) {
            const gameIdList = Array.from(gameIds);
            const placeholders = gameIdList.map(() => '?').join(',');
            
            // Get comprehensive stats for all games at once
            const statsQuery = `
                SELECT 
                    gameId,
                    metric,
                    difficulty,
                    COUNT(*) as count,
                    SUM(score) as total,
                    MAX(score) as maxScore,
                    MIN(CASE WHEN score > 0 THEN score ELSE NULL END) as minScore
                FROM Scores 
                WHERE gameId IN (${placeholders})
                GROUP BY gameId, metric, difficulty
            `;
            
            const stats = await db.getAllAsync(statsQuery, gameIdList);
            
            // Also get overall stats without difficulty grouping
            const overallStatsQuery = `
                SELECT 
                    gameId,
                    metric,
                    COUNT(*) as count,
                    SUM(score) as total,
                    MAX(score) as maxScore,
                    MIN(CASE WHEN score > 0 THEN score ELSE NULL END) as minScore
                FROM Scores 
                WHERE gameId IN (${placeholders})
                GROUP BY gameId, metric
            `;
            
            const overallStats = await db.getAllAsync(overallStatsQuery, gameIdList);
            
            // Organize stats by gameId for quick lookup
            for (const stat of [...stats, ...overallStats]) {
                const key = `${stat.gameId}-${stat.metric}-${stat.difficulty || 'all'}`;
                statsByGame.set(key, stat);
            }
        }
        
        return statsByGame;
    } catch (error) {
        console.error('Error batch fetching achievement stats:', error);
        throw error;
    }
};

// Optimized function to check if criteria is met using cached stats
const checkCriteriaWithStats = async (db, criteria, statsByGame) => {
    try {
        const { game, metric, threshold, operator, difficulty } = criteria;
        
        // Handle metrics that require game ID
        if (game) {
            const gameId = await getCachedGameId(db, game);
            
            if (metric === 'result') {
                // Count wins (score > 0) - need to query separately for this
                const key = `${gameId}-${metric}-${difficulty || 'all'}`;
                const stats = statsByGame.get(key);
                
                if (!stats) {
                    // Fallback to direct query if stats not found
                    let query;
                    if (difficulty) {
                        query = 'SELECT COUNT(*) as count FROM Scores WHERE gameId = ? AND metric = ? AND score > 0 AND difficulty = ?';
                        const result = await db.getAllAsync(query, [gameId, metric, difficulty]);
                        return result[0].count >= threshold;
                    } else {
                        query = 'SELECT COUNT(*) as count FROM Scores WHERE gameId = ? AND metric = ? AND score > 0';
                        const result = await db.getAllAsync(query, [gameId, metric]);
                        return result[0].count >= threshold;
                    }
                }
                
                // Since we need to count where score > 0, we still need a specific query
                let query;
                if (difficulty) {
                    query = 'SELECT COUNT(*) as count FROM Scores WHERE gameId = ? AND metric = ? AND score > 0 AND difficulty = ?';
                    const result = await db.getAllAsync(query, [gameId, metric, difficulty]);
                    return result[0].count >= threshold;
                } else {
                    query = 'SELECT COUNT(*) as count FROM Scores WHERE gameId = ? AND metric = ? AND score > 0';
                    const result = await db.getAllAsync(query, [gameId, metric]);
                    return result[0].count >= threshold;
                }
            } else if (metric === 'highScore') {
                const key = `${gameId}-${metric}-all`;
                const stats = statsByGame.get(key);
                return (stats?.maxScore || 0) >= threshold;
            } else if (metric === 'highestTile') {
                const key = `${gameId}-${metric}-all`;
                const stats = statsByGame.get(key);
                return (stats?.maxScore || 0) >= threshold;
            } else if (metric === 'time') {
                if (operator === 'less_than') {
                    const key = `${gameId}-timeScore-all`;
                    const stats = statsByGame.get(key);
                    return stats?.minScore && stats.minScore <= threshold;
                }
            } else if (metric === 'totalCorrectWords') {
                const key = `${gameId}-correctWords-all`;
                const stats = statsByGame.get(key);
                return (stats?.total || 0) >= threshold;
            } else if (metric === 'totalWordsFound') {
                const key = `${gameId}-wordsFound-all`;
                const stats = statsByGame.get(key);
                return (stats?.total || 0) >= threshold;
            } else if (metric === 'noHints') {
                // Need specific query for count where score = 0
                const query = 'SELECT COUNT(*) as count FROM Scores WHERE gameId = ? AND metric = ? AND score = 0';
                const result = await db.getAllAsync(query, [gameId, 'hintsUsed']);
                return result[0].count >= threshold;
            } else if (metric === 'moves') {
                if (operator === 'less_than') {
                    const key = `${gameId}-moves-all`;
                    const stats = statsByGame.get(key);
                    return stats?.minScore && stats.minScore <= threshold;
                }
            } else if (metric === 'totalScore') {
                const key = `${gameId}-totalScore-all`;
                const stats = statsByGame.get(key);
                return (stats?.maxScore || 0) >= threshold;
            } else if (metric === 'totalMatches') {
                const key = `${gameId}-totalScore-all`;
                const stats = statsByGame.get(key);
                return (stats?.total || 0) >= threshold;
            } else if (metric === 'gameStreak') {
                console.log(`Metric 'gameStreak' requires special streak tracking logic`);
                return false;
            }
        }
        
        console.log(`Metric '${metric}' is not yet supported for achievement tracking`);
        return false;
    } catch (error) {
        console.error('Error checking criteria:', error);
        throw error;
    }
};

// Optimized function to get current progress using cached stats
const getProgressForAchievementWithStats = async (db, criteria, statsByGame) => {
    try {
        const { game, metric, threshold, operator, difficulty } = criteria;
        
        if (game) {
            const gameId = await getCachedGameId(db, game);
            
            if (metric === 'result') {
                let query;
                if (difficulty) {
                    query = 'SELECT COUNT(*) as count FROM Scores WHERE gameId = ? AND metric = ? AND score > 0 AND difficulty = ?';
                    const result = await db.getAllAsync(query, [gameId, metric, difficulty]);
                    return Math.min(result[0].count, threshold);
                } else {
                    query = 'SELECT COUNT(*) as count FROM Scores WHERE gameId = ? AND metric = ? AND score > 0';
                    const result = await db.getAllAsync(query, [gameId, metric]);
                    return Math.min(result[0].count, threshold);
                }
            } else if (metric === 'highScore') {
                const key = `${gameId}-${metric}-all`;
                const stats = statsByGame.get(key);
                return Math.min(stats?.maxScore || 0, threshold);
            } else if (metric === 'highestTile') {
                const key = `${gameId}-${metric}-all`;
                const stats = statsByGame.get(key);
                return Math.min(stats?.maxScore || 0, threshold);
            } else if (metric === 'time') {
                if (operator === 'less_than') {
                    const key = `${gameId}-timeScore-all`;
                    const stats = statsByGame.get(key);
                    const minTime = stats?.minScore || threshold;
                    return minTime <= threshold ? threshold : minTime;
                }
            } else if (metric === 'totalCorrectWords') {
                const key = `${gameId}-correctWords-all`;
                const stats = statsByGame.get(key);
                return Math.min(stats?.total || 0, threshold);
            } else if (metric === 'totalWordsFound') {
                const key = `${gameId}-wordsFound-all`;
                const stats = statsByGame.get(key);
                return Math.min(stats?.total || 0, threshold);
            } else if (metric === 'noHints') {
                const query = 'SELECT COUNT(*) as count FROM Scores WHERE gameId = ? AND metric = ? AND score = 0';
                const result = await db.getAllAsync(query, [gameId, 'hintsUsed']);
                return Math.min(result[0].count, threshold);
            } else if (metric === 'moves') {
                if (operator === 'less_than') {
                    const key = `${gameId}-moves-all`;
                    const stats = statsByGame.get(key);
                    const minMoves = stats?.minScore || threshold;
                    return minMoves <= threshold ? threshold : minMoves;
                }
            } else if (metric === 'totalScore') {
                const key = `${gameId}-totalScore-all`;
                const stats = statsByGame.get(key);
                return Math.min(stats?.maxScore || 0, threshold);
            } else if (metric === 'totalMatches') {
                const key = `${gameId}-totalScore-all`;
                const stats = statsByGame.get(key);
                return Math.min(stats?.total || 0, threshold);
            } else if (metric === 'gameStreak') {
                return 0;
            }
        }
        
        return 0;
    } catch (error) {
        console.error('Error getting progress:', error);
        return 0;
    }
};

// Optimized main function to check all achievements for a user
export const checkAllAchievements = async (db, userId) => {
    try {
        const achievements = await getUserAchievements(db, userId);
        
        // Filter out already unlocked achievements
        const lockedAchievements = achievements.filter(a => !a.unlocked);
        
        if (lockedAchievements.length === 0) {
            return [];
        }
        
        // Batch fetch all stats needed for achievement checking
        const statsByGame = await batchGetAchievementStats(db, lockedAchievements);
        
        const newlyUnlocked = [];
        const progressUpdates = [];
        
        // Process all achievements with cached stats
        for (const achievement of lockedAchievements) {
            // Get current progress
            const currentProgress = await getProgressForAchievementWithStats(db, achievement.criteria, statsByGame);
            
            // Batch progress updates
            progressUpdates.push({ userId, achievementId: achievement.id, progress: currentProgress });
            
            // Check if criteria is met
            const isMet = await checkCriteriaWithStats(db, achievement.criteria, statsByGame);
            
            if (isMet) {
                newlyUnlocked.push(achievement.id);
            }
        }
        
        // Batch update all progress at once
        if (progressUpdates.length > 0) {
            await batchUpdateAchievementProgress(db, progressUpdates);
        }
        
        // Batch unlock all newly unlocked achievements
        const unlockedResults = [];
        for (const achievementId of newlyUnlocked) {
            const unlockedAchievement = await unlockAchievement(db, userId, achievementId);
            unlockedResults.push(unlockedAchievement);
        }
        
        return unlockedResults;
    } catch (error) {
        console.error('Error checking all achievements:', error);
        throw error;
    }
};

// Batch update achievement progress
const batchUpdateAchievementProgress = async (db, progressUpdates) => {
    try {
        // Use a transaction for better performance
        await db.execAsync('BEGIN TRANSACTION');
        
        for (const update of progressUpdates) {
            await updateAchievementProgress(db, update.userId, update.achievementId, update.progress);
        }
        
        await db.execAsync('COMMIT');
    } catch (error) {
        await db.execAsync('ROLLBACK');
        console.error('Error batch updating achievement progress:', error);
        throw error;
    }
};

// Optimized function to check achievements after a game is completed
export const checkAchievementsAfterGame = async (db, userId, gameTitle) => {
    try {
        const achievements = await getUserAchievements(db, userId);
        
        // Filter achievements related to this game and not yet unlocked
        const gameAchievements = achievements.filter(a => 
            !a.unlocked && a.criteria.game === gameTitle
        );
        
        if (gameAchievements.length === 0) {
            return [];
        }
        
        // Batch fetch stats for this specific game
        const statsByGame = await batchGetAchievementStats(db, gameAchievements);
        
        const newlyUnlocked = [];
        const progressUpdates = [];
        
        for (const achievement of gameAchievements) {
            const currentProgress = await getProgressForAchievementWithStats(db, achievement.criteria, statsByGame);
            progressUpdates.push({ userId, achievementId: achievement.id, progress: currentProgress });
            
            const isMet = await checkCriteriaWithStats(db, achievement.criteria, statsByGame);
            if (isMet) {
                newlyUnlocked.push(achievement.id);
            }
        }
        
        // Batch update progress
        if (progressUpdates.length > 0) {
            await batchUpdateAchievementProgress(db, progressUpdates);
        }
        
        // Unlock achievements
        const unlockedResults = [];
        for (const achievementId of newlyUnlocked) {
            const unlockedAchievement = await unlockAchievement(db, userId, achievementId);
            unlockedResults.push(unlockedAchievement);
        }
        
        return unlockedResults;
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

// Clear cache function (can be called when needed)
export const clearGameIdCache = () => {
    gameIdCache.clear();
};
