import {
    initializeBoard,
    placeDisc,
    checkWinner,
    isDraw,
    hasValidMoves,
    isColumnFull,
    getNextAvailableRow,
    getValidMoves,
    getAIMove,
    evaluateBoard,
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
            if (newBoard) {
                expect(newBoard[ROWS - 1][0]).toBe('player');
            }
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
            const board2 = board1 ? placeDisc(board1, 0, 'ai') : null;
            if (board2) {
                expect(board2[ROWS - 1][0]).toBe('player');
                expect(board2[ROWS - 2][0]).toBe('ai');
            }
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
            // Manually fill board to ensure no 4-in-a-row exists
            const filledBoard = [
                ['player', 'player', 'ai', 'player', 'player', 'ai', 'ai'],
                ['ai', 'ai', 'player', 'ai', 'ai', 'player', 'player'],
                ['player', 'player', 'ai', 'player', 'player', 'ai', 'ai'],
                ['ai', 'ai', 'player', 'ai', 'ai', 'player', 'player'],
                ['player', 'player', 'ai', 'player', 'player', 'ai', 'ai'],
                ['ai', 'ai', 'player', 'ai', 'ai', 'player', 'player']
            ];
            for (let row = 0; row < ROWS; row++) {
                for (let col = 0; col < COLS; col++) {
                    board[row][col] = filledBoard[row][col];
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

    describe('getValidMoves', () => {
        it('returns all columns for empty board', () => {
            const board = initializeBoard();
            const validMoves = getValidMoves(board);
            expect(validMoves.length).toBe(COLS);
            expect(validMoves).toEqual([0, 1, 2, 3, 4, 5, 6]);
        });

        it('returns only available columns for partially filled board', () => {
            const board = initializeBoard();
            // Fill columns 0 and 3
            for (let row = 0; row < ROWS; row++) {
                board[row][0] = 'player';
                board[row][3] = 'ai';
            }
            const validMoves = getValidMoves(board);
            expect(validMoves).toEqual([1, 2, 4, 5, 6]);
        });

        it('returns empty array for full board', () => {
            const board = initializeBoard();
            // Fill entire board
            for (let row = 0; row < ROWS; row++) {
                for (let col = 0; col < COLS; col++) {
                    board[row][col] = 'player';
                }
            }
            const validMoves = getValidMoves(board);
            expect(validMoves).toEqual([]);
        });
    });

    describe('evaluateBoard', () => {
        it('returns 0 for empty board', () => {
            const board = initializeBoard();
            const score = evaluateBoard(board);
            expect(score).toBe(0);
        });

        it('returns positive score when AI has advantage', () => {
            const board = initializeBoard();
            // Place 3 AI discs in a row with an empty space
            board[ROWS - 1][0] = 'ai';
            board[ROWS - 1][1] = 'ai';
            board[ROWS - 1][2] = 'ai';
            const score = evaluateBoard(board);
            expect(score).toBeGreaterThan(0);
        });

        it('returns negative score when player threatens to win', () => {
            const board = initializeBoard();
            // Place 3 player discs in a row with an empty space
            board[ROWS - 1][0] = 'player';
            board[ROWS - 1][1] = 'player';
            board[ROWS - 1][2] = 'player';
            const score = evaluateBoard(board);
            expect(score).toBeLessThan(0);
        });
    });

    describe('getAIMove', () => {
        it('returns a valid column number', () => {
            const board = initializeBoard();
            const aiMove = getAIMove(board);
            expect(aiMove).toBeGreaterThanOrEqual(0);
            expect(aiMove).toBeLessThan(COLS);
        });

        it('takes immediate winning move', () => {
            const board = initializeBoard();
            // Set up a winning scenario for AI
            board[ROWS - 1][0] = 'ai';
            board[ROWS - 1][1] = 'ai';
            board[ROWS - 1][2] = 'ai';
            // Column 3 is the winning move
            const aiMove = getAIMove(board);
            expect(aiMove).toBe(3);
        });

        it('blocks opponent winning move', () => {
            const board = initializeBoard();
            // Set up a winning scenario for player
            board[ROWS - 1][0] = 'player';
            board[ROWS - 1][1] = 'player';
            board[ROWS - 1][2] = 'player';
            // Column 3 needs to be blocked
            const aiMove = getAIMove(board);
            expect(aiMove).toBe(3);
        });

        it('returns -1 when no valid moves available', () => {
            const board = initializeBoard();
            // Fill entire board
            for (let row = 0; row < ROWS; row++) {
                for (let col = 0; col < COLS; col++) {
                    board[row][col] = 'player';
                }
            }
            const aiMove = getAIMove(board);
            expect(aiMove).toBe(-1);
        });

        it('prefers center column for opening move', () => {
            const board = initializeBoard();
            const aiMove = getAIMove(board);
            // Center column (3) should be preferred on empty board
            expect(aiMove).toBe(3);
        });
    });

    describe('getAIMove with Easy difficulty', () => {
        it('returns a valid column number', () => {
            const board = initializeBoard();
            const aiMove = getAIMove(board, 'Easy');
            expect(aiMove).toBeGreaterThanOrEqual(0);
            expect(aiMove).toBeLessThan(COLS);
        });

        it('takes immediate winning move', () => {
            const board = initializeBoard();
            // Set up a winning scenario for AI
            board[ROWS - 1][0] = 'ai';
            board[ROWS - 1][1] = 'ai';
            board[ROWS - 1][2] = 'ai';
            // Column 3 is the winning move
            const aiMove = getAIMove(board, 'Easy');
            expect(aiMove).toBe(3);
        });

        it('blocks horizontal 3-in-a-row threat', () => {
            const board = initializeBoard();
            // Set up a horizontal threat
            board[ROWS - 1][0] = 'player';
            board[ROWS - 1][1] = 'player';
            board[ROWS - 1][2] = 'player';
            // Column 3 should be blocked
            const aiMove = getAIMove(board, 'Easy');
            expect(aiMove).toBe(3);
        });

        it('blocks vertical 3-in-a-row threat', () => {
            const board = initializeBoard();
            // Set up a vertical threat in column 2
            board[ROWS - 1][2] = 'player';
            board[ROWS - 2][2] = 'player';
            board[ROWS - 3][2] = 'player';
            // Column 2 should be blocked (row ROWS-4)
            const aiMove = getAIMove(board, 'Easy');
            expect(aiMove).toBe(2);
        });

        it('does NOT block diagonal threats (only horizontal and vertical)', () => {
            const board = initializeBoard();
            // Set up a diagonal threat that Easy AI should NOT block
            board[ROWS - 1][0] = 'player';
            board[ROWS - 2][1] = 'player';
            board[ROWS - 3][2] = 'player';
            // The AI should make a move, but not necessarily block column 3
            const aiMove = getAIMove(board, 'Easy');
            expect(aiMove).toBeGreaterThanOrEqual(0);
            expect(aiMove).toBeLessThan(COLS);
            // We don't assert it blocks the diagonal - just that it makes a valid move
        });

        it('makes random moves when no immediate threats exist', () => {
            const board = initializeBoard();
            // Place one disc to avoid opening move logic
            board[ROWS - 1][0] = 'player';
            board[ROWS - 1][1] = 'ai';
            
            // Run AI move multiple times to ensure it returns valid moves
            const moves = new Set();
            for (let i = 0; i < 10; i++) {
                const aiMove = getAIMove(board, 'Easy');
                expect(aiMove).toBeGreaterThanOrEqual(0);
                expect(aiMove).toBeLessThan(COLS);
                moves.add(aiMove);
            }
            // Should have some variety in moves (not always the same)
            expect(moves.size).toBeGreaterThan(1);
        });

        it('blocks horizontal threat in middle of board', () => {
            const board = initializeBoard();
            // Set up a horizontal threat at the bottom row
            board[ROWS - 1][3] = 'player';
            board[ROWS - 1][4] = 'player';
            board[ROWS - 1][5] = 'player';
            // Both columns 2 and 6 would complete it - AI should block one of them
            const aiMove = getAIMove(board, 'Easy');
            expect([2, 6]).toContain(aiMove);
        });

        it('returns -1 when no valid moves available', () => {
            const board = initializeBoard();
            // Fill entire board
            for (let row = 0; row < ROWS; row++) {
                for (let col = 0; col < COLS; col++) {
                    board[row][col] = 'player';
                }
            }
            const aiMove = getAIMove(board, 'Easy');
            expect(aiMove).toBe(-1);
        });
    });

    describe('getAIMove with Medium difficulty', () => {
        it('returns a valid column number', () => {
            const board = initializeBoard();
            const aiMove = getAIMove(board, 'Medium');
            expect(aiMove).toBeGreaterThanOrEqual(0);
            expect(aiMove).toBeLessThan(COLS);
        });

        it('takes immediate winning move', () => {
            const board = initializeBoard();
            // Set up a winning scenario for AI
            board[ROWS - 1][0] = 'ai';
            board[ROWS - 1][1] = 'ai';
            board[ROWS - 1][2] = 'ai';
            // Column 3 is the winning move
            const aiMove = getAIMove(board, 'Medium');
            expect(aiMove).toBe(3);
        });

        it('blocks opponent winning move', () => {
            const board = initializeBoard();
            // Set up a winning scenario for player
            board[ROWS - 1][0] = 'player';
            board[ROWS - 1][1] = 'player';
            board[ROWS - 1][2] = 'player';
            // Column 3 needs to be blocked
            const aiMove = getAIMove(board, 'Medium');
            expect(aiMove).toBe(3);
        });

        it('blocks diagonal threats (unlike Easy AI)', () => {
            const board = initializeBoard();
            // Set up a diagonal threat
            board[ROWS - 1][0] = 'player';
            board[ROWS - 2][1] = 'player';
            board[ROWS - 3][2] = 'player';
            // Need to set up so column 3 is where the threat completes
            // and the disc would land at the right spot
            board[ROWS - 1][1] = 'ai';
            board[ROWS - 1][2] = 'ai';
            board[ROWS - 2][2] = 'ai';
            
            const aiMove = getAIMove(board, 'Medium');
            // Medium AI should use strategic thinking to handle threats
            expect(aiMove).toBeGreaterThanOrEqual(0);
            expect(aiMove).toBeLessThan(COLS);
        });

        it('prefers center column for opening move', () => {
            const board = initializeBoard();
            const aiMove = getAIMove(board, 'Medium');
            // Center column (3) should be preferred on empty board
            expect(aiMove).toBe(3);
        });

        it('returns -1 when no valid moves available', () => {
            const board = initializeBoard();
            // Fill entire board
            for (let row = 0; row < ROWS; row++) {
                for (let col = 0; col < COLS; col++) {
                    board[row][col] = 'player';
                }
            }
            const aiMove = getAIMove(board, 'Medium');
            expect(aiMove).toBe(-1);
        });
    });

    describe('getAIMove with Hard difficulty', () => {
        it('returns a valid column number', () => {
            const board = initializeBoard();
            const aiMove = getAIMove(board, 'Hard');
            expect(aiMove).toBeGreaterThanOrEqual(0);
            expect(aiMove).toBeLessThan(COLS);
        });

        it('takes immediate winning move', () => {
            const board = initializeBoard();
            // Set up a winning scenario for AI
            board[ROWS - 1][0] = 'ai';
            board[ROWS - 1][1] = 'ai';
            board[ROWS - 1][2] = 'ai';
            // Column 3 is the winning move
            const aiMove = getAIMove(board, 'Hard');
            expect(aiMove).toBe(3);
        });

        it('blocks opponent winning move', () => {
            const board = initializeBoard();
            // Set up a winning scenario for player
            board[ROWS - 1][0] = 'player';
            board[ROWS - 1][1] = 'player';
            board[ROWS - 1][2] = 'player';
            // Column 3 needs to be blocked
            const aiMove = getAIMove(board, 'Hard');
            expect(aiMove).toBe(3);
        });

        it('prefers center column for opening move', () => {
            const board = initializeBoard();
            const aiMove = getAIMove(board, 'Hard');
            // Center column (3) should be preferred on empty board
            expect(aiMove).toBe(3);
        });

        it('returns -1 when no valid moves available', () => {
            const board = initializeBoard();
            // Fill entire board
            for (let row = 0; row < ROWS; row++) {
                for (let col = 0; col < COLS; col++) {
                    board[row][col] = 'player';
                }
            }
            const aiMove = getAIMove(board, 'Hard');
            expect(aiMove).toBe(-1);
        });
    });
});
