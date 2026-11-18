import {
    checkWin,
    createBoard,
    getRemainingMineCount,
    initializeBoard,
    initializeBoardWithFirstClick,
} from '../../utils/MineSweeperGenerator';

describe.each([
    ['Easy', 10],
    ['Medium', 35],
    ['Hard', 60],
    ['Extreme', 90],
])('Minesweeper mine count on %s', (difficulty, mineTotal) => {
    it('matches the generated board before and after the first click and updates with flags', () => {
        expect(getRemainingMineCount(difficulty, createBoard(difficulty))).toBe(mineTotal);

        const board = initializeBoardWithFirstClick(difficulty, 0, 0);
        const mines = board.flat().filter(cell => cell.isMine);
        expect(mines).toHaveLength(mineTotal);
        expect(getRemainingMineCount(difficulty, board)).toBe(mines.length);

        for (const cell of mines) cell.isFlagged = true;
        expect(getRemainingMineCount(difficulty, board)).toBe(0);

        mines[0].isFlagged = false;
        expect(getRemainingMineCount(difficulty, board)).toBe(1);
    });

    it('wins by revealing all safe cells, not by using all flags', () => {
        const board = initializeBoard(difficulty);
        const cells = board.flat();
        const lastSafeCell = cells.find(cell => !cell.isMine);
        for (const cell of cells) {
            cell.isFlagged = cell.isMine;
            cell.isRevealed = !cell.isMine && cell !== lastSafeCell;
        }
        expect(getRemainingMineCount(difficulty, board)).toBe(0);
        expect(checkWin(board)).toBe(false);

        for (const cell of cells) cell.isFlagged = false;
        lastSafeCell.isRevealed = true;
        expect(getRemainingMineCount(difficulty, board)).toBe(mineTotal);
        expect(checkWin(board)).toBe(true);
    });
});
