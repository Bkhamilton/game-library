# Animation Libraries Documentation

This document provides comprehensive information about the animation libraries installed in the game-library project for the Improved Visuals Plan Phase 1 implementation.

## Overview

Three key animation libraries have been configured to enable smooth animations, particle effects, and complex visual feedback across the game library:

1. **react-native-reanimated** - High-performance animations using native driver
2. **lottie-react-native** - Complex pre-designed animations from JSON files
3. **react-native-confetti-cannon** - Particle effects for celebrations and visual feedback

---

## 1. React Native Reanimated

### Version
`~4.1.1` (v4.1.2 installed)

### Purpose
Provides high-performance animations that run on the native thread at 60fps, enabling smooth micro-interactions, transitions, and game-specific animations.

### Configuration

#### Babel Configuration
The library requires a Babel plugin to transform animated code. This is configured in `babel.config.js`:

```javascript
module.exports = function(api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      'react-native-reanimated/plugin', // Must be last in plugins array
    ],
  };
};
```

**Important:** The reanimated plugin must be listed **last** in the plugins array.

#### Expo Configuration
Added to `app.json` plugins array:

```json
"plugins": [
  "expo-router",
  "expo-font",
  "expo-sqlite",
  "expo-web-browser",
  "react-native-reanimated/plugin"
]
```

### Basic Usage

```typescript
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

// Example: Animated button press
function AnimatedButton() {
  const scale = useSharedValue(1);
  
  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }]
    };
  });
  
  const handlePress = () => {
    scale.value = withSpring(0.95, {}, () => {
      scale.value = withSpring(1);
    });
  };
  
  return (
    <Animated.View style={animatedStyle}>
      <TouchableOpacity onPress={handlePress}>
        <Text>Press Me</Text>
      </TouchableOpacity>
    </Animated.View>
  );
}
```

### Key Features

- **Native Driver Support:** Animations run on native thread for 60fps performance
- **Worklets:** JavaScript code that runs on UI thread
- **Gestures Integration:** Works seamlessly with react-native-gesture-handler
- **Layout Animations:** Built-in layout transition animations
- **Spring Physics:** Natural motion with spring animations
- **Shared Values:** Synchronized state across components

### Use Cases in Game Library

1. **Micro-interactions:**
   - Button press effects (scale, bounce)
   - Tile flip animations
   - Card shuffle effects

2. **Game-Specific Animations:**
   - Sudoku number entry (fade in + scale)
   - Minesweeper tile reveal (flip)
   - Word Search highlight (gradient sweep)
   - Game piece movements

3. **Transitions:**
   - Screen transitions
   - Modal animations
   - Loading states

### Performance Tips

- Always use `useNativeDriver: true` when possible
- Avoid running expensive calculations in worklets
- Use `useDerivedValue` for computed values
- Batch updates with `runOnUI`

### Resources

- [Official Documentation](https://docs.swmansion.com/react-native-reanimated/)
- [API Reference](https://docs.swmansion.com/react-native-reanimated/docs/fundamentals/getting-started/)
- [Examples](https://docs.swmansion.com/react-native-reanimated/docs/fundamentals/your-first-animation/)

---

## 2. Lottie React Native

### Version
`~7.3.1` (v7.3.4 installed)

### Purpose
Enables the use of complex, professionally designed animations exported from Adobe After Effects via the Lottie format (.json files).

### Configuration

#### Installation
Installed via Expo's compatible package manager:

```bash
npx expo install lottie-react-native
```

#### Platform Support
- ✅ iOS (native support)
- ✅ Android (native support)
- ✅ Web (via lottie-web)

### Basic Usage

```typescript
import LottieView from 'lottie-react-native';
import { useRef } from 'react';

function LoadingAnimation() {
  const animationRef = useRef<LottieView>(null);
  
  return (
    <LottieView
      ref={animationRef}
      source={require('./assets/animations/loading.json')}
      autoPlay
      loop
      style={{ width: 200, height: 200 }}
    />
  );
}
```

### Advanced Usage

```typescript
import LottieView from 'lottie-react-native';
import { useRef, useEffect } from 'react';

function VictoryAnimation({ onComplete }) {
  const animationRef = useRef<LottieView>(null);
  
  useEffect(() => {
    // Play animation when component mounts
    animationRef.current?.play();
  }, []);
  
  return (
    <LottieView
      ref={animationRef}
      source={require('./assets/animations/victory.json')}
      autoPlay={false}
      loop={false}
      speed={1.5}
      onAnimationFinish={onComplete}
      style={{ width: 300, height: 300 }}
    />
  );
}
```

### Key Features

- **Pre-designed Animations:** Use professionally created animations
- **Small File Sizes:** JSON files are much smaller than video or GIF
- **Scalable:** Vector-based, scales to any resolution
- **Interactive:** Control playback, speed, and progress
- **Color Customization:** Can modify colors programmatically

### Use Cases in Game Library

1. **Success Celebrations:**
   - Victory confetti animation
   - Star burst for high scores
   - Achievement unlock effects
   - Level up animations

2. **Loading States:**
   - Game loading animations
   - Data fetching indicators
   - Progress animations

3. **Visual Feedback:**
   - Correct answer celebrations
   - Error indicators
   - Hint reveals

4. **Ambient Effects:**
   - Background decorative animations
   - Floating UI elements
   - Theme-specific effects

### Asset Management

Create an `assets/animations/` directory for Lottie JSON files:

```
assets/
  animations/
    victory.json
    loading.json
    confetti.json
    error.json
    celebration.json
```

### Finding Lottie Animations

- [LottieFiles](https://lottiefiles.com/) - Free and premium animations
- [LottieFiles Community](https://lottiefiles.com/featured) - User-generated content
- Create custom animations in Adobe After Effects with Bodymovin plugin

### Performance Considerations

- **Caching:** Lottie caches animations automatically
- **Complexity:** Simpler animations perform better
- **Memory:** Unload animations when not in use
- **Size:** Keep JSON files under 100KB when possible

### Resources

- [Official Documentation](https://github.com/lottie-react-native/lottie-react-native)
- [LottieFiles](https://lottiefiles.com/)
- [Lottie Docs](https://airbnb.design/lottie/)

---

## 3. React Native Confetti Cannon

### Version
`^1.5.2` (v1.5.2 installed)

### Purpose
Provides particle effects for celebrations, success feedback, and visual polish. Primary use for confetti and particle-based visual effects.

### Configuration

#### Installation
```bash
npx expo install react-native-confetti-cannon
```

#### Platform Support
- ✅ iOS
- ✅ Android
- ⚠️ Web (limited support)

### Basic Usage

```typescript
import ConfettiCannon from 'react-native-confetti-cannon';
import { useRef } from 'react';

function GameVictory() {
  const confettiRef = useRef(null);
  
  const celebrate = () => {
    confettiRef.current?.start();
  };
  
  return (
    <>
      <Button title="Win!" onPress={celebrate} />
      <ConfettiCannon
        ref={confettiRef}
        count={200}
        origin={{ x: -10, y: 0 }}
        autoStart={false}
        fadeOut
      />
    </>
  );
}
```

### Advanced Configuration

```typescript
import ConfettiCannon from 'react-native-confetti-cannon';
import { Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

function CustomConfetti() {
  return (
    <ConfettiCannon
      count={150}
      origin={{ x: width / 2, y: height / 2 }}
      autoStart={false}
      explosionSpeed={350}
      fallSpeed={2000}
      fadeOut={true}
      colors={['#ff0000', '#00ff00', '#0000ff', '#ffff00']}
    />
  );
}
```

### Configuration Options

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `count` | number | 150 | Number of confetti pieces |
| `origin` | {x: number, y: number} | {x: 0, y: 0} | Starting position |
| `explosionSpeed` | number | 350 | Initial velocity |
| `fallSpeed` | number | 3000 | Gravity/fall speed |
| `fadeOut` | boolean | false | Fade out effect |
| `autoStart` | boolean | true | Auto-start on mount |
| `colors` | string[] | defaults | Custom colors |

### Use Cases in Game Library

1. **Success Celebrations:**
   - Game completion confetti
   - High score achievements
   - Level completion
   - Perfect score effects

2. **Milestone Events:**
   - Streak achievements (5, 10, 20 wins)
   - First game completion
   - Personal bests
   - Special unlocks

3. **Themed Effects:**
   - Theme-specific particle colors
   - Custom particle shapes (via colors)
   - Holiday/seasonal effects

### Performance Considerations

- **Particle Count:** Higher counts impact performance
  - Mobile: 100-200 particles recommended
  - Lower-end devices: 50-100 particles
- **Cleanup:** Ensure refs are cleaned up on unmount
- **Frequency:** Don't trigger too frequently (can cause lag)

### Example: Game Completion

```typescript
function GameComplete({ score, onDismiss }) {
  const confettiRef = useRef(null);
  
  useEffect(() => {
    // Start confetti when component mounts
    confettiRef.current?.start();
    
    // Optional: trigger again after delay
    const timeout = setTimeout(() => {
      confettiRef.current?.start();
    }, 1500);
    
    return () => clearTimeout(timeout);
  }, []);
  
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Victory!</Text>
      <Text style={styles.score}>Score: {score}</Text>
      <Button title="Continue" onPress={onDismiss} />
      
      <ConfettiCannon
        ref={confettiRef}
        count={200}
        origin={{ x: Dimensions.get('window').width / 2, y: 0 }}
        autoStart={false}
        fadeOut
        explosionSpeed={400}
      />
    </View>
  );
}
```

### Resources

- [GitHub Repository](https://github.com/VincentCATILLON/react-native-confetti-cannon)
- [NPM Package](https://www.npmjs.com/package/react-native-confetti-cannon)

---

## Integration Guide

### Setting Up Animation Infrastructure

#### 1. Create Animation Utilities

Create `utils/animations.ts`:

```typescript
import { withSpring, withTiming } from 'react-native-reanimated';

export const animationConfig = {
  spring: {
    damping: 15,
    stiffness: 150,
    mass: 1,
  },
  timing: {
    duration: 300,
  },
};

export const animateScale = (value: any, toValue: number) => {
  'worklet';
  return withSpring(toValue, animationConfig.spring);
};

export const animateFade = (value: any, toValue: number) => {
  'worklet';
  return withTiming(toValue, animationConfig.timing);
};
```

#### 2. Create Reusable Animation Components

Create `components/animations/AnimatedButton.tsx`:

```typescript
import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';

interface AnimatedButtonProps {
  onPress: () => void;
  children: React.ReactNode;
}

export function AnimatedButton({ onPress, children }: AnimatedButtonProps) {
  const scale = useSharedValue(1);
  
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));
  
  const handlePressIn = () => {
    scale.value = withSpring(0.95);
  };
  
  const handlePressOut = () => {
    scale.value = withSpring(1);
  };
  
  return (
    <TouchableOpacity
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <Animated.View style={animatedStyle}>
        {children}
      </Animated.View>
    </TouchableOpacity>
  );
}
```

#### 3. Create Animation Assets Directory

```
assets/
  animations/           # Lottie JSON files
    loading.json
    victory.json
    error.json
  images/
    particles/         # Particle sprites (if needed)
```

### Best Practices

#### Performance

1. **Use Native Driver:** Always enable when possible
   ```typescript
   useNativeDriver: true
   ```

2. **Batch Animations:** Group related animations
   ```typescript
   runOnUI(() => {
     scale.value = withSpring(1);
     opacity.value = withTiming(1);
   })();
   ```

3. **Cleanup:** Remove animation listeners and refs
   ```typescript
   useEffect(() => {
     return () => {
       // Cleanup
       animationRef.current?.reset();
     };
   }, []);
   ```

#### Code Organization

1. **Separate Animation Logic:** Keep in dedicated files
2. **Reusable Components:** Create shared animated components
3. **Configuration:** Centralize animation settings
4. **Types:** Use TypeScript for animation props

#### Memory Management

1. **Lottie:** Unload large animations when not visible
2. **Confetti:** Limit particle count on lower-end devices
3. **Reanimated:** Use `cancelAnimation()` when needed

### Testing Animations

#### Manual Testing Checklist

- [ ] Test on iOS device/simulator
- [ ] Test on Android device/emulator
- [ ] Test on different screen sizes
- [ ] Test performance with multiple animations
- [ ] Test memory usage during long sessions
- [ ] Verify animations run at 60fps
- [ ] Test animation cleanup on unmount

#### Performance Monitoring

```typescript
import { useEffect } from 'react';
import { Platform } from 'react-native';

function logAnimationPerformance(name: string) {
  if (__DEV__) {
    console.log(`[Animation] ${name} started`);
    const start = Date.now();
    
    return () => {
      const duration = Date.now() - start;
      console.log(`[Animation] ${name} completed in ${duration}ms`);
    };
  }
}
```

---

## Troubleshooting

### Common Issues

#### 1. Reanimated Not Working

**Problem:** Animations don't run or app crashes

**Solutions:**
- Ensure `react-native-reanimated/plugin` is **last** in babel plugins
- Clear Metro bundler cache: `npx expo start --clear`
- Rebuild the app
- Check that worklet functions have `'worklet'` directive

#### 2. Lottie Animations Not Loading

**Problem:** Animations don't appear or show errors

**Solutions:**
- Verify JSON file path is correct
- Check JSON file is valid Lottie format
- Ensure file is included in bundle
- Try using `require()` instead of URL

#### 3. Confetti Performance Issues

**Problem:** Lag or frame drops during confetti

**Solutions:**
- Reduce particle count (try 50-100 instead of 200+)
- Disable fadeOut on lower-end devices
- Limit concurrent confetti instances
- Use `InteractionManager` to delay non-critical animations

#### 4. Metro Bundler Issues

**Problem:** Build errors or bundler crashes

**Solutions:**
```bash
# Clear all caches
npx expo start --clear
rm -rf node_modules
npm install
```

### Platform-Specific Considerations

#### iOS
- Lottie animations work out of the box
- Requires CocoaPods (handled by Expo)
- Test on actual device for accurate performance

#### Android
- May need ProGuard rules for release builds (Expo handles this)
- Test on various Android versions (API 21+)
- Performance may vary more than iOS

#### Web
- Reanimated has web support via react-native-web
- Lottie works via lottie-web
- Confetti has limited web support
- Consider web-specific alternatives for production

---

## Next Steps

### Immediate Tasks

1. **Create Example Components:**
   - [ ] Reanimated button component
   - [ ] Lottie loading screen
   - [ ] Confetti victory screen

2. **Game Integration:**
   - [ ] Add animations to Sudoku number entry
   - [ ] Add particle effects to game completion
   - [ ] Add Lottie loading states

3. **Performance Testing:**
   - [ ] Test on iOS device
   - [ ] Test on Android device
   - [ ] Monitor frame rates
   - [ ] Optimize as needed

### Future Enhancements

1. **Custom Particle System:**
   - Build custom particle engine with Reanimated
   - Support different particle types (stars, sparkles, bubbles)
   - Theme-aware particle colors

2. **Animation Library:**
   - Create collection of reusable animated components
   - Build animation preset system
   - Document animation patterns

3. **Advanced Effects:**
   - Parallax scrolling backgrounds
   - Complex gesture-based animations
   - Physics-based animations
   - Shader effects (if needed)

---

## Resources

### Official Documentation
- [React Native Reanimated Docs](https://docs.swmansion.com/react-native-reanimated/)
- [Lottie React Native](https://github.com/lottie-react-native/lottie-react-native)
- [Confetti Cannon](https://github.com/VincentCATILLON/react-native-confetti-cannon)

### Learning Resources
- [Reanimated 2 Tutorial](https://www.youtube.com/watch?v=yz9E10Dq8Bg)
- [Lottie Animation Guide](https://airbnb.design/lottie/)
- [React Native Animation Guide](https://reactnative.dev/docs/animations)

### Design Resources
- [LottieFiles](https://lottiefiles.com/) - Free Lottie animations
- [Motion Design Patterns](https://material.io/design/motion)
- [Animation Principles](https://www.youtube.com/watch?v=1ANhAjYRJZk)

### Tools
- [Lottie Editor](https://lottiefiles.com/editor)
- [After Effects](https://www.adobe.com/products/aftereffects.html)
- [Bodymovin Plugin](https://aescripts.com/bodymovin/)

---

## Conclusion

The animation libraries are now configured and ready for use in the game library project. This foundation supports all visual improvements outlined in the Improved Visuals Plan, from micro-interactions to complex game-specific animations.

**Status:** ✅ Phase 1 Foundation Complete

**Next Phase:** Implement base animations and create design system documentation.
