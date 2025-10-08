import React from 'react';
import { TouchableOpacity, StyleSheet, Animated } from 'react-native';
import { TileColor, getColorHex, getLightColorHex } from '@/utils/SimonSaysGenerator';

interface ColorTileProps {
    color: TileColor;
    isActive: boolean;
    onPress: () => void;
    disabled: boolean;
    size: number;
}

const ColorTile: React.FC<ColorTileProps> = ({ color, isActive, onPress, disabled, size }) => {
    const backgroundColor = isActive ? getLightColorHex(color) : getColorHex(color);

    return (
        <TouchableOpacity
            style={[
                styles.tile,
                {
                    backgroundColor,
                    width: size,
                    height: size,
                    opacity: isActive ? 1 : 0.7,
                }
            ]}
            onPress={onPress}
            disabled={disabled}
            activeOpacity={0.9}
        />
    );
};

const styles = StyleSheet.create({
    tile: {
        margin: 5,
        borderRadius: 10,
        borderWidth: 2,
        borderColor: '#2c3e50',
    },
});

export default ColorTile;
