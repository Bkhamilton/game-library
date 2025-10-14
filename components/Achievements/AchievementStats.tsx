import React from 'react';
import { Text, View } from '@/components/Themed';

interface AchievementStatsProps {
    totalPoints: number;
    unlockedCount: number;
    totalCount: number;
}

/**
 * Stats section component showing achievement progress
 */
export default function AchievementStats({ 
    totalPoints, 
    unlockedCount, 
    totalCount 
}: AchievementStatsProps) {
    return (
        <View style={{ padding: 16, paddingBottom: 8 }}>
            <Text style={{ fontSize: 18, fontWeight: '600', opacity: 0.8 }}>
                Total Points: {totalPoints}
            </Text>
            <Text style={{ fontSize: 16, marginTop: 4, opacity: 0.7 }}>
                {unlockedCount} / {totalCount} unlocked
            </Text>
        </View>
    );
}
