import React from 'react';
import { Text } from '@/components/Themed';
import GameHeader from '../GameHeader/GameHeader';

interface SudokuHeaderProps {
    wrongCount: number;
    onTimeUpdate?: (seconds: number) => void;
}

export default function SudokuHeader({ wrongCount, onTimeUpdate }: SudokuHeaderProps) {
    return (
        <GameHeader
            rightContent={<Text style={{ fontSize: 16 }}>{wrongCount}/4</Text>}
            onTimeUpdate={onTimeUpdate}
        />
    );
}