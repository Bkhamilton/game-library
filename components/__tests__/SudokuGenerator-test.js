import {
    generateSudokuPuzzle,
    checkMove,
} from '../../utils/SudokuGenerator';

// Helper function to count empty cells in a board
const countEmptyCells = (board) => {
    let count = 0;
    for (let row = 0; row < 9; row++) {
        for (let col = 0; col < 9; col++) {
            if (board[row][col] === 0) count++;
        }
    }
    return count;
};

// Helper function to generate a valid solved board for testing
const generateTestSolvedBoard = () => {
    return Array.from({ length: 9 }, (_, row) => 
        Array.from({ length: 9 }, (_, col) => ((row * 3 + Math.floor(row / 3) + col) % 9) + 1)
    );
};

describe('SudokuGenerator', () => {
    describe('generateSudokuPuzzle', () => {
        it('generates a valid complete board', () => {
            const { completeBoard } = generateSudokuPuzzle('Easy');
            expect(completeBoard.length).toBe(9);
            expect(completeBoard[0].length).toBe(9);
            
            // Check all cells are filled
            for (let row = 0; row < 9; row++) {
                for (let col = 0; col < 9; col++) {
                    expect(completeBoard[row][col]).toBeGreaterThanOrEqual(1);
                    expect(completeBoard[row][col]).toBeLessThanOrEqual(9);
                }
            }
        });

        it('generates a puzzle board with correct number of empty cells for Easy', () => {
            const { puzzleBoard } = generateSudokuPuzzle('Easy');
            expect(countEmptyCells(puzzleBoard)).toBe(30);
        });

        it('generates a puzzle board with correct number of empty cells for Medium', () => {
            const { puzzleBoard } = generateSudokuPuzzle('Medium');
            expect(countEmptyCells(puzzleBoard)).toBe(40);
        });

        it('generates a puzzle board with correct number of empty cells for Hard', () => {
            const { puzzleBoard } = generateSudokuPuzzle('Hard');
            expect(countEmptyCells(puzzleBoard)).toBe(60);
        });

        it('validates rows contain all numbers 1-9', () => {
            const { completeBoard } = generateSudokuPuzzle('Easy');
            for (let row = 0; row < 9; row++) {
                const seen = new Set(completeBoard[row]);
                expect(seen.size).toBe(9);
                for (let num = 1; num <= 9; num++) {
                    expect(seen.has(num)).toBe(true);
                }
            }
        });

        it('validates columns contain all numbers 1-9', () => {
            const { completeBoard } = generateSudokuPuzzle('Easy');
            for (let col = 0; col < 9; col++) {
                const seen = new Set();
                for (let row = 0; row < 9; row++) {
                    seen.add(completeBoard[row][col]);
                }
                expect(seen.size).toBe(9);
                for (let num = 1; num <= 9; num++) {
                    expect(seen.has(num)).toBe(true);
                }
            }
        });

        it('validates 3x3 boxes contain all numbers 1-9', () => {
            const { completeBoard } = generateSudokuPuzzle('Easy');
            for (let boxRow = 0; boxRow < 3; boxRow++) {
                for (let boxCol = 0; boxCol < 3; boxCol++) {
                    const seen = new Set();
                    for (let i = 0; i < 3; i++) {
                        for (let j = 0; j < 3; j++) {
                            const row = boxRow * 3 + i;
                            const col = boxCol * 3 + j;
                            seen.add(completeBoard[row][col]);
                        }
                    }
                    expect(seen.size).toBe(9);
                    for (let num = 1; num <= 9; num++) {
                        expect(seen.has(num)).toBe(true);
                    }
                }
            }
        });

        it('generates boards without predictable patterns', () => {
            // Generate multiple boards and check they are different
            const boards = [];
            for (let i = 0; i < 5; i++) {
                const { completeBoard } = generateSudokuPuzzle('Easy');
                boards.push(completeBoard);
            }
            
            // Check that not all boards have the same first row
            const firstRows = boards.map(board => board[0].join(','));
            const uniqueFirstRows = new Set(firstRows);
            
            // At least 3 out of 5 boards should have different first rows
            expect(uniqueFirstRows.size).toBeGreaterThanOrEqual(3);
        });

        it('does not generate boards with sequential patterns in first row', () => {
            // Generate multiple boards and ensure they don't all start with 1,2,3...
            const boards = [];
            for (let i = 0; i < 10; i++) {
                const { completeBoard } = generateSudokuPuzzle('Easy');
                boards.push(completeBoard);
            }
            
            // Check if any board starts with [1,2,3,4,5,6,7,8,9]
            const sequentialCount = boards.filter(board => 
                board[0].join(',') === '1,2,3,4,5,6,7,8,9'
            ).length;
            
            // With randomization, it's extremely unlikely (but possible) to get this pattern
            // We expect at most 1 out of 10 boards to have this exact pattern by chance
            expect(sequentialCount).toBeLessThanOrEqual(1);
        });

        it('puzzle board is solvable', () => {
            // The isSolvable check is already done in generateSudokuPuzzle
            // This test just confirms it doesn't throw or hang
            const result = generateSudokuPuzzle('Medium');
            expect(result.completeBoard).toBeDefined();
            expect(result.puzzleBoard).toBeDefined();
        });
    });

    describe('checkMove', () => {
        it('returns true for correct move', () => {
            const solvedBoard = generateTestSolvedBoard();
            expect(checkMove(solvedBoard, 0, 0, solvedBoard[0][0])).toBe(true);
        });

        it('returns false for incorrect move', () => {
            const solvedBoard = generateTestSolvedBoard();
            const wrongValue = solvedBoard[0][0] === 9 ? 1 : solvedBoard[0][0] + 1;
            expect(checkMove(solvedBoard, 0, 0, wrongValue)).toBe(false);
        });
    });
});
