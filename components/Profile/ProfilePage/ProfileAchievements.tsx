import React from 'react';
import { StyleSheet } from 'react-native';
import { TouchableOpacity, Text, View } from '@/components/Themed';
import { FontAwesome5, FontAwesome6 } from '@expo/vector-icons';
import useTheme from '@/hooks/useTheme';
import ProgressBar from '@/components/Helpers/ProgressBar';
import achievements from '@/data/achievements.json';

interface AchievementBoxProps {
    icon: JSX.Element;
    title: string;
    description: string;
    segment: number;
}

export default function ProfileAchievements() {

    const AchievementBox = ({ icon, title, description, segment } : AchievementBoxProps) => {
        return (
            <View style={styles.achievementBox}>
                <View style={styles.achievementIcon}>
                    {icon}
                </View>
                <View style={{ flex: 1 }}>
                    <Text style={styles.achievementTitle}>{title}</Text>
                    <Text style={styles.achievementDescription}>{description}</Text>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingRight: 24, }}>
                        <ProgressBar segment={0} total={segment} />
                        <Text style={{ paddingLeft: 12 }}>0/{segment}</Text>
                    </View>
                </View>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <View style={{ padding: 16 }}>
                <Text style={{ fontSize: 22 }}>Achievements</Text>
            </View>
            {achievements.map((achievement, index) => (
                <AchievementBox
                    key={index}
                    icon={<FontAwesome5 name="trophy" size={36} color="gold" />}
                    title={achievement.title}
                    description={achievement.description}
                    segment={achievement.criteria.threshold}
                />
            ))}
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
        opacity: 0.4,
    },
});