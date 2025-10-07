// Memory Match Game Generator and Logic

export type Card = {
    id: string;
    value: string;
    isFlipped: boolean;
    isMatched: boolean;
};

export type Difficulty = 'Easy' | 'Medium' | 'Hard' | string;

// Card values using emojis for visual representation
const CARD_VALUES = [
    '🎮', '🎯', '🎲', '🎨', '🎭', '🎪', '🎬', '🎤',
    '🎧', '🎼', '🎹', '🎺', '🎸', '🎻', '🥁', '🎳',
    '⚽', '🏀', '🏈', '⚾', '🎾', '🏐', '🏉', '🎱',
    '🏓', '🏸', '🏒', '🏑', '🥊', '🥋', '🎿', '⛷️'
];

// Get board dimensions based on difficulty
export const getBoardSize = (difficulty: Difficulty): { rows: number; cols: number } => {
    switch (difficulty) {
        case 'Easy':
            return { rows: 4, cols: 4 }; // 16 cards (8 pairs)
        case 'Medium':
            return { rows: 6, cols: 6 }; // 36 cards (18 pairs)
        case 'Hard':
            return { rows: 8, cols: 8 }; // 64 cards (32 pairs)
        default:
            return { rows: 4, cols: 4 };
    }
};

// Get the number of pairs needed for a difficulty
const getPairsCount = (difficulty: Difficulty): number => {
    const { rows, cols } = getBoardSize(difficulty);
    return (rows * cols) / 2;
};

// Get max allowed incorrect guesses based on difficulty
export const getMaxIncorrectGuesses = (difficulty: Difficulty): number => {
    switch (difficulty) {
        case 'Easy':
            return 20; // More forgiving
        case 'Medium':
            return 30; // Moderate
        case 'Hard':
            return 50; // More attempts needed for larger board
        default:
            return 20;
    }
};

// Shuffle array using Fisher-Yates algorithm
const shuffleArray = <T,>(array: T[]): T[] => {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
};

// Initialize the board with cards
export const initializeBoard = (difficulty: Difficulty = 'Easy'): Card[] => {
    const pairsCount = getPairsCount(difficulty);
    const selectedValues = CARD_VALUES.slice(0, pairsCount);
    
    // Create pairs of cards
    const cards: Card[] = [];
    selectedValues.forEach((value, index) => {
        // First card of the pair
        cards.push({
            id: `${index}-a`,
            value,
            isFlipped: false,
            isMatched: false,
        });
        // Second card of the pair
        cards.push({
            id: `${index}-b`,
            value,
            isFlipped: false,
            isMatched: false,
        });
    });
    
    // Shuffle the cards
    return shuffleArray(cards);
};

// Check if two cards match
export const checkMatch = (card1: Card, card2: Card): boolean => {
    return card1.value === card2.value;
};

// Check if the game is won (all cards are matched)
export const checkWin = (cards: Card[]): boolean => {
    return cards.every(card => card.isMatched);
};
