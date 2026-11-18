import { findSudokuDeduction, gradeSudokuPuzzle } from '../../utils/SudokuLogic';
import puzzles from '../../data/sudoku-puzzles.json';

const mask = (...digits) => digits.reduce((result, digit) => result | (1 << (digit - 1)), 0);
const fullCandidates = () => Array(81).fill(0x1ff);
const parse = encoded => Array.from({ length: 9 }, (_, row) =>
    [...encoded.slice(row * 9, row * 9 + 9)].map(Number)
);

describe('Sudoku logical deductions', () => {
    it('places naked singles before considering harder techniques', () => {
        const candidates = fullCandidates();
        candidates[0] = mask(4);
        expect(findSudokuDeduction(candidates, 'Easy')).toEqual({
            technique: 'Naked single',
            placements: [{ cell: 0, value: 4 }],
            eliminations: [],
        });
    });

    it('places a hidden single only when a digit has one remaining position', () => {
        const candidates = fullCandidates();
        for (let cell = 1; cell < 9; cell++) candidates[cell] &= ~mask(1);
        expect(findSudokuDeduction(candidates, 'Easy')).toBeNull();
        expect(findSudokuDeduction(candidates, 'Medium').placements).toEqual([{ cell: 0, value: 1 }]);

        candidates[4] |= mask(1);
        expect(findSudokuDeduction(candidates, 'Medium')).toBeNull();
    });

    it.each(['pointing', 'claiming'])('uses locked candidates for %s', direction => {
        const candidates = fullCandidates();
        const removeFrom = direction === 'pointing' ? [2, 9, 10, 11, 18, 19, 20] : [2, 3, 4, 5, 6, 7, 8];
        for (const cell of removeFrom) candidates[cell] &= ~mask(1);
        const step = findSudokuDeduction(candidates, 'Hard');
        expect(step.technique).toBe('Locked candidates');
        expect(step.eliminations).toEqual(
            (direction === 'pointing' ? [3, 4, 5, 6, 7, 8] : [9, 10, 11, 18, 19, 20])
                .map(cell => ({ cell, values: [1] }))
        );
    });

    it('does not lock a digit whose box candidates occupy different rows and columns', () => {
        const candidates = fullCandidates();
        for (const cell of [1, 2, 9, 11, 18, 19, 20]) candidates[cell] &= ~mask(1);
        expect(findSudokuDeduction(candidates, 'Hard')).toBeNull();
    });

    it('eliminates naked pairs without removing either paired digit from the pair', () => {
        const candidates = fullCandidates();
        candidates[0] = candidates[4] = mask(1, 2);
        const step = findSudokuDeduction(candidates, 'Hard');
        expect(step.technique).toBe('Naked pair');
        expect(step.eliminations).toEqual([1, 2, 3, 5, 6, 7, 8].map(cell => ({ cell, values: [1, 2] })));
        candidates[4] = mask(1, 2, 3);
        expect(findSudokuDeduction(candidates, 'Hard')).toBeNull();
    });

    it('restricts a hidden pair to the two digits confined to those cells', () => {
        const candidates = fullCandidates();
        for (const cell of [1, 2, 3, 5, 6, 7, 8]) candidates[cell] &= ~mask(1, 2);
        const step = findSudokuDeduction(candidates, 'Hard');
        expect(step.technique).toBe('Hidden pair');
        expect(step.eliminations).toEqual([0, 4].map(cell => ({ cell, values: [3, 4, 5, 6, 7, 8, 9] })));
        candidates[8] |= mask(1, 2);
        expect(findSudokuDeduction(candidates, 'Hard')).toBeNull();
    });

    it('recognizes a naked triple even when no cell contains all three digits', () => {
        const candidates = fullCandidates();
        candidates[0] = mask(1, 2);
        candidates[4] = mask(2, 3);
        candidates[8] = mask(1, 3);
        expect(findSudokuDeduction(candidates, 'Hard')).toBeNull();
        const step = findSudokuDeduction(candidates, 'Extreme');
        expect(step.technique).toBe('Naked triple');
        expect(step.eliminations).toEqual([1, 2, 3, 5, 6, 7].map(cell => ({ cell, values: [1, 2, 3] })));
        candidates[8] |= mask(4);
        expect(findSudokuDeduction(candidates, 'Extreme')).toBeNull();
    });

    it('restricts a hidden triple but not three digits spread over four cells', () => {
        const candidates = fullCandidates();
        for (const cell of [1, 2, 3, 5, 6, 7]) candidates[cell] &= ~mask(1, 2, 3);
        expect(findSudokuDeduction(candidates, 'Hard')).toBeNull();
        const step = findSudokuDeduction(candidates, 'Extreme');
        expect(step.technique).toBe('Hidden triple');
        expect(step.eliminations).toEqual([0, 4, 8].map(cell => ({ cell, values: [4, 5, 6, 7, 8, 9] })));
        candidates[7] |= mask(1, 2, 3);
        expect(findSudokuDeduction(candidates, 'Extreme')).toBeNull();
    });

    it.each([false, true])('uses X-Wing in both orientations (transpose=%s)', transpose => {
        const candidates = fullCandidates();
        const index = (row, col) => transpose ? col * 9 + row : row * 9 + col;
        for (const row of [0, 4]) {
            for (let col = 0; col < 9; col++) {
                if (col !== 1 && col !== 5) candidates[index(row, col)] &= ~mask(1);
            }
        }
        expect(findSudokuDeduction(candidates, 'Hard')).toBeNull();
        const step = findSudokuDeduction(candidates, 'Extreme');
        expect(step.technique).toBe('X-Wing');
        const targets = [0, 1, 2, 3, 4, 5, 6, 7, 8].filter(row => row !== 0 && row !== 4)
            .flatMap(row => [index(row, 1), index(row, 5)]);
        expect(step.eliminations.map(({ cell }) => cell).sort((a, b) => a - b)).toEqual(targets.sort((a, b) => a - b));
        expect(step.eliminations.every(({ values }) => values.join() === '1')).toBe(true);

        candidates[index(4, 8)] |= mask(1);
        expect(findSudokuDeduction(candidates, 'Extreme')).toBeNull();
    });
});

describe('Sudoku difficulty grading', () => {
    it.each([
        ['Easy', null],
        ['Medium', 'Easy'],
        ['Hard', 'Medium'],
        ['Extreme', 'Hard'],
    ])('solves a fixed %s puzzle but the easier solver cannot finish it', (difficulty, easier) => {
        const puzzle = parse(puzzles[difficulty][0]);
        const original = puzzle.map(row => [...row]);
        const grade = gradeSudokuPuzzle(puzzle);
        expect(grade.status).toBe('solved');
        expect(grade.difficulty).toBe(difficulty);
        expect(grade.steps.length).toBeGreaterThan(0);
        expect(puzzle).toEqual(original);
        if (easier) expect(gradeSudokuPuzzle(puzzle, easier).status).toBe('stalled');
    });

    it('does not label puzzles requiring unsupported reasoning as Extreme', () => {
        // Original generator's seed 3: unique, but beyond the supported logic.
        const puzzle = parse('008090100000000327200030000000010006019065008000000970806020090002083000900070000');
        const grade = gradeSudokuPuzzle(puzzle);
        expect(grade.status).toBe('stalled');
        expect(grade.difficulty).toBeNull();
    });

    it('rejects duplicate givens and contradictions rather than grading them', () => {
        const duplicate = Array.from({ length: 9 }, () => Array(9).fill(0));
        duplicate[0][0] = duplicate[0][1] = 1;
        expect(gradeSudokuPuzzle(duplicate).status).toBe('invalid');
        const impossible = Array.from({ length: 9 }, () => Array(9).fill(0));
        impossible[0] = [1, 2, 3, 4, 5, 6, 7, 8, 0];
        impossible[1][8] = 9;
        expect(gradeSudokuPuzzle(impossible).status).toBe('invalid');
    });

    it('reports malformed requests explicitly', () => {
        expect(() => gradeSudokuPuzzle([[0]])).toThrow('9 by 9');
        expect(() => gradeSudokuPuzzle(parse(puzzles.Easy[0]), 'Unknown')).toThrow('Unknown Sudoku difficulty');
    });
});
