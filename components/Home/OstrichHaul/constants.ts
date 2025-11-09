import { Dimensions } from "react-native";

// Sprite sheets
export const OSTRICH_SHEET = require("@/assets/images/ostrichHaul/ostrichSheet.png");

// Sprite sheet configurations
export const SPRITE_CONFIGS = {
    ostrich: { frameCount: 10, frameWidth: 256, frameHeight: 192, fps: 10 },
};

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
export const maxJumpVelocity = -18; // Maximum upward velocity when holding
export const minJumpHeight = 50; // Minimum jump height for a tap
export const maxJumpHeight = 250; // Maximum jump height when holding
export const glideGravity = 0.3; // Reduced gravity when gliding down

// Ostrich dimensions
export const OSTRICH_WIDTH = 256;
export const OSTRICH_HEIGHT = 192;
export const OSTRICH_OFFSET = 60; // Amount to lift the ostrich up from the ground

// Collision constants
export const COLLISION_ADJUST = 20; // Amount to reduce collision box size

// Obstacle dimensions
export const OBSTACLE_WIDTH = 50;
export const OBSTACLE_WIDTH_SPIKE2 = 80;
export const OBSTACLE_HEIGHT = 100;

// Obstacle spawn probabilities
export const SPIKE1_SPAWN_RATE = 0.65; // 65% chance
export const SPIKE2_SPAWN_RATE = 0.35; // 35% chance

// Game loop
export const GAME_LOOP_FPS = 60;

// Cloud settings
export const CLOUD_MIN_SPAWN_RATE = 2000; // ms
export const CLOUD_MAX_SPAWN_RATE = 5000; // ms
export const CLOUD_MIN_SIZE = 60;
export const CLOUD_MAX_SIZE = 120;
export const CLOUD_MIN_Y = 50;
export const CLOUD_MAX_Y = 300;

