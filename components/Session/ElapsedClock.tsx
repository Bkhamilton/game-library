import React from 'react';
import { Text } from '@/components/Themed';

export default function ElapsedClock({ elapsedMs }: { elapsedMs: number }) {
    const seconds = Math.floor(elapsedMs / 1000);
    const clock = `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, '0')}`;
    return <Text accessibilityLabel={`Elapsed time ${clock}`}>{clock}</Text>;
}
