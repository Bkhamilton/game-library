// Dolphin Component

import React from 'react';
import { Image, StyleSheet } from 'react-native';
import { DOLPHIN_WIDTH, DOLPHIN_HEIGHT, DOLPHIN_X } from './constants';
import dolphinSprite from '../../../assets/images/DolphinDive/dolphinSprite.png';

interface DolphinProps {
    y: number;
}

export const Dolphin: React.FC<DolphinProps> = ({ y }) => {
    return (
        <Image
            source={dolphinSprite}
            resizeMode="contain"
            style={[
                styles.dolphin,
                {
                    left: DOLPHIN_X,
                    top: y,
                },
            ]}
        />
    );
};

const styles = StyleSheet.create({
    dolphin: {
        position: 'absolute',
        width: DOLPHIN_WIDTH,
        height: DOLPHIN_HEIGHT,
        zIndex: 5,
    },
});
