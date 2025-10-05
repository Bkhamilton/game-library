import React from "react";
import { View, Image, StyleSheet, Animated } from "react-native";

const OSTRICH_SPRITES = [
    require("@/assets/images/ostrichHaul/ostrichSprite1.png"),
    require("@/assets/images/ostrichHaul/ostrichSprite2.png"),
    require("@/assets/images/ostrichHaul/ostrichSprite3.png"),
];

export const OSTRICH_SPRITE_COUNT = OSTRICH_SPRITES.length;

interface OstrichProps {
    y: Animated.Value;
    x: Animated.Value;
    spriteFrame: number;
}

export const Ostrich = ({ y, x, spriteFrame }: OstrichProps) => {
    return (
        <Animated.View
            style={[
                styles.ostrichContainer,
                {
                    transform: [{ translateY: y }, { translateX: x }],
                },
            ]}
        >
            <Image source={OSTRICH_SPRITES[spriteFrame]} style={styles.ostrichImage} />
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    ostrichContainer: {
        width: 100,
        height: 121,
        position: "absolute",
        left: 15,
    },
    ostrichImage: {
        width: "100%",
        height: "100%",
        resizeMode: "contain",
    },
});
