import React, { useState, useEffect, useContext } from "react";
import { StyleSheet, TouchableOpacity, Animated, Easing, ImageBackground } from "react-native";
import { Text } from "@/components/Themed";
import { useLocalSearchParams } from "expo-router";
import { useRouter } from "expo-router";
import EndGameMessage from "@/components/Modals/EndGameMessage";
import { DBContext } from "@/contexts/DBContext";
import { insertHighScore } from '@/db/Scores/Scores';
import { Bird } from "./Bird";
import { Pipe } from "./Pipe";
import {
    DIFFICULTY_SETTINGS,
    GRAVITY,
    JUMP_VELOCITY,
    BIRD_SPRITES,
    BACKGROUND_IMAGE,
    MIN_PIPE_HEIGHT,
    SCREEN_HEIGHT,
    SCREEN_WIDTH,
    checkCollision,
    type Pipe as PipeType,
} from "@/utils/GoGoBird";

export default function FlappyBirdGame() {
    const router = useRouter();
    const { difficulty } = useLocalSearchParams();
    const [birdY, setBirdY] = useState(new Animated.Value(300));
    const [velocity, setVelocity] = useState(0);
    const [pipes, setPipes] = useState<PipeType[]>([]);
    const [passedPipes, setPassedPipes] = useState<string[]>([]);
    const [score, setScore] = useState(0);
    const [isGameRunning, setIsGameRunning] = useState(false);
    const [currentFrame, setCurrentFrame] = useState(0);
    const [trigger, setTrigger] = useState(false);
    const [endGameModalVisible, setEndGameModalVisible] = useState(false);

    const { db, curGame } = useContext(DBContext);

    const settings = DIFFICULTY_SETTINGS[difficulty || "Easy"];

    const restartGame = (difficulty: string) => {
        router.push(`/gogobird?difficulty=${difficulty}`);
        setTrigger(!trigger);
        setScore(0);
        setBirdY(new Animated.Value(300));
    };

    const handleLoss = () => {
        insertHighScore(db, curGame && curGame.id, score, difficulty);
        setIsGameRunning(false);
        setEndGameModalVisible(true);        
    }

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
                setVelocity((prevVelocity) => prevVelocity + GRAVITY);
                const newBirdY = birdY.__getValue() + velocity;
                if (newBirdY > SCREEN_HEIGHT - 50) {
                    handleLoss();
                } else {
                    birdY.setValue(newBirdY);
                }
                pipes.forEach((pipe) => {
                    if (!passedPipes.includes(pipe.key) && pipe.x.__getValue() < 100) {
                        setScore((prevScore) => prevScore + 1);
                        setPassedPipes((prevPassedPipes) => [...prevPassedPipes, pipe.key]);
                    }
                    if (checkCollision(birdY, pipe, settings)) {
                        handleLoss();
                    }
                });
            }, 15);

            return () => clearInterval(interval);
        }
    }, [isGameRunning, velocity]);

    useEffect(() => {
        if (isGameRunning) {
            const spawnInterval = setInterval(() => {
                const newPipe: PipeType = {
                    key: Math.random().toString(),
                    x: new Animated.Value(SCREEN_WIDTH),
                    gapTop: Math.max(MIN_PIPE_HEIGHT, Math.random() * (SCREEN_HEIGHT - settings.gapSize - MIN_PIPE_HEIGHT)),
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
        setVelocity(JUMP_VELOCITY);
    };

    return (
        <ImageBackground source={BACKGROUND_IMAGE} style={styles.container} resizeMode="cover">
            <Text style={styles.score}>{score}</Text>
            <TouchableOpacity style={styles.screen} onPress={jump} activeOpacity={1}>
                <Bird y={birdY} currentFrame={currentFrame} />
                {pipes.map((pipe) => (
                    <React.Fragment key={pipe.key}>
                        <Pipe pipe={pipe} gapSize={settings.gapSize} />
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
