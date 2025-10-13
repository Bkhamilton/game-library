import React, { useState, useEffect } from 'react';
import { StyleSheet, Modal, TouchableOpacity, TouchableWithoutFeedback } from 'react-native';
import { Text, View, TextInput } from '@/components/Themed';
import useTheme from '@/hooks/useTheme';

interface EditProfileModalProps {
    visible: boolean;
    close: () => void;
    currentName: string;
    currentUsername: string;
    onSave: (name: string, username: string) => void;
}

export default function EditProfileModal({ 
    visible, 
    close, 
    currentName, 
    currentUsername, 
    onSave 
}: EditProfileModalProps) {
    const { text, grayBackground, grayBorder, background, primary } = useTheme();
    const [name, setName] = useState(currentName);
    const [username, setUsername] = useState(currentUsername);

    useEffect(() => {
        if (visible) {
            setName(currentName);
            setUsername(currentUsername);
        }
    }, [visible, currentName, currentUsername]);

    const handleSave = () => {
        if (name.trim() === '' || username.trim() === '') {
            return;
        }
        onSave(name.trim(), username.trim());
        close();
    };

    const handleCancel = () => {
        setName(currentName);
        setUsername(currentUsername);
        close();
    };

    return (
        <Modal
            animationType="fade"
            transparent={true}
            visible={visible}
            onRequestClose={handleCancel}
        >
            <TouchableWithoutFeedback onPress={handleCancel}>
                <View style={styles.container}>
                    <TouchableWithoutFeedback>
                        <View style={[styles.modalContent, { backgroundColor: background }]}>
                            <Text style={styles.title}>Edit Profile</Text>
                            
                            <View style={{ width: '100%', marginVertical: 12 }}>
                                <Text style={styles.label}>Name</Text>
                                <TextInput
                                    style={[styles.input, { borderColor: grayBorder, backgroundColor: grayBackground }]}
                                    placeholder="Enter your name"
                                    autoCorrect={false}
                                    value={name}
                                    onChangeText={setName}
                                />
                            </View>

                            <View style={{ width: '100%', marginVertical: 12 }}>
                                <Text style={styles.label}>Username</Text>
                                <TextInput
                                    style={[styles.input, { borderColor: grayBorder, backgroundColor: grayBackground }]}
                                    placeholder="Enter your username"
                                    autoCorrect={false}
                                    value={username}
                                    onChangeText={setUsername}
                                />
                            </View>

                            <View style={styles.buttonContainer}>
                                <TouchableOpacity 
                                    style={[styles.button, styles.cancelButton, { backgroundColor: grayBackground }]}
                                    onPress={handleCancel}
                                >
                                    <Text>Cancel</Text>
                                </TouchableOpacity>
                                <TouchableOpacity 
                                    style={[styles.button, styles.saveButton, { backgroundColor: primary }]}
                                    onPress={handleSave}
                                >
                                    <Text>Save</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </TouchableWithoutFeedback>
                </View>
            </TouchableWithoutFeedback>
        </Modal>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        width: '85%',
        borderRadius: 12,
        padding: 20,
        alignItems: 'center',
    },
    title: {
        fontSize: 20,
        fontWeight: '600',
        marginBottom: 8,
    },
    label: {
        fontSize: 14,
        marginBottom: 8,
        fontWeight: '500',
    },
    input: {
        padding: 12,
        borderRadius: 8,
        borderWidth: 1,
        fontSize: 16,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        marginTop: 20,
        gap: 12,
    },
    button: {
        flex: 1,
        padding: 12,
        borderRadius: 8,
        alignItems: 'center',
    },
    cancelButton: {
    },
    saveButton: {
    },
});
