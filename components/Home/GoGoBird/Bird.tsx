import React from "react";
import { Image, StyleSheet, Animated } from "react-native";
import { BIRD_SPRITES } from "@/utils/GoGoBird";

interface BirdProps {
    y: Animated.Value;
    currentFrame: number;
}

export const Bird = ({ y, currentFrame }: BirdProps) => {
    return (
        <Animated.View style={[styles.bird, { top: y }]}>
            <Image source={BIRD_SPRITES[currentFrame]} style={styles.birdImage} />
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    bird: {
        width: 50,
        height: 50,
        position: "absolute",
        left: 100,
        alignItems: "center",
    },
    birdImage: {
        width: "150%",
        height: "150%",
        resizeMode: "contain",
    },
});
