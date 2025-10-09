import React from 'react';
import { Text } from '@/components/Themed';
import GameHeader from '../GameHeader/GameHeader';

interface ConnectFourHeaderProps {
    score: number;
    onTimeUpdate?: (seconds: number) => void;
    timerActive?: boolean;
}

export default function ConnectFourHeader({ score, onTimeUpdate, timerActive = true }: ConnectFourHeaderProps) {
    return (
        <GameHeader
            rightContent={<Text style={{ fontSize: 16 }}>Moves: {score}</Text>}
            onTimeUpdate={onTimeUpdate}
            timerActive={timerActive}
        />
    );
}
