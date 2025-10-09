import React from 'react';
import { Text } from '@/components/Themed';
import GameHeader from '../GameHeader/GameHeader';

interface SimonSaysHeaderProps {
    round: number;
    onTimeUpdate?: (seconds: number) => void;
    timerActive?: boolean;
}

export default function SimonSaysHeader({ round, onTimeUpdate, timerActive = false }: SimonSaysHeaderProps) {
    return (
        <GameHeader
            rightContent={<Text style={{ fontSize: 16 }}>Round: {round}</Text>}
            onTimeUpdate={onTimeUpdate}
            timerActive={timerActive}
        />
    );
}
