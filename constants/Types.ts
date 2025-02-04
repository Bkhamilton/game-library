import sudokuLogo from "@/assets/images/gamelogo/sudokuLogo.jpg";
import gogoBirdLogo from "@/assets/images/gamelogo/gogoBirdLogo.jpg";
import wordSearchLogo from "@/assets/images/gamelogo/wordSearchLogo.jpg";
import ostrichHaulLogo from "@/assets/images/gamelogo/ostrichHaulLogo.jpg";
import crosswordLogo from "@/assets/images/gamelogo/crosswordLogo.jpg";
import minesweeperLogo from "../assets/images/gamelogo/minesweeperLogo.jpg";

export type GameTitle = "Sudoku" | "Ostrich Haul" | "Word Search" | "Crossword" | "Minesweeper" | "GoGoBird";

export type Difficulty = "Easy" | "Medium" | "Hard" | "Extreme";

export type Games = {
    id: number;
    title: string;
    description: string;
};

export const GameLogos = {
    Sudoku: sudokuLogo,
    GoGoBird: gogoBirdLogo,
    "Word Search": wordSearchLogo,
    "Ostrich Haul": ostrichHaulLogo,
    Crossword: crosswordLogo,
    Minesweeper: minesweeperLogo,
};
