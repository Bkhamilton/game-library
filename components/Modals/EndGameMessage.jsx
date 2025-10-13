import React, { useEffect, useState, useContext } from 'react';
import { StyleSheet, Modal, TouchableOpacity, ScrollView } from 'react-native';
import { Text, View, ClearView } from '@/components/Themed';
import useTheme from '@/hooks/useTheme';
import { DBContext } from '@/contexts/DBContext';
import { UserContext } from '@/contexts/UserContext';
import Difficulties from '@/constants/Difficulties';
import { getGameScores, getHighScoreByGame, getWinLossCountByGame } from '@/db/Scores/Results';
import { checkAchievementsAfterGame } from '@/db/Achievements/AchievementTracker';
import { getUserTotalPoints } from '@/db/Achievements/Achievements';
import { useRouter } from 'expo-router';

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

    const { primary, grayBackground, secondary } = useTheme();

    const { db } = useContext(DBContext);
    const { user } = useContext(UserContext);

    const [gameStats, setGameStats] = useState([]);
    const [newlyUnlockedAchievements, setNewlyUnlockedAchievements] = useState([]);
    const [totalPoints, setTotalPoints] = useState(0);

    const [selectedDifficulty, setSelectedDifficulty] = useState('');

    useEffect(() => {
        setSelectedDifficulty(initialDifficulty);
    }, [initialDifficulty]);

    const handleRestartGame = () => {
        // if restartGame is passed as a prop, call it with selectedDifficulty
        if (restartGame) restartGame(selectedDifficulty);
        close();
    }

    const router = useRouter();

    const handleRouteHome = () => {
        router.replace('/(tabs)');
        close();
    }

    const typeAGames = ['Sudoku', 'Minesweeper', 'Word Search', 'Crossword', 'Connect Four'];
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

        const checkAchievements = async () => {
            if (!visible || !user?.id) return;
            
            try {
                // Check for newly unlocked achievements after the game
                const newAchievements = await checkAchievementsAfterGame(db, user.id, game.title);
                setNewlyUnlockedAchievements(newAchievements);
                
                // Get updated total points
                const points = await getUserTotalPoints(db, user.id);
                setTotalPoints(points);
            } catch (error) {
                console.error('Error checking achievements:', error);
            }
        };

        if (visible) {
            getGameInfo();
            checkAchievements();
        }
    }, [db, game.id, game.title, visible, user?.id]);

    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={visible}
            onRequestClose={close}
        >
            <View style={styles.container}>
                <ScrollView 
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator={false}
                >
                    <View style={styles.innerContainer}>
                        <View style={{ justifyContent: 'center', alignItems: 'center', paddingVertical: 8 }}>
                            <Text style={{ fontSize: 20, fontWeight: 'bold' }}>{titleMessage}</Text>
                        </View>

                        {/* Achievements Section */}
                        {newlyUnlockedAchievements.length > 0 && (
                            <View style={[styles.achievementSection, { borderColor: primary, backgroundColor: secondary }]}>
                                <ClearView style={{ alignItems: 'center', justifyContent: 'center', marginBottom: 8 }}>
                                    <Text style={{ fontSize: 16, fontWeight: 'bold', textAlign: 'center' }}>🏆Achievements Unlocked!🏆</Text>
                                </ClearView>
                                {newlyUnlockedAchievements.map((achievement, index) => (
                                    <View key={index} style={[styles.achievementItem, { borderColor: primary }]}>
                                        <ClearView style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 4 }}>
                                            <Text style={{ fontSize: 24, marginRight: 8 }}>{achievement.icon}</Text>
                                            <ClearView style={{ flex: 1 }}>
                                                <Text style={{ fontSize: 16, fontWeight: 'bold' }}>{achievement.title}</Text>
                                                <Text style={{ fontSize: 12, opacity: 0.7 }}>{achievement.description}</Text>
                                            </ClearView>
                                        </ClearView>
                                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <Text style={{ fontSize: 12, fontWeight: '600', color: primary }}>
                                                {achievement.tier} Tier
                                            </Text>
                                            <Text style={{ fontSize: 14, fontWeight: 'bold' }}>
                                                +{achievement.points} pts
                                            </Text>
                                        </View>
                                    </View>
                                ))}
                                <Text style={{ fontSize: 14, fontWeight: '600', marginTop: 8, opacity: 0.8 }}>
                                    Total Points: {totalPoints}
                                </Text>
                            </View>
                        )}

                        {/* Game Stats Section */}
                        <View style={[styles.gameBox, { borderColor: primary }]}>
                            <ClearView style={{ paddingVertical: 8 }}>
                                <Text style={{ fontSize: 18, fontWeight: '600' }}>🎮 {game.title} 🎮</Text>
                            </ClearView>
                            <ClearView style={styles.gameBoxInfo}>
                                {gameStats.length > 0 && handleGameBoxInfo()}
                            </ClearView>
                            <Text style={{ fontSize: 14, fontWeight: '500', opacity: 0.7 }}>Play Again?</Text>
                        </View>

                        {/* Buttons */}
                        <View style={{ paddingTop: 16 }}>
                            <TouchableOpacity
                                style={[styles.button, { backgroundColor: grayBackground }]}
                                onPress={handleRouteHome}
                            >
                                <Text>Go Home</Text>
                            </TouchableOpacity>                                
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
                </ScrollView>
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
    scrollContent: {
        flexGrow: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 20,
    },
    innerContainer: {
        justifyContent: 'center', 
        alignItems: 'center', 
        padding: 16, 
        borderRadius: 8,
        maxWidth: 400,
        width: '90%',
    },
    button: {
        padding: 10,
        borderRadius: 6,
        marginVertical: 4,
        width: 250,
        alignItems: 'center',
    },
    gameBox: {
        borderWidth: 2,
        borderRadius: 8,
        width: 280,
        minHeight: 220,
        alignItems: 'center',
        paddingVertical: 12,
        marginVertical: 8,
    },
    gameBoxInfo: {
        flex: 1,
        paddingVertical: 8,
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
    },
    achievementSection: {
        borderWidth: 2,
        borderRadius: 12,
        paddingVertical: 16,
        marginVertical: 12,
        width: 320,
        maxWidth: '95%',
    },
    achievementItem: {
        borderWidth: 1,
        borderRadius: 8,
        padding: 12,
        marginVertical: 6,
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
    },
});