import React from "react";
import { Image, StyleSheet, Animated } from "react-native";
import { PIPE_IMAGE, PIPE_BASE_IMAGE, SCREEN_HEIGHT } from "@/utils/GoGoBird";

interface PipeProps {
    pipe: {
        x: Animated.Value;
        gapTop: number;
    };
    gapSize: number;
}

export const Pipe = ({ pipe, gapSize }: PipeProps) => {
    return (
        <>
            {/* Top pipe */}
            <Animated.View
                style={[
                    styles.pipeContainer,
                    {
                        left: pipe.x,
                        height: pipe.gapTop,
                        top: -10,
                    },
                ]}
            >
                <Image
                    source={PIPE_BASE_IMAGE}
                    style={[
                        styles.pipeBase,
                        {
                            height: Math.max(0, pipe.gapTop - 48),
                            transform: [{ rotate: "180deg" }],
                        },
                    ]}
                />
                <Image
                    source={PIPE_IMAGE}
                    style={[
                        styles.pipeHead,
                        {
                            transform: [{ rotate: "180deg" }],
                            marginBottom: -1,
                        },
                    ]}
                />
            </Animated.View>

            {/* Bottom pipe */}
            <Animated.View
                style={[
                    styles.pipeContainer,
                    {
                        left: pipe.x,
                        height: SCREEN_HEIGHT - pipe.gapTop - gapSize + 1,
                        top: pipe.gapTop + gapSize,
                    },
                ]}
            >
                <Image source={PIPE_IMAGE} style={[styles.pipeHead]} />
                <Image
                    source={PIPE_BASE_IMAGE}
                    style={[
                        styles.pipeBase,
                        {
                            height: "100%",
                        },
                    ]}
                />
            </Animated.View>
        </>
    );
};

const styles = StyleSheet.create({
    pipeContainer: {
        position: "absolute",
        width: 52,
        alignItems: "center",
    },
    pipeHead: {
        width: 52,
        height: 50,
        resizeMode: "stretch",
    },
    pipeBase: {
        width: 52,
        resizeMode: "stretch",
    },
});
