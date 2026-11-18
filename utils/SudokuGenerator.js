import puzzles from '../data/sudoku-puzzles.json';
import { gradeSudokuPuzzle } from './SudokuLogic';

class SeededRandom {
    constructor(seed) {
        this.seed = seed;
    }

    next() {
        let t = this.seed += 0x6D2B79F5;
        t = Math.imul(t ^ t >>> 15, t | 1);
        t ^= t + Math.imul(t ^ t >>> 7, t | 61);
        return ((t ^ t >>> 14) >>> 0) / 4294967296;
    }
}

const MAX_TRANSFORM_ATTEMPTS = 12;

const shuffle = (items, random) => {
    const result = [...items];
    for (let i = result.length - 1; i > 0; i--) {
        const j = Math.floor(random() * (i + 1));
        [result[i], result[j]] = [result[j], result[i]];
    }
    return result;
};

const parsePuzzle = encoded => Array.from({ length: 9 }, (_, row) =>
    Array.from({ length: 9 }, (_, col) => Number(encoded[row * 9 + col]))
);

const transformPuzzle = (puzzle, random) => {
    const digits = shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9], random);
    const axisOrder = () => shuffle([0, 1, 2], random)
        .flatMap(group => shuffle([0, 1, 2], random).map(offset => group * 3 + offset));
    const rows = axisOrder();
    const cols = axisOrder();
    const transpose = random() < 0.5;
    return rows.map(row => cols.map(col => {
        const value = transpose ? puzzle[col][row] : puzzle[row][col];
        return value === 0 ? 0 : digits[value - 1];
    }));
};

/**
 * Supply a uniquely solvable puzzle in the exact requested logical band.
 * @param {string} difficulty
 * @param {number | null} [seed]
 */
export const generateSudokuPuzzle = (difficulty, seed = undefined) => {
    if (!Object.hasOwn(puzzles, difficulty)) {
        throw new Error(`Unknown Sudoku difficulty: ${difficulty}`);
    }
    const rng = seed !== null && seed !== undefined ? new SeededRandom(seed) : null;
    const random = () => rng ? rng.next() : Math.random();
    const collection = puzzles[difficulty];
    const original = parsePuzzle(collection[Math.floor(random() * collection.length)]);

    for (let attempt = 0; attempt <= MAX_TRANSFORM_ATTEMPTS; attempt++) {
        // Transforms preserve uniqueness, but deduction order can change the rating.
        // If transforms miss the band, try the rated original, never an easier band.
        const puzzleBoard = attempt === MAX_TRANSFORM_ATTEMPTS ? original : transformPuzzle(original, random);
        const grade = gradeSudokuPuzzle(puzzleBoard);
        if (grade.status === 'solved' && grade.difficulty === difficulty) {
            return { completeBoard: grade.board, puzzleBoard };
        }
    }
    return null;
};

export const checkMove = (solvedBoard, row, col, value) => solvedBoard[row][col] === value;
