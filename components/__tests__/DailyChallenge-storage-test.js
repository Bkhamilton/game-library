import AsyncStorage from '@react-native-async-storage/async-storage';
import {
    isDailyChallengeCompleted,
    markDailyChallengeCompleted,
    getDailyKey,
} from '../../utils/DailyChallenge';

// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () => ({
    getItem: jest.fn(),
    setItem: jest.fn(),
}));

describe('DailyChallenge AsyncStorage Integration', () => {
    beforeEach(() => {
        // Clear all mocks before each test
        jest.clearAllMocks();
    });

    describe('isDailyChallengeCompleted', () => {
        it('returns false when daily challenge has not been completed', async () => {
            AsyncStorage.getItem.mockResolvedValue(null);

            const result = await isDailyChallengeCompleted('Sudoku', 'Easy');

            expect(result).toBe(false);
            expect(AsyncStorage.getItem).toHaveBeenCalledWith(
                expect.stringContaining('dailyChallenge_Sudoku_Easy')
            );
        });

        it('returns true when daily challenge has been completed', async () => {
            AsyncStorage.getItem.mockResolvedValue('completed');

            const result = await isDailyChallengeCompleted('Sudoku', 'Easy');

            expect(result).toBe(true);
            expect(AsyncStorage.getItem).toHaveBeenCalledWith(
                expect.stringContaining('dailyChallenge_Sudoku_Easy')
            );
        });

        it('uses the correct storage key format', async () => {
            AsyncStorage.getItem.mockResolvedValue(null);
            const dailyKey = getDailyKey();

            await isDailyChallengeCompleted('Sudoku', 'Medium');

            expect(AsyncStorage.getItem).toHaveBeenCalledWith(
                `dailyChallenge_Sudoku_Medium_${dailyKey}`
            );
        });

        it('handles AsyncStorage errors gracefully', async () => {
            AsyncStorage.getItem.mockRejectedValue(new Error('Storage error'));

            const result = await isDailyChallengeCompleted('Sudoku', 'Hard');

            expect(result).toBe(false);
        });
    });

    describe('markDailyChallengeCompleted', () => {
        it('sets completion status in AsyncStorage', async () => {
            AsyncStorage.setItem.mockResolvedValue();

            await markDailyChallengeCompleted('Sudoku', 'Easy');

            expect(AsyncStorage.setItem).toHaveBeenCalledWith(
                expect.stringContaining('dailyChallenge_Sudoku_Easy'),
                'completed'
            );
        });

        it('uses the correct storage key format', async () => {
            AsyncStorage.setItem.mockResolvedValue();
            const dailyKey = getDailyKey();

            await markDailyChallengeCompleted('Sudoku', 'Expert');

            expect(AsyncStorage.setItem).toHaveBeenCalledWith(
                `dailyChallenge_Sudoku_Expert_${dailyKey}`,
                'completed'
            );
        });

        it('handles AsyncStorage errors gracefully', async () => {
            AsyncStorage.setItem.mockRejectedValue(new Error('Storage error'));

            // Should not throw
            await expect(
                markDailyChallengeCompleted('Sudoku', 'Medium')
            ).resolves.toBeUndefined();
        });
    });

    describe('Daily Challenge workflow', () => {
        it('correctly tracks completion flow', async () => {
            // Initially not completed
            AsyncStorage.getItem.mockResolvedValue(null);
            let isCompleted = await isDailyChallengeCompleted('Sudoku', 'Easy');
            expect(isCompleted).toBe(false);

            // Mark as completed
            AsyncStorage.setItem.mockResolvedValue();
            await markDailyChallengeCompleted('Sudoku', 'Easy');

            // Now should be completed
            AsyncStorage.getItem.mockResolvedValue('completed');
            isCompleted = await isDailyChallengeCompleted('Sudoku', 'Easy');
            expect(isCompleted).toBe(true);
        });

        it('tracks different difficulties independently', async () => {
            const dailyKey = getDailyKey();

            // Check Easy
            AsyncStorage.getItem.mockResolvedValue(null);
            await isDailyChallengeCompleted('Sudoku', 'Easy');
            expect(AsyncStorage.getItem).toHaveBeenLastCalledWith(
                `dailyChallenge_Sudoku_Easy_${dailyKey}`
            );

            // Check Medium
            AsyncStorage.getItem.mockResolvedValue(null);
            await isDailyChallengeCompleted('Sudoku', 'Medium');
            expect(AsyncStorage.getItem).toHaveBeenLastCalledWith(
                `dailyChallenge_Sudoku_Medium_${dailyKey}`
            );

            // Verify they use different keys
            const calls = AsyncStorage.getItem.mock.calls;
            expect(calls[0][0]).not.toBe(calls[1][0]);
        });
    });
});
