import { Dimensions } from "react-native";

// Difficulty settings
export const DIFFICULTY_SETTINGS = {
    Easy: { obstacleSpeed: 2000, minSpawnRate: 1500, maxSpawnRate: 2500, cloudSpeed: 4000 },
    Medium: { obstacleSpeed: 1500, minSpawnRate: 1000, maxSpawnRate: 2000, cloudSpeed: 3000 },
    Hard: { obstacleSpeed: 1000, minSpawnRate: 1000, maxSpawnRate: 1500, cloudSpeed: 2000 },
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

// Cloud settings
export const CLOUD_MIN_SPAWN_RATE = 2000; // ms
export const CLOUD_MAX_SPAWN_RATE = 5000; // ms
export const CLOUD_MIN_SIZE = 60;
export const CLOUD_MAX_SIZE = 120;
export const CLOUD_MIN_Y = 50;
export const CLOUD_MAX_Y = 300;

