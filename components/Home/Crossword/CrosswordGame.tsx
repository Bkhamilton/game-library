import React, { useState } from 'react';
import { TextInput, StyleSheet, ScrollView } from 'react-native';
import { Text, View } from '@/components/Themed';

interface CrosswordCell {
    letter: string;
    isActive: boolean;
    number?: number;
}

const CrosswordGame = () => {
    // Sample crossword puzzle data
    const puzzleData = [
        ['', '', 'H', 'E', 'L', 'L', 'O', '', ''],
        ['', '', '', 'X', '', '', '', '', ''],
        ['', '', '', 'P', '', '', '', '', ''],
        ['W', 'O', 'R', 'L', 'D', '', '', '', ''],
        ['', '', '', 'O', '', '', '', '', ''],
        ['', '', '', 'R', '', '', '', '', ''],
        ['', '', '', 'E', '', '', '', '', ''],
    ];

    const [grid, setGrid] = useState<CrosswordCell[][]>(
        puzzleData.map((row) =>
            row.map((cell) => ({
                letter: cell,
                isActive: cell !== '',
            }))
        )
    );

    const handleCellChange = (rowIndex: number, colIndex: number, value: string) => {
        const newGrid = [...grid];
        newGrid[rowIndex][colIndex].letter = value.toUpperCase();
        setGrid(newGrid);
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.title}>Crossword Puzzle</Text>
            <View style={styles.grid}>
                {grid.map((row, rowIndex) => (
                    <View key={rowIndex} style={styles.row}>
                        {row.map((cell, colIndex) => (
                            <View
                                key={`${rowIndex}-${colIndex}`}
                                style={[
                                    styles.cell,
                                    !cell.isActive && styles.inactiveCell,
                                ]}
                            >
                                {cell.isActive && (
                                    <TextInput
                                        style={styles.input}
                                        maxLength={1}
                                        value={cell.letter}
                                        onChangeText={(value) =>
                                            handleCellChange(rowIndex, colIndex, value)
                                        }
                                    />
                                )}
                            </View>
                        ))}
                    </View>
                ))}
            </View>
            <View style={styles.clues}>
                <Text style={styles.cluesTitle}>Clues:</Text>
                <Text>Across:</Text>
                <Text>1. Common greeting</Text>
                <Text>2. Planet Earth</Text>
                <Text>Down:</Text>
                <Text>1. To investigate or discover</Text>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 20,
        alignItems: 'center',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    grid: {
        borderWidth: 2,
        borderColor: '#000',
    },
    row: {
        flexDirection: 'row',
    },
    cell: {
        width: 40,
        height: 40,
        borderWidth: 0.5,
        borderColor: '#000',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
    },
    inactiveCell: {
        backgroundColor: '#000',
    },
    input: {
        width: '100%',
        height: '100%',
        textAlign: 'center',
        fontSize: 20,
        textTransform: 'uppercase',
    },
    clues: {
        marginTop: 20,
        alignSelf: 'flex-start',
    },
    cluesTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    },
});

export default CrosswordGame;