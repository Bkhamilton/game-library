// SpriteSheet Animation Component

import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, ImageSourcePropType } from 'react-native';

interface SpriteSheetProps {
    source: ImageSourcePropType;
    frameCount: number;
    frameWidth: number;
    frameHeight: number;
    fps?: number; // frames per second
    width: number;
    height: number;
    style?: any;
}

export const SpriteSheet: React.FC<SpriteSheetProps> = ({
    source,
    frameCount,
    frameWidth,
    frameHeight,
    fps = 10,
    width,
    height,
    style,
}) => {
    const frameIndex = useRef(0);
    const translateX = useRef(new Animated.Value(0)).current;
    // Calculate scale factor for proper frame positioning
    const scale = width / frameWidth;

    useEffect(() => {
        const interval = setInterval(() => {
            frameIndex.current = (frameIndex.current + 1) % frameCount;
            // Use scaled frame width for translateX calculation
            const newTranslateX = -frameIndex.current * frameWidth * scale;
            
            // Use timing for smooth transition or setValue for instant
            Animated.timing(translateX, {
                toValue: newTranslateX,
                duration: 0, // Instant frame change
                useNativeDriver: true,
            }).start();
        }, 1000 / fps);

        return () => clearInterval(interval);
    }, [frameCount, frameWidth, fps, translateX, width, scale]);

    return (
        <Animated.View
            style={[
                styles.container,
                style,
                {
                    width,
                    height,
                    overflow: 'hidden',
                },
            ]}
        >
            <Animated.Image
                source={source}
                style={{
                    width: frameWidth * frameCount * scale,
                    height: frameHeight * scale,
                    transform: [{ translateX }],
                }}
                resizeMode="stretch"
            />
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
    },
});
