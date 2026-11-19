import React, { useEffect, useState } from "react";
import { StyleSheet, Modal, TouchableOpacity, Image, ScrollView } from "react-native";
import { Text, View } from "@/components/Themed";
import useTheme from "@/hooks/useTheme";
import { GameLogos } from "@/constants/GameLogos";
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';
import GameModes from "@/constants/GameModes";
import { isDailyChallengeCompleted } from "@/utils/DailyChallenge";
import { SudokuDifficultyDescriptions } from "@/constants/Difficulties";

// Animated button component for modal
const AnimatedModalButton = ({ onPress, children, style, disabled }) => {
    const scale = useSharedValue(1);
    
    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ scale: scale.value }],
    }));
    
    const handlePressIn = () => {
        if (!disabled) {
            scale.value = withSpring(0.95, {
                damping: 15,
                stiffness: 150,
            });
        }
    };
    
    const handlePressOut = () => {
        if (!disabled) {
            scale.value = withSpring(1, {
                damping: 15,
                stiffness: 150,
            });
        }
    };
    
    return (
        <TouchableOpacity
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
            onPress={onPress}
            activeOpacity={disabled ? 1 : 0.8}
            disabled={disabled}
        >
            <Animated.View style={[styles.button, style, animatedStyle]}>
                {children}
            </Animated.View>
        </TouchableOpacity>
    );
};

export default function SelectGame({
    visible, close, game, difficulties, selectGame,
    savedRuns, continueGame, checkDailyCompleted = isDailyChallengeCompleted,
    sessionError, sessionsLoading, retrySessions, unavailableRuns, discardRun,
}) {
    const [showDifficultyModal, setShowDifficultyModal] = useState(false);
    const [showModeModal, setShowModeModal] = useState(false);
    const [showSavedRuns, setShowSavedRuns] = useState(false);
    const [dailyCheck, setDailyCheck] = useState(null);
    const [dailyRetry, setDailyRetry] = useState(0);

    const openDifficultyModal = () => {
        setShowDifficultyModal(true);
    };

    const closeDifficultyModal = () => {
        setShowDifficultyModal(false);
    };

    const selectDifficulty = (difficulty) => {
        closeDifficultyModal();
        setSelectedDifficulty(difficulty);
    };

    const openModeModal = () => {
        setShowModeModal(true);
    };

    const closeModeModal = () => {
        setShowModeModal(false);
    };

    const selectMode = (mode) => {
        closeModeModal();
        setSelectedMode(mode);
    };

    const { primary, grayBackground } = useTheme();

    const [selectedDifficulty, setSelectedDifficulty] = useState("");
    const [selectedMode, setSelectedMode] = useState("Classic");

    const modes = GameModes[game.title] || ["Classic"];

    useEffect(() => {
        setSelectedDifficulty(difficulties[0]);
    }, [difficulties]);

    // Check if daily challenge has been completed
    const dailySelection = visible && selectedMode === 'Daily Challenge' && selectedDifficulty
        ? `${game.title}:${selectedDifficulty}:${dailyRetry}`
        : null;
    useEffect(() => {
        let current = true;
        if (dailySelection) {
            checkDailyCompleted(game.title, selectedDifficulty).then(completed => {
                if (current) setDailyCheck({ selection: dailySelection, status: completed ? 'completed' : 'available' });
            }).catch(error => {
                console.error('Could not read Daily challenge status:', error);
                if (current) setDailyCheck({ selection: dailySelection, status: 'error' });
            });
        } else {
            setDailyCheck(null);
        }
        return () => { current = false; };
    }, [dailySelection, selectedDifficulty, game.title, checkDailyCompleted]);

    const dailyStatus = dailyCheck?.selection === dailySelection ? dailyCheck?.status : 'loading';
    const dailyBlocked = selectedMode === 'Daily Challenge' && dailyStatus !== 'available';
    const resumableRuns = savedRuns?.filter(run => run.identity.mode === selectedMode) ?? [];
    const continueRun = id => {
        setShowSavedRuns(false);
        continueGame(id);
    };

    return (
        <Modal animationType="slide" transparent={true} visible={visible} onRequestClose={close}>
            <View style={styles.container}>
                <View style={styles.innerContainer}>
                    <View
                        style={{
                            justifyContent: "center",
                            alignItems: "center",
                            paddingVertical: 4,
                        }}
                    >
                        <Text style={{ fontSize: 16, fontWeight: "bold" }}>{game.title}</Text>
                    </View>
                    <View style={[styles.gameBox, { borderColor: primary }]}>
                        <View style={[styles.gameBoxIcon, { backgroundColor: primary }]}>
                            <Image source={GameLogos[game.title]} style={styles.gameLogo} />
                        </View>
                        <Text
                            style={{
                                textAlign: "center",
                                padding: 8,
                                fontSize: 10,
                            }}
                        >
                            {game.description}
                        </Text>
                    </View>
                    <View style={{ paddingTop: 16 }}>
                        {modes.length > 1 && (
                            <AnimatedModalButton style={{ backgroundColor: grayBackground }} onPress={openModeModal}>
                                <Text>
                                    Mode: <Text style={{ fontWeight: "bold" }}>{selectedMode}</Text>
                                </Text>
                            </AnimatedModalButton>
                        )}
                        <AnimatedModalButton style={{ backgroundColor: grayBackground }} onPress={openDifficultyModal}>
                            <Text>
                                Difficulty: <Text style={{ fontWeight: "bold" }}>{selectedDifficulty}</Text>
                            </Text>
                        </AnimatedModalButton>
                        {sessionError && (
                            <AnimatedModalButton style={{ backgroundColor: grayBackground }} onPress={retrySessions}>
                                <Text>Could not load saved games. Retry</Text>
                            </AnimatedModalButton>
                        )}
                        {unavailableRuns?.map(({ id }) => (
                            <AnimatedModalButton key={id} style={{ backgroundColor: grayBackground }} onPress={() => discardRun(id)}>
                                <Text>Incompatible save · Discard</Text>
                            </AnimatedModalButton>
                        ))}
                        {resumableRuns.length > 0 && (
                            <AnimatedModalButton style={{ backgroundColor: primary }} onPress={() =>
                                resumableRuns.length === 1 ? continueRun(resumableRuns[0].id) : setShowSavedRuns(true)
                            }>
                                <Text>Continue</Text>
                                {resumableRuns.length === 1 && <Text>{savedRunLabel(resumableRuns[0])}</Text>}
                            </AnimatedModalButton>
                        )}
                        {selectedMode === 'Daily Challenge' && dailyStatus === 'error' && (
                            <AnimatedModalButton style={{ backgroundColor: grayBackground }} onPress={() => setDailyRetry(retry => retry + 1)}>
                                <Text>Could not check the Daily Challenge. Retry</Text>
                            </AnimatedModalButton>
                        )}
                        <AnimatedModalButton 
                            style={{ 
                                backgroundColor: primary, 
                                opacity: dailyBlocked || sessionError || sessionsLoading || unavailableRuns?.length ? 0.3 : 1
                            }} 
                            onPress={() => selectGame(game.title, selectedDifficulty, selectedMode)}
                            disabled={dailyBlocked || Boolean(sessionError) || sessionsLoading || Boolean(unavailableRuns?.length)}
                        >
                            <Text>
                                {sessionsLoading ? 'Loading saved games' : !dailyBlocked ? 'New Game' :
                                    dailyStatus === 'completed' ? 'Completed Today' :
                                    dailyStatus === 'error' ? 'Daily Challenge Unavailable' : 'Checking Daily Challenge'}
                            </Text>
                        </AnimatedModalButton>
                        <AnimatedModalButton style={{ backgroundColor: grayBackground }} onPress={close}>
                            <Text>Close</Text>
                        </AnimatedModalButton>
                    </View>
                    <Modal animationType="slide" transparent visible={visible && showSavedRuns} onRequestClose={() => setShowSavedRuns(false)}>
                        <View style={styles.container}>
                            <View style={[styles.innerContainer, { maxHeight: '90%' }]}>
                                <ScrollView>
                                    <Text accessibilityRole="header">Continue a saved game</Text>
                                    {resumableRuns.map(run => (
                                        <AnimatedModalButton key={run.id} style={{ backgroundColor: grayBackground }} onPress={() => continueRun(run.id)}>
                                            <Text>{savedRunLabel(run)}</Text>
                                        </AnimatedModalButton>
                                    ))}
                                    <AnimatedModalButton style={{ backgroundColor: primary }} onPress={() => setShowSavedRuns(false)}>
                                        <Text>Close</Text>
                                    </AnimatedModalButton>
                                </ScrollView>
                            </View>
                        </View>
                    </Modal>
                </View>
            </View>
            {/* Difficulty Modal */}
            <Modal animationType="slide" transparent={true} visible={showDifficultyModal} onRequestClose={closeDifficultyModal}>
                <View style={styles.container}>
                    <View style={[styles.innerContainer, { maxHeight: '90%' }]}>
                        <ScrollView>
                            <Text style={{ fontSize: 16, fontWeight: "bold" }}>Select Difficulty</Text>
                            {game.title === 'Sudoku' && (
                                <Text style={{ width: 200, paddingVertical: 8 }}>
                                    Rated by solving techniques, not blank count. No guessing required.
                                </Text>
                            )}
                            {difficulties.map((difficulty, index) => (
                                <AnimatedModalButton key={index} style={{ backgroundColor: grayBackground }} onPress={() => selectDifficulty(difficulty)}>
                                    <Text>{difficulty}</Text>
                                    {game.title === 'Sudoku' && (
                                        <Text style={{ fontSize: 12, marginTop: 4 }}>
                                            {SudokuDifficultyDescriptions[difficulty]}
                                        </Text>
                                    )}
                                </AnimatedModalButton>
                            ))}
                            <AnimatedModalButton style={{ backgroundColor: primary }} onPress={closeDifficultyModal}>
                                <Text>Close</Text>
                            </AnimatedModalButton>
                        </ScrollView>
                    </View>
                </View>
            </Modal>
            {/* Mode Modal */}
            <Modal animationType="slide" transparent={true} visible={showModeModal} onRequestClose={closeModeModal}>
                <View style={styles.container}>
                    <View style={styles.innerContainer}>
                        <Text style={{ fontSize: 16, fontWeight: "bold" }}>Select Mode</Text>
                        {modes.map((mode, index) => (
                            <AnimatedModalButton key={index} style={{ backgroundColor: grayBackground }} onPress={() => selectMode(mode)}>
                                <Text>{mode}</Text>
                            </AnimatedModalButton>
                        ))}
                        <AnimatedModalButton style={{ backgroundColor: primary }} onPress={closeModeModal}>
                            <Text>Close</Text>
                        </AnimatedModalButton>
                    </View>
                </View>
            </Modal>
        </Modal>
    );
}

function savedRunLabel({ identity }) {
    return identity.dailyDate ? `${identity.dailyDate} · ${identity.difficulty}` : identity.difficulty;
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "rgba(0, 0, 0, 0.6)",
        justifyContent: "center",
        alignItems: "center",
    },
    innerContainer: {
        justifyContent: "center",
        alignItems: "center",
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
        justifyContent: "center",
        alignItems: "center",
    },
    gameBoxIcon: {
        borderRadius: 4,
        margin: 4,
    },
    gameLogo: {
        height: 120,
        width: 120,
        borderRadius: 8,
    },
});
