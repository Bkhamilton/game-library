import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * Generate a unique key for the current day
 * Format: YYYY-MM-DD
 */
export const getDailyKey = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};

/**
 * Generate a seed number from a date string
 * This creates a deterministic number based on the date
 */
export const generateSeedFromDate = (dateKey) => {
    let hash = 0;
    for (let i = 0; i < dateKey.length; i++) {
        const char = dateKey.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash);
};

/**
 * Check if the daily challenge has been completed for a specific game and difficulty
 * @param {string} gameName - Name of the game (e.g., 'Sudoku')
 * @param {string} difficulty - Difficulty level
 * @returns {Promise<boolean>} - True if completed today, false otherwise
 */
export const isDailyChallengeCompleted = async (gameName, difficulty) => {
    try {
        const dailyKey = getDailyKey();
        const storageKey = `dailyChallenge_${gameName}_${difficulty}_${dailyKey}`;
        const value = await AsyncStorage.getItem(storageKey);
        return value === 'completed';
    } catch (error) {
        console.error('Error checking daily challenge status:', error);
        return false;
    }
};

/**
 * Mark the daily challenge as completed for a specific game and difficulty
 * @param {string} gameName - Name of the game (e.g., 'Sudoku')
 * @param {string} difficulty - Difficulty level
 */
export const markDailyChallengeCompleted = async (gameName, difficulty) => {
    try {
        const dailyKey = getDailyKey();
        const storageKey = `dailyChallenge_${gameName}_${difficulty}_${dailyKey}`;
        await AsyncStorage.setItem(storageKey, 'completed');
    } catch (error) {
        console.error('Error marking daily challenge as completed:', error);
    }
};

/**
 * Get today's seed for generating deterministic puzzles
 * @returns {number} - Seed based on today's date
 */
export const getTodaysSeed = () => {
    const dailyKey = getDailyKey();
    return generateSeedFromDate(dailyKey);
};
