import { isSudokuSnapshot } from '../Home/Sudoku/SudokuSession';
import { isMineSweeperSnapshot } from '../Home/MineSweeper/MineSweeperSession';
import { isTileSnapshot } from '../Home/TwoZeroFourEight/TwoZeroFourEightSession';
import { isWordSearchSnapshot } from '../Home/WordSearch/WordSearchSession';
import { isCrosswordSnapshot } from '../Home/Crossword/CrosswordSession';
import { isMemorySnapshot } from '../Home/MemoryMatch/MemoryMatchSession';
import { isSimonSnapshot } from '../Home/SimonSays/SimonSaysSession';
import { isConnectSnapshot } from '../Home/ConnectFour/ConnectFourSession';
import type { SessionGameTitle } from '@/constants/GameSessionRoutes';
import type { SessionIdentity } from '@/db/Sessions/Sessions';

export const sessionSnapshotValidators: Record<SessionGameTitle, (data: unknown, identity: SessionIdentity) => boolean> = {
    Sudoku: isSudokuSnapshot,
    Minesweeper: isMineSweeperSnapshot,
    '2048': isTileSnapshot,
    'Word Search': isWordSearchSnapshot,
    Crossword: isCrosswordSnapshot,
    'Memory Match': isMemorySnapshot,
    'Simon Says': isSimonSnapshot,
    'Connect Four': isConnectSnapshot,
};
