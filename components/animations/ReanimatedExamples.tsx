import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  withSequence,
  withRepeat,
} from 'react-native-reanimated';

/**
 * AnimatedButton - Reusable animated button component
 * Demonstrates react-native-reanimated basic usage with spring animations
 */
interface AnimatedButtonProps {
  onPress: () => void;
  children: React.ReactNode;
  style?: any;
}

export function AnimatedButton({ onPress, children, style }: AnimatedButtonProps) {
  const scale = useSharedValue(1);
  
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));
  
  const handlePressIn = () => {
    scale.value = withSpring(0.95, {
      damping: 15,
      stiffness: 150,
    });
  };
  
  const handlePressOut = () => {
    scale.value = withSpring(1, {
      damping: 15,
      stiffness: 150,
    });
  };
  
  return (
    <TouchableOpacity
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <Animated.View style={[styles.button, animatedStyle, style]}>
        {children}
      </Animated.View>
    </TouchableOpacity>
  );
}

/**
 * FadeInView - Animated fade-in component
 * Demonstrates mounting animations with react-native-reanimated
 */
interface FadeInViewProps {
  children: React.ReactNode;
  duration?: number;
  delay?: number;
}

export function FadeInView({ children, duration = 300, delay = 0 }: FadeInViewProps) {
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(20);
  
  React.useEffect(() => {
    opacity.value = withTiming(1, { duration }, () => {});
    translateY.value = withTiming(0, { duration }, () => {});
  }, []);
  
  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }],
  }));
  
  return <Animated.View style={animatedStyle}>{children}</Animated.View>;
}

/**
 * PulseView - Pulsing animation component
 * Demonstrates continuous animations with react-native-reanimated
 */
interface PulseViewProps {
  children: React.ReactNode;
}

export function PulseView({ children }: PulseViewProps) {
  const scale = useSharedValue(1);
  
  React.useEffect(() => {
    scale.value = withRepeat(
      withSequence(
        withTiming(1.05, { duration: 1000 }),
        withTiming(1, { duration: 1000 })
      ),
      -1, // Infinite repeat
      false
    );
  }, []);
  
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));
  
  return <Animated.View style={animatedStyle}>{children}</Animated.View>;
}

/**
 * ShakeView - Shake animation for error feedback
 * Demonstrates error feedback animations
 */
interface ShakeViewProps {
  children: React.ReactNode;
  trigger: number; // Increment this to trigger shake
}

export function ShakeView({ children, trigger }: ShakeViewProps) {
  const translateX = useSharedValue(0);
  
  React.useEffect(() => {
    if (trigger > 0) {
      translateX.value = withSequence(
        withTiming(-10, { duration: 50 }),
        withTiming(10, { duration: 50 }),
        withTiming(-10, { duration: 50 }),
        withTiming(10, { duration: 50 }),
        withTiming(0, { duration: 50 })
      );
    }
  }, [trigger]);
  
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));
  
  return <Animated.View style={animatedStyle}>{children}</Animated.View>;
}

const styles = StyleSheet.create({
  button: {
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
