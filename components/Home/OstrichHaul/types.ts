import { Animated } from "react-native";

export interface Position {
    y: Animated.Value;
    x: Animated.Value;
}

export interface GameState {
    velocity: number;
    isJumping: boolean;
    gravity: number;
    isHolding: boolean;
}

export interface Obstacle {
    key: string;
    x: Animated.Value;
    variant: 1 | 2;
    width: number;
}

export interface Cloud {
    key: string;
    x: Animated.Value;
    y: number;
    size: number;
}

export type DifficultyLevel = "Easy" | "Medium" | "Hard";
