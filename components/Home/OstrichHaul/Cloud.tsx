import React from "react";
import { Animated, StyleSheet } from "react-native";

interface CloudProps {
    x: Animated.Value;
    y: number;
    size: number;
}

export const Cloud = ({ x, y, size }: CloudProps) => {
    return (
        <Animated.View
            style={[
                styles.cloud,
                {
                    left: x,
                    top: y,
                    width: size,
                    height: size * 0.6,
                },
            ]}
        />
    );
};

const styles = StyleSheet.create({
    cloud: {
        position: "absolute",
        backgroundColor: "white",
        borderRadius: 50,
        opacity: 0.8,
    },
});
