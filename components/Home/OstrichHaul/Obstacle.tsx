import React from "react";
import { Animated, Image, StyleSheet } from "react-native";
import { OBSTACLE_WIDTH, OBSTACLE_WIDTH_SPIKE2, groundLevel } from "./constants";
import spikeSprite from "@/assets/images/ostrichHaul/spike.png";
import spike2Sprite from "@/assets/images/ostrichHaul/spike2.png";

interface ObstacleProps {
    x: Animated.Value;
    variant: 1 | 2;
    width: number;
}

export const Obstacle = ({ x, variant, width }: ObstacleProps) => {
    const spikeImage = variant === 1 ? spikeSprite : spike2Sprite;
    
    return (
        <Animated.Image
            source={spikeImage}
            style={[
                styles.obstacle,
                {
                    left: x,
                    width: width,
                },
            ]}
        />
    );
};

const styles = StyleSheet.create({
    obstacle: {
        position: "absolute",
        height: 100,
        top: groundLevel - 50,
    },
});
