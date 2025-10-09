import React, { useEffect } from 'react';
import { StyleSheet } from 'react-native';
import { Text, TouchableOpacity } from '@/components/Themed';
import useTheme from '@/hooks/useTheme';
import Animated, { useSharedValue, useAnimatedStyle, withSpring, withTiming } from 'react-native-reanimated';

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
    
    const scale = useSharedValue(1);
    const opacity = useSharedValue(1);

    useEffect(() => {
        if (revealed) {
            // Animate reveal
            scale.value = withSpring(1.1, {
                damping: 15,
                stiffness: 150,
            }, () => {
                scale.value = withSpring(1);
            });
        }
    }, [revealed]);
    
    useEffect(() => {
        if (flagged) {
            // Animate flag placement
            scale.value = withSpring(1.2, {
                damping: 10,
                stiffness: 200,
            }, () => {
                scale.value = withSpring(1);
            });
        }
    }, [flagged]);
    
    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ scale: scale.value }],
        opacity: opacity.value,
    }));

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
            <Animated.View style={animatedStyle}>
                <Text style={[styles.cellText, { fontSize: size * 0.5 }]}>{getCellContent()}</Text>
            </Animated.View>
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