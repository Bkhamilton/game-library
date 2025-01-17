import React, { useState, useEffect } from 'react';
import { StyleSheet, TouchableOpacity, Keyboard, TouchableWithoutFeedback } from 'react-native';
import { View, Text } from '@/components/Themed';
import useTheme from '@/hooks/useTheme';

export default function SudokuBoard({ board, handleInputChange, selectedNumber, initialNumbers }: { board: number[][], handleInputChange: (row: number, col: number, value: string) => void, selectedNumber: number | null, initialNumbers: { [key: string]: boolean } }) {
    const [selectedTile, setSelectedTile] = useState<{ row: number, col: number } | null>(null);

    const handleTilePress = (row: number, col: number) => {
        if (selectedTile) {
            // clear the selected tile
            if (selectedTile.row === row && selectedTile.col === col) {
                setSelectedTile(null);
                return;
            }
        }
        setSelectedTile({ row, col });
    };

    const { primary, grayBackground } = useTheme();

    useEffect(() => {
        if (selectedTile && selectedNumber !== null) {
            handleInputChange(selectedTile.row, selectedTile.col, selectedNumber.toString());
            setSelectedTile(null); // Deselect the tile after updating
        }
    }, [selectedNumber]);

    return (
        <View style={[styles.container, { borderColor: primary }]}>
            {board.map((row: number[], rowIndex: number) => (
                <View key={rowIndex} style={styles.row}>
                    {row.map((cell: number, colIndex: number) => (
                        <TouchableWithoutFeedback key={colIndex} onPress={Keyboard.dismiss}>
                            <TouchableOpacity
                                key={colIndex}
                                style={[
                                    styles.cell,
                                    {
                                        borderColor: primary,
                                        backgroundColor: selectedTile?.row === rowIndex && selectedTile?.col === colIndex ? grayBackground : 'transparent'
                                    }
                                ]}
                                onPress={() => handleTilePress(rowIndex, colIndex)}
                            >
                                <Text style={[styles.cellText, initialNumbers[`${rowIndex}-${colIndex}`] ? styles.initialCellText : styles.placedCellText]}>
                                    {cell === 0 ? '' : cell.toString()}
                                </Text>
                            </TouchableOpacity>
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
        borderWidth: 4,
        borderRadius: 2,
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
        justifyContent: 'center',
        alignItems: 'center',
    },
    cellText: {
        textAlign: 'center',
    },
    initialCellText: {
        fontWeight: '800',
    },
    placedCellText: {
        opacity: 0.8,
    },
});