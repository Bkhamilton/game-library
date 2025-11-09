// Obstacle Component

import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Obstacle as ObstacleType } from './types';
import { 
    SEAGULL_SHEET, 
    JELLYFISH_SHEET, 
    BOAT_SHEET, 
    BUOY_SHEET, 
    ROCK_SHEET,
    SPRITE_CONFIGS 
} from './constants';
import { SpriteSheet } from './SpriteSheet';

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
        };

        // Get sprite sheet configuration based on obstacle type
        let spriteSource;
        let config;

        switch (type) {
            case 'seagull':
                spriteSource = SEAGULL_SHEET;
                config = SPRITE_CONFIGS.seagull;
                break;
            case 'jellyfish':
                spriteSource = JELLYFISH_SHEET;
                config = SPRITE_CONFIGS.jellyfish;
                break;
            case 'boat':
                spriteSource = BOAT_SHEET;
                config = SPRITE_CONFIGS.boat;
                break;
            case 'buoy':
                spriteSource = BUOY_SHEET;
                config = SPRITE_CONFIGS.buoy;
                break;
            case 'rock':
                spriteSource = ROCK_SHEET;
                config = SPRITE_CONFIGS.rock;
                break;
            case 'bigBoat':
                // BigBoat doesn't have a sprite sheet yet, use colored rectangle
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
            default:
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
            <SpriteSheet
                source={spriteSource}
                frameCount={config.frameCount}
                frameWidth={config.frameWidth}
                frameHeight={config.frameHeight}
                fps={config.fps}
                width={obstacle.width}
                height={obstacle.height}
                style={commonStyle}
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
