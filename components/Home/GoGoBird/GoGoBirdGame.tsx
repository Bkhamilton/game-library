import React, { useState, useEffect } from "react";
import { StyleSheet, TouchableOpacity, Animated, Dimensions, Easing, Image, ImageBackground } from "react-native";
import { View, Text } from "@/components/Themed";
import { useLocalSearchParams } from "expo-router";

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

type Difficulty = "easy" | "medium" | "hard";

export default function FlappyBirdGame() {
    const { difficulty } = useLocalSearchParams();
    const [birdY, setBirdY] = useState(new Animated.Value(300));
    const [velocity, setVelocity] = useState(0); // New state for velocity
    const [pipes, setPipes] = useState([]);
    const [passedPipes, setPassedPipes] = useState([]); // New state for passed pipes
    const [score, setScore] = useState(0);
    const [isGameRunning, setIsGameRunning] = useState(false);
    const [currentFrame, setCurrentFrame] = useState(0);

    const settings = DIFFICULTY_SETTINGS[difficulty || "Easy"];
    const gravity = 2; // Adjusted gravity for smoother experience
    const jumpVelocity = -20; // Adjusted jump velocity
    const screenHeight = Dimensions.get("window").height;
    const screenWidth = Dimensions.get("window").width;
    const birdWidth = 50;
    const birdHeight = 50;
    const minPipeHeight = 50;

    const checkCollision = (pipe) => {
        const birdTop = birdY.__getValue();
        const birdBottom = birdTop + birdHeight;
        const pipeLeft = pipe.x.__getValue();
        const pipeRight = pipeLeft + 50; // Pipe width
        const pipeTop = pipe.gapTop;
        const pipeBottom = pipe.gapTop + settings.gapSize;

        if (
            (birdTop < pipeTop || birdBottom > pipeBottom) &&
            pipeLeft < 150 && // Bird's left position + width
            pipeRight > 100 // Bird's left position
        ) {
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
            <Text style={styles.score}>Score: {score}</Text>
            <TouchableOpacity style={styles.screen} onPress={jump} activeOpacity={1}>
                <Animated.View style={[styles.bird, { top: birdY }]}>
                    <Image source={BIRD_SPRITES[currentFrame]} style={styles.birdImage} />
                </Animated.View>
                {pipes.map((pipe) => (
                    <React.Fragment key={pipe.key}>
                        <Animated.View
                            style={[
                                styles.obstacle,
                                {
                                    left: pipe.x,
                                    height: pipe.gapTop,
                                    top: 0,
                                },
                            ]}
                        />
                        <Animated.View
                            style={[
                                styles.obstacle,
                                {
                                    left: pipe.x,
                                    height: screenHeight - pipe.gapTop - settings.gapSize,
                                    top: pipe.gapTop + settings.gapSize,
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
    obstacle: {
        position: "absolute",
        width: 50,
        backgroundColor: "red",
    },
    startButton: {
        backgroundColor: "#4CAF50",
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
        fontSize: 24,
        fontWeight: "bold",
        color: "#FFF",
    },
});
