// Function to create the 2d array grid
export const createGrid = (size) => {
    return Array.from({ length: size }, () => Array(size).fill(''));
}

const shuffle = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

// Function to place the first word in the grid
export const placeFirstWord = (grid, word) => {
    let placed = false;
    const size = grid.length;
    const center = Math.floor(size / 2);
    const innerRadius = 2; // 5x5 area around the center
    let startPosition = null;

    while (!placed) {
        // Step 1: Select a random starting position within the inner 5x5 area
        const row = center - innerRadius + Math.floor(Math.random() * (2 * innerRadius + 1));
        const col = center - innerRadius + Math.floor(Math.random() * (2 * innerRadius + 1));

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
                startPosition = { row, col, direction: 'horizontal' };
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
                startPosition = { row, col, direction: 'vertical' };
            }
        }
    }

    return { grid, startPosition };
}

// Function to get a viable letter from the grid to intersect new word with
const getViableLetter = (grid, placedWords) => {
    let viableLetter = null;
    let viableRow = null;
    let viableCol = null;
    while (!viableLetter) {
        const row = Math.floor(Math.random() * grid.length);
        const col = Math.floor(Math.random() * grid[0].length);

        const isStartPosition = (row, col) => {
            return placedWords.some(({ startPosition }) => startPosition.row === row && startPosition.col === col);
        };

        if (grid[row][col] !== '' && !isStartPosition(row, col)) {
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
export const placeSubsequentWords = (grid, wordBank, placedWords) => {
    // Step 1: Choose a letter from the grid to intersect new word with
    const newCharacter = getViableLetter(grid, placedWords);

    const isStartPosition = (row, col) => {
        return placedWords.some(({ startPosition }) => startPosition.row === row && startPosition.col === col);
    };

    // Step 2: Grab all words from the wordbank that contain that letter
    const viableWords = getViableWords(wordBank, newCharacter.viableLetter);
    const shuffledWords = shuffle(viableWords);

    // Step 3: Place the first viable word perpendicular to the letter
    for (const word of shuffledWords) {
        const { viableLetter, viableRow, viableCol } = newCharacter;
        const letterIndex = word.indexOf(viableLetter);
        let startPosition = null;

        // Check if the word can be placed horizontally
        if (viableCol - letterIndex >= 0 && viableCol - letterIndex + word.length <= grid[0].length) {
            let canPlaceHorizontally = true;
            for (let i = 0; i < word.length; i++) {
                if (grid[viableRow][viableCol - letterIndex + i] !== '' && grid[viableRow][viableCol - letterIndex + i] !== word[i]) {
                    canPlaceHorizontally = false;
                    break;
                }
            }
            // Check the spaces to the immediate left and right
            if (canPlaceHorizontally) {
                if ((viableCol - letterIndex - 1 >= 0 && grid[viableRow][viableCol - letterIndex - 1] !== '') ||
                    (viableCol - letterIndex + word.length < grid[0].length && grid[viableRow][viableCol - letterIndex + word.length] !== '')) {
                    canPlaceHorizontally = false;
                }
                // Check the spaces below each letter to make sure they are not the starting letter of another word
                for (let i = 0; i < word.length; i++) {
                    if (viableRow + 1 < grid.length && isStartPosition(viableRow + 1, viableCol - letterIndex + i)) {
                        canPlaceHorizontally = false;
                        break;
                    }
                }
            }
            if (canPlaceHorizontally) {
                for (let i = 0; i < word.length; i++) {
                    grid[viableRow][viableCol - letterIndex + i] = word[i];
                }
                startPosition = { row: viableRow, col: viableCol - letterIndex, direction: 'horizontal' };
                return { grid, placedWord: word, startPosition };
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
            // Check the spaces directly above and below
            if (canPlaceVertically) {
                if ((viableRow - letterIndex - 1 >= 0 && grid[viableRow - letterIndex - 1][viableCol] !== '') ||
                    (viableRow - letterIndex + word.length < grid.length && grid[viableRow - letterIndex + word.length][viableCol] !== '')) {
                    canPlaceVertically = false;
                }
                // Check the spaces to the right of each letter to make sure they are not the starting letter of another word
                for (let i = 0; i < word.length; i++) {
                    if (viableCol + 1 < grid[0].length && isStartPosition(viableRow - letterIndex + i, viableCol + 1)) {
                        canPlaceVertically = false;
                        break;
            }
                }
            }
            if (canPlaceVertically) {
                for (let i = 0; i < word.length; i++) {
                    grid[viableRow - letterIndex + i][viableCol] = word[i];
                }
                startPosition = { row: viableRow - letterIndex, col: viableCol, direction: 'vertical' };
                return { grid, placedWord: word, startPosition };
            }
        }
    }

    return { grid, placedWord: null, startPosition: null };
}

// Function to condense the grid to the smallest possible square size
export const condenseGrid = (grid, placedWords) => {
    let minRow = grid.length, maxRow = 0, minCol = grid[0].length, maxCol = 0;

    // Identify the smallest and largest rows and columns that contain letters
    for (let row = 0; row < grid.length; row++) {
        for (let col = 0; col < grid[row].length; col++) {
            if (grid[row][col] !== '') {
                if (row < minRow) minRow = row;
                if (row > maxRow) maxRow = row;
                if (col < minCol) minCol = col;
                if (col > maxCol) maxCol = col;
            }
        }
    }

    // Calculate the size of the smallest square that can contain all the letters
    const size = Math.max(maxRow - minRow + 1, maxCol - minCol + 1);

    // Extract the subgrid that contains all the letters
    const condensedGrid = Array.from({ length: size }, (_, i) => 
        Array.from({ length: size }, (_, j) => 
            grid[minRow + i] && grid[minRow + i][minCol + j] !== undefined ? grid[minRow + i][minCol + j] : ''
        )
    );

    // Adjust the starting positions of the placed words
    const adjustedPlacedWords = placedWords.map(({ word, startPosition }) => {
        return {
            word,
            startPosition: {
                row: startPosition.row - minRow,
                col: startPosition.col - minCol,
                direction: startPosition.direction
            }
        };
    });

    return { condensedGrid, adjustedPlacedWords };
}

// Function to create the crossword puzzle
export const createCrossword = (size, wordBank, numWords) => {
    let minWords;
    switch (size) {
        case 6:
            minWords = 5;
            break;
        case 9:
            minWords = 7;
            break;
        case 14:
            minWords = 10;
            break;
        default:
            minWords = 3;
    }

    let grid = createGrid(size);
    const firstWord = wordBank.splice(Math.floor(Math.random() * wordBank.length), 1)[0];
    const { grid: newGrid, startPosition: firstWordPosition } = placeFirstWord(grid, firstWord);
    grid = newGrid;
    const placedWords = [{ word: firstWord, startPosition: firstWordPosition }];

    for (let i = 0; i < numWords; i++) {
        const { grid: newGrid, placedWord, startPosition } = placeSubsequentWords(grid, wordBank, placedWords);
        grid = newGrid;
        if (placedWord) {
            const index = wordBank.indexOf(placedWord);
            if (index > -1) {
                wordBank.splice(index, 1);
            }
            placedWords.push({ word: placedWord, startPosition });
        }
    }

    const { condensedGrid, adjustedPlacedWords } = condenseGrid(grid, placedWords);

    return { grid: condensedGrid, placedWords: adjustedPlacedWords };
}