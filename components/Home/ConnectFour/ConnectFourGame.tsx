import React, { useState, useEffect, useContext } from "react";
import { StyleSheet, TouchableOpacity } from "react-native";
import { View, Text } from "@/components/Themed";
import { useLocalSearchParams, useRouter } from "expo-router";
import EndGameMessage from "@/components/Modals/EndGameMessage";
import { DBContext } from "@/contexts/DBContext";
import ConnectFourBoard from "@/components/Home/ConnectFour/ConnectFourBoard";
import { 
    initializeBoard, 
    placeDisc, 
    checkWinner, 
    isDraw,
    Board,
    Player 
} from "@/utils/ConnectFourGenerator";

export default function ConnectFourGame() {
    const router = useRouter();
    const { difficulty } = useLocalSearchParams();
    const [score, setScore] = useState(0);
    const [isGameRunning, setIsGameRunning] = useState(false);
    const [endGameModalVisible, setEndGameModalVisible] = useState(false);
    const [board, setBoard] = useState<Board>(initializeBoard());
    const [currentPlayer, setCurrentPlayer] = useState<Player>('player');
    const [gameResult, setGameResult] = useState<boolean>(false);

    const { db, curGame } = useContext(DBContext);

    const startGame = () => {
        setIsGameRunning(true);
        setScore(0);
        setBoard(initializeBoard());
        setCurrentPlayer('player');
    };

    const restartGame = (difficulty: string) => {
        router.replace(`/connectfour?difficulty=${difficulty}`);
        setScore(0);
        setIsGameRunning(false);
        setEndGameModalVisible(false);
        setBoard(initializeBoard());
        setCurrentPlayer('player');
    };

    const handleWin = () => {
        setIsGameRunning(false);
        setGameResult(true);
        setEndGameModalVisible(true);
    };

    const handleLoss = () => {
        setIsGameRunning(false);
        setGameResult(false);
        setEndGameModalVisible(true);
    };

    const handleColumnPress = (col: number) => {
        if (!isGameRunning || currentPlayer !== 'player') return;

        const newBoard = placeDisc(board, col, 'player');
        
        // Invalid move (column full)
        if (!newBoard) return;

        setBoard(newBoard);
        setScore(score + 1);

        // Check for winner
        const winner = checkWinner(newBoard);
        if (winner === 'player') {
            handleWin();
            return;
        }

        // Check for draw
        if (isDraw(newBoard)) {
            handleLoss();
            return;
        }

        // Switch to AI turn (placeholder - AI not implemented yet)
        setCurrentPlayer('ai');
        
        // For now, immediately switch back to player
        // In the future, this is where AI logic will go
        setTimeout(() => {
            setCurrentPlayer('player');
        }, 500);
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Connect Four</Text>
            <Text style={styles.difficulty}>Difficulty: {difficulty}</Text>
            <Text style={styles.score}>Moves: {score}</Text>
            <Text style={styles.turn}>
                {isGameRunning ? (currentPlayer === 'player' ? 'Your Turn' : 'AI Turn') : 'Press Start to Play'}
            </Text>
            
            <ConnectFourBoard 
                board={board}
                onColumnPress={handleColumnPress}
                isGameRunning={isGameRunning}
            />

            {!isGameRunning && (
                <TouchableOpacity style={styles.startButton} onPress={startGame}>
                    <Text style={styles.startText}>Start</Text>
                </TouchableOpacity>
            )}

            <EndGameMessage
                visible={endGameModalVisible}
                close={() => setEndGameModalVisible(false)}
                win={gameResult}
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
        marginBottom: 10,
    },
    turn: {
        fontSize: 18,
        marginBottom: 20,
        fontWeight: '600',
    },
    startButton: {
        backgroundColor: "#33a5ff",
        padding: 15,
        paddingHorizontal: 60,
        borderRadius: 10,
        marginTop: 20,
    },
    startText: {
        fontSize: 20,
        color: "#FFF",
        fontWeight: "bold",
    },
});
