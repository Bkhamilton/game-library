import React, { useState, useEffect, useContext } from "react";
import { StyleSheet, TouchableOpacity } from "react-native";
import { View, Text } from "@/components/Themed";
import { useLocalSearchParams, useRouter } from "expo-router";
import EndGameMessage from "@/components/Modals/EndGameMessage";
import { DBContext } from "@/contexts/DBContext";

export default function ConnectFourGame() {
    const router = useRouter();
    const { difficulty } = useLocalSearchParams();
    const [score, setScore] = useState(0);
    const [isGameRunning, setIsGameRunning] = useState(false);
    const [endGameModalVisible, setEndGameModalVisible] = useState(false);

    const { db, curGame } = useContext(DBContext);

    const startGame = () => {
        setIsGameRunning(true);
        setScore(0);
    };

    const restartGame = (difficulty: string) => {
        router.replace(`/connectfour?difficulty=${difficulty}`);
        setScore(0);
        setIsGameRunning(false);
        setEndGameModalVisible(false);
    };

    const handleLoss = () => {
        setIsGameRunning(false);
        setEndGameModalVisible(true);
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Connect Four</Text>
            <Text style={styles.difficulty}>Difficulty: {difficulty}</Text>
            <Text style={styles.score}>Moves: {score}</Text>
            
            <View style={styles.board}>
                <Text style={styles.placeholder}>Game board will go here</Text>
            </View>

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
        alignItems: "center",
        justifyContent: "center",
        padding: 20,
    },
    title: {
        fontSize: 32,
        fontWeight: "bold",
        marginBottom: 10,
    },
    difficulty: {
        fontSize: 18,
        marginBottom: 10,
    },
    score: {
        fontSize: 24,
        marginBottom: 20,
    },
    board: {
        width: 300,
        height: 300,
        backgroundColor: "#2c3e50",
        borderRadius: 10,
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 20,
    },
    placeholder: {
        fontSize: 16,
        color: "#ecf0f1",
    },
    startButton: {
        backgroundColor: "#33a5ff",
        padding: 15,
        paddingHorizontal: 60,
        borderRadius: 10,
    },
    startText: {
        fontSize: 20,
        color: "#FFF",
        fontWeight: "bold",
    },
});
