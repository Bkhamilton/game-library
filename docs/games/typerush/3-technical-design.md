# TypeRush - Technical Design

## Overview

This document outlines the technical implementation details for TypeRush, including input handling, obstacle generation algorithms, performance optimization, and platform-specific considerations.

## System Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────┐
│            Game Controller                   │
│  (Main game loop, state management)         │
└──────────┬──────────────────────┬───────────┘
           │                      │
    ┌──────▼──────┐      ┌───────▼────────┐
    │   Input     │      │    Obstacle    │
    │   System    │      │    Manager     │
    └──────┬──────┘      └────────┬───────┘
           │                      │
    ┌──────▼──────────────────────▼───────┐
    │        Physics & Collision           │
    │         Detection Engine             │
    └──────────────┬───────────────────────┘
                   │
            ┌──────▼──────┐
            │   Renderer  │
            │  (60 FPS)   │
            └─────────────┘
```

### Component Breakdown

```typescript
// Core game architecture
interface GameState {
  isRunning: boolean;
  score: number;
  currentSpeed: number;
  playerPosition: Position;
  obstacles: Obstacle[];
  currentPrompt: TypePrompt | null;
  stats: GameStats;
}

interface Position {
  x: number;      // Horizontal position
  y: number;      // Vertical position
  lane: 'left' | 'center' | 'right';
}

interface GameStats {
  obstaclesPassed: number;
  totalDistance: number;
  accuracy: number;
  averageWPM: number;
  comboMultiplier: number;
  longestCombo: number;
}
```

## Input System

### Keyboard Event Handling

#### React Native Implementation

```typescript
import { TextInput } from 'react-native';
import { useEffect, useRef, useState } from 'react';

const TypeRushInput = () => {
  const inputRef = useRef<TextInput>(null);
  const [inputValue, setInputValue] = useState('');
  const [currentPrompt, setCurrentPrompt] = useState<string>('');

  // Focus input on mount and keep focused
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleKeyPress = (e: NativeSyntheticEvent<TextInputKeyPressEventData>) => {
    const key = e.nativeEvent.key;
    
    // Immediate character detection
    if (key.length === 1) {
      processCharacter(key);
    }
    
    // Special keys
    switch(key) {
      case 'Enter':
        processComplete();
        break;
      case 'Backspace':
        handleBackspace();
        break;
    }
  };

  const processCharacter = (char: string) => {
    const timestamp = Date.now();
    
    // Check if character matches expected
    if (validateCharacter(char, currentPrompt)) {
      handleCorrectInput(char, timestamp);
    } else {
      handleIncorrectInput(char, timestamp);
    }
  };

  return (
    <TextInput
      ref={inputRef}
      value={inputValue}
      onChangeText={setInputValue}
      onKeyPress={handleKeyPress}
      autoFocus={true}
      autoCapitalize="none"
      autoCorrect={false}
      spellCheck={false}
      keyboardType="default"
      style={{ opacity: 0, position: 'absolute' }}
    />
  );
};
```

#### Input Validation

```typescript
const validateCharacter = (
  input: string, 
  expected: string,
  caseSensitive: boolean = true
): boolean => {
  if (caseSensitive) {
    return input === expected;
  }
  return input.toLowerCase() === expected.toLowerCase();
};

// For multi-character prompts (words)
const validateSequence = (
  inputSequence: string,
  expectedSequence: string,
  partial: boolean = false
): ValidationResult => {
  if (partial) {
    // Check if input is correct so far
    return {
      isValid: expectedSequence.startsWith(inputSequence),
      progress: inputSequence.length,
      total: expectedSequence.length,
      isComplete: inputSequence === expectedSequence
    };
  }
  
  return {
    isValid: inputSequence === expectedSequence,
    progress: expectedSequence.length,
    total: expectedSequence.length,
    isComplete: inputSequence === expectedSequence
  };
};
```

### Mobile Keyboard Handling

#### iOS Keyboard Optimization

```typescript
// iOS-specific keyboard settings
const iOSKeyboardConfig = {
  // Disable QuickType suggestions bar
  autoCorrect: false,
  autoCapitalize: 'none',
  spellCheck: false,
  
  // Keyboard type
  keyboardType: 'default', // Or 'ascii-capable' for English only
  
  // Return key
  returnKeyType: 'done',
  
  // Prevent keyboard dismissal
  blurOnSubmit: false,
  
  // Keep keyboard visible
  keyboardShouldPersistTaps: 'always'
};

// Handle external keyboard events
import { KeyboardEvent } from 'react-native';

const handleHardwareKeyboard = (event: KeyboardEvent) => {
  // Hardware keyboard provides better events
  const key = event.key;
  const timestamp = event.timeStamp;
  
  processKeyPress(key, timestamp);
};
```

#### Android Keyboard Compatibility

```typescript
// Android-specific considerations
const androidKeyboardConfig = {
  // Similar to iOS
  autoCorrect: false,
  autoCapitalize: 'none',
  
  // Android-specific
  textContentType: 'none',
  importantForAutofill: 'no',
  
  // Handle different keyboard apps
  keyboardType: 'visible-password' // Disables suggestions
};

// Handle Gboard, SwiftKey, etc.
const detectKeyboardApp = () => {
  // Different keyboards may send events differently
  // Add compatibility layer if needed
};
```

### Input Latency Optimization

```typescript
// Minimize input-to-response latency
const INPUT_BUFFER_SIZE = 10; // Pre-allocate event buffer
const TARGET_LATENCY_MS = 50;  // Target response time

class InputProcessor {
  private eventQueue: KeyEvent[] = [];
  private lastProcessTime: number = 0;
  
  processKey(key: string, timestamp: number) {
    // Immediate processing (no debouncing for typing games)
    const latency = Date.now() - timestamp;
    
    if (latency > TARGET_LATENCY_MS) {
      console.warn('Input latency exceeded target:', latency);
    }
    
    // Directly process without queuing (for real-time feel)
    this.handleKeyImmediate(key, timestamp);
  }
  
  handleKeyImmediate(key: string, timestamp: number) {
    // Update game state immediately
    // Trigger animations immediately
    // Update UI immediately
  }
}
```

## Obstacle Generation

### Procedural Generation Algorithm

```typescript
interface ObstacleGenerationParams {
  difficulty: number;          // 0-100
  obstaclesPassed: number;     // Total count
  currentSpeed: number;        // Current game speed
  playerAccuracy: number;      // Recent accuracy %
  availableObstacleTypes: ObstacleType[];
}

class ObstacleGenerator {
  private lastObstacleTime: number = 0;
  private obstacleHistory: ObstacleType[] = [];
  
  generateNextObstacle(params: ObstacleGenerationParams): Obstacle {
    // Calculate spawn timing
    const spawnDelay = this.calculateSpawnDelay(params);
    
    // Select obstacle type based on difficulty
    const obstacleType = this.selectObstacleType(params);
    
    // Generate obstacle properties
    return this.createObstacle(obstacleType, params);
  }
  
  private calculateSpawnDelay(params: ObstacleGenerationParams): number {
    const baseDelay = 2000; // 2 seconds at start
    const minDelay = 800;   // Minimum 0.8 seconds
    
    // Decrease delay as difficulty increases
    const difficultyFactor = 1 - (params.difficulty / 150);
    const delay = baseDelay * difficultyFactor;
    
    // Adjust based on player performance
    const performanceAdjustment = params.playerAccuracy > 90 ? 0.9 : 1.0;
    
    return Math.max(delay * performanceAdjustment, minDelay);
  }
  
  private selectObstacleType(params: ObstacleGenerationParams): ObstacleType {
    // Weight obstacle types based on difficulty
    const weights = this.calculateTypeWeights(params);
    
    // Avoid repetition
    const recentTypes = this.obstacleHistory.slice(-3);
    weights.forEach((weight, type) => {
      if (recentTypes.includes(type)) {
        weights.set(type, weight * 0.3); // Reduce weight
      }
    });
    
    // Weighted random selection
    return this.weightedRandom(weights);
  }
  
  private calculateTypeWeights(
    params: ObstacleGenerationParams
  ): Map<ObstacleType, number> {
    const weights = new Map<ObstacleType, number>();
    
    // Early game: simple obstacles
    if (params.obstaclesPassed < 10) {
      weights.set('single_char', 1.0);
      weights.set('word', 0.1);
      return weights;
    }
    
    // Mid game: introduce variety
    if (params.obstaclesPassed < 30) {
      weights.set('single_char', 0.6);
      weights.set('word', 0.3);
      weights.set('number', 0.1);
      return weights;
    }
    
    // Late game: all types
    weights.set('single_char', 0.3);
    weights.set('word', 0.3);
    weights.set('number', 0.2);
    weights.set('symbol', 0.1);
    weights.set('combo', 0.1);
    
    return weights;
  }
  
  private createObstacle(
    type: ObstacleType,
    params: ObstacleGenerationParams
  ): Obstacle {
    switch (type) {
      case 'single_char':
        return this.createSingleCharObstacle(params);
      case 'word':
        return this.createWordObstacle(params);
      case 'number':
        return this.createNumberObstacle(params);
      case 'symbol':
        return this.createSymbolObstacle(params);
      case 'combo':
        return this.createComboObstacle(params);
      default:
        return this.createSingleCharObstacle(params);
    }
  }
  
  private createWordObstacle(params: ObstacleGenerationParams): WordObstacle {
    // Select word from dictionary based on difficulty
    const wordLength = Math.floor(3 + (params.difficulty / 20));
    const word = this.selectWord(wordLength, params.difficulty);
    
    return {
      type: 'word',
      word: word,
      x: SCREEN_WIDTH,
      lane: this.randomLane(),
      timingWindow: this.calculateTimingWindow(word.length),
      visualType: this.selectVisualType(params.difficulty)
    };
  }
}
```

### Word Dictionary Management

```typescript
// Word lists organized by difficulty and length
const WORD_DICTIONARY = {
  easy: {
    short: ['cat', 'dog', 'run', 'jump', 'fast'],
    medium: ['dodge', 'quick', 'slide', 'move'],
    long: ['faster', 'careful', 'obstacle']
  },
  medium: {
    short: ['gym', 'why', 'sky', 'try'],
    medium: ['dodge', 'react', 'swift', 'ninja'],
    long: ['velocity', 'keyboard', 'typing']
  },
  hard: {
    short: ['lynx', 'onyx', 'quiz'],
    medium: ['rhythm', 'psyche', 'glyph'],
    long: ['xylophone', 'psychology', 'rhythm']
  }
};

class WordSelector {
  selectWord(length: number, difficulty: number): string {
    const category = this.getDifficultyCategory(difficulty);
    const lengthGroup = this.getLengthGroup(length);
    
    const words = WORD_DICTIONARY[category][lengthGroup];
    return words[Math.floor(Math.random() * words.length)];
  }
  
  private getDifficultyCategory(difficulty: number): 'easy' | 'medium' | 'hard' {
    if (difficulty < 30) return 'easy';
    if (difficulty < 70) return 'medium';
    return 'hard';
  }
  
  private getLengthGroup(length: number): 'short' | 'medium' | 'long' {
    if (length <= 3) return 'short';
    if (length <= 5) return 'medium';
    return 'long';
  }
}
```

### Obstacle Spawning System

```typescript
// Obstacle pool management
class ObstaclePool {
  private activeObstacles: Obstacle[] = [];
  private inactivePool: Obstacle[] = [];
  private maxPoolSize = 20;
  
  spawn(obstacle: Obstacle) {
    // Reuse from pool if available
    let obstacleInstance: Obstacle;
    
    if (this.inactivePool.length > 0) {
      obstacleInstance = this.inactivePool.pop()!;
      this.resetObstacle(obstacleInstance, obstacle);
    } else {
      obstacleInstance = obstacle;
    }
    
    this.activeObstacles.push(obstacleInstance);
    return obstacleInstance;
  }
  
  despawn(obstacle: Obstacle) {
    const index = this.activeObstacles.indexOf(obstacle);
    if (index > -1) {
      this.activeObstacles.splice(index, 1);
      
      // Return to pool if not full
      if (this.inactivePool.length < this.maxPoolSize) {
        this.inactivePool.push(obstacle);
      }
    }
  }
  
  update(deltaTime: number) {
    // Update all active obstacles
    for (let i = this.activeObstacles.length - 1; i >= 0; i--) {
      const obstacle = this.activeObstacles[i];
      
      // Move obstacle
      obstacle.x -= this.currentSpeed * deltaTime;
      
      // Despawn if off-screen
      if (obstacle.x < -100) {
        this.despawn(obstacle);
      }
    }
  }
}
```

## Performance Requirements

### Target Performance Metrics

```typescript
const PERFORMANCE_TARGETS = {
  frameRate: 60,              // FPS
  inputLatency: 50,           // milliseconds
  renderTime: 16.67,          // milliseconds per frame
  memoryUsage: 100,           // MB maximum
  batteryImpact: 'low',       // iOS energy impact
  cpuUsage: 30                // % maximum
};
```

### Frame Rate Optimization

```typescript
// Game loop with fixed timestep
class GameLoop {
  private lastFrameTime: number = 0;
  private accumulator: number = 0;
  private readonly fixedTimeStep = 1000 / 60; // 60 FPS
  
  start() {
    this.lastFrameTime = Date.now();
    this.tick();
  }
  
  tick = () => {
    const currentTime = Date.now();
    const deltaTime = currentTime - this.lastFrameTime;
    this.lastFrameTime = currentTime;
    
    // Accumulate time
    this.accumulator += deltaTime;
    
    // Fixed timestep updates
    while (this.accumulator >= this.fixedTimeStep) {
      this.update(this.fixedTimeStep);
      this.accumulator -= this.fixedTimeStep;
    }
    
    // Render with interpolation
    const alpha = this.accumulator / this.fixedTimeStep;
    this.render(alpha);
    
    // Request next frame
    requestAnimationFrame(this.tick);
  };
  
  update(deltaTime: number) {
    // Update game logic
    this.updatePhysics(deltaTime);
    this.updateObstacles(deltaTime);
    this.checkCollisions();
    this.updateScore();
  }
  
  render(alpha: number) {
    // Interpolate positions for smooth rendering
    this.renderInterpolated(alpha);
  }
}
```

### Memory Management

```typescript
// Efficient obstacle management
class MemoryOptimizedObstacleManager {
  private readonly maxObstacles = 10; // Limit concurrent obstacles
  
  // Object pooling for obstacles
  private obstaclePool = new ObstaclePool(this.maxObstacles);
  
  // Lazy cleanup
  private cleanupInterval = 1000; // Clean every second
  private lastCleanup = 0;
  
  update(currentTime: number) {
    // Periodic cleanup instead of every frame
    if (currentTime - this.lastCleanup > this.cleanupInterval) {
      this.cleanup();
      this.lastCleanup = currentTime;
    }
  }
  
  cleanup() {
    // Remove off-screen obstacles
    this.obstaclePool.removeOffScreen();
    
    // Clear unused refs
    this.clearUnusedReferences();
    
    // Force garbage collection hint (doesn't always work)
    if (global.gc) {
      global.gc();
    }
  }
}
```

### Rendering Optimization

```typescript
// Use React.memo and shouldComponentUpdate
import React, { memo } from 'react';

interface ObstacleProps {
  obstacle: Obstacle;
  gameSpeed: number;
}

// Only re-render when obstacle or speed changes
const ObstacleComponent = memo(({ obstacle, gameSpeed }: ObstacleProps) => {
  return (
    <Animated.View
      style={{
        position: 'absolute',
        left: obstacle.x,
        top: obstacle.y,
        // Use native driver for animations
        transform: [{ translateX: obstacle.animatedX }]
      }}
    >
      <Text style={styles.promptText}>{obstacle.prompt}</Text>
    </Animated.View>
  );
}, (prevProps, nextProps) => {
  // Custom comparison
  return (
    prevProps.obstacle.x === nextProps.obstacle.x &&
    prevProps.obstacle.prompt === nextProps.obstacle.prompt &&
    prevProps.gameSpeed === nextProps.gameSpeed
  );
});

// Use native driver for animations
Animated.timing(obstacle.animatedX, {
  toValue: -100,
  duration: 2000,
  easing: Easing.linear,
  useNativeDriver: true // Offload to native thread
}).start();
```

## Platform Considerations

### iOS Specific

#### Keyboard Handling

```typescript
// iOS keyboard event optimization
const iOSInputHandler = {
  // Use hardware keyboard API when available
  setupHardwareKeyboard() {
    if (Platform.OS === 'ios') {
      KeyboardEventManager.addListener('keyPress', this.handleKeyPress);
    }
  },
  
  // Handle predictive text
  disablePredictiveText() {
    return {
      autoCorrect: false,
      autoCapitalize: 'none',
      spellCheck: false,
      // iOS 13+: Disable QuickPath
      textContentType: 'oneTimeCode'
    };
  },
  
  // Handle iPad split keyboard
  handleSplitKeyboard() {
    // Adjust layout for split keyboard mode
    // Detect keyboard height changes
  }
};
```

#### Performance Monitoring

```typescript
// iOS performance monitoring
import { PerformanceMonitor } from 'react-native-performance-monitor';

const iOSPerformanceConfig = {
  // Monitor FPS
  trackFPS: true,
  fpsTarget: 60,
  
  // Monitor energy impact
  trackEnergy: true,
  
  // Monitor memory
  trackMemory: true,
  memoryWarningThreshold: 0.8,
  
  // Alert on performance issues
  onPerformanceIssue: (issue) => {
    console.warn('Performance issue:', issue);
    // Reduce visual effects
    // Lower obstacle spawn rate
  }
};
```

### Android Specific

#### Keyboard Compatibility

```typescript
// Android keyboard compatibility layer
const androidInputHandler = {
  // Handle different keyboard apps
  detectKeyboardType() {
    // Gboard, SwiftKey, Samsung Keyboard, etc.
    // May need different event handling
  },
  
  // Handle input methods
  setupInputMethod() {
    return {
      // Disable suggestions
      autoCorrect: false,
      autoComplete: false,
      
      // Android-specific
      importantForAutofill: 'no',
      textContentType: 'none',
      
      // Use visible-password to bypass suggestions
      keyboardType: 'visible-password'
    };
  },
  
  // Handle soft keyboard show/hide
  handleKeyboardVisibility() {
    Keyboard.addListener('keyboardDidShow', () => {
      // Adjust layout
    });
    
    Keyboard.addListener('keyboardDidHide', () => {
      // Keep keyboard visible!
      this.showKeyboard();
    });
  }
};
```

#### Performance Optimization

```typescript
// Android-specific optimizations
const androidOptimizations = {
  // Use TextureView instead of SurfaceView
  useTextureView: true,
  
  // Enable hardware acceleration
  enableHardwareAcceleration: true,
  
  // Reduce overdraw
  removeBackgroundColors: true,
  
  // Optimize lists/scrolling
  removeClippedSubviews: true,
  
  // Use native driver
  useNativeDriver: true,
  
  // Reduce animations on low-end devices
  detectDeviceTier() {
    const ramMB = DeviceInfo.getTotalMemory() / (1024 * 1024);
    if (ramMB < 2048) {
      return 'low-end';
    } else if (ramMB < 4096) {
      return 'mid-range';
    }
    return 'high-end';
  }
};
```

## Collision Detection

### Efficient Collision Algorithm

```typescript
interface BoundingBox {
  x: number;
  y: number;
  width: number;
  height: number;
}

class CollisionDetector {
  // Axis-Aligned Bounding Box (AABB) collision
  checkCollision(player: BoundingBox, obstacle: BoundingBox): boolean {
    return (
      player.x < obstacle.x + obstacle.width &&
      player.x + player.width > obstacle.x &&
      player.y < obstacle.y + obstacle.height &&
      player.y + player.height > obstacle.y
    );
  }
  
  // With collision tolerance for better gameplay feel
  checkCollisionWithTolerance(
    player: BoundingBox,
    obstacle: BoundingBox,
    tolerance: number = 10
  ): boolean {
    const adjustedPlayer = {
      x: player.x + tolerance,
      y: player.y + tolerance,
      width: player.width - (tolerance * 2),
      height: player.height - (tolerance * 2)
    };
    
    return this.checkCollision(adjustedPlayer, obstacle);
  }
  
  // Optimized: only check obstacles near player
  checkRelevantCollisions(
    player: BoundingBox,
    obstacles: Obstacle[]
  ): Obstacle | null {
    for (const obstacle of obstacles) {
      // Skip obstacles that are far away
      const distance = Math.abs(obstacle.x - player.x);
      if (distance > 200) continue; // Out of range
      
      if (this.checkCollisionWithTolerance(player, obstacle)) {
        return obstacle;
      }
    }
    
    return null;
  }
}
```

## Accessibility Features

### Visual Accessibility

```typescript
// High contrast mode
const highContrastTheme = {
  background: '#000000',
  text: '#FFFFFF',
  obstacle: '#FF0000',
  player: '#00FF00',
  ui: '#FFFF00'
};

// Colorblind modes
const colorblindModes = {
  protanopia: {
    // Red-blind
    obstacle: '#0066CC',
    success: '#00AA00'
  },
  deuteranopia: {
    // Green-blind
    obstacle: '#CC6600',
    success: '#0000AA'
  },
  tritanopia: {
    // Blue-blind
    obstacle: '#CC0000',
    success: '#00CC00'
  }
};

// Adjustable text size
const textSizes = {
  small: 18,
  medium: 24,
  large: 32,
  extraLarge: 48
};
```

### Audio Accessibility

```typescript
// Audio cues for visual feedback
class AudioFeedbackSystem {
  playCorrectSound() {
    // Pleasant chime for correct typing
    Sound.play('correct.mp3', { volume: 0.5 });
  }
  
  playIncorrectSound() {
    // Distinct error sound
    Sound.play('error.mp3', { volume: 0.7 });
  }
  
  playComboSound(comboLevel: number) {
    // Escalating combo sounds
    Sound.play(`combo_${comboLevel}.mp3`);
  }
  
  playCollisionSound() {
    // Crash sound
    Sound.play('collision.mp3', { volume: 0.8 });
  }
}
```

### Motor Accessibility

```typescript
// Longer timing windows for accessibility
const accessibilityTiming = {
  standard: 1000,      // 1 second
  extended: 2000,      // 2 seconds
  generous: 3000       // 3 seconds
};

// Voice input support (future feature)
const voiceInputSupport = {
  enabled: false,
  commands: ['jump', 'slide', 'left', 'right'],
  recognitionLanguage: 'en-US'
};
```

## Database Integration

### Score Storage Schema

```typescript
interface GameScore {
  userId: string;
  gameId: number;        // TypeRush game ID
  timestamp: number;
  score: number;
  metrics: {
    distance: number;
    obstaclesPassed: number;
    accuracy: number;
    averageWPM: number;
    topSpeed: number;
    longestCombo: number;
    characterAccuracy: CharacterAccuracy[];
  };
}

interface CharacterAccuracy {
  character: string;
  attempts: number;
  successes: number;
  averageTime: number;
}
```

### Analytics Tracking

```typescript
// Track typing improvement over time
class TypingAnalytics {
  async recordSession(session: GameScore) {
    // Store in local database
    await db.insertScore(session);
    
    // Update aggregate stats
    await this.updateAggregateStats(session);
  }
  
  async getImprovementMetrics(userId: string, days: number = 30) {
    const sessions = await db.getRecentSessions(userId, days);
    
    return {
      wpmTrend: this.calculateWPMTrend(sessions),
      accuracyTrend: this.calculateAccuracyTrend(sessions),
      weakCharacters: this.identifyWeakCharacters(sessions),
      improvementRate: this.calculateImprovementRate(sessions)
    };
  }
  
  private calculateWPMTrend(sessions: GameScore[]): TrendData {
    // Linear regression on WPM over time
    // Return slope (WPM improvement per day)
  }
}
```

## Testing Strategy

### Performance Testing

```typescript
// Automated performance tests
describe('TypeRush Performance', () => {
  it('maintains 60 FPS with 10 obstacles', () => {
    const game = new TypeRushGame();
    game.spawnObstacles(10);
    
    const fps = measureFPS(1000); // Measure for 1 second
    expect(fps).toBeGreaterThanOrEqual(58); // Allow 2 FPS drop
  });
  
  it('handles input with <50ms latency', () => {
    const game = new TypeRushGame();
    const latencies = [];
    
    for (let i = 0; i < 100; i++) {
      const start = Date.now();
      game.processInput('A');
      const latency = Date.now() - start;
      latencies.push(latency);
    }
    
    const avgLatency = average(latencies);
    expect(avgLatency).toBeLessThan(50);
  });
});
```

### Input Testing

```typescript
// Test keyboard input handling
describe('Input System', () => {
  it('correctly validates single character', () => {
    const validator = new InputValidator();
    expect(validator.validate('J', 'J')).toBe(true);
    expect(validator.validate('K', 'J')).toBe(false);
  });
  
  it('validates case-sensitive words', () => {
    const validator = new InputValidator();
    expect(validator.validate('Jump', 'Jump')).toBe(true);
    expect(validator.validate('jump', 'Jump')).toBe(false);
  });
});
```

## Conclusion

The technical design of TypeRush prioritizes:

1. **Responsiveness**: Sub-50ms input latency for real-time feel
2. **Performance**: Consistent 60 FPS on target devices
3. **Compatibility**: Works across iOS and Android keyboards
4. **Accessibility**: Configurable for different abilities
5. **Scalability**: Efficient obstacle generation and management

These technical foundations ensure TypeRush delivers a smooth, responsive gaming experience while accurately tracking typing performance for educational value.

---

**Previous**: [← Gameplay Mechanics](./2-gameplay-mechanics.md) | **Next**: [User Experience Design →](./4-user-experience.md)
