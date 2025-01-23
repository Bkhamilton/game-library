import React, { useState, useEffect } from 'react';
import { StyleSheet } from 'react-native';
import { View, Text } from '@/components/Themed';
import { initializeBoard } from '@/utils/MineSweeperGenerator';
import { useLocalSearchParams } from 'expo-router';
import Cell from './Cell';
import Timer from '../Helpers/Timer';
import useTheme from '@/hooks/useTheme';
import MineSweeperHeader from './MineSweeperHeader';

export interface CellProps {
    isRevealed: boolean;
    isFlagged: boolean;
    isMine: boolean;
    adjacentMines: number;
    onClick: () => void;
    onLongPress: () => void;
}

export interface GameState {
    board: CellProps[][];
    minesCount: number;
    isGameOver: boolean;
    isGameWon: boolean;
    timer: number;
}

export interface Board {
    rows: number;
    cols: number;
    mines: number;
}

const GameBoard: React.FC = () => {
    const { difficulty } = useLocalSearchParams();
    const [board, setBoard] = useState<CellProps[][]>([]);
    const [gameState, setGameState] = useState<string>('active');
    const [minesCount, setMinesCount] = useState(10); // Example mine count
    const [rows, setRows] = useState(10); // Example row count
    const [cols, setCols] = useState(10); // Example column count

    const [isActive, setIsActive] = useState(true);

    useEffect(() => {
        const newBoard = initializeBoard(difficulty);
        setBoard(newBoard);
    }, []);

    const handleCellClick = (row: number, col: number, isLongPress: boolean) => {
        if (gameState !== 'active') return;
    
        const newBoard = [...board];
        const cell = newBoard[row][col];
    
        if (isLongPress) {
            // Toggle flag
            if (!cell.isRevealed) {
                cell.isFlagged = !cell.isFlagged;
            }
        } else {
            // Reveal cell
            if (!cell.isFlagged && !cell.isRevealed) {
                cell.isRevealed = true;
                if (cell.isMine) {
                    setGameState('lost');
                    setIsActive(false);
                } else {
                    // Reveal adjacent cells if no adjacent mines
                    if (cell.adjacentMines === 0) {
                        revealAdjacentCells(newBoard, row, col);
                    }
                    // Check if the game is won
                    if (checkWin(newBoard)) {
                        setGameState('won');
                        setIsActive(false);
                    }
                }
            }
        }
    
        setBoard(newBoard);
    };

    const revealAdjacentCells = (board: CellProps[][], row: number, col: number) => {
        const directions = [
            [-1, -1], [-1, 0], [-1, 1],
            [0, -1],         [0, 1],
            [1, -1], [1, 0], [1, 1]
        ];
    
        const stack = [[row, col]];
    
        while (stack.length > 0) {
            const [currentRow, currentCol] = stack.pop()!;
            const cell = board[currentRow][currentCol];
    
            if (!cell.isRevealed && !cell.isFlagged) {
                cell.isRevealed = true;
    
                if (cell.adjacentMines === 0) {
                    for (const [dx, dy] of directions) {
                        const newRow = currentRow + dx;
                        const newCol = currentCol + dy;
    
                        if (
                            newRow >= 0 && newRow < rows &&
                            newCol >= 0 && newCol < cols &&
                            !board[newRow][newCol].isRevealed
                        ) {
                            stack.push([newRow, newCol]);
                        }
                    }
                }
            }
        }
    };
    
    const checkWin = (board: CellProps[][]): boolean => {
        // Logic to check if the game is won
        return false;
    };

    const setSize = (difficulty: string) => {
        switch (difficulty) {
            case 'Easy':
                return 40;
            case 'Medium':
                return 32;
            case 'Hard':
                return 24;
            case 'Extreme':
                return 20;
            default:
                return 40;
        }
    }

    const renderCell = (row: number, col: number) => {
        const cell = board[row][col];
        const cellSize = setSize(difficulty);
        return (
            <Cell
                key={`${row}-${col}`}
                revealed={cell.isRevealed}
                flagged={cell.isFlagged}
                mine={cell.isMine}
                adjacentMines={cell.adjacentMines}
                onPress={() => handleCellClick(row, col, false)}
                onLongPress={() => handleCellClick(row, col, true)}
                size={cellSize} // Pass cell size as prop
            />
        );
    };

    const { primary, grayBackground } = useTheme();

    return (
        <View style={styles.container}>
            <MineSweeperHeader
                minesCount={minesCount}
                gameState={gameState}
            />
            <View style={styles.board}>
                {board.map((row, rowIndex) => (
                    <View key={rowIndex} style={styles.row}>
                        {row.map((cell, colIndex) => renderCell(rowIndex, colIndex))}
                    </View>
                ))}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        paddingTop: '25%',
    },
    board: {
        // Styles for the game board
    },
    row: {
        flexDirection: 'row',
    },
});

export default GameBoard;