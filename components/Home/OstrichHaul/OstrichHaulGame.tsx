import React, { useState, useEffect, useContext } from "react";
import { StyleSheet, TouchableOpacity, Animated, Dimensions, Easing, Image, View, Text } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { Ostrich } from "./Ostrich";
import { useRouter } from "expo-router";
import EndGameMessage from "@/components/Modals/EndGameMessage";
import { DBContext } from "@/contexts/DBContext";
import { insertHighScore } from '@/db/Scores/Scores';

const OSTRICH_SPRITES = [
    require("@/assets/images/ostrichHaul/ostrichSprite1.png"),
    require("@/assets/images/ostrichHaul/ostrichSprite2.png"),
    require("@/assets/images/ostrichHaul/ostrichSprite3.png"),
];

import spikeSprite from "@/assets/images/ostrichHaul/spike.png";

const DIFFICULTY_SETTINGS = {
    Easy: { obstacleSpeed: 2000, minSpawnRate: 1500, maxSpawnRate: 2500 },
    Medium: { obstacleSpeed: 1500, minSpawnRate: 1000, maxSpawnRate: 2000 },
    Hard: { obstacleSpeed: 1000, minSpawnRate: 1000, maxSpawnRate: 1500 },
};

const screenWidth = Dimensions.get("window").width;
const screenHeight = Dimensions.get("window").height;
const groundLevel = screenHeight - 450;
const jumpVelocity = -15;

const OSTRICH_WIDTH = 100;
const OSTRICH_HEIGHT = 121;
const OSTRICH_OFFSET = 60; // Amount to lift the ostrich up from the ground
const COLLISION_ADJUST = 20; // Amount to reduce collision box size

export default function OstrichHaulGame() {
    const router = useRouter();
    const { difficulty } = useLocalSearchParams();
    const [position, setPosition] = useState({
        y: new Animated.Value(groundLevel - OSTRICH_HEIGHT + OSTRICH_OFFSET),
        x: new Animated.Value(15),
    });
    const [gameState, setGameState] = useState({
        velocity: 0,
        isJumping: false,
        gravity: 1,
        spriteFrame: 0,
    });
    const [obstacles, setObstacles] = useState<{ key: string; x: Animated.Value }[]>([]);
    const [isGameRunning, setIsGameRunning] = useState(false);
    const [score, setScore] = useState(0);
    const [trigger, setTrigger] = useState(false);
    const [endGameModalVisible, setEndGameModalVisible] = useState(false);

    const { curGame } = useContext(DBContext);

    const settings = DIFFICULTY_SETTINGS[difficulty || "Easy"];

    const checkCollision = (obstacle: any) => {
        const ostrichTop = position.y.__getValue() + COLLISION_ADJUST;
        const ostrichBottom = ostrichTop + OSTRICH_HEIGHT - COLLISION_ADJUST * 2;
        const ostrichLeft = position.x.__getValue() + COLLISION_ADJUST;
        const ostrichRight = ostrichLeft + OSTRICH_WIDTH - COLLISION_ADJUST * 2;

        const obstacleLeft = obstacle.x.__getValue();
        const obstacleRight = obstacleLeft + 50;
        const obstacleTop = obstacle.gapTop;
        const obstacleBottom = groundLevel;

        return ostrichRight > obstacleLeft && ostrichLeft < obstacleRight && (ostrichTop < obstacleTop || ostrichBottom > obstacleBottom);
    };

    const restartGame = (difficulty: string) => {
        router.push(`/ostrichhaul?difficulty=${difficulty}`);
        setTrigger(!trigger);
    };

    const handleLoss = () => {
        // insertHighScore(db, curGame.id, score, difficulty);
        setIsGameRunning(false);
        setEndGameModalVisible(true);
    };

    useEffect(() => {
        if (isGameRunning) {
            const gameLoop = setInterval(() => {
                setGameState((prev) => {
                    const newVelocity = prev.velocity + prev.gravity;
                    const newY = position.y.__getValue() + newVelocity;
                    const groundCollisionPoint = groundLevel - OSTRICH_HEIGHT + OSTRICH_OFFSET;

                    if (newY >= groundCollisionPoint) {
                        position.y.setValue(groundCollisionPoint);
                        return {
                            ...prev,
                            velocity: 0,
                            isJumping: false,
                        };
                    }

                    position.y.setValue(Math.max(newY, 0));
                    return {
                        ...prev,
                        velocity: newVelocity,
                    };
                });

                obstacles.forEach((obstacle, index) => {
                    if (checkCollision(obstacle)) {
                        handleLoss();
                    } else if (position.x.__getValue() > obstacle.x.__getValue() + 50) {
                        setScore((prevScore) => prevScore + 1);
                        setObstacles((prevObstacles) => prevObstacles.filter((_, i) => i !== index));
                    }
                });
            }, 1000 / 60);

            return () => clearInterval(gameLoop);
        }
    }, [isGameRunning, obstacles]);

    useEffect(() => {
        if (isGameRunning) {
            let spawnTimeout: NodeJS.Timeout;

            const spawnObstacle = () => {
                const newObstacle = {
                    key: Math.random().toString(),
                    x: new Animated.Value(screenWidth),
                };
                setObstacles((prevObstacles) => [...prevObstacles, newObstacle]);

                Animated.timing(newObstacle.x, {
                    toValue: -50,
                    duration: settings.obstacleSpeed,
                    easing: Easing.linear,
                    useNativeDriver: false,
                }).start(({ finished }) => {
                    if (finished) {
                        setObstacles((prevObstacles) => prevObstacles.filter((obstacle) => obstacle.key !== newObstacle.key));
                    }
                });

                const randomSpawnRate = Math.random() * (settings.maxSpawnRate - settings.minSpawnRate) + settings.minSpawnRate;
                spawnTimeout = setTimeout(spawnObstacle, randomSpawnRate);
            };

            spawnObstacle();

            return () => clearTimeout(spawnTimeout);
        }
    }, [isGameRunning]);

    useEffect(() => {
        if (gameState.isJumping && gameState.velocity > -5 && gameState.velocity < 5) {
            if (difficulty === "Hard") {
                setGameState((prev) => ({
                    ...prev,
                    gravity: 0.6,
                }));
            } else {
                setGameState((prev) => ({
                    ...prev,
                    gravity: 0.2,
                }));
            }
        } else {
            setGameState((prev) => ({
                ...prev,
                gravity: 1,
            }));
        }
    }, [gameState.isJumping, gameState.velocity]);

    useEffect(() => {
        if (isGameRunning) {
            const spriteInterval = setInterval(() => {
                setGameState((prev) => ({
                    ...prev,
                    spriteFrame: (prev.spriteFrame + 1) % OSTRICH_SPRITES.length,
                }));
            }, 70); // Change sprite every 100ms

            return () => clearInterval(spriteInterval);
        }
    }, [isGameRunning]);

    const startGame = () => {
        setIsGameRunning(true);
        setPosition({
            y: new Animated.Value(groundLevel - OSTRICH_HEIGHT),
            x: new Animated.Value(15),
        });
        setGameState({
            velocity: 0,
            isJumping: false,
            gravity: 1,
            spriteFrame: 0,
        });
        setObstacles([]);
        setScore(0);
    };

    const jump = () => {
        if (!gameState.isJumping) {
            setGameState((prev) => ({
                ...prev,
                velocity: jumpVelocity,
                isJumping: true,
            }));
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.score}>{score}</Text>
            <View style={styles.sky} />
            <View style={styles.ground} />
            <TouchableOpacity style={styles.screen} onPress={jump} activeOpacity={1}>
                <Ostrich y={position.y} x={position.x} spriteFrame={gameState.spriteFrame} />
                {obstacles.map((obstacle) => (
                    <React.Fragment key={obstacle.key}>
                        <Animated.Image
                            source={spikeSprite}
                            style={[
                                styles.obstacle,
                                {
                                    left: obstacle.x,
                                    height: 100,
                                    top: groundLevel - 50,
                                },
                            ]}
                        />
                    </React.Fragment>
                ))}
            </TouchableOpacity>
            {!isGameRunning && (
                <TouchableOpacity style={styles.startButton} onPress={startGame}>
                    <Text style={styles.startText}>Start</Text>
                </TouchableOpacity>
            )}
            <EndGameMessage
                visible={endGameModalVisible}
                close={() => setEndGameModalVisible(false)}
                win={false}
                game={curGame}
                initialDifficulty={difficulty}
                restartGame={restartGame}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#33a5ff",
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
        height: "100%",
    },
    sky: {
        position: "absolute",
        width: "100%",
        height: "70%",
        backgroundColor: "#33a5ff",
    },
    ground: {
        position: "absolute",
        width: "100%",
        top: screenHeight - 400,
        backgroundColor: "#8B4513",
        bottom: 0,
    },
    screen: {
        flex: 1,
        width: "100%",
        height: "100%",
    },
    ostrich: {
        position: "absolute",
        resizeMode: "cover",
    },
    obstacle: {
        position: "absolute",
        width: 50,
    },
    score: {
        position: "absolute",
        top: 50,
        fontSize: 64,
        fontWeight: "bold",
        color: "white",
    },
    startButton: {
        position: "absolute",
        bottom: 100,
        padding: 20,
        backgroundColor: "green",
        borderRadius: 10,
    },
    startText: {
        fontSize: 24,
        color: "white",
    },
});
