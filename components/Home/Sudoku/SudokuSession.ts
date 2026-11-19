import { checkMove, generateSudokuPuzzle } from '@/utils/SudokuGenerator';
import { generateSeedFromDate } from '@/utils/DailyChallenge';

export type SudokuSnapshot = {
    board: number[][];
    givens: number[][];
    solution: number[][];
    mistakes: number;
    frenzyResetAtMs: number;
};

const digits = [1, 2, 3, 4, 5, 6, 7, 8, 9];
const isGrid = (value: unknown): value is number[][] =>
    Array.isArray(value) && value.length === 9 && value.every(row =>
        Array.isArray(row) && row.length === 9 && row.every(cell => Number.isInteger(cell) && cell >= 0 && cell <= 9)
    );

export function isSudokuSnapshot(value: unknown): value is SudokuSnapshot {
    if (!value || typeof value !== 'object') return false;
    const { board, givens, solution, mistakes, frenzyResetAtMs } = value as Partial<SudokuSnapshot>;
    if (!isGrid(board) || !isGrid(givens) || !isGrid(solution) ||
        typeof mistakes !== 'number' || !Number.isSafeInteger(mistakes) || mistakes < 0 ||
        typeof frenzyResetAtMs !== 'number' || !Number.isFinite(frenzyResetAtMs) || frenzyResetAtMs < 0) return false;

    return solution.every((row, i) => {
        const boxRow = Math.floor(i / 3) * 3;
        const boxCol = (i % 3) * 3;
        return digits.every(digit =>
            row.includes(digit) &&
            solution.some(otherRow => otherRow[i] === digit) &&
            solution.slice(boxRow, boxRow + 3).some(otherRow => otherRow.slice(boxCol, boxCol + 3).includes(digit))
        ) && row.every((digit, j) =>
            (board[i][j] === 0 || board[i][j] === digit) &&
            (givens[i][j] === 0 || (givens[i][j] === digit && board[i][j] === digit))
        );
    });
}

export function createSudokuSnapshot(difficulty: string, dailyDate?: string): SudokuSnapshot {
    const puzzle = generateSudokuPuzzle(difficulty, dailyDate ? generateSeedFromDate(dailyDate) : undefined);
    if (!puzzle) throw new Error('Could not generate a Sudoku puzzle.');
    return {
        board: puzzle.puzzleBoard.map(row => [...row]),
        givens: puzzle.puzzleBoard,
        solution: puzzle.completeBoard,
        mistakes: 0,
        frenzyResetAtMs: 0,
    };
}

export function frenzyDurationMs(difficulty: string) {
    switch (difficulty) {
        case 'Easy': return 15000;
        case 'Medium': return 20000;
        case 'Hard': return 25000;
        case 'Extreme': return 30000;
        default: throw new Error(`Unknown Sudoku difficulty: ${difficulty}`);
    }
}

export function applySudokuMove(
    state: SudokuSnapshot, row: number, col: number, digit: number, mode: string, elapsedMs: number
): { snapshot: SudokuSnapshot; outcome?: 'win' | 'loss'; mistake?: boolean } | null {
    const cell = state.board[row]?.[col];
    if (cell === undefined || state.givens[row][col] !== 0 ||
        (digit !== -1 && !digits.includes(digit)) || (digit === -1 && cell === 0) || cell === digit) return null;

    if (digit !== -1 && !checkMove(state.solution, row, col, digit)) {
        const mistakes = state.mistakes + 1;
        return {
            snapshot: { ...state, mistakes },
            mistake: true,
            outcome: mode === 'Classic' && mistakes >= 4 ? 'loss' : undefined,
        };
    }

    const board = state.board.map((values, i) => i === row
        ? values.map((value, j) => j === col ? (digit === -1 ? 0 : digit) : value)
        : values);
    return {
        snapshot: {
            ...state,
            board,
            frenzyResetAtMs: mode === 'Frenzy' && digit !== -1 ? elapsedMs : state.frenzyResetAtMs,
        },
        outcome: board.every(values => values.every(Boolean)) ? 'win' : undefined,
    };
}
