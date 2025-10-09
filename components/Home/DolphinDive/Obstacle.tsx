// Obstacle Component (Placeholder)

import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Obstacle as ObstacleType } from './types';

interface ObstacleProps {
    obstacle: ObstacleType;
}

export const Obstacle: React.FC<ObstacleProps> = ({ obstacle }) => {
    return null; // Placeholder for future implementation
};

const styles = StyleSheet.create({
    obstacle: {
        position: 'absolute',
    },
});
