// This is the file that holds my MineSweeper Utility functions

// Function to initialize the board with mines and adjacent mines count
export const initializeBoard = (difficulty) => {
    let rows, cols, minesCount;

    switch (difficulty) {
        case 'Easy':
            rows = 8;
            cols = 8;
            minesCount = 10;
            break;
        case 'Medium':
            rows = 12;
            cols = 12;
            minesCount = 40;
            break;
        case 'Hard':
            rows = 16;
            cols = 16;
            minesCount = 70;
            break;
        case 'Extreme':
            rows = 19;
            cols = 19;
            minesCount = 100;
            break;
        default:
            throw new Error('Invalid difficulty level');
    }

    const newBoard = [];
    const minePositions = new Set();

    // Place mines randomly
    while (minePositions.size < minesCount) {
        const row = Math.floor(Math.random() * rows);
        const col = Math.floor(Math.random() * cols);
        minePositions.add(`${row}-${col}`);
    }

    // Initialize board with cells
    for (let row = 0; row < rows; row++) {
        const newRow = [];
        for (let col = 0; col < cols; col++) {
            newRow.push({
                row,
                col,
                isMine: minePositions.has(`${row}-${col}`),
                isRevealed: false,
                isFlagged: false,
                adjacentMines: 0,
            });
        }
        newBoard.push(newRow);
    }

    // Calculate adjacent mines for each cell
    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
            if (!newBoard[row][col].isMine) {
                let adjacentMines = 0;
                for (let i = -1; i <= 1; i++) {
                    for (let j = -1; j <= 1; j++) {
                        const newRow = row + i;
                        const newCol = col + j;
                        if (
                            newRow >= 0 &&
                            newRow < rows &&
                            newCol >= 0 &&
                            newCol < cols &&
                            newBoard[newRow][newCol].isMine
                        ) {
                            adjacentMines++;
                        }
                    }
                }
                newBoard[row][col].adjacentMines = adjacentMines;
            }
        }
    }

    return newBoard;
};

// Function to initialize a new board making sure the first click is safe
export const initializeBoardWithFirstClick = (difficulty, row, col) => {
    let board = initializeBoard(difficulty);

    while (board[row][col].isMine) {
        board = initializeBoard(difficulty);
    }

    revealAdjacentCells(board, row, col);

    return board;
};

// Function to reveal all adjacent cells when a cell with 0 adjacent mines is clicked
export const revealAdjacentCells = (board, row, col) => {
    const directions = [
        [-1, -1], [-1, 0], [-1, 1],
        [0, -1],         [0, 1],
        [1, -1], [1, 0], [1, 1]
    ];

    const stack = [[row, col]];

    while (stack.length > 0) {
        const [currentRow, currentCol] = stack.pop();
        const cell = board[currentRow][currentCol];

        if (!cell.isRevealed && !cell.isFlagged) {
            cell.isRevealed = true;

            if (cell.adjacentMines === 0) {
                for (const [dx, dy] of directions) {
                    const newRow = currentRow + dx;
                    const newCol = currentCol + dy;

                    if (
                        newRow >= 0 && newRow < board.length &&
                        newCol >= 0 && newCol < board[0].length &&
                        !board[newRow][newCol].isRevealed
                    ) {
                        stack.push([newRow, newCol]);
                    }
                }
            }
        }
    }
};

// Function to get the number of mines based on difficulty
export const getMineCount = (difficulty) => {
    switch (difficulty) {
        case "Easy":
            return 10;
        case "Medium":
            return 40;
        case "Hard":
            return 70;
        case 'Extreme':
            return 100;
        default:
            return 10;
    }
}

// Function to determine if the game is won
export const checkWin = (board) => {
    for (let row = 0; row < board.length; row++) {
        for (let col = 0; col < board[row].length; col++) {
            const cell = board[row][col];
            if (!cell.isMine && !cell.isRevealed) {
                return false;
            }
        }
    }
    return true;
};

// Function to return the size of the board based on difficulty
export const setSize = (difficulty) => {
    switch (difficulty) {
        case 'Easy':
            return 40;
        case 'Medium':
            return 32;
        case 'Hard':
            return 24;
        case 'Extreme':
            return 20;
        default:
            return 40;
    }
}