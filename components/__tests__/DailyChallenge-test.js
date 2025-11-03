import { 
    getDailyKey, 
    generateSeedFromDate, 
    getTodaysSeed 
} from '../../utils/DailyChallenge';

// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () => ({
    getItem: jest.fn(),
    setItem: jest.fn(),
}));

describe('DailyChallenge', () => {
    describe('getDailyKey', () => {
        it('returns a properly formatted date string', () => {
            const key = getDailyKey();
            // Should match YYYY-MM-DD format
            expect(key).toMatch(/^\d{4}-\d{2}-\d{2}$/);
        });

        it('returns consistent key for same day', () => {
            const key1 = getDailyKey();
            const key2 = getDailyKey();
            expect(key1).toBe(key2);
        });
    });

    describe('generateSeedFromDate', () => {
        it('generates consistent seed for same date string', () => {
            const dateKey = '2025-01-15';
            const seed1 = generateSeedFromDate(dateKey);
            const seed2 = generateSeedFromDate(dateKey);
            expect(seed1).toBe(seed2);
        });

        it('generates different seeds for different dates', () => {
            const seed1 = generateSeedFromDate('2025-01-15');
            const seed2 = generateSeedFromDate('2025-01-16');
            expect(seed1).not.toBe(seed2);
        });

        it('returns a positive integer', () => {
            const seed = generateSeedFromDate('2025-01-15');
            expect(seed).toBeGreaterThan(0);
            expect(Number.isInteger(seed)).toBe(true);
        });
    });

    describe('getTodaysSeed', () => {
        it('returns consistent seed for same day', () => {
            const seed1 = getTodaysSeed();
            const seed2 = getTodaysSeed();
            expect(seed1).toBe(seed2);
        });

        it('returns a positive integer', () => {
            const seed = getTodaysSeed();
            expect(seed).toBeGreaterThan(0);
            expect(Number.isInteger(seed)).toBe(true);
        });
    });
});
