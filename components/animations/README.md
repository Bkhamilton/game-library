# Animation Examples

This directory contains test components and reusable animation utilities demonstrating the three animation libraries configured for the game library project.

## Directory Structure

```
components/animations/
├── index.tsx                  # Main exports
├── ReanimatedExamples.tsx    # React Native Reanimated examples
├── LottieExamples.tsx        # Lottie animation examples
├── ConfettiExamples.tsx      # Confetti particle effects examples
└── README.md                 # This file
```

## Test Screens

Each animation library has a dedicated test screen that can be used to verify installation and see usage examples.

### 1. Reanimated Test Screen

Demonstrates react-native-reanimated capabilities:

```typescript
import { AnimationTestScreen } from '@/components/animations';

// In your component
<AnimationTestScreen />
```

**Features Demonstrated:**
- Animated button with spring physics
- Fade-in animations on mount
- Continuous pulse animations
- Shake animations for error feedback

### 2. Lottie Test Screen

Demonstrates lottie-react-native capabilities:

```typescript
import { LottieTestScreen } from '@/components/animations';

// In your component
<LottieTestScreen />
```

**Features Demonstrated:**
- Basic Lottie animation playback
- Animation control (play, pause, reset)
- Loop and autoPlay options
- Animation callbacks

### 3. Confetti Test Screen

Demonstrates react-native-confetti-cannon capabilities:

```typescript
import { ConfettiTestScreen } from '@/components/animations';

// In your component
<ConfettiTestScreen />
```

**Features Demonstrated:**
- Basic confetti from corners
- Custom colored confetti
- Center burst confetti
- Different explosion patterns

## Reusable Components

### AnimatedButton

A button with spring-based press animation.

```typescript
import { AnimatedButton } from '@/components/animations';

<AnimatedButton onPress={() => console.log('Pressed')}>
  <Text>Press Me</Text>
</AnimatedButton>
```

### FadeInView

Automatically fades in content when mounted.

```typescript
import { FadeInView } from '@/components/animations';

<FadeInView duration={500}>
  <Text>This will fade in</Text>
</FadeInView>
```

### PulseView

Continuously pulses its children.

```typescript
import { PulseView } from '@/components/animations';

<PulseView>
  <View>
    <Text>This pulses</Text>
  </View>
</PulseView>
```

### ShakeView

Shakes when triggered (useful for error feedback).

```typescript
import { ShakeView } from '@/components/animations';

const [shakeCount, setShakeCount] = useState(0);

<ShakeView trigger={shakeCount}>
  <Text>Shake on error</Text>
</ShakeView>

// Trigger shake:
setShakeCount(prev => prev + 1);
```

### LoadingSpinner

Lottie-based loading indicator.

```typescript
import { LoadingSpinner } from '@/components/animations';

<LoadingSpinner visible={isLoading} size={100} />
```

### VictoryAnimation

Full-screen victory animation with Lottie.

```typescript
import { VictoryAnimation } from '@/components/animations';

<VictoryAnimation 
  visible={gameWon} 
  onComplete={() => console.log('Animation done')}
/>
```

### GameVictoryConfetti

Confetti celebration for game completion.

```typescript
import { GameVictoryConfetti } from '@/components/animations';

<GameVictoryConfetti 
  visible={gameCompleted}
  onComplete={() => console.log('Celebration done')}
/>
```

## Testing the Examples

To test these components in your app:

1. **Create a test screen** (e.g., in `app/animation-test.tsx`):

```typescript
import { View, ScrollView, StyleSheet } from 'react-native';
import { 
  AnimationTestScreen, 
  LottieTestScreen, 
  ConfettiTestScreen 
} from '@/components/animations';

export default function AnimationTestPage() {
  return (
    <ScrollView style={styles.container}>
      <AnimationTestScreen />
      <View style={styles.separator} />
      <LottieTestScreen />
      <View style={styles.separator} />
      <ConfettiTestScreen />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  separator: {
    height: 40,
  },
});
```

2. **Add a navigation route** to access the test screen

3. **Run the app** and navigate to the test screen

## Integration into Games

### Example: Sudoku Number Entry

```typescript
import { FadeInView, ShakeView } from '@/components/animations';

function SudokuCell({ value, isError }) {
  const [errorTrigger, setErrorTrigger] = useState(0);
  
  useEffect(() => {
    if (isError) {
      setErrorTrigger(prev => prev + 1);
    }
  }, [isError]);
  
  return (
    <ShakeView trigger={errorTrigger}>
      <FadeInView duration={200}>
        <Text>{value}</Text>
      </FadeInView>
    </ShakeView>
  );
}
```

### Example: Game Completion

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
          // Navigate to results screen
        }}
      />
    </View>
  );
}
```

### Example: Loading State

```typescript
import { LoadingSpinner } from '@/components/animations';

function GameLoader() {
  const [isLoading, setIsLoading] = useState(true);
  
  return (
    <View>
      {isLoading ? (
        <LoadingSpinner visible={true} size={150} />
      ) : (
        <GameContent />
      )}
    </View>
  );
}
```

## Performance Notes

- **Reanimated**: Use native driver where possible for 60fps animations
- **Lottie**: Keep JSON files under 100KB for best performance
- **Confetti**: Limit particle count to 100-200 on mobile devices

## Further Reading

See the main documentation at `/docs/ANIMATION_LIBRARIES.md` for:
- Complete API documentation
- Configuration details
- Platform-specific considerations
- Troubleshooting guide
- Performance optimization tips
