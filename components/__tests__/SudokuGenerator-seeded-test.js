import { generateSudokuPuzzle } from '../../utils/SudokuGenerator';

describe('SudokuGenerator with Seed', () => {
    describe('deterministic generation', () => {
        it('generates the same board with the same seed', () => {
            const seed = 12345;
            const { completeBoard: board1, puzzleBoard: puzzle1 } = generateSudokuPuzzle('Easy', seed);
            const { completeBoard: board2, puzzleBoard: puzzle2 } = generateSudokuPuzzle('Easy', seed);
            
            expect(JSON.stringify(board1)).toBe(JSON.stringify(board2));
            expect(JSON.stringify(puzzle1)).toBe(JSON.stringify(puzzle2));
        });

        it('generates different boards with different seeds', () => {
            const { completeBoard: board1 } = generateSudokuPuzzle('Easy', 12345);
            const { completeBoard: board2 } = generateSudokuPuzzle('Easy', 54321);
            
            expect(JSON.stringify(board1)).not.toBe(JSON.stringify(board2));
        });

        it('generates different boards with null seed (random)', () => {
            const { completeBoard: board1 } = generateSudokuPuzzle('Easy', null);
            const { completeBoard: board2 } = generateSudokuPuzzle('Easy', null);
            
            // With random generation, boards should be different most of the time
            // We generate multiple boards to increase confidence
            const boards = [];
            for (let i = 0; i < 5; i++) {
                const { completeBoard } = generateSudokuPuzzle('Easy', null);
                boards.push(completeBoard);
            }
            
            const firstRows = boards.map(board => board[0].join(','));
            const uniqueFirstRows = new Set(firstRows);
            
            // At least 3 out of 5 boards should have different first rows
            expect(uniqueFirstRows.size).toBeGreaterThanOrEqual(3);
        });

        it('generates valid boards with seed', () => {
            const seed = 99999;
            const { completeBoard } = generateSudokuPuzzle('Medium', seed);
            
            // Check all cells are filled
            for (let row = 0; row < 9; row++) {
                for (let col = 0; col < 9; col++) {
                    expect(completeBoard[row][col]).toBeGreaterThanOrEqual(1);
                    expect(completeBoard[row][col]).toBeLessThanOrEqual(9);
                }
            }

            // Validate rows contain all numbers 1-9
            for (let row = 0; row < 9; row++) {
                const seen = new Set(completeBoard[row]);
                expect(seen.size).toBe(9);
            }
        });

        it('respects difficulty levels with seed', () => {
            const seed = 77777;
            const { puzzleBoard: easy } = generateSudokuPuzzle('Easy', seed);
            
            // Count empty cells
            let emptyCount = 0;
            for (let row = 0; row < 9; row++) {
                for (let col = 0; col < 9; col++) {
                    if (easy[row][col] === 0) emptyCount++;
                }
            }
            
            expect(emptyCount).toBe(30);
        });
    });
});
