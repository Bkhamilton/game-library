import React from 'react';
import { Text } from '@/components/Themed';
import GameHeader from '../GameHeader/GameHeader';
import ElapsedClock from '@/components/Session/ElapsedClock';

interface ConnectFourHeaderProps {
    score: number;
    elapsedMs: number;
}

export default function ConnectFourHeader({ score, elapsedMs }: ConnectFourHeaderProps) {
    return (
        <GameHeader
            rightContent={<Text style={{ fontSize: 16 }}>Moves: {score}</Text>}
            centerContent={<ElapsedClock elapsedMs={elapsedMs} />}
        />
    );
}
