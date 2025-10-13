// DolphinDive Type Definitions

export interface DolphinState {
    y: number;              // Current vertical position
    velocity: number;       // Current vertical velocity
    maxDepthReached: number; // Deepest point in current dive
    isUnderwater: boolean;  // Below water surface
    isDiving: boolean;      // Tap is held
    isTwisting?: boolean;    // Is the dolphin twisting?
    twistTimer?: number;     // Timer for twist animation
}

export type ObstacleType = 'boat' | 'seagull' | 'buoy' | 'rock' | 'jellyfish';

export interface Obstacle {
    key: string;
    x: number;
    y: number;
    type: ObstacleType;
    width: number;
    height: number;
    color: string;
}

export interface Collectible {
    key: string;
    x: number;
    y: number;
    collected: boolean;
}
