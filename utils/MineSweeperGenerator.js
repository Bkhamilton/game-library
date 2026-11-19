const SETTINGS = {
    Easy: { size: 8, mines: 10, cellSize: 40 },
    Medium: { size: 12, mines: 35, cellSize: 32 },
    Hard: { size: 16, mines: 60, cellSize: 24 },
    Extreme: { size: 19, mines: 90, cellSize: 20 },
};

export const getSettings = (difficulty) => {
    if (!Object.hasOwn(SETTINGS, difficulty)) {
        throw new Error(`Invalid Minesweeper difficulty: ${difficulty}`);
    }
    return SETTINGS[difficulty];
};

// Function to create an empty board based on difficulty
export const createBoard = (difficulty) => {
    const { size } = getSettings(difficulty);
    const newBoard = [];
    for (let row = 0; row < size; row++) {
        const newRow = [];
        for (let col = 0; col < size; col++) {
            newRow.push({
                row,
                col,
                isMine: false,
                isRevealed: false,
                isFlagged: false,
                adjacentMines: 0,
            });
        }
        newBoard.push(newRow);
    }

    return newBoard;
}

// Function to initialize the board with mines and adjacent mines count
export const initializeBoard = (difficulty) => {
    const { size, mines } = getSettings(difficulty);
    const newBoard = createBoard(difficulty);
    const minePositions = new Set();

    // Place mines randomly
    while (minePositions.size < mines) {
        minePositions.add(Math.floor(Math.random() * size * size));
    }
    for (const index of minePositions) {
        newBoard[Math.floor(index / size)][index % size].isMine = true;
    }

    // Calculate adjacent mines for each cell
    for (let row = 0; row < size; row++) {
        for (let col = 0; col < size; col++) {
            if (!newBoard[row][col].isMine) {
                let adjacentMines = 0;
                for (let i = -1; i <= 1; i++) {
                    for (let j = -1; j <= 1; j++) {
                        const newRow = row + i;
                        const newCol = col + j;
                        if (
                            newRow >= 0 &&
                            newRow < size &&
                            newCol >= 0 &&
                            newCol < size &&
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

export const getRemainingMineCount = (difficulty, board) => {
    const flags = board.reduce((count, row) => count + row.filter(cell => cell.isFlagged).length, 0);
    return getSettings(difficulty).mines - flags;
};

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
export const setSize = (difficulty) => getSettings(difficulty).cellSize;