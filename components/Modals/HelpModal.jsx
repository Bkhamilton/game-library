import React from 'react';
import { StyleSheet, TouchableWithoutFeedback, Modal } from 'react-native';
import { Text, View } from '@/components/Themed';
import Disclosure from '../Helpers/Disclosure';

export default function HelpModal({ visible, close }) {

    const helpText = [
        {
            "title": "What is this?",
            "content": (
                <>
                    <Text style={{ fontSize: 16 }}>This is a collection of games and puzzles.</Text>
                    <Text style={{ fontSize: 16 }}>You can play them for fun or to challenge yourself.</Text>
                </>
            )
        },
        {
            "title": "How do I play?",
            "content": (
                <>
                    <Text style={{ fontSize: 16 }}>Select a game from the menu.</Text>
                    <Text style={{ fontSize: 16 }}>Follow the instructions on the screen.</Text>
                </>
            )
        }
    ]

    return (
        <Modal
            animationType="fade"
            transparent={true}
            visible={visible}
            onRequestClose={close}
        >
            <TouchableWithoutFeedback onPress={close}>
                <View style={styles.container}>
                    {helpText.map((item, index) => (
                        <Disclosure key={index} title={item.title} content={item.content} />
                    ))}
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
});