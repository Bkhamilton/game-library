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
 * Use for emphasis
 */
export const SLOW_TIMING_CONFIG = {
  duration: 500,
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
// Color Palettes for Animations
// ============================================================================

/**
 * Predefined color palettes for confetti and particle effects
 */
export const ANIMATION_COLORS = {
  default: ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8'],
  victory: ['#FFD700', '#FFA500', '#FF69B4', '#00CED1', '#32CD32'],
  achievement: ['#FF1744', '#F50057', '#D500F9', '#651FFF', '#3D5AFE'],
  streak: ['#00E5FF', '#1DE9B6', '#76FF03', '#FFEA00', '#FF9100'],
};

// ============================================================================
// Animation Helper Functions
// ============================================================================

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

/**
 * Shake animation for error feedback
 * 
 * @param value - The shared value to animate (translateX)
 */
export function animateShake(value: SharedValue<number>) {
  'worklet';
  value.value = withSequence(
    withTiming(-10, { duration: 50 }),
    withTiming(10, { duration: 50 }),
    withTiming(-10, { duration: 50 }),
    withTiming(10, { duration: 50 }),
    withTiming(0, { duration: 50 })
  );
}

/**
 * Pulse animation
 * 
 * @param value - The shared value to animate (scale)
 * @param duration - Duration in ms (default: 1000)
 */
export function animatePulse(value: SharedValue<number>, duration = 1000) {
  'worklet';
  value.value = withSequence(
    withTiming(1.05, { duration }),
    withTiming(1, { duration })
  );
}

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

// ============================================================================
// Confetti Configurations
// ============================================================================

/**
 * Standard confetti configuration for game completion
 */
export const CONFETTI_CONFIG = {
  count: 50,
  spread: 360,
  startVelocity: 30,
  decay: 0.9,
  gravity: 0.6,
  colors: ANIMATION_COLORS.victory,
};

/**
 * Achievement confetti configuration
 */
export const ACHIEVEMENT_CONFETTI_CONFIG = {
  count: 30,
  spread: 180,
  startVelocity: 25,
  decay: 0.85,
  gravity: 0.7,
  colors: ANIMATION_COLORS.achievement,
};
