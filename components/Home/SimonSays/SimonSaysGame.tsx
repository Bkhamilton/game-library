import React, { useState, useEffect, useContext, useRef } from "react";
import { StyleSheet, TouchableOpacity } from "react-native";
import { View, Text } from "@/components/Themed";
import { useLocalSearchParams, useRouter } from "expo-router";
import EndGameMessage from "@/components/Modals/EndGameMessage";
import { DBContext } from "@/contexts/DBContext";
import ColorTile from "./ColorTile";
import { 
    getDifficultySettings, 
    getTileColors, 
    addToSequence, 
    calculatePlaybackSpeed,
    checkPartialSequence,
    TileColor 
} from "@/utils/SimonSaysGenerator";

type GameState = 'idle' | 'showing' | 'input' | 'gameover';

export default function SimonSaysGame() {
    const router = useRouter();
    const { difficulty } = useLocalSearchParams();
    const [round, setRound] = useState(0);
    const [isGameRunning, setIsGameRunning] = useState(false);
    const [endGameModalVisible, setEndGameModalVisible] = useState(false);
    const [gameState, setGameState] = useState<GameState>('idle');
    const [sequence, setSequence] = useState<number[]>([]);
    const [userSequence, setUserSequence] = useState<number[]>([]);
    const [activeTile, setActiveTile] = useState<number | null>(null);
    const [message, setMessage] = useState<string>("Press Start to begin");

    const { db, curGame } = useContext(DBContext);
    const settings = getDifficultySettings(difficulty as string);
    const tileColors = getTileColors(difficulty as string);
    const playbackTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        // Clean up timeouts on unmount
        return () => {
            if (playbackTimeoutRef.current) {
                clearTimeout(playbackTimeoutRef.current);
            }
        };
    }, []);

    useEffect(() => {
        if (isGameRunning && gameState === 'idle') {
            startNewRound();
        }
    }, [isGameRunning, gameState]);

    const startGame = () => {
        setIsGameRunning(true);
        setRound(0);
        setSequence([]);
        setUserSequence([]);
        setGameState('idle');
        setMessage("Watch the sequence...");
    };

    const startNewRound = () => {
        const newRound = round + 1;
        setRound(newRound);
        setUserSequence([]);
        
        // Add a new tile to the sequence
        const newSequence = addToSequence(sequence, settings.tileCount);
        setSequence(newSequence);
        
        // Show the sequence
        setGameState('showing');
        playSequence(newSequence, newRound);
    };

    const playSequence = (seq: number[], currentRound: number) => {
        setMessage(`Round ${currentRound} - Watch carefully!`);
        const speed = calculatePlaybackSpeed(currentRound, settings);
        const flashDuration = speed * 0.6; // Flash for 60% of the interval
        const pauseDuration = speed * 0.4; // Pause for 40% of the interval

        let currentIndex = 0;

        const playNext = () => {
            if (currentIndex >= seq.length) {
                // Sequence finished, now wait for user input
                setGameState('input');
                setMessage(`Your turn! Repeat the sequence.`);
                return;
            }

            const tileIndex = seq[currentIndex];
            
            // Flash the tile
            setActiveTile(tileIndex);
            
            playbackTimeoutRef.current = setTimeout(() => {
                setActiveTile(null);
                
                // Pause before next tile
                playbackTimeoutRef.current = setTimeout(() => {
                    currentIndex++;
                    playNext();
                }, pauseDuration);
            }, flashDuration);
        };

        playNext();
    };

    const handleTilePress = (tileIndex: number) => {
        if (gameState !== 'input') return;

        const newUserSequence = [...userSequence, tileIndex];
        setUserSequence(newUserSequence);

        // Flash the tile briefly
        setActiveTile(tileIndex);
        setTimeout(() => setActiveTile(null), 200);

        // Check if the partial sequence is correct
        if (!checkPartialSequence(newUserSequence, sequence)) {
            // Wrong tile pressed
            handleLoss();
            return;
        }

        // Check if the user has completed the sequence
        if (newUserSequence.length === sequence.length) {
            // Correct! Move to next round
            setMessage("Correct! Get ready for the next round...");
            setTimeout(() => {
                setGameState('idle');
            }, 1000);
        }
    };

    const restartGame = (difficulty: string) => {
        router.replace(`/simonsays?difficulty=${difficulty}`);
        setRound(0);
        setSequence([]);
        setUserSequence([]);
        setIsGameRunning(false);
        setEndGameModalVisible(false);
        setGameState('idle');
        setMessage("Press Start to begin");
    };

    const handleLoss = () => {
        setIsGameRunning(false);
        setGameState('gameover');
        setMessage("Game Over!");
        setEndGameModalVisible(true);
    };

    const renderTiles = () => {
        const { rows, cols } = settings.gridLayout;
        const tileSize = Math.min(300 / cols, 300 / rows) - 10;

        const tiles: JSX.Element[] = [];
        for (let i = 0; i < tileColors.length; i++) {
            tiles.push(
                <ColorTile
                    key={i}
                    color={tileColors[i]}
                    isActive={activeTile === i}
                    onPress={() => handleTilePress(i)}
                    disabled={gameState !== 'input'}
                    size={tileSize}
                />
            );
        }

        return tiles;
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Simon Says</Text>
            <Text style={styles.difficulty}>Difficulty: {difficulty}</Text>
            <Text style={styles.score}>Round: {round}</Text>
            <Text style={styles.message}>{message}</Text>
            
            <View style={[
                styles.board,
                {
                    flexDirection: 'row',
                    flexWrap: 'wrap',
                    width: 300,
                    height: 300,
                }
            ]}>
                {isGameRunning ? renderTiles() : (
                    <Text style={styles.placeholder}>Game board will appear here</Text>
                )}
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
    message: {
        fontSize: 18,
        marginBottom: 15,
        fontWeight: "600",
        textAlign: "center",
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
