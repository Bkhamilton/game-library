# TypeRush - User Experience Design

## Overview

This document outlines the player-facing experience in TypeRush, including onboarding, difficulty progression, feedback systems, progress tracking, and customization options. The goal is to create an experience that is immediately accessible yet provides depth for long-term engagement.

## Onboarding Experience

### First Launch Flow

```
App Launch
    ↓
Welcome Screen (3 seconds)
    ↓
Quick Tutorial (Optional - 30 seconds)
    ↓
First Game (Practice Mode)
    ↓
Results + Explanation
    ↓
Main Menu
```

### Welcome Screen

**Content:**
```
╔════════════════════════════════════╗
║         WELCOME TO                 ║
║          TypeRush                  ║
║                                    ║
║    Type Fast. Dodge Obstacles.     ║
║       Master the Keyboard.         ║
║                                    ║
║  [Skip Tutorial]  [Learn How]     ║
╚════════════════════════════════════╝
```

**Design Elements:**
- Animated character running in background
- Minimalist, clean design
- Clear call-to-action buttons
- Auto-advance option (can be disabled)

### Tutorial System

#### Tutorial Mode Structure

**Stage 1: Basic Controls (15 seconds)**

```
Welcome! Obstacles are coming.
Press the character you see to dodge them.

[Obstacle Approaches]
    ↓
  Press: J
    ↓
[Character Jumps]
    ↓
Great! You dodged it!
```

**Interactive Steps:**
1. **First Obstacle**: Single character 'J' - Jump over low barrier
2. **Second Obstacle**: Single character 'S' - Slide under high barrier
3. **Third Obstacle**: Character 'A' - Move left to avoid lane obstacle

**Stage 2: Typing Words (15 seconds)**

```
Good! Now try typing a word.
Type: DODGE

[Word Obstacle Approaches]
    ↓
D → O → D → G → E
    ↓
Perfect! You're getting it!
```

**Stage 3: Speed and Combos (10 seconds)**

```
The game gets faster as you progress.
Chain successful dodges for combo bonuses!

[Three obstacles in quick succession]
    ↓
Amazing! 3x Combo!
```

**Tutorial Completion:**
```
╔════════════════════════════════════╗
║     Tutorial Complete!             ║
║                                    ║
║  You're ready to play TypeRush!    ║
║                                    ║
║  Tips:                             ║
║  • Type accurately, not just fast  ║
║  • Build combos for higher scores  ║
║  • Practice improves your typing!  ║
║                                    ║
║       [Start First Game]           ║
╚════════════════════════════════════╝
```

### Beginner Mode (First 5 Games)

Special considerations for new players:

```typescript
const beginnerModeSettings = {
  // Slower starting speed
  initialSpeed: 0.6, // 60% of normal
  
  // Longer timing windows
  timingMultiplier: 1.5, // 50% more time
  
  // Simplified obstacles only
  allowedObstacles: ['single_char', 'short_word'],
  
  // No special characters
  characterSet: 'a-z, A-Z',
  
  // Visual assistance
  showTimingIndicator: true,
  showNextObstacle: true,
  
  // Gradual difficulty increase
  slowProgression: true
};
```

**Visual Assistance:**
- Green circle shrinks around obstacle as deadline approaches
- Next obstacle preview shown at top of screen
- Large, clear character prompts
- Encouraging messages for successes

### Skip Tutorial Option

For experienced players or returning users:

```typescript
const handleTutorialSkip = () => {
  // Save preference
  await AsyncStorage.setItem('tutorial_completed', 'true');
  
  // Quick difficulty assessment
  showDifficultySelection();
  
  // Or jump straight to game
  startGame({ difficulty: 'medium' });
};
```

## Difficulty Curves

### Player Progression Tiers

#### Tier 1: Novice (Games 1-10)

**Characteristics:**
- Learning basic keyboard layout
- Building muscle memory
- ~20-30 WPM typing speed
- 70-80% accuracy

**Game Adjustments:**
```typescript
const noviceSettings = {
  speed: 'slow',
  obstacles: ['single_char', 'short_word'],
  timingWindow: 'generous',
  characterSet: 'lowercase only',
  spawnRate: 'slow',
  maxSpeed: 0.7
};
```

**Goals:**
- Complete 10 games
- Achieve 80% accuracy
- Type 10+ characters correctly in a row
- Reach distance of 100 meters

#### Tier 2: Learner (Games 11-30)

**Characteristics:**
- Comfortable with letter positions
- Starting to type without looking (sometimes)
- ~30-40 WPM typing speed
- 80-85% accuracy

**Game Adjustments:**
```typescript
const learnerSettings = {
  speed: 'moderate',
  obstacles: ['single_char', 'word', 'number'],
  timingWindow: 'standard',
  characterSet: 'mixed case',
  spawnRate: 'moderate',
  maxSpeed: 0.85
};
```

**Goals:**
- Reach 500 meters total distance
- Maintain 85% accuracy
- Type first 3-letter word correctly
- Build 5x combo

#### Tier 3: Intermediate (Games 31-75)

**Characteristics:**
- Touch typing emerging
- Consistent accuracy
- ~40-55 WPM typing speed
- 85-90% accuracy

**Game Adjustments:**
```typescript
const intermediateSettings = {
  speed: 'fast',
  obstacles: ['all_basic', 'symbols_basic'],
  timingWindow: 'tight',
  characterSet: 'full_keyboard',
  spawnRate: 'fast',
  maxSpeed: 1.0
};
```

**Goals:**
- Score 1000+ points in single game
- Type 50+ obstacles in one game
- Achieve 90% accuracy
- Master number typing

#### Tier 4: Advanced (Games 76-150)

**Characteristics:**
- Touch typing proficient
- Fast and accurate
- ~55-70 WPM typing speed
- 90-95% accuracy

**Game Adjustments:**
```typescript
const advancedSettings = {
  speed: 'very_fast',
  obstacles: ['all_types', 'combos'],
  timingWindow: 'minimal',
  characterSet: 'special_chars',
  spawnRate: 'rapid',
  maxSpeed: 1.2
};
```

**Goals:**
- Score 2500+ points
- Reach 1000 meters distance
- Type code snippets correctly
- Build 15x combo

#### Tier 5: Expert (Games 151+)

**Characteristics:**
- Master typist
- Rarely looks at keyboard
- ~70+ WPM typing speed
- 95%+ accuracy

**Game Adjustments:**
```typescript
const expertSettings = {
  speed: 'maximum',
  obstacles: ['expert_only', 'randomized'],
  timingWindow: 'extreme',
  characterSet: 'full_extended',
  spawnRate: 'extreme',
  maxSpeed: 1.5,
  specialChallenges: true
};
```

**Goals:**
- Score 5000+ points
- Perfect game (0 mistakes)
- Type 100+ WPM in-game
- Master all obstacle types

### Adaptive Difficulty System

```typescript
class AdaptiveDifficultyManager {
  private playerHistory: GameResult[] = [];
  private currentDifficulty: number = 50; // 0-100
  
  adjustDifficulty(result: GameResult) {
    // Analyze recent performance
    const recentGames = this.playerHistory.slice(-5);
    const avgAccuracy = average(recentGames.map(g => g.accuracy));
    const avgScore = average(recentGames.map(g => g.score));
    
    // Too easy indicators
    if (avgAccuracy > 95 && avgScore > this.expectedScore * 1.2) {
      this.currentDifficulty += 5;
      this.showMessage('You\'re doing great! Increasing difficulty...');
    }
    
    // Too hard indicators
    else if (avgAccuracy < 70 || this.hasTooManyQuickFailures()) {
      this.currentDifficulty -= 3;
      this.showMessage('Let\'s slow things down a bit...');
    }
    
    // Clamp difficulty
    this.currentDifficulty = Math.max(0, Math.min(100, this.currentDifficulty));
    
    return this.getDifficultySettings(this.currentDifficulty);
  }
  
  private hasTooManyQuickFailures(): boolean {
    const lastThree = this.playerHistory.slice(-3);
    return lastThree.filter(g => g.duration < 30000).length >= 2;
  }
}
```

## Feedback Systems

### Visual Feedback

#### Typing Feedback

**Correct Input:**
```typescript
const showCorrectFeedback = (character: string) => {
  // Green flash on character
  animateCharacter({
    color: '#00FF00',
    scale: 1.2,
    duration: 150
  });
  
  // Particle burst
  createParticles({
    count: 5,
    color: '#00FF88',
    lifetime: 300
  });
  
  // Progress bar update
  updateProgressBar(character);
};
```

**Incorrect Input:**
```typescript
const showIncorrectFeedback = (character: string) => {
  // Red flash
  animateCharacter({
    color: '#FF0000',
    shake: true,
    duration: 200
  });
  
  // Screen shake
  shakeScreen({ intensity: 5, duration: 150 });
  
  // Show correct character briefly
  highlightCorrectChar(character, 500);
};
```

#### Combo System Visual

```
╔════════════════════╗
║   COMBO: 10x       ║ ← Grows with combo
║   ★★★★★★★★★★      ║ ← Visual stars
║   +200 bonus       ║ ← Point multiplier
╚════════════════════╝
```

**Combo Stages:**
- 1-4x: White text, no effects
- 5-9x: Yellow text, small sparkles
- 10-14x: Orange text, medium glow
- 15-19x: Red text, large glow
- 20x+: Rainbow text, screen effects

#### Speed Increase Notification

```
When speed increases:
┌────────────────────┐
│   SPEED UP! ▲      │ ← Brief notification
│   Level 5          │ ← Current speed tier
└────────────────────┘
```

### Audio Feedback

#### Sound Effects Library

```typescript
const SOUND_EFFECTS = {
  // Typing feedback
  correct_type: 'click.mp3',      // Satisfying click
  incorrect_type: 'error.mp3',    // Distinct error sound
  word_complete: 'chime.mp3',     // Pleasant completion
  
  // Combo sounds
  combo_start: 'combo1.mp3',      // 5x combo
  combo_medium: 'combo2.mp3',     // 10x combo
  combo_high: 'combo3.mp3',       // 15x combo
  combo_max: 'combo4.mp3',        // 20x+ combo
  
  // Game events
  speed_increase: 'whoosh.mp3',   // Speed tier up
  collision: 'crash.mp3',         // Game over
  achievement: 'fanfare.mp3',     // Achievement unlock
  
  // UI sounds
  button_press: 'tap.mp3',
  menu_navigate: 'swipe.mp3'
};
```

#### Dynamic Audio Mixing

```typescript
class AudioManager {
  private volume = {
    master: 0.8,
    effects: 0.7,
    music: 0.3
  };
  
  playTypingSound(isCorrect: boolean, speed: number) {
    const sound = isCorrect ? 'correct_type' : 'incorrect_type';
    
    // Vary pitch based on speed (higher pitch = faster game)
    const pitch = 1.0 + (speed / 20);
    
    this.playSound(sound, {
      volume: this.volume.effects,
      pitch: Math.min(pitch, 1.5)
    });
  }
  
  playComboSound(comboCount: number) {
    const tier = Math.floor(comboCount / 5);
    const sound = `combo${Math.min(tier, 4)}`;
    
    this.playSound(sound, {
      volume: this.volume.effects * 1.2,
      priority: 'high'
    });
  }
}
```

### Haptic Feedback

```typescript
// iOS and Android haptic patterns
class HapticManager {
  triggerSuccess() {
    if (Platform.OS === 'ios') {
      // iOS: Impact feedback
      ReactNativeHapticFeedback.trigger('impactLight');
    } else {
      // Android: Vibration pattern
      Vibration.vibrate(10); // Short vibration
    }
  }
  
  triggerError() {
    if (Platform.OS === 'ios') {
      ReactNativeHapticFeedback.trigger('notificationError');
    } else {
      Vibration.vibrate([0, 50, 50, 50]); // Double pulse
    }
  }
  
  triggerCombo(level: number) {
    if (Platform.OS === 'ios') {
      // Escalating haptics for higher combos
      const type = level < 10 ? 'impactMedium' : 'impactHeavy';
      ReactNativeHapticFeedback.trigger(type);
    } else {
      const duration = Math.min(level * 5, 50);
      Vibration.vibrate(duration);
    }
  }
}
```

## Progress Tracking

### Statistics Dashboard

```
╔═══════════════════════════════════════╗
║         TYPING PROGRESS               ║
╠═══════════════════════════════════════╣
║                                       ║
║  Average WPM: 45 ────────► 52 (+7)   ║
║  [████████████░░░░░░]  60 Goal        ║
║                                       ║
║  Accuracy: 88% ─────────► 91% (+3%)  ║
║  [██████████████░░░░]  95% Goal       ║
║                                       ║
║  Games Played: 47                     ║
║  Total Practice: 3h 24m               ║
║  Current Streak: 7 days 🔥            ║
║                                       ║
╠═══════════════════════════════════════╣
║         RECENT IMPROVEMENT            ║
╠═══════════════════════════════════════╣
║                                       ║
║  This Week:                           ║
║  • +8 WPM average                     ║
║  • +5% accuracy                       ║
║  • 12 games played                    ║
║                                       ║
║  Weak Characters:                     ║
║  • Q (65% accuracy) - Practice more!  ║
║  • Z (71% accuracy)                   ║
║  • Numbers (78% accuracy)             ║
║                                       ║
╚═══════════════════════════════════════╝
```

### Progress Graphs

#### WPM Over Time

```
WPM
60 │                            ●
55 │                      ●  ●
50 │                ●  ●
45 │          ●  ●
40 │    ●  ●
35 │ ●
   └────────────────────────────── Time
    Week 1  2  3  4  5  6  7  8
```

#### Accuracy Trend

```
% Accuracy
95 │                            ●
90 │                      ●  ●
85 │                ●  ●
80 │          ●  ●
75 │    ●  ●
70 │ ●
   └────────────────────────────── Time
    Week 1  2  3  4  5  6  7  8
```

### Character-Specific Analytics

```
╔═══════════════════════════════════╗
║    CHARACTER ACCURACY             ║
╠═══════════════════════════════════╣
║  Excellent (95%+):                ║
║  A S D F G H J K L                ║
║                                   ║
║  Good (85-94%):                   ║
║  E R T Y U I O P                  ║
║                                   ║
║  Need Practice (<85%):            ║
║  Q (65%) ⚠️                       ║
║  Z (71%) ⚠️                       ║
║  X (82%)                          ║
║                                   ║
║  [Practice Weak Characters]       ║
╚═══════════════════════════════════╝
```

### Achievement Progress

```
╔═══════════════════════════════════╗
║        ACHIEVEMENTS               ║
╠═══════════════════════════════════╣
║                                   ║
║  ✓ First Steps (Complete!)        ║
║  ✓ Speed Demon (Complete!)        ║
║  ⏳ Combo Master (Progress: 75%)  ║
║     [███████████░░░░] 15/20       ║
║  🔒 Perfectionist (Locked)        ║
║                                   ║
║  Points: 1,250 / 5,000            ║
║  [████░░░░░░░░░░░░░░]             ║
║                                   ║
╚═══════════════════════════════════╝
```

### Daily/Weekly Goals

```
╔═══════════════════════════════════╗
║         TODAY'S GOALS             ║
╠═══════════════════════════════════╣
║  ✓ Play 3 games (3/3) ✓           ║
║  ⏳ Score 1000+ (Best: 847)       ║
║  ⏳ 50 obstacles (32/50)          ║
║                                   ║
║  Streak: 7 days 🔥                ║
║  Keep it going!                   ║
╚═══════════════════════════════════╝
```

## Customization Options

### Visual Themes

#### Theme Selection

```typescript
const AVAILABLE_THEMES = {
  classic: {
    name: 'Classic',
    background: '#1E1E1E',
    player: '#4CAF50',
    obstacle: '#F44336',
    text: '#FFFFFF',
    accent: '#2196F3'
  },
  neon: {
    name: 'Neon Night',
    background: '#0A0A1E',
    player: '#00FFFF',
    obstacle: '#FF00FF',
    text: '#00FF00',
    accent: '#FFFF00'
  },
  pastel: {
    name: 'Pastel Dream',
    background: '#FFF5F5',
    player: '#FFB6C1',
    obstacle: '#B0E0E6',
    text: '#4A4A4A',
    accent: '#DDA0DD'
  },
  cyberpunk: {
    name: 'Cyberpunk',
    background: '#0F0F23',
    player: '#FF2E97',
    obstacle: '#00FFF7',
    text: '#FFFF00',
    accent: '#FF6EC7'
  },
  nature: {
    name: 'Nature',
    background: '#E8F5E9',
    player: '#4CAF50',
    obstacle: '#8D6E63',
    text: '#1B5E20',
    accent: '#FFC107'
  }
};
```

#### Unlockable Themes

```typescript
const UNLOCKABLE_THEMES = {
  midnight: {
    unlockCondition: 'Play 50 games',
    progress: 'current / 50'
  },
  rainbow: {
    unlockCondition: 'Achieve 20x combo',
    progress: 'best_combo / 20'
  },
  golden: {
    unlockCondition: 'Score 5000+ points',
    progress: 'high_score / 5000'
  },
  custom: {
    unlockCondition: 'Premium feature',
    isPremium: true
  }
};
```

### Character Sets

Players can practice with different character sets:

```typescript
const CHARACTER_SETS = {
  lowercase: 'a-z',
  uppercase: 'A-Z',
  mixed: 'a-z, A-Z',
  numbers: '0-9',
  special: '!@#$%^&*()',
  programming: '{}[]()<>;:',
  full: 'All keyboard characters'
};
```

**Character Set Selector:**
```
╔═══════════════════════════════════╗
║    PRACTICE CHARACTER SET         ║
╠═══════════════════════════════════╣
║  ○ Lowercase Only (a-z)           ║
║  ● Mixed Case (a-z, A-Z)          ║
║  ○ With Numbers (a-z, 0-9)        ║
║  ○ Special Characters (!@#...)    ║
║  ○ Programming Symbols            ║
║  ○ Full Keyboard                  ║
╚═══════════════════════════════════╝
```

### Difficulty Presets

```
╔═══════════════════════════════════╗
║      DIFFICULTY PRESET            ║
╠═══════════════════════════════════╣
║  Relaxed:                         ║
║  • Slow speed                     ║
║  • Long timing windows            ║
║  • Simple characters only         ║
║                                   ║
║  Balanced:                        ║
║  • Medium speed                   ║
║  • Standard timing                ║
║  • Mixed characters               ║
║                                   ║
║  Challenge:                       ║
║  • Fast speed                     ║
║  • Tight timing                   ║
║  • All characters                 ║
║                                   ║
║  Custom:                          ║
║  • Configure your own settings    ║
╚═══════════════════════════════════╝
```

### Avatar/Character Customization

```typescript
interface CharacterCustomization {
  avatar: 'runner' | 'robot' | 'ninja' | 'cat' | 'custom';
  color: string;
  accessories: string[];
  trail: 'none' | 'sparkle' | 'fire' | 'electric';
}

// Unlock system
const avatarUnlocks = {
  robot: { condition: 'Score 1000+', unlocked: false },
  ninja: { condition: 'Build 15x combo', unlocked: false },
  cat: { condition: 'Play 100 games', unlocked: false },
  custom: { condition: 'Premium feature', isPremium: true }
};
```

### UI Customization

```typescript
const UI_OPTIONS = {
  // Text size for prompts
  textSize: {
    small: 18,
    medium: 24,  // default
    large: 32,
    extraLarge: 48
  },
  
  // HUD layout
  hudPosition: {
    top: 'Score at top',
    bottom: 'Score at bottom',
    minimal: 'Score only, no other info',
    full: 'All stats visible'
  },
  
  // Animation preferences
  animations: {
    full: 'All animations',
    reduced: 'Essential only',
    none: 'No animations (performance)'
  },
  
  // Color mode
  colorMode: {
    auto: 'Match system',
    light: 'Always light',
    dark: 'Always dark'
  }
};
```

## End Game Experience

### Results Screen

```
╔═══════════════════════════════════════╗
║            GAME OVER                  ║
╠═══════════════════════════════════════╣
║                                       ║
║        FINAL SCORE: 1,247             ║
║        High Score:  1,522             ║
║                                       ║
╠═══════════════════════════════════════╣
║         PERFORMANCE                   ║
╠═══════════════════════════════════════╣
║  Distance:        542 meters          ║
║  Obstacles:       54 dodged           ║
║  Accuracy:        94%                 ║
║  Average WPM:     52                  ║
║  Top Speed:       14.2                ║
║  Longest Combo:   18x                 ║
║                                       ║
╠═══════════════════════════════════════╣
║         ACHIEVEMENTS                  ║
╠═══════════════════════════════════════╣
║  🏆 New Achievement!                  ║
║     "Combo Master"                    ║
║     Built a 15x combo!                ║
║                                       ║
╠═══════════════════════════════════════╣
║  [Play Again]  [Main Menu]  [Share]  ║
╚═══════════════════════════════════════╝
```

### Performance Analysis

```
╔═══════════════════════════════════════╗
║        PERFORMANCE ANALYSIS           ║
╠═══════════════════════════════════════╣
║  Strengths:                           ║
║  ✓ Excellent combo building           ║
║  ✓ Fast response time                 ║
║  ✓ High accuracy on letters           ║
║                                       ║
║  Areas for Improvement:               ║
║  ⚠ Numbers (75% accuracy)             ║
║  ⚠ Special characters (68%)           ║
║                                       ║
║  Recommendation:                      ║
║  Practice number sequences in         ║
║  Word Focus Mode                      ║
║                                       ║
║  [Practice Mode]  [Continue]          ║
╚═══════════════════════════════════════╝
```

### Social Sharing

```typescript
const shareScore = async (score: GameScore) => {
  const message = `I just scored ${score.points} in TypeRush! ` +
                  `${score.obstaclesPassed} obstacles dodged at ` +
                  `${score.averageWPM} WPM. Can you beat it?`;
  
  try {
    await Share.share({
      message: message,
      title: 'TypeRush Score',
      url: 'https://typerush.app/challenge/' + score.id
    });
  } catch (error) {
    console.error('Share failed:', error);
  }
};
```

### Quick Restart

```typescript
// Minimal friction to play again
const handlePlayAgain = () => {
  // No loading screens
  // Same settings as previous game
  // Immediate start (optional 3-2-1 countdown)
  
  resetGame();
  startCountdown(3);
  // Game starts automatically
};
```

## Accessibility & Inclusion

### Visual Accessibility

- High contrast mode
- Colorblind-friendly palettes
- Adjustable text sizes
- Reduced motion options
- Screen reader support

### Motor Accessibility

- Adjustable timing windows
- Single-hand mode (left or right)
- External keyboard support
- Voice control (future)
- Customizable controls

### Cognitive Accessibility

- Clear, simple instructions
- Gradual difficulty increase
- Practice mode (no pressure)
- Helpful error messages
- Optional tutorial reviews

### Language Support

```typescript
const SUPPORTED_LANGUAGES = {
  en: 'English',
  es: 'Español',
  fr: 'Français',
  de: 'Deutsch',
  ja: '日本語',
  zh: '中文'
};

// Keyboard layouts vary by language
const keyboardLayouts = {
  en: 'QWERTY',
  fr: 'AZERTY',
  de: 'QWERTZ'
};
```

## Conclusion

TypeRush's user experience is designed to:

1. **Welcome newcomers** with gentle onboarding
2. **Challenge experts** with adaptive difficulty
3. **Reward progress** with clear metrics and achievements
4. **Customize experience** with themes and settings
5. **Provide feedback** through multiple sensory channels
6. **Track improvement** with detailed analytics

By focusing on accessibility, clarity, and progression, TypeRush creates an engaging experience that motivates players to improve their typing skills while having fun.

---

**Previous**: [← Technical Design](./3-technical-design.md) | **Next**: [Educational Value →](./5-educational-value.md)
