import React, { useState, useEffect } from 'react';
import { StyleSheet, TouchableOpacity, Keyboard, TouchableWithoutFeedback } from 'react-native';
import { View, Text } from '@/components/Themed';
import useTheme from '@/hooks/useTheme';
import { MaterialIcons } from '@expo/vector-icons';

export default function SudokuBoard({ board, handleInputChange, selectedNumber, initialNumbers, selectNumber }: { board: number[][], handleInputChange: (row: number, col: number, value: string) => void, selectedNumber: number | null, initialNumbers: { [key: string]: boolean }, selectNumber: (value: number) => void }) {
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

    const handlePress = (value: number) => {
        selectNumber(value);
    };

    const { primary, grayBackground, text } = useTheme();

    useEffect(() => {
        if (selectedTile && selectedNumber !== null) {
            handleInputChange(selectedTile.row, selectedTile.col, selectedNumber.toString());
            setSelectedTile(null); // Deselect the tile after updating
        }
    }, [selectedNumber]);

    const getCellStyle = (rowIndex: number, colIndex: number) => {
        const style = [styles.cell, { borderColor: primary }];
        if (rowIndex % 3 === 0) style.push(styles.thickTopBorder);
        if (colIndex % 3 === 0) style.push(styles.thickLeftBorder);
        if (rowIndex === 8) style.push(styles.thickBottomBorder);
        if (colIndex === 8) style.push(styles.thickRightBorder);
        if (selectedTile?.row === rowIndex && selectedTile?.col === colIndex) {
            style.push({ backgroundColor: grayBackground });
        }
        return style;
    };

    return (
        <>
            <View style={[styles.container, { borderColor: primary }]}>
                {board.map((row: number[], rowIndex: number) => (
                    <View key={rowIndex} style={styles.row}>
                        {row.map((cell: number, colIndex: number) => (
                            <TouchableWithoutFeedback key={colIndex} onPress={Keyboard.dismiss}>
                                <TouchableOpacity
                                    key={colIndex}
                                    style={getCellStyle(rowIndex, colIndex)}
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
            <View style={styles.numberContainer}>
                {[...Array(9)].map((_, index) => (
                    <TouchableOpacity 
                        key={index} 
                        style={[styles.numberButton, { backgroundColor: primary }]}
                        onPress={() => handlePress(index + 1)}
                        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                    >
                        <Text style={styles.numberButtonText}>{index + 1}</Text>
                    </TouchableOpacity>
                ))}
                <TouchableOpacity 
                    style={[styles.numberButton, { backgroundColor: primary }]}
                    onPress={() => handlePress(-1)}
                    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}    
                >
                    <MaterialIcons name="backspace" size={20} color={text} />
                </TouchableOpacity>
            </View>
        </>

    );
}

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 3,
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
    } as any,
    cellText: {
        textAlign: 'center',
        fontSize: 19,
    },
    initialCellText: {
        fontWeight: '800',
    },
    placedCellText: {
        opacity: 0.8,
    },
    numberContainer: {
        marginTop: '15%',
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        alignItems: 'center',
    },
    numberButton: {
        justifyContent: 'center',
        alignItems: 'center',
        padding: 16,
        marginVertical: 4,
        marginHorizontal: 2,
        borderRadius: 8,
    },
    thickTopBorder: {
        borderTopWidth: 3,
    },
    thickLeftBorder: {
        borderLeftWidth: 3,
    },
    thickBottomBorder: {
        borderBottomWidth: 3,
    },
    thickRightBorder: {
        borderRightWidth: 3,
    },
    numberButtonText: {
        fontSize: 16,
    },
});