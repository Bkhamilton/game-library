import React from 'react';
import { Text } from '@/components/Themed';
import GameHeader from '../GameHeader/GameHeader';

interface TwoZeroFourEightHeaderProps {
    highScore: number;
    onTimeUpdate?: (seconds: number) => void;
    timerActive?: boolean;
}

export default function TwoZeroFourEightHeader({ highScore, onTimeUpdate, timerActive = true }: TwoZeroFourEightHeaderProps) {
    return (
        <GameHeader
            rightContent={<Text style={{ fontSize: 16, fontWeight: 'bold' }}>Best: {highScore}</Text>}
            onTimeUpdate={onTimeUpdate}
            timerActive={timerActive}
        />
    );
}
