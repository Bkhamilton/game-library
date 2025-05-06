import React from 'react';
import { Text } from '@/components/Themed';
import GameHeader from '../GameHeader/GameHeader';

interface CrosswordHeaderProps {
    wrongCount: number;
    wordsFound: number;
    totalWords: number;
    onTimeUpdate?: (seconds: number) => void;
}

export default function CrosswordHeader({ wrongCount, wordsFound, totalWords, onTimeUpdate }: CrosswordHeaderProps) {
    return (
        <GameHeader
            leftContent={<Text style={{ fontSize: 16 }}>{wrongCount}/4</Text>}
            rightContent={<Text style={{ fontSize: 16 }}>{wordsFound}/{totalWords}</Text>}
            onTimeUpdate={onTimeUpdate}
        />
    );
}
