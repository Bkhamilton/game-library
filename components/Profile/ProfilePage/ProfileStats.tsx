import React, { useState, useEffect, useContext } from 'react';
import { StyleSheet } from 'react-native';
import { DBContext } from '@/contexts/DBContext';
import { Text, View, ClearView } from '@/components/Themed';
import { FontAwesome5, FontAwesome6, MaterialCommunityIcons } from '@expo/vector-icons';
import useTheme from '@/hooks/useTheme';
import { getStatByTitle } from '@/db/Scores/Results'

interface StatBoxProps {
    icon: React.ReactNode;
    title: string;
}

export default function ProfileStats() {

    const { primary, grayBorder, grayBackground, secondary } = useTheme();

    const stats = [
        'Wins',
        'Fastest Time',
        'High Score',
    ]

    const { db } = useContext(DBContext);

    const getStats = async (title: string) => {
        const stat = await getStatByTitle(db, title);
        return stat;
    }

    const getIcon = (title: string) => {
        switch (title) {
            case 'Wins':
                return <FontAwesome5 name="trophy" size={24} color={'gold'} />;
            case 'Fastest Time':
                return <MaterialCommunityIcons name="clock-fast" size={24} color={secondary} />;
            case 'Streak':
                return <FontAwesome5 name="fire-alt" size={24} color={'red'} />;
            case 'High Score':
                return <FontAwesome5 name="star" size={24} color={'yellow'} />;
            default:
                return <FontAwesome6 name="question" size={24} color={primary} />;
        }
    }

    const StatBox = ({ icon, title } : StatBoxProps) => {

        const [stats, setStats] = useState<string>('0');

        useEffect(() => {
            getStats(title).then((stat) => setStats(stat));
        }, [title]);
        
        return (
            <View style={[styles.statBox, { borderColor: grayBorder, backgroundColor: grayBackground }]}>
                <ClearView style={{ height: '100%', justifyContent: 'flex-start', marginRight: 10 }}>
                    {icon}
                </ClearView>
                <ClearView>
                    <Text style={styles.statBoxTitle}>{title}</Text>
                    <Text style={styles.statBoxStat}>{stats ? stats : '0'}</Text>
                </ClearView>
            </View>
        );
    }

    return (
        <View style={{ flexDirection: 'row', justifyContent: 'space-around', width: '100%', paddingVertical: 14 }}>
            {stats.map((stat, index) => (
                <StatBox key={index} icon={getIcon(stat)} title={stat} />
            ))}
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