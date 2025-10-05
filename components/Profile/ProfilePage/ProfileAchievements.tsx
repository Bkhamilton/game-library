import React, { useState, useEffect, useContext } from 'react';
import { StyleSheet } from 'react-native';
import { TouchableOpacity, Text, View } from '@/components/Themed';
import { FontAwesome5, FontAwesome6 } from '@expo/vector-icons';
import { DBContext } from '@/contexts/DBContext';
import ProgressBar from '@/components/Helpers/ProgressBar';
import { getUserAchievements, getUserTotalPoints } from '@/db/Achievements/Achievements';

interface AchievementBoxProps {
    icon: React.ReactNode;
    title: string;
    description: string;
    tier: string;
    points: number;
    segment: number;
    total: number;
    unlocked: boolean;
}

export default function ProfileAchievements() {

    const { db } = useContext(DBContext);
    const [achievements, setAchievements] = useState<any[]>([]);
    const [totalPoints, setTotalPoints] = useState(0);

    useEffect(() => {
        const loadAchievements = async () => {
            if (db) {
                try {
                    const userAchievements = await getUserAchievements(db, 1); // userId = 1
                    setAchievements(userAchievements);
                    
                    const points = await getUserTotalPoints(db, 1);
                    setTotalPoints(points);
                } catch (error) {
                    console.error('Error loading achievements:', error);
                }
            }
        };
        
        loadAchievements();
    }, [db]);

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

    const AchievementBox = ({ icon, title, description, tier, points, segment, total, unlocked } : AchievementBoxProps) => {
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
                    <Text style={styles.achievementDescription}>{description}</Text>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingRight: 24, marginTop: 4 }}>
                        <ProgressBar segment={segment} total={total} />
                        <Text style={{ paddingLeft: 12 }}>{segment}/{total}</Text>
                    </View>
                    <Text style={styles.pointsText}>{points} points</Text>
                </View>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <View style={{ padding: 16 }}>
                <Text style={{ fontSize: 22 }}>Achievements</Text>
                <Text style={{ fontSize: 16, marginTop: 8, opacity: 0.7 }}>
                    Total Points: {totalPoints}
                </Text>
                <Text style={{ fontSize: 14, marginTop: 4, opacity: 0.6 }}>
                    {achievements.filter(a => a.unlocked).length} / {achievements.length} unlocked
                </Text>
            </View>
            {achievements.map((achievement, index) => {
                const iconName = achievement.icon || 'trophy';
                const iconColor = achievement.unlocked ? getTierColor(achievement.tier) : '#666';
                
                return (
                    <AchievementBox
                        key={index}
                        icon={<FontAwesome5 name={iconName} size={36} color={iconColor} />}
                        title={achievement.title}
                        description={achievement.description}
                        tier={achievement.tier}
                        points={achievement.points}
                        segment={achievement.progress || 0}
                        total={achievement.criteria.threshold}
                        unlocked={achievement.unlocked}
                    />
                )
            })}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
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