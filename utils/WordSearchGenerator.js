// Description: Word search generator utility functions

// Update generateGrid function to use dynamic gridSize
export const initializeGrid = (gridSize, words) => {
    // Create empty grid using passed gridSize instead of constant
    let newGrid = Array(gridSize)
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

    return newGrid;
};

// Update placeWord function to use dynamic gridSize
export const placeWord = (grid, word, gridSize) => {
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