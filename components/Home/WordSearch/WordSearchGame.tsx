import React, { useState, useEffect, useContext } from "react";
import { TouchableOpacity, StyleSheet } from "react-native";
import { View, Text } from "@/components/Themed";
import { WORD_POOLS } from "@/data/wordSearchWords";
import { initializeGrid } from "@/utils/WordSearchGenerator";
import { useLocalSearchParams } from "expo-router";
import useTheme from "@/hooks/useTheme";
import { useRouter } from "expo-router";
import EndGameMessage from "@/components/Modals/EndGameMessage";
import { DBContext } from "@/contexts/DBContext";

const getRandomColor = () => {
    const colors = [
        "#FF6B6B", // Red
        "#4ECDC4", // Turquoise
        "#45B7D1", // Light Blue
        "#96CEB4", // Sage Green
        "#D4A5A5", // Dusty Rose
        "#9B59B6", // Purple
        "#3498DB", // Blue
        "#E67E22", // Orange
        "#16A085", // Green
        "#F39C12", // Yellow
        "#D35400", // Pumpkin
        "#8E44AD", // Dark Purple
        "#2980B9", // Dark Blue
        "#C0392B", // Dark Red
        "#27AE60", // Dark Green
        "#F1C40F", // Dark Yellow
        "#7F8C8D", // Dark Gray
        "#34495E", // Dark Blue Gray
        "#2C3E50", // Dark Gray
    ];
    return colors[Math.floor(Math.random() * colors.length)];
};

interface Cell {
    letter: string;
    selected: boolean;
    partOfWord: boolean;
    isFound: boolean;
    partOfFoundWord: boolean;
    wordDirection?: "horizontal" | "vertical" | "diagonal-right" | "diagonal-left";
    foundColor?: string; // Add this line
}

type Difficulty = "easy" | "medium" | "hard";

const DIFFICULTY_SETTINGS = {
    Easy: { wordCount: 5, gridSize: 6 },
    Medium: { wordCount: 6, gridSize: 8 },
    Hard: { wordCount: 8, gridSize: 10 }, // Increased grid size for longer words
};

export default function WordSearchGame() {
    const { difficulty } = useLocalSearchParams();
    const [activeWords, setActiveWords] = useState<string[]>([]);
    const [grid, setGrid] = useState<Cell[][]>([]);
    const [foundWords, setFoundWords] = useState<string[]>([]);
    const [wordBank, setWordBank] = useState<string[]>([]);
    const [wordColors, setWordColors] = useState<{ [key: string]: string }>({});
    const [isGameComplete, setIsGameComplete] = useState<boolean>(false);
    const [trigger, setTrigger] = useState(false);
    const [endGameModalVisible, setEndGameModalVisible] = useState(false);

    const { curGame } = useContext(DBContext);

    const router = useRouter();

    const restartGame = (difficulty: string) => {
        router.push(`/wordSearch?difficulty=${difficulty}`);
        setTrigger(!trigger);
        initializeGameWithDifficulty(difficulty as Difficulty);
        setFoundWords([]);
    };

    const handleWin = () => {
        // insertWin(db, curGame.id, difficulty);
        setIsGameComplete(true);
        setEndGameModalVisible(true);        
    }

    const { primary, grayBackground, text } = useTheme();

    useEffect(() => {
        initializeGameWithDifficulty(difficulty as Difficulty);
    }, [difficulty]);

    const initializeGameWithDifficulty = (diff: Difficulty) => {
        const settings = DIFFICULTY_SETTINGS[diff];
        const wordPool = WORD_POOLS[diff];

        // Randomly select words based on difficulty word count
        const selectedWords = [...wordPool].sort(() => Math.random() - 0.5).slice(0, settings.wordCount);

        // Clear previous state
        setFoundWords([]);
        setIsGameComplete(false);
        setWordBank(selectedWords);
        setActiveWords(selectedWords);

        console.log("Selected Words:", selectedWords); // Debug log
        const newGrid = initializeGrid(settings.gridSize, selectedWords);
        setGrid(newGrid);
    };

    // Update handleCellPress function
    const handleCellPress = (row: number, col: number) => {
        const newGrid = [...grid];
        newGrid[row][col].selected = !newGrid[row][col].selected;
        setGrid(newGrid);

        const selectedCells = grid.flat().filter((cell) => cell.selected);
        const selectedWord = selectedCells.map((cell) => cell.letter).join("");

        const wordFound = wordBank.some((word) => word.toUpperCase() === selectedWord.toUpperCase());

        if (wordFound) {
            const color = getRandomColor();
            setWordColors((prev) => ({ ...prev, [selectedWord]: color }));
            setFoundWords((prev) => [...prev, selectedWord]);

            const updatedGrid = grid.map((row) =>
                row.map((cell) => ({
                    ...cell,
                    isFound: cell.selected ? true : cell.isFound,
                    partOfFoundWord: cell.selected ? true : cell.partOfFoundWord,
                    selected: false,
                    // Change color to black if the cell is part of multiple found words
                    foundColor: cell.selected ? (cell.partOfFoundWord ? "#000000" : color) : cell.foundColor,
                }))
            );
            setGrid(updatedGrid);

            // Check if all words are found
            const updatedFoundWords = [...foundWords, selectedWord];
            if (updatedFoundWords.length === wordBank.length) {
                handleWin();
            }
        }
    };

    const getStrikethroughStyle = (direction?: string, color?: string) => {
        const baseStyle = {
            position: "absolute",
            backgroundColor: color || "#4CAF50",
            opacity: 0.7,
        };

        switch (direction) {
            case "vertical":
                return {
                    ...baseStyle,
                    width: 3,
                    top: -5,
                    bottom: -5,
                    left: "50%",
                    transform: [{ translateX: -1.5 }],
                };
            case "diagonal-right":
                return {
                    ...baseStyle,
                    height: 3,
                    width: "141%", // √2 * 100% to cover diagonal
                    top: "50%",
                    left: "-20%",
                    transform: [{ translateY: -1.5 }, { rotate: "45deg" }],
                };
            case "diagonal-left":
                return {
                    ...baseStyle,
                    height: 3,
                    width: "141%", // √2 * 100% to cover diagonal
                    top: "50%",
                    left: "-20%",
                    transform: [{ translateY: -1.5 }, { rotate: "-45deg" }],
                };
            default: // horizontal
                return {
                    ...baseStyle,
                    height: 3,
                    left: -5,
                    right: -5,
                    top: "50%",
                    transform: [{ translateY: -1.5 }],
                };
        }
    };

    return (
        <View style={[styles.container]}>
            <View style={styles.wordBank}>
                {wordBank.map((word) => (
                    <Text
                        key={word}
                        style={[
                            styles.word,
                            foundWords.includes(word) && {
                                ...styles.foundWord,
                                color: wordColors[word] || "green",
                            },
                        ]}
                    >
                        {word}
                    </Text>
                ))}
            </View>
            <View style={[styles.grid, { borderWidth: 5, borderColor: primary }]}>
                {grid.map((row, i) => (
                    <View key={i} style={[styles.row, { borderWidth: 1, borderColor: primary }]}>
                        {row.map((cell, j) => (
                            <TouchableOpacity
                                key={`${i}-${j}`}
                                style={[
                                    styles.cell,
                                    { borderWidth: 1, borderColor: primary },
                                    cell.selected && styles.selectedCell,
                                    cell.isFound && { backgroundColor: cell.foundColor + "40" }, // 40 adds transparency
                                ]}
                                onPress={() => handleCellPress(i, j)}
                            >
                                <Text style={[styles.letter, cell.partOfFoundWord && { color: cell.foundColor }]}>{cell.letter}</Text>
                                {cell.partOfFoundWord && <View style={getStrikethroughStyle(cell.wordDirection, cell.foundColor)} />}
                            </TouchableOpacity>
                        ))}
                    </View>
                ))}
            </View>
            <View style={[{ alignItems: "center" }]}>
                <TouchableOpacity
                    onPress={() => {
                        initializeGameWithDifficulty(difficulty as Difficulty);
                        setFoundWords([]);
                    }}
                >
                    <Text>Reset</Text>
                </TouchableOpacity>
            </View>
            <EndGameMessage
                visible={endGameModalVisible}
                close={() => setEndGameModalVisible(false)}
                win={true}
                game={curGame}
                initialDifficulty={difficulty}
                restartGame={restartGame}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        width: "auto",
        height: "100%",
    },
    wordBank: {
        flexDirection: "row",
        flexWrap: "wrap",
        marginBottom: 20,
        padding: 10,
    },
    foundCell: {
        backgroundColor: "#90EE90", // Light green
    },
    foundLetter: {
        color: "#4CAF50", // Green color for found letters
        opacity: 0.7, // Slightly faded
    },
    strikethrough: {
        position: "absolute",
        left: -5, // Extend slightly beyond the cell
        right: -5,
        height: 3, // Thickness of the line
        backgroundColor: "#4CAF50", // Match the letter color
        opacity: 0.7,
        top: "50%", // Center vertically
        transform: [{ translateY: -1.5 }], // Adjust for line thickness
    },
    grid: {
        alignItems: "center",
    },
    row: {
        flexDirection: "row",
    },
    cell: {
        width: 40,
        height: 40,
        borderWidth: 1,
        borderColor: "#ccc",
        justifyContent: "center",
        alignItems: "center",
        position: "relative",
    },
    selectedCell: {
        backgroundColor: "#e6e6e6",
    },
    letter: {
        fontSize: 20,
        fontWeight: "bold",
    },
    wordList: {
        marginTop: 20,
    },
    word: {
        fontSize: 18,
        marginVertical: 5,
        marginHorizontal: 5,
    },
    foundWord: {
        textDecorationLine: "line-through",
        color: "green",
    },
    difficultyContainer: {
        flexDirection: "row",
        justifyContent: "center",
        marginBottom: 20,
    },
    difficultyButton: {
        padding: 10,
        margin: 5,
        borderRadius: 5,
        backgroundColor: "#ddd",
    },
    selectedDifficulty: {
        backgroundColor: "#4CAF50",
    },
    difficultyText: {
        color: "#000",
        fontWeight: "bold",
    },
    victoryOverlay: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: "center",
        alignItems: "center",
    },
    victoryModal: {
        padding: 20,
        borderRadius: 10,
        alignItems: "center",
        elevation: 5,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
    },
    victoryText: {
        fontSize: 24,
        fontWeight: "bold",
        textAlign: "center",
        marginBottom: 20,
    },
    newGameButton: {
        padding: 10,
        borderRadius: 5,
        minWidth: 120,
        alignItems: "center",
    },
    newGameButtonText: {
        color: "white",
        fontSize: 16,
        fontWeight: "bold",
    },
});
