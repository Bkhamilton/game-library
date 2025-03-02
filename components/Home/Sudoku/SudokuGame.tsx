import React, { useState, useEffect, useContext } from 'react';
import { StyleSheet } from 'react-native';
import { View } from '@/components/Themed';
import { generateSudokuPuzzle, checkMove } from '@/utils/SudokuGenerator';
import { useLocalSearchParams, useRouter } from 'expo-router';

import SudokuBoard from './SudokuBoard';
import SudokuHeader from './SudokuHeader';
import EndGameMessage from '@/components/Modals/EndGameMessage';
import { DBContext } from '@/contexts/DBContext';

export default function SudokuGame() {
    const { difficulty } = useLocalSearchParams();
    const [board, setBoard] = useState<number[][]>([]);
    const [solvedBoard, setSolvedBoard] = useState<number[][]>([]);
    const [initialNumbers, setInitialNumbers] = useState<{ [key: string]: boolean }>({});
    const [selectedNumber, setSelectedNumber] = useState<number | null>(null);

    const [endGameModalVisible, setEndGameModalVisible] = useState(false);
    const [endGameResult, setEndGameResult] = useState<boolean>(false);

    const [wrongCount, setWrongCount] = useState(0);
    const [lossModalShown, setLossModalShown] = useState(false);

    const { games } = useContext(DBContext);
    const curGame = games.find((game) => game.title === "Sudoku");

    const handleWin = () => {
        // insertWin(db, 'Sudoku', difficulty);
        setEndGameResult(true);
        setEndGameModalVisible(true);
    }

    const handleLoss = () => {
        // insertLoss(db, 'Sudoku', difficulty);
        setEndGameResult(false);
        setEndGameModalVisible(true);
        setLossModalShown(true);
    }

    const handleInputChange = (row: number, col: number, value: string) => {
        if (initialNumbers[`${row}-${col}`]) return; // Prevent changing initial numbers
        const newBoard = [...board];
        const intValue = parseInt(value) || 0;
        // If the value is -1, clear the cell
        if (intValue === -1) {
            newBoard[row][col] = 0;
            setBoard(newBoard);
            return;
        }
        if (checkMove(solvedBoard, row, col, intValue)) {
            newBoard[row][col] = intValue;
            setBoard(newBoard);
        } else {
            setWrongCount(prevCount => prevCount + 1);
        }
        // Check if the board is solved
        if (JSON.stringify(newBoard) === JSON.stringify(solvedBoard)) {
            handleWin();
        }
        // Check if the board is lost
        if (wrongCount >= 3 && !lossModalShown) {
            handleLoss();
        }
    };

    const handleSelectNumber = (value: number) => {
        setSelectedNumber(value);
    };

    useEffect(() => {
        const { completeBoard, puzzleBoard } = generateSudokuPuzzle(difficulty);
        setBoard(puzzleBoard);
        setSolvedBoard(completeBoard);
        const initialNums: { [key: string]: boolean } = {};
        puzzleBoard.forEach((row: any[], rowIndex: any) => {
            row.forEach((cell: number, colIndex: any) => {
                if (cell !== 0) {
                    initialNums[`${rowIndex}-${colIndex}`] = true;
                }
            });
        });
        setInitialNumbers(initialNums);
    }, [difficulty]);

    const router = useRouter();

    const restartGame = (difficulty: string) => {
        setWrongCount(0);
        setLossModalShown(false);
        router.push(`/sudoku?difficulty=${difficulty}`);
    }

    return (
        <View style={styles.container}>
            <SudokuHeader 
                wrongCount={wrongCount}
            />
            <SudokuBoard 
                board={board} 
                handleInputChange={handleInputChange} 
                selectedNumber={selectedNumber} 
                initialNumbers={initialNumbers}
                selectNumber={handleSelectNumber}
            />
            <EndGameMessage 
                visible={endGameModalVisible} 
                close={() => setEndGameModalVisible(false)} 
                win={endGameResult} 
                game={curGame} 
                initialDifficulty={difficulty} 
                restartGame={restartGame}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        paddingTop: 24,
    },
});