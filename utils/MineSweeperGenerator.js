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
            rows = 16;
            cols = 12;
            minesCount = 40;
            break;
        case 'Hard':
            rows = 24;
            cols = 16;
            minesCount = 70;
            break;
        case 'Extreme':
            rows = 25;
            cols = 19;
            minesCount = 140;
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