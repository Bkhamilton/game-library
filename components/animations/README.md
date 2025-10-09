# Animation Examples

This directory contains reusable animation components built with `react-native-reanimated` for the Game Library.

## Available Components

### Reusable Components

#### AnimatedButton

A button with spring-based press animation.

```typescript
import { AnimatedButton } from '@/components/animations';

<AnimatedButton onPress={() => console.log('Pressed')}>
  <Text>Press Me</Text>
</AnimatedButton>
```

#### FadeInView

Automatically fades in content when mounted.

```typescript
import { FadeInView } from '@/components/animations';

<FadeInView duration={500}>
  <Text>This will fade in</Text>
</FadeInView>
```

#### PulseView

Continuously pulses its children.

```typescript
import { PulseView } from '@/components/animations';

<PulseView>
  <View>
    <Text>This pulses</Text>
  </View>
</PulseView>
```

#### ShakeView

Shakes content when triggered, useful for error feedback.

```typescript
import { ShakeView } from '@/components/animations';

function MyComponent() {
  const [errorTrigger, setErrorTrigger] = useState(0);
  
  const handleError = () => {
    setErrorTrigger(prev => prev + 1);
  };
  
  return (
    <ShakeView trigger={errorTrigger}>
      <Text>This will shake on error</Text>
    </ShakeView>
  );
}
```

#### LoadingSpinner

Animated loading spinner.

```typescript
import { LoadingSpinner } from '@/components/animations';

<LoadingSpinner size="large" color="#007AFF" />
```

#### VictoryAnimation

Celebration overlay for game completion.

```typescript
import { VictoryAnimation } from '@/components/animations';

<VictoryAnimation 
  visible={gameWon}
  onComplete={() => console.log('Animation complete')}
>
  <Text>You Won!</Text>
</VictoryAnimation>
```

#### GameVictoryConfetti

Confetti animation for game wins.

```typescript
import { GameVictoryConfetti } from '@/components/animations';

<GameVictoryConfetti 
  visible={gameWon}
  onComplete={() => console.log('Confetti done')}
/>
```

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

## Performance Notes

- All animations use the native driver for optimal performance
- Animations target 60fps
- Use `worklet` directive for animations that run on the UI thread
- Avoid animating layout properties (width, height) when possible

## Best Practices

1. **Use appropriate durations**: Fast for feedback (150ms), normal for transitions (300ms), slow for emphasis (500ms+)
2. **Respect accessibility**: Check for reduced motion preferences
3. **Clean up animations**: Ensure infinite animations are stopped when components unmount
4. **Test on devices**: Always test on actual devices, not just simulators
