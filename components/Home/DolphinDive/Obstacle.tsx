// Obstacle Component

import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Obstacle as ObstacleType } from './types';

interface ObstacleProps {
    obstacle: ObstacleType;
}

export const Obstacle: React.FC<ObstacleProps> = ({ obstacle }) => {
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
