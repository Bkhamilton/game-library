# TypeRush - Gameplay Mechanics

## Overview

This document details the core gameplay systems that make TypeRush engaging and educational. Every mechanic is designed to reinforce typing skill development while maintaining arcade-style excitement.

## Movement System

### Auto-Scroll Mechanics

The player character runs automatically, creating constant forward momentum:

```typescript
// Base speed constants
const BASE_SPEED = 5; // Units per frame
const MAX_SPEED = 15; // Maximum speed cap
const SPEED_INCREMENT = 0.05; // Speed increase per obstacle

// Speed calculation
currentSpeed = Math.min(
  BASE_SPEED + (obstaclesPassed * SPEED_INCREMENT),
  MAX_SPEED
);
```

**Design Rationale:**
- Auto-scrolling removes movement complexity
- Players focus entirely on typing
- Progressive speed creates natural difficulty curve
- Speed caps prevent impossible situations

### Lane System

The player navigates a 3-lane track (left, center, right):

```
┌─────────┬─────────┬─────────┐
│  Left   │ Center  │  Right  │
│  Lane   │  Lane   │  Lane   │
└─────────┴─────────┴─────────┘
```

**Lane Properties:**
- Player starts in center lane
- Can move left or right via typing commands
- Vertical position can change (jump/slide)
- Lane changes are instant (typing-triggered)

### Dodge Actions

Players perform dodge actions by typing the correct character(s):

| Action | Command Example | Effect | Use Case |
|--------|----------------|--------|----------|
| **Jump** | Type 'J' or 'SPACE' | Leap over low obstacle | Barriers on ground |
| **Slide** | Type 'S' or 'DOWN' | Duck under high obstacle | Overhead hazards |
| **Move Left** | Type 'A' or 'LEFT' | Shift to left lane | Obstacle in current/right lane |
| **Move Right** | Type 'D' or 'RIGHT' | Shift to right lane | Obstacle in current/left lane |

**Customizable Controls:**
Players can choose between:
- **Simple**: Single letters (J, S, A, D)
- **Standard**: Arrow keys and SPACE
- **Custom**: Player-defined keys
- **Random**: Different character each time (advanced mode)

## Obstacle Types

### 1. Basic Obstacles

#### Low Barrier (Ground Obstacle)

**Visual**: Hurdle or barrier on the ground  
**Action Required**: Jump (press assigned jump key)  
**Character Prompt**: Single character (e.g., "J" or "↑")  
**Timing Window**: 0.5-1.0 seconds before collision  
**Difficulty Scaling**: Speed of approach increases

```typescript
interface LowBarrier {
  type: 'low_barrier';
  lane: 'left' | 'center' | 'right';
  requiredAction: 'jump';
  promptCharacter: string;
  timingWindow: number; // milliseconds
}
```

#### High Barrier (Overhead Obstacle)

**Visual**: Beam or branch hanging overhead  
**Action Required**: Slide (press assigned slide key)  
**Character Prompt**: Single character (e.g., "S" or "↓")  
**Timing Window**: 0.5-1.0 seconds before collision  
**Difficulty Scaling**: Speed and height variance

#### Lane Barrier (Side Obstacle)

**Visual**: Wall or hazard blocking a lane  
**Action Required**: Move to different lane  
**Character Prompt**: Direction character (e.g., "A" or "D")  
**Timing Window**: 0.8-1.5 seconds before collision  
**Difficulty Scaling**: Multi-lane blocks, faster approach

### 2. Intermediate Obstacles

#### Word Barrier

**Visual**: Floating word that must be typed  
**Action Required**: Type entire word correctly  
**Character Prompt**: 3-5 letter word (e.g., "JUMP", "SLIDE")  
**Timing Window**: 1.5-2.5 seconds before collision  
**Difficulty Scaling**: Longer words, less common words

```typescript
interface WordBarrier {
  type: 'word_barrier';
  word: string; // e.g., "DODGE"
  currentProgress: number; // Letters typed correctly
  requiredLength: number; // Total letters
  timingWindow: number;
}
```

**Gameplay Flow:**
1. Word appears above obstacle: "DODGE"
2. Player types 'D' → shows "D____"
3. Player types 'O' → shows "DO___"
4. Continue until complete → obstacle avoided

#### Number Sequence

**Visual**: Series of numbers to type  
**Action Required**: Type numbers in sequence  
**Character Prompt**: 2-4 digit number (e.g., "247")  
**Timing Window**: 1.5-2.0 seconds  
**Difficulty Scaling**: More digits, faster sequences

#### Mixed Case Challenge

**Visual**: Word with mixed uppercase/lowercase  
**Action Required**: Type with exact case matching  
**Character Prompt**: "QuIcK" or "JuMp"  
**Timing Window**: 2.0-3.0 seconds  
**Difficulty Scaling**: More case variations, longer words

### 3. Advanced Obstacles

#### Symbol Sequence

**Visual**: Special characters to type  
**Action Required**: Type symbols correctly  
**Character Prompt**: "!@#" or "$%^"  
**Timing Window**: 2.0-3.0 seconds  
**Difficulty Scaling**: More symbols, rare symbols

```typescript
// Symbol difficulty tiers
const SYMBOL_TIERS = {
  easy: ['!', '@', '#', '$', '%'],
  medium: ['&', '*', '(', ')', '-', '+'],
  hard: ['{', '}', '[', ']', '|', '\\', '~']
};
```

#### Code Snippet

**Visual**: Programming syntax to type  
**Action Required**: Type code exactly  
**Character Prompt**: "if(x)" or "arr[0]"  
**Timing Window**: 3.0-4.0 seconds  
**Difficulty Scaling**: Longer snippets, more special characters

#### Combo Obstacle

**Visual**: Multiple actions required in sequence  
**Action Required**: Execute multiple dodges  
**Character Prompt**: "J-S-D" (Jump, then Slide, then Move Right)  
**Timing Window**: Variable (0.3s between actions)  
**Difficulty Scaling**: More actions, faster timing

**Example Combo Flow:**
```
Obstacle appears: "J-S-A"
1. Player types 'J' → Character jumps
2. Player types 'S' → Character slides (mid-air!)
3. Player types 'A' → Character moves left while sliding
All within 2.5 seconds or collision occurs
```

### 4. Expert Obstacles

#### Random Character

**Visual**: Question mark or random symbol  
**Action Required**: Type the character that appears  
**Character Prompt**: Changes rapidly (e.g., cycles through A-Z)  
**Timing Window**: Must type within 0.5s of character display  
**Difficulty Scaling**: Faster cycling, more obscure characters

#### Pattern Recognition

**Visual**: Pattern of characters (e.g., "A-B-A-B")  
**Action Required**: Complete the pattern  
**Character Prompt**: Shows "A-B-A-?" → player types "B"  
**Timing Window**: 2.0-3.0 seconds  
**Difficulty Scaling**: Complex patterns, longer sequences

#### Typing Speed Test

**Visual**: Full sentence to type  
**Action Required**: Type complete sentence quickly  
**Character Prompt**: "The quick brown fox jumps"  
**Timing Window**: 5.0-8.0 seconds  
**Difficulty Scaling**: Longer sentences, less time

## Difficulty Progression

### Speed Scaling

Speed increases gradually based on performance:

```typescript
// Difficulty calculation
const calculateDifficulty = (obstaclesPassed: number) => {
  const baseSpeed = 5;
  const speedIncrement = 0.05;
  const maxSpeed = 15;
  
  return {
    speed: Math.min(baseSpeed + (obstaclesPassed * speedIncrement), maxSpeed),
    spawnRate: Math.max(2000 - (obstaclesPassed * 10), 800), // ms between obstacles
    complexityLevel: Math.floor(obstaclesPassed / 10) // Unlock new obstacle types
  };
};
```

### Complexity Scaling

New obstacle types unlock based on progress:

| Obstacles Passed | Unlocked Obstacle Types |
|------------------|------------------------|
| 0-10 | Basic single-character dodges |
| 11-25 | 2-3 letter words |
| 26-50 | Numbers, mixed case |
| 51-75 | Special characters, longer words |
| 76-100 | Combos, code snippets |
| 101+ | All obstacle types, maximum speed |

### Adaptive Difficulty

Game monitors player performance and adjusts:

```typescript
interface PlayerStats {
  accuracyRate: number; // % of correct types
  averageResponseTime: number; // milliseconds
  recentMistakes: number; // Last 10 obstacles
}

const adjustDifficulty = (stats: PlayerStats) => {
  if (stats.accuracyRate > 95 && stats.averageResponseTime < 500) {
    // Player is doing very well - increase difficulty faster
    return { speedMultiplier: 1.2, complexityBoost: true };
  } else if (stats.accuracyRate < 70 || stats.recentMistakes > 5) {
    // Player is struggling - ease up slightly
    return { speedMultiplier: 0.9, complexityBoost: false };
  }
  // Normal progression
  return { speedMultiplier: 1.0, complexityBoost: false };
};
```

## Scoring System

### Base Scoring

Points awarded for each successful dodge:

```typescript
// Point values
const POINTS = {
  singleChar: 10,      // J, S, A, D
  shortWord: 25,       // 3-5 letters
  longWord: 50,        // 6+ letters
  number: 30,          // Number sequences
  symbol: 40,          // Special characters
  combo: 100,          // Multi-action obstacles
  perfect: 200         // Complete sentence/code
};
```

### Combo Multiplier

Consecutive successful dodges increase multiplier:

```
Obstacles Dodged | Multiplier
1-4              | 1x
5-9              | 1.5x
10-14            | 2x
15-19            | 2.5x
20+              | 3x (MAX)
```

**Combo breaks on:**
- Collision with obstacle
- Typing incorrect character
- Missing timing window

### Bonus Points

Additional points for exceptional performance:

| Bonus Type | Condition | Points |
|-----------|-----------|--------|
| **Speed Bonus** | Type with <300ms response | +10 |
| **Perfect Accuracy** | 100% accuracy for 20 obstacles | +500 |
| **Flawless Run** | Complete game without mistakes | +1000 |
| **High Velocity** | Reach maximum speed | +250 |
| **Symbol Master** | Correctly type 10 symbols in a row | +300 |

### Score Calculation Example

```typescript
// Example scoring scenario
let score = 0;
let comboMultiplier = 1;

// Obstacle 1: Single character (J)
score += 10 * comboMultiplier; // 10 points
comboMultiplier = 1; // First obstacle

// Obstacle 2: Single character (S) - fast response
score += (10 + 10) * 1; // 20 points (base + speed bonus)
comboMultiplier = 1;

// Obstacles 3-6: Consecutive successes
score += 10 * 1; // Obstacle 3: 10 points
score += 10 * 1; // Obstacle 4: 10 points
score += 10 * 1.5; // Obstacle 5: 15 points (combo starts)
score += 10 * 1.5; // Obstacle 6: 15 points

// Obstacle 7: Word "JUMP"
score += 25 * 1.5; // 37.5 points (word + combo)

// Total: 10 + 20 + 10 + 10 + 15 + 15 + 37.5 = 117.5 points
```

## Failure States

### Collision

**Causes:**
- Failing to type correct character
- Typing incorrect character
- Missing timing window (too slow)
- Typing too late (obstacle already passed)

**Effects:**
- Game over immediately
- Final score displayed
- Statistics shown (WPM, accuracy, distance)
- Combo multiplier lost

**Visual Feedback:**
- Character collision animation
- Screen shake effect
- Red flash overlay
- Slow-motion replay (optional)

### Typing Errors

**Incorrect Character:**
```
Prompt: "J" (Jump)
Player types: "K"
Result: Character doesn't jump → Collision
```

**Case Mismatch:**
```
Prompt: "Jump" (exact case)
Player types: "jump" (lowercase)
Result: Doesn't count → Collision
```

**Incomplete Sequence:**
```
Prompt: "DODGE" (5 letters)
Player types: "DODG" (4 letters)
Result: Incomplete when obstacle reached → Collision
```

### Grace Period

Small margin for error to prevent frustration:

```typescript
const GRACE_PERIOD = 100; // milliseconds

// Player typed slightly late but within grace period
if (responseTime <= timingWindow + GRACE_PERIOD) {
  // Success! Obstacle avoided
  applyGracePenalty(); // Small score penalty
} else {
  // Too late - collision
  gameOver();
}
```

**Grace Penalty:**
- Success still counts
- No speed bonus awarded
- Combo multiplier doesn't increase
- Small time added to next obstacle timing

## Power-Ups (Optional Feature)

### Slow Motion

**Activation**: Type "SLOW" when prompt appears  
**Duration**: 5 seconds  
**Effect**: Game speed reduced 50%  
**Cooldown**: 30 seconds  
**Use Case**: Catch your breath during intense moments

### Shield

**Activation**: Type "SHIELD" when prompt appears  
**Duration**: One hit  
**Effect**: Next mistake doesn't end game  
**Cooldown**: 60 seconds  
**Use Case**: Insurance against difficult obstacles

### Double Points

**Activation**: Type "2X" when prompt appears  
**Duration**: 10 seconds  
**Effect**: All points doubled  
**Cooldown**: 45 seconds  
**Use Case**: Maximize scoring during combos

### Auto-Complete

**Activation**: Type "AUTO" when prompt appears  
**Duration**: 3 obstacles  
**Effect**: Next 3 obstacles auto-dodged  
**Cooldown**: 90 seconds  
**Use Case**: Get through difficult sequence

**Power-Up Balance:**
- Optional feature (can be disabled for pure typing practice)
- Limited uses per game
- Cooldown prevents spam
- Strategic timing required
- Doesn't grant achievements (pure runs only)

## Special Modes

### Classic Mode

- Standard endless runner
- Progressive difficulty
- All obstacle types
- Full scoring system

### Time Attack

- 60/120/180 second time limit
- Maximize score in time limit
- No speed increases (constant speed)
- Focus on accuracy over speed

### Word Focus Mode

- Only word-based obstacles
- No single-character dodges
- Vocabulary building emphasis
- Dictionary integration

### Speed Demon Mode

- Starts at maximum speed
- Ultra-fast from beginning
- For expert typists only
- Minimal timing windows

### Zen Mode

- No scoring
- No combos
- No game over
- Pure practice environment
- Educational focus

### Daily Challenge

- Pre-defined obstacle sequence
- Same for all players
- Leaderboard competition
- Single attempt per day
- Special rewards

## Metrics Tracking

### Real-Time Metrics

Displayed during gameplay:

- **Current Score**: Running total
- **Combo Multiplier**: Current multiplier (1x-3x)
- **WPM Estimate**: Based on recent typing
- **Distance**: Meters traveled

### End-Game Statistics

Shown after game over:

```
╔═══════════════════════════════╗
║       GAME OVER               ║
╠═══════════════════════════════╣
║ Final Score:     1,247        ║
║ High Score:      1,522        ║
║ Distance:        542m         ║
║ Obstacles:       54           ║
║ Accuracy:        94%          ║
║ Avg WPM:         52           ║
║ Top Speed:       14.2         ║
║ Longest Combo:   18           ║
╚═══════════════════════════════╝
```

### Session Analytics

Track across multiple games:

- Average WPM over time
- Accuracy trends
- Most common mistakes
- Character-specific accuracy
- Improvement rate
- Total practice time

## Accessibility Features

### Difficulty Presets

- **Beginner**: 50% speed, simple characters only
- **Intermediate**: 75% speed, words and numbers
- **Advanced**: 100% speed, all features
- **Expert**: 125% speed, maximum challenge

### Assist Options

- **Larger Text**: Bigger character prompts
- **High Contrast**: Enhanced visibility
- **Audio Cues**: Sound for correct/incorrect typing
- **Colorblind Mode**: Alternative color schemes
- **Slow Start**: Gradual speed increase disabled

### Practice Tools

- **Specific Character Practice**: Focus on weak characters
- **Obstacle Type Filter**: Practice specific obstacle types
- **Replay Mode**: Review mistakes from previous runs
- **Tutorial Mode**: Guided introduction

## Conclusion

TypeRush's gameplay mechanics create a compelling loop that:

1. **Teaches through play**: Every action reinforces typing
2. **Scales appropriately**: Difficulty matches skill level
3. **Rewards improvement**: Better typing = higher scores
4. **Maintains engagement**: Varied obstacles prevent monotony
5. **Tracks progress**: Clear metrics show improvement

The combination of auto-scrolling movement, typing-triggered dodges, and progressive difficulty creates an experience that feels like an arcade game but functions as a typing trainer.

---

**Previous**: [← Game Overview](./1-game-overview.md) | **Next**: [Technical Design →](./3-technical-design.md)
