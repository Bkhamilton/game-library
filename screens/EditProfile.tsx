import React, { useState, useContext } from 'react';
import { StyleSheet } from 'react-native';
import { UserContext } from '@/contexts/UserContext';
import { TouchableOpacity, Text, View, ScrollView, TextInput, ClearView } from '@/components/Themed';
import useTheme from '@/hooks/useTheme';
import { FontAwesome6 } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import EditProfileHeader from '@/components/Profile/EditProfile/EditProfileHeader';

export default function EditProfileInfo() {

    const { text, grayBackground, grayBorder, background } = useTheme();
    
    const { user, updateUserInfo } = useContext(UserContext);

    const router = useRouter();

    const [name, setName] = useState(user ? user.name : '');
    const [username, setUsername] = useState(user ? user.username : '');

    const handleSaveChanges = () => {
        if ((name === '' || name === user?.name) && (username === '' || username === user?.username)) {
            return;
        }
        
        const updatedUser = { ...user, name, username };
        updateUserInfo(updatedUser);

        alert('Changes saved!');

        router.back();
    };

    return (
        <View style={styles.container}>
            <EditProfileHeader />
            <ScrollView style={{ flex: 1, paddingHorizontal: 12 }}>
                {/* Image Change */}
                <View style={{ alignItems: 'center', paddingVertical: 12 }}>
                    <View style={{ marginTop: 20, height: 100, width: 100, borderRadius: 50, borderWidth: 1, justifyContent: 'flex-end', alignItems: 'center', overflow: 'hidden' }}>
                        <FontAwesome6 name="user-large" size={80} color={text} />
                    </View>
                </View>
                <View style={[styles.editOptionsContainer, { backgroundColor: grayBackground }]}>
                    {/* Name */}
                    <ClearView style={{ padding: 8 }}>
                        <Text>Name</Text>
                        <TextInput
                            style={[styles.editComponentInput, { borderColor: background, backgroundColor: grayBorder }]}
                            placeholder={'Enter your name'}
                            autoCorrect={false}
                            value={name}
                            onChangeText={setName}
                        />
                    </ClearView>
                    {/* Username */}
                    <ClearView style={{ padding: 8 }}>
                        <Text>Username</Text>
                        <TextInput
                            style={[styles.editComponentInput, { borderColor: background, backgroundColor: grayBorder }]}
                            placeholder={'Enter your username'}
                            autoCorrect={false}
                            value={username}
                            onChangeText={setUsername}
                        />
                    </ClearView>                                
                </View>
            </ScrollView>
            <View style={{ paddingVertical: 16, paddingHorizontal: 8 }}>
                <TouchableOpacity 
                    style={styles.saveButton}
                    onPress={handleSaveChanges}    
                >
                    <Text>Save Changes</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    saveButton: {
        backgroundColor: '#00A86B',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 10,
        borderRadius: 4,
    },
    profileIconContainer: {
        position: 'relative',
        alignItems: 'center',
        paddingTop: 12,
    },
    profileIcon: {
        width: 100,
        height: 100,
        borderRadius: '50%',
        backgroundColor: '#ccc',
    },
    editButton: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        padding: 8,
        backgroundColor: '#00A86B',
        borderRadius: 50,
    },
    editOptionsContainer: {
        paddingVertical: 10,
        borderRadius: 8,
        paddingHorizontal: 8,
        marginVertical: 40,
    },
    editComponentInput: {
        padding: 12, 
        borderRadius: 16, 
        borderWidth: 1, 
        opacity: 0.8,
        marginTop: 8,
    }
});