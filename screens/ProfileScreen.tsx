import React, { useContext, useState, useRef } from 'react';
import { StyleSheet, ScrollView, RefreshControl } from 'react-native';
import { Text, View } from '@/components/Themed';
import ProfileHeader from '@/components/Profile/ProfilePage/ProfileHeader';
import ProfileStats from '@/components/Profile/ProfilePage//ProfileStats';
import ProfileBadges from '@/components/Profile/ProfilePage//ProfileBadges';
import ProfileAchievements from '@/components/Profile/ProfilePage//ProfileAchievements';
import { UserContext } from '@/contexts/UserContext';
import { FontAwesome6 } from '@expo/vector-icons';
import useTheme from '@/hooks/useTheme';
import { FadeInView } from '@/components/animations';

export default function ProfileScreen() {

    const { user } = useContext(UserContext);
    const { text, background, primary } = useTheme();
    const [refreshing, setRefreshing] = useState(false);
    const loadAchievementsRef = useRef<(() => Promise<void>) | null>(null);

    const onRefresh = async () => {
        setRefreshing(true);
        if (loadAchievementsRef.current) {
            await loadAchievementsRef.current();
        }
        setRefreshing(false);
    };

    const handleLoadAchievements = (loadFn: () => Promise<void>) => {
        loadAchievementsRef.current = loadFn;
    };

    return (
        <FadeInView duration={400}>
            <View style={styles.container}>
                <ProfileHeader />
                <ScrollView
                    refreshControl={
                        <RefreshControl
                            refreshing={refreshing}
                            onRefresh={onRefresh}
                            tintColor={primary}
                            colors={[primary]}
                        />
                    }
                >
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
                    <ProfileAchievements onLoadAchievements={handleLoadAchievements} />
                    <View style={{ height: 100 }} />
                </ScrollView>
            </View>
        </FadeInView>
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