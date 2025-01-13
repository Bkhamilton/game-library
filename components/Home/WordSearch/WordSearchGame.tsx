import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const GRID_SIZE = 8;
const WORDS = ['REACT', 'NATIVE', 'APP', 'CODE'];

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

type Difficulty = 'easy' | 'medium' | 'hard';

const WORD_POOLS = {
  easy: ['CAT', 'DOG', 'RAT', 'PIG'],
  medium: ['REACT', 'NATIVE', 'CODE', 'APP', 'WEB', 'GAME'],
  hard: ['JAVASCRIPT', 'TYPESCRIPT', 'FRAMEWORK', 'DEVELOPER', 'SOFTWARE', 'PROGRAMMING']
};

const DIFFICULTY_SETTINGS = {
  easy: { wordCount: 3, gridSize: 6 },
  medium: { wordCount: 5, gridSize: 8 },
  hard: { wordCount: 6, gridSize: 10 }
};

export default function WordSearchGame() {
    const [difficulty, setDifficulty] = useState<Difficulty>('easy');
    const [activeWords, setActiveWords] = useState<string[]>([]);
    const [grid, setGrid] = useState<Cell[][]>([]);
    const [foundWords, setFoundWords] = useState<string[]>([]);

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
    
    setActiveWords(selectedWords);
    initializeGrid(settings.gridSize, selectedWords);
  };

  const initializeGrid = (gridSize: number, words: string[]) => {
    // Create empty grid using passed gridSize instead of constant
    let newGrid: Cell[][] = Array(gridSize).fill(null).map(() =>
      Array(gridSize).fill(null).map(() => ({
        letter: '',
        selected: false,
        partOfWord: false,
        isFound: false
      }))
    );
  
    // Place words
    words.forEach(word => {
      placeWord(newGrid, word, gridSize);
    });
  
    // Fill remaining cells
    for (let i = 0; i < gridSize; i++) {
      for (let j = 0; j < gridSize; j++) {
        if (!newGrid[i][j].letter) {
          newGrid[i][j].letter = String.fromCharCode(65 + Math.floor(Math.random() * 26));
        }
      }
    }
  
    setGrid(newGrid);
  };

// Update placeWord function to use dynamic gridSize
const placeWord = (grid: Cell[][], word: string, gridSize: number) => {
    const direction = Math.random() > 0.5 ? 'horizontal' : 'vertical';
    const row = Math.floor(Math.random() * (direction === 'horizontal' ? gridSize : gridSize - word.length));
    const col = Math.floor(Math.random() * (direction === 'horizontal' ? gridSize - word.length : gridSize));
  
    if (direction === 'horizontal') {
      for (let i = 0; i < word.length; i++) {
        grid[row][col + i].letter = word[i];
        grid[row][col + i].partOfWord = true;
      }
    } else {
      for (let i = 0; i < word.length; i++) {
        grid[row + i][col].letter = word[i];
        grid[row + i][col].partOfWord = true;
      }
    }
  };

  // Update handleCellPress function
const handleCellPress = (row: number, col: number) => {
    const newGrid = [...grid];
    newGrid[row][col].selected = !newGrid[row][col].selected;
    setGrid(newGrid);
  
    const selectedCells = grid.flat().filter(cell => cell.selected);
    const selectedWord = selectedCells.map(cell => cell.letter).join('');
    
    if (WORDS.includes(selectedWord)) {
      setFoundWords([...foundWords, selectedWord]);
      // Mark found cells instead of clearing selection
      const updatedGrid = grid.map(row =>
        row.map(cell => ({
          ...cell,
          isFound: cell.selected ? true : cell.isFound,
          selected: false
        }))
      );
      setGrid(updatedGrid);
    }
  };
  

  return (
    <View style={styles.container}>
        <View style={styles.difficultyContainer}>
        {(['easy', 'medium', 'hard'] as Difficulty[]).map((diff) => (
          <TouchableOpacity
            key={diff}
            style={[
              styles.difficultyButton,
              difficulty === diff && styles.selectedDifficulty
            ]}
            onPress={() => setDifficulty(diff)}
          >
            <Text style={styles.difficultyText}>
              {diff.charAt(0).toUpperCase() + diff.slice(1)}
            </Text>
          </TouchableOpacity>
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
                cell.isFound && styles.foundCell  // Add this
              ]}
              onPress={() => handleCellPress(i, j)}
            >
              <Text style={styles.letter}>{cell.letter}</Text>
            </TouchableOpacity>
            ))}
          </View>
        ))}
      </View>
      <View style={styles.wordList}>
        {WORDS.map(word => (
          <Text
            key={word}
            style={[
              styles.word,
              foundWords.includes(word) && styles.foundWord
            ]}
          >
            {word}
          </Text>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  foundCell: {
    backgroundColor: '#90EE90',  // Light green
  },
  grid: {
    alignItems: 'center',
  },
  row: {
    flexDirection: 'row',
  },
  cell: {
    width: 40,
    height: 40,
    borderWidth: 1,
    borderColor: '#ccc',
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedCell: {
    backgroundColor: '#e6e6e6',
  },
  letter: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  wordList: {
    marginTop: 20,
  },
  word: {
    fontSize: 18,
    marginVertical: 5,
  },
  foundWord: {
    textDecorationLine: 'line-through',
    color: 'green',
  },
  difficultyContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 20,
  },
  difficultyButton: {
    padding: 10,
    margin: 5,
    borderRadius: 5,
    backgroundColor: '#ddd',
  },
  selectedDifficulty: {
    backgroundColor: '#4CAF50',
  },
  difficultyText: {
    color: '#000',
    fontWeight: 'bold',
  }
});