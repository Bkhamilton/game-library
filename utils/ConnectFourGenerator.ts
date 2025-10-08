// Connect Four Game Generator and Logic

export type Cell = 'empty' | 'player' | 'ai';

export type Board = Cell[][];

export type Difficulty = 'Easy' | 'Medium' | 'Hard' | string;

export type Player = 'player' | 'ai';

// Connect Four standard board is 7 columns x 6 rows
export const ROWS = 6;
export const COLS = 7;

// Initialize an empty Connect Four board
export const initializeBoard = (): Board => {
    const board: Board = [];
    for (let i = 0; i < ROWS; i++) {
        const row: Cell[] = [];
        for (let j = 0; j < COLS; j++) {
            row.push('empty');
        }
        board.push(row);
    }
    return board;
};

// Get the next available row in a column (for disc dropping)
export const getNextAvailableRow = (board: Board, col: number): number | null => {
    // Start from bottom row and work up
    for (let row = ROWS - 1; row >= 0; row--) {
        if (board[row][col] === 'empty') {
            return row;
        }
    }
    return null; // Column is full
};

// Check if a column is full
export const isColumnFull = (board: Board, col: number): boolean => {
    return board[0][col] !== 'empty';
};

// Place a disc in a column
export const placeDisc = (board: Board, col: number, player: Player): Board | null => {
    const row = getNextAvailableRow(board, col);
    
    if (row === null) {
        return null; // Column is full, invalid move
    }
    
    // Create a new board with the disc placed
    const newBoard = board.map(r => [...r]);
    newBoard[row][col] = player;
    
    return newBoard;
};

// Check if there are any valid moves left
export const hasValidMoves = (board: Board): boolean => {
    for (let col = 0; col < COLS; col++) {
        if (!isColumnFull(board, col)) {
            return true;
        }
    }
    return false;
};

// Check for a winner (4 in a row)
export const checkWinner = (board: Board): Player | null => {
    // Check horizontal
    for (let row = 0; row < ROWS; row++) {
        for (let col = 0; col <= COLS - 4; col++) {
            const cell = board[row][col];
            if (cell !== 'empty' &&
                cell === board[row][col + 1] &&
                cell === board[row][col + 2] &&
                cell === board[row][col + 3]) {
                return cell;
            }
        }
    }
    
    // Check vertical
    for (let row = 0; row <= ROWS - 4; row++) {
        for (let col = 0; col < COLS; col++) {
            const cell = board[row][col];
            if (cell !== 'empty' &&
                cell === board[row + 1][col] &&
                cell === board[row + 2][col] &&
                cell === board[row + 3][col]) {
                return cell;
            }
        }
    }
    
    // Check diagonal (down-right)
    for (let row = 0; row <= ROWS - 4; row++) {
        for (let col = 0; col <= COLS - 4; col++) {
            const cell = board[row][col];
            if (cell !== 'empty' &&
                cell === board[row + 1][col + 1] &&
                cell === board[row + 2][col + 2] &&
                cell === board[row + 3][col + 3]) {
                return cell;
            }
        }
    }
    
    // Check diagonal (down-left)
    for (let row = 0; row <= ROWS - 4; row++) {
        for (let col = 3; col < COLS; col++) {
            const cell = board[row][col];
            if (cell !== 'empty' &&
                cell === board[row + 1][col - 1] &&
                cell === board[row + 2][col - 2] &&
                cell === board[row + 3][col - 3]) {
                return cell;
            }
        }
    }
    
    return null; // No winner
};

// Check if the game is a draw
export const isDraw = (board: Board): boolean => {
    return !hasValidMoves(board) && checkWinner(board) === null;
};
