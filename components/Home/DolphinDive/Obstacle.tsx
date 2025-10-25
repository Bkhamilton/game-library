// Obstacle Component

import React from 'react';
import { View, StyleSheet, Image } from 'react-native';
import { Obstacle as ObstacleType } from './types';
import { SEAGULL_SPRITE, JELLYFISH_SPRITE } from './constants';

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

    function SpriteDisplay({ type }: { type: string }) {
        const commonStyle = {
            left: obstacle.x,
            top: obstacle.y,
            zIndex: getZIndex(type),
            width: obstacle.width,
            height: obstacle.height,
        };

        if (type === 'seagull') {
            return <Image source={SEAGULL_SPRITE} resizeMethod='scale' style={[styles.obstacle, commonStyle, {backgroundColor: 'transparent'}]} />;
        }

        if (type === 'jellyfish') {
            return <Image source={JELLYFISH_SPRITE} resizeMethod='scale' style={[styles.obstacle, commonStyle, {backgroundColor: 'transparent'}]} />;
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
    }

    return (
        <SpriteDisplay type={obstacle.type} />
    );
};

const styles = StyleSheet.create({
    obstacle: {
        position: 'absolute',
    },
    seagull: {
        position: 'absolute',
    },
    jellyfish: {
        position: 'absolute',
    },    
});
