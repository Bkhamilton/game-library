import React from 'react';
import { Text } from '@/components/Themed';
import GameHeader from '../GameHeader/GameHeader';

interface WordSearchHeaderProps {
    wordCount: number;
    foundWords: number;
    onTimeUpdate?: (seconds: number) => void;
}

export default function WordSearchHeader({ wordCount, foundWords, onTimeUpdate }: WordSearchHeaderProps) {
    return (
        <GameHeader
            rightContent={<Text style={{ fontSize: 16 }}>{foundWords}/{wordCount}</Text>}
            onTimeUpdate={onTimeUpdate}
        />
    );
}