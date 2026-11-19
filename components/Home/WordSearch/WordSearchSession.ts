import { WORD_POOLS } from '@/data/wordSearchWords';
import { initializeGrid, type Cell } from '@/utils/WordSearchGenerator';
import { getRandomColor } from '@/utils/wordSearch';

type Direction = 'horizontal' | 'vertical' | 'diagonal-right' | 'diagonal-left';
export type SearchCell = Cell & { foundColor?: string };
export type WordSearchSnapshot = {
    grid: SearchCell[][];
    wordBank: string[];
    foundWords: string[];
    wordColors: Record<string, string>;
    hintsUsed: number;
    level: number;
    score: number;
    wordsFound: number;
    stopped: boolean;
};
const settings = {
    Easy: { size: 6, buckets: { Three: 4, Four: 1 } },
    Medium: { size: 8, buckets: { Four: 1, Five: 4, SixPlus: 1 } },
    Hard: { size: 10, buckets: { Five: 1, SixPlus: 7 } },
} as const;
const count = (value: unknown) => Number.isSafeInteger(value) && (value as number) >= 0;
const directions = [[0, 1], [1, 0], [1, 1], [1, -1]];
function hasWord(grid: SearchCell[][], word: string) {
    return grid.some((row, r) => row.some((_, c) => directions.some(([dr, dc]) =>
        [...word].every((letter, i) => grid[r + dr * i]?.[c + dc * i]?.letter === letter))));
}

export function isWordSearchSnapshot(value: unknown): value is WordSearchSnapshot {
    if (!value || typeof value !== 'object') return false;
    const s = value as WordSearchSnapshot;
    if (!Array.isArray(s.grid) || !s.grid.length || s.grid.length > 10 ||
        !s.grid.every(row => Array.isArray(row) && row.length === s.grid.length && row.every(cell =>
            cell && typeof cell.letter === 'string' && /^[A-Z]$/.test(cell.letter) &&
            ['selected', 'partOfWord', 'isFound', 'partOfFoundWord'].every(key => typeof (cell as any)[key] === 'boolean') &&
            (cell.foundColor === undefined || typeof cell.foundColor === 'string') &&
            (cell.wordDirection === undefined || ['horizontal', 'vertical', 'diagonal-right', 'diagonal-left'].includes(cell.wordDirection)) &&
            (cell.wordDirections === undefined || (Array.isArray(cell.wordDirections) && cell.wordDirections.every((d: string) =>
                ['horizontal', 'vertical', 'diagonal-right', 'diagonal-left'].includes(d)))) &&
            (cell.foundColors === undefined || (Array.isArray(cell.foundColors) && cell.foundColors.every((c: unknown) => typeof c === 'string'))))) ||
        !Array.isArray(s.wordBank) || !s.wordBank.length || new Set(s.wordBank).size !== s.wordBank.length ||
        !s.wordBank.every(w => typeof w === 'string' && /^[A-Z]+$/.test(w) && hasWord(s.grid, w)) ||
        !Array.isArray(s.foundWords) || new Set(s.foundWords).size !== s.foundWords.length ||
        !s.foundWords.every(w => s.wordBank.includes(w)) || !s.wordColors || typeof s.wordColors !== 'object' ||
        !s.foundWords.every(w => typeof s.wordColors[w] === 'string') ||
        !count(s.hintsUsed) || !count(s.score) || !count(s.wordsFound) || s.wordsFound < s.foundWords.length ||
        typeof s.stopped !== 'boolean' ||
        !Number.isSafeInteger(s.level) || s.level < 1) return false;
    return true;
}

export function createWordSearchSnapshot(difficulty: string): WordSearchSnapshot {
    const config = settings[difficulty as keyof typeof settings];
    if (!config) throw new Error('Unknown Word Search difficulty.');
    for (let attempt = 0; attempt < 20; attempt++) {
        const wordBank: string[] = [];
        for (const [bucket, amount] of Object.entries(config.buckets)) {
            const pool = (WORD_POOLS[bucket as keyof typeof WORD_POOLS] as string[])
                .filter(word => word.length <= config.size);
            wordBank.push(...pool.sort(() => Math.random() - 0.5).slice(0, amount));
        }
        const unique = [...new Set(wordBank)];
        const grid = initializeGrid(config.size, unique);
        if (unique.length === wordBank.length && unique.every(word => hasWord(grid, word))) {
            return { grid, wordBank: unique, foundWords: [], wordColors: {}, hintsUsed: 0,
                level: 1, score: 0, wordsFound: 0, stopped: false };
        }
    }
    throw new Error('Could not generate a complete word search. Please retry.');
}

export function selectWordSearchCell(s: WordSearchSnapshot, row: number, col: number): WordSearchSnapshot | null {
    if (!s.grid[row]?.[col]) return null;
    const grid = s.grid.map((cells, r) => cells.map((cell, c) =>
        r === row && c === col ? { ...cell, selected: !cell.selected } : cell));
    const selected: { row: number; col: number; letter: string }[] = [];
    grid.forEach((cells, r) => cells.forEach((cell, c) => {
        if (cell.selected) selected.push({ row: r, col: c, letter: cell.letter });
    }));
    const word = selected.map(cell => cell.letter).join('');
    if (!s.wordBank.includes(word) || s.foundWords.includes(word)) return { ...s, grid };
    const first = selected[0], second = selected[1];
    const dr = second.row - first.row, dc = second.col - first.col;
    if (!directions.some(([r, c]) => r === dr && c === dc) ||
        !selected.every((cell, i) => cell.row === first.row + dr * i && cell.col === first.col + dc * i)) return { ...s, grid };
    const direction: Direction = dr === 0 ? 'horizontal' : dc === 0 ? 'vertical' :
        dc === 1 ? 'diagonal-right' : 'diagonal-left';
    const color = getRandomColor();
    return {
        ...s, foundWords: [...s.foundWords, word], wordsFound: s.wordsFound + 1,
        wordColors: { ...s.wordColors, [word]: color },
        grid: grid.map(cells => cells.map(cell => cell.selected ? {
            ...cell, selected: false, isFound: true, partOfFoundWord: true,
            wordDirection: direction, foundColor: color,
            wordDirections: [...(cell.wordDirections || []), direction],
            foundColors: [...(cell.foundColors || []), color],
        } : { ...cell, selected: false })),
    };
}

export function nextWordSearchLevel(s: WordSearchSnapshot, difficulty: string): WordSearchSnapshot {
    const next = createWordSearchSnapshot(difficulty);
    return { ...next, level: s.level + 1, score: s.score + 100 * s.level,
        wordsFound: s.wordsFound, hintsUsed: s.hintsUsed };
}
