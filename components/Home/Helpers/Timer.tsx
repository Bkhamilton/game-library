import React, { useEffect, useState } from 'react';
import { Text, View } from '@/components/Themed';
import { formatTime } from '@/utils/helpers';

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

    return (
        <View>
            <Text>Time: {formatTime(seconds)}</Text>
        </View>
    );
};

export default Timer;