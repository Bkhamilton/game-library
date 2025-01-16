import React, { useState } from 'react';
import { StyleSheet, Modal, TouchableOpacity } from 'react-native';
import { Text, View } from '@/components/Themed';
import useTheme from '@/hooks/useTheme';

export default function SelectGame({ visible, close, title, difficulties, selectGame }) {

    const { primary, grayBackground } = useTheme();

    const [selectedDifficulty, setSelectedDifficulty] = useState(difficulties[0]);

    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={visible}
            onRequestClose={close}
        >
            <View style={styles.container}>
                <View style={styles.innerContainer}>
                    <View style={{ justifyContent: 'center', alignItems: 'center', paddingVertical: 4 }}>
                        <Text style={{ fontSize: 16, fontWeight: 'bold' }}>{title}</Text>
                    </View>
                    <View style={[styles.gameBox, { borderColor: primary }]}/>
                    <View style={{ paddingTop: 16 }}>
                        <TouchableOpacity
                            style={[styles.button, { backgroundColor: grayBackground }]}
                        >
                            <Text>Difficulty: <Text style={{ fontWeight: 'bold' }}>{selectedDifficulty}</Text></Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.button, { backgroundColor: primary, opacity: 0.5 }]}
                        >
                            <Text>Continue</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.button, { backgroundColor: primary }]}
                            onPress={() => selectGame(title, selectedDifficulty)}
                        >
                            <Text>New Game</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.button, { backgroundColor: grayBackground }]}
                            onPress={close}
                        >
                            <Text>Close</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    innerContainer: {
        justifyContent: 'center', 
        alignItems: 'center', 
        padding: 8, 
        borderRadius: 4,
    },
    button: {
        padding: 10,
        borderRadius: 6,
        marginVertical: 2,
        width: 200,
    },
    gameBox: {
        borderWidth: 1,
        borderRadius: 4,
        width: 200,
        height: 200,
    }
});