import { Animated } from "react-native";

export interface Position {
    y: Animated.Value;
    x: Animated.Value;
}

export interface GameState {
    velocity: number;
    isJumping: boolean;
    gravity: number;
    spriteFrame: number;
}

export interface Obstacle {
    key: string;
    x: Animated.Value;
}

export type DifficultyLevel = "Easy" | "Medium" | "Hard";
