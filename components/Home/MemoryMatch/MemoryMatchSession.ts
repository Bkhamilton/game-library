import { initializeBoard, checkMatch, getBoardSize, getMaxIncorrectGuesses, type Card } from '@/utils/MemoryMatchGenerator';
import type { SessionIdentity } from '@/db/Sessions/Sessions';

export type MemorySnapshot = {
    cards: Card[];
    flipped: number[];
    matches: number;
    mistakes: number;
    phase: 'preview' | 'play';
    outcome: 'win' | 'loss' | null;
};

export function createMemorySnapshot(difficulty: string): MemorySnapshot {
    return { cards: initializeBoard(difficulty).map(card => ({ ...card, isFlipped: true })),
        flipped: [], matches: 0, mistakes: 0, phase: 'preview', outcome: null };
}

export function isMemorySnapshot(data: unknown, identity?: SessionIdentity): data is MemorySnapshot {
    const s = data as MemorySnapshot;
    if (!s || !Array.isArray(s.cards) || ![16, 36, 64].includes(s.cards.length) ||
        !Array.isArray(s.flipped) || s.flipped.length > 2 ||
        !Number.isSafeInteger(s.matches) || s.matches < 0 ||
        !Number.isSafeInteger(s.mistakes) || s.mistakes < 0 ||
        !['preview', 'play'].includes(s.phase) || ![null, 'win', 'loss'].includes(s.outcome)) return false;
    if (!s.cards.every(c => c && typeof c.id === 'string' && typeof c.value === 'string' &&
        typeof c.isFlipped === 'boolean' && typeof c.isMatched === 'boolean')) return false;
    if (identity) {
        const { rows, cols } = getBoardSize(identity.difficulty);
        const limit = getMaxIncorrectGuesses(identity.difficulty);
        if (s.cards.length !== rows * cols ||
            (s.outcome === 'loss' ? s.mistakes < limit : s.mistakes >= limit)) return false;
    }
    const groups = new Map<string, Card[]>();
    for (const card of s.cards) groups.set(card.value, [...(groups.get(card.value) ?? []), card]);
    return new Set(s.cards.map(c => c.id)).size === s.cards.length &&
        [...groups.values()].every(pair => pair.length === 2 && pair[0].isMatched === pair[1].isMatched) &&
        new Set(s.flipped).size === s.flipped.length &&
        s.flipped.every(i => Number.isInteger(i) && i >= 0 && i < s.cards.length &&
            s.cards[i].isFlipped && !s.cards[i].isMatched) &&
        s.matches * 2 === s.cards.filter(c => c.isMatched).length &&
        (s.phase === 'preview' ? s.flipped.length === 0 && s.matches === 0 &&
            s.cards.every(c => c.isFlipped && !c.isMatched) :
            s.cards.every((c, i) => c.isFlipped === s.flipped.includes(i))) &&
        (s.outcome === 'win' ? s.matches * 2 === s.cards.length :
            s.matches * 2 < s.cards.length);
}

export function resolveMemoryPair(s: MemorySnapshot, maxMistakes: number): MemorySnapshot {
    if (s.flipped.length !== 2) return s;
    const [a, b] = s.flipped;
    const match = checkMatch(s.cards[a], s.cards[b]);
    const cards = s.cards.map((card, i) => i === a || i === b
        ? { ...card, isFlipped: false, isMatched: match } : card);
    const matches = s.matches + (match ? 1 : 0);
    const mistakes = s.mistakes + (match ? 0 : 1);
    return { ...s, cards, flipped: [], matches, mistakes,
        outcome: matches * 2 === cards.length ? 'win' : mistakes >= maxMistakes ? 'loss' : null };
}
