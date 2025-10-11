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
    MIN_JUMP_SPEED,
    MAX_JUMP_SPEED,
    EXIT_VELOCITY_INFLUENCE,    
} from './constants';

/**
 * Calculate jump velocity based on dive depth and exit velocity
 */
export const calculateJumpVelocity = (maxDepth: number, exitVelocity: number): number => {
    const depthFactor = Math.min(maxDepth / MAX_DIVE_DEPTH, 1.0); // 0..1
    const exitSpeed = Math.max(0, -exitVelocity); // magnitude of upward speed at exit

    // Base speed scales with depth, then add contribution from exit speed
    // Choose a base that doesn't instantly saturate typical dives
    const baseFromDepth = 8 + depthFactor * 10; // 8..18
    let jumpSpeed = baseFromDepth + exitSpeed * EXIT_VELOCITY_INFLUENCE; // positive speed

    // Clamp to a wide range so shallow vs deep dives remain distinct
    jumpSpeed = Math.max(MIN_JUMP_SPEED, Math.min(jumpSpeed, MAX_JUMP_SPEED));

    const jumpVelocity = -jumpSpeed; // negative = upward
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
            const dynamicBuoyancy = BUOYANCY * (1 + Math.pow(depthBelowSurface / MAX_DIVE_DEPTH, 2) * 2.2);
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
