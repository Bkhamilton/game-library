import { Animated } from "react-native";
import { 
    OSTRICH_WIDTH, 
    OSTRICH_HEIGHT, 
    COLLISION_ADJUST, 
    groundLevel,
    OBSTACLE_WIDTH 
} from "./constants";
import { Position, Obstacle } from "./types";

/**
 * Check if the ostrich collides with an obstacle
 */
export const checkCollision = (position: Position, obstacle: Obstacle): boolean => {
    const ostrichTop = position.y.__getValue() + COLLISION_ADJUST;
    const ostrichBottom = ostrichTop + OSTRICH_HEIGHT - COLLISION_ADJUST * 2;
    const ostrichLeft = position.x.__getValue() + COLLISION_ADJUST;
    const ostrichRight = ostrichLeft + OSTRICH_WIDTH - COLLISION_ADJUST * 2;

    const obstacleLeft = obstacle.x.__getValue();
    const obstacleRight = obstacleLeft + OBSTACLE_WIDTH;
    const obstacleTop = (obstacle as any).gapTop;
    const obstacleBottom = groundLevel;

    return (
        ostrichRight > obstacleLeft &&
        ostrichLeft < obstacleRight &&
        (ostrichTop < obstacleTop || ostrichBottom > obstacleBottom)
    );
};

/**
 * Calculate gravity based on game state
 */
export const calculateGravity = (
    isJumping: boolean,
    velocity: number,
    difficulty: string,
    isHolding: boolean = false
): number => {
    // If holding the button and moving down (velocity > 0), apply glide gravity
    if (isHolding && velocity > 0) {
        return 0.3; // Glide gravity - slower fall
    }
    
    if (isJumping && velocity > -5 && velocity < 5) {
        if (difficulty === "Hard") {
            return 0.6;
        } else {
            return 0.2;
        }
    }
    return 1;
};

/**
 * Calculate random spawn rate based on difficulty settings
 */
export const getRandomSpawnRate = (minRate: number, maxRate: number): number => {
    return Math.random() * (maxRate - minRate) + minRate;
};
