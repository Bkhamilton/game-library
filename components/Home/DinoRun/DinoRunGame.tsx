import React, { useEffect, useRef, useState } from "react";
import { StyleSheet, Animated, Easing } from "react-native";
import { TouchableOpacity, View, Text } from "@/components/Themed";
import useTheme from "@/hooks/useTheme";
import DinoRunHeader from "./DinoRunHeader";
import LossMessage from '@/components/Modals/LossMessage';
import Difficulties from '@/constants/Difficulties';

const DinoRunGame: React.FC = () => {
    const [isJumping, setIsJumping] = useState(false);
    const [isGameOver, setIsGameOver] = useState(false);
    const [score, setScore] = useState(0);
    const [countdown, setCountdown] = useState(3);    
    const dinoY = useRef(new Animated.Value(0)).current;
    const cactusX = useRef(new Animated.Value(0)).current;
    const gameInterval = useRef<NodeJS.Timeout | null>(null);

    const [lossModalVisible, setLossModalVisible] = useState(false);

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
        if (isGameOver || countdown > 0) return;

        const interval = setInterval(() => {
            setScore((prevScore) => prevScore + 1);
            checkCollision();
        }, 100);

        gameInterval.current = interval;

        return () => {
            clearInterval(interval);
        };
    }, [isJumping, isGameOver, countdown]);

    useEffect(() => {
        if (countdown > 0) {
            const timer = setTimeout(() => {
                setCountdown(countdown - 1);
            }, 1000);
            return () => clearTimeout(timer);
        }
    }, [countdown]);

    useEffect(() => {
        if (!isGameOver && countdown === 0) {
            cactusX.setValue(0); // Reset cactus position
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
    }, [isGameOver, countdown]);

    const checkCollision = () => {
        const dinoBottom = 50; // Dino's bottom position
        const cactusWidth = 20; // Cactus width
        const dinoWidth = 50; // Dino width

        dinoY.addListener(({ value: dinoYValue }) => {
            cactusX.addListener(({ value: cactusXValue }) => {
                if (
                    cactusXValue < dinoWidth &&
                    cactusXValue + cactusWidth > 0 &&
                    dinoYValue < dinoBottom
                ) {
                    endGame();
                }
            });
        });
    };

    const endGame = () => {
        setIsGameOver(true);
        clearInterval(gameInterval.current!);
        setLossModalVisible(true);
    };

    const restartGame = () => {
        setIsGameOver(false);
        setScore(0);
        cactusX.setValue(0);
        setLossModalVisible(false);
    };

    const { primary } = useTheme();

    return (
        <View style={styles.gameContainer}>
            { countdown > 0 && (
                <View>
                    <Text style={{ textAlign: 'center', fontSize: 24, fontWeight: '600' }}>Get Ready!</Text>
                    <Text style={{ textAlign: 'center', fontSize: 24, fontWeight: '600' }}>{countdown}</Text>
                </View>
            )}
            <DinoRunHeader score={score} />
            <View style={styles.gameArea} >
                <Animated.View
                    style={[
                        styles.dino,
                        {
                            transform: [{ translateY: dinoY }],
                            backgroundColor: primary,
                        },
                    ]}
                />
                <Animated.View
                    style={[
                        styles.cactus,
                        {
                            transform: [{ translateX: cactusX }],
                            backgroundColor: 'green',
                        },
                    ]}
                />
                <View style={styles.ground} />
            </View>
            <LossMessage
                visible={lossModalVisible}
                close={() => setLossModalVisible(false)}
                title={'You Lost!'}
                difficulties={Difficulties['DinoRun']}
                restartGame={restartGame}
            />
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
        alignItems: "center",
        justifyContent: 'flex-end',
        paddingBottom: '90%',
    },
    dino: {
        width: 50,
        height: 50,
        borderRadius: 8,
        position: "absolute",
        bottom: 0,
    },
    cactus: {
        width: 20,
        height: 50,
        position: "absolute",
        bottom: 0,
        right: 0,
    },
    gameArea: {
        position: "relative",
        width: '100%',
        height: 200,
    },
    ground: {
        position: "absolute",
        bottom: 0,
        width: "100%",
        height: 2,
        backgroundColor: "#333",
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
