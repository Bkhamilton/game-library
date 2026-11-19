import React from 'react';
import { Text } from '@/components/Themed';
import GameHeader from '../GameHeader/GameHeader';
import ElapsedClock from '@/components/Session/ElapsedClock';

interface MemoryMatchHeaderProps {
    incorrectGuesses: number;
    maxIncorrectGuesses: number;
    matches: number;
    totalPairs: number;
    elapsedMs: number;
}

export default function MemoryMatchHeader({ 
    incorrectGuesses, 
    maxIncorrectGuesses,
    matches,
    totalPairs,
    elapsedMs
}: MemoryMatchHeaderProps) {
    return (
        <GameHeader
            leftContent={<Text style={{ fontSize: 16 }}>{matches}/{totalPairs}</Text>}
            rightContent={<Text style={{ fontSize: 16 }}>{incorrectGuesses}/{maxIncorrectGuesses}</Text>}
            centerContent={<ElapsedClock elapsedMs={elapsedMs} />}
        />
    );
}
