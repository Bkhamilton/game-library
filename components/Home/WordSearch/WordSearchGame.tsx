import React, { useState, useEffect } from "react";
import { TouchableOpacity, StyleSheet } from "react-native";
import { View, Text } from '@/components/Themed';
import { WORD_POOLS } from '@/data/wordSearchWords';
import { initializeGrid } from '@/utils/WordSearchGenerator';

const GRID_SIZE = 8;
const WORDS = ["REACT", "NATIVE", "APP", "CODE"];

interface Cell {
  letter: string;
  selected: boolean;
  partOfWord: boolean;
  isFound: boolean;
}
interface GridSettings {
  wordCount: number;
  gridSize: number;
}

type Difficulty = "easy" | "medium" | "hard";

const DIFFICULTY_SETTINGS = {
  easy: { wordCount: 5, gridSize: 6 },
  medium: { wordCount: 6, gridSize: 8 },
  hard: { wordCount: 8, gridSize: 10 }, // Increased grid size for longer words
};

export default function WordSearchGame() {
  const [difficulty, setDifficulty] = useState<Difficulty>("easy");
  const [activeWords, setActiveWords] = useState<string[]>([]);
  const [grid, setGrid] = useState<Cell[][]>([]);
  const [foundWords, setFoundWords] = useState<string[]>([]);
  const [wordBank, setWordBank] = useState<string[]>([]);

  useEffect(() => {
    initializeGameWithDifficulty(difficulty);
  }, [difficulty]);

  const initializeGameWithDifficulty = (diff: Difficulty) => {
    const settings = DIFFICULTY_SETTINGS[diff];
    const wordPool = WORD_POOLS[diff];

    // Randomly select words based on difficulty word count
    const selectedWords = [...wordPool]
      .sort(() => Math.random() - 0.5)
      .slice(0, settings.wordCount);

    // Clear previous state
    setFoundWords([]);
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

    console.log("Selected Word:", selectedWord); // Debug log
    console.log("Word Bank:", wordBank); // Debug log

    // Case-insensitive comparison
    const wordFound = wordBank.some(
      (word) => word.toUpperCase() === selectedWord.toUpperCase()
    );

    if (wordFound) {
      setFoundWords((prev) => [...prev, selectedWord]);
      const updatedGrid = grid.map((row) =>
        row.map((cell) => ({
          ...cell,
          isFound: cell.selected ? true : cell.isFound,
          selected: false,
        }))
      );
      setGrid(updatedGrid);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.difficultyContainer}>
        {(["easy", "medium", "hard"] as Difficulty[]).map((diff) => (
          <TouchableOpacity
            key={diff}
            style={[
              styles.difficultyButton,
              difficulty === diff && styles.selectedDifficulty,
            ]}
            onPress={() => setDifficulty(diff)}
          >
            <Text style={styles.difficultyText}>
              {diff.charAt(0).toUpperCase() + diff.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      <View style={styles.wordBank}>
        {wordBank.map((word) => (
          <Text
            key={word}
            style={[styles.word, foundWords.includes(word) && styles.foundWord]}
          >
            {word}
          </Text>
        ))}
      </View>
      <View style={styles.grid}>
        {grid.map((row, i) => (
          <View key={i} style={styles.row}>
            {row.map((cell, j) => (
              <TouchableOpacity
                key={`${i}-${j}`}
                style={[
                  styles.cell,
                  cell.selected && styles.selectedCell,
                  cell.isFound && styles.foundCell,
                ]}
                onPress={() => handleCellPress(i, j)}
              >
                <Text style={styles.letter}>{cell.letter}</Text>
              </TouchableOpacity>
            ))}
          </View>
        ))}
      </View>
      <View>
        <TouchableOpacity
          onPress={() => {
            initializeGameWithDifficulty(difficulty);
            setFoundWords([]);
            console.log("Reset Game");
          }}
        >
          <Text>Reset</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
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
});
