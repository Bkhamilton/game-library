// Function to create the 2d array grid
export const createGrid = (size) => {
    return Array.from({ length: size }, () => Array(size).fill(''));
}

// Function to place the first word in the grid
export const placeFirstWord = (grid, word) => {
    let placed = false;

    while (!placed) {
        // Step 1: Select a random starting position for the first word
        const row = Math.floor(Math.random() * grid.length);
        const col = Math.floor(Math.random() * grid[0].length);

        // Step 2: Check if the word can be placed horizontally
        if (col + word.length <= grid[0].length) {
            let canPlaceHorizontally = true;
            for (let i = 0; i < word.length; i++) {
                if (grid[row][col + i] !== '') {
                    canPlaceHorizontally = false;
                    break;
                }
            }
            if (canPlaceHorizontally) {
                for (let i = 0; i < word.length; i++) {
                    grid[row][col + i] = word[i];
                }
                placed = true;
            }
        }

        // Step 3: Check if the word can be placed vertically
        if (!placed && row + word.length <= grid.length) {
            let canPlaceVertically = true;
            for (let i = 0; i < word.length; i++) {
                if (grid[row + i][col] !== '') {
                    canPlaceVertically = false;
                    break;
                }
            }
            if (canPlaceVertically) {
                for (let i = 0; i < word.length; i++) {
                    grid[row + i][col] = word[i];
                }
                placed = true;
            }
        }
    }

    return grid;
}

// Function to get a viable letter from the grid to intersect new word with
const getViableLetter = (grid) => {
    let viableLetter = null;
    let viableRow = null;
    let viableCol = null;
    while (!viableLetter) {
        const row = Math.floor(Math.random() * grid.length);
        const col = Math.floor(Math.random() * grid[0].length);
        if (grid[row][col] !== '') {
            const topLeft = row > 0 && col > 0 ? grid[row - 1][col - 1] : null;
            const topRight = row > 0 && col < grid[0].length - 1 ? grid[row - 1][col + 1] : null;
            const bottomLeft = row < grid.length - 1 && col > 0 ? grid[row + 1][col - 1] : null;
            const bottomRight = row < grid.length - 1 && col < grid[0].length - 1 ? grid[row + 1][col + 1] : null;
            if (!topLeft && !topRight && !bottomLeft && !bottomRight) {
                viableLetter = grid[row][col];
                viableRow = row;
                viableCol = col;
            }
        }
    }
    return { viableLetter, viableRow, viableCol };
}

// Function to get viable words from the word bank that contain the letter
const getViableWords = (wordBank, letter) => {
    return wordBank.filter(word => word.includes(letter));
}

// Function to place subsequent words in the grid
export const placeSubsequentWords = (grid, wordBank) => {
    // Step 1: Choose a letter from the grid to intersect new word with
    const newCharacter = getViableLetter(grid);

    // Step 2: Grab all words from the wordbank that contain that letter
    const viableWords = getViableWords(wordBank, newCharacter.viableLetter);

    // Step 3: Place the first viable word perpendicular to the letter
    for (const word of viableWords) {
        const { viableLetter, viableRow, viableCol } = newCharacter;
        const letterIndex = word.indexOf(viableLetter);

        // Check if the word can be placed horizontally
        if (viableCol - letterIndex >= 0 && viableCol - letterIndex + word.length <= grid[0].length) {
            let canPlaceHorizontally = true;
            for (let i = 0; i < word.length; i++) {
                if (grid[viableRow][viableCol - letterIndex + i] !== '' && grid[viableRow][viableCol - letterIndex + i] !== word[i]) {
                    canPlaceHorizontally = false;
                    break;
                }
            }
            if (canPlaceHorizontally) {
                for (let i = 0; i < word.length; i++) {
                    grid[viableRow][viableCol - letterIndex + i] = word[i];
                }
                return { grid, placedWord: word };
            }
        }

        // Check if the word can be placed vertically
        if (viableRow - letterIndex >= 0 && viableRow - letterIndex + word.length <= grid.length) {
            let canPlaceVertically = true;
            for (let i = 0; i < word.length; i++) {
                if (grid[viableRow - letterIndex + i][viableCol] !== '' && grid[viableRow - letterIndex + i][viableCol] !== word[i]) {
                    canPlaceVertically = false;
                    break;
                }
            }
            if (canPlaceVertically) {
                for (let i = 0; i < word.length; i++) {
                    grid[viableRow - letterIndex + i][viableCol] = word[i];
                }
                return { grid, placedWord: word };
            }
        }
    }

    return { grid, placedWord: null };
}

// Function to create the crossword puzzle
export const createCrossword = (size, wordBank) => {
    let grid = createGrid(size);
    const firstWord = wordBank.splice(Math.floor(Math.random() * wordBank.length), 1)[0];
    grid = placeFirstWord(grid, firstWord);
    const placedWords = [firstWord];

    for (let i = 0; i < 4; i++) {
        const { grid: newGrid, placedWord } = placeSubsequentWords(grid, wordBank);
        grid = newGrid;
        if (placedWord) {
            const index = wordBank.indexOf(placedWord);
            if (index > -1) {
                wordBank.splice(index, 1);
            }
            placedWords.push(placedWord);
        }
    }
    return { grid, placedWords };
}