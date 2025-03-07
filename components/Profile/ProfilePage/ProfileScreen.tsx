import React, { useContext } from 'react';
import { StyleSheet, ScrollView } from 'react-native';
import { Text, View } from '@/components/Themed';
import ProfileHeader from './ProfileHeader';
import ProfileStats from './ProfileStats';
import ProfileBadges from './ProfileBadges';
import ProfileAchievements from './ProfileAchievements';
import { UserContext } from '@/contexts/UserContext';
import { FontAwesome6 } from '@expo/vector-icons';
import useTheme from '@/hooks/useTheme';

export default function ProfileScreen() {

    const { user } = useContext(UserContext);

    const { text, background, primary } = useTheme();

    return (
        <View style={styles.container}>
            <ProfileHeader />
            <ScrollView>
                <View style={{ alignItems: 'center', paddingVertical: 20 }}>
                    <View style={[styles.profileIcon, { backgroundColor: background, borderColor: text }]}>
                        <View style={{ marginBottom: -2}}>
                            <FontAwesome6 name="user-large" size={80} color={text} />
                        </View>
                    </View>
                    <Text style={styles.profileName}>{ user ? user.name : '' }</Text>
                    <Text>{ user ? user.username : '' }</Text>
                </View>
                <ProfileStats />
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
        borderWidth: 2,
        backgroundColor: 'gray',
        marginBottom: 20,
        justifyContent: 'flex-end', 
        alignItems: 'center', 
        overflow: 'hidden'
    },
    profileName: {
        fontSize: 24,
        fontWeight: '500',
        marginBottom: 8,
    },
});