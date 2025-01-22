import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { Text } from '@/components/Themed';
import useTheme from '@/hooks/useTheme';

interface CellProps {
    revealed: boolean;
    flagged: boolean;
    mine: boolean;
    onPress: () => void;
    onLongPress: () => void;
    adjacentMines: number;
    size: number; // New prop for cell size
}

const Cell: React.FC<CellProps> = ({ revealed, flagged, mine, onPress, onLongPress, adjacentMines, size }) => {

    const { primary, grayBackground } = useTheme();

    const getCellContent = () => {
        if (flagged) {
            return '🚩';
        }
        if (revealed) {
            return mine ? '💣' : adjacentMines > 0 ? adjacentMines : '';
        }
        return '';
    };

    return (
        <TouchableOpacity
            style={[styles.cell, { width: size, height: size }, revealed && { backgroundColor: grayBackground }, flagged && { backgroundColor: primary }]}
            onPress={onPress}
            onLongPress={onLongPress}
        >
            <Text style={[styles.cellText, { fontSize: size * 0.5 }]}>{getCellContent()}</Text>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    cell: {
        borderWidth: 1,
        borderColor: '#ccc',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f0f0f0',
    },
    cellText: {
        fontSize: 20,
    },
});

export default Cell;