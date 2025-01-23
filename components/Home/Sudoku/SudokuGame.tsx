import React, { useState, useEffect } from 'react';
import { StyleSheet } from 'react-native';
import { View } from '@/components/Themed';
import { generateSudokuPuzzle, checkMove } from '@/utils/SudokuGenerator';
import { useLocalSearchParams } from 'expo-router';

import SudokuBoard from './SudokuBoard';
import SudokuHeader from './SudokuHeader';
import VictoryMessage from '@/components/Modals/VictoryMessage'
import LossMessage from '@/components/Modals/LossMessage'
import Difficulties from '@/constants/Difficulties';

export default function SudokuGame() {
    const { difficulty } = useLocalSearchParams();
    const [board, setBoard] = useState<number[][]>([]);
    const [solvedBoard, setSolvedBoard] = useState<number[][]>([]);
    const [initialNumbers, setInitialNumbers] = useState<{ [key: string]: boolean }>({});
    const [selectedNumber, setSelectedNumber] = useState<number | null>(null);

    const [lossModalVisible, setLossModalVisible] = useState(false);
    const [victoryModalVisible, setVictoryModalVisible] = useState(false);

    const [wrongCount, setWrongCount] = useState(0);
    const [lossModalShown, setLossModalShown] = useState(false);

    const handleInputChange = (row: number, col: number, value: string) => {
        if (initialNumbers[`${row}-${col}`]) return; // Prevent changing initial numbers
        const newBoard = [...board];
        const intValue = parseInt(value) || 0;
        if (checkMove(solvedBoard, row, col, intValue)) {
            newBoard[row][col] = intValue;
            setBoard(newBoard);
        } else {
            setWrongCount(prevCount => prevCount + 1);
        }
        // Check if the board is solved
        if (JSON.stringify(newBoard) === JSON.stringify(solvedBoard)) {
            setVictoryModalVisible(true);
        }
        // Check if the board is lost
        if (wrongCount >= 3 && !lossModalShown) {
            setLossModalVisible(true);
            setLossModalShown(true); // Set the flag to true to indicate the modal has been shown
        }
    };

    const handleSelectNumber = (value: number) => {
        setSelectedNumber(value);
    };

    const resetBoard = () => {
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
        setWrongCount(0);
        setLossModalShown(false);
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
            <LossMessage 
                visible={lossModalVisible}
                close={() => setLossModalVisible(false)}
                title={"You Lost!"}
                difficulties={Difficulties['Sudoku']}
            />
            <VictoryMessage 
                visible={victoryModalVisible}
                close={() => setVictoryModalVisible(false)}
                title={"You Won!"}
                difficulties={Difficulties['Sudoku']}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        paddingTop: 24,
    },
});