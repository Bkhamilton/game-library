import GameModes from '../../constants/GameModes';

describe('GameModes', () => {
  it('should be defined', () => {
    expect(GameModes).toBeDefined();
  });

  it('should contain modes for all expected games', () => {
    const expectedGames = [
      'Sudoku', 'Crossword', 'Word Search', 'Minesweeper',
      'Ostrich Haul', 'GoGoBird', '2048', 'Memory Match',
      'Simon Says', 'Connect Four', 'DolphinDive'
    ];

    expectedGames.forEach(game => {
      expect(GameModes[game]).toBeDefined();
      expect(Array.isArray(GameModes[game])).toBe(true);
      expect(GameModes[game].length).toBeGreaterThan(0);
    });
  });

  it('should include Classic mode for all games', () => {
    Object.values(GameModes).forEach(modes => {
      expect(modes).toContain('Classic');
    });
  });

  it('should contain only valid mode types', () => {
    const validModes = ['Classic', 'Frenzy', 'Daily Challenge'];
    
    Object.values(GameModes).forEach(modes => {
      modes.forEach(mode => {
        expect(validModes).toContain(mode);
      });
    });
  });

  it('should restrict Ostrich Haul, GoGoBird, and DolphinDive to Classic mode only', () => {
    const classicOnlyGames = ['Ostrich Haul', 'GoGoBird', 'DolphinDive'];
    
    classicOnlyGames.forEach(game => {
      expect(GameModes[game]).toBeDefined();
      expect(GameModes[game]).toEqual(['Classic']);
      expect(GameModes[game].length).toBe(1);
    });
  });
});
