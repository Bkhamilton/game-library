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
 * Calculate jump velocity based on dive depth
 */
export const calculateJumpVelocity = (maxDepth: number): number => {
    const depthFactor = Math.min(maxDepth / MAX_DIVE_DEPTH, 1.0);
    return -15 * (1 + depthFactor * JUMP_MOMENTUM_MULTIPLIER);
};

/**
 * Update dolphin physics based on current state
 */
export const updatePhysics = (state: DolphinState, isDiving: boolean): DolphinState => {
    let newVelocity = state.velocity;
    
    if (state.isUnderwater) {
        // Underwater physics
        const restingY = WATER_SURFACE_Y + RESTING_DEPTH;
        const distanceFromRest = state.y - restingY;
        
        if (isDiving) {
            // Player is pressing - push dolphin down
            newVelocity += DIVE_FORCE;
        } else {
            // Not pressing - apply buoyancy based on position relative to resting depth
            // When below resting depth: strong upward force
            // When at resting depth: minimal force (equilibrium)
            // When above resting depth: downward force to sink back
            if (distanceFromRest > 5) {
                // Below resting depth - buoyancy pulls upward
                newVelocity += BUOYANCY;
            } else if (distanceFromRest < -5) {
                // Above resting depth - sink back down (reverse buoyancy)
                newVelocity -= BUOYANCY;
            } else {
                // Near resting depth - very gentle upward force to maintain position
                newVelocity += BUOYANCY * 0.3;
            }
        }
        
        // Apply water resistance
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
