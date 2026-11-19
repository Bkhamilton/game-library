import { withSessionDatabaseTransaction } from '../Sessions/Transaction';

// Function to get all achievements
export const getAchievements = async (db) => {
    try {
        const allRows = await db.getAllAsync('SELECT * FROM Achievements');
        return allRows;
    } catch (error) {
        console.error('Error getting achievements:', error);
        throw error;
    }
};

// Function to get achievement by id
export const getAchievementById = async (db, achievementId) => {
    try {
        const result = await db.getAllAsync('SELECT * FROM Achievements WHERE id = ?', [achievementId]);
        return result[0];
    } catch (error) {
        console.error('Error getting achievement by id:', error);
        throw error;
    }
};

// Function to insert an achievement
export const insertAchievement = async (db, achievement) => {
    try {
        const criteriaJson = JSON.stringify(achievement.criteria);
        const result = await db.runAsync(
            'INSERT INTO Achievements (id, title, description, tier, points, icon, category, criteria) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
            [achievement.id, achievement.title, achievement.description, achievement.tier, achievement.points, achievement.icon, achievement.category, criteriaJson]
        );
        return result.lastInsertRowId;
    } catch (error) {
        console.error('Error inserting achievement:', error);
        throw error;
    }
};

// Function to get user achievements
export const getUserAchievements = async (db, userId) => {
    try {
        const allRows = await db.getAllAsync(
            `SELECT a.*, ua.progress, ua.unlocked, ua.unlockedAt 
             FROM Achievements a
             LEFT JOIN UserAchievements ua ON a.id = ua.achievementId AND ua.userId = ?
             ORDER BY a.id`,
            [userId]
        );
        return allRows.map(row => ({
            ...row,
            criteria: JSON.parse(row.criteria)
        }));
    } catch (error) {
        console.error('Error getting user achievements:', error);
        throw error;
    }
};

// Function to get unlocked achievements for a user
export const getUnlockedAchievements = async (db, userId) => {
    try {
        const allRows = await db.getAllAsync(
            `SELECT a.*, ua.unlockedAt 
             FROM Achievements a
             INNER JOIN UserAchievements ua ON a.id = ua.achievementId
             WHERE ua.userId = ? AND ua.unlocked = 1
             ORDER BY ua.unlockedAt DESC`,
            [userId]
        );
        return allRows.map(row => ({
            ...row,
            criteria: JSON.parse(row.criteria)
        }));
    } catch (error) {
        console.error('Error getting unlocked achievements:', error);
        throw error;
    }
};

// Function to update user achievement progress
export const updateAchievementProgress = async (db, userId, achievementId, progress) => {
    try {
        await db.runAsync(
            `INSERT INTO UserAchievements (userId, achievementId, progress, unlocked)
             VALUES (?, ?, ?, 0)
             ON CONFLICT(userId, achievementId)
             DO UPDATE SET progress = ? WHERE UserAchievements.unlocked IS NOT 1`,
            [userId, achievementId, progress, progress]
        );
    } catch (error) {
        console.error('Error updating achievement progress:', error);
        throw error;
    }
};

// The caller owns the transaction covering both the unlock and the points.
export const unlockAchievementInTransaction = async (tx, userId, achievementId) => {
    const achievement = await getAchievementById(tx, achievementId);
    if (!achievement) throw new Error('Achievement not found');

    const unlocked = await tx.runAsync(
        `INSERT INTO UserAchievements (userId, achievementId, unlocked, unlockedAt)
         VALUES (?, ?, 1, CURRENT_TIMESTAMP)
         ON CONFLICT(userId, achievementId)
         DO UPDATE SET unlocked = 1, unlockedAt = CURRENT_TIMESTAMP
         WHERE UserAchievements.unlocked IS NOT 1`,
        [userId, achievementId]
    );
    if (unlocked.changes === 0) return null;

    const awarded = await tx.runAsync(
        'UPDATE Users SET totalPoints = COALESCE(totalPoints, 0) + ? WHERE id = ?',
        [achievement.points ?? 0, userId]
    );
    if (awarded.changes !== 1) throw new Error('Achievement user not found');
    return achievement;
};

export const unlockAchievement = (db, userId, achievementId) =>
    withSessionDatabaseTransaction(db, tx => unlockAchievementInTransaction(tx, userId, achievementId));

// Function to get total points for a user
export const getUserTotalPoints = async (db, userId) => {
    try {
        const result = await db.getAllAsync('SELECT totalPoints FROM Users WHERE id = ?', [userId]);
        return result[0]?.totalPoints || 0;
    } catch (error) {
        console.error('Error getting user total points:', error);
        throw error;
    }
};

// Function to get achievement progress for a user
export const getAchievementProgress = async (db, userId, achievementId) => {
    try {
        const result = await db.getAllAsync(
            'SELECT progress FROM UserAchievements WHERE userId = ? AND achievementId = ?',
            [userId, achievementId]
        );
        return result[0]?.progress || 0;
    } catch (error) {
        console.error('Error getting achievement progress:', error);
        throw error;
    }
};

// Function to check if achievement is unlocked
export const isAchievementUnlocked = async (db, userId, achievementId) => {
    try {
        const result = await db.getAllAsync(
            'SELECT unlocked FROM UserAchievements WHERE userId = ? AND achievementId = ?',
            [userId, achievementId]
        );
        return result[0]?.unlocked === 1;
    } catch (error) {
        console.error('Error checking achievement unlock status:', error);
        throw error;
    }
};

// Function to get achievements by category
export const getAchievementsByCategory = async (db, category) => {
    try {
        const allRows = await db.getAllAsync('SELECT * FROM Achievements WHERE category = ?', [category]);
        return allRows.map(row => ({
            ...row,
            criteria: JSON.parse(row.criteria)
        }));
    } catch (error) {
        console.error('Error getting achievements by category:', error);
        throw error;
    }
};

// Function to get achievements by tier
export const getAchievementsByTier = async (db, tier) => {
    try {
        const allRows = await db.getAllAsync('SELECT * FROM Achievements WHERE tier = ?', [tier]);
        return allRows.map(row => ({
            ...row,
            criteria: JSON.parse(row.criteria)
        }));
    } catch (error) {
        console.error('Error getting achievements by tier:', error);
        throw error;
    }
};

// Function to get user achievements with game information
export const getUserAchievementsWithGames = async (db, userId) => {
    try {
        const allRows = await db.getAllAsync(
            `SELECT a.*, ua.progress, ua.unlocked, ua.unlockedAt, g.title as gameTitle
             FROM Achievements a
             LEFT JOIN UserAchievements ua ON a.id = ua.achievementId AND ua.userId = ?
             LEFT JOIN Games g ON a.criteria LIKE '%"game"%' AND json_extract(a.criteria, '$.game') = g.title
             ORDER BY a.id`,
            [userId]
        );
        return allRows.map(row => ({
            ...row,
            criteria: JSON.parse(row.criteria)
        }));
    } catch (error) {
        console.error('Error getting user achievements with games:', error);
        throw error;
    }
};
