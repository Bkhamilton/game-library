// 2048 Game Generator and Logic

export type Tile = {
    id: string;
    value: number;
    position: { row: number; col: number };
    mergedFrom?: Tile[];
};

export type Board = (number | null)[][];

export type Difficulty = 'Easy' | 'Medium' | 'Hard' | string;

// Get board size based on difficulty
const getBoardSize = (difficulty: Difficulty): number => {
    return difficulty === 'Easy' ? 5 : 4;
};

// Initialize an empty board based on difficulty
export const initializeBoard = (difficulty: Difficulty = 'Medium'): Board => {
    const size = getBoardSize(difficulty);
    return Array(size).fill(null).map(() => Array(size).fill(null));
};

// Add a random tile to the board based on difficulty
export const addRandomTile = (board: Board, difficulty: Difficulty = 'Medium'): Board => {
    const emptyCells: { row: number; col: number }[] = [];
    const size = board.length;
    
    // Find all empty cells
    for (let row = 0; row < size; row++) {
        for (let col = 0; col < size; col++) {
            if (board[row][col] === null) {
                emptyCells.push({ row, col });
            }
        }
    }
    
    if (emptyCells.length === 0) return board;
    
    // Pick a random empty cell
    const randomCell = emptyCells[Math.floor(Math.random() * emptyCells.length)];
    
    // Determine new value based on difficulty
    let newValue: number;
    if (difficulty === 'Easy') {
        // Easy: Only 2s
        newValue = 2;
    } else if (difficulty === 'Hard') {
        // Hard: 2s, 4s, and 8s
        const rand = Math.random();
        if (rand < 0.7) {
            newValue = 2;
        } else if (rand < 0.9) {
            newValue = 4;
        } else {
            newValue = 8;
        }
    } else {
        // Medium: 90% chance of 2, 10% chance of 4
        newValue = Math.random() < 0.9 ? 2 : 4;
    }
    
    const newBoard = board.map(row => [...row]);
    newBoard[randomCell.row][randomCell.col] = newValue;
    
    return newBoard;
};

// Initialize board with 2 random tiles
export const initializeBoardWithTiles = (difficulty: Difficulty = 'Medium'): Board => {
    let board = initializeBoard(difficulty);
    board = addRandomTile(board, difficulty);
    board = addRandomTile(board, difficulty);
    return board;
};

// Move and merge tiles in a specific direction
export const move = (board: Board, direction: 'up' | 'down' | 'left' | 'right'): { board: Board; moved: boolean; scoreGained: number } => {
    let newBoard = board.map(row => [...row]);
    let moved = false;
    let scoreGained = 0;
    const size = board.length;
    
    if (direction === 'left') {
        for (let row = 0; row < size; row++) {
            const { line, hasMoved, score } = slideAndMergeLine(newBoard[row]);
            if (hasMoved) moved = true;
            scoreGained += score;
            newBoard[row] = line;
        }
    } else if (direction === 'right') {
        for (let row = 0; row < size; row++) {
            const reversed = [...newBoard[row]].reverse();
            const { line, hasMoved, score } = slideAndMergeLine(reversed);
            if (hasMoved) moved = true;
            scoreGained += score;
            newBoard[row] = line.reverse();
        }
    } else if (direction === 'up') {
        for (let col = 0; col < size; col++) {
            const column = Array.from({ length: size }, (_, row) => newBoard[row][col]);
            const { line, hasMoved, score } = slideAndMergeLine(column);
            if (hasMoved) moved = true;
            scoreGained += score;
            for (let row = 0; row < size; row++) {
                newBoard[row][col] = line[row];
            }
        }
    } else if (direction === 'down') {
        for (let col = 0; col < size; col++) {
            const column = Array.from({ length: size }, (_, row) => newBoard[row][col]);
            const reversed = [...column].reverse();
            const { line, hasMoved, score } = slideAndMergeLine(reversed);
            if (hasMoved) moved = true;
            scoreGained += score;
            const finalLine = line.reverse();
            for (let row = 0; row < size; row++) {
                newBoard[row][col] = finalLine[row];
            }
        }
    }
    
    return { board: newBoard, moved, scoreGained };
};

// Slide and merge a single line (row or column)
const slideAndMergeLine = (line: (number | null)[]): { line: (number | null)[]; hasMoved: boolean; score: number } => {
    let score = 0;
    const lineLength = line.length;
    
    // Filter out nulls to get non-empty tiles
    let filteredLine = line.filter(cell => cell !== null) as number[];
    
    // Merge adjacent equal tiles
    const mergedLine: (number | null)[] = [];
    let i = 0;
    while (i < filteredLine.length) {
        if (i < filteredLine.length - 1 && filteredLine[i] === filteredLine[i + 1]) {
            const mergedValue = filteredLine[i] * 2;
            mergedLine.push(mergedValue);
            score += mergedValue;
            i += 2;
        } else {
            mergedLine.push(filteredLine[i]);
            i++;
        }
    }
    
    // Fill the rest with nulls
    while (mergedLine.length < lineLength) {
        mergedLine.push(null);
    }
    
    // Check if the line has changed
    const hasMoved = !arraysEqual(line, mergedLine);
    
    return { line: mergedLine, hasMoved, score };
};

// Helper function to check if two arrays are equal
const arraysEqual = (a: (number | null)[], b: (number | null)[]): boolean => {
    return a.length === b.length && a.every((val, idx) => val === b[idx]);
};

// Check if there are any valid moves left
export const canMove = (board: Board): boolean => {
    const size = board.length;
    
    // Check for empty cells
    for (let row = 0; row < size; row++) {
        for (let col = 0; col < size; col++) {
            if (board[row][col] === null) return true;
        }
    }
    
    // Check for adjacent equal tiles (horizontal)
    for (let row = 0; row < size; row++) {
        for (let col = 0; col < size - 1; col++) {
            if (board[row][col] === board[row][col + 1]) return true;
        }
    }
    
    // Check for adjacent equal tiles (vertical)
    for (let row = 0; row < size - 1; row++) {
        for (let col = 0; col < size; col++) {
            if (board[row][col] === board[row + 1][col]) return true;
        }
    }
    
    return false;
};

// Check if the player has won (reached 2048)
export const hasWon = (board: Board): boolean => {
    const size = board.length;
    for (let row = 0; row < size; row++) {
        for (let col = 0; col < size; col++) {
            if (board[row][col] === 2048) return true;
        }
    }
    return false;
};

// Get the highest tile value on the board
export const getHighestTile = (board: Board): number => {
    let max = 0;
    const size = board.length;
    for (let row = 0; row < size; row++) {
        for (let col = 0; col < size; col++) {
            if (board[row][col] !== null && board[row][col]! > max) {
                max = board[row][col]!;
            }
        }
    }
    return max;
};
