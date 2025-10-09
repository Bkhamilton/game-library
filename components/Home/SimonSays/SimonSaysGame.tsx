import React, { useState, useEffect, useContext, useRef } from "react";
import { StyleSheet, TouchableOpacity } from "react-native";
import { View, Text } from "@/components/Themed";
import { useLocalSearchParams, useRouter } from "expo-router";
import EndGameMessage from "@/components/Modals/EndGameMessage";
import { DBContext } from "@/contexts/DBContext";
import ColorTile from "./ColorTile";
import SimonSaysHeader from "./SimonSaysHeader";
import useTheme from "@/hooks/useTheme";
import { 
    getDifficultySettings, 
    getTileColors, 
    addToSequence, 
    calculatePlaybackSpeed,
    checkPartialSequence,
    TileColor 
} from "@/utils/SimonSaysGenerator";

type GameState = 'idle' | 'countdown' | 'showing' | 'input' | 'gameover';

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
    const [message, setMessage] = useState<string>("Watch the sequence...");
    const [countdown, setCountdown] = useState<number | null>(null);

    const { db, curGame } = useContext(DBContext);
    const { primary } = useTheme();
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
        // Start countdown when game state changes to countdown
        if (gameState === 'countdown' && countdown !== null && countdown > 0) {
            const timer = setTimeout(() => {
                setCountdown(countdown - 1);
            }, 1000);
            return () => clearTimeout(timer);
        } else if (gameState === 'countdown' && countdown === 0) {
            // Countdown finished, start the game
            setGameState('idle');
            setCountdown(null);
        }
    }, [gameState, countdown]);

    useEffect(() => {
        if (isGameRunning && gameState === 'idle' && countdown === null) {
            startNewRound();
        }
    }, [isGameRunning, gameState, countdown]);

    const startGame = () => {
        setIsGameRunning(true);
        setRound(0);
        setSequence([]);
        setUserSequence([]);
        setGameState('countdown');
        setCountdown(3);
        setMessage("Get ready...");
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
        setCountdown(null);
        setMessage("Watch the sequence...");
    };

    const handleLoss = () => {
        setIsGameRunning(false);
        setGameState('gameover');
        setMessage("Game Over!");
        setEndGameModalVisible(true);
    };

    const renderTiles = () => {
        const { rows, cols } = settings.gridLayout;
        const tileSize = Math.min(280 / cols, 280 / rows) - 10;

        // Render tiles in rows
        const tileRows = [];
        for (let row = 0; row < rows; row++) {
            const tilesInRow = [];
            for (let col = 0; col < cols; col++) {
                const index = row * cols + col;
                if (index < tileColors.length) {
                    tilesInRow.push(
                        <ColorTile
                            key={index}
                            color={tileColors[index]}
                            isActive={activeTile === index}
                            onPress={() => handleTilePress(index)}
                            disabled={gameState !== 'input'}
                            size={tileSize}
                        />
                    );
                }
            }
            tileRows.push(
                <View key={row} style={styles.tileRow}>
                    {tilesInRow}
                </View>
            );
        }

        return tileRows;
    };

    return (
        <View style={styles.container}>
            <SimonSaysHeader 
                round={round}
                timerActive={isGameRunning && gameState !== 'gameover'}
            />
            
            <View style={[styles.board, { borderColor: primary }]}>
                {gameState === 'countdown' && countdown !== null ? (
                    <Text style={styles.countdownText}>{countdown}</Text>
                ) : isGameRunning ? (
                    <>
                        {renderTiles()}
                    </>
                ) : (
                    <TouchableOpacity style={styles.startOverlay} onPress={startGame}>
                        <Text style={styles.startText}>Tap to Start</Text>
                    </TouchableOpacity>
                )}
            </View>

            <Text style={styles.message}>{message}</Text>

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
        paddingTop: 24,
    },
    board: {
        width: 360,
        height: 360,
        borderWidth: 3,
        borderRadius: 8,
        justifyContent: "center",
        alignItems: "center",
        marginVertical: 20,
    },
    tileRow: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    message: {
        fontSize: 18,
        fontWeight: "600",
        textAlign: "center",
        marginTop: 10,
    },
    countdownText: {
        fontSize: 80,
        fontWeight: "bold",
    },
    startOverlay: {
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    startText: {
        fontSize: 24,
        fontWeight: "600",
    },
});
