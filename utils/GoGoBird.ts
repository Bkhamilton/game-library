import { Dimensions, Animated } from "react-native";

// Difficulty settings for GoGoBird game
export const DIFFICULTY_SETTINGS = {
    Easy: { obstacleSpeed: 5000, gapSize: 400, spawnRate: 4000 },
    Medium: { obstacleSpeed: 4000, gapSize: 300, spawnRate: 3000 },
    Hard: { obstacleSpeed: 3000, gapSize: 250, spawnRate: 2000 },
};

// Game constants
export const GRAVITY = 2;
export const JUMP_VELOCITY = -20;
export const BIRD_WIDTH = 50;
export const BIRD_HEIGHT = 50;
export const MIN_PIPE_HEIGHT = 50;
export const PIPE_WIDTH = 50;
export const COLLISION_TOLERANCE = 5;

// Screen dimensions
export const SCREEN_HEIGHT = Dimensions.get("window").height;
export const SCREEN_WIDTH = Dimensions.get("window").width;

// Bird sprite images
export const BIRD_SPRITES = [
    require("@/assets/images/GoGoBird/frame-1.png"),
    require("@/assets/images/GoGoBird/frame-2.png"),
    require("@/assets/images/GoGoBird/frame-3.png"),
    require("@/assets/images/GoGoBird/frame-4.png"),
    require("@/assets/images/GoGoBird/frame-5.png"),
    require("@/assets/images/GoGoBird/frame-6.png"),
    require("@/assets/images/GoGoBird/frame-7.png"),
    require("@/assets/images/GoGoBird/frame-8.png"),
];

// Background and pipe images
export const BACKGROUND_IMAGE = require("@/assets/images/GoGoBird/bg.png");
export const PIPE_IMAGE = require("@/assets/images/GoGoBird/pipe.png");
export const PIPE_BASE_IMAGE = require("@/assets/images/GoGoBird/pipeBase.png");

// Types
export type Difficulty = "easy" | "medium" | "hard";

export interface Pipe {
    key: string;
    x: Animated.Value;
    gapTop: number;
}

// Helper function to check collision between bird and pipe
export const checkCollision = (
    birdY: Animated.Value,
    pipe: Pipe,
    settings: { gapSize: number }
): boolean => {
    const birdTop = birdY.__getValue();
    const birdBottom = birdTop + BIRD_HEIGHT;
    const pipeLeft = pipe.x.__getValue();
    const pipeRight = pipeLeft + PIPE_WIDTH;
    const pipeTop = pipe.gapTop;
    const pipeBottom = pipe.gapTop + settings.gapSize;

    if (
        (birdTop + COLLISION_TOLERANCE < pipeTop ||
            birdBottom - COLLISION_TOLERANCE > pipeBottom) &&
        pipeLeft < 150 &&
        pipeRight > 100
    ) {
        return true;
    }
    return false;
};
