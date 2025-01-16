import React, { useState, useEffect } from 'react';
import { StyleSheet } from 'react-native';
import { View } from '@/components/Themed';
import { generateSudokuPuzzle } from '@/utils/SudokuGenerator';

import SudokuBoard from './SudokuBoard';
import SudokuNumbers from './SudokuNumbers';

export default function SudokuGame() {
    const [difficulty, setDifficulty] = useState('Hard');
    const [board, setBoard] = useState<number[][]>([]);
    const [initialNumbers, setInitialNumbers] = useState<{ [key: string]: boolean }>({});
    const [selectedNumber, setSelectedNumber] = useState<number | null>(null);

    const handleInputChange = (row: number, col: number, value: string) => {
        if (initialNumbers[`${row}-${col}`]) return; // Prevent changing initial numbers
        const newBoard = [...board];
        newBoard[row][col] = parseInt(value) || 0;
        setBoard(newBoard);
    };

    const handleSelectNumber = (value: number) => {
        setSelectedNumber(value);
    };

    useEffect(() => {
        const newBoard = generateSudokuPuzzle(difficulty);
        setBoard(newBoard);
        const initialNums: { [key: string]: boolean } = {};
        newBoard.forEach((row: any[], rowIndex: any) => {
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
            <SudokuBoard board={board} handleInputChange={handleInputChange} selectedNumber={selectedNumber} initialNumbers={initialNumbers}/>
            <SudokuNumbers selectNumber={handleSelectNumber} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        alignItems: 'center',
    },
});