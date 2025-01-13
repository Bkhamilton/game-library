import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, TextInput, Keyboard, TouchableWithoutFeedback } from 'react-native';

const initialBoard = [
    [5, 3, 0, 0, 7, 0, 0, 0, 0],
    [6, 0, 0, 1, 9, 5, 0, 0, 0],
    [0, 9, 8, 0, 0, 0, 0, 6, 0],
    [8, 0, 0, 0, 6, 0, 0, 0, 3],
    [4, 0, 0, 8, 0, 3, 0, 0, 1],
    [7, 0, 0, 0, 2, 0, 0, 0, 6],
    [0, 6, 0, 0, 0, 0, 2, 8, 0],
    [0, 0, 0, 4, 1, 9, 0, 0, 5],
    [0, 0, 0, 0, 8, 0, 0, 7, 9],
];

export default function SudokuGame() {
    const [board, setBoard] = useState(initialBoard);

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