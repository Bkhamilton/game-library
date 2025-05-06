import React, { useState, useEffect } from 'react';
import { Text } from '@/components/Themed';
import GameHeader from '../GameHeader/GameHeader';

interface MineSweeperHeaderProps {
    minesCount: number;
    gameState: string;
    trigger: boolean;
    onTimeUpdate?: (seconds: number) => void;
}

export default function MineSweeperHeader({ minesCount, gameState, trigger, onTimeUpdate }: MineSweeperHeaderProps) {
    const [isActive, setIsActive] = useState(true);

    useEffect(() => {
        if (gameState === 'lost' || gameState === 'won') {
            setIsActive(false);
        }
    }, [gameState]);

    return (
        <GameHeader
            rightContent={<Text style={{ fontSize: 16 }}>{minesCount}</Text>}
            timerActive={isActive}
            timerReset={trigger}
            onTimeUpdate={onTimeUpdate}
        />
    );
}