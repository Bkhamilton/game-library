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

// Get all valid column moves for the current board
export const getValidMoves = (board: Board): number[] => {
    const validMoves: number[] = [];
    for (let col = 0; col < COLS; col++) {
        if (!isColumnFull(board, col)) {
            validMoves.push(col);
        }
    }
    return validMoves;
};

// Evaluate the board position from the AI's perspective
// Positive scores favor AI, negative scores favor player
const evaluateWindow = (window: Cell[]): number => {
    let score = 0;
    
    const aiCount = window.filter(cell => cell === 'ai').length;
    const playerCount = window.filter(cell => cell === 'player').length;
    const emptyCount = window.filter(cell => cell === 'empty').length;
    
    // AI has pieces in window
    if (aiCount === 4) {
        score += 100;
    } else if (aiCount === 3 && emptyCount === 1) {
        score += 5;
    } else if (aiCount === 2 && emptyCount === 2) {
        score += 2;
    }
    
    // Player has pieces in window (negative for AI)
    if (playerCount === 3 && emptyCount === 1) {
        score -= 4; // Block opponent's winning move
    }
    
    return score;
};

export const evaluateBoard = (board: Board): number => {
    let score = 0;
    
    // Check horizontal windows
    for (let row = 0; row < ROWS; row++) {
        for (let col = 0; col <= COLS - 4; col++) {
            const window = [board[row][col], board[row][col + 1], board[row][col + 2], board[row][col + 3]];
            score += evaluateWindow(window);
        }
    }
    
    // Check vertical windows
    for (let row = 0; row <= ROWS - 4; row++) {
        for (let col = 0; col < COLS; col++) {
            const window = [board[row][col], board[row + 1][col], board[row + 2][col], board[row + 3][col]];
            score += evaluateWindow(window);
        }
    }
    
    // Check diagonal (down-right) windows
    for (let row = 0; row <= ROWS - 4; row++) {
        for (let col = 0; col <= COLS - 4; col++) {
            const window = [board[row][col], board[row + 1][col + 1], board[row + 2][col + 2], board[row + 3][col + 3]];
            score += evaluateWindow(window);
        }
    }
    
    // Check diagonal (down-left) windows
    for (let row = 0; row <= ROWS - 4; row++) {
        for (let col = 3; col < COLS; col++) {
            const window = [board[row][col], board[row + 1][col - 1], board[row + 2][col - 2], board[row + 3][col - 3]];
            score += evaluateWindow(window);
        }
    }
    
    // Center column preference (strategic positioning)
    const centerCol = Math.floor(COLS / 2);
    let centerCount = 0;
    for (let row = 0; row < ROWS; row++) {
        if (board[row][centerCol] === 'ai') {
            centerCount++;
        }
    }
    score += centerCount * 3;
    
    return score;
};

// Check if the game is in a terminal state (win, loss, or draw)
const isTerminalNode = (board: Board): boolean => {
    return checkWinner(board) !== null || !hasValidMoves(board);
};

// MinMax algorithm with Alpha-Beta pruning for AI move selection
export const minimax = (
    board: Board,
    depth: number,
    alpha: number,
    beta: number,
    maximizingPlayer: boolean
): number => {
    const winner = checkWinner(board);
    
    // Terminal states
    if (winner === 'ai') {
        return 100000;
    } else if (winner === 'player') {
        return -100000;
    } else if (isTerminalNode(board)) {
        return 0;
    }
    
    // Depth limit reached
    if (depth === 0) {
        return evaluateBoard(board);
    }
    
    const validMoves = getValidMoves(board);
    
    if (maximizingPlayer) {
        let maxEval = -Infinity;
        for (const col of validMoves) {
            const newBoard = placeDisc(board, col, 'ai');
            if (newBoard) {
                const evalScore = minimax(newBoard, depth - 1, alpha, beta, false);
                maxEval = Math.max(maxEval, evalScore);
                alpha = Math.max(alpha, evalScore);
                if (beta <= alpha) {
                    break; // Beta cutoff
                }
            }
        }
        return maxEval;
    } else {
        let minEval = Infinity;
        for (const col of validMoves) {
            const newBoard = placeDisc(board, col, 'player');
            if (newBoard) {
                const evalScore = minimax(newBoard, depth - 1, alpha, beta, true);
                minEval = Math.min(minEval, evalScore);
                beta = Math.min(beta, evalScore);
                if (beta <= alpha) {
                    break; // Alpha cutoff
                }
            }
        }
        return minEval;
    }
};

// Check if there are 3 player discs in a row (horizontal or vertical) that need blocking
const findSimpleBlockingMove = (board: Board, validMoves: number[]): number | null => {
    // Check horizontal threats (3 in a row with an empty spot)
    for (let row = 0; row < ROWS; row++) {
        for (let col = 0; col <= COLS - 4; col++) {
            const window = [board[row][col], board[row][col + 1], board[row][col + 2], board[row][col + 3]];
            const playerCount = window.filter(cell => cell === 'player').length;
            const emptyCount = window.filter(cell => cell === 'empty').length;
            
            if (playerCount === 3 && emptyCount === 1) {
                // Find the empty spot and check if it's a valid move
                for (let i = 0; i < 4; i++) {
                    const checkCol = col + i;
                    if (board[row][checkCol] === 'empty') {
                        // Check if this column can be played (need to check if disc would land at this row)
                        const nextRow = getNextAvailableRow(board, checkCol);
                        if (nextRow === row && validMoves.includes(checkCol)) {
                            return checkCol;
                        }
                    }
                }
            }
        }
    }
    
    // Check vertical threats (3 in a column with an empty spot on top)
    for (let col = 0; col < COLS; col++) {
        for (let row = 0; row <= ROWS - 4; row++) {
            const window = [board[row][col], board[row + 1][col], board[row + 2][col], board[row + 3][col]];
            const playerCount = window.filter(cell => cell === 'player').length;
            const emptyCount = window.filter(cell => cell === 'empty').length;
            
            if (playerCount === 3 && emptyCount === 1) {
                // Find the empty spot (should be at the top of the 4-window)
                for (let i = 0; i < 4; i++) {
                    const checkRow = row + i;
                    if (board[checkRow][col] === 'empty') {
                        // Check if this is the next available row in this column
                        const nextRow = getNextAvailableRow(board, col);
                        if (nextRow === checkRow && validMoves.includes(col)) {
                            return col;
                        }
                    }
                }
            }
        }
    }
    
    return null;
};

// Easy AI: blocks simple threats and makes random moves
const getEasyAIMove = (board: Board): number => {
    const validMoves = getValidMoves(board);
    
    if (validMoves.length === 0) {
        return -1;
    }
    
    // Check for immediate winning move (still takes wins)
    for (const col of validMoves) {
        const newBoard = placeDisc(board, col, 'ai');
        if (newBoard && checkWinner(newBoard) === 'ai') {
            return col;
        }
    }
    
    // Block simple horizontal and vertical 3-in-a-row threats
    const blockingMove = findSimpleBlockingMove(board, validMoves);
    if (blockingMove !== null) {
        return blockingMove;
    }
    
    // Make a random move with slight preference for center columns
    const centerCol = Math.floor(COLS / 2);
    
    // 40% chance to play center columns (3, 2, 4) if available
    if (Math.random() < 0.4) {
        const centerColumns = [centerCol, centerCol - 1, centerCol + 1].filter(
            col => validMoves.includes(col)
        );
        if (centerColumns.length > 0) {
            return centerColumns[Math.floor(Math.random() * centerColumns.length)];
        }
    }
    
    // Otherwise, random move
    return validMoves[Math.floor(Math.random() * validMoves.length)];
};

// Medium AI: uses MinMax with reduced depth for intermediate difficulty
const getMediumAIMove = (board: Board): number => {
    const validMoves = getValidMoves(board);
    
    if (validMoves.length === 0) {
        return -1; // No valid moves
    }
    
    // Opening move - prefer center column
    const totalMoves = ROWS * COLS - validMoves.length;
    if (totalMoves <= 1) {
        const centerCol = Math.floor(COLS / 2);
        if (validMoves.includes(centerCol)) {
            return centerCol;
        }
    }
    
    // Check for immediate winning move
    for (const col of validMoves) {
        const newBoard = placeDisc(board, col, 'ai');
        if (newBoard && checkWinner(newBoard) === 'ai') {
            return col;
        }
    }
    
    // Check for blocking opponent's winning move
    for (const col of validMoves) {
        const newBoard = placeDisc(board, col, 'player');
        if (newBoard && checkWinner(newBoard) === 'player') {
            return col;
        }
    }
    
    // Use MinMax with reduced depth (2-3) for medium difficulty
    // This makes it strategic but beatable
    const depth = 3;
    
    // Use MinMax to find best move
    let bestScore = -Infinity;
    let bestCol = validMoves[0];
    
    for (const col of validMoves) {
        const newBoard = placeDisc(board, col, 'ai');
        if (newBoard) {
            const score = minimax(newBoard, depth - 1, -Infinity, Infinity, false);
            if (score > bestScore) {
                bestScore = score;
                bestCol = col;
            }
        }
    }
    
    return bestCol;
};

// Get the best move for AI based on difficulty
export const getAIMove = (board: Board, difficulty: Difficulty = 'Medium'): number => {
    // Use easy AI for Easy difficulty
    if (difficulty === 'Easy') {
        return getEasyAIMove(board);
    }
    
    // Use medium AI for Medium difficulty
    if (difficulty === 'Medium') {
        return getMediumAIMove(board);
    }
    
    // Use advanced AI for Hard difficulty
    const validMoves = getValidMoves(board);
    
    if (validMoves.length === 0) {
        return -1; // No valid moves
    }
    
    // Opening move - prefer center column
    const totalMoves = ROWS * COLS - validMoves.length;
    if (totalMoves <= 1) {
        const centerCol = Math.floor(COLS / 2);
        if (validMoves.includes(centerCol)) {
            return centerCol;
        }
    }
    
    // Check for immediate winning move
    for (const col of validMoves) {
        const newBoard = placeDisc(board, col, 'ai');
        if (newBoard && checkWinner(newBoard) === 'ai') {
            return col;
        }
    }
    
    // Check for blocking opponent's winning move
    for (const col of validMoves) {
        const newBoard = placeDisc(board, col, 'player');
        if (newBoard && checkWinner(newBoard) === 'player') {
            return col;
        }
    }
    
    // Set depth based on board state for Hard difficulty
    // Lower depth for early game to speed up computation
    let depth = 5;
    if (totalMoves < 10) {
        depth = 4; // Early game - faster computation
    }
    
    // Use MinMax to find best move
    let bestScore = -Infinity;
    let bestCol = validMoves[0];
    
    for (const col of validMoves) {
        const newBoard = placeDisc(board, col, 'ai');
        if (newBoard) {
            const score = minimax(newBoard, depth - 1, -Infinity, Infinity, false);
            if (score > bestScore) {
                bestScore = score;
                bestCol = col;
            }
        }
    }
    
    return bestCol;
};
