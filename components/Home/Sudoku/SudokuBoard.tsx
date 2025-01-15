import React from 'react';
import { StyleSheet, TextInput, Keyboard, TouchableWithoutFeedback } from 'react-native';
import { View } from '@/components/Themed';

export default function SudokuBoard({ board, handleInputChange }: { board: number[][], handleInputChange: (row: number, col: number, value: string) => void }) {
    return (
        <View style={styles.container}>
            {board.map((row: number[], rowIndex: number) => (
                <View key={rowIndex} style={styles.row}>
                    {row.map((cell: number, colIndex: number) => (
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