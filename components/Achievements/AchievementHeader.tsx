import React from 'react';
import { StyleSheet } from 'react-native';
import { Text, View, TouchableOpacity } from '@/components/Themed';
import { FontAwesome5 } from '@expo/vector-icons';

interface AchievementHeaderProps {
    onBack: () => void;
    textColor: string;
}

/**
 * Header component for the achievement screen
 */
export default function AchievementHeader({ onBack, textColor }: AchievementHeaderProps) {
    return (
        <View style={styles.header}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <TouchableOpacity
                    onPress={onBack}
                    style={{ padding: 8 }}
                >
                    <FontAwesome5 name="chevron-left" size={24} color={textColor} />
                </TouchableOpacity>
                <Text style={{ fontSize: 22, fontWeight: '500', marginLeft: 14 }}>All Achievements</Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        paddingTop: 50,
        paddingHorizontal: 20,
        paddingBottom: 12,
    },
});
