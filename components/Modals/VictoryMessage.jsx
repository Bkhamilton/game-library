import React, { useEffect, useState } from 'react';
import { StyleSheet, Modal, TouchableOpacity } from 'react-native';
import { Text, View, ClearView } from '@/components/Themed';
import useTheme from '@/hooks/useTheme';

export default function VictoryMessage({ visible, close, title, game, difficulties, initialDifficulty, restartGame }) {

    const [showDifficultyModal, setShowDifficultyModal] = useState(false);

    const openDifficultyModal = () => {
        setShowDifficultyModal(true);
    }

    const closeDifficultyModal = () => {
        setShowDifficultyModal(false);
    }

    const selectDifficulty = (difficulty) => {
        closeDifficultyModal();
        setSelectedDifficulty(difficulty);
    }

    const { primary, grayBackground } = useTheme();

    const [selectedDifficulty, setSelectedDifficulty] = useState('');

    useEffect(() => {
        setSelectedDifficulty(initialDifficulty || difficulties[0]);
    }, [difficulties]);

    const handleRestartGame = () => {
        // if restartGame is passed as a prop, call it with selectedDifficulty
        if (restartGame) restartGame(selectedDifficulty);
        close();
    }

    const typeAGames = ['Sudoku', 'Minesweeper', 'Word Search', 'Crossword'];
    const typeBGames = ['GoGoBird', 'Ostrich Haul'];
    
    const handleGameBoxInfo = () => {
        if (typeAGames.includes(game)) {
            return (
                <>
                    <Text style={{ fontSize: 16 }}>Win Streak: 0</Text>
                    <Text style={{ fontSize: 12, opacity: 0.6 }}>Total Wins: 100</Text>
                </>
            );
        } else if (typeBGames.includes(game)) {
            return (
                <>
                    <Text style={{ fontSize: 16 }}>High Scores</Text>
                    <Text style={{ fontSize: 12, opacity: 0.6 }}>1. 1000</Text>
                    <Text style={{ fontSize: 12, opacity: 0.6 }}>2. 900</Text>
                    <Text style={{ fontSize: 12, opacity: 0.6 }}>3. 800</Text>
                </>
            );
        } else {
            return null;
        }
    }

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
                        <Text style={{ fontSize: 16, fontWeight: 'bold' }}>🎉{title}🎉</Text>
                    </View>
                    <View style={[styles.gameBox, { borderColor: primary }]}>
                        <ClearView style={{ paddingVertical: 4 }}>
                            <Text style={{ fontSize: 16 }}>🎮{game}🎮</Text>
                        </ClearView>
                        <ClearView style={styles.gameBoxInfo}>
                            {handleGameBoxInfo()}
                        </ClearView>
                        <Text style={{ fontSize: 14, fontWeight: '500', opacity: 0.7 }}>Play Again?</Text>
                    </View>
                    <View style={{ paddingTop: 16 }}>
                        <TouchableOpacity
                            style={[styles.button, { backgroundColor: grayBackground }]}
                            onPress={openDifficultyModal}
                        >
                            <Text>Difficulty: <Text style={{ fontWeight: 'bold' }}>{selectedDifficulty}</Text></Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.button, { backgroundColor: primary }]}
                            onPress={handleRestartGame}
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
            {/* Difficulty Modal */}
            <Modal
                animationType="slide"
                transparent={true}
                visible={showDifficultyModal}
                onRequestClose={closeDifficultyModal}
            >
                <View style={styles.container}>
                    <View style={styles.innerContainer}>
                        <Text style={{ fontSize: 16, fontWeight: 'bold' }}>Select Difficulty</Text>
                        {difficulties.map((difficulty, index) => (
                            <TouchableOpacity
                                key={index}
                                style={[styles.button, { backgroundColor: grayBackground }]}
                                onPress={() => selectDifficulty(difficulty)}
                            >
                                <Text>{difficulty}</Text>
                            </TouchableOpacity>
                        ))}
                        <TouchableOpacity
                            style={[styles.button, { backgroundColor: primary }]}
                            onPress={closeDifficultyModal}
                        >
                            <Text>Close</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
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
        alignItems: 'center',
    },
    gameBoxInfo: {
        flex: 1,
        paddingVertical: 4,
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
    }
});