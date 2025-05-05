import React, { useEffect, useState } from 'react';
import { Text, View } from '@/components/Themed';

interface TimerProps {
    isActive: boolean;
    reset: boolean;
    onTimeUpdate?: (seconds: number) => void;
}

const Timer: React.FC<TimerProps> = ({ isActive, reset, onTimeUpdate }) => {
    const [seconds, setSeconds] = useState(0);

    useEffect(() => {
        if (reset) {
            setSeconds(0);
        }
    }, [reset]);

    useEffect(() => {
        let interval: NodeJS.Timeout | number | null = null;
        if (isActive) {
            interval = setInterval(() => {
                setSeconds(prevSeconds => prevSeconds + 1);
            }, 1000);
        }
        return () => {
            if (interval) clearInterval(interval);
        };
    }, [isActive]);

    useEffect(() => {
        // Notify parent of time changes in a separate effect
        if (onTimeUpdate) {
            onTimeUpdate(seconds);
        }
    }, [seconds, onTimeUpdate]);

    const formatTime = (seconds: number) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
    };

    return (
        <View>
            <Text>Time: {formatTime(seconds)}</Text>
        </View>
    );
};

export default Timer;