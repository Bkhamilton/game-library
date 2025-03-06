import React, { useEffect, useState, useContext } from 'react';
import { StyleSheet, Modal, TouchableOpacity } from 'react-native';
import { Text, View, ClearView } from '@/components/Themed';
import useTheme from '@/hooks/useTheme';
import { DBContext } from '@/contexts/DBContext';
import Difficulties from '@/constants/Difficulties';
import { getGameScores, getHighScoreByGame, getWinLossCountByGame } from '@/db/Scores/Results';

export default function EndGameMessage({ visible, close, win, game, initialDifficulty, restartGame }) {

    const titleMessage = win ? '🎉You Win!🎉' : 'You Lose!';

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

    const { db } = useContext(DBContext);

    const [gameStats, setGameStats] = useState([]);

    const [selectedDifficulty, setSelectedDifficulty] = useState('');

    useEffect(() => {
        setSelectedDifficulty(initialDifficulty);
    }, [initialDifficulty]);

    const handleRestartGame = () => {
        // if restartGame is passed as a prop, call it with selectedDifficulty
        if (restartGame) restartGame(selectedDifficulty);
        close();
    }

    const typeAGames = ['Sudoku', 'Minesweeper', 'Word Search', 'Crossword'];
    const typeBGames = ['GoGoBird', 'Ostrich Haul'];
    
    const handleGameBoxInfo = () => {
        if (typeAGames.includes(game.title)) {
            const totalGames = gameStats.reduce((acc, stat) => acc + stat.count, 0);
            const totalWins = gameStats.find(stat => stat.score === 1)?.count || 0;
    
            return (
                <>
                    <Text style={{ fontSize: 16 }}>Total Games: {totalGames}</Text>
                    <Text style={{ fontSize: 16 }}>Total Wins: {totalWins}</Text>
                </>
            );
        } else if (typeBGames.includes(game.title)) {
            const topScores = gameStats.slice(0, 3);

            return (
                <>
                    <Text style={{ fontSize: 16 }}>High Scores</Text>
                    {topScores.map((score, index) => (
                        <Text key={index} style={{ fontSize: 12, opacity: 0.6 }}>
                            {index + 1}. {score.score}
                        </Text>
                    ))}
                </>
            );
        } else {
            return null;
        }
    }

    useEffect(() => {
        const getGameInfo = async () => {
            try {
                if (typeAGames.includes(game.title)) {
                    const stats = await getWinLossCountByGame(db, game.id);
                    setGameStats(stats);
                } else if (typeBGames.includes(game.title)) {
                    const highScores = await getHighScoreByGame(db, game.id);
                    setGameStats(highScores);
                } else {
                    setGameStats({});
                }
            } catch (error) {
                console.error('Error getting game stats:', error);
            }
        }
        getGameInfo();
    }, [db, game.id, visible]);

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
                        <Text style={{ fontSize: 16, fontWeight: 'bold' }}>{titleMessage}</Text>
                    </View>
                    <View style={[styles.gameBox, { borderColor: primary }]}>
                        <ClearView style={{ paddingVertical: 4 }}>
                            <Text style={{ fontSize: 16 }}>🎮{game.title}🎮</Text>
                        </ClearView>
                        <ClearView style={styles.gameBoxInfo}>
                            {gameStats.length > 0 && handleGameBoxInfo()}
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
                        {Difficulties[game.title] && Difficulties[game.title].map((difficulty, index) => (
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