import React, { useState, useEffect, useContext, useCallback } from "react";
import { StyleSheet } from "react-native";
import { View, Text } from "@/components/Themed";
import { useLocalSearchParams, useRouter } from "expo-router";
import EndGameMessage from "@/components/Modals/EndGameMessage";
import { DBContext } from "@/contexts/DBContext";
import ConnectFourBoard from "@/components/Home/ConnectFour/ConnectFourBoard";
import ConnectFourHeader from "@/components/Home/ConnectFour/ConnectFourHeader";
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
    const [countdown, setCountdown] = useState<number | null>(3);
    const [endGameModalVisible, setEndGameModalVisible] = useState(false);
    const [board, setBoard] = useState<Board>(initializeBoard());
    const [currentPlayer, setCurrentPlayer] = useState<Player>('player');
    const [gameResult, setGameResult] = useState<boolean>(false);
    const [gameTime, setGameTime] = useState(0);

    const { db, curGame } = useContext(DBContext);

    const handleTimeUpdate = useCallback((seconds: number) => {
        setGameTime(seconds);
    }, []);

    // Countdown effect - starts automatically when component mounts
    useEffect(() => {
        if (countdown === null) return;

        if (countdown > 0) {
            const timer = setTimeout(() => {
                setCountdown(countdown - 1);
            }, 1000);
            return () => clearTimeout(timer);
        } else {
            // Countdown finished, start the game
            setCountdown(null);
            setIsGameRunning(true);
        }
    }, [countdown]);

    const restartGame = (difficulty: string) => {
        router.replace(`/connectfour?difficulty=${difficulty}`);
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
            <ConnectFourHeader 
                score={score}
                onTimeUpdate={handleTimeUpdate}
                timerActive={isGameRunning}
            />
            
            {countdown !== null && (
                <View style={styles.countdownContainer}>
                    <Text style={styles.countdownText}>{countdown}</Text>
                </View>
            )}
            
            <ConnectFourBoard 
                board={board}
                onColumnPress={handleColumnPress}
                isGameRunning={isGameRunning}
            />

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
        alignItems: 'center',
        paddingTop: 24,
    },
    countdownContainer: {
        position: 'absolute',
        top: '40%',
        left: 0,
        right: 0,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 10,
    },
    countdownText: {
        fontSize: 100,
        fontWeight: 'bold',
        opacity: 0.8,
    },
});
