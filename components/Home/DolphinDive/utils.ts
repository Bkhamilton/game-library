// DolphinDive Utility Functions

import { DolphinState } from './types';
import {
    GRAVITY_UNDERWATER,
    GRAVITY_AIRBORNE,
    DIVE_FORCE,
    BUOYANCY,
    WATER_RESISTANCE,
    AIR_RESISTANCE,
    WATER_SURFACE_Y,
    MAX_DIVE_DEPTH,
    JUMP_MOMENTUM_MULTIPLIER,
    RESTING_DEPTH,
} from './constants';

/**
 * Calculate jump velocity based on dive depth and exit velocity
 */
export const calculateJumpVelocity = (maxDepth: number, exitVelocity: number): number => {
    const depthFactor = Math.min(maxDepth / MAX_DIVE_DEPTH, 1.0);
    let baseJumpVelocity = -15 * (1 + depthFactor * JUMP_MOMENTUM_MULTIPLIER);
    const velocityBonus = exitVelocity * 0.5;
    let jumpVelocity = baseJumpVelocity + velocityBonus;
    // Clamp jump velocity to prevent excessive height
    jumpVelocity = Math.max(jumpVelocity, -25); // max upward speed
    jumpVelocity = Math.min(jumpVelocity, -8);  // min upward speed
    return jumpVelocity;
};

/**
 * Update dolphin physics based on current state
 */
export const updatePhysics = (state: DolphinState, isDiving: boolean): DolphinState => {
    let newVelocity = state.velocity;
    
    if (state.isUnderwater) {
        const restingY = WATER_SURFACE_Y + RESTING_DEPTH;
        const distanceFromRest = state.y - restingY;
        const depthBelowSurface = Math.max(state.y - WATER_SURFACE_Y, 0);

        if (isDiving) {
            newVelocity += DIVE_FORCE;
        } else {
            // Buoyancy increases with depth below surface
            const dynamicBuoyancy = BUOYANCY * (1 + depthBelowSurface / MAX_DIVE_DEPTH);
            if (distanceFromRest > 5) {
                newVelocity += dynamicBuoyancy;
            } else if (distanceFromRest < -5) {
                newVelocity -= dynamicBuoyancy;
            } else {
                newVelocity += dynamicBuoyancy * 0.3;
            }
        }
        newVelocity *= WATER_RESISTANCE;
    } else {
        // Airborne physics
        newVelocity += GRAVITY_AIRBORNE;
        newVelocity *= AIR_RESISTANCE;
    }
    
    return {
        ...state,
        velocity: newVelocity,
    };
};

/**
 * Check collision with obstacles (placeholder for future implementation)
 */
export const checkCollision = (dolphinY: number, obstacle: any): boolean => {
    // TODO: Implement collision detection
    return false;
};
