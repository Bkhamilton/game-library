import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, TextInput, Keyboard, TouchableWithoutFeedback } from 'react-native';
import { generateSudokuPuzzle } from '@/utils/SudokuGenerator';

export default function SudokuGame() {
    const [board, setBoard] = useState(generateSudokuPuzzle('Hard'));

    const handleInputChange = (row: number, col: number, value: string) => {
        const newBoard = [...board];
        newBoard[row][col] = parseInt(value) || 0;
        setBoard(newBoard);
    };

    return (
        <View style={styles.container}>
            {board.map((row, rowIndex) => (
                <View key={rowIndex} style={styles.row}>
                    {row.map((cell, colIndex) => (
                        <TouchableWithoutFeedback key={colIndex} onPress={Keyboard.dismiss}>
                            <TextInput
                                key={colIndex}
                                style={styles.cell}
                                keyboardType="numeric"
                                maxLength={1}
                                value={cell === 0 ? '' : cell.toString()}
                                onChangeText={(value) => handleInputChange(rowIndex, colIndex, value)}
                            />
                        </TouchableWithoutFeedback>
                    ))}
                </View>
            ))}
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