import wordsList from '@/data/wordsList.json';
import crosswordData from '@/data/crosswordData.json';

export type PlacedWord = {
    word: string;
    startPosition: { row: number; col: number; direction: 'horizontal' | 'vertical' };
    clue: string;
};
export type CrosswordSnapshot = {
    grid: string[][];
    placedWords: PlacedWord[];
    guessedWords: string[];
    wrongCount: number;
    hintsUsed: number;
    level: number;
    score: number;
    correctWords: number;
    stopped: boolean;
};

const count = (value: unknown) => Number.isSafeInteger(value) && (value as number) >= 0;

export function isCrosswordSnapshot(value: unknown): value is CrosswordSnapshot {
    if (!value || typeof value !== 'object') return false;
    const s = value as CrosswordSnapshot;
    if (!Array.isArray(s.grid) || !s.grid.length || s.grid.length > 15 ||
        !s.grid.every(row => Array.isArray(row) && row.length === s.grid.length &&
            row.every(c => typeof c === 'string' && (c === '' || /^[a-z]$/i.test(c)))) ||
        !Array.isArray(s.placedWords) || !s.placedWords.length || !Array.isArray(s.guessedWords) ||
        !count(s.wrongCount) || !count(s.hintsUsed) || !count(s.score) ||
        !count(s.correctWords) || typeof s.stopped !== 'boolean' || !Number.isSafeInteger(s.level) || s.level < 1) return false;
    const words = new Set<string>();
    for (const item of s.placedWords) {
        if (!item || typeof item.word !== 'string' || !/^[a-z]+$/i.test(item.word) ||
            typeof item.clue !== 'string' || words.has(item.word) || !item.startPosition) return false;
        const { row, col, direction } = item.startPosition;
        if (!Number.isInteger(row) || !Number.isInteger(col) || row < 0 || col < 0 ||
            (direction !== 'horizontal' && direction !== 'vertical')) return false;
        if (![...item.word].every((letter, i) =>
            s.grid[row + (direction === 'vertical' ? i : 0)]?.[col + (direction === 'horizontal' ? i : 0)]?.toUpperCase() === letter.toUpperCase())) return false;
        words.add(item.word);
    }
    return new Set(s.guessedWords).size === s.guessedWords.length &&
        s.guessedWords.every(word => words.has(word)) && s.correctWords >= s.guessedWords.length;
}

export function createCrosswordSnapshot(difficulty: string): CrosswordSnapshot {
    const counts: Record<string, number> = { Easy: 6, Medium: 9, Hard: 14 };
    if (!counts[difficulty]) throw new Error('Unknown Crossword difficulty.');
    // The legacy generator mutates its input and has unbounded placement loops.
    // Bound attempts so a session can fail visibly instead of hanging the UI.
    const candidates = [...new Set(wordsList.filter(word => /^[a-z]+$/i.test(word) && word.length >= 3 && word.length <= 10))];
    for (let i = candidates.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [candidates[i], candidates[j]] = [candidates[j], candidates[i]];
    }
    const grid: string[][] = Array.from({ length: 15 }, () => Array(15).fill(''));
    const first = candidates.shift()!;
    const placedWords: Omit<PlacedWord, 'clue'>[] = [
        { word: first, startPosition: { row: 7, col: Math.floor((15 - first.length) / 2), direction: 'horizontal' } },
    ];
    [...first].forEach((letter, i) => { grid[7][placedWords[0].startPosition.col + i] = letter; });
    for (const word of candidates) {
        if (placedWords.length >= counts[difficulty]) break;
        let placement: Omit<PlacedWord, 'clue'>['startPosition'] | undefined;
        for (const existing of placedWords) {
            const direction = existing.startPosition.direction === 'horizontal' ? 'vertical' : 'horizontal';
            for (let a = 0; a < existing.word.length && !placement; a++) {
                for (let b = 0; b < word.length && !placement; b++) {
                    if (existing.word[a] !== word[b]) continue;
                    const row = existing.startPosition.row + (direction === 'horizontal' ? a : -b);
                    const col = existing.startPosition.col + (direction === 'vertical' ? a : -b);
                    const dr = direction === 'vertical' ? 1 : 0;
                    const dc = direction === 'horizontal' ? 1 : 0;
                    if (row < 0 || col < 0 || row + dr * (word.length - 1) >= 15 ||
                        col + dc * (word.length - 1) >= 15 ||
                        grid[row - dr]?.[col - dc] || grid[row + dr * word.length]?.[col + dc * word.length]) continue;
                    const fits = [...word].every((letter, i) => {
                        const r = row + dr * i, c = col + dc * i, cell = grid[r][c];
                        return cell ? cell === letter : !grid[r - dc]?.[c - dr] && !grid[r + dc]?.[c + dr];
                    });
                    if (fits) placement = { row, col, direction };
                }
            }
            if (placement) break;
        }
        if (placement) {
            const { row, col, direction } = placement;
            [...word].forEach((letter, i) => {
                grid[row + (direction === 'vertical' ? i : 0)][col + (direction === 'horizontal' ? i : 0)] = letter;
            });
            placedWords.push({ word, startPosition: placement });
        }
    }
    const minimum: Record<string, number> = { Easy: 5, Medium: 7, Hard: 10 };
    if (placedWords.length < minimum[difficulty]) throw new Error('Could not generate a complete crossword. Please retry.');
    const occupied = grid.flatMap((row, r) => row.flatMap((letter, c) => letter ? [{ r, c }] : []));
    const minRow = Math.min(...occupied.map(cell => cell.r));
    const minCol = Math.min(...occupied.map(cell => cell.c));
    const size = Math.max(Math.max(...occupied.map(cell => cell.r)) - minRow + 1,
        Math.max(...occupied.map(cell => cell.c)) - minCol + 1);
    const condensed = Array.from({ length: size }, (_, r) =>
        Array.from({ length: size }, (_, c) => grid[minRow + r]?.[minCol + c] ?? ''));
    return {
        grid: condensed,
        placedWords: placedWords.map((word: Omit<PlacedWord, 'clue'>) => ({
            ...word, startPosition: { ...word.startPosition,
                row: word.startPosition.row - minRow, col: word.startPosition.col - minCol },
            clue: crosswordData.find(data => data.word === word.word)?.clue ?? 'No clue available',
        })),
        guessedWords: [], wrongCount: 0, hintsUsed: 0, level: 1, score: 0, correctWords: 0, stopped: false,
    };
}

export function applyCrosswordGuess(s: CrosswordSnapshot, index: number, guess: string): CrosswordSnapshot | null {
    const word = s.placedWords[index];
    if (!word || s.guessedWords.includes(word.word)) return null;
    if (guess.trim().toLowerCase() !== word.word.toLowerCase()) return { ...s, wrongCount: s.wrongCount + 1 };
    return { ...s, guessedWords: [...s.guessedWords, word.word], correctWords: s.correctWords + 1 };
}

export function nextCrosswordLevel(s: CrosswordSnapshot, difficulty: string): CrosswordSnapshot {
    const next = createCrosswordSnapshot(difficulty);
    return { ...next, level: s.level + 1, score: s.score + 100 * s.level,
        correctWords: s.correctWords, hintsUsed: s.hintsUsed };
}
