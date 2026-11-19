import { applySudokuMove, createSudokuSnapshot, frenzyDurationMs, isSudokuSnapshot } from '../Home/Sudoku/SudokuSession';

jest.mock('@react-native-async-storage/async-storage', () => ({}));

const firstBlank = snapshot => {
    const row = snapshot.board.findIndex(cells => cells.includes(0));
    const col = snapshot.board[row].indexOf(0);
    return [row, col, snapshot.solution[row][col]];
};

it('preserves the exact Daily puzzle and moves in a serialized checkpoint', () => {
    const original = createSudokuSnapshot('Medium', '2026-11-18');
    const [row, col, digit] = firstBlank(original);
    const { snapshot } = applySudokuMove(original, row, col, digit, 'Daily Challenge', 1500);
    const restored = JSON.parse(JSON.stringify(snapshot));
    expect(isSudokuSnapshot(restored)).toBe(true);
    expect(restored.board[row][col]).toBe(digit);
    expect(restored.givens).toEqual(original.givens);
    expect(original.board[row][col]).toBe(0);
});

it('only loses Classic on the fourth mistake and never turns a correct move into a loss', () => {
    const original = { ...createSudokuSnapshot('Easy', '2026-11-18'), mistakes: 3 };
    const [row, col, digit] = firstBlank(original);
    const wrong = digit % 9 + 1;
    expect(applySudokuMove(original, row, col, wrong, 'Classic', 0).outcome).toBe('loss');
    expect(applySudokuMove(original, row, col, digit, 'Classic', 0).outcome).toBeUndefined();
    expect(applySudokuMove(original, row, col, wrong, 'Daily Challenge', 0).outcome).toBeUndefined();
});

it('resets the Frenzy countdown from active time without mutating the givens', () => {
    const original = createSudokuSnapshot('Extreme', '2026-11-18');
    const [row, col, digit] = firstBlank(original);
    const { snapshot } = applySudokuMove(original, row, col, digit, 'Frenzy', 9000);
    expect(frenzyDurationMs('Extreme') + snapshot.frenzyResetAtMs).toBe(39000);
    expect(snapshot.givens[row][col]).toBe(0);
    expect(isSudokuSnapshot({ ...snapshot, solution: snapshot.board })).toBe(false);
});
