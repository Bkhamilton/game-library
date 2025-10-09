// WaterSurface Component (Placeholder)

import React from 'react';
import { View, StyleSheet } from 'react-native';
import { WATER_SURFACE_Y, SCREEN_WIDTH } from './constants';

export const WaterSurface: React.FC = () => {
    return (
        <View style={styles.waterLine} />
    );
};

const styles = StyleSheet.create({
    waterLine: {
        position: 'absolute',
        top: WATER_SURFACE_Y,
        width: SCREEN_WIDTH,
        height: 2,
        backgroundColor: '#0099CC',
        zIndex: 10,
    },
});
