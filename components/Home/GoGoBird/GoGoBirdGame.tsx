import React, { useState, useEffect, useContext } from "react";
import { StyleSheet, TouchableOpacity, Animated, Dimensions, Easing, Image, ImageBackground } from "react-native";
import { View, Text } from "@/components/Themed";
import { useLocalSearchParams } from "expo-router";
import { useRouter } from "expo-router";
import EndGameMessage from "@/components/Modals/EndGameMessage";
import { DBContext } from "@/contexts/DBContext";

const DIFFICULTY_SETTINGS = {
    Easy: { obstacleSpeed: 5000, gapSize: 400, spawnRate: 4000 },
    Medium: { obstacleSpeed: 4000, gapSize: 300, spawnRate: 3000 },
    Hard: { obstacleSpeed: 3000, gapSize: 250, spawnRate: 2000 },
};

const BIRD_SPRITES = [
    require("@/assets/images/GoGoBird/frame-1.png"),
    require("@/assets/images/GoGoBird/frame-2.png"),
    require("@/assets/images/GoGoBird/frame-3.png"),
    require("@/assets/images/GoGoBird/frame-4.png"),
    require("@/assets/images/GoGoBird/frame-5.png"),
    require("@/assets/images/GoGoBird/frame-6.png"),
    require("@/assets/images/GoGoBird/frame-7.png"),
    require("@/assets/images/GoGoBird/frame-8.png"),
];

const BACKGROUND_IMAGE = require("@/assets/images/GoGoBird/bg.png");
const PIPE_IMAGE = require("@/assets/images/GoGoBird/pipe.png");
const PIPE_BASE_IMAGE = require("@/assets/images/GoGoBird/pipeBase.png");

type Difficulty = "easy" | "medium" | "hard";

export default function FlappyBirdGame() {
    const router = useRouter();
    const { difficulty } = useLocalSearchParams();
    const [birdY, setBirdY] = useState(new Animated.Value(300));
    const [velocity, setVelocity] = useState(0); // New state for velocity
    const [pipes, setPipes] = useState([]);
    const [passedPipes, setPassedPipes] = useState([]); // New state for passed pipes
    const [score, setScore] = useState(0);
    const [isGameRunning, setIsGameRunning] = useState(false);
    const [currentFrame, setCurrentFrame] = useState(0);
    const [trigger, setTrigger] = useState(false);
    const [endGameModalVisible, setEndGameModalVisible] = useState(false);

    const { games } = useContext(DBContext);
    const curGame = games.find((game) => game.title === "GoGoBird");

    const settings = DIFFICULTY_SETTINGS[difficulty || "Easy"];
    const gravity = 2; // Adjusted gravity for smoother experience
    const jumpVelocity = -20; // Adjusted jump velocity
    const screenHeight = Dimensions.get("window").height;
    const screenWidth = Dimensions.get("window").width;
    const birdWidth = 50;
    const birdHeight = 50;
    const minPipeHeight = 50;

    const restartGame = (difficulty: string) => {
        router.push(`/gogobird?difficulty=${difficulty}`);
        setTrigger(!trigger);
        setScore(0);
        setBirdY(new Animated.Value(300));
    };

    const checkCollision = (pipe) => {
        const birdTop = birdY.__getValue();
        const birdBottom = birdTop + birdHeight;
        const pipeLeft = pipe.x.__getValue();
        const pipeRight = pipeLeft + 50; // Pipe width
        const pipeTop = pipe.gapTop;
        const pipeBottom = pipe.gapTop + settings.gapSize;

        // Add small collision tolerance
        const collisionTolerance = 5;

        if ((birdTop + collisionTolerance < pipeTop || birdBottom - collisionTolerance > pipeBottom) && pipeLeft < 150 && pipeRight > 100) {
            return true;
        }
        return false;
    };

    useEffect(() => {
        if (isGameRunning) {
            const spriteInterval = setInterval(() => {
                setCurrentFrame((prevFrame) => (prevFrame + 1) % BIRD_SPRITES.length);
            }, 100); // Change sprite every 100ms

            return () => clearInterval(spriteInterval);
        }
    }, [isGameRunning]);

    useEffect(() => {
        if (isGameRunning) {
            const interval = setInterval(() => {
                setVelocity((prevVelocity) => prevVelocity + gravity);
                const newBirdY = birdY.__getValue() + velocity;
                if (newBirdY > screenHeight - 50) {
                    // 50 is the bird's height
                    setIsGameRunning(false);
                } else {
                    birdY.setValue(newBirdY);
                }
                // Check if the bird has passed any pipes
                pipes.forEach((pipe) => {
                    if (!passedPipes.includes(pipe.key) && pipe.x.__getValue() < 100) {
                        setScore((prevScore) => prevScore + 1);
                        setPassedPipes((prevPassedPipes) => [...prevPassedPipes, pipe.key]);
                    }
                    // Check for collision
                    if (checkCollision(pipe)) {
                        setIsGameRunning(false);
                        setEndGameModalVisible(true);
                    }
                });
            }, 15);

            return () => clearInterval(interval);
        }
    }, [isGameRunning, velocity]);

    useEffect(() => {
        if (isGameRunning) {
            const spawnInterval = setInterval(() => {
                const newPipe = {
                    key: Math.random().toString(),
                    x: new Animated.Value(screenWidth),
                    gapTop: Math.max(minPipeHeight, Math.random() * (screenHeight - settings.gapSize - minPipeHeight)),
                };
                setPipes((prevPipes) => [...prevPipes, newPipe]);

                Animated.timing(newPipe.x, {
                    toValue: -50,
                    duration: settings.obstacleSpeed,
                    easing: Easing.linear,
                    useNativeDriver: false,
                }).start(({ finished }) => {
                    if (finished) {
                        setPipes((prevPipes) => prevPipes.filter((pipe) => pipe.key !== newPipe.key));
                    }
                });
            }, settings.spawnRate);

            return () => clearInterval(spawnInterval);
        }
    }, [isGameRunning]);

    const startGame = () => {
        setIsGameRunning(true);
        setScore(0);
        setBirdY(new Animated.Value(300));
        setVelocity(0); // Reset velocity
        setPipes([]);
        setPassedPipes([]);
    };

    const jump = () => {
        setVelocity(jumpVelocity); // Set velocity to jump velocity
    };

    return (
        <ImageBackground source={BACKGROUND_IMAGE} style={styles.container} resizeMode="cover">
            <Text style={styles.score}>{score}</Text>
            <TouchableOpacity style={styles.screen} onPress={jump} activeOpacity={1}>
                <Animated.View style={[styles.bird, { top: birdY }]}>
                    <Image source={BIRD_SPRITES[currentFrame]} style={styles.birdImage} />
                </Animated.View>
                {pipes.map((pipe) => (
                    <React.Fragment key={pipe.key}>
                        {/* Top pipe */}
                        <Animated.View
                            style={[
                                styles.pipeContainer,
                                {
                                    left: pipe.x,
                                    height: pipe.gapTop,
                                    top: -10,
                                },
                            ]}
                        >
                            <Image
                                source={PIPE_BASE_IMAGE}
                                style={[
                                    styles.pipeBase,
                                    {
                                        height: Math.max(0, pipe.gapTop - 48), // Adjusted to match pipe head
                                        transform: [{ rotate: "180deg" }],
                                    },
                                ]}
                            />
                            <Image
                                source={PIPE_IMAGE}
                                style={[
                                    styles.pipeHead,
                                    {
                                        transform: [{ rotate: "180deg" }],
                                        marginBottom: -1, // Remove gap between head and base
                                    },
                                ]}
                            />
                        </Animated.View>

                        {/* Bottom pipe */}
                        <Animated.View
                            style={[
                                styles.pipeContainer,
                                {
                                    left: pipe.x,
                                    height: screenHeight - pipe.gapTop - settings.gapSize + 1, // Extend slightly
                                    top: pipe.gapTop + settings.gapSize,
                                },
                            ]}
                        >
                            <Image source={PIPE_IMAGE} style={[styles.pipeHead]} />
                            <Image
                                source={PIPE_BASE_IMAGE}
                                style={[
                                    styles.pipeBase,
                                    {
                                        height: "100%",
                                    },
                                ]}
                            />
                        </Animated.View>
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
        </ImageBackground>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
        height: "100%",
    },
    screen: {
        flex: 1,
        width: "100%",
        position: "relative",
    },
    bird: {
        width: 50,
        height: 50,
        position: "absolute",
        left: 100,
        alignItems: "center",
    },
    birdImage: {
        width: "150%",
        height: "150%",
        resizeMode: "contain",
    },
    pipeContainer: {
        position: "absolute",
        width: 52, // Slightly wider to prevent edge gaps
        alignItems: "center",
    },
    pipeHead: {
        width: 52, // Slightly wider to prevent edge gaps
        height: 50,
        resizeMode: "stretch",
    },
    pipeBase: {
        width: 52, // Slightly wider to prevent edge gaps
        resizeMode: "stretch",
    },
    obstacle: {
        position: "absolute",
        width: 50,
        backgroundColor: "red",
    },
    startButton: {
        backgroundColor: "#33a5ff",
        padding: "5%",
        paddingHorizontal: "25%",
        borderRadius: 10,
        marginBottom: "15%",
    },
    startText: {
        fontSize: 20,
        color: "#FFF",
        fontWeight: "bold",
    },
    score: {
        position: "absolute",
        top: 50,
        fontSize: 64,
        fontWeight: "bold",
        color: "#FFF",
    },
});
