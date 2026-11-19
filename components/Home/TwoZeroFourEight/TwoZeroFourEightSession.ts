import { addRandomTile, canMove, hasWon, initializeBoardWithTiles, move, type Board } from '@/utils/TwoZeroFourEightGenerator';
import type { SessionIdentity } from '@/db/Sessions/Sessions';

export type TileSnapshot = { difficulty: string; board: Board; score: number; moves: number };
type Direction = 'up' | 'down' | 'left' | 'right';

export function createTileSnapshot(difficulty: string): TileSnapshot {
    return { difficulty, board: initializeBoardWithTiles(difficulty), score: 0, moves: 0 };
}

export function isTileSnapshot(value: unknown, identity: SessionIdentity): value is TileSnapshot {
    if (!value || typeof value !== 'object') return false;
    const { difficulty, board, score, moves } = value as TileSnapshot;
    if (!['Easy', 'Medium', 'Hard'].includes(difficulty) || difficulty !== identity.difficulty ||
        !Number.isSafeInteger(score) || score < 0 ||
        !Number.isSafeInteger(moves) || moves < 0 || !Array.isArray(board)) return false;
    const size = difficulty === 'Easy' ? 5 : 4;
    return board.length === size && board.every(row => Array.isArray(row) && row.length === size &&
        row.every(cell => cell === null || (Number.isSafeInteger(cell) && cell >= 2 &&
            Number.isInteger(Math.log2(cell)) && cell <= 2048))) && board.some(row => row.some(cell => cell !== null));
}

export function tileOutcome(state: TileSnapshot): 'win' | 'loss' | undefined {
    return hasWon(state.board) ? 'win' : !canMove(state.board) ? 'loss' : undefined;
}

export function applyTileMove(state: TileSnapshot, direction: Direction) {
    const result = move(state.board, direction);
    if (!result.moved) return null;
    const snapshot = { ...state, board: addRandomTile(result.board, state.difficulty),
        score: state.score + result.scoreGained, moves: state.moves + 1 };
    return { snapshot, outcome: tileOutcome(snapshot) };
}
