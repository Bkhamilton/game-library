import React, { useEffect, useState } from 'react';
import { Text, View } from '@/components/Themed';

const Timer = ({ isActive }) => {
    const [seconds, setSeconds] = useState(0);

    useEffect(() => {
        let interval = null;
        if (isActive) {
            interval = setInterval(() => {
                setSeconds((prevSeconds) => prevSeconds + 1);
            }, 1000);
        } else if (!isActive && seconds !== 0) {
            clearInterval(interval);
        }
        return () => clearInterval(interval);
    }, [isActive, seconds]);

    return (
        <View>
            <Text>Time: {seconds}s</Text>
        </View>
    );
};

export default Timer;