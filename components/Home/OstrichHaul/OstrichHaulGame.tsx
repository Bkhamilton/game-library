import React, { useState, useEffect } from "react";
import { StyleSheet, TouchableOpacity, Animated, Dimensions, Easing, Image, View, Text } from "react-native";
import { useLocalSearchParams } from "expo-router";

// Import the sprite image
import ostrichSprite from "@/assets/images/ostrichHaul/ostrichSprite.png";
import spikeSprite from "@/assets/images/ostrichHaul/spike.png";
import { getRootURL } from "expo-router/build/link/linking";

const DIFFICULTY_SETTINGS = {
    Easy: { obstacleSpeed: 2000, minSpawnRate: 1500, maxSpawnRate: 2500 },
    Medium: { obstacleSpeed: 1500, minSpawnRate: 1000, maxSpawnRate: 2000 },
    Hard: { obstacleSpeed: 1000, minSpawnRate: 1000, maxSpawnRate: 1500 },
};

const screenWidth = Dimensions.get("window").width;
const screenHeight = Dimensions.get("window").height;
const groundLevel = screenHeight - 250;
const jumpVelocity = -15;

export default function OstrichHaulGame() {
    const { difficulty } = useLocalSearchParams();
    const [ostrichY, setOstrichY] = useState(new Animated.Value(groundLevel - 10));
    const [ostrichX, setOstrichX] = useState(new Animated.Value(15));
    const [velocity, setVelocity] = useState(0);
    const [obstacles, setObstacles] = useState([]);
    const [isGameRunning, setIsGameRunning] = useState(false);
    const [score, setScore] = useState(0);
    const [isJumping, setIsJumping] = useState(false);
    const [gravity, setGravity] = useState(1);
    const [spriteFrame, setSpriteFrame] = useState(0);

    const settings = DIFFICULTY_SETTINGS[difficulty || "Easy"];

    const checkCollision = (obstacle) => {
        const ostrichTop = ostrichY.__getValue();
        const ostrichBottom = ostrichTop + 50;
        const ostrichLeft = ostrichX.__getValue();
        const ostrichRight = ostrichLeft + 50;
        const obstacleLeft = obstacle.x.__getValue();
        const obstacleRight = obstacleLeft + 50;
        const obstacleTop = obstacle.gapTop;
        const obstacleBottom = groundLevel;

        if (ostrichRight > obstacleLeft && ostrichLeft < obstacleRight && (ostrichTop < obstacleTop || ostrichBottom > obstacleBottom)) {
            return true;
        }
        return false;
    };

    useEffect(() => {
        if (isGameRunning) {
            const gameLoop = setInterval(() => {
                setVelocity((prevVelocity) => prevVelocity + gravity);
                setOstrichY((prevOstrichY) => {
                    const newY = prevOstrichY.__getValue() + velocity;
                    if (newY >= groundLevel) {
                        setVelocity(0);
                        setIsJumping(false);
                        return new Animated.Value(groundLevel);
                    }
                    return new Animated.Value(Math.max(newY, 0));
                });

                obstacles.forEach((obstacle, index) => {
                    if (checkCollision(obstacle)) {
                        setIsGameRunning(false);
                    } else if (ostrichX.__getValue() > obstacle.x.__getValue() + 50) {
                        setScore((prevScore) => prevScore + 1);
                        setObstacles((prevObstacles) => prevObstacles.filter((_, i) => i !== index));
                    }
                });
            }, 1000 / 120);

            return () => clearInterval(gameLoop);
        }
    }, [isGameRunning, velocity, obstacles]);

    useEffect(() => {
        if (isGameRunning) {
            let spawnTimeout;

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
        if (isJumping && velocity > -5 && velocity < 5) {
            if (difficulty === "Hard") {
                setGravity(0.6);
            } else {
                setGravity(0.2);
            }
        } else {
            setGravity(1);
        }
    }, [isJumping, velocity]);

    useEffect(() => {
        if (isGameRunning) {
            const spriteAnimation = setInterval(() => {
                setSpriteFrame((prevFrame) => {
                    const newFrame = (prevFrame + 1) % 3; // Loop through 3 frames
                    return newFrame;
                });
            }, 100); // Adjust the frame rate as needed

            return () => clearInterval(spriteAnimation);
        }
    }, [isGameRunning]);

    const startGame = () => {
        setIsGameRunning(true);
        setOstrichY(new Animated.Value(groundLevel - 10));
        setVelocity(0);
        setObstacles([]);
        setScore(0);
        setIsJumping(false);
    };

    const jump = () => {
        if (!isJumping) {
            setVelocity(jumpVelocity);
            setIsJumping(true);
        }
    };

    const spriteOffset = spriteFrame;

    return (
        <View style={styles.container}>
            <Text style={styles.score}>{score}</Text>
            <View style={styles.sky} />
            <View style={styles.ground} />
            <TouchableOpacity style={styles.screen} onPress={jump} activeOpacity={1}>
                <View style={{ width: 48, height: 57, position: "absolute", overflow: "hidden", top: ostrichY.__getValue(), left: ostrichX.__getValue() }}>
                    <Animated.Image
                        source={ostrichSprite}
                        style={[
                            styles.ostrich,
                            {
                                width: 144, // Width of a single frame
                                height: 57, // Height of a single frame

                                transform: [
                                    { translateX: -spriteFrame * 48 }, // Shift to show the correct frame
                                ],
                            },
                        ]}
                    />
                </View>
                {obstacles.map((obstacle) => (
                    <React.Fragment key={obstacle.key}>
                        <Animated.Image
                            source={spikeSprite}
                            style={[
                                styles.obstacle,
                                {
                                    left: obstacle.x,
                                    height: 55,
                                    top: groundLevel - 5,
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
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#87CEEB",
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
        height: "100%",
    },
    sky: {
        position: "absolute",
        width: "100%",
        height: "70%",
        backgroundColor: "#87CEEB",
    },
    ground: {
        position: "absolute",
        width: "100%",
        top: screenHeight - 200,
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
        width: 144,
        height: 557,
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
