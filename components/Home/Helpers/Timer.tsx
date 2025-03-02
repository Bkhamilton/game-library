import React, { useEffect, useState } from 'react';
import { Text, View } from '@/components/Themed';

interface TimerProps {
    isActive: boolean;
    reset: boolean;
}

const Timer: React.FC<TimerProps> = ({ isActive, reset }) => {
    const [seconds, setSeconds] = useState(0);

    useEffect(() => {
        let interval: NodeJS.Timeout | null = null;
        if (isActive) {
            interval = setInterval(() => {
                setSeconds((prevSeconds) => prevSeconds + 1);
            }, 1000);
        } else if (!isActive && seconds !== 0) {
            clearInterval(interval!);
        }
        return () => clearInterval(interval!);
    }, [isActive, seconds]);

    useEffect(() => {
        if (reset) {
            setSeconds(0);
        }
    }, [reset]);

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