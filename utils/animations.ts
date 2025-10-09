/**
 * Animation Utilities
 * 
 * Centralized animation configurations and helper functions
 * for consistent animations across the game library.
 */

import { withSpring, withTiming, withSequence, SharedValue } from 'react-native-reanimated';

// ============================================================================
// Animation Configurations
// ============================================================================

/**
 * Standard spring animation configuration
 * Use for natural, bouncy animations (buttons, cards, etc.)
 */
export const SPRING_CONFIG = {
  damping: 15,
  stiffness: 150,
  mass: 1,
};

/**
 * Gentle spring animation
 * Use for subtle feedback animations
 */
export const GENTLE_SPRING_CONFIG = {
  damping: 20,
  stiffness: 100,
  mass: 1,
};

/**
 * Bouncy spring animation
 * Use for playful, game-specific animations
 */
export const BOUNCY_SPRING_CONFIG = {
  damping: 10,
  stiffness: 200,
  mass: 1,
};

/**
 * Standard timing animation configuration
 * Use for smooth, linear animations
 */
export const TIMING_CONFIG = {
  duration: 300,
};

/**
 * Fast timing animation
 * Use for quick feedback
 */
export const FAST_TIMING_CONFIG = {
  duration: 150,
};

/**
 * Slow timing animation
 * Use for dramatic effects
 */
export const SLOW_TIMING_CONFIG = {
  duration: 600,
};

// ============================================================================
// Animation Helpers
// ============================================================================

/**
 * Animates a value to a target with spring physics
 * 
 * @param value - The shared value to animate
 * @param toValue - Target value
 * @param config - Spring configuration (optional)
 */
export function animateSpring(
  value: SharedValue<number>,
  toValue: number,
  config = SPRING_CONFIG
) {
  'worklet';
  value.value = withSpring(toValue, config);
}

/**
 * Animates a value to a target with timing
 * 
 * @param value - The shared value to animate
 * @param toValue - Target value
 * @param config - Timing configuration (optional)
 */
export function animateTiming(
  value: SharedValue<number>,
  toValue: number,
  config = TIMING_CONFIG
) {
  'worklet';
  value.value = withTiming(toValue, config);
}

/**
 * Creates a pulse animation (scale up then down)
 * 
 * @param value - The shared value to animate
 * @param scale - Maximum scale value (default: 1.1)
 * @param duration - Duration per direction in ms (default: 500)
 */
export function animatePulse(
  value: SharedValue<number>,
  scale = 1.1,
  duration = 500
) {
  'worklet';
  value.value = withSequence(
    withTiming(scale, { duration }),
    withTiming(1, { duration })
  );
}

/**
 * Creates a shake animation (horizontal wiggle)
 * 
 * @param value - The shared value to animate
 * @param intensity - Maximum displacement in pixels (default: 10)
 */
export function animateShake(value: SharedValue<number>, intensity = 10) {
  'worklet';
  value.value = withSequence(
    withTiming(-intensity, { duration: 50 }),
    withTiming(intensity, { duration: 50 }),
    withTiming(-intensity, { duration: 50 }),
    withTiming(intensity, { duration: 50 }),
    withTiming(0, { duration: 50 })
  );
}

/**
 * Creates a bounce animation (scale down then up with overshoot)
 * 
 * @param value - The shared value to animate
 */
export function animateBounce(value: SharedValue<number>) {
  'worklet';
  value.value = withSequence(
    withTiming(0.95, { duration: 100 }),
    withSpring(1, BOUNCY_SPRING_CONFIG)
  );
}

/**
 * Fade in animation
 * 
 * @param value - The shared value to animate (opacity)
 * @param duration - Duration in ms (default: 300)
 */
export function animateFadeIn(value: SharedValue<number>, duration = 300) {
  'worklet';
  value.value = withTiming(1, { duration });
}

/**
 * Fade out animation
 * 
 * @param value - The shared value to animate (opacity)
 * @param duration - Duration in ms (default: 300)
 */
export function animateFadeOut(value: SharedValue<number>, duration = 300) {
  'worklet';
  value.value = withTiming(0, { duration });
}

/**
 * Scale in animation (from 0 to 1)
 * 
 * @param value - The shared value to animate
 * @param config - Spring configuration (optional)
 */
export function animateScaleIn(
  value: SharedValue<number>,
  config = SPRING_CONFIG
) {
  'worklet';
  value.value = withSpring(1, config);
}

/**
 * Scale out animation (from 1 to 0)
 * 
 * @param value - The shared value to animate
 * @param duration - Duration in ms (default: 200)
 */
export function animateScaleOut(value: SharedValue<number>, duration = 200) {
  'worklet';
  value.value = withTiming(0, { duration });
}

// ============================================================================
// Confetti Configurations
// ============================================================================

/**
 * Standard confetti configuration for game completion
 */
export const VICTORY_CONFETTI_CONFIG = {
  count: 200,
  origin: { x: -10, y: 0 },
  fadeOut: true,
  explosionSpeed: 350,
  fallSpeed: 2500,
};

/**
 * Center burst confetti for dramatic victories
 */
export const CENTER_BURST_CONFIG = {
  count: 180,
  fadeOut: true,
  explosionSpeed: 400,
  fallSpeed: 2000,
};

/**
 * Gentle celebration confetti
 */
export const GENTLE_CELEBRATION_CONFIG = {
  count: 100,
  fadeOut: true,
  explosionSpeed: 250,
  fallSpeed: 2000,
};

/**
 * Theme-specific confetti colors
 */
export const CONFETTI_COLORS = {
  default: ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8'],
  victory: ['#FFD700', '#FFA500', '#FF6347', '#00FF00', '#00CED1'],
  achievement: ['#FF1744', '#F50057', '#D500F9', '#651FFF', '#3D5AFE'],
  streak: ['#00E5FF', '#1DE9B6', '#76FF03', '#FFEA00', '#FF9100'],
};

// ============================================================================
// Animation Timing Constants
// ============================================================================

/**
 * Standard animation durations in milliseconds
 */
export const DURATIONS = {
  instant: 0,
  fast: 150,
  normal: 300,
  slow: 600,
  verySlow: 1000,
};

/**
 * Standard delays in milliseconds
 */
export const DELAYS = {
  none: 0,
  short: 100,
  medium: 300,
  long: 500,
};

// ============================================================================
// Easing Functions
// ============================================================================

/**
 * Common easing curves
 * Note: These are for documentation; use withTiming's easing parameter
 */
export const EASING_CURVES = {
  easeInOut: 'ease-in-out',
  easeIn: 'ease-in',
  easeOut: 'ease-out',
  linear: 'linear',
};

// ============================================================================
// Animation Presets for Common UI Elements
// ============================================================================

/**
 * Button press animation preset
 * Returns animation configuration for button press effect
 */
export const BUTTON_PRESS_PRESET = {
  pressIn: {
    scale: 0.95,
    config: SPRING_CONFIG,
  },
  pressOut: {
    scale: 1,
    config: SPRING_CONFIG,
  },
};

/**
 * Card flip animation preset
 */
export const CARD_FLIP_PRESET = {
  duration: 400,
  halfDuration: 200,
};

/**
 * Tile reveal animation preset
 */
export const TILE_REVEAL_PRESET = {
  duration: 300,
  stagger: 50, // Delay between multiple tiles
};

/**
 * Victory celebration preset
 */
export const VICTORY_ANIMATION_PRESET = {
  scale: {
    from: 0,
    to: 1.2,
    final: 1,
    duration: 600,
  },
  fade: {
    from: 0,
    to: 1,
    duration: 400,
  },
};
