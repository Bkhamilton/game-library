import React from 'react';
import { StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { View, Text } from '@/components/Themed';
import useTheme from '@/hooks/useTheme';
import { Board, Cell, ROWS, COLS } from '@/utils/ConnectFourGenerator';

interface ConnectFourBoardProps {
    board: Board;
    onColumnPress: (col: number) => void;
    isGameRunning: boolean;
}

export default function ConnectFourBoard({ board, onColumnPress, isGameRunning }: ConnectFourBoardProps) {
    const { primary, secondary, text } = useTheme();
    
    // Calculate cell size based on screen dimensions
    const screenWidth = Dimensions.get('window').width;
    const maxBoardWidth = screenWidth - 24; // Account for padding
    const cellSize = Math.min(maxBoardWidth / (COLS + 1), 50); // Leave space for gaps
    const boardWidth = cellSize * COLS + (COLS - 1) * 4; // Cells + gaps
    const boardHeight = cellSize * ROWS + (ROWS - 1) * 4; // Cells + gaps
    
    // Get disc color based on cell value
    const getDiscColor = (cell: Cell): string => {
        if (cell === 'player') return '#ff4757'; // Red for player
        if (cell === 'ai') return '#ffd700'; // Yellow for AI
        return '#ecf0f1'; // Empty/white
    };
    
    return (
        <View style={styles.container}>
            <View style={[styles.board, { 
                width: boardWidth, 
                height: boardHeight,
                backgroundColor: '#2c3e50',
            }]}>
                {board.map((row, rowIndex) => (
                    <View key={rowIndex} style={styles.row}>
                        {row.map((cell, colIndex) => (
                            <TouchableOpacity
                                key={`${rowIndex}-${colIndex}`}
                                style={[
                                    styles.cell,
                                    {
                                        width: cellSize,
                                        height: cellSize,
                                    }
                                ]}
                                onPress={() => isGameRunning && onColumnPress(colIndex)}
                                disabled={!isGameRunning}
                            >
                                <View 
                                    style={[
                                        styles.disc,
                                        {
                                            width: cellSize * 0.85,
                                            height: cellSize * 0.85,
                                            backgroundColor: getDiscColor(cell),
                                            borderColor: cell === 'empty' ? '#34495e' : getDiscColor(cell),
                                        }
                                    ]}
                                />
                            </TouchableOpacity>
                        ))}
                    </View>
                ))}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: 40,
    },
    board: {
        borderRadius: 10,
        paddingHorizontal: 8,
        paddingVertical: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    row: {
        flexDirection: 'row',
        gap: 1,
        marginBottom: 4,
    },
    cell: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    disc: {
        borderRadius: 100, // Make it circular
        borderWidth: 2,
    },
});
