# Animation Libraries Setup Guide

This guide provides step-by-step instructions for using the animation libraries in the game-library project.

## Quick Start

### 1. Installation Verification

The following libraries are already installed and configured:

```bash
npm list react-native-reanimated
# ✓ react-native-reanimated@4.1.2

npm list lottie-react-native
# ✓ lottie-react-native@7.3.4

npm list react-native-confetti-cannon
# ✓ react-native-confetti-cannon@1.5.2
```

### 2. Basic Usage

#### Import Animation Components

```typescript
// Import reusable components
import { 
  AnimatedButton, 
  FadeInView, 
  PulseView 
} from '@/components/animations';

// Import animation utilities
import { 
  animateSpring, 
  animateFadeIn, 
  SPRING_CONFIG 
} from '@/utils/animations';

// Import Lottie
import LottieView from 'lottie-react-native';

// Import Confetti
import ConfettiCannon from 'react-native-confetti-cannon';
```

### 3. Running Example Screens

To see the animation libraries in action, you can import and use the test screens:

```typescript
import { 
  AnimationTestScreen,    // Reanimated examples
  LottieTestScreen,       // Lottie examples
  ConfettiTestScreen      // Confetti examples
} from '@/components/animations';
```

## Common Use Cases

### Animated Button Press

**Option 1: Use the pre-built component**

```typescript
import { AnimatedButton } from '@/components/animations';

function MyComponent() {
  return (
    <AnimatedButton onPress={() => console.log('Pressed')}>
      <View style={styles.button}>
        <Text>Click Me</Text>
      </View>
    </AnimatedButton>
  );
}
```

**Option 2: Build your own**

```typescript
import Animated, { useSharedValue, useAnimatedStyle } from 'react-native-reanimated';
import { animateSpring } from '@/utils/animations';

function MyButton() {
  const scale = useSharedValue(1);
  
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));
  
  return (
    <TouchableOpacity
      onPressIn={() => animateSpring(scale, 0.95)}
      onPressOut={() => animateSpring(scale, 1)}
    >
      <Animated.View style={animatedStyle}>
        <Text>Press Me</Text>
      </Animated.View>
    </TouchableOpacity>
  );
}
```

### Fade In on Mount

```typescript
import { FadeInView } from '@/components/animations';

function MyComponent() {
  return (
    <FadeInView duration={500}>
      <Text>This text will fade in</Text>
    </FadeInView>
  );
}
```

### Error Shake Animation

```typescript
import { ShakeView } from '@/components/animations';
import { useState } from 'react';

function MyForm() {
  const [shakeCount, setShakeCount] = useState(0);
  
  const handleError = () => {
    setShakeCount(prev => prev + 1);
  };
  
  return (
    <ShakeView trigger={shakeCount}>
      <View style={styles.errorBox}>
        <Text>Error message</Text>
      </View>
    </ShakeView>
  );
}
```

### Loading Spinner with Lottie

```typescript
import { LoadingSpinner } from '@/components/animations';

function MyComponent() {
  const [loading, setLoading] = useState(true);
  
  return (
    <View>
      {loading && <LoadingSpinner visible={true} size={100} />}
      {!loading && <MyContent />}
    </View>
  );
}
```

### Victory Confetti

```typescript
import { GameVictoryConfetti } from '@/components/animations';

function GameScreen() {
  const [gameWon, setGameWon] = useState(false);
  
  return (
    <View>
      {/* Game content */}
      
      <GameVictoryConfetti 
        visible={gameWon}
        onComplete={() => {
          console.log('Celebration complete');
          // Navigate to next screen
        }}
      />
    </View>
  );
}
```

## Game-Specific Integration Examples

### Sudoku Number Entry

```typescript
import Animated, { useSharedValue, useAnimatedStyle } from 'react-native-reanimated';
import { animateFadeIn, animateScaleIn } from '@/utils/animations';

function SudokuCell({ value }: { value: number }) {
  const opacity = useSharedValue(0);
  const scale = useSharedValue(0);
  
  useEffect(() => {
    if (value) {
      animateFadeIn(opacity, 200);
      animateScaleIn(scale);
    }
  }, [value]);
  
  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ scale: scale.value }],
  }));
  
  return (
    <Animated.View style={animatedStyle}>
      <Text>{value}</Text>
    </Animated.View>
  );
}
```

### Minesweeper Tile Reveal

```typescript
import Animated, { 
  useSharedValue, 
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated';

function MinesweeperTile({ revealed }: { revealed: boolean }) {
  const rotateY = useSharedValue(0);
  
  useEffect(() => {
    if (revealed) {
      rotateY.value = withTiming(180, { duration: 400 });
    }
  }, [revealed]);
  
  const frontStyle = useAnimatedStyle(() => ({
    transform: [
      { rotateY: `${rotateY.value}deg` },
    ],
    backfaceVisibility: 'hidden',
  }));
  
  const backStyle = useAnimatedStyle(() => ({
    transform: [
      { rotateY: `${rotateY.value + 180}deg` },
    ],
    backfaceVisibility: 'hidden',
  }));
  
  return (
    <View>
      <Animated.View style={frontStyle}>
        <Text>?</Text>
      </Animated.View>
      <Animated.View style={[styles.absolute, backStyle]}>
        <Text>X</Text>
      </Animated.View>
    </View>
  );
}
```

### Word Search Word Found

```typescript
import { PulseView } from '@/components/animations';
import ConfettiCannon from 'react-native-confetti-cannon';

function WordSearchGame() {
  const confettiRef = useRef(null);
  const [foundWords, setFoundWords] = useState<string[]>([]);
  
  const handleWordFound = (word: string) => {
    setFoundWords(prev => [...prev, word]);
    confettiRef.current?.start();
  };
  
  return (
    <View>
      {foundWords.map(word => (
        <PulseView key={word}>
          <Text style={styles.foundWord}>{word}</Text>
        </PulseView>
      ))}
      
      <ConfettiCannon
        ref={confettiRef}
        count={50}
        origin={{ x: 0, y: 0 }}
        autoStart={false}
        fadeOut
      />
    </View>
  );
}
```

### Game Completion Screen

```typescript
import LottieView from 'lottie-react-native';
import { GameVictoryConfetti } from '@/components/animations';
import { FadeInView } from '@/components/animations';

function VictoryScreen({ score, onContinue }) {
  return (
    <View style={styles.container}>
      <GameVictoryConfetti visible={true} />
      
      <FadeInView duration={600}>
        <Text style={styles.title}>Victory!</Text>
      </FadeInView>
      
      <FadeInView duration={600} delay={200}>
        <LottieView
          source={require('@/assets/animations/loading.json')}
          autoPlay
          loop={false}
          style={styles.lottie}
        />
      </FadeInView>
      
      <FadeInView duration={600} delay={400}>
        <Text style={styles.score}>Score: {score}</Text>
      </FadeInView>
      
      <FadeInView duration={600} delay={600}>
        <AnimatedButton onPress={onContinue}>
          <Text>Continue</Text>
        </AnimatedButton>
      </FadeInView>
    </View>
  );
}
```

## Advanced Patterns

### Staggered List Animations

```typescript
import { FadeInView } from '@/components/animations';

function AnimatedList({ items }) {
  return (
    <ScrollView>
      {items.map((item, index) => (
        <FadeInView 
          key={item.id} 
          duration={400}
          delay={index * 100} // Stagger by 100ms
        >
          <ListItem item={item} />
        </FadeInView>
      ))}
    </ScrollView>
  );
}
```

### Gesture-Based Animations

```typescript
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';

function DraggableCard() {
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  
  const gesture = Gesture.Pan()
    .onChange((event) => {
      translateX.value += event.changeX;
      translateY.value += event.changeY;
    })
    .onEnd(() => {
      translateX.value = withSpring(0);
      translateY.value = withSpring(0);
    });
  
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
    ],
  }));
  
  return (
    <GestureDetector gesture={gesture}>
      <Animated.View style={animatedStyle}>
        <Card />
      </Animated.View>
    </GestureDetector>
  );
}
```

### Custom Lottie Animation with Progress Control

```typescript
import LottieView from 'lottie-react-native';
import { useRef, useEffect } from 'react';

function ProgressAnimation({ progress }: { progress: number }) {
  const animationRef = useRef<LottieView>(null);
  
  useEffect(() => {
    // Control animation progress (0-1)
    animationRef.current?.play(progress, progress);
  }, [progress]);
  
  return (
    <LottieView
      ref={animationRef}
      source={require('@/assets/animations/loading.json')}
      autoPlay={false}
      loop={false}
      style={{ width: 200, height: 200 }}
    />
  );
}
```

## Performance Best Practices

### 1. Use Native Driver

Always set `useNativeDriver: true` when possible:

```typescript
Animated.timing(value, {
  toValue: 1,
  duration: 300,
  useNativeDriver: true, // ✅ Good
}).start();
```

### 2. Limit Confetti Particles

On lower-end devices, reduce particle count:

```typescript
import { Platform } from 'react-native';

const particleCount = Platform.select({
  ios: 200,
  android: 150,
  default: 100,
});
```

### 3. Cleanup Animations

Always clean up when unmounting:

```typescript
useEffect(() => {
  const animation = startAnimation();
  
  return () => {
    animation.cancel(); // ✅ Good
  };
}, []);
```

### 4. Optimize Lottie Files

- Keep JSON files under 100KB
- Simplify complex paths
- Remove unnecessary layers

## Troubleshooting

### Animations Not Running

1. **Clear Metro cache:**
   ```bash
   npx expo start --clear
   ```

2. **Rebuild app:**
   ```bash
   npx expo run:ios
   # or
   npx expo run:android
   ```

3. **Check babel config:**
   Ensure `react-native-reanimated/plugin` is last in plugins array

### Lottie Not Loading

1. **Verify file path:**
   ```typescript
   require('@/assets/animations/loading.json') // ✅ Correct
   require('./animations/loading.json')        // ❌ May not work
   ```

2. **Check JSON validity:**
   Use [LottieFiles](https://lottiefiles.com/) to validate

### Confetti Performance Issues

1. **Reduce particle count:**
   ```typescript
   count={100} // Instead of 200
   ```

2. **Disable fadeOut on Android:**
   ```typescript
   fadeOut={Platform.OS === 'ios'}
   ```

## Additional Resources

- [Full Documentation](/docs/ANIMATION_LIBRARIES.md)
- [Component Examples](/components/animations/README.md)
- [Animation Utilities](/utils/animations.ts)
- [React Native Reanimated Docs](https://docs.swmansion.com/react-native-reanimated/)
- [Lottie Documentation](https://airbnb.design/lottie/)

## Support

For questions or issues:
1. Check the main documentation: `/docs/ANIMATION_LIBRARIES.md`
2. Review example components: `/components/animations/`
3. Refer to the troubleshooting section above
