import React from 'react';
import { StyleSheet } from 'react-native';
import { Text, TouchableOpacity } from '@/components/Themed';
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

    const { primary, grayBackground, secondary } = useTheme();

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
            style={[styles.cell, { width: size, height: size }, { borderColor: primary }, revealed && { backgroundColor: secondary }, flagged && { backgroundColor: primary }]}
            onPress={onPress}
            onLongPress={onLongPress}
        >
            <Text style={[styles.cellText, { fontSize: size * 0.5 }]}>{getCellContent()}</Text>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    cell: {
        borderWidth: 2,
        justifyContent: 'center',
        alignItems: 'center',
    },
    cellText: {
        fontSize: 20,
    },
});

export default Cell;