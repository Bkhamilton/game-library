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
            // Not pressing - buoyancy pulls toward resting position
            // Apply stronger buoyancy force when far from resting position
            const buoyancyMultiplier = 1 + Math.max(0, distanceFromRest / 100);
            newVelocity += BUOYANCY * buoyancyMultiplier;
        }
        
        // Always apply gravity underwater
        newVelocity += GRAVITY_UNDERWATER;
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
