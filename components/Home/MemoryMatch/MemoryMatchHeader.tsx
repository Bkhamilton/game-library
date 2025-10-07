import React from 'react';
import { Text } from '@/components/Themed';
import GameHeader from '../GameHeader/GameHeader';

interface MemoryMatchHeaderProps {
    incorrectGuesses: number;
    maxIncorrectGuesses: number;
    matches: number;
    totalPairs: number;
    onTimeUpdate?: (seconds: number) => void;
}

export default function MemoryMatchHeader({ 
    incorrectGuesses, 
    maxIncorrectGuesses,
    matches,
    totalPairs,
    onTimeUpdate 
}: MemoryMatchHeaderProps) {
    return (
        <GameHeader
            leftContent={<Text style={{ fontSize: 16 }}>{matches}/{totalPairs}</Text>}
            rightContent={<Text style={{ fontSize: 16 }}>{incorrectGuesses}/{maxIncorrectGuesses}</Text>}
            onTimeUpdate={onTimeUpdate}
        />
    );
}
