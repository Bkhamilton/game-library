import {
    initializeBoard,
    placeDisc,
    checkWinner,
    isDraw,
    hasValidMoves,
    isColumnFull,
    getNextAvailableRow,
    ROWS,
    COLS,
} from '../../utils/ConnectFourGenerator';

describe('ConnectFourGenerator', () => {
    describe('initializeBoard', () => {
        it('creates a 6x7 board', () => {
            const board = initializeBoard();
            expect(board.length).toBe(ROWS);
            expect(board[0].length).toBe(COLS);
        });

        it('initializes all cells as empty', () => {
            const board = initializeBoard();
            board.forEach(row => {
                row.forEach(cell => {
                    expect(cell).toBe('empty');
                });
            });
        });
    });

    describe('getNextAvailableRow', () => {
        it('returns bottom row for empty column', () => {
            const board = initializeBoard();
            const row = getNextAvailableRow(board, 0);
            expect(row).toBe(ROWS - 1);
        });

        it('returns null for full column', () => {
            const board = initializeBoard();
            // Fill column 0
            for (let i = 0; i < ROWS; i++) {
                board[i][0] = 'player';
            }
            const row = getNextAvailableRow(board, 0);
            expect(row).toBe(null);
        });

        it('returns correct row for partially filled column', () => {
            const board = initializeBoard();
            board[ROWS - 1][0] = 'player';
            board[ROWS - 2][0] = 'ai';
            const row = getNextAvailableRow(board, 0);
            expect(row).toBe(ROWS - 3);
        });
    });

    describe('isColumnFull', () => {
        it('returns false for empty column', () => {
            const board = initializeBoard();
            expect(isColumnFull(board, 0)).toBe(false);
        });

        it('returns true for full column', () => {
            const board = initializeBoard();
            for (let i = 0; i < ROWS; i++) {
                board[i][0] = 'player';
            }
            expect(isColumnFull(board, 0)).toBe(true);
        });
    });

    describe('placeDisc', () => {
        it('places disc at bottom of empty column', () => {
            const board = initializeBoard();
            const newBoard = placeDisc(board, 0, 'player');
            expect(newBoard).not.toBe(null);
            expect(newBoard![ROWS - 1][0]).toBe('player');
        });

        it('returns null for full column', () => {
            const board = initializeBoard();
            for (let i = 0; i < ROWS; i++) {
                board[i][0] = 'player';
            }
            const newBoard = placeDisc(board, 0, 'ai');
            expect(newBoard).toBe(null);
        });

        it('does not mutate original board', () => {
            const board = initializeBoard();
            const originalFirstCell = board[ROWS - 1][0];
            placeDisc(board, 0, 'player');
            expect(board[ROWS - 1][0]).toBe(originalFirstCell);
        });

        it('stacks discs correctly', () => {
            const board = initializeBoard();
            const board1 = placeDisc(board, 0, 'player');
            const board2 = placeDisc(board1!, 0, 'ai');
            expect(board2![ROWS - 1][0]).toBe('player');
            expect(board2![ROWS - 2][0]).toBe('ai');
        });
    });

    describe('checkWinner', () => {
        it('returns null for empty board', () => {
            const board = initializeBoard();
            expect(checkWinner(board)).toBe(null);
        });

        it('detects horizontal win', () => {
            const board = initializeBoard();
            // Place 4 in a row horizontally at bottom
            for (let col = 0; col < 4; col++) {
                board[ROWS - 1][col] = 'player';
            }
            expect(checkWinner(board)).toBe('player');
        });

        it('detects vertical win', () => {
            const board = initializeBoard();
            // Place 4 in a column
            for (let row = ROWS - 4; row < ROWS; row++) {
                board[row][0] = 'ai';
            }
            expect(checkWinner(board)).toBe('ai');
        });

        it('detects diagonal win (down-right)', () => {
            const board = initializeBoard();
            // Create diagonal from bottom-left going up-right
            for (let i = 0; i < 4; i++) {
                board[ROWS - 1 - i][i] = 'player';
            }
            expect(checkWinner(board)).toBe('player');
        });

        it('detects diagonal win (down-left)', () => {
            const board = initializeBoard();
            // Create diagonal from bottom-right going up-left
            for (let i = 0; i < 4; i++) {
                board[ROWS - 1 - i][3 + i] = 'ai';
            }
            expect(checkWinner(board)).toBe('ai');
        });

        it('returns null for 3 in a row (not a win)', () => {
            const board = initializeBoard();
            for (let col = 0; col < 3; col++) {
                board[ROWS - 1][col] = 'player';
            }
            expect(checkWinner(board)).toBe(null);
        });
    });

    describe('hasValidMoves', () => {
        it('returns true for empty board', () => {
            const board = initializeBoard();
            expect(hasValidMoves(board)).toBe(true);
        });

        it('returns true for partially filled board', () => {
            const board = initializeBoard();
            board[ROWS - 1][0] = 'player';
            expect(hasValidMoves(board)).toBe(true);
        });

        it('returns false for completely full board', () => {
            const board = initializeBoard();
            for (let row = 0; row < ROWS; row++) {
                for (let col = 0; col < COLS; col++) {
                    board[row][col] = (row + col) % 2 === 0 ? 'player' : 'ai';
                }
            }
            expect(hasValidMoves(board)).toBe(false);
        });
    });

    describe('isDraw', () => {
        it('returns false for empty board', () => {
            const board = initializeBoard();
            expect(isDraw(board)).toBe(false);
        });

        it('returns true for full board with no winner', () => {
            const board = initializeBoard();
            // Fill board in a way that creates no winner
            for (let row = 0; row < ROWS; row++) {
                for (let col = 0; col < COLS; col++) {
                    // Alternate pattern to avoid any 4-in-a-row
                    board[row][col] = (row + col) % 2 === 0 ? 'player' : 'ai';
                }
            }
            expect(isDraw(board)).toBe(true);
        });

        it('returns false for full board with winner', () => {
            const board = initializeBoard();
            // Fill board
            for (let row = 0; row < ROWS; row++) {
                for (let col = 0; col < COLS; col++) {
                    board[row][col] = 'ai';
                }
            }
            // Add winning horizontal line
            for (let col = 0; col < 4; col++) {
                board[ROWS - 1][col] = 'player';
            }
            expect(isDraw(board)).toBe(false);
        });
    });
});
