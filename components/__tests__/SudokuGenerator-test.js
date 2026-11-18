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

    it('returns a failure instead of an ambiguous puzzle when retries cannot reach the target', () => {
        const random = jest.spyOn(Math, 'random').mockReturnValue(0);
        try {
            expect(generateSudokuPuzzle('Extreme')).toBeNull();
        } finally {
            random.mockRestore();
        }
    });
};

const digits = [1, 2, 3, 4, 5, 6, 7, 8, 9];
const coordinates = Array.from({ length: 81 }, (_, index) => ({
    row: Math.floor(index / 9),
    col: index % 9,
}));
const peers = coordinates.map(({ row, col }, index) => coordinates.flatMap((other, peer) =>
    peer !== index && (
        row === other.row || col === other.col ||
        (Math.floor(row / 3) === Math.floor(other.row / 3) &&
         Math.floor(col / 3) === Math.floor(other.col / 3))
    ) ? [peer] : []
));

// Verify independently using the shown digits, not the generator's internal solver.
const countSolutions = (cells) => {
    let bestIndex = -1;
    let bestDigits = null;
    for (let index = 0; index < cells.length; index++) {
        if (cells[index] !== 0) continue;
        const used = new Set(peers[index].map(peer => cells[peer]));
        const options = digits.filter(digit => !used.has(digit));
        if (options.length === 0) return 0;
        if (!bestDigits || options.length < bestDigits.length) {
            bestIndex = index;
            bestDigits = options;
            if (options.length === 1) break;
        }
    }
    if (bestIndex === -1) return 1;
    let count = 0;
    for (const digit of bestDigits) {
        cells[bestIndex] = digit;
        count += countSolutions(cells);
        if (count >= 2) break;
    }
    cells[bestIndex] = 0;
    return count;
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
            expect(countEmptyCells(puzzleBoard)).toBe(50);
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

        it.each([
            ['Easy', 30],
            ['Medium', 40],
            ['Hard', 50],
            ['Extreme', 55],
        ])('generates valid and uniquely solvable %s puzzles in both random and seeded mode',
            (difficulty, emptyTarget) => {
                for (let sample = 0; sample < 100; sample++) {
                    for (const seed of [undefined, sample]) {
                        const { completeBoard, puzzleBoard } = generateSudokuPuzzle(difficulty, seed);
                        const solution = completeBoard.flat();
                        const puzzle = puzzleBoard.flat();
                        expect(puzzle.length).toBe(81);
                        expect(countEmptyCells(puzzleBoard)).toBe(emptyTarget);
                        expect(solution.every((digit, index) =>
                            digits.includes(digit) && peers[index].every(peer => solution[peer] !== digit)
                        )).toBe(true);
                        expect(puzzle.every((digit, index) => digit === 0 || digit === solution[index])).toBe(true);
                        expect(countSolutions(puzzle)).toBe(1);
                    }
                }
            }
        );
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
