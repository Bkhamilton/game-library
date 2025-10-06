import React, { useState, useEffect, useContext, useCallback } from "react";
import { StyleSheet } from "react-native";
import { View, Text } from "@/components/Themed";
import { useLocalSearchParams, useRouter } from "expo-router";
import EndGameMessage from "@/components/Modals/EndGameMessage";
import { DBContext } from "@/contexts/DBContext";
import { GestureHandlerRootView, GestureDetector, Gesture } from 'react-native-gesture-handler';
import Animated from 'react-native-reanimated';
import TwoZeroFourEightBoard from "./TwoZeroFourEightBoard";
import TwoZeroFourEightHeader from "./TwoZeroFourEightHeader";
import { 
    initializeBoardWithTiles, 
    move, 
    addRandomTile, 
    canMove, 
    hasWon,
    Board 
} from "@/utils/TwoZeroFourEightGenerator";
import { insertHighScore, insertWin, insertLoss, insertTimeScore } from "@/db/Scores/Scores";
import { getHighScoreByGame } from "@/db/Scores/Results";

export default function TwoZeroFourEightGame() {
    const router = useRouter();
    const { difficulty } = useLocalSearchParams();
    const [board, setBoard] = useState<Board>([]);
    const [score, setScore] = useState(0);
    const [highScore, setHighScore] = useState(0);
    const [endGameModalVisible, setEndGameModalVisible] = useState(false);
    const [gameWon, setGameWon] = useState(false);
    const [gameTime, setGameTime] = useState(0);

    const { db, curGame } = useContext(DBContext);

    const handleTimeUpdate = useCallback((seconds: number) => {
        setGameTime(seconds);
    }, []);

    // Load high score
    useEffect(() => {
        const loadHighScore = async () => {
            if (db && curGame) {
                const scores = await getHighScoreByGame(db, curGame.id);
                if (scores && scores.length > 0) {
                    setHighScore(scores[0].score);
                }
            }
        };
        loadHighScore();
    }, [db, curGame]);

    // Initialize game on mount (auto-start)
    useEffect(() => {
        const initialBoard = initializeBoardWithTiles();
        setBoard(initialBoard);
        setScore(0);
    }, [difficulty]);

    const handleMove = (direction: 'up' | 'down' | 'left' | 'right') => {
        const { board: newBoard, moved, scoreGained } = move(board, direction);
        
        if (!moved) return;
        
        const boardWithNewTile = addRandomTile(newBoard);
        setBoard(boardWithNewTile);
        
        const newScore = score + scoreGained;
        setScore(newScore);
        
        // Check for win
        if (hasWon(boardWithNewTile) && !gameWon) {
            setGameWon(true);
            handleWin(newScore);
        }
        
        // Check for loss
        if (!canMove(boardWithNewTile)) {
            handleLoss(newScore);
        }
    };

    const handleWin = (finalScore: number) => {
        if (db && curGame) {
            insertWin(db, curGame.id, String(difficulty || 'Easy'));
            insertHighScore(db, curGame.id, finalScore, String(difficulty || 'Easy'));
            insertTimeScore(db, curGame.id, gameTime, String(difficulty || 'Easy'));
        }
        setEndGameModalVisible(true);
    };

    const handleLoss = (finalScore: number) => {
        if (db && curGame) {
            insertLoss(db, curGame.id, String(difficulty || 'Easy'));
            insertHighScore(db, curGame.id, finalScore, String(difficulty || 'Easy'));
        }
        setEndGameModalVisible(true);
    };

    const restartGame = (difficulty: string) => {
        router.replace(`/2048?difficulty=${difficulty}`);
    };

    // Swipe gesture handler
    const gesture = Gesture.Pan()
        .onEnd((e) => {
            console.log(e);
            const { translationX, translationY } = e;
            const absX = Math.abs(translationX);
            const absY = Math.abs(translationY);
            
            if (absX > absY) {
                if (translationX > 0) {
                    console.log("Swipe Right");
                    handleMove('right');
                } else {
                    console.log("Swipe Left");
                    handleMove('left');
                }
            } else {
                if (translationY > 0) {
                    console.log("Swipe Down");
                    handleMove('down');
                } else {
                    console.log("Swipe Up");
                    handleMove('up');
                }
            }
        });

    return (
        <GestureHandlerRootView style={styles.gestureContainer}>
            <View style={styles.container}>
                <TwoZeroFourEightHeader 
                    highScore={highScore}
                    onTimeUpdate={handleTimeUpdate}
                />
                
                <Text style={styles.score}>Score: {score}</Text>
                
                <Text style={styles.instructions}>Swipe to move tiles</Text>
                
                <GestureDetector gesture={gesture}>
                    <Animated.View>
                        <TwoZeroFourEightBoard board={board} />
                    </Animated.View>
                </GestureDetector>

                <EndGameMessage
                    visible={endGameModalVisible}
                    close={() => setEndGameModalVisible(false)}
                    win={gameWon}
                    game={curGame}
                    initialDifficulty={difficulty}
                    restartGame={restartGame}
                />
            </View>
        </GestureHandlerRootView>
    );
}

const styles = StyleSheet.create({
    gestureContainer: {
        flex: 1,
    },
    container: {
        flex: 1,
        alignItems: "center",
        paddingTop: 24,
    },
    score: {
        fontSize: 28,
        fontWeight: "bold",
        marginBottom: 10,
        marginTop: 10,
    },
    instructions: {
        fontSize: 14,
        opacity: 0.6,
        marginBottom: 20,
    },
});
