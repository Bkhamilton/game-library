import React from 'react';
import { Pressable, StyleSheet, Animated } from 'react-native';
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
        <Pressable
            style={[
                styles.tile,
                {
                    backgroundColor,
                    width: size,
                    height: size,
                }
            ]}
            onPress={onPress}
            disabled={disabled}
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
