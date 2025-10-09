import React, { useEffect, useState } from "react";
import { StyleSheet, Modal, TouchableOpacity, Image } from "react-native";
import { Text, View } from "@/components/Themed";
import useTheme from "@/hooks/useTheme";
import { GameLogos } from "@/constants/GameLogos";
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';

// Animated button component for modal
const AnimatedModalButton = ({ onPress, children, style }) => {
    const scale = useSharedValue(1);
    
    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ scale: scale.value }],
    }));
    
    const handlePressIn = () => {
        scale.value = withSpring(0.95, {
            damping: 15,
            stiffness: 150,
        });
    };
    
    const handlePressOut = () => {
        scale.value = withSpring(1, {
            damping: 15,
            stiffness: 150,
        });
    };
    
    return (
        <TouchableOpacity
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
            onPress={onPress}
            activeOpacity={0.8}
        >
            <Animated.View style={[styles.button, style, animatedStyle]}>
                {children}
            </Animated.View>
        </TouchableOpacity>
    );
};

export default function SelectGame({ visible, close, game, difficulties, selectGame }) {
    const [showDifficultyModal, setShowDifficultyModal] = useState(false);

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

    const { primary, grayBackground } = useTheme();

    const [selectedDifficulty, setSelectedDifficulty] = useState("");

    useEffect(() => {
        setSelectedDifficulty(difficulties[0]);
    }, [difficulties]);

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
                        <AnimatedModalButton style={{ backgroundColor: grayBackground }} onPress={openDifficultyModal}>
                            <Text>
                                Difficulty: <Text style={{ fontWeight: "bold" }}>{selectedDifficulty}</Text>
                            </Text>
                        </AnimatedModalButton>
                        <AnimatedModalButton style={{ backgroundColor: primary, opacity: 0.5 }}>
                            <Text>Continue</Text>
                        </AnimatedModalButton>
                        <AnimatedModalButton style={{ backgroundColor: primary }} onPress={() => selectGame(game.title, selectedDifficulty)}>
                            <Text>New Game</Text>
                        </AnimatedModalButton>
                        <AnimatedModalButton style={{ backgroundColor: grayBackground }} onPress={close}>
                            <Text>Close</Text>
                        </AnimatedModalButton>
                    </View>
                </View>
            </View>
            {/* Difficulty Modal */}
            <Modal animationType="slide" transparent={true} visible={showDifficultyModal} onRequestClose={closeDifficultyModal}>
                <View style={styles.container}>
                    <View style={styles.innerContainer}>
                        <Text style={{ fontSize: 16, fontWeight: "bold" }}>Select Difficulty</Text>
                        {difficulties.map((difficulty, index) => (
                            <AnimatedModalButton key={index} style={{ backgroundColor: grayBackground }} onPress={() => selectDifficulty(difficulty)}>
                                <Text>{difficulty}</Text>
                            </AnimatedModalButton>
                        ))}
                        <AnimatedModalButton style={{ backgroundColor: primary }} onPress={closeDifficultyModal}>
                            <Text>Close</Text>
                        </AnimatedModalButton>
                    </View>
                </View>
            </Modal>
        </Modal>
    );
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
