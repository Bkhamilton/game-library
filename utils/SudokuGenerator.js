// Description: This file contains the functions to generate a complete Sudoku board and create a Sudoku puzzle with the given difficulty.

// Seeded random number generator (Mulberry32)
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

// Generate a complete Sudoku board
const generateCompleteBoard = (rng = null) => {
    const board = Array.from({ length: 9 }, () => Array(9).fill(0));
    return fillBoard(board, rng, { nodesLeft: MAX_SEARCH_NODES }) ? board : null;
};

// Fill the board with a valid Sudoku solution
const fillBoard = (board, rng, budget) => {
    if (budget.nodesLeft === 0) return false;
    budget.nodesLeft--;
    const findEmpty = () => {
        for (let row = 0; row < 9; row++) {
            for (let col = 0; col < 9; col++) {
                if (board[row][col] === 0) return [row, col];
            }
        }
        return null;
    };

    const isValid = (num, pos) => {
        const [row, col] = pos;

        for (let i = 0; i < 9; i++) {
            if (board[row][i] === num && col !== i) return false;
            if (board[i][col] === num && row !== i) return false;
            const boxRow = 3 * Math.floor(row / 3) + Math.floor(i / 3);
            const boxCol = 3 * Math.floor(col / 3) + i % 3;
            if (board[boxRow][boxCol] === num && (boxRow !== row || boxCol !== col)) return false;
        }
        return true;
    };

    const emptyPos = findEmpty();
    if (!emptyPos) return true;

    const [row, col] = emptyPos;
    // Shuffle numbers 1-9 to avoid predictable patterns
    const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9];
    for (let i = numbers.length - 1; i > 0; i--) {
        const j = Math.floor((rng ? rng.next() : Math.random()) * (i + 1));
        [numbers[i], numbers[j]] = [numbers[j], numbers[i]];
    }
    
    for (let num of numbers) {
        if (isValid(num, [row, col])) {
            board[row][col] = num;
            if (fillBoard(board, rng, budget)) return true;
            board[row][col] = 0;
            if (budget.nodesLeft === 0) return false;
        }
    }
    return false;
};

const EMPTY_CELLS = { Easy: 30, Medium: 40, Hard: 50, Extreme: 55 };
const MAX_GENERATION_ATTEMPTS = 12;
const MAX_SEARCH_NODES = 10_000;
const ALL_DIGITS = 0b111111111;
const boxIndex = (row, col) => 3 * Math.floor(row / 3) + Math.floor(col / 3);

const hasUniqueSolution = (puzzle) => {
    const rows = new Uint16Array(9);
    const cols = new Uint16Array(9);
    const boxes = new Uint16Array(9);
    const empty = [];
    for (let row = 0; row < 9; row++) {
        for (let col = 0; col < 9; col++) {
            const box = boxIndex(row, col);
            const digit = puzzle[row][col];
            if (digit === 0) {
                empty.push({ row, col, box });
            } else {
                const bit = 1 << (digit - 1);
                rows[row] |= bit;
                cols[col] |= bit;
                boxes[box] |= bit;
            }
        }
    }

    let solutions = 0;
    let nodesLeft = MAX_SEARCH_NODES;
    const search = (depth) => {
        if (solutions === 2 || nodesLeft === 0) return;
        nodesLeft--;
        if (depth === empty.length) {
            solutions++;
            return;
        }

        // Branch on the empty cell with the fewest legal digits.
        let bestIndex = depth;
        let bestMask = 0;
        let bestCount = 10;
        for (let i = depth; i < empty.length; i++) {
            const { row, col, box } = empty[i];
            const mask = ALL_DIGITS & ~(rows[row] | cols[col] | boxes[box]);
            if (mask === 0) return;
            let count = 0;
            for (let bits = mask; bits; bits &= bits - 1) count++;
            if (count < bestCount) {
                bestIndex = i;
                bestMask = mask;
                bestCount = count;
                if (count === 1) break;
            }
        }

        [empty[depth], empty[bestIndex]] = [empty[bestIndex], empty[depth]];
        const { row, col, box } = empty[depth];
        for (let mask = bestMask; mask && solutions < 2 && nodesLeft > 0; mask &= mask - 1) {
            const bit = mask & -mask;
            rows[row] |= bit;
            cols[col] |= bit;
            boxes[box] |= bit;
            search(depth + 1);
            rows[row] ^= bit;
            cols[col] ^= bit;
            boxes[box] ^= bit;
        }
        [empty[depth], empty[bestIndex]] = [empty[bestIndex], empty[depth]];
    };
    search(0);

    // A search that ran out of budget has not proved uniqueness.
    return solutions === 1 && nodesLeft > 0;
};

const createPuzzle = (board, emptyTarget, rng) => {
    const puzzle = board.map(row => row.slice());
    const positions = Array.from({ length: 81 }, (_, index) => index);
    for (let i = positions.length - 1; i > 0; i--) {
        const j = Math.floor((rng ? rng.next() : Math.random()) * (i + 1));
        [positions[i], positions[j]] = [positions[j], positions[i]];
    }

    let removed = 0;
    for (const index of positions) {
        const row = Math.floor(index / 9);
        const col = index % 9;
        puzzle[row][col] = 0;
        if (!hasUniqueSolution(puzzle)) {
            puzzle[row][col] = board[row][col];
        } else if (++removed === emptyTarget) {
            return puzzle;
        }
    }
    return null;
};

/**
 * @param {string} difficulty
 * @param {number | null} [seed]
 */
export const generateSudokuPuzzle = (difficulty, seed = undefined) => {
    const rng = seed !== null && seed !== undefined ? new SeededRandom(seed) : null;
    if (!Object.hasOwn(EMPTY_CELLS, difficulty)) return null;
    const emptyTarget = EMPTY_CELLS[difficulty];
    for (let attempt = 0; attempt < MAX_GENERATION_ATTEMPTS; attempt++) {
        const completeBoard = generateCompleteBoard(rng);
        if (!completeBoard) continue;
        const puzzleBoard = createPuzzle(completeBoard, emptyTarget, rng);
        if (puzzleBoard) return { completeBoard, puzzleBoard };
    }
    return null;
};

// Check if the move is valid
export const checkMove = (solvedBoard, row, col, value) => {
    return solvedBoard[row][col] === value;
};
