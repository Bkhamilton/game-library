import React from 'react';
import { StyleSheet, ScrollView } from 'react-native';
import { Text, View, TouchableOpacity } from '@/components/Themed';
import { FontAwesome5 } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import useTheme from '@/hooks/useTheme';
import AccountInfo from './AccountInfo';
import SettingsOptions from './SettingsOption';

export default function SettingsScreen() {

    const { text } = useTheme();

    const router = useRouter();

    const handleSelect = (option: string) => {
        console.log(option);
    }

    return (
        <View style={styles.container}>
            <View style={styles.headerContainer}>
                <TouchableOpacity
                    onPress={() => router.back()}
                >
                    <FontAwesome5 name="chevron-left" size={24} color={text} />
                </TouchableOpacity>        
            </View>
            <ScrollView>
                <View style={styles.settingsHeader}>
                    <Text style={styles.settingsHeaderText}>Settings</Text>
                </View>
                <View>
                    <View style={styles.accountHeader}>
                        <Text style={styles.accountHeaderText}>Account</Text>
                    </View>
                    <AccountInfo/>
                    <SettingsOptions onSelect={handleSelect} />
                </View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    headerContainer: {
        height: 84, 
        paddingHorizontal: 20, 
        paddingTop: 48,
        alignItems: 'flex-start',
        justifyContent: 'center',
    },
    settingsHeader: {
        paddingHorizontal: 20, 
        paddingTop: 48, 
        paddingBottom: 40
    },
    settingsHeaderText: {
        fontSize: 38, 
        fontWeight: 'bold'
    },
    accountHeader: {
        paddingHorizontal: 20, 
        paddingVertical: 12
    },
    accountHeaderText: {
        fontSize: 24, 
        fontWeight: '500'
    },
});