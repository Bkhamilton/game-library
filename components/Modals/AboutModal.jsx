import React from 'react';
import { StyleSheet, TouchableWithoutFeedback, Modal } from 'react-native';
import { Text, View } from '@/components/Themed';

export default function AboutModal({ visible, close }) {
    return (
        <Modal
            animationType="fade"
            transparent={true}
            visible={visible}
            onRequestClose={close}
        >
            <TouchableWithoutFeedback onPress={close}>
                <View style={styles.container}>
                    <View style={styles.aboutBox}>
                        <Text style={styles.aboutText}>Game Library</Text>
                        <Text style={styles.aboutText}>Version 1.0.0</Text>
                        <Text style={styles.aboutText}>Developed by Ben Hamilton and Kenneth Sullivan</Text>
                    </View>
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
    aboutBox: {
        padding: 16,
        borderRadius: 8,
    },
    aboutText: {
        fontSize: 16,
        marginBottom: 8,
    },
});