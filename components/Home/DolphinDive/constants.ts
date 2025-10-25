// DolphinDive Game Constants

export const DOLPHIN_SPRITE = require("@/assets/images/DolphinDive/dolphinSprite.png");
export const SEAGULL_SPRITE = require("@/assets/images/DolphinDive/seagullSprite.png");
export const JELLYFISH_SPRITE = require("@/assets/images/DolphinDive/jellyfishSprite.png");

// Screen dimensions
export const SCREEN_WIDTH = 375;
export const SCREEN_HEIGHT = 850;

// Water physics constants
export const GRAVITY_UNDERWATER = 0.4;        // Reduced gravity in water (not used, removed from logic)
export const GRAVITY_AIRBORNE = 1.0;          // Full gravity in air
export const DIVE_FORCE = 0.8;                // Downward force when holding (push down)
export const BUOYANCY = -0.6;                 // Upward force when not diving (negative = upward, doubled for faster rise)
export const WATER_RESISTANCE = 0.95;         // Dampening factor underwater
export const AIR_RESISTANCE = 0.98;           // Less dampening in air
export const RESTING_DEPTH = 30;              // How far below surface the dolphin rests

// Momentum-to-jump conversion
export const JUMP_MOMENTUM_MULTIPLIER = 2.0;  // Converts dive depth to jump height
export const MAX_DIVE_DEPTH = 350;            // Maximum depth in pixels
export const WATER_SURFACE_Y = 400;           // Y position of water surface
export const MAX_JUMP_HEIGHT = 290;    

// Add tunables for jump behavior
export const MIN_JUMP_SPEED = 6;              // px/frame (upward)
export const MAX_JUMP_SPEED = 28;             // px/frame (upward)
export const EXIT_VELOCITY_INFLUENCE = 0.8;   // Maximum height above water

// Dolphin properties
export const DOLPHIN_WIDTH = 138;
export const DOLPHIN_HEIGHT = 60;
export const DOLPHIN_X = 60;                 // Fixed X position

// Colors
export const OCEAN_BLUE = '#006994';          // Ocean water color
export const SKY_BLUE = '#87CEEB';            // Sky color

// Difficulty settings
export const DIFFICULTY_SETTINGS = {
    Easy: {
        obstacleSpawnRate: 2500,
        obstacleSpeed: 3,
    },
    Hard: {
        obstacleSpawnRate: 1800,
        obstacleSpeed: 5,
    },
};
