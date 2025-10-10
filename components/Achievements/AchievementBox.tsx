import React from 'react';
import { View, Text } from '@/components/Themed';
import ProgressBar from '@/components/Helpers/ProgressBar';
import { StyleSheet } from 'react-native';

export interface AchievementBoxProps {
    icon: React.ReactNode;
    title: string;
    description: string;
    tier: string;
    points: number;
    segment: number;
    total: number;
    unlocked: boolean;
    gameTitle?: string;
}

const getTierColor = (tier: string) => {
    switch (tier) {
        case 'Bronze': return '#CD7F32';
        case 'Silver': return '#C0C0C0';
        case 'Gold': return '#FFD700';
        case 'Platinum': return '#E5E4E2';
        case 'Diamond': return '#B9F2FF';
        default: return '#CD7F32';
    }
};

const AchievementBox: React.FC<AchievementBoxProps> = React.memo(({ icon, title, description, tier, points, segment, total, unlocked, gameTitle }) => {
    return (
        <View style={[styles.achievementBox, unlocked && styles.achievementBoxUnlocked]}>
            <View style={styles.achievementIcon}>
                {icon}
            </View>
            <View style={{ flex: 1 }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Text style={styles.achievementTitle}>{title}</Text>
                    <Text style={[styles.tierBadge, { backgroundColor: getTierColor(tier) }]}>{tier}</Text>
                </View>
                {gameTitle && (
                    <Text style={styles.gameTitle}>🎮 {gameTitle}</Text>
                )}
                <Text style={styles.achievementDescription}>{description}</Text>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingRight: 24, marginTop: 4 }}>
                    <ProgressBar segment={segment} total={total} />
                    <Text style={{ paddingLeft: 12, fontSize: 12 }}>{segment}/{total}</Text>
                </View>
                <Text style={styles.pointsText}>{points} points</Text>
            </View>
        </View>
    );
});

AchievementBox.displayName = 'AchievementBox';

const styles = StyleSheet.create({
    achievementBox: {
        flexDirection: 'row',
        padding: 16,
        borderWidth: 1,
        borderRadius: 8,
        marginHorizontal: 12,
        marginVertical: 8,
        opacity: 0.6,
    },
    achievementBoxUnlocked: {
        opacity: 1,
        borderColor: '#4CAF50',
        borderWidth: 2,
    },
    achievementIcon: {
        marginRight: 16,
    },
    achievementTitle: {
        fontSize: 16,
        fontWeight: '500',
        flex: 1,
        marginRight: 8,
    },
    gameTitle: {
        fontSize: 13,
        opacity: 0.8,
        marginTop: 2,
        fontWeight: '500',
    },
    achievementDescription: {
        fontSize: 14,
        opacity: 0.7,
        marginTop: 2,
    },
    tierBadge: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 4,
        fontSize: 12,
        fontWeight: '600',
        color: '#000',
    },
    pointsText: {
        fontSize: 12,
        marginTop: 4,
        opacity: 0.6,
        fontWeight: '500',
    },
});

export default AchievementBox;
