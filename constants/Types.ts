export type GameTitle =
  | "Sudoku"
  | "Ostrich Haul"
  | "Word Search"
  | "Crossword"
  | "Minesweeper"
  | "GoGoBird";

export type Difficulty = "Easy" | "Medium" | "Hard" | "Extreme";

export type Games = {
  id: number;
  title: string;
  description: string;
};

export type GameLogos = {
  Sudoku: "@/assets/gamelogo/sudokuLogo.jpg";
  GoGoBird: "@/assets/gamelogo/ostrichHaul.jpg";
  WordSearch: "@/assets/gamelogo/crosswordLogo.jpg";
  OstrichHaul: "@/assets/gamelogo/ostrichHaul.jpg";
  Crossword: "@/assets/gamelogo/crosswordLogo.jpg";
  Minesweeper: "@/assets/gamelogo/minesweeper.jpg";
};
