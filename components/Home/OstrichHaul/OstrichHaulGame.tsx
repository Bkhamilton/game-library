import React, { useState, useEffect, useContext } from "react";
import { StyleSheet, TouchableOpacity, Animated, Easing, View, Text } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { Ostrich, OSTRICH_SPRITE_COUNT } from "./Ostrich";
import { Obstacle } from "./Obstacle";
import { Cloud } from "./Cloud";
import { useRouter } from "expo-router";
import EndGameMessage from "@/components/Modals/EndGameMessage";
import { DBContext } from "@/contexts/DBContext";
import { insertHighScore } from '@/db/Scores/Scores';
import { 
    DIFFICULTY_SETTINGS,
    screenWidth,
    screenHeight,
    groundLevel,
    jumpVelocity,
    OSTRICH_HEIGHT,
    OSTRICH_OFFSET,
    SPRITE_ANIMATION_INTERVAL,
    GAME_LOOP_FPS,
    OBSTACLE_WIDTH,
    CLOUD_MIN_SPAWN_RATE,
    CLOUD_MAX_SPAWN_RATE,
    CLOUD_MIN_SIZE,
    CLOUD_MAX_SIZE,
    CLOUD_MIN_Y,
    CLOUD_MAX_Y
} from "./constants";
import { Position, GameState, Obstacle as ObstacleType, Cloud as CloudType } from "./types";
import { checkCollision, calculateGravity, getRandomSpawnRate } from "./utils";

export default function OstrichHaulGame() {
    const router = useRouter();
    const { difficulty } = useLocalSearchParams();
    const [position, setPosition] = useState<Position>({
        y: new Animated.Value(groundLevel - OSTRICH_HEIGHT + OSTRICH_OFFSET),
        x: new Animated.Value(15),
    });
    const [gameState, setGameState] = useState<GameState>({
        velocity: 0,
        isJumping: false,
        gravity: 1,
        spriteFrame: 0,
    });
    const [obstacles, setObstacles] = useState<ObstacleType[]>([]);
    const [clouds, setClouds] = useState<CloudType[]>([]);
    const [isGameRunning, setIsGameRunning] = useState(false);
    const [score, setScore] = useState(0);
    const [trigger, setTrigger] = useState(false);
    const [endGameModalVisible, setEndGameModalVisible] = useState(false);

    const { db, curGame } = useContext(DBContext);

    const settings = DIFFICULTY_SETTINGS[difficulty || "Easy"];

    const restartGame = (difficulty: string) => {
        router.replace(`/ostrichhaul?difficulty=${difficulty}`);
        setTrigger(!trigger);
    };

    const handleLoss = () => {
        insertHighScore(db, curGame && curGame.id, score, difficulty);
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
                    if (checkCollision(position, obstacle)) {
                        handleLoss();
                    } else if (position.x.__getValue() > obstacle.x.__getValue() + OBSTACLE_WIDTH) {
                        setScore((prevScore) => prevScore + 1);
                        setObstacles((prevObstacles) => prevObstacles.filter((_, i) => i !== index));
                    }
                });
            }, 1000 / GAME_LOOP_FPS);

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

                const randomSpawnRate = getRandomSpawnRate(settings.minSpawnRate, settings.maxSpawnRate);
                spawnTimeout = setTimeout(spawnObstacle, randomSpawnRate);
            };

            spawnObstacle();

            return () => clearTimeout(spawnTimeout);
        }
    }, [isGameRunning]);

    useEffect(() => {
        if (isGameRunning) {
            let spawnTimeout: NodeJS.Timeout;

            const spawnCloud = () => {
                const newCloud = {
                    key: Math.random().toString(),
                    x: new Animated.Value(screenWidth),
                    y: Math.random() * (CLOUD_MAX_Y - CLOUD_MIN_Y) + CLOUD_MIN_Y,
                    size: Math.random() * (CLOUD_MAX_SIZE - CLOUD_MIN_SIZE) + CLOUD_MIN_SIZE,
                };
                setClouds((prevClouds) => [...prevClouds, newCloud]);

                Animated.timing(newCloud.x, {
                    toValue: -150,
                    duration: settings.cloudSpeed,
                    easing: Easing.linear,
                    useNativeDriver: false,
                }).start(({ finished }) => {
                    if (finished) {
                        setClouds((prevClouds) => prevClouds.filter((cloud) => cloud.key !== newCloud.key));
                    }
                });

                const randomSpawnRate = getRandomSpawnRate(CLOUD_MIN_SPAWN_RATE, CLOUD_MAX_SPAWN_RATE);
                spawnTimeout = setTimeout(spawnCloud, randomSpawnRate);
            };

            spawnCloud();

            return () => clearTimeout(spawnTimeout);
        }
    }, [isGameRunning]);

    useEffect(() => {
        const newGravity = calculateGravity(gameState.isJumping, gameState.velocity, difficulty as string);
        if (gameState.gravity !== newGravity) {
            setGameState((prev) => ({
                ...prev,
                gravity: newGravity,
            }));
        }
    }, [gameState.isJumping, gameState.velocity]);

    useEffect(() => {
        if (isGameRunning) {
            const spriteInterval = setInterval(() => {
                setGameState((prev) => ({
                    ...prev,
                    spriteFrame: (prev.spriteFrame + 1) % OSTRICH_SPRITE_COUNT,
                }));
            }, SPRITE_ANIMATION_INTERVAL);

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
        setClouds([]);
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
            {clouds.map((cloud) => (
                <Cloud key={cloud.key} x={cloud.x} y={cloud.y} size={cloud.size} />
            ))}
            <View style={styles.ground} />
            <TouchableOpacity style={styles.screen} onPress={jump} activeOpacity={1}>
                <Ostrich y={position.y} x={position.x} spriteFrame={gameState.spriteFrame} />
                {obstacles.map((obstacle) => (
                    <Obstacle key={obstacle.key} x={obstacle.x} />
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
