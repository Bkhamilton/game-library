// Dolphin Component

import React from 'react';
import { StyleSheet } from 'react-native';
import { DOLPHIN_WIDTH, DOLPHIN_HEIGHT, DOLPHIN_X, DOLPHIN_SHEET, SPRITE_CONFIGS } from './constants';
import { SpriteSheet } from './SpriteSheet';

interface DolphinProps {
    y: number;
}

export const Dolphin: React.FC<DolphinProps> = ({ y }) => {
    const config = SPRITE_CONFIGS.dolphin;
    
    return (
        <SpriteSheet
            source={DOLPHIN_SHEET}
            frameCount={config.frameCount}
            frameWidth={config.frameWidth}
            frameHeight={config.frameHeight}
            fps={config.fps}
            width={DOLPHIN_WIDTH}
            height={DOLPHIN_HEIGHT}
            style={{
                left: DOLPHIN_X,
                top: y,
                zIndex: 5,
            }}
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
