# Animation Guidelines

## Overview

Animation in the Game Library serves to enhance user experience through meaningful motion, visual feedback, and smooth transitions. All animations should be purposeful, performant, and respect user preferences.

---

## Animation Principles

### 1. Purposeful Motion

Every animation should have a clear purpose:
- **Feedback:** Confirm user actions
- **Guidance:** Direct user attention
- **Continuity:** Maintain spatial relationships
- **Delight:** Add personality and polish

### 2. Performance First

- Target 60fps for all animations
- Use native driver when possible
- Avoid layout animations in large lists
- Keep animation duration reasonable (< 500ms typically)

### 3. Respect User Preferences

Honor system settings for reduced motion:
```typescript
import { AccessibilityInfo } from 'react-native';

const [reduceMotionEnabled, setReduceMotionEnabled] = useState(false);

useEffect(() => {
  AccessibilityInfo.isReduceMotionEnabled().then(enabled => {
    setReduceMotionEnabled(enabled);
  });
}, []);

// Use instant transitions if reduce motion is enabled
const duration = reduceMotionEnabled ? 0 : 300;
```

---

## Animation Library

### Recommended Libraries

#### 1. React Native Reanimated

**Purpose:** High-performance animations with native driver

```typescript
import Animated, { 
  useSharedValue, 
  useAnimatedStyle,
  withTiming,
  withSpring 
} from 'react-native-reanimated';

function AnimatedComponent() {
  const scale = useSharedValue(1);
  
  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
    };
  });
  
  const handlePress = () => {
    scale.value = withSpring(1.2);
  };
  
  return (
    <Animated.View style={animatedStyle}>
      {/* Content */}
    </Animated.View>
  );
}
```

**Use For:**
- Gesture-based animations
- Complex interactions
- High-performance animations
- Smooth 60fps animations

---

#### 2. React Native Animated API

**Purpose:** Built-in animation library

```typescript
import { Animated } from 'react-native';

function FadeInView({ children }) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  
  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, []);
  
  return (
    <Animated.View style={{ opacity: fadeAnim }}>
      {children}
    </Animated.View>
  );
}
```

**Use For:**
- Simple animations
- Opacity, transform, scale
- Interpolations
- Sequential animations

---

#### 3. Lottie

**Purpose:** Complex, designer-created animations

```typescript
import LottieView from 'lottie-react-native';

function SuccessAnimation() {
  return (
    <LottieView
      source={require('./success.json')}
      autoPlay
      loop={false}
      style={{ width: 200, height: 200 }}
    />
  );
}
```

**Use For:**
- Victory animations
- Loading spinners
- Complex illustrations
- Character animations

---

## Timing and Easing

### Duration Standards

```typescript
const durations = {
  instant: 0,           // No animation
  fast: 150,           // Quick feedback
  normal: 300,         // Standard animations
  slow: 500,           // Emphasis animations
  verySlow: 1000,      // Special effects
};
```

### Duration Guidelines

**Micro-interactions (150ms):**
- Button press feedback
- Toggle switches
- Checkbox/radio selections
- Icon state changes

**Standard Transitions (300ms):**
- Screen transitions
- Modal appearances
- Card flips
- Fade in/out

**Emphasis Animations (500ms):**
- Success celebrations
- Error notifications
- Important state changes
- Game completion effects

**Special Effects (1000ms+):**
- Victory animations
- Achievement unlocks
- Elaborate transitions
- Particle effects

---

### Easing Functions

```typescript
import { Easing } from 'react-native';

const easingFunctions = {
  // Linear - constant speed
  linear: Easing.linear,
  
  // Ease - start slow, speed up, slow down
  ease: Easing.ease,
  
  // Ease In - start slow, accelerate
  easeIn: Easing.in(Easing.ease),
  
  // Ease Out - start fast, decelerate
  easeOut: Easing.out(Easing.ease),
  
  // Ease In Out - slow start and end
  easeInOut: Easing.inOut(Easing.ease),
  
  // Spring - bouncy, natural feel
  spring: Easing.elastic(1),
  
  // Back - slight overshoot
  back: Easing.back(1.5),
};
```

### Easing Guidelines

**Use `easeOut` for:**
- Elements entering the screen
- Expanding elements
- Opening menus/modals

**Use `easeIn` for:**
- Elements leaving the screen
- Collapsing elements
- Closing menus/modals

**Use `easeInOut` for:**
- Elements moving on screen
- Position changes
- Smooth transitions

**Use `spring` for:**
- Playful interactions
- Button presses
- Bounce effects
- Natural movement

---

## Micro-Interactions

### Button Press Animation

**Spring Animation:**
```typescript
import Animated, { 
  useSharedValue, 
  useAnimatedStyle,
  withSpring 
} from 'react-native-reanimated';

function AnimatedButton({ children, onPress }) {
  const scale = useSharedValue(1);
  
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));
  
  return (
    <Animated.View style={animatedStyle}>
      <TouchableOpacity
        onPressIn={() => { scale.value = withSpring(0.95); }}
        onPressOut={() => { scale.value = withSpring(1); }}
        onPress={onPress}
      >
        {children}
      </TouchableOpacity>
    </Animated.View>
  );
}
```

**Specifications:**
- Duration: 150ms
- Easing: Spring
- Scale: 0.95 (5% reduction)
- Effect: Subtle press feedback

---

### Ripple Effect

```typescript
function RippleButton({ onPress, children }) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={{
        overflow: 'hidden',
        borderRadius: 8,
      }}
      activeOpacity={0.7}
    >
      {children}
    </TouchableOpacity>
  );
}
```

**Specifications:**
- Duration: 300ms
- Easing: easeOut
- Effect: Circular expansion from touch point
- Color: Primary with 20% opacity

---

### Toggle Switch

```typescript
function AnimatedToggle({ value, onToggle }) {
  const position = useSharedValue(value ? 1 : 0);
  const { currentTheme } = useThemeContext();
  
  useEffect(() => {
    position.value = withSpring(value ? 1 : 0);
  }, [value]);
  
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: position.value * 20 }
    ],
  }));
  
  return (
    <TouchableOpacity onPress={onToggle}>
      <View style={{
        width: 50,
        height: 30,
        borderRadius: 15,
        backgroundColor: value 
          ? currentTheme.colors.primary 
          : currentTheme.colors.grayBackground,
        padding: 2,
      }}>
        <Animated.View style={[
          {
            width: 26,
            height: 26,
            borderRadius: 13,
            backgroundColor: '#fff',
          },
          animatedStyle,
        ]} />
      </View>
    </TouchableOpacity>
  );
}
```

**Specifications:**
- Duration: 200ms
- Easing: Spring
- Movement: 20px translation
- Color transition: Gray to Primary

---

### Checkbox/Radio Selection

```typescript
function AnimatedCheckbox({ checked, onToggle }) {
  const scale = useSharedValue(checked ? 1 : 0);
  const { currentTheme } = useThemeContext();
  
  useEffect(() => {
    scale.value = withSpring(checked ? 1 : 0);
  }, [checked]);
  
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));
  
  return (
    <TouchableOpacity
      onPress={onToggle}
      style={{
        width: 24,
        height: 24,
        borderRadius: 4,
        borderWidth: 2,
        borderColor: currentTheme.colors.primary,
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Animated.View style={animatedStyle}>
        <Ionicons 
          name="checkmark" 
          size={16} 
          color={currentTheme.colors.primary} 
        />
      </Animated.View>
    </TouchableOpacity>
  );
}
```

**Specifications:**
- Duration: 200ms
- Easing: Spring
- Scale: 0 to 1
- Effect: Pop-in appearance

---

## Screen Transitions

### Fade Transition

```typescript
function FadeTransition({ children, visible }) {
  const opacity = useSharedValue(visible ? 1 : 0);
  
  useEffect(() => {
    opacity.value = withTiming(visible ? 1 : 0, { duration: 300 });
  }, [visible]);
  
  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));
  
  return (
    <Animated.View style={animatedStyle}>
      {children}
    </Animated.View>
  );
}
```

**Specifications:**
- Duration: 300ms
- Easing: easeInOut
- Opacity: 0 to 1

---

### Slide Transition

```typescript
function SlideTransition({ children, visible, direction = 'right' }) {
  const translateX = useSharedValue(visible ? 0 : 300);
  const { width } = Dimensions.get('window');
  
  useEffect(() => {
    translateX.value = withTiming(
      visible ? 0 : (direction === 'right' ? width : -width),
      { duration: 300, easing: Easing.out(Easing.ease) }
    );
  }, [visible]);
  
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));
  
  return (
    <Animated.View style={animatedStyle}>
      {children}
    </Animated.View>
  );
}
```

**Specifications:**
- Duration: 300ms
- Easing: easeOut
- Distance: Screen width
- Direction: Left, right, up, down

---

### Scale Transition

```typescript
function ScaleTransition({ children, visible }) {
  const scale = useSharedValue(visible ? 1 : 0.8);
  const opacity = useSharedValue(visible ? 1 : 0);
  
  useEffect(() => {
    scale.value = withSpring(visible ? 1 : 0.8);
    opacity.value = withTiming(visible ? 1 : 0, { duration: 300 });
  }, [visible]);
  
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));
  
  return (
    <Animated.View style={animatedStyle}>
      {children}
    </Animated.View>
  );
}
```

**Specifications:**
- Duration: 300ms
- Easing: Spring (scale), easeInOut (opacity)
- Scale: 0.8 to 1.0
- Opacity: 0 to 1

---

## Game-Specific Animations

### Number Entry (Sudoku)

```typescript
function NumberEntryAnimation({ value, position }) {
  const scale = useSharedValue(0);
  const opacity = useSharedValue(0);
  
  useEffect(() => {
    // Pop-in effect
    scale.value = withSpring(1, {
      damping: 10,
      stiffness: 100,
    });
    opacity.value = withTiming(1, { duration: 200 });
  }, [value]);
  
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));
  
  return (
    <Animated.View style={animatedStyle}>
      <Text style={{ fontSize: 24 }}>{value}</Text>
    </Animated.View>
  );
}
```

**Specifications:**
- Duration: 200-300ms
- Easing: Spring
- Effect: Scale from 0 to 1 with bounce
- Purpose: Confirm number placement

---

### Tile Flip (Minesweeper)

```typescript
function TileFlip({ revealed, children }) {
  const rotateY = useSharedValue(revealed ? 180 : 0);
  
  useEffect(() => {
    rotateY.value = withTiming(revealed ? 180 : 0, {
      duration: 300,
      easing: Easing.out(Easing.ease),
    });
  }, [revealed]);
  
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { rotateY: `${rotateY.value}deg` },
    ],
  }));
  
  return (
    <Animated.View style={animatedStyle}>
      {children}
    </Animated.View>
  );
}
```

**Specifications:**
- Duration: 300ms
- Easing: easeOut
- Rotation: 0° to 180° (Y-axis)
- Effect: 3D flip reveal

---

### Word Selection (Word Search)

```typescript
function WordHighlight({ word, positions }) {
  const opacity = useSharedValue(0);
  const scale = useSharedValue(0.8);
  
  const animateHighlight = () => {
    opacity.value = withSequence(
      withTiming(1, { duration: 200 }),
      withDelay(500, withTiming(0.7, { duration: 300 }))
    );
    scale.value = withSequence(
      withSpring(1.1),
      withSpring(1)
    );
  };
  
  useEffect(() => {
    animateHighlight();
  }, [word]);
  
  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ scale: scale.value }],
  }));
  
  return (
    <Animated.View style={animatedStyle}>
      {/* Highlight overlay */}
    </Animated.View>
  );
}
```

**Specifications:**
- Duration: 700ms total (200ms in, 300ms settle)
- Easing: Spring
- Effect: Fade in with scale pulse
- Final state: Remains highlighted at 70% opacity

---

### Score Increment

```typescript
function AnimatedScore({ score }) {
  const displayScore = useSharedValue(score);
  const scale = useSharedValue(1);
  
  useEffect(() => {
    // Animate score counting up
    displayScore.value = withTiming(score, {
      duration: 500,
      easing: Easing.out(Easing.ease),
    });
    
    // Pulse effect on change
    scale.value = withSequence(
      withSpring(1.2, { damping: 5 }),
      withSpring(1)
    );
  }, [score]);
  
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));
  
  return (
    <Animated.View style={animatedStyle}>
      <Text style={{ fontFamily: 'SpaceMono', fontSize: 32 }}>
        {Math.floor(displayScore.value)}
      </Text>
    </Animated.View>
  );
}
```

**Specifications:**
- Duration: 500ms (count) + 300ms (pulse)
- Easing: easeOut (count), spring (pulse)
- Effect: Counting animation + scale pulse
- Purpose: Draw attention to score changes

---

## Loading Animations

### Spinner

```typescript
function Spinner({ size = 40 }) {
  const rotation = useSharedValue(0);
  const { currentTheme } = useThemeContext();
  
  useEffect(() => {
    rotation.value = withRepeat(
      withTiming(360, { duration: 1000, easing: Easing.linear }),
      -1, // Infinite
      false
    );
  }, []);
  
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation.value}deg` }],
  }));
  
  return (
    <Animated.View style={animatedStyle}>
      <View style={{
        width: size,
        height: size,
        borderRadius: size / 2,
        borderWidth: 3,
        borderColor: currentTheme.colors.grayBorder,
        borderTopColor: currentTheme.colors.primary,
      }} />
    </Animated.View>
  );
}
```

**Specifications:**
- Duration: 1000ms per rotation
- Easing: Linear
- Effect: Continuous rotation
- Infinite loop

---

### Pulse Animation

```typescript
function PulseLoader() {
  const scale = useSharedValue(1);
  const opacity = useSharedValue(1);
  
  useEffect(() => {
    scale.value = withRepeat(
      withSequence(
        withTiming(1.2, { duration: 600 }),
        withTiming(1, { duration: 600 })
      ),
      -1,
      false
    );
    
    opacity.value = withRepeat(
      withSequence(
        withTiming(0.5, { duration: 600 }),
        withTiming(1, { duration: 600 })
      ),
      -1,
      false
    );
  }, []);
  
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));
  
  return (
    <Animated.View style={[
      { width: 40, height: 40, borderRadius: 20, backgroundColor: '#ccc' },
      animatedStyle,
    ]} />
  );
}
```

**Specifications:**
- Duration: 1200ms per cycle (600ms in, 600ms out)
- Easing: Default (smooth)
- Effect: Pulsing scale and opacity
- Infinite loop

---

## Success/Error Feedback

### Success Animation

```typescript
import LottieView from 'lottie-react-native';

function SuccessAnimation({ onComplete }) {
  return (
    <View style={{ alignItems: 'center', justifyContent: 'center' }}>
      <LottieView
        source={require('./success-checkmark.json')}
        autoPlay
        loop={false}
        style={{ width: 150, height: 150 }}
        onAnimationFinish={onComplete}
      />
      <Text style={{
        fontFamily: 'Poppins-Bold',
        fontSize: 24,
        marginTop: 16,
      }}>
        Success!
      </Text>
    </View>
  );
}
```

**Specifications:**
- Duration: 1000-1500ms
- Effect: Checkmark animation + confetti
- Auto-dismiss or user-dismissible
- Sound effect recommended

---

### Error Shake

```typescript
function ErrorShake({ children, trigger }) {
  const translateX = useSharedValue(0);
  
  useEffect(() => {
    if (trigger) {
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
  
  return (
    <Animated.View style={animatedStyle}>
      {children}
    </Animated.View>
  );
}
```

**Specifications:**
- Duration: 250ms (5 × 50ms)
- Movement: ±10px horizontal
- Effect: Rapid left-right shake
- Purpose: Clear error indication

---

## Performance Considerations

### Use Native Driver

Always use `useNativeDriver: true` when possible:

```typescript
// ✅ Good - uses native driver
Animated.timing(value, {
  toValue: 1,
  duration: 300,
  useNativeDriver: true, // For opacity, transform
}).start();

// ❌ Bad - cannot use native driver for layout properties
Animated.timing(value, {
  toValue: 100,
  duration: 300,
  useNativeDriver: false, // Required for width, height, margins
}).start();
```

**Native Driver Supported:**
- opacity
- transform (translate, rotate, scale)

**Native Driver NOT Supported:**
- width, height
- margins, padding
- colors (use interpolation)

---

### Optimize Heavy Animations

**For large lists:**
```typescript
// Don't animate every item
const shouldAnimate = index < 20; // Only first 20 items

// Use simpler animations for lists
const simpleEntry = useSharedValue(0);
```

**For complex animations:**
```typescript
// Break into smaller, sequential animations
// Use Lottie for complex pre-rendered animations
// Cache animated components with React.memo
```

---

## Animation Testing

### Manual Testing Checklist

- [ ] Animations run at 60fps
- [ ] No jank or stuttering
- [ ] Reduced motion preference is respected
- [ ] Animations complete properly
- [ ] No memory leaks from infinite animations
- [ ] Works on low-end devices
- [ ] Battery impact is minimal
- [ ] Animations enhance rather than distract

---

## Best Practices

### Do's ✅

- Keep animations short (< 500ms typically)
- Use native driver when possible
- Respect reduced motion preferences
- Test on low-end devices
- Use spring animations for natural feel
- Provide clear feedback for all actions
- Use Lottie for complex animations

### Don'ts ❌

- Don't animate everything
- Don't use very long animations (> 1000ms)
- Don't ignore performance impact
- Don't animate layout properties in large lists
- Don't create infinite animations without cleanup
- Don't use animations purely for decoration
- Don't make critical actions wait for animations

---

## Related Documentation

- [Components](./04-components.md) - Component states and interactions
- [Theme System](./01-themes.md) - Theme-aware animations
- [Game-Specific Standards](./06-game-visuals.md) - Game animation patterns
