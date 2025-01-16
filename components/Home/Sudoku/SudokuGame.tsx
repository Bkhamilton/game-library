import React, { useState } from 'react';
import { StyleSheet } from 'react-native';
import { View, Text } from '@/components/Themed';
import { generateSudokuPuzzle } from '@/utils/SudokuGenerator';

import SudokuBoard from './SudokuBoard';
import SudokuNumbers from './SudokuNumbers';

export default function SudokuGame() {
    const [difficulty, setDifficulty] = useState('Hard');
    const [board, setBoard] = useState(generateSudokuPuzzle(difficulty));
    const [selectedNumber, setSelectedNumber] = useState<number | null>(null);

    const handleInputChange = (row: number, col: number, value: string) => {
        const newBoard = [...board];
        newBoard[row][col] = parseInt(value) || 0;
        setBoard(newBoard);
    };

    const handleSelectNumber = (value: number) => {
        setSelectedNumber(value);
    };

    return (
        <View style={styles.container}>
            <SudokuBoard board={board} handleInputChange={handleInputChange} selectedNumber={selectedNumber}/>
            <SudokuNumbers selectNumber={handleSelectNumber} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    row: {
        flexDirection: 'row',
    },
    cell: {
        width: 40,
        height: 40,
        borderWidth: 1,
        borderColor: 'gold',
        textAlign: 'center',
        color: 'blue',
    },
});