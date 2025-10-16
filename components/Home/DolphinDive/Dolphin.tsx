// Dolphin Component

import React from 'react';
import { View, StyleSheet } from 'react-native';
import { DOLPHIN_WIDTH, DOLPHIN_HEIGHT, DOLPHIN_COLOR, DOLPHIN_X } from './constants';

interface DolphinProps {
    y: number;
}

export const Dolphin: React.FC<DolphinProps> = ({ y }) => {
    return (
        <View
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
        backgroundColor: DOLPHIN_COLOR,
        borderRadius: 5,
        zIndex: 5,
    },
});
