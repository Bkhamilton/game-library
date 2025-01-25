import React, { useEffect, useRef, useState } from "react";
import { StyleSheet, Animated, Easing } from "react-native";
import { TouchableOpacity, View, Text } from "@/components/Themed";
import useTheme from "@/hooks/useTheme";
import DinoRunHeader from "./DinoRunHeader";

const DinoRunGame: React.FC = () => {
    const [isJumping, setIsJumping] = useState(false);
    const [isGameOver, setIsGameOver] = useState(false);
    const [score, setScore] = useState(0);
    const dinoY = useRef(new Animated.Value(0)).current;
    const cactusX = useRef(new Animated.Value(0)).current;
    const gameInterval = useRef<NodeJS.Timeout | null>(null);

    const handleJump = () => {
        if (!isJumping) {
            setIsJumping(true);
            Animated.sequence([
                Animated.timing(dinoY, {
                    toValue: -100,
                    duration: 200,
                    useNativeDriver: true,
                    easing: Easing.out(Easing.quad), // Quick upward motion
                }),
                Animated.timing(dinoY, {
                    toValue: -100,
                    duration: 150, // Hold at the top
                    useNativeDriver: true,
                    easing: Easing.linear,
                }),
                Animated.timing(dinoY, {
                    toValue: 0,
                    duration: 350,
                    useNativeDriver: true,
                    easing: Easing.in(Easing.quad), // Smooth downward motion
                }),
            ]).start(() => setIsJumping(false));
        }
    };

    useEffect(() => {
        if (isGameOver) return;

        const interval = setInterval(() => {
            setScore((prevScore) => prevScore + 1);
            checkCollision();
        }, 100);

        gameInterval.current = interval;

        return () => {
            clearInterval(interval);
        };
    }, [isJumping, isGameOver]);

    useEffect(() => {
        if (!isGameOver) {
            Animated.loop(
                Animated.timing(cactusX, {
                toValue: -410,
                duration: 2200,
                useNativeDriver: true,
                easing: Easing.linear,
                })
            ).start();
        } else {
            cactusX.stopAnimation();
        }
    }, [isGameOver]);

    const checkCollision = () => {
        const dinoBottom = 50;
        const cactusWidth = 20; 
        const dinoWidth = 50;

        dinoY.addListener(({ value: dinoYValue }) => {
            cactusX.addListener(({ value: cactusXValue }) => {
                if (
                    dinoYValue >= dinoBottom - dinoWidth && // Check if dino is on the ground
                    cactusXValue < dinoWidth && // Check if cactus is within dino's horizontal range
                    cactusXValue > -cactusWidth // Check if cactus is not past the dino
                ) {
                    setIsGameOver(true);
                    if (gameInterval.current) {
                        clearInterval(gameInterval.current);
                    }
                    cactusX.stopAnimation();
                }
            });
        });
    };

    const restartGame = () => {
        setIsGameOver(false);
        setScore(0);
        cactusX.setValue(0);
    };

    const { primary } = useTheme();

    return (
        <View style={styles.gameContainer}>
            <DinoRunHeader score={score} />
            <Animated.View
                style={[styles.dino, { transform: [{ translateY: dinoY }], backgroundColor: primary }]}
            />
            <Animated.View
                style={[styles.cactus, { transform: [{ translateX: cactusX }], backgroundColor: 'green' }]}
            />
            {isGameOver && (
                <View style={styles.gameOver}>
                    <Text>Game Over</Text>
                    <TouchableOpacity 
                        onPress={restartGame}
                    >
                        <Text>Restart</Text>
                    </TouchableOpacity>
                </View>
            )}
            <TouchableOpacity 
                style={styles.jumpButton} 
                onPress={() => handleJump()}
            >
                <Text>Jump</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    gameContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    dino: {
        position: "absolute",
        bottom: '40%',
        left: 50,
        width: 50,
        height: 50,
        borderRadius: 8,
    },
    cactus: {
        position: "absolute",
        bottom: '40%',
        right: 0,
        width: 20,
        height: 50,
    },
    gameOver: {
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: [{ translateX: -50 }, { translateY: -50 }],
        textAlign: "center",
    },
    jumpButton: {
        position: "absolute",
        bottom: 50,
        padding: 10,
        backgroundColor: "#ccc",
        borderRadius: 5,
    },
});

export default DinoRunGame;
