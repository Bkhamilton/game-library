import React, { useState, useEffect, useContext, useCallback } from "react";
import { StyleSheet, TouchableOpacity } from "react-native";
import { View, Text } from "@/components/Themed";
import { useLocalSearchParams, useRouter } from "expo-router";
import EndGameMessage from "@/components/Modals/EndGameMessage";
import { DBContext } from "@/contexts/DBContext";
import { MaterialIcons } from '@expo/vector-icons';
import TwoZeroFourEightBoard from "./TwoZeroFourEightBoard";
import TwoZeroFourEightHeader from "./TwoZeroFourEightHeader";
import useTheme from "@/hooks/useTheme";
import { 
    initializeBoardWithTiles, 
    move, 
    addRandomTile, 
    canMove, 
    hasWon,
    Board,
    Difficulty
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
    const { primary, text } = useTheme();

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
        const initialBoard = initializeBoardWithTiles(difficulty as Difficulty);
        setBoard(initialBoard);
        setScore(0);
    }, [difficulty]);

    const handleMove = (direction: 'up' | 'down' | 'left' | 'right') => {
        const { board: newBoard, moved, scoreGained } = move(board, direction);
        
        if (!moved) return;
        
        const boardWithNewTile = addRandomTile(newBoard, difficulty as Difficulty);
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

    return (
        <View style={styles.container}>
            <TwoZeroFourEightHeader 
                highScore={highScore}
                onTimeUpdate={handleTimeUpdate}
            />
            
            <Text style={styles.score}>Score: {score}</Text>
            
            <Text style={styles.instructions}>Tap arrows to move tiles</Text>
            
            <TwoZeroFourEightBoard board={board} />
            
            {/* Directional Controls */}
            <View style={styles.controlsContainer}>
                {/* Up Button */}
                <View style={styles.topRow}>
                    <TouchableOpacity 
                        style={[styles.arrowButton, { backgroundColor: primary }]}
                        onPress={() => handleMove('up')}
                        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                    >
                        <MaterialIcons name="arrow-upward" size={32} color={text} />
                    </TouchableOpacity>
                </View>
                
                {/* Left, Down, Right Buttons */}
                <View style={styles.bottomRow}>
                    <TouchableOpacity 
                        style={[styles.arrowButton, { backgroundColor: primary }]}
                        onPress={() => handleMove('left')}
                        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                    >
                        <MaterialIcons name="arrow-back" size={32} color={text} />
                    </TouchableOpacity>
                    
                    <TouchableOpacity 
                        style={[styles.arrowButton, { backgroundColor: primary }]}
                        onPress={() => handleMove('down')}
                        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                    >
                        <MaterialIcons name="arrow-downward" size={32} color={text} />
                    </TouchableOpacity>
                    
                    <TouchableOpacity 
                        style={[styles.arrowButton, { backgroundColor: primary }]}
                        onPress={() => handleMove('right')}
                        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                    >
                        <MaterialIcons name="arrow-forward" size={32} color={text} />
                    </TouchableOpacity>
                </View>
            </View>

            <EndGameMessage
                visible={endGameModalVisible}
                close={() => setEndGameModalVisible(false)}
                win={gameWon}
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
    controlsContainer: {
        marginTop: 30,
        alignItems: 'center',
    },
    topRow: {
        marginBottom: 8,
    },
    bottomRow: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 8,
    },
    arrowButton: {
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        borderRadius: 12,
        minWidth: 80,
        minHeight: 80,
    },
});
