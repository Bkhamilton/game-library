// Obstacle Component

import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Obstacle as ObstacleType } from './types';

interface ObstacleProps {
    obstacle: ObstacleType;
}

export const Obstacle: React.FC<ObstacleProps> = ({ obstacle }) => {

    function getZIndex(type: string): number {
        switch (type) {
            case 'seagull':
                return 20; // Above water surface
            case 'boat':
            case 'bigBoat':
                return 15; // At water surface
            case 'buoy':
                return 5;  // Floating on water
            case 'rock':
            case 'jellyfish':
                return 1; // Below water surface
            default:
                return 10;
        }
    }

    return (
        <View
            style={[
                styles.obstacle,
                {
                    left: obstacle.x,
                    top: obstacle.y,
                    width: obstacle.width,
                    height: obstacle.height,
                    backgroundColor: obstacle.color,
                    zIndex: getZIndex(obstacle.type),
                },
            ]}
        />
    );
};

const styles = StyleSheet.create({
    obstacle: {
        position: 'absolute',
    },
});
