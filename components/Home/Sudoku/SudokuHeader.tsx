import React from 'react';
import { Text } from '@/components/Themed';
import GameHeader from '../GameHeader/GameHeader';
import CountdownTimer from '@/components/Helpers/CountdownTimer';

interface SudokuHeaderProps {
    wrongCount: number;
    onTimeUpdate?: (seconds: number) => void;
    mode?: string;
    difficulty?: string;
    timerReset?: boolean;
    onTimeExpired?: () => void;
}

// Helper function to get initial timer seconds based on difficulty
const getInitialSeconds = (difficulty: string): number => {
    switch (difficulty) {
        case 'Easy':
            return 15;
        case 'Medium':
            return 20;
        case 'Hard':
            return 25;
        case 'Expert':
            return 30;
        default:
            return 15;
    }
};

export default function SudokuHeader({ 
    wrongCount, 
    onTimeUpdate, 
    mode = 'Classic',
    difficulty = 'Easy',
    timerReset = false,
    onTimeExpired
}: SudokuHeaderProps) {
    const isFrenzyMode = mode === 'Frenzy';
    const isDailyChallenge = mode === 'Daily Challenge';
    
    return (
        <GameHeader
            leftContent={
                isFrenzyMode ? <Text style={{ fontSize: 16 }}>Frenzy</Text> : 
                isDailyChallenge ? <Text style={{ fontSize: 16 }}>Daily Challenge</Text> :
                undefined
            }
            rightContent={!isFrenzyMode ? <Text style={{ fontSize: 16 }}>{wrongCount}/4</Text> : undefined}
            centerContent={isFrenzyMode ? (
                <CountdownTimer
                    isActive={true}
                    resetTrigger={timerReset}
                    initialSeconds={getInitialSeconds(difficulty)}
                    onTimeUpdate={onTimeUpdate}
                    onTimeExpired={onTimeExpired}
                />
            ) : undefined}
            onTimeUpdate={!isFrenzyMode ? onTimeUpdate : undefined}
        />
    );
}