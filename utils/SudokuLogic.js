const DIGITS = Array.from({ length: 9 }, (_, i) => i + 1);
const ALL_DIGITS = 0x1ff;
const bitFor = digit => 1 << (digit - 1);
const values = mask => DIGITS.filter(digit => mask & bitFor(digit));
const union = masks => masks.reduce((result, mask) => result | mask, 0);
const cellCount = mask => values(mask).length;
const ROWS = DIGITS.map((_, row) => DIGITS.map((_, col) => row * 9 + col));
const COLS = DIGITS.map((_, col) => DIGITS.map((_, row) => row * 9 + col));
const BOXES = DIGITS.map((_, box) => DIGITS.map((_, offset) =>
    Math.floor(box / 3) * 27 + (box % 3) * 3 + Math.floor(offset / 3) * 9 + offset % 3
));
const UNITS = [...ROWS, ...COLS, ...BOXES];
const PEERS = Array.from({ length: 81 }, (_, cell) =>
    [...new Set(UNITS.filter(unit => unit.includes(cell)).flat())].filter(peer => peer !== cell)
);
const LEVELS = ['Easy', 'Medium', 'Hard', 'Extreme'];
const TECHNIQUE_LEVEL = {
    'Naked single': 'Easy',
    'Hidden single': 'Medium',
    'Locked candidates': 'Hard',
    'Naked pair': 'Hard',
    'Hidden pair': 'Hard',
    'Naked triple': 'Extreme',
    'Hidden triple': 'Extreme',
    'X-Wing': 'Extreme',
};

const combinations = (items, size) => {
    if (size === 0) return [[]];
    return items.flatMap((item, index) =>
        combinations(items.slice(index + 1), size - 1).map(rest => [item, ...rest])
    );
};

const elimination = (technique, cells, candidates, mask) => {
    const eliminations = cells.flatMap(cell => {
        const removed = candidates[cell] & mask;
        return removed ? [{ cell, values: values(removed) }] : [];
    });
    return eliminations.length ? { technique, placements: [], eliminations } : null;
};

const single = (candidates, hidden) => {
    if (!hidden) {
        const cell = candidates.findIndex(mask => cellCount(mask) === 1);
        return cell === -1 ? null : {
            technique: 'Naked single',
            placements: [{ cell, value: values(candidates[cell])[0] }],
            eliminations: [],
        };
    }
    for (const unit of UNITS) {
        for (const digit of DIGITS) {
            const cells = unit.filter(cell => candidates[cell] & bitFor(digit));
            if (cells.length === 1) {
                return {
                    technique: 'Hidden single',
                    placements: [{ cell: cells[0], value: digit }],
                    eliminations: [],
                };
            }
        }
    }
    return null;
};

const lockedCandidates = candidates => {
    // Both pointing (box -> line) and claiming (line -> box).
    for (const unit of UNITS) {
        for (const digit of DIGITS) {
            const mask = bitFor(digit);
            const cells = unit.filter(cell => candidates[cell] & mask);
            if (cells.length < 2) continue;
            const targets = UNITS.filter(other =>
                other !== unit && cells.every(cell => other.includes(cell))
            );
            for (const target of targets) {
                const step = elimination('Locked candidates', target.filter(cell => !unit.includes(cell)), candidates, mask);
                if (step) return step;
            }
        }
    }
    return null;
};

const subset = (candidates, size, hidden) => {
    const technique = `${hidden ? 'Hidden' : 'Naked'} ${size === 2 ? 'pair' : 'triple'}`;
    for (const unit of UNITS) {
        if (hidden) {
            const available = DIGITS.filter(digit => unit.some(cell => candidates[cell] & bitFor(digit)));
            for (const digits of combinations(available, size)) {
                const mask = union(digits.map(bitFor));
                const cells = unit.filter(cell => candidates[cell] & mask);
                if (cells.length !== size) continue;
                const step = elimination(technique, cells, candidates, ALL_DIGITS & ~mask);
                if (step) return step;
            }
        } else {
            const available = unit.filter(cell => {
                const count = cellCount(candidates[cell]);
                return count >= 2 && count <= size;
            });
            for (const cells of combinations(available, size)) {
                const mask = union(cells.map(cell => candidates[cell]));
                if (cellCount(mask) !== size) continue;
                const step = elimination(technique, unit.filter(cell => !cells.includes(cell)), candidates, mask);
                if (step) return step;
            }
        }
    }
    return null;
};

const xWing = candidates => {
    for (const lines of [ROWS, COLS]) {
        const crossLines = lines === ROWS ? COLS : ROWS;
        for (const digit of DIGITS) {
            const mask = bitFor(digit);
            for (let first = 0; first < 8; first++) {
                const positions = lines[first].flatMap((cell, index) => candidates[cell] & mask ? [index] : []);
                if (positions.length !== 2) continue;
                for (let second = first + 1; second < 9; second++) {
                    const other = lines[second].flatMap((cell, index) => candidates[cell] & mask ? [index] : []);
                    if (other.length !== 2 || !positions.every((value, i) => value === other[i])) continue;
                    const targets = positions.flatMap(index => crossLines[index])
                        .filter(cell => !lines[first].includes(cell) && !lines[second].includes(cell));
                    const step = elimination('X-Wing', targets, candidates, mask);
                    if (step) return step;
                }
            }
        }
    }
    return null;
};

/**
 * Find one deduction from 81 candidate bitmasks (bit 0 = digit 1).
 * Filled cells have mask 0. Techniques are always tried from easiest to hardest.
 */
export const findSudokuDeduction = (candidates, maxDifficulty = 'Extreme') => {
    const level = LEVELS.indexOf(maxDifficulty);
    if (level < 0) throw new Error(`Unknown Sudoku difficulty: ${maxDifficulty}`);
    return single(candidates, false) ||
        (level >= 1 && single(candidates, true)) ||
        (level >= 2 && (lockedCandidates(candidates) || subset(candidates, 2, false) || subset(candidates, 2, true))) ||
        (level >= 3 && (subset(candidates, 3, false) || subset(candidates, 3, true) || xWing(candidates))) ||
        null;
};

/**
 * Solve using logic alone; a stalled puzzle is not automatically Extreme.
 * The trace records each placement and candidate elimination without guessing.
 */
export const gradeSudokuPuzzle = (puzzle, maxDifficulty = 'Extreme') => {
    if (!LEVELS.includes(maxDifficulty)) throw new Error(`Unknown Sudoku difficulty: ${maxDifficulty}`);
    if (!Array.isArray(puzzle) || puzzle.length !== 9 ||
        puzzle.some(row => !Array.isArray(row) || row.length !== 9 ||
            row.some(value => !Number.isInteger(value) || value < 0 || value > 9))) {
        throw new Error('Sudoku must be a 9 by 9 grid of integers from 0 to 9.');
    }
    const board = puzzle.flat();
    const steps = [];
    let hardest = 0;
    const result = status => ({
        status,
        difficulty: status === 'solved' ? LEVELS[hardest] : null,
        board: ROWS.map(row => row.map(cell => board[cell])),
        steps,
    });
    if (board.some((digit, cell) => digit && PEERS[cell].some(peer => board[peer] === digit))) {
        return result('invalid');
    }
    const candidates = board.map((digit, cell) => digit ? 0 :
        ALL_DIGITS & ~union(PEERS[cell].map(peer => board[peer] ? bitFor(board[peer]) : 0))
    );

    // Each deduction fills a cell or permanently removes at least one candidate.
    while (board.includes(0)) {
        if (board.some((digit, cell) => digit === 0 && candidates[cell] === 0) ||
            UNITS.some(unit => DIGITS.some(digit =>
                !unit.some(cell => board[cell] === digit || candidates[cell] & bitFor(digit))
            ))) return result('invalid');
        const step = findSudokuDeduction(candidates, maxDifficulty);
        if (!step) return result('stalled');
        for (const { cell, value } of step.placements) {
            board[cell] = value;
            candidates[cell] = 0;
            for (const peer of PEERS[cell]) candidates[peer] &= ~bitFor(value);
        }
        for (const { cell, values: removed } of step.eliminations) {
            candidates[cell] &= ~union(removed.map(bitFor));
        }
        steps.push(step);
        hardest = Math.max(hardest, LEVELS.indexOf(TECHNIQUE_LEVEL[step.technique]));
    }
    return result('solved');
};
