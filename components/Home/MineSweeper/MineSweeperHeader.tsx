import React from 'react';
import { Text } from '@/components/Themed';
import GameHeader from '../GameHeader/GameHeader';

export default function MineSweeperHeader({ minesCount, elapsedMs }: { minesCount: number; elapsedMs: number }) {
    const seconds = Math.floor(elapsedMs / 1000);
    const clock = `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, '0')}`;
    return <GameHeader rightContent={<Text style={{ fontSize: 16 }}>{minesCount}</Text>}
        centerContent={<Text accessibilityLabel={`Elapsed time ${clock}`}>{clock}</Text>} />;
}
