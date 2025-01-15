import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

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

const WORD_POOLS = {
  easy: [
    "CAT",
    "DOG",
    "RAT",
    "PIG",
    "BAT",
    "COW",
    "HEN",
    "FOX",
    "ANT",
    "BEE",
    "OWL",
    "APE",
    "FLY",
    "HAT",
    "MAP",
    "CUP",
    "SUN",
    "BOX",
    "PEN",
    "LOG",
    "BAG",
    "CAR",
    "BUS",
    "KEY",
    "FAN",
    "JAR",
    "MUG",
    "NET",
    "PIN",
    "RUG",
    "SAW",
    "TIE",
    "VAN",
    "WAX",
    "YAK",
    "ZIP",
    "AXE",
    "BOW",
    "CAN",
    "DIP",
    "EAR",
    "FIG",
    "GYM",
    "HIP",
    "INK",
    "JAM",
    "KIT",
    "LID",
    "MOB",
    "NAP",
  ],
  medium: [
    "REACT",
    "SPACE",
    "PLANT",
    "HEART",
    "BREAD",
    "CLOCK",
    "BROWN",
    "CLOUD",
    "DREAM",
    "FLAME",
    "GRAPE",
    "HOUSE",
    "JUICE",
    "LIGHT",
    "MOUSE",
    "NIGHT",
    "PAPER",
    "QUEEN",
    "RADIO",
    "SNAKE",
    "STORM",
    "TIGER",
    "WATER",
    "YOUTH",
    "PHONE",
    "BEACH",
    "CHAIR",
    "DANCE",
    "EAGLE",
    "FLUTE",
    "GRAIN",
    "HONEY",
    "KNIFE",
    "LEMON",
    "MUSIC",
    "NURSE",
    "OCEAN",
    "PIANO",
    "QUIET",
    "RIVER",
    "STEAM",
    "TABLE",
    "VOICE",
    "WHALE",
    "ZEBRA",
    "BREAD",
    "COAST",
    "DANCE",
    "EARTH",
    "FROST",
  ],
  hard: [
    "ELEPHANT",
    "BASEBALL",
    "COMPUTER",
    "DINOSAUR",
    "EXERCISE",
    "FOOTBALL",
    "GRAPHICS",
    "HOSPITAL",
    "INTERNET",
    "KEYBOARD",
    "LIGHTNING",
    "MOUNTAIN",
    "NOTEBOOK",
    "PAINTING",
    "QUESTION",
    "RAINBOW",
    "SCISSORS",
    "TELESCOPE",
    "UMBRELLA",
    "VACATION",
    "WORKSHOP",
    "XYLOPHONE",
    "YOUNGEST",
    "ZUCCHINI",
    "AIRPLANE",
    "BIRTHDAY",
    "CALENDAR",
    "DIAMOND",
    "ENVELOPE",
    "FESTIVAL",
    "GRAVITY",
    "HARMONY",
    "ICEBERG",
    "JOURNEY",
    "KINGDOM",
    "LIBRARY",
    "MYSTERY",
    "NEUTRON",
    "OCTOPUS",
    "PENGUIN",
    "QUICKER",
    "RAINBOW",
    "SAILING",
    "THUNDER",
    "UNIFORM",
    "VOLCANO",
    "WHISPER",
    "YOGHURT",
    "ZEALOUS",
    "ZOMBIE",
  ],
};

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
    initializeGrid(settings.gridSize, selectedWords);
  };

  const initializeGrid = (gridSize: number, words: string[]) => {
    // Create empty grid using passed gridSize instead of constant
    let newGrid: Cell[][] = Array(gridSize)
      .fill(null)
      .map(() =>
        Array(gridSize)
          .fill(null)
          .map(() => ({
            letter: "",
            selected: false,
            partOfWord: false,
            isFound: false,
          }))
      );

    // Place words
    words.forEach((word) => {
      placeWord(newGrid, word, gridSize);
    });

    // Fill remaining cells
    for (let i = 0; i < gridSize; i++) {
      for (let j = 0; j < gridSize; j++) {
        if (!newGrid[i][j].letter) {
          newGrid[i][j].letter = String.fromCharCode(
            65 + Math.floor(Math.random() * 26)
          );
        }
      }
    }

    setGrid(newGrid);
  };

  // Update placeWord function to use dynamic gridSize
  const placeWord = (grid: Cell[][], word: string, gridSize: number) => {
    let placed = false;
    let attempts = 0;
    const maxAttempts = 100;

    // Skip if word is longer than grid
    if (word.length > gridSize) {
      console.warn(`Word ${word} is too long for grid size ${gridSize}`);
      return false;
    }

    while (!placed && attempts < maxAttempts) {
      attempts++;
      // Add diagonal direction for more placement options
      const directions = ["horizontal", "vertical", "diagonal"] as const;
      const direction = directions[Math.floor(Math.random() * 3)];

      const maxRow =
        direction === "horizontal" ? gridSize - 1 : gridSize - word.length;
      const maxCol =
        direction === "vertical" ? gridSize - 1 : gridSize - word.length;

      if (maxRow < 0 || maxCol < 0) continue;

      const row = Math.floor(Math.random() * (maxRow + 1));
      const col = Math.floor(Math.random() * (maxCol + 1));

      let canPlace = true;

      // Check space availability based on direction
      for (let i = 0; i < word.length; i++) {
        const checkRow =
          direction === "diagonal"
            ? row + i
            : direction === "vertical"
            ? row + i
            : row;
        const checkCol =
          direction === "diagonal"
            ? col + i
            : direction === "horizontal"
            ? col + i
            : col;

        if (
          !grid[checkRow]?.[checkCol] ||
          grid[checkRow][checkCol].letter !== ""
        ) {
          canPlace = false;
          break;
        }
      }

      if (canPlace) {
        for (let i = 0; i < word.length; i++) {
          const placeRow =
            direction === "diagonal"
              ? row + i
              : direction === "vertical"
              ? row + i
              : row;
          const placeCol =
            direction === "diagonal"
              ? col + i
              : direction === "horizontal"
              ? col + i
              : col;

          grid[placeRow][placeCol].letter = word[i];
          grid[placeRow][placeCol].partOfWord = true;
        }
        placed = true;
      }
    }

    return placed;
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
