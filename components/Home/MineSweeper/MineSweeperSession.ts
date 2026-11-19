import { checkWin, createBoard, getSettings, initializeBoard, revealAdjacentCells } from '@/utils/MineSweeperGenerator';
import type { SessionIdentity } from '@/db/Sessions/Sessions';
import type { CellProps } from './MineSweeperGame';

export type MineSweeperSnapshot = {
    difficulty: string;
    board: CellProps[][];
    firstMoveMade: boolean;
};

export function createMineSweeperSnapshot(difficulty: string): MineSweeperSnapshot {
    return { difficulty, board: createBoard(difficulty), firstMoveMade: false };
}

export function isMineSweeperSnapshot(value: unknown, identity: SessionIdentity): value is MineSweeperSnapshot {
    if (!value || typeof value !== 'object') return false;
    const { difficulty, board, firstMoveMade } = value as MineSweeperSnapshot;
    if (typeof difficulty !== 'string' || difficulty !== identity.difficulty) return false;
    let config: ReturnType<typeof getSettings>;
    try { config = getSettings(difficulty); } catch { return false; }
    if (typeof firstMoveMade !== 'boolean' || !Array.isArray(board) ||
        board.length !== config.size || !board.every(row => Array.isArray(row) && row.length === config.size &&
            row.every(cell => cell && typeof cell.isMine === 'boolean' && typeof cell.isFlagged === 'boolean' &&
                typeof cell.isRevealed === 'boolean' && !(cell.isRevealed && cell.isFlagged) &&
                Number.isInteger(cell.adjacentMines) && cell.adjacentMines >= 0 && cell.adjacentMines <= 8))) return false;
    const mines = board.flat().filter(cell => cell.isMine).length;
    if (!firstMoveMade) return mines === 0 && board.flat().every(cell => !cell.isRevealed && cell.adjacentMines === 0);
    if (mines !== config.mines || !board.flat().some(cell => cell.isRevealed)) return false;
    return board.every((row, r) => row.every((cell, c) => {
        if (cell.isMine) return cell.adjacentMines === 0;
        let adjacent = 0;
        for (let dr = -1; dr <= 1; dr++) for (let dc = -1; dc <= 1; dc++) {
            if ((dr || dc) && board[r + dr]?.[c + dc]?.isMine) adjacent++;
        }
        return cell.adjacentMines === adjacent;
    }));
}

export function mineSweeperOutcome(state: MineSweeperSnapshot): 'win' | 'loss' | undefined {
    if (!state.firstMoveMade) return undefined;
    if (state.board.some(row => row.some(cell => cell.isMine && cell.isRevealed))) return 'loss';
    return checkWin(state.board) ? 'win' : undefined;
}

export function mineSweeperFlags(state: MineSweeperSnapshot) {
    const flags = state.board.flat().filter(cell => cell.isFlagged);
    return { correct: flags.filter(cell => cell.isMine).length, incorrect: flags.filter(cell => !cell.isMine).length };
}

export function applyMineSweeperMove(state: MineSweeperSnapshot, row: number, col: number, flag: boolean) {
    const selected = state.board[row]?.[col];
    if (!selected || selected.isRevealed || (!flag && selected.isFlagged)) return null;
    let board = state.board.map(cells => cells.map(cell => ({ ...cell })));
    let firstMoveMade = state.firstMoveMade;
    if (flag) {
        board[row][col].isFlagged = !selected.isFlagged;
    } else if (!firstMoveMade) {
        do { board = initializeBoard(state.difficulty); } while (board[row][col].isMine);
        board.forEach((cells, r) => cells.forEach((cell, c) => { cell.isFlagged = state.board[r][c].isFlagged; }));
        revealAdjacentCells(board, row, col);
        firstMoveMade = true;
    } else if (board[row][col].isMine) {
        board[row][col].isRevealed = true;
    } else {
        revealAdjacentCells(board, row, col);
    }
    const snapshot = { ...state, board, firstMoveMade };
    return { snapshot, outcome: mineSweeperOutcome(snapshot) };
}
