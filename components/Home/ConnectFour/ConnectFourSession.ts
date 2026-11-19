import { initializeBoard, checkWinner, isDraw, placeDisc, type Board, type Player } from '@/utils/ConnectFourGenerator';

export type ConnectSnapshot = { board: Board; player: Player; moves: number; countdown: number | null;
    outcome: 'win' | 'loss' | 'draw' | null };
export const createConnectSnapshot = (): ConnectSnapshot =>
    ({ board: initializeBoard(), player: 'player', moves: 0, countdown: 3, outcome: null });
export function isConnectSnapshot(data: unknown): data is ConnectSnapshot {
    const s = data as ConnectSnapshot;
    if (!(!!s && Array.isArray(s.board) && s.board.length === 6 &&
        s.board.every(row => Array.isArray(row) && row.length === 7 &&
            row.every(cell => ['empty', 'player', 'ai'].includes(cell))) &&
        ['player', 'ai'].includes(s.player) && Number.isSafeInteger(s.moves) && s.moves >= 0 &&
        (s.countdown === null || (Number.isInteger(s.countdown) && s.countdown >= 0 && s.countdown <= 3)) &&
        [null, 'win', 'loss', 'draw'].includes(s.outcome))) return false;
    const players = s.board.flat().filter(cell => cell === 'player').length;
    const ais = s.board.flat().filter(cell => cell === 'ai').length;
    if (s.moves !== players || (players !== ais && players !== ais + 1) ||
        s.player !== (players === ais ? 'player' : 'ai') ||
        (s.countdown !== null && players !== 0)) return false;
    for (let col = 0; col < 7; col++) {
        let empty = false;
        for (let row = 5; row >= 0; row--) {
            if (s.board[row][col] === 'empty') empty = true;
            else if (empty) return false;
        }
    }
    const winner = checkWinner(s.board);
    const expected = winner === 'player' ? 'win' : winner === 'ai' ? 'loss' : isDraw(s.board) ? 'draw' : null;
    return s.outcome === expected;
}
export function connectMove(s: ConnectSnapshot, col: number): ConnectSnapshot | null {
    if (!Number.isInteger(col) || col < 0 || col >= 7 || s.outcome || s.countdown !== null) return null;
    const board = placeDisc(s.board, col, s.player);
    if (!board) return null;
    const winner = checkWinner(board);
    return { ...s, board, moves: s.moves + (s.player === 'player' ? 1 : 0),
        player: s.player === 'player' ? 'ai' : 'player',
        outcome: winner ? (winner === 'player' ? 'win' : 'loss') : isDraw(board) ? 'draw' : null };
}
