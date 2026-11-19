import { afterEach, expect, it, jest } from '@jest/globals';
import * as mineGenerator from '@/utils/MineSweeperGenerator';
import { initializeBoard } from '@/utils/MineSweeperGenerator';
import { applyMineSweeperMove, createMineSweeperSnapshot, isMineSweeperSnapshot, mineSweeperFlags } from '@/components/Home/MineSweeper/MineSweeperSession';
import { applyTileMove, isTileSnapshot, tileOutcome, type TileSnapshot } from '@/components/Home/TwoZeroFourEight/TwoZeroFourEightSession';

afterEach(() => { jest.restoreAllMocks(); });
const identity = (difficulty: string) => ({ gameId: 1, mode: 'Classic', difficulty });

it('allows flags before the first safe reveal and preserves them without mutating earlier checkpoints', () => {
    const initial = createMineSweeperSnapshot('Easy');
    const flagged = applyMineSweeperMove(initial, 0, 0, true)!.snapshot;
    expect(initial.board[0][0].isFlagged).toBe(false);
    expect(flagged.firstMoveMade).toBe(false);
    expect(applyMineSweeperMove(flagged, 0, 0, false)).toBeNull();
    const revealed = applyMineSweeperMove(flagged, 7, 7, false)!.snapshot;
    expect(revealed.board[0][0].isFlagged).toBe(true);
    expect(revealed.board[0][0].isRevealed).toBe(false);
    expect(revealed.board[7][7]).toEqual(expect.objectContaining({ isMine: false, isRevealed: true }));
    expect(isMineSweeperSnapshot(revealed, identity('Easy'))).toBe(true);
    expect(isMineSweeperSnapshot(revealed, identity('Medium'))).toBe(false);
    expect(flagged.board.flat().every(cell => !cell.isMine)).toBe(true);
});

it('evaluates a winning reveal and final flag counts from the new board', () => {
    const board = initializeBoard('Easy');
    const mine = board.flat().find(cell => cell.isMine)!;
    mine.isFlagged = true;
    const safe = board.flat().filter(cell => !cell.isMine);
    safe.slice(1).forEach(cell => { cell.isRevealed = true; });
    const last = safe[0];
    const state = { difficulty: 'Easy', board, firstMoveMade: true };
    const result = applyMineSweeperMove(state, last.row, last.col, false)!;
    expect(result.outcome).toBe('win');
    expect(mineSweeperFlags(result.snapshot)).toEqual({ correct: 1, incorrect: 0 });
    expect(last.isRevealed).toBe(false);
    expect(isMineSweeperSnapshot(result.snapshot, identity('Easy'))).toBe(true);
    expect(isMineSweeperSnapshot({ ...state, board: board.slice(1) }, identity('Easy'))).toBe(false);
});

it('recognizes a win caused by the first safe reveal', () => {
    const board = mineGenerator.createBoard('Easy');
    board.forEach((row, r) => row.forEach((cell, c) => {
        cell.isMine = r < 2 && c < 5;
    }));
    board.forEach((row, r) => row.forEach((cell, c) => {
        if (cell.isMine) return;
        for (let dr = -1; dr <= 1; dr++) for (let dc = -1; dc <= 1; dc++) {
            if ((dr || dc) && board[r + dr]?.[c + dc]?.isMine) cell.adjacentMines++;
        }
    }));
    jest.spyOn(mineGenerator, 'initializeBoard').mockReturnValue(board);
    const result = applyMineSweeperMove(createMineSweeperSnapshot('Easy'), 7, 7, false)!;
    expect(result.outcome).toBe('win');
    expect(isMineSweeperSnapshot(result.snapshot, identity('Easy'))).toBe(true);
});

it('uses the final merged board and score and favors a win over no moves', () => {
    const state: TileSnapshot = { difficulty: 'Medium', score: 100, moves: 7, board: [
        [1024, 1024, null, null], [2, 4, 2, 4], [4, 2, 4, 2], [2, 4, 2, 4],
    ] };
    jest.spyOn(Math, 'random').mockReturnValue(0);
    const result = applyTileMove(state, 'left')!;
    expect(result.outcome).toBe('win');
    expect(result.snapshot.board[0][0]).toBe(2048);
    expect(result.snapshot.score).toBe(2148);
    expect(result.snapshot.moves).toBe(8);
    expect(state.board[0][0]).toBe(1024);
    expect(isTileSnapshot(result.snapshot, identity('Medium'))).toBe(true);
    expect(isTileSnapshot(result.snapshot, identity('Hard'))).toBe(false);
    expect(isTileSnapshot({ ...state, board: [[3]] }, identity('Medium'))).toBe(false);
    expect(tileOutcome({ ...state, board: [
        [2048, 2, 4, 2], [2, 4, 2, 4], [4, 2, 4, 2], [2, 4, 2, 4],
    ] })).toBe('win');
});

it('detects a loss after the last tile spawns and ignores an unchanged move', () => {
    const state: TileSnapshot = { difficulty: 'Medium', score: 0, moves: 0, board: [
        [4, 2, 4, 2], [2, 4, 2, 4], [4, 2, 4, 2], [4, 2, 4, null],
    ] };
    expect(applyTileMove(state, 'left')).toBeNull();
    jest.spyOn(Math, 'random').mockReturnValue(0);
    const result = applyTileMove(state, 'right')!;
    expect(result.outcome).toBe('loss');
    expect(result.snapshot.moves).toBe(1);
    expect(state.board[3][3]).toBeNull();
});
