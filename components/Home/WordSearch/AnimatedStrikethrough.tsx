import React, { useEffect, useRef } from "react";
import { Animated, ViewStyle } from "react-native";
import { getStrikethroughStyle } from "@/utils/wordSearch";

interface AnimatedStrikethroughProps {
    direction: "horizontal" | "vertical" | "diagonal-right" | "diagonal-left";
    color: string;
    delay: number;
}

const AnimatedStrikethrough: React.FC<AnimatedStrikethroughProps> = ({ 
    direction, 
    color, 
    delay 
}) => {
    const scaleAnim = useRef(new Animated.Value(0)).current;
    const opacityAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        // Start animation after delay
        const timer = setTimeout(() => {
            Animated.parallel([
                Animated.timing(scaleAnim, {
                    toValue: 1,
                    duration: 300,
                    useNativeDriver: true,
                }),
                Animated.timing(opacityAnim, {
                    toValue: 1,
                    duration: 200,
                    useNativeDriver: true,
                }),
            ]).start();
        }, delay);

        return () => clearTimeout(timer);
    }, [delay, scaleAnim, opacityAnim]);

    const baseStyle = getStrikethroughStyle(direction, color);
    
    // Determine scale direction based on word direction
    const getScaleTransform = () => {
        if (direction === "horizontal") {
            return { scaleX: scaleAnim };
        } else if (direction === "vertical") {
            return { scaleY: scaleAnim };
        } else {
            // For diagonal, scale both dimensions
            return { scaleX: scaleAnim, scaleY: scaleAnim };
        }
    };

    const animatedStyle: ViewStyle = {
        ...baseStyle,
        opacity: opacityAnim,
        transform: [
            ...(baseStyle.transform || []),
            getScaleTransform(),
        ] as any,
    };

    return <Animated.View style={animatedStyle} />;
};

export default AnimatedStrikethrough;
