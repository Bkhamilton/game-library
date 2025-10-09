# TypeRush - Educational Value

## Overview

TypeRush is designed to be both an entertaining game and an effective typing trainer. This document explores the educational benefits, learning mechanisms, and measurable outcomes that make TypeRush a valuable tool for typing skill development.

## Core Learning Principles

### 1. Gamification of Practice

**Traditional Approach:**
- Repetitive typing drills
- Boring word lists
- Minimal engagement
- External motivation required

**TypeRush Approach:**
- High-stakes gameplay
- Meaningful consequences (game over)
- Intrinsic motivation (fun)
- Natural skill progression

### 2. Deliberate Practice

TypeRush incorporates key elements of deliberate practice:

```typescript
const deliberatePracticeElements = {
  // Focused attention on specific skills
  specificFocus: {
    characterAccuracy: 'Track per-character success rate',
    speedDevelopment: 'Progressive speed increases',
    patternRecognition: 'Word and sequence typing'
  },
  
  // Immediate feedback
  immediateFeedback: {
    visual: 'Green/red color coding',
    auditory: 'Success/error sounds',
    haptic: 'Vibration feedback',
    performance: 'Real-time WPM display'
  },
  
  // Operating at edge of ability
  adaptiveDifficulty: {
    monitoring: 'Track player performance',
    adjustment: 'Increase/decrease challenge',
    flowState: 'Maintain optimal difficulty'
  },
  
  // Repetition with variation
  varietyInPractice: {
    obstacleTypes: 'Different typing challenges',
    characterSets: 'Letters, numbers, symbols',
    timing: 'Various speed requirements'
  }
};
```

### 3. Spaced Repetition

```typescript
class SpacedRepetitionManager {
  // Characters that need more practice appear more frequently
  
  private characterDifficulty = new Map<string, number>();
  
  selectNextCharacter(): string {
    // Weight selection based on difficulty
    const weights = new Map<string, number>();
    
    this.characterDifficulty.forEach((difficulty, char) => {
      // Higher difficulty = more practice needed = higher weight
      weights.set(char, difficulty * 2);
    });
    
    return this.weightedRandom(weights);
  }
  
  updateDifficulty(char: string, success: boolean) {
    const current = this.characterDifficulty.get(char) || 50;
    
    if (success) {
      // Decrease difficulty (mastered)
      this.characterDifficulty.set(char, Math.max(0, current - 5));
    } else {
      // Increase difficulty (needs practice)
      this.characterDifficulty.set(char, Math.min(100, current + 10));
    }
  }
}
```

### 4. Progressive Complexity

```
Skill Progression Path:
─────────────────────────────────────────►

Stage 1: Home Row Keys (A S D F G H J K L)
   ↓
Stage 2: All Letters (+ Q W E R T Y U I O P)
   ↓
Stage 3: Mixed Case (Shift key usage)
   ↓
Stage 4: Numbers (Top row numbers)
   ↓
Stage 5: Common Symbols (! @ # $ % ^ & * ( ))
   ↓
Stage 6: Special Characters ({ } [ ] < > | \)
   ↓
Stage 7: Code Snippets (Programming syntax)
```

## Typing Skill Development

### Words Per Minute (WPM) Improvement

#### Measurement Methodology

```typescript
class WPMCalculator {
  calculateWPM(characters: number, timeMilliseconds: number): number {
    // Standard WPM formula: (Characters / 5) / Minutes
    const words = characters / 5;  // 5 characters = 1 "word"
    const minutes = timeMilliseconds / 60000;
    
    return Math.round(words / minutes);
  }
  
  calculateGameWPM(gameSession: GameSession): number {
    // Only count successful character inputs
    const correctChars = gameSession.inputs.filter(i => i.correct).length;
    const gameDuration = gameSession.endTime - gameSession.startTime;
    
    return this.calculateWPM(correctChars, gameDuration);
  }
  
  calculateSessionAverage(sessions: GameSession[]): WPMStats {
    const wpmValues = sessions.map(s => this.calculateGameWPM(s));
    
    return {
      average: mean(wpmValues),
      median: median(wpmValues),
      max: Math.max(...wpmValues),
      improvement: this.calculateImprovement(wpmValues),
      trend: this.calculateTrend(wpmValues)
    };
  }
  
  private calculateImprovement(values: number[]): number {
    if (values.length < 2) return 0;
    
    // Compare first 5 games to last 5 games
    const firstFive = values.slice(0, 5);
    const lastFive = values.slice(-5);
    
    return mean(lastFive) - mean(firstFive);
  }
}
```

#### Expected WPM Progression

```typescript
const expectedWPMProgress = {
  beginner: {
    starting: 20,      // WPM at game 1
    after10Games: 25,  // +5 WPM
    after30Games: 32,  // +12 WPM
    after50Games: 38   // +18 WPM
  },
  
  intermediate: {
    starting: 40,
    after10Games: 43,
    after30Games: 48,
    after50Games: 53
  },
  
  advanced: {
    starting: 60,
    after10Games: 62,
    after30Games: 66,
    after50Games: 70
  }
};
```

#### WPM Improvement Visualization

```
Player WPM Progress Over Time

WPM
70 │                                    ●
65 │                              ●  ●
60 │                        ●  ●
55 │                  ●  ●
50 │            ●  ●
45 │      ●  ●
40 │ ●  ●                Goal: 60 WPM ─┐
35 │                                    │
   └─────────────────────────────────────
    0  5  10  15  20  25  30  35  40  45
              Games Played

Improvement: +30 WPM over 45 games
Average gain: 0.67 WPM per game
```

### Accuracy Training

#### Accuracy Metrics

```typescript
interface AccuracyMetrics {
  overall: number;              // Total accuracy %
  byCharacter: Map<string, number>;  // Per-character accuracy
  byType: {
    letters: number;
    numbers: number;
    symbols: number;
  };
  trends: {
    improving: string[];        // Characters getting better
    declining: string[];        // Characters getting worse
    mastered: string[];        // >95% accuracy
    needsPractice: string[];   // <75% accuracy
  };
}
```

#### Accuracy Feedback Loop

```
User Types Character
        ↓
   Correct? Yes/No
        ↓
Update Character Stats
        ↓
Adjust Future Frequency
        ↓
More Practice on Weak Characters
```

#### Targeted Practice Recommendations

```typescript
class PracticeRecommendation {
  generateRecommendations(accuracy: AccuracyMetrics): Recommendation[] {
    const recommendations: Recommendation[] = [];
    
    // Identify weak characters
    const weakChars = Array.from(accuracy.byCharacter.entries())
      .filter(([char, acc]) => acc < 80)
      .sort((a, b) => a[1] - b[1])  // Lowest accuracy first
      .slice(0, 5);  // Top 5 weakest
    
    if (weakChars.length > 0) {
      recommendations.push({
        title: 'Focus on Weak Characters',
        description: `Practice these characters: ${weakChars.map(c => c[0]).join(', ')}`,
        action: 'Start Practice Mode',
        priority: 'high'
      });
    }
    
    // Check for specific skill gaps
    if (accuracy.byType.numbers < 75) {
      recommendations.push({
        title: 'Number Practice Needed',
        description: 'Your number typing accuracy is below 75%',
        action: 'Play Number Focus Mode',
        priority: 'medium'
      });
    }
    
    if (accuracy.byType.symbols < 70) {
      recommendations.push({
        title: 'Symbol Practice Recommended',
        description: 'Special characters need more practice',
        action: 'Enable Symbol Practice',
        priority: 'medium'
      });
    }
    
    return recommendations;
  }
}
```

### Muscle Memory Development

#### Typing Patterns

TypeRush helps build muscle memory through:

1. **Repetitive Key Combinations**
```typescript
// Common bigrams (two-letter combinations)
const commonBigrams = [
  'th', 'he', 'in', 'er', 'an', 're', 'on', 'at', 'en', 'nd'
];

// Include these in word selection
const selectWord = (difficulty: number): string => {
  // Prefer words with common patterns for muscle memory
  const words = DICTIONARY.filter(word => 
    commonBigrams.some(bigram => word.includes(bigram))
  );
  
  return randomChoice(words);
};
```

2. **Progressive Finger Reach**
```
Home Row → Adjacent Keys → Top/Bottom Rows → Numbers → Symbols

Example progression:
- Week 1: asdf jkl;
- Week 2: + qwer uiop
- Week 3: + zxcv nm,.
- Week 4: + 12345 67890
- Week 5: + !@#$% ^&*()
```

3. **Rhythm and Timing**
```typescript
// Encourage consistent rhythm
const analyzeTypingRhythm = (inputs: TypeInput[]): RhythmAnalysis => {
  const intervals = [];
  
  for (let i = 1; i < inputs.length; i++) {
    intervals.push(inputs[i].timestamp - inputs[i-1].timestamp);
  }
  
  return {
    averageInterval: mean(intervals),
    consistency: 1 - (standardDeviation(intervals) / mean(intervals)),
    hasRhythm: standardDeviation(intervals) < 100  // Within 100ms
  };
};
```

## Adaptive Learning System

### Performance Monitoring

```typescript
class AdaptiveLearningEngine {
  private playerProfile: PlayerProfile;
  
  async analyzePerformance(session: GameSession): Promise<LearningInsights> {
    // Analyze multiple dimensions
    const insights = {
      speed: this.analyzeSpeed(session),
      accuracy: this.analyzeAccuracy(session),
      consistency: this.analyzeConsistency(session),
      weaknesses: this.identifyWeaknesses(session),
      strengths: this.identifyStrengths(session)
    };
    
    // Update player profile
    await this.updateProfile(insights);
    
    // Generate personalized recommendations
    return this.generateInsights(insights);
  }
  
  private analyzeSpeed(session: GameSession): SpeedAnalysis {
    const wpm = calculateWPM(session);
    const previousAvg = this.playerProfile.averageWPM;
    
    return {
      current: wpm,
      change: wpm - previousAvg,
      percentile: this.getPercentile(wpm),
      trend: this.calculateTrend(this.playerProfile.wpmHistory)
    };
  }
  
  private identifyWeaknesses(session: GameSession): Weakness[] {
    const weaknesses: Weakness[] = [];
    
    // Character-level weaknesses
    session.characterStats.forEach((stats, char) => {
      if (stats.accuracy < 75) {
        weaknesses.push({
          type: 'character',
          target: char,
          accuracy: stats.accuracy,
          recommendation: `Practice "${char}" specifically`
        });
      }
    });
    
    // Timing weaknesses
    if (session.timeouts > session.successes * 0.2) {
      weaknesses.push({
        type: 'speed',
        recommendation: 'Try slower difficulty to improve accuracy first'
      });
    }
    
    // Pattern weaknesses
    const difficultPatterns = this.findDifficultPatterns(session);
    if (difficultPatterns.length > 0) {
      weaknesses.push({
        type: 'pattern',
        patterns: difficultPatterns,
        recommendation: 'Practice common word patterns'
      });
    }
    
    return weaknesses;
  }
}
```

### Difficulty Adjustment Algorithm

```typescript
class DifficultyAdjuster {
  adjustDifficulty(
    currentDifficulty: number,
    performance: PerformanceMetrics
  ): DifficultySettings {
    let adjustment = 0;
    
    // Factor 1: Accuracy
    if (performance.accuracy > 95) {
      adjustment += 2;  // Increase difficulty
    } else if (performance.accuracy < 70) {
      adjustment -= 3;  // Decrease difficulty
    }
    
    // Factor 2: Speed/Timing
    if (performance.averageResponseTime < 300) {
      adjustment += 1;  // Player is very fast
    } else if (performance.averageResponseTime > 1000) {
      adjustment -= 2;  // Player is struggling
    }
    
    // Factor 3: Recent failures
    if (performance.recentFailures > 3) {
      adjustment -= 2;  // Too many quick failures
    }
    
    // Factor 4: Consistency
    if (performance.consistencyScore > 0.9) {
      adjustment += 1;  // Very consistent = ready for more
    }
    
    // Apply adjustment
    const newDifficulty = Math.max(0, Math.min(100, 
      currentDifficulty + adjustment
    ));
    
    return this.getDifficultySettings(newDifficulty);
  }
  
  private getDifficultySettings(level: number): DifficultySettings {
    return {
      speed: 0.5 + (level / 100) * 1.0,  // 0.5x to 1.5x
      timingWindow: 2000 - (level * 10),  // 2000ms to 1000ms
      complexityLevel: Math.floor(level / 20),  // 0-5
      characterSet: this.getCharacterSet(level)
    };
  }
}
```

### Personalized Learning Paths

```typescript
interface LearningPath {
  current: LearningStage;
  next: LearningStage;
  progress: number;  // 0-100%
  estimatedTime: number;  // Games until next stage
}

const learningStages = {
  stage1: {
    name: 'Home Row Mastery',
    characters: 'asdfghjkl;',
    goal: '85% accuracy on home row',
    avgGamesNeeded: 10
  },
  
  stage2: {
    name: 'Full Alphabet',
    characters: 'all letters',
    goal: '80% accuracy on all letters',
    avgGamesNeeded: 20
  },
  
  stage3: {
    name: 'Mixed Case Typing',
    characters: 'A-Z, a-z',
    goal: '85% accuracy with Shift key',
    avgGamesNeeded: 15
  },
  
  stage4: {
    name: 'Number Integration',
    characters: 'letters + 0-9',
    goal: '80% accuracy including numbers',
    avgGamesNeeded: 15
  },
  
  stage5: {
    name: 'Symbol Proficiency',
    characters: 'all keyboard',
    goal: '75% accuracy on all characters',
    avgGamesNeeded: 20
  },
  
  stage6: {
    name: 'Speed Development',
    focus: 'WPM improvement',
    goal: '60+ WPM average',
    avgGamesNeeded: 30
  }
};
```

## Progress Metrics & Visualization

### Comprehensive Statistics

```typescript
interface TypingStatistics {
  // Speed metrics
  currentWPM: number;
  averageWPM: number;
  maxWPM: number;
  wpmImprovement: number;  // Since day 1
  wpmTrend: 'improving' | 'stable' | 'declining';
  
  // Accuracy metrics
  overallAccuracy: number;
  letterAccuracy: number;
  numberAccuracy: number;
  symbolAccuracy: number;
  
  // Volume metrics
  totalGamesPlayed: number;
  totalCharactersTyped: number;
  totalTimeSpent: number;  // milliseconds
  
  // Performance metrics
  longestCombo: number;
  highestScore: number;
  totalDistance: number;
  
  // Learning metrics
  charactersInspected: number;  // Unique characters typed
  masteredCharacters: string[];  // >95% accuracy
  improvingCharacters: string[];  // Accuracy trending up
  strugglingCharacters: string[];  // <75% accuracy
  
  // Milestones
  achievements: Achievement[];
  currentStreak: number;
  longestStreak: number;
}
```

### Progress Visualization Examples

#### Skill Radar Chart

```
         Speed (WPM)
              *
             /|\
            / | \
           /  |  \
          *   *   * Accuracy
         /    |    \
        /     |     \
       *------*------* Consistency
    Numbers  Home  Symbols
```

#### Character Heatmap

```
Keyboard Heatmap (Accuracy %)

Q[82] W[95] E[98] R[92] T[88] Y[91] U[96] I[97] O[93] P[89]
 A[99] S[98] D[97] F[96] G[94] H[95] J[97] K[98] L[96]
  Z[75] X[78] C[92] V[94] B[91] N[93] M[95]

Legend:
🟩 95-100% (Excellent)
🟨 85-94% (Good)
🟧 75-84% (Fair)
🟥 <75% (Needs Practice)
```

#### WPM Progress Graph

```
Weekly WPM Progress

WPM
60 │                          ●━●
55 │                    ●━━━●
50 │              ●━━━●
45 │        ●━━━●
40 │  ●━━━●
   └────────────────────────────
    W1  W2  W3  W4  W5  W6

Target: 60 WPM by Week 8
Current Rate: +2.5 WPM/week
On Track: ✓
```

## Gamification of Learning

### Achievement System

```typescript
const EDUCATIONAL_ACHIEVEMENTS = {
  // Speed milestones
  speed_30wpm: {
    title: 'Typing Beginner',
    description: 'Reach 30 WPM',
    reward: 'New theme unlock'
  },
  
  speed_60wpm: {
    title: 'Competent Typist',
    description: 'Reach 60 WPM',
    reward: 'Speed demon badge'
  },
  
  speed_100wpm: {
    title: 'Typing Master',
    description: 'Reach 100 WPM',
    reward: 'Legendary status'
  },
  
  // Accuracy milestones
  accuracy_90: {
    title: 'Precision Typist',
    description: 'Maintain 90% accuracy over 10 games',
    reward: 'Accuracy badge'
  },
  
  accuracy_perfect: {
    title: 'Perfectionist',
    description: 'Complete a game with 100% accuracy',
    reward: 'Perfect streak tracker'
  },
  
  // Character mastery
  alphabet_master: {
    title: 'Alphabet Master',
    description: '95%+ accuracy on all letters',
    reward: 'Letter master badge'
  },
  
  number_ninja: {
    title: 'Number Ninja',
    description: '90%+ accuracy on all numbers',
    reward: 'Number practice mode'
  },
  
  symbol_sage: {
    title: 'Symbol Sage',
    description: '85%+ accuracy on special characters',
    reward: 'Symbol master badge'
  },
  
  // Practice volume
  dedicated_learner: {
    title: 'Dedicated Learner',
    description: 'Play 100 games',
    reward: 'Dedication badge'
  },
  
  practice_marathon: {
    title: 'Practice Marathon',
    description: '10 hours of total practice',
    reward: 'Endurance badge'
  }
};
```

### Daily Challenges

```typescript
interface DailyChallenge {
  date: string;
  challenge: Challenge;
  reward: Reward;
}

const generateDailyChallenge = (playerLevel: number): DailyChallenge => {
  const challenges = [
    {
      type: 'speed',
      goal: 'Type 50 WPM for 3 games',
      difficulty: playerLevel,
      reward: { coins: 100, xp: 50 }
    },
    {
      type: 'accuracy',
      goal: 'Achieve 95% accuracy',
      difficulty: playerLevel,
      reward: { coins: 150, xp: 75 }
    },
    {
      type: 'volume',
      goal: 'Type 500 characters today',
      difficulty: playerLevel,
      reward: { coins: 75, xp: 40 }
    },
    {
      type: 'character',
      goal: 'Master 5 weak characters',
      difficulty: playerLevel,
      reward: { coins: 200, xp: 100 }
    }
  ];
  
  return {
    date: new Date().toISOString(),
    challenge: randomChoice(challenges),
    reward: challenges[0].reward
  };
};
```

### Streak System

```typescript
class StreakManager {
  private currentStreak: number = 0;
  private longestStreak: number = 0;
  private lastPlayDate: Date;
  
  updateStreak() {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    if (this.isToday(this.lastPlayDate)) {
      // Already played today, streak continues
      return;
    } else if (this.isSameDay(this.lastPlayDate, yesterday)) {
      // Played yesterday, increment streak
      this.currentStreak++;
      this.longestStreak = Math.max(this.longestStreak, this.currentStreak);
    } else {
      // Streak broken
      this.currentStreak = 1;
    }
    
    this.lastPlayDate = today;
    
    // Trigger streak milestone notifications
    this.checkStreakMilestones();
  }
  
  getStreakBonus(): number {
    // Bonus points for maintaining streaks
    if (this.currentStreak >= 30) return 500;
    if (this.currentStreak >= 14) return 250;
    if (this.currentStreak >= 7) return 100;
    if (this.currentStreak >= 3) return 25;
    return 0;
  }
}
```

## Educational Outcomes

### Measurable Learning Objectives

```typescript
const LEARNING_OBJECTIVES = {
  // Primary objectives (all players)
  primary: [
    {
      objective: 'Increase typing speed',
      metric: 'WPM improvement',
      target: '+15 WPM in 30 days',
      measurement: 'Average WPM comparison'
    },
    {
      objective: 'Improve typing accuracy',
      metric: 'Accuracy percentage',
      target: '90%+ accuracy',
      measurement: 'Overall accuracy rate'
    },
    {
      objective: 'Build muscle memory',
      metric: 'Response time',
      target: '<500ms average',
      measurement: 'Keystroke latency'
    }
  ],
  
  // Secondary objectives (engaged players)
  secondary: [
    {
      objective: 'Master all alphabet keys',
      metric: 'Character-specific accuracy',
      target: '95%+ on all letters',
      measurement: 'Per-character stats'
    },
    {
      objective: 'Learn number typing',
      metric: 'Number accuracy',
      target: '85%+ on 0-9',
      measurement: 'Number-specific accuracy'
    },
    {
      objective: 'Increase typing consistency',
      metric: 'Typing rhythm',
      target: 'Low variation in timing',
      measurement: 'Standard deviation of intervals'
    }
  ],
  
  // Advanced objectives (expert players)
  advanced: [
    {
      objective: 'Master special characters',
      metric: 'Symbol accuracy',
      target: '80%+ on symbols',
      measurement: 'Symbol-specific accuracy'
    },
    {
      objective: 'Achieve touch typing',
      metric: 'No visual dependence',
      target: 'Type without looking',
      measurement: 'Self-reported + consistency'
    },
    {
      objective: 'Reach professional speed',
      metric: 'WPM',
      target: '80+ WPM',
      measurement: 'Sustained WPM average'
    }
  ]
};
```

### Expected Skill Transfer

Skills learned in TypeRush transfer to real-world typing:

```typescript
const skillTransfer = {
  // Direct transfers
  direct: [
    'Keyboard layout familiarity',
    'Finger positioning (home row)',
    'Common key combinations',
    'Number and symbol locations',
    'Shift key usage (uppercase)'
  ],
  
  // Indirect transfers
  indirect: [
    'Reduced keyboard dependence (less looking)',
    'Improved typing confidence',
    'Better error detection',
    'Faster error correction',
    'Reduced typing fatigue'
  ],
  
  // Cognitive transfers
  cognitive: [
    'Pattern recognition in words',
    'Predictive thinking (anticipating next character)',
    'Improved focus and concentration',
    'Better hand-eye coordination',
    'Enhanced multitasking (typing while thinking)'
  ]
};
```

### Validation Studies (Proposed)

```typescript
const proposedValidationStudy = {
  // Pre/post testing
  methodology: {
    preTest: 'Typing test before TypeRush',
    intervention: '30 days of TypeRush (20min/day)',
    postTest: 'Same typing test after 30 days',
    control: 'Group with traditional typing software'
  },
  
  // Metrics to measure
  metrics: [
    'WPM improvement',
    'Accuracy improvement',
    'Engagement (time spent practicing)',
    'Retention (continued use)',
    'User satisfaction',
    'Skill transfer to real tasks'
  ],
  
  // Expected outcomes
  hypotheses: [
    'TypeRush users show greater WPM improvement than traditional software',
    'TypeRush users spend more time practicing (higher engagement)',
    'TypeRush users report higher satisfaction',
    'Skills learned transfer to real-world typing tasks'
  ]
};
```

## Educational Best Practices

### Feedback Timing

```typescript
// Immediate feedback for learning
const provideFeedback = (input: TypeInput, expected: string) => {
  // Feedback within 50ms
  const isCorrect = input.character === expected;
  const feedbackDelay = 0;  // Immediate
  
  setTimeout(() => {
    if (isCorrect) {
      showPositiveFeedback();  // Green flash, sound
    } else {
      showCorrectiveFeedback(expected);  // Show correct character
    }
  }, feedbackDelay);
  
  // Learning insight: immediate feedback improves retention
};
```

### Error Correction

```typescript
// Constructive error handling
const handleTypingError = (incorrect: string, correct: string) => {
  // Don't just punish - teach
  displayCorrection({
    whatYouTyped: incorrect,
    correctCharacter: correct,
    keyboardHint: showKeyPosition(correct),
    encouragement: 'Try again! You got this!'
  });
  
  // Log for targeted practice
  markForExtraPractice(correct);
};
```

### Progress Celebration

```typescript
// Celebrate milestones
const celebrateMilestone = (milestone: Milestone) => {
  showAnimation({
    type: 'confetti',
    duration: 3000,
    message: milestone.congratsMessage
  });
  
  playSound('fanfare');
  
  // Social sharing option
  offerToShare(milestone);
  
  // Learning insight: celebrating success increases motivation
};
```

## Conclusion

TypeRush's educational value stems from:

1. **Effective Learning Design**: Based on proven principles of skill acquisition
2. **Adaptive Difficulty**: Keeps players in optimal learning zone
3. **Measurable Progress**: Clear metrics show improvement
4. **Engaging Format**: Makes practice enjoyable, not tedious
5. **Personalized Experience**: Adapts to individual learning needs

By combining game mechanics with educational psychology, TypeRush provides a typing training experience that is both effective and enjoyable, leading to measurable skill improvement that transfers to real-world typing tasks.

---

**Previous**: [← User Experience Design](./4-user-experience.md) | **Next**: [Implementation Roadmap →](./6-implementation-roadmap.md)
