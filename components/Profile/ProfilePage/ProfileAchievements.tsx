import React from 'react';
import { StyleSheet } from 'react-native';
import { TouchableOpacity, Text, View } from '@/components/Themed';
import { FontAwesome5, FontAwesome6 } from '@expo/vector-icons';
import useTheme from '@/hooks/useTheme';
import ProgressBar from '@/components/Helpers/ProgressBar';

interface AchievementBoxProps {
    icon: JSX.Element;
    title: string;
    description: string;
}

export default function ProfileAchievements() {

    const AchievementBox = ({ icon, title, description } : AchievementBoxProps) => {
        return (
            <View style={styles.achievementBox}>
                <View style={styles.achievementIcon}>
                    {icon}
                </View>
                <View style={{ flex: 1 }}>
                    <Text style={styles.achievementTitle}>{title}</Text>
                    <Text style={styles.achievementDescription}>{description}</Text>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingRight: 24, }}>
                        <ProgressBar segment={1} total={3} />
                        <Text style={{ paddingLeft: 12 }}>1/3</Text>
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
            <AchievementBox
                icon={<FontAwesome5 name="trophy" size={40} color="gold" />}
                title="First Win"
                description="Win your first game"
            />
            <AchievementBox
                icon={<FontAwesome5 name="trophy" size={40} color="gold" />}
                title="First Win"
                description="Win your first game"
            />
            <AchievementBox
                icon={<FontAwesome5 name="trophy" size={40} color="gold" />}
                title="First Win"
                description="Win your first game"
            />
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