import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  withSequence,
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
    const pulse = () => {
      scale.value = withSequence(
        withTiming(1.05, { duration: 1000 }),
        withTiming(1, { duration: 1000 })
      );
    };
    
    pulse();
    const interval = setInterval(pulse, 2000);
    
    return () => clearInterval(interval);
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

/**
 * AnimationTestScreen - Demo component showing all reanimated animations
 */
export function AnimationTestScreen() {
  const [shakeCounter, setShakeCounter] = React.useState(0);
  
  return (
    <View style={styles.container}>
      <Text style={styles.title}>React Native Reanimated Examples</Text>
      
      <FadeInView duration={600}>
        <Text style={styles.sectionTitle}>1. Animated Button (Press Me)</Text>
        <AnimatedButton onPress={() => console.log('Button pressed!')}>
          <Text style={styles.buttonText}>Press Me!</Text>
        </AnimatedButton>
      </FadeInView>
      
      <FadeInView duration={600} delay={200}>
        <Text style={styles.sectionTitle}>2. Fade In Animation</Text>
        <View style={styles.box}>
          <Text>This box faded in on mount</Text>
        </View>
      </FadeInView>
      
      <FadeInView duration={600} delay={400}>
        <Text style={styles.sectionTitle}>3. Pulse Animation</Text>
        <PulseView>
          <View style={[styles.box, styles.pulseBox]}>
            <Text>This box pulses continuously</Text>
          </View>
        </PulseView>
      </FadeInView>
      
      <FadeInView duration={600} delay={600}>
        <Text style={styles.sectionTitle}>4. Shake Animation (Error Feedback)</Text>
        <AnimatedButton onPress={() => setShakeCounter(prev => prev + 1)}>
          <Text style={styles.buttonText}>Trigger Shake</Text>
        </AnimatedButton>
        <ShakeView trigger={shakeCounter}>
          <View style={[styles.box, styles.errorBox]}>
            <Text style={styles.errorText}>Error: This will shake!</Text>
          </View>
        </ShakeView>
      </FadeInView>
      
      <Text style={styles.footer}>
        ✅ React Native Reanimated is working correctly!
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 20,
    marginBottom: 10,
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginVertical: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  box: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    marginVertical: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  pulseBox: {
    backgroundColor: '#E3F2FD',
  },
  errorBox: {
    backgroundColor: '#FFEBEE',
  },
  errorText: {
    color: '#C62828',
  },
  footer: {
    marginTop: 30,
    textAlign: 'center',
    fontSize: 14,
    color: '#4CAF50',
    fontWeight: '600',
  },
});
