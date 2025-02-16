const gridSize = 15; // Size of the grid

export const createGrid = (size) => {
    return Array.from({ length: size }, () => Array(size).fill(''));
};

export const placeFirstWord = (grid, word) => {
    const wordLength = word.length;
    const direction = Math.random() < 0.5 ? 'horizontal' : 'vertical';
    let row, col;
  
    if (direction === 'horizontal') {
        row = Math.floor(Math.random() * gridSize);
        col = Math.floor(Math.random() * (gridSize - wordLength));
    } else {
        row = Math.floor(Math.random() * (gridSize - wordLength));
        col = Math.floor(Math.random() * gridSize);
    }
  
    // Place the word in the grid
    for (let i = 0; i < wordLength; i++) {
        if (direction === 'horizontal') {
            grid[row][col + i] = word[i];
        } else {
            grid[row + i][col] = word[i];
        }
    }
  
    return { grid, direction, startPosition: { row, col } };
};

export const placeWord = (grid, word, direction, startPosition) => {
    const { row, col } = startPosition;
    const wordLength = word.length;
  
    for (let i = 0; i < wordLength; i++) {
        if (direction === 'horizontal') {
            grid[row][col + i] = word[i];
        } else {
            grid[row + i][col] = word[i];
        }
    }
  
    return grid;
};

export const placeSubsequentWords = (grid, wordBank) => {
    let updatedGrid = [...grid];
  
    for (const word of wordBank) {
      const intersections = findIntersections(updatedGrid, word);
  
      for (const intersection of intersections) {
        const { row, col, direction } = intersection;
  
        if (canPlaceWord(updatedGrid, word, row, col, direction)) {
          updatedGrid = placeWord(updatedGrid, word, row, col, direction);
          break;
        }
      }
    }
  
    return updatedGrid;
  };
  
// Helper functions
export const findIntersections = (grid, word) => {
    // TODO: Find all viable intersections for the word
};
  
export const canPlaceWord = (grid, word, row, col, direction) => {
    // TODO: Check if the word can be placed at the given position
};