// Simon Says Game Generator and Logic

export type Difficulty = 'Easy' | 'Medium' | 'Hard' | string;

export type TileColor = 'red' | 'blue' | 'green' | 'yellow' | 'purple' | 'orange' | 'pink' | 'cyan' | 'lime';

export interface DifficultySettings {
    tileCount: number;
    gridLayout: { rows: number; cols: number };
    initialSpeed: number; // milliseconds per tile flash
    speedDecrement: number; // how much faster each round
    minSpeed: number; // fastest speed possible
}

// Difficulty settings for Simon Says
export const DIFFICULTY_SETTINGS: Record<string, DifficultySettings> = {
    Easy: {
        tileCount: 4,
        gridLayout: { rows: 2, cols: 2 },
        initialSpeed: 800,
        speedDecrement: 20,
        minSpeed: 400,
    },
    Medium: {
        tileCount: 6,
        gridLayout: { rows: 2, cols: 3 },
        initialSpeed: 600,
        speedDecrement: 30,
        minSpeed: 250,
    },
    Hard: {
        tileCount: 9,
        gridLayout: { rows: 3, cols: 3 },
        initialSpeed: 500,
        speedDecrement: 40,
        minSpeed: 150,
    },
};

// Available tile colors
const TILE_COLORS: TileColor[] = ['red', 'blue', 'green', 'yellow', 'purple', 'orange', 'pink', 'cyan', 'lime'];

// Get tile colors based on difficulty
export const getTileColors = (difficulty: Difficulty): TileColor[] => {
    const settings = DIFFICULTY_SETTINGS[difficulty] || DIFFICULTY_SETTINGS.Easy;
    return TILE_COLORS.slice(0, settings.tileCount);
};

// Get difficulty settings
export const getDifficultySettings = (difficulty: Difficulty): DifficultySettings => {
    return DIFFICULTY_SETTINGS[difficulty] || DIFFICULTY_SETTINGS.Easy;
};

// Generate a random tile index
export const generateRandomTile = (tileCount: number): number => {
    return Math.floor(Math.random() * tileCount);
};

// Add a new tile to the sequence
export const addToSequence = (currentSequence: number[], tileCount: number): number[] => {
    const newTile = generateRandomTile(tileCount);
    return [...currentSequence, newTile];
};

// Calculate current playback speed based on round
export const calculatePlaybackSpeed = (round: number, settings: DifficultySettings): number => {
    const speed = settings.initialSpeed - (round * settings.speedDecrement);
    return Math.max(speed, settings.minSpeed);
};

// Check if user input matches the sequence
export const checkSequenceMatch = (userSequence: number[], targetSequence: number[]): boolean => {
    if (userSequence.length !== targetSequence.length) {
        return false;
    }
    return userSequence.every((tile, index) => tile === targetSequence[index]);
};

// Check if partial sequence is correct (for in-progress validation)
export const checkPartialSequence = (userSequence: number[], targetSequence: number[]): boolean => {
    if (userSequence.length > targetSequence.length) {
        return false;
    }
    return userSequence.every((tile, index) => tile === targetSequence[index]);
};

// Get color hex value for a tile color
export const getColorHex = (color: TileColor): string => {
    const colorMap: Record<TileColor, string> = {
        red: '#FF4444',
        blue: '#4444FF',
        green: '#44FF44',
        yellow: '#FFFF44',
        purple: '#AA44FF',
        orange: '#FF8844',
        pink: '#FF44AA',
        cyan: '#44FFFF',
        lime: '#AAFF44',
    };
    return colorMap[color];
};

// Get lighter color for active/highlight state
export const getLightColorHex = (color: TileColor): string => {
    const lightColorMap: Record<TileColor, string> = {
        red: '#FF8888',
        blue: '#8888FF',
        green: '#88FF88',
        yellow: '#FFFF88',
        purple: '#CC88FF',
        orange: '#FFAA88',
        pink: '#FF88CC',
        cyan: '#88FFFF',
        lime: '#CCFF88',
    };
    return lightColorMap[color];
};
