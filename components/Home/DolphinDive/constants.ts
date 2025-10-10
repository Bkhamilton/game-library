// DolphinDive Game Constants

// Screen dimensions
export const SCREEN_WIDTH = 375;
export const SCREEN_HEIGHT = 667;

// Water physics constants
export const GRAVITY_UNDERWATER = 0.4;        // Reduced gravity in water (not used, removed from logic)
export const GRAVITY_AIRBORNE = 1.2;          // Full gravity in air
export const DIVE_FORCE = 0.8;                // Downward force when holding (push down)
export const BUOYANCY = -0.3;                 // Upward force when not diving (negative = upward)
export const WATER_RESISTANCE = 0.95;         // Dampening factor underwater
export const AIR_RESISTANCE = 0.98;           // Less dampening in air
export const RESTING_DEPTH = 30;              // How far below surface the dolphin rests

// Momentum-to-jump conversion
export const JUMP_MOMENTUM_MULTIPLIER = 2.0;  // Converts dive depth to jump height
export const MAX_DIVE_DEPTH = 200;            // Maximum depth in pixels
export const WATER_SURFACE_Y = 300;           // Y position of water surface
export const MAX_JUMP_HEIGHT = 250;           // Maximum height above water

// Dolphin properties
export const DOLPHIN_WIDTH = 60;
export const DOLPHIN_HEIGHT = 40;
export const DOLPHIN_X = 100;                 // Fixed X position

// Colors
export const OCEAN_BLUE = '#006994';          // Ocean water color
export const SKY_BLUE = '#87CEEB';            // Sky color
export const DOLPHIN_COLOR = '#000000';       // Temporary black box for dolphin

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
