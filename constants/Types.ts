export type GameTitle = "Sudoku" | "Ostrich Haul" | "Word Search" | "Crossword" | "Minesweeper" | "GoGoBird" | "2048" | "Memory Match";

export type Difficulty = "Easy" | "Medium" | "Hard" | "Extreme";

export type Games = {
    id: number;
    title: string;
    description: string;
};