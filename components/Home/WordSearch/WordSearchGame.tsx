import React, { useState, useEffect, useContext, useCallback } from "react";
import { StyleSheet } from "react-native";
import { View } from '@/components/Themed';
import { WORD_POOLS } from "@/data/wordSearchWords";
import { initializeGrid } from "@/utils/WordSearchGenerator";
import { useLocalSearchParams } from "expo-router";
import useTheme from "@/hooks/useTheme";
import { useRouter } from "expo-router";
import EndGameMessage from "@/components/Modals/EndGameMessage";
import { DBContext } from "@/contexts/DBContext";
import { insertWin, insertTimeScore, insertWordsFound, insertHintsUsed } from "@/db/Scores/Scores";
import { getRandomColor } from "@/utils/wordSearch";
import WordSearchHeader from "./WordSearchHeader";
import WordSearchWords from "./WordSearchWords";
import WordSearchBoard from "./WordSearchBoard";
import { GameVictoryConfetti, LoadingSpinner } from '@/components/animations';

interface Cell {
    letter: string;
    selected: boolean;
    partOfWord: boolean;
    isFound: boolean;
    partOfFoundWord: boolean;
    wordDirection?: "horizontal" | "vertical" | "diagonal-right" | "diagonal-left";
    foundColor?: string;
    wordDirections?: Array<"horizontal" | "vertical" | "diagonal-right" | "diagonal-left">;
    foundColors?: string[];
}

type Difficulty = "Easy" | "Medium" | "Hard";

const DIFFICULTY_SETTINGS = {
    Easy: { wordCount: 5, gridSize: 6 },
    Medium: { wordCount: 6, gridSize: 8 },
    Hard: { wordCount: 8, gridSize: 10 },
};

export default function WordSearchGame() {
    const { difficulty } = useLocalSearchParams();
    const [grid, setGrid] = useState<Cell[][]>([]);
    const [foundWords, setFoundWords] = useState<string[]>([]);
    const [wordBank, setWordBank] = useState<string[]>([]);
    const [wordColors, setWordColors] = useState<{ [key: string]: string }>({});
    const [endGameModalVisible, setEndGameModalVisible] = useState(false);
    const [gameTime, setGameTime] = useState(0);
    const [hintsUsed, setHintsUsed] = useState(0); // Track hints used
    const [showVictoryConfetti, setShowVictoryConfetti] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    const { db, curGame } = useContext(DBContext);
    const router = useRouter();
    const { primary } = useTheme();

    const handleTimeUpdate = useCallback((seconds: number) => {
        setGameTime(seconds);
    }, []);

    const restartGame = (difficulty: string) => {
        router.replace(`/wordSearch?difficulty=${difficulty}`);
        initializeGameWithDifficulty(difficulty as Difficulty);
        setFoundWords([]);
    };

    const handleWin = () => {
        insertWin(db, curGame?.id, difficulty);
        insertTimeScore(db, curGame?.id, gameTime, difficulty);
        insertWordsFound(db, curGame?.id, foundWords.length, difficulty);
        insertHintsUsed(db, curGame?.id, hintsUsed, difficulty);
        setShowVictoryConfetti(true);
        // Delay showing the modal slightly to let confetti play
        setTimeout(() => {
            setEndGameModalVisible(true);
        }, 500);
    };

    const initializeGameWithDifficulty = (diff: Difficulty) => {
        setIsLoading(true);
        setTimeout(() => {
            const settings = DIFFICULTY_SETTINGS[diff];
            const wordPool = WORD_POOLS[diff];
            const selectedWords = [...wordPool].sort(() => Math.random() - 0.5).slice(0, settings.wordCount);

            setFoundWords([]);
            setWordBank(selectedWords);

            const newGrid = initializeGrid(settings.gridSize, selectedWords);
            setGrid(newGrid);
            setIsLoading(false);
        }, 300);
    };

    const handleCellPress = (row: number, col: number) => {
        const newGrid = [...grid];
        newGrid[row][col].selected = !newGrid[row][col].selected;
        setGrid(newGrid);

        // Get selected cells with their positions
        const selectedCellsWithPositions: Array<{ cell: Cell, row: number, col: number }> = [];
        grid.forEach((gridRow, i) => {
            gridRow.forEach((cell, j) => {
                if (cell.selected) {
                    selectedCellsWithPositions.push({ cell, row: i, col: j });
                }
            });
        });
        
        const selectedWord = selectedCellsWithPositions.map(({ cell }) => cell.letter).join("");

        const wordFound = wordBank.some((word) => word.toUpperCase() === selectedWord.toUpperCase());

        if (wordFound) {
            const color = getRandomColor();
            setWordColors((prev) => ({ ...prev, [selectedWord]: color }));
            setFoundWords((prev) => [...prev, selectedWord]);

            // Determine the direction of the found word
            let direction: "horizontal" | "vertical" | "diagonal-right" | "diagonal-left" = "horizontal";
            
            if (selectedCellsWithPositions.length > 1) {
                const first = selectedCellsWithPositions[0];
                const second = selectedCellsWithPositions[1];
                const rowDiff = second.row - first.row;
                const colDiff = second.col - first.col;
                
                if (rowDiff === 0) {
                    direction = "horizontal";
                } else if (colDiff === 0) {
                    direction = "vertical";
                } else if (rowDiff === colDiff) {
                    direction = "diagonal-right";
                } else {
                    direction = "diagonal-left";
                }
            }

            const updatedGrid = grid.map((row) =>
                row.map((cell) => {
                    if (cell.selected) {
                        // Cell is part of the newly found word
                        const newWordDirections = [...(cell.wordDirections || []), direction];
                        const newFoundColors = [...(cell.foundColors || []), color];
                        
                        return {
                            ...cell,
                            isFound: true,
                            partOfFoundWord: true,
                            selected: false,
                            wordDirection: direction, // Keep for backward compatibility
                            foundColor: color, // Keep for backward compatibility
                            wordDirections: newWordDirections,
                            foundColors: newFoundColors,
                        };
                    }
                    return {
                        ...cell,
                        selected: false,
                    };
                })
            );
            setGrid(updatedGrid);

            if (foundWords.length + 1 === wordBank.length) {
                handleWin();
            }
        }
    };

    useEffect(() => {
        initializeGameWithDifficulty(difficulty as Difficulty);
    }, [difficulty]);

    return (
        <View style={styles.container}>
            <WordSearchHeader
                wordCount={wordBank.length}
                foundWords={foundWords.length}
                onTimeUpdate={handleTimeUpdate}
            />
            {isLoading ? (
                <LoadingSpinner size="large" />
            ) : (
                <>
                    <WordSearchBoard 
                        grid={grid} 
                        handleCellPress={handleCellPress} 
                    />
                    <WordSearchWords 
                        wordBank={wordBank} 
                        foundWords={foundWords} 
                        wordColors={wordColors} 
                    />
                </>
            )}
            <EndGameMessage
                visible={endGameModalVisible}
                close={() => setEndGameModalVisible(false)}
                win={true}
                game={curGame}
                initialDifficulty={difficulty}
                restartGame={restartGame}
            />
            <GameVictoryConfetti
                visible={showVictoryConfetti}
                onComplete={() => setShowVictoryConfetti(false)}
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
});