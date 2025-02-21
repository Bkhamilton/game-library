import React from 'react';
import { StyleSheet, ScrollView } from 'react-native';
import { Text, View } from '@/components/Themed';
import { FontAwesome5, FontAwesome6 } from '@expo/vector-icons';
import ProfileHeader from './ProfileHeader';
import useTheme from '@/hooks/useTheme';
import ProfileStats from './ProfileStats';
import ProfileBadges from './ProfileBadges';

export default function ProfilePage() {

    const { text, primary, grayBorder } = useTheme();

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
        <View style={styles.container}>
            <ProfileHeader />
            <ScrollView>
                <View style={{ alignItems: 'center', paddingVertical: 20 }}>
                    <View style={styles.profileIcon}/>
                    <Text style={styles.profileName}>John Doe</Text>
                    <Text>LEVEL 10</Text>
                </View>
                <ProfileStats />
                <ProfileBadges />
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
    },
    profileIcon: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: 'gray',
        marginBottom: 20,
    },
    profileName: {
        fontSize: 24,
        fontWeight: '500',
        marginBottom: 8,
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