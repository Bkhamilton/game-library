import React from "react";
import { Animated } from "react-native";
import { OSTRICH_SHEET, SPRITE_CONFIGS, OSTRICH_WIDTH, OSTRICH_HEIGHT } from "./constants";
import { SpriteSheet } from "./SpriteSheet";

// Export for backwards compatibility
export const OSTRICH_SPRITE_COUNT = SPRITE_CONFIGS.ostrich.frameCount;

interface OstrichProps {
    y: Animated.Value;
    x: Animated.Value;
}

export const Ostrich = ({ y, x }: OstrichProps) => {
    const config = SPRITE_CONFIGS.ostrich;
    
    return (
        <Animated.View
            style={{
                position: "absolute",
                transform: [{ translateY: y }, { translateX: x }],
            }}
        >
            <SpriteSheet
                source={OSTRICH_SHEET}
                frameCount={config.frameCount}
                frameWidth={config.frameWidth}
                frameHeight={config.frameHeight}
                fps={config.fps}
                width={OSTRICH_WIDTH}
                height={OSTRICH_HEIGHT}
                style={{
                    left: 0,
                    top: 0,
                }}
            />
        </Animated.View>
    );
};
