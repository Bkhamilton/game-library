import React, { useContext } from 'react';
import { StyleSheet, ScrollView } from 'react-native';
import { Text, View } from '@/components/Themed';
import ProfileHeader from './ProfileHeader';
import ProfileStats from './ProfileStats';
import ProfileBadges from './ProfileBadges';
import ProfileAchievements from './ProfileAchievements';
import { UserContext } from '@/contexts/UserContext';

export default function ProfileScreen() {

    const { user } = useContext(UserContext);

    return (
        <View style={styles.container}>
            <ProfileHeader />
            <ScrollView>
                <View style={{ alignItems: 'center', paddingVertical: 20 }}>
                    <View style={styles.profileIcon}/>
                    <Text style={styles.profileName}>{ user ? user.name : '' }</Text>
                    <Text>{ user ? user.username : '' }</Text>
                </View>
                <ProfileStats />
                <ProfileBadges />
                <ProfileAchievements />
                <View style={{ height: 100 }} />
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
});