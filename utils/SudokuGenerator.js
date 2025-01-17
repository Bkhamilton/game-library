// Description: This file contains the functions to generate a complete Sudoku board and create a Sudoku puzzle with the given difficulty.

// Generate a complete Sudoku board
const generateCompleteBoard = () => {
    const board = Array.from({ length: 9 }, () => Array(9).fill(0));
    fillBoard(board);
    return board;
};

// Fill the board with a valid Sudoku solution
const fillBoard = (board) => {
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
    for (let num = 1; num <= 9; num++) {
        if (isValid(num, [row, col])) {
            board[row][col] = num;
            if (fillBoard(board)) return true;
            board[row][col] = 0;
        }
    }
    return false;
};

// Create a Sudoku puzzle by removing numbers from the complete board
const createPuzzle = (board, difficulty) => {
    const emptySpaces = difficulty === 'Easy' ? 30 : difficulty === 'Medium' ? 40 : difficulty === 'Hard' ? 60 : 65;
    const puzzle = board.map(row => row.slice());

    let count = 0;
    while (count < emptySpaces) {
        const row = Math.floor(Math.random() * 9);
        const col = Math.floor(Math.random() * 9);
        if (puzzle[row][col] !== 0) {
            puzzle[row][col] = 0;
            count++;
        }
    }
    return puzzle;
};

// Check if the Sudoku board is solvable
const isSolvable = (board) => {
    const solve = (board) => {
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
        for (let num = 1; num <= 9; num++) {
            if (isValid(num, [row, col])) {
                board[row][col] = num;
                if (solve(board)) return true;
                board[row][col] = 0;
            }
        }
        return false;
    };

    const boardCopy = board.map(row => row.slice());
    return solve(boardCopy);
};

// Generate a Sudoku puzzle with the given difficulty
export const generateSudokuPuzzle = (difficulty) => {
    let board;
    do {
        board = generateCompleteBoard();
        board = createPuzzle(board, difficulty);
    } while (!isSolvable(board));
    return board;
};

