import React, { useState, useEffect } from 'react';
import { StyleSheet } from 'react-native';
import { View } from '@/components/Themed';
import { initializeBoard, revealAdjacentCells, getMineCount, checkWin, setSize } from '@/utils/MineSweeperGenerator';
import { useLocalSearchParams } from 'expo-router';
import Cell from './Cell';
import MineSweeperHeader from './MineSweeperHeader';
import VictoryMessage from '@/components/Modals/VictoryMessage'
import LossMessage from '@/components/Modals/LossMessage'
import useTheme from '@/hooks/useTheme';
import Difficulties from '@/constants/Difficulties';
import { useRouter } from 'expo-router';

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
    const [minesCount, setMinesCount] = useState(10);

    const [lossModalVisible, setLossModalVisible] = useState(false);
    const [victoryModalVisible, setVictoryModalVisible] = useState(false);

    const [isActive, setIsActive] = useState(true);

    useEffect(() => {
        console.log('difficulty', difficulty);
        const newBoard = initializeBoard(difficulty);
        const minesCount = getMineCount(difficulty);
        setGameState('active');
        setBoard(newBoard);
        setMinesCount(minesCount);
    }, [difficulty]);

    const handleCellClick = (row: number, col: number, isLongPress: boolean) => {
        if (gameState !== 'active') return;
    
        const newBoard = [...board];
        const cell = newBoard[row][col];
    
        if (isLongPress) {
            // Toggle flag
            if (!cell.isRevealed) {
                cell.isFlagged = !cell.isFlagged;
                setMinesCount(prevCount => cell.isFlagged ? prevCount - 1 : prevCount + 1);
            }
        } else {
            // Reveal cell
            if (!cell.isFlagged && !cell.isRevealed) {
                if (cell.isMine) {
                    setGameState('lost');
                    setLossModalVisible(true);
                    setIsActive(false);
                } else {
                    // Reveal adjacent cells if no adjacent mines
                    if (cell.adjacentMines === 0) {
                        revealAdjacentCells(newBoard, row, col);
                    }
                    // Check if the game is won
                    if (checkWin(newBoard)) {
                        setGameState('won');
                        setVictoryModalVisible(true);
                        setIsActive(false);
                    }
                }
                cell.isRevealed = true;
            }
        }
    
        setBoard(newBoard);
    };

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
                size={cellSize}
            />
        );
    };

    const router = useRouter();

    const restartGame = (difficulty: string) => {
        router.push(`/minesweeper?difficulty=${difficulty}`);
    }

    const { primary } = useTheme();
 
    return (
        <View style={styles.container}>
            <MineSweeperHeader
                minesCount={minesCount}
                gameState={gameState}
            />
            <View style={[styles.board, { borderColor: primary }]}>
                {board.map((row, rowIndex) => (
                    <View key={rowIndex} style={styles.row}>
                        {row.map((cell, colIndex) => renderCell(rowIndex, colIndex))}
                    </View>
                ))}
            </View>
            <LossMessage 
                visible={lossModalVisible}
                close={() => setLossModalVisible(false)}
                title={"You Lost!"}
                difficulties={Difficulties['MineSweeper']}
                restartGame={restartGame}
            />
            <VictoryMessage 
                visible={victoryModalVisible}
                close={() => setVictoryModalVisible(false)}
                title={"You Won!"}
                difficulties={Difficulties['MineSweeper']}
                restartGame={restartGame}
            />
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
        borderWidth: 4,
    },
    row: {
        flexDirection: 'row',
    },
});

export default GameBoard;