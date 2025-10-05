import React from "react";
import { Animated, Image, StyleSheet } from "react-native";
import { OBSTACLE_WIDTH, groundLevel } from "./constants";
import spikeSprite from "@/assets/images/ostrichHaul/spike.png";

interface ObstacleProps {
    x: Animated.Value;
}

export const Obstacle = ({ x }: ObstacleProps) => {
    return (
        <Animated.Image
            source={spikeSprite}
            style={[
                styles.obstacle,
                {
                    left: x,
                },
            ]}
        />
    );
};

const styles = StyleSheet.create({
    obstacle: {
        position: "absolute",
        width: OBSTACLE_WIDTH,
        height: 100,
        top: groundLevel - 50,
    },
});
