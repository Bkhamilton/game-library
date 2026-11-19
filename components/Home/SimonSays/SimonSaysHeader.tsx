import React from 'react';
import { Text } from '@/components/Themed';
import GameHeader from '../GameHeader/GameHeader';
import ElapsedClock from '@/components/Session/ElapsedClock';

interface SimonSaysHeaderProps {
    round: number;
    elapsedMs: number;
}

export default function SimonSaysHeader({ round, elapsedMs }: SimonSaysHeaderProps) {
    return (
        <GameHeader
            rightContent={<Text style={{ fontSize: 16 }}>Round: {round}</Text>}
            centerContent={<ElapsedClock elapsedMs={elapsedMs} />}
        />
    );
}
