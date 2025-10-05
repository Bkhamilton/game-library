import React from 'react';
import { StyleSheet, Dimensions } from 'react-native';
import { View, Text } from '@/components/Themed';
import useTheme from '@/hooks/useTheme';

interface TwoZeroFourEightBoardProps {
    board: (number | null)[][];
}

export default function TwoZeroFourEightBoard({ board }: TwoZeroFourEightBoardProps) {
    const { primary, secondary } = useTheme();
    
    // Get cell size based on screen dimensions
    const screenWidth = Dimensions.get('window').width;
    const cellSize = Math.min((screenWidth - 80) / 4, 90);
    const boardSize = cellSize * 4 + 5 * 8; // 4 cells + 5 gaps
    
    // Get tile color based on value
    const getTileColor = (value: number | null): string => {
        if (!value) return '#cdc1b4';
        const colors: { [key: number]: string } = {
            2: '#eee4da',
            4: '#ede0c8',
            8: '#f2b179',
            16: '#f59563',
            32: '#f67c5f',
            64: '#f65e3b',
            128: '#edcf72',
            256: '#edcc61',
            512: '#edc850',
            1024: '#edc53f',
            2048: '#edc22e',
        };
        return colors[value] || '#3c3a32';
    };
    
    // Get text color based on value
    const getTextColor = (value: number | null): string => {
        if (!value || value <= 4) return '#776e65';
        return '#f9f6f2';
    };
    
    return (
        <View style={[styles.container, { width: boardSize, height: boardSize, borderColor: primary }]}>
            {board.map((row, rowIndex) => (
                <View key={rowIndex} style={styles.row}>
                    {row.map((cell, colIndex) => (
                        <View
                            key={`${rowIndex}-${colIndex}`}
                            style={[
                                styles.cell,
                                {
                                    width: cellSize,
                                    height: cellSize,
                                    backgroundColor: getTileColor(cell),
                                }
                            ]}
                        >
                            {cell !== null && (
                                <Text
                                    style={[
                                        styles.cellText,
                                        {
                                            color: getTextColor(cell),
                                            fontSize: cell >= 1000 ? cellSize * 0.35 : cellSize * 0.45,
                                        }
                                    ]}
                                >
                                    {cell}
                                </Text>
                            )}
                        </View>
                    ))}
                </View>
            ))}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        borderWidth: 3,
        borderRadius: 8,
        padding: 8,
        gap: 8,
    },
    row: {
        flexDirection: 'row',
        gap: 8,
    },
    cell: {
        borderRadius: 6,
        justifyContent: 'center',
        alignItems: 'center',
    },
    cellText: {
        fontWeight: 'bold',
    },
});
