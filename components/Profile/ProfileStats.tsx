import React from 'react';
import { StyleSheet } from 'react-native';
import { TouchableOpacity, Text, View } from '@/components/Themed';
import { FontAwesome5 } from '@expo/vector-icons';
import useTheme from '@/hooks/useTheme';

export default function ProfileStats() {

    const { primary, grayBorder } = useTheme();

    const StatBox = ({ icon, title, stat }) => {
        return (
            <View style={[styles.statBox, { borderColor: grayBorder }]}>
                <View style={{ height: '100%', justifyContent: 'flex-start', marginRight: 10 }}>
                    {icon}
                </View>
                <View>
                    <Text style={styles.statBoxTitle}>{title}</Text>
                    <Text style={styles.statBoxStat}>{stat}</Text>
                </View>
            </View>
        );
    }

    return (
        <View style={{ flexDirection: 'row', justifyContent: 'space-around', width: '100%', paddingVertical: 14 }}>
            <StatBox icon={<FontAwesome5 name="coins" size={24} color={primary} />} title="Coins" stat="1000" />
            <StatBox icon={<FontAwesome5 name="trophy" size={24} color={primary} />} title="Trophies" stat="100" />
            <StatBox icon={<FontAwesome5 name="medal" size={24} color={primary} />} title="Wins" stat="50" />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    statBox: {
        borderWidth: 1,
        borderRadius: 8,
        paddingVertical: 16,
        paddingHorizontal: 10,
        flexDirection: 'row',
        alignItems: 'center',
    },
    statBoxTitle: {
        fontSize: 14,
        opacity: 0.4,
    },
    statBoxStat: {
        fontSize: 18,
        fontWeight: '500',
    },
});