import React, { useEffect, useState, useRef } from 'react';
import { Text, View } from '@/components/Themed';
import { formatTime } from '@/utils/helpers';

interface CountdownTimerProps {
    isActive: boolean;
    resetTrigger: boolean;
    initialSeconds: number;
    onTimeUpdate?: (seconds: number) => void;
    onTimeExpired?: () => void;
}

const CountdownTimer: React.FC<CountdownTimerProps> = ({ 
    isActive, 
    resetTrigger, 
    initialSeconds,
    onTimeUpdate,
    onTimeExpired 
}) => {
    const [seconds, setSeconds] = useState(initialSeconds);
    const prevResetTrigger = useRef(resetTrigger);

    useEffect(() => {
        // Reset when resetTrigger changes
        if (resetTrigger !== prevResetTrigger.current) {
            setSeconds(initialSeconds);
            prevResetTrigger.current = resetTrigger;
        }
    }, [resetTrigger, initialSeconds]);

    useEffect(() => {
        let interval: ReturnType<typeof setInterval> | null = null;
        if (isActive && seconds > 0) {
            interval = setInterval(() => {
                setSeconds(prevSeconds => {
                    if (prevSeconds <= 1) {
                        // Timer expired
                        if (onTimeExpired) {
                            onTimeExpired();
                        }
                        return 0;
                    }
                    return prevSeconds - 1;
                });
            }, 1000);
        }
        return () => {
            if (interval) clearInterval(interval);
        };
    }, [isActive, seconds, onTimeExpired]);

    useEffect(() => {
        // Notify parent of time changes in a separate effect
        if (onTimeUpdate) {
            onTimeUpdate(seconds);
        }
    }, [seconds, onTimeUpdate]);

    return (
        <View>
            <Text style={{ color: seconds <= 5 ? '#ff0000' : undefined }}>
                Time: {formatTime(seconds)}
            </Text>
        </View>
    );
};

export default CountdownTimer;
