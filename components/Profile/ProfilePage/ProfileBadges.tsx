import React from 'react';
import { StyleSheet, ScrollView } from 'react-native';
import { TouchableOpacity, Text, View } from '@/components/Themed';
import useTheme from '@/hooks/useTheme';

export default function ProfileBadges() {

    const { primary } = useTheme();

    return (
        <View style={styles.container}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16 }}>
                <Text style={{ fontSize: 22 }}>Badges</Text>
                <TouchableOpacity>
                    <Text style={{ fontSize: 18, color: primary }}>View all</Text>
                </TouchableOpacity>
            </View>
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={{ paddingHorizontal: 16 }}
            >
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((badge, index) => (
                    <View key={index} style={{ padding: 10 }}>
                        <View style={styles.badge} />
                    </View>
                ))}
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        paddingVertical: 14,
    },
    badge: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: 'gray',
        marginRight: 10,
    },
});