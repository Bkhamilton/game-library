// Description: Word search generator utility functions

export type Cell = {
    letter: string,
    selected: boolean,
    partOfWord: boolean,
    isFound: boolean,
    partOfFoundWord: boolean,
    wordDirection?: "horizontal" | "vertical" | "diagonal-right" | "diagonal-left",
    wordDirections?: Array<"horizontal" | "vertical" | "diagonal-right" | "diagonal-left">,
    foundColors?: string[],
};

type Direction = {
    x: number,
    y: number,
};

const directions: Direction[] = [
    { x: 1, y: 0 }, // right
    { x: 0, y: 1 }, // down
    { x: 1, y: 1 }, // diagonal down-right
    { x: -1, y: 1 }, // diagonal down-left
];

export const initializeGrid = (gridSize: number, words: string[]): Cell[][] => {
    // Initialize empty grid
    const grid: Cell[][] = Array.from({ length: gridSize }, () =>
        Array.from({ length: gridSize }, () => ({
            letter: "",
            selected: false,
            partOfWord: false,
            isFound: false,
            partOfFoundWord: false,
            wordDirections: [],
            foundColors: [],
        }))
    );

    const canPlaceWord = (word: string, startX: number, startY: number, direction: Direction): boolean => {
        let x = startX;
        let y = startY;

        for (let i = 0; i < word.length; i++) {
            if (x < 0 || x >= gridSize || y < 0 || y >= gridSize) {
                return false;
            }
            if (grid[y][x].letter && grid[y][x].letter !== word[i]) {
                return false;
            }
            x += direction.x;
            y += direction.y;
        }
        return true;
    };

    const placeWord = (word: string): boolean => {
        const maxAttempts = 200; // Increased from 100 to give more chances
        const shuffledDirections = [...directions].sort(() => Math.random() - 0.5); // Randomize direction order

        for (let attempt = 0; attempt < maxAttempts; attempt++) {
            // Try each direction in random order before moving to a new position
            for (const direction of shuffledDirections) {
                // For longer words, try to start from positions that have more room
                const maxStartX = direction.x === 1 ? gridSize - word.length : direction.x === -1 ? word.length - 1 : gridSize - 1;
                const maxStartY = direction.y === 1 ? gridSize - word.length : gridSize - 1;

                const startX = Math.floor(Math.random() * (maxStartX + 1));
                const startY = Math.floor(Math.random() * (maxStartY + 1));

                if (canPlaceWord(word, startX, startY, direction)) {
                    let x = startX;
                    let y = startY;

                    // Determine word direction
                    let wordDirection: "horizontal" | "vertical" | "diagonal-right" | "diagonal-left";
                    if (direction.x === 1 && direction.y === 0) wordDirection = "horizontal";
                    else if (direction.x === 0 && direction.y === 1) wordDirection = "vertical";
                    else if (direction.x === 1 && direction.y === 1) wordDirection = "diagonal-right";
                    else wordDirection = "diagonal-left";

                    for (let i = 0; i < word.length; i++) {
                        grid[y][x] = {
                            letter: word[i].toUpperCase(),
                            selected: false,
                            partOfWord: true,
                            isFound: false,
                            partOfFoundWord: false,
                            wordDirection,
                        };
                        x += direction.x;
                        y += direction.y;
                    }
                    return true;
                }
            }
        }
        console.warn(`Could not place word: ${word} (length: ${word.length})`);
        return false;
    };
    // Add this function to help with word placement
    const sortWordsByLength = (words: string[]): string[] => {
        return [...words].sort((a, b) => b.length - a.length);
    };

    // Sort words by length (longest first)
    const sortedWords = sortWordsByLength(words);

    // Try to place each word
    const placedWords = sortedWords.filter((word) => placeWord(word));

    if (placedWords.length !== words.length) {
        console.warn(`Could only place ${placedWords.length} out of ${words.length} words`);
    }

    // Fill empty cells with random letters
    const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    for (let y = 0; y < gridSize; y++) {
        for (let x = 0; x < gridSize; x++) {
            if (!grid[y][x].letter) {
                grid[y][x] = {
                    letter: alphabet[Math.floor(Math.random() * alphabet.length)],
                    selected: false,
                    partOfWord: false,
                    isFound: false,
                    partOfFoundWord: false,
                    wordDirections: [],
                    foundColors: [],
                };
            }
        }
    }

    return grid;
};

// Update placeWord function to use dynamic gridSize
export const placeWord = (grid: Cell[][], word: string, gridSize: number) => {
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
        const directions = ["horizontal", "vertical", "diagonal"];
        const direction = directions[Math.floor(Math.random() * 3)];

        const maxRow = direction === "horizontal" ? gridSize - 1 : gridSize - word.length;
        const maxCol = direction === "vertical" ? gridSize - 1 : gridSize - word.length;

        if (maxRow < 0 || maxCol < 0) continue;

        const row = Math.floor(Math.random() * (maxRow + 1));
        const col = Math.floor(Math.random() * (maxCol + 1));

        let canPlace = true;

        // Check space availability based on direction
        for (let i = 0; i < word.length; i++) {
            const checkRow = direction === "diagonal" ? row + i : direction === "vertical" ? row + i : row;
            const checkCol = direction === "diagonal" ? col + i : direction === "horizontal" ? col + i : col;

            if (!grid[checkRow]?.[checkCol] || grid[checkRow][checkCol].letter !== "") {
                canPlace = false;
                break;
            }
        }

        if (canPlace) {
            for (let i = 0; i < word.length; i++) {
                const placeRow = direction === "diagonal" ? row + i : direction === "vertical" ? row + i : row;
                const placeCol = direction === "diagonal" ? col + i : direction === "horizontal" ? col + i : col;

                grid[placeRow][placeCol].letter = word[i];
                grid[placeRow][placeCol].partOfWord = true;
            }
            placed = true;
        }
    }

    return placed;
};
