import games from '../../data/games.json';
import birdAchievements from '../../data/achievements/gogobird.json';
import ostrichAchievements from '../../data/achievements/ostrich-haul.json';
import sudokuAchievements from '../../data/achievements/sudoku.json';
import { isAchievementVisible, isGameVisible } from '../../utils/gameVisibility';

describe('Puzzle collection visibility', () => {
    it('hides arcade entries from existing catalog rows without removing saved data', () => {
        const storedGames = games.map(game => ({ ...game }));
        const visibleGames = storedGames.filter(game => isGameVisible(game.title));

        expect(visibleGames.map(game => game.title)).toEqual([
            'Sudoku',
            'Word Search',
            'Crossword',
            'Minesweeper',
            '2048',
            'Memory Match',
            'Simon Says',
            'Connect Four',
        ]);
        expect(storedGames).toEqual(games);
        expect(storedGames.filter(game => !isGameVisible(game.title)).map(game => game.title))
            .toEqual(['Ostrich Haul', 'GoGoBird', 'DolphinDive']);
    });

    it('hides arcade achievement definitions but preserves puzzle and general achievements', () => {
        const generalAchievement = { criteria: { metric: 'totalAchievements', threshold: 10 } };
        const achievements = [
            ...birdAchievements,
            ...ostrichAchievements,
            ...sudokuAchievements,
            generalAchievement,
            { criteria: { game: 'DolphinDive' } },
            { criteria: { game: 'Dolphin Dive' } },
        ];

        expect(achievements.filter(isAchievementVisible))
            .toEqual([...sudokuAchievements, generalAchievement]);
    });
});
