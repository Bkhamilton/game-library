import {
    getDifficultySettings,
    getTileColors,
    addToSequence,
    calculatePlaybackSpeed,
    checkPartialSequence,
    checkSequenceMatch,
} from '../../utils/SimonSaysGenerator';

describe('SimonSaysGenerator', () => {
    describe('getDifficultySettings', () => {
        it('returns correct settings for Easy difficulty', () => {
            const settings = getDifficultySettings('Easy');
            expect(settings.tileCount).toBe(4);
            expect(settings.gridLayout).toEqual({ rows: 2, cols: 2 });
            expect(settings.initialSpeed).toBe(800);
            expect(settings.speedDecrement).toBe(20);
            expect(settings.minSpeed).toBe(400);
        });

        it('returns correct settings for Medium difficulty', () => {
            const settings = getDifficultySettings('Medium');
            expect(settings.tileCount).toBe(6);
            expect(settings.gridLayout).toEqual({ rows: 2, cols: 3 });
            expect(settings.initialSpeed).toBe(600);
            expect(settings.speedDecrement).toBe(30);
            expect(settings.minSpeed).toBe(250);
        });

        it('returns correct settings for Hard difficulty', () => {
            const settings = getDifficultySettings('Hard');
            expect(settings.tileCount).toBe(9);
            expect(settings.gridLayout).toEqual({ rows: 3, cols: 3 });
            expect(settings.initialSpeed).toBe(500);
            expect(settings.speedDecrement).toBe(40);
            expect(settings.minSpeed).toBe(150);
        });

        it('defaults to Easy for unknown difficulty', () => {
            const settings = getDifficultySettings('Unknown');
            expect(settings.tileCount).toBe(4);
        });
    });

    describe('getTileColors', () => {
        it('returns 4 colors for Easy difficulty', () => {
            const colors = getTileColors('Easy');
            expect(colors.length).toBe(4);
            expect(colors).toEqual(['red', 'blue', 'green', 'yellow']);
        });

        it('returns 6 colors for Medium difficulty', () => {
            const colors = getTileColors('Medium');
            expect(colors.length).toBe(6);
        });

        it('returns 9 colors for Hard difficulty', () => {
            const colors = getTileColors('Hard');
            expect(colors.length).toBe(9);
        });
    });

    describe('addToSequence', () => {
        it('adds a new tile to an empty sequence', () => {
            const newSequence = addToSequence([], 4);
            expect(newSequence.length).toBe(1);
            expect(newSequence[0]).toBeGreaterThanOrEqual(0);
            expect(newSequence[0]).toBeLessThan(4);
        });

        it('adds a new tile to an existing sequence', () => {
            const currentSequence = [0, 1, 2];
            const newSequence = addToSequence(currentSequence, 4);
            expect(newSequence.length).toBe(4);
            expect(newSequence.slice(0, 3)).toEqual(currentSequence);
        });

        it('does not mutate the original sequence', () => {
            const currentSequence = [0, 1, 2];
            const originalCopy = [...currentSequence];
            addToSequence(currentSequence, 4);
            expect(currentSequence).toEqual(originalCopy);
        });
    });

    describe('calculatePlaybackSpeed', () => {
        const easySettings = getDifficultySettings('Easy');
        const hardSettings = getDifficultySettings('Hard');

        it('returns initial speed for round 1', () => {
            const speed = calculatePlaybackSpeed(1, easySettings);
            expect(speed).toBe(easySettings.initialSpeed - easySettings.speedDecrement);
        });

        it('decreases speed as rounds increase', () => {
            const speed1 = calculatePlaybackSpeed(1, easySettings);
            const speed2 = calculatePlaybackSpeed(2, easySettings);
            expect(speed2).toBeLessThan(speed1);
        });

        it('never goes below minimum speed', () => {
            const speed = calculatePlaybackSpeed(100, easySettings);
            expect(speed).toBe(easySettings.minSpeed);
        });

        it('hard difficulty speeds up faster', () => {
            const easySpeed = calculatePlaybackSpeed(5, easySettings);
            const hardSpeed = calculatePlaybackSpeed(5, hardSettings);
            expect(hardSpeed).toBeLessThan(easySpeed);
        });
    });

    describe('checkSequenceMatch', () => {
        it('returns true for matching sequences', () => {
            expect(checkSequenceMatch([0, 1, 2], [0, 1, 2])).toBe(true);
        });

        it('returns false for non-matching sequences', () => {
            expect(checkSequenceMatch([0, 1, 2], [0, 1, 3])).toBe(false);
        });

        it('returns false for sequences of different lengths', () => {
            expect(checkSequenceMatch([0, 1], [0, 1, 2])).toBe(false);
        });

        it('returns true for empty sequences', () => {
            expect(checkSequenceMatch([], [])).toBe(true);
        });
    });

    describe('checkPartialSequence', () => {
        const targetSequence = [0, 1, 2, 3];

        it('returns true for correct partial sequence', () => {
            expect(checkPartialSequence([0, 1], targetSequence)).toBe(true);
        });

        it('returns false for incorrect partial sequence', () => {
            expect(checkPartialSequence([0, 2], targetSequence)).toBe(false);
        });

        it('returns false if user sequence is longer than target', () => {
            expect(checkPartialSequence([0, 1, 2, 3, 4], targetSequence)).toBe(false);
        });

        it('returns true for empty user sequence', () => {
            expect(checkPartialSequence([], targetSequence)).toBe(true);
        });

        it('returns true for complete matching sequence', () => {
            expect(checkPartialSequence([0, 1, 2, 3], targetSequence)).toBe(true);
        });
    });
});
