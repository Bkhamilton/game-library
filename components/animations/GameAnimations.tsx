import React, { useEffect } from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withSequence,
  Easing,
} from 'react-native-reanimated';

interface LoadingSpinnerProps {
  size?: 'small' | 'large';
  color?: string;
}

/**
 * LoadingSpinner - Animated loading indicator
 * Uses react-native-reanimated for smooth rotation
 */
export function LoadingSpinner({ size = 'large', color = '#007AFF' }: LoadingSpinnerProps) {
  const rotation = useSharedValue(0);
  
  useEffect(() => {
    rotation.value = withRepeat(
      withTiming(360, {
        duration: 1000,
        easing: Easing.linear,
      }),
      -1, // Infinite repeat
      false
    );
  }, []);
  
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation.value}deg` }],
  }));
  
  return (
    <View style={styles.container}>
      <Animated.View style={animatedStyle}>
        <ActivityIndicator size={size} color={color} />
      </Animated.View>
    </View>
  );
}

interface VictoryAnimationProps {
  visible: boolean;
  children?: React.ReactNode;
  onComplete?: () => void;
}

/**
 * VictoryAnimation - Celebration overlay for game completion
 * Scales in with a bounce effect
 */
export function VictoryAnimation({ visible, children, onComplete }: VictoryAnimationProps) {
  const scale = useSharedValue(0);
  const opacity = useSharedValue(0);
  
  useEffect(() => {
    if (visible) {
      // Scale and fade in
      scale.value = withSequence(
        withTiming(1.2, { duration: 300 }),
        withTiming(1, { duration: 300 })
      );
      opacity.value = withTiming(1, { duration: 400 }, () => {
        if (onComplete) {
          onComplete();
        }
      });
    } else {
      scale.value = 0;
      opacity.value = 0;
    }
  }, [visible]);
  
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));
  
  if (!visible) return null;
  
  return (
    <Animated.View style={[styles.victoryContainer, animatedStyle]}>
      {children}
    </Animated.View>
  );
}

interface GameVictoryConfettiProps {
  visible: boolean;
  onComplete?: () => void;
}

/**
 * GameVictoryConfetti - Confetti animation for game wins
 * Simple celebration effect using animated views
 */
export function GameVictoryConfetti({ visible, onComplete }: GameVictoryConfettiProps) {
  const opacity = useSharedValue(0);
  const scale = useSharedValue(0);
  
  useEffect(() => {
    if (visible) {
      opacity.value = withSequence(
        withTiming(1, { duration: 300 }),
        withTiming(1, { duration: 1500 }),
        withTiming(0, { duration: 500 })
      );
      scale.value = withSequence(
        withTiming(1, { duration: 300 }),
        withTiming(1.5, { duration: 1500 }),
        withTiming(0, { duration: 500 }, () => {
          if (onComplete) {
            onComplete();
          }
        })
      );
    } else {
      opacity.value = 0;
      scale.value = 0;
    }
  }, [visible]);
  
  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ scale: scale.value }],
  }));
  
  if (!visible) return null;
  
  return (
    <Animated.View style={[styles.confettiContainer, animatedStyle]} pointerEvents="none">
      {/* Confetti particles would go here */}
      <View style={styles.confettiCircle} />
      <View style={[styles.confettiCircle, styles.confetti2]} />
      <View style={[styles.confettiCircle, styles.confetti3]} />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  victoryContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: 1000,
  },
  confettiContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 999,
  },
  confettiCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#FFD700',
    position: 'absolute',
  },
  confetti2: {
    backgroundColor: '#FF69B4',
    top: 100,
    left: 50,
  },
  confetti3: {
    backgroundColor: '#00CED1',
    top: 150,
    right: 50,
  },
});
