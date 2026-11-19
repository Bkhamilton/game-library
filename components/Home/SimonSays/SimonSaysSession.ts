import { getDifficultySettings } from '@/utils/SimonSaysGenerator';
import type { SessionIdentity } from '@/db/Sessions/Sessions';

export type SimonSnapshot = {
    sequence: number[];
    input: number[];
    phase: 'countdown' | 'next' | 'showing' | 'input';
    countdown: number;
    completed: number;
    outcome: 'loss' | null;
};
export const createSimonSnapshot = (): SimonSnapshot =>
    ({ sequence: [], input: [], phase: 'countdown', countdown: 3, completed: 0, outcome: null });
export function isSimonSnapshot(data: unknown, identity?: SessionIdentity): data is SimonSnapshot {
    const s = data as SimonSnapshot;
    if (!(!!s && Array.isArray(s.sequence) && Array.isArray(s.input) &&
        s.sequence.every(n => Number.isInteger(n) && n >= 0 && n < 9) &&
        s.input.every((n, i) => n === s.sequence[i]) &&
        s.input.length <= s.sequence.length && ['countdown', 'next', 'showing', 'input'].includes(s.phase) &&
        Number.isSafeInteger(s.countdown) && s.countdown >= 0 && s.countdown <= 3 &&
        Number.isSafeInteger(s.completed) && s.completed >= 0 && s.completed <= s.sequence.length &&
        (s.outcome === null || s.outcome === 'loss'))) return false;
    if (identity && s.sequence.some(tile => tile >= getDifficultySettings(identity.difficulty).tileCount)) return false;
    if (s.phase === 'countdown') return s.sequence.length === 0 && s.input.length === 0 &&
        s.completed === 0 && s.outcome === null;
    if (s.phase === 'next') return s.sequence.length > 0 && s.completed === s.sequence.length &&
        s.input.length === s.sequence.length && s.outcome === null;
    return s.sequence.length === s.completed + 1 &&
        (s.phase !== 'showing' || s.input.length === 0) &&
        (s.phase !== 'input' || s.input.length < s.sequence.length) &&
        (s.outcome === null || s.phase === 'input');
}
