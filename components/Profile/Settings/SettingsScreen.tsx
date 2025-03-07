import React, { useState } from 'react';
import { StyleSheet, ScrollView, Modal, TouchableWithoutFeedback } from 'react-native';
import { Text, View, TouchableOpacity } from '@/components/Themed';
import { FontAwesome5 } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import useTheme from '@/hooks/useTheme';
import AccountInfo from './AccountInfo';
import SettingsOptions from './SettingsOption';
import AboutModal from '@/components/Modals/AboutModal';
import HelpModal from '@/components/Modals/HelpModal';

export default function SettingsScreen() {

    const { text } = useTheme();

    const router = useRouter();

    const [aboutModalVisible, setAboutModalVisible] = useState(false);
    const [helpModalVisible, setHelpModalVisible] = useState(false);

    const closeAboutModal = () => {
        setAboutModalVisible(false);
    }

    const closeHelpModal = () => {
        setHelpModalVisible(false);
    }

    const handleSelect = (option: string) => {
        switch (option) {
            case 'Clear User Data':
                alert('User data cleared!');
                break;
            case 'Help':
                setHelpModalVisible(true);
                break;
            case 'About':
                setAboutModalVisible(true);
                break;
            case 'Support Us':
                alert('Support us by giving a 5 star rating!');
                break
            default:
                break;
        }
    }

    return (
        <View style={styles.container}>
            <AboutModal
                visible={aboutModalVisible}
                close={closeAboutModal}
            />
            <HelpModal
                visible={helpModalVisible}
                close={closeHelpModal}
            />
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
    modalContainer: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    aboutBox: {
        padding: 16,
        borderRadius: 8,
    },
    aboutText: {
        fontSize: 16,
        marginBottom: 8,
    },
});