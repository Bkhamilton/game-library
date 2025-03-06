import React from 'react';
import { StyleSheet } from 'react-native';
import { TouchableOpacity, Text, View, ClearView } from '@/components/Themed';
import { FontAwesome5, FontAwesome6, MaterialCommunityIcons } from '@expo/vector-icons';
import useTheme from '@/hooks/useTheme';

interface StatBoxProps {
    icon: JSX.Element;
    title: string;
    stat: string;
}

export default function ProfileStats() {

    const { primary, grayBorder, grayBackground } = useTheme();

    const StatBox = ({ icon, title, stat } : StatBoxProps) => {
        return (
            <View style={[styles.statBox, { borderColor: grayBorder, backgroundColor: grayBackground }]}>
                <ClearView style={{ height: '100%', justifyContent: 'flex-start', marginRight: 10 }}>
                    {icon}
                </ClearView>
                <ClearView>
                    <Text style={styles.statBoxTitle}>{title}</Text>
                    <Text style={styles.statBoxStat}>{stat}</Text>
                </ClearView>
            </View>
        );
    }

    return (
        <View style={{ flexDirection: 'row', justifyContent: 'space-around', width: '100%', paddingVertical: 14 }}>
            <StatBox icon={<FontAwesome5 name="trophy" size={24} color={'gold'} />} title="Wins" stat="1000" />
            <StatBox icon={<MaterialCommunityIcons name="clock-fast" size={24} color={primary} />} title="Fastest Time" stat="1:14" />
            <StatBox icon={<FontAwesome5 name="fire-alt" size={24} color={'red'} />} title="Streak" stat="50" />
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