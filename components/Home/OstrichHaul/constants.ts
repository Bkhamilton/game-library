import { Dimensions } from "react-native";

// Difficulty settings
export const DIFFICULTY_SETTINGS = {
    Easy: { obstacleSpeed: 2000, minSpawnRate: 1500, maxSpawnRate: 2500 },
    Medium: { obstacleSpeed: 1500, minSpawnRate: 1000, maxSpawnRate: 2000 },
    Hard: { obstacleSpeed: 1000, minSpawnRate: 1000, maxSpawnRate: 1500 },
};

// Screen dimensions
export const screenWidth = Dimensions.get("window").width;
export const screenHeight = Dimensions.get("window").height;

// Game dimensions
export const groundLevel = screenHeight - 450;

// Physics constants
export const jumpVelocity = -15;

// Ostrich dimensions
export const OSTRICH_WIDTH = 100;
export const OSTRICH_HEIGHT = 121;
export const OSTRICH_OFFSET = 60; // Amount to lift the ostrich up from the ground

// Collision constants
export const COLLISION_ADJUST = 20; // Amount to reduce collision box size

// Obstacle dimensions
export const OBSTACLE_WIDTH = 50;
export const OBSTACLE_HEIGHT = 100;

// Sprite animation
export const SPRITE_ANIMATION_INTERVAL = 70; // ms

// Game loop
export const GAME_LOOP_FPS = 60;
