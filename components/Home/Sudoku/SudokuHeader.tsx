import React from 'react';
import { Text } from '@/components/Themed';
import GameHeader from '../GameHeader/GameHeader';

interface SudokuHeaderProps {
    wrongCount: number;
    mode?: string;
    elapsedMs: number;
    remainingMs?: number;
}

export default function SudokuHeader({
    wrongCount, mode = 'Classic', elapsedMs, remainingMs = 0,
}: SudokuHeaderProps) {
    const frenzy = mode === 'Frenzy';
    const seconds = frenzy ? Math.ceil(remainingMs / 1000) : Math.floor(elapsedMs / 1000);
    const clock = `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, '0')}`;
    return (
        <GameHeader
            leftContent={mode !== 'Classic' ? <Text>{mode}</Text> : undefined}
            rightContent={!frenzy ? <Text>{wrongCount}/4</Text> : undefined}
            centerContent={<Text accessibilityLabel={frenzy ? `Time remaining ${clock}` : `Elapsed time ${clock}`}>{clock}</Text>}
        />
    );
}
