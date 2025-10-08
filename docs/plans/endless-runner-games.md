# Adding Endless Runner Games to the Library

## Overview

This document focuses specifically on **endless runner / side-scrolling arcade games** similar to OstrichHaul and GoGoBird. Unlike the puzzle-based games detailed in `more-games.md`, these games are characterized by continuous gameplay with no defined end state, similar to popular titles like Flappy Bird and Chrome's Dino Run.

**Key Characteristics of Endless Runner Games:**
- Continuous side-scrolling or vertical movement
- Progressive difficulty through increasing speed or obstacle frequency
- Score based on distance traveled and/or obstacles avoided
- Simple, responsive controls (typically tap or single button)
- Infinite gameplay until collision/failure
- Focus on reflexes and timing rather than strategy

## Current Endless Runner Games

The app currently includes two successful endless runner implementations:

### **Ostrich Haul** (Game ID: 2)
- Side-scrolling runner with jumping mechanics
- Player controls an ostrich avoiding obstacles
- Tap to jump mechanic
- Score based on obstacles cleared
- Tracks: score, jumps, distance
- Multiple difficulty levels (Easy, Medium, Hard)
- Achievement system with multi-tier progression

### **GoGoBird** (Game ID: 6)
- Vertical flapping mechanic (Flappy Bird style)
- Player navigates bird through pipe gaps
- Tap to flap mechanic
- Score based on pipes passed
- Tracks: score, flaps, distance
- Difficulty affects gap size and pipe speed
- Achievement system integrated

## Core Concepts for Endless Runner Games

### 1. **Game Loop Architecture**

All endless runner games share a similar game loop structure:

```typescript
// Core game state
const [isGameRunning, setIsGameRunning] = useState(false);
const [score, setScore] = useState(0);
const [distance, setDistance] = useState(0);
const [velocity, setVelocity] = useState(0);

// Main game loop (runs at 60 FPS typically)
useEffect(() => {
    if (isGameRunning) {
        const gameLoop = setInterval(() => {
            // Update physics (gravity, velocity)
            // Update player position
            // Check collisions
            // Update score and distance
            // Remove off-screen objects
        }, 1000 / GAME_LOOP_FPS);
        
        return () => clearInterval(gameLoop);
    }
}, [isGameRunning]);
```

### 2. **Physics System**

Endless runners require simple but responsive physics:

**Gravity-Based Movement:**
- Constant downward acceleration (gravity)
- Jump/flap provides upward velocity
- Velocity decreases over time due to gravity
- Ground collision detection

```typescript
// Example from OstrichHaul
const GRAVITY = 1;
const JUMP_VELOCITY = -15;

// Update physics each frame
const newVelocity = velocity + gravity;
const newY = position.y + newVelocity;
```

**Horizontal Scrolling:**
- Obstacles move from right to left
- Speed increases with difficulty
- Animated.timing for smooth movement

```typescript
// Example obstacle movement
Animated.timing(obstacle.x, {
    toValue: -50,
    duration: settings.obstacleSpeed,
    easing: Easing.linear,
    useNativeDriver: false,
}).start();
```

### 3. **Obstacle Management**

**Spawning System:**
- Random spawn intervals based on difficulty
- Off-screen spawn position (right side)
- Variety in obstacle types/positions

```typescript
// Spawn new obstacles at intervals
useEffect(() => {
    if (isGameRunning) {
        const spawnInterval = setInterval(() => {
            const newObstacle = {
                key: Math.random().toString(),
                x: new Animated.Value(SCREEN_WIDTH),
                // Additional properties based on game type
            };
            setObstacles(prev => [...prev, newObstacle]);
        }, settings.spawnRate);
        
        return () => clearInterval(spawnInterval);
    }
}, [isGameRunning]);
```

**Cleanup:**
- Remove obstacles that have moved off-screen
- Prevents memory leaks
- Maintains performance

### 4. **Collision Detection**

Simple bounding box collision:

```typescript
export const checkCollision = (player: Position, obstacle: Obstacle): boolean => {
    const playerTop = player.y + COLLISION_ADJUST;
    const playerBottom = playerTop + PLAYER_HEIGHT - COLLISION_ADJUST * 2;
    const playerLeft = player.x + COLLISION_ADJUST;
    const playerRight = playerLeft + PLAYER_WIDTH - COLLISION_ADJUST * 2;

    const obstacleLeft = obstacle.x;
    const obstacleRight = obstacleLeft + OBSTACLE_WIDTH;
    const obstacleTop = obstacle.gapTop || 0;
    const obstacleBottom = GROUND_LEVEL;

    return (
        playerRight > obstacleLeft &&
        playerLeft < obstacleRight &&
        (playerTop < obstacleTop || playerBottom > obstacleBottom)
    );
};
```

**Collision Tolerance:**
- Slight padding on collision boxes for better gameplay feel
- Prevents pixel-perfect frustration
- Adjust `COLLISION_ADJUST` constant

### 5. **Difficulty Progression**

Endless runners typically support multiple difficulty levels:

```typescript
export const DIFFICULTY_SETTINGS = {
    Easy: { 
        obstacleSpeed: 2000,    // Slower movement
        minSpawnRate: 1500,     // More time between obstacles
        maxSpawnRate: 2500,
        gapSize: 400            // Larger gaps (if applicable)
    },
    Medium: { 
        obstacleSpeed: 1500,
        minSpawnRate: 1000,
        maxSpawnRate: 2000,
        gapSize: 300
    },
    Hard: { 
        obstacleSpeed: 1000,    // Faster movement
        minSpawnRate: 1000,     // Less time between obstacles
        maxSpawnRate: 1500,
        gapSize: 250            // Smaller gaps
    },
};
```

### 6. **Scoring and Metrics**

Typical metrics tracked in endless runners:

| Metric | Description | Usage |
|--------|-------------|-------|
| **Score** | Primary scoring (obstacles passed) | Main achievement trigger |
| **Distance** | Total distance traveled | Secondary metric, achievements |
| **Actions** | Jumps/flaps/moves performed | Skill tracking |
| **Time** | Duration of run | Optional metric |
| **High Score** | Personal best | Displayed in end game screen |

### 7. **Visual Elements**

**Sprite Animation:**
```typescript
// Animate player sprite for running/flapping effect
useEffect(() => {
    if (isGameRunning) {
        const spriteInterval = setInterval(() => {
            setSpriteFrame(prev => (prev + 1) % TOTAL_FRAMES);
        }, SPRITE_ANIMATION_INTERVAL);
        
        return () => clearInterval(spriteInterval);
    }
}, [isGameRunning]);
```

**Background Layers:**
- Parallax scrolling for depth
- Sky layer (static or slow-moving)
- Ground layer (scrolling at game speed)
- Decorative elements (clouds, buildings, etc.)

### 8. **Controls**

Simple, responsive input:
- **Single Tap:** Jump or flap
- **Hold:** Sustained flap (optional)
- **TouchableOpacity:** Full-screen touch area

```tsx
<TouchableOpacity 
    style={styles.screen} 
    onPress={jump} 
    activeOpacity={1}
>
    {/* Game content */}
</TouchableOpacity>
```

## Implementation Phases

### Phase 1: Foundation (Week 1)

**Goal:** Set up basic game structure and physics

**Tasks:**
1. **Create Component Structure**
   - Main game component (`[GameName]Game.tsx`)
   - Player/character component
   - Obstacle component
   - Constants file with difficulty settings
   - Types file for TypeScript interfaces
   - Utils file for collision detection and helper functions

2. **Implement Basic Physics**
   - Gravity system
   - Velocity calculations
   - Jump/flap mechanics
   - Ground collision detection

3. **Set Up Game Loop**
   - 60 FPS update interval
   - State management (position, velocity, score)
   - Start/pause/restart functionality

4. **Create Basic Rendering**
   - Player sprite rendering
   - Ground/floor rendering
   - Sky/background rendering

**Deliverables:**
- Player can move/jump
- Basic collision with ground
- Game loop runs smoothly
- Can start and restart game

### Phase 2: Obstacles and Scoring (Week 2)

**Goal:** Add obstacles and scoring system

**Tasks:**
1. **Implement Obstacle System**
   - Obstacle spawning logic
   - Random spawn intervals
   - Animated movement (right to left)
   - Obstacle cleanup when off-screen

2. **Add Collision Detection**
   - Bounding box collision
   - Collision tolerance adjustments
   - Game over trigger on collision

3. **Implement Scoring**
   - Score increment on obstacle pass
   - Distance tracking
   - Action counting (jumps/flaps)
   - Score display UI

4. **Difficulty Levels**
   - Easy, Medium, Hard settings
   - Speed and spawn rate adjustments
   - Difficulty selection UI

**Deliverables:**
- Obstacles spawn and move
- Collision detection working
- Score increases properly
- Difficulty affects gameplay

### Phase 3: Visual Polish (Week 3)

**Goal:** Enhance visual presentation

**Tasks:**
1. **Sprite Animation**
   - Player running/flapping animation cycle
   - Frame-by-frame sprite rendering
   - Smooth animation transitions

2. **Background Elements**
   - Parallax scrolling background
   - Decorative elements (clouds, scenery)
   - Multiple layer rendering

3. **Visual Feedback**
   - Jump/flap animation effects
   - Collision visual feedback
   - Score popup animations
   - Screen shake on impact (optional)

4. **UI Enhancements**
   - Score display styling
   - High score indicator
   - Distance/metric displays
   - Pause button

**Deliverables:**
- Animated sprites
- Layered backgrounds
- Visual polish and effects
- Professional-looking UI

### Phase 4: Database Integration (Week 4)

**Goal:** Integrate with database and achievement system

**Tasks:**
1. **Database Setup**
   - Add game entry to `games.json` with unique ID
   - Define metric types (score, distance, actions)
   - Add to GameTitle type in constants

2. **Score Recording**
   - Import score insertion functions
   - Record high scores to database
   - Record distance traveled
   - Record actions performed (jumps/flaps)

3. **End Game Modal**
   - Display final score
   - Show high score comparison
   - Display statistics (distance, actions)
   - Restart and exit buttons

4. **Achievement Checking**
   - Define achievements in `achievements.json`
   - Multi-tier progression (Bronze, Silver, Gold, Platinum, Diamond)
   - Score-based achievements
   - Distance-based achievements
   - Check and unlock after each game

**Deliverables:**
- Scores saved to database
- End game modal displays properly
- Achievements unlock correctly
- Game fully integrated with app

### Phase 5: Testing and Refinement (Week 5)

**Goal:** Polish and optimize

**Tasks:**
1. **Gameplay Testing**
   - Test all difficulty levels
   - Balance obstacle spawn rates
   - Adjust collision tolerance
   - Fine-tune physics feel

2. **Performance Testing**
   - Test on iOS and Android
   - Optimize rendering performance
   - Check memory usage
   - Test long play sessions

3. **Bug Fixes**
   - Fix any collision detection issues
   - Resolve animation glitches
   - Fix database integration bugs
   - Handle edge cases

4. **Final Polish**
   - Adjust visual timing
   - Optimize difficulty curve
   - Add sound effects (optional)
   - Add haptic feedback (optional)

**Deliverables:**
- Smooth, bug-free gameplay
- Balanced difficulty
- Optimized performance
- Ready for production

## File Structure Template

When implementing a new endless runner game, follow this structure:

```
components/Home/[GameName]/
├── [GameName]Game.tsx          # Main game component
├── [Player/Character].tsx       # Player character component
├── Obstacle.tsx                 # Obstacle component
├── [DecorativeElement].tsx      # Clouds, scenery, etc. (optional)
├── constants.ts                 # Difficulty settings, dimensions, physics
├── types.ts                     # TypeScript interfaces
└── utils.ts                     # Collision detection, helper functions

utils/
└── [GameName].ts                # Additional game utilities (if needed)

app/
└── [gamename].tsx               # Screen entry point

assets/images/[GameName]/
├── sprites/                     # Character animation frames
├── obstacles/                   # Obstacle images
└── background/                  # Background elements

data/
├── games.json                   # Add game entry
└── achievements.json            # Add achievements
```

## Technical Considerations

### Performance Optimization

1. **Use Native Driver for Animations**
   - Set `useNativeDriver: true` when possible
   - Offloads animations to native thread
   - Smoother performance, especially on Android

2. **Limit Re-renders**
   - Use React.memo for components that don't need frequent updates
   - Optimize state updates
   - Batch state changes when possible

3. **Efficient Collision Detection**
   - Only check collisions for on-screen obstacles
   - Use simple bounding box checks
   - Avoid expensive calculations in game loop

4. **Memory Management**
   - Clean up obstacles that move off-screen
   - Clear intervals on component unmount
   - Avoid memory leaks with proper cleanup

### React Native Considerations

1. **Screen Dimensions**
   ```typescript
   import { Dimensions } from "react-native";
   const SCREEN_WIDTH = Dimensions.get("window").width;
   const SCREEN_HEIGHT = Dimensions.get("window").height;
   ```

2. **Animated Values**
   ```typescript
   import { Animated } from "react-native";
   const position = new Animated.Value(0);
   ```

3. **Touch Handling**
   ```tsx
   <TouchableOpacity 
       style={styles.screen} 
       onPress={handleJump}
       activeOpacity={1}
   >
   ```

### Common Pitfalls to Avoid

1. **Physics Timing Issues**
   - Don't tie physics to render cycles
   - Use consistent frame rate (60 FPS)
   - Account for device performance variations

2. **State Management**
   - Avoid updating too many state variables at once
   - Use refs for values that don't need re-renders
   - Be careful with state in intervals

3. **Collision Detection**
   - Don't make collision boxes too tight
   - Add collision tolerance for better feel
   - Test thoroughly on different screen sizes

4. **Difficulty Balancing**
   - Test all difficulty levels extensively
   - Gradually increase challenge
   - Make "Easy" mode genuinely accessible

## Recommended New Endless Runner Games

### 1. **Dino Run (Chrome Dinosaur Clone)**

**Complexity Level:** Low-Medium

**Description:** A running dinosaur that jumps over cacti and ducks under pterodactyls, inspired by Chrome's offline game.

**Why This Game Fits:**
- Extremely recognizable and popular
- Simple mechanics (jump and duck)
- Progressive difficulty with speed increases
- Proven addictive gameplay
- Day/night cycle for visual variety

**Implementation Strategy:**
1. **Player Mechanics**
   - Running dinosaur sprite (3-4 frame animation)
   - Tap to jump
   - Swipe down to duck (optional)
   - Ground collision detection

2. **Obstacles**
   - Small cacti (single height)
   - Large cacti (double height)
   - Flying pterodactyls (high altitude)
   - Multiple obstacle types for variety

3. **Progressive Difficulty**
   - Start at slow speed
   - Gradually increase speed over time
   - Decrease spawn intervals at higher speeds
   - No difficulty selection (automatic progression)

4. **Visual Elements**
   - Ground scrolling texture
   - Cloud decorations
   - Day/night cycle (visual only)
   - Distance markers every 100 points

**Scoring Metrics:**
| Metric Type | Description |
| ----------- | ----------- |
| High Score | Maximum distance/obstacles avoided |
| Distance | Total distance traveled |
| Obstacles Avoided | Count of obstacles jumped/ducked |
| Time Survived | Duration of run |

**Database Integration:**
- Game ID: 17 (or next available)
- Metrics: `highScore`, `distance`, `obstaclesAvoided`, `time`

**Technical Implementation:**
```typescript
// Key constants
const DINO_WIDTH = 88;
const DINO_HEIGHT = 94;
const BASE_SPEED = 2000; // Gets faster over time
const JUMP_VELOCITY = -18;

// Difficulty scales with score
const getObstacleSpeed = (score: number) => {
    return Math.max(1000, BASE_SPEED - (score * 10));
};

// Multiple obstacle types
const OBSTACLE_TYPES = {
    SMALL_CACTUS: { width: 34, height: 70 },
    LARGE_CACTUS: { width: 50, height: 100 },
    PTERODACTYL: { width: 92, height: 80, altitude: 50 }
};
```

**Achievement Examples:**
- First Steps: Run 100 meters
- Marathon Runner: Run 1000 meters
- Dino Master: Score 500 points
- Night Runner: Play during night cycle
- Obstacle Champion: Avoid 100 obstacles

**Estimated Implementation Time:** 2-3 weeks

---

### 2. **Helicopter Game**

**Complexity Level:** Low-Medium

**Description:** Navigate a helicopter through a cave with ceiling and floor obstacles, maintaining altitude with continuous thrust.

**Why This Game Fits:**
- Classic web game nostalgia
- Unique mechanic (hold to rise, release to fall)
- Continuous terrain generation
- Challenging but simple controls

**Implementation Strategy:**
1. **Player Mechanics**
   - Helicopter sprite with rotor animation
   - Hold screen to apply upward thrust
   - Release to fall with gravity
   - Hover physics with momentum

2. **Terrain Generation**
   - Top and bottom walls that narrow and widen
   - Procedural generation for variety
   - Smooth terrain transitions
   - Gap size varies based on difficulty

3. **Progressive Difficulty**
   - Terrain gaps narrow over time
   - Scrolling speed increases
   - More complex terrain patterns

4. **Visual Elements**
   - Cave walls with texture
   - Rotor spinning animation
   - Thrust particle effects
   - Distance markers

**Scoring Metrics:**
| Metric Type | Description |
| ----------- | ----------- |
| High Score | Maximum distance traveled |
| Distance | Total distance in meters |
| Precision Score | Bonus for maintaining center position |
| Time Aloft | Duration of flight |

**Database Integration:**
- Game ID: 18 (or next available)
- Metrics: `highScore`, `distance`, `precision`, `time`

**Technical Implementation:**
```typescript
// Physics constants
const GRAVITY = 1.5;
const THRUST = -2.5;  // Applied while holding
const MAX_VELOCITY = 15;
const MIN_VELOCITY = -15;

// Terrain generation
interface TerrainPoint {
    topY: number;
    bottomY: number;
    x: number;
}

const generateTerrain = (difficulty: number) => {
    const gapSize = 400 - (difficulty * 10); // Narrows over time
    const topY = Math.random() * (SCREEN_HEIGHT - gapSize - 200) + 100;
    return {
        topY,
        bottomY: topY + gapSize,
        x: SCREEN_WIDTH
    };
};
```

**Achievement Examples:**
- Taking Flight: Fly 100 meters
- Cave Explorer: Fly 500 meters
- Expert Pilot: Score 1000 points
- Steady Hand: Maintain center for 10 seconds
- Marathon Flight: Fly for 2 minutes

**Estimated Implementation Time:** 2-3 weeks

---

### 3. **Jetpack Joyride Style**

**Complexity Level:** Medium

**Description:** Side-scrolling game where player uses a jetpack to fly through obstacles and collect coins.

**Why This Game Fits:**
- Popular mobile game concept
- More complex than basic runners
- Multiple gameplay elements (flying, collecting, avoiding)
- High replay value

**Implementation Strategy:**
1. **Player Mechanics**
   - Character with jetpack animation
   - Tap/hold to activate jetpack (fly up)
   - Release to fall with gravity
   - Animated flame effects when jetpack active

2. **Obstacles and Collectibles**
   - Electric barriers (horizontal and vertical)
   - Laser beams
   - Coins/collectibles to gather
   - Power-ups (shields, magnets, etc.)

3. **Multiple Lanes**
   - Top, middle, bottom paths
   - Obstacles at different heights
   - Strategic path selection

4. **Visual Elements**
   - Laboratory/facility background
   - Parallax scrolling layers
   - Particle effects for jetpack
   - Coin sparkle effects

**Scoring Metrics:**
| Metric Type | Description |
| ----------- | ----------- |
| High Score | Best run score |
| Distance | Meters traveled |
| Coins Collected | Total coins gathered |
| Obstacles Avoided | Count of near-misses |

**Database Integration:**
- Game ID: 19 (or next available)
- Metrics: `highScore`, `distance`, `coins`, `obstaclesAvoided`

**Technical Implementation:**
```typescript
// Jetpack physics
const JETPACK_THRUST = -3;
const GRAVITY = 2;
const MAX_VELOCITY = 20;

// Collectibles
interface Collectible {
    key: string;
    x: Animated.Value;
    y: number;
    type: 'coin' | 'powerup';
}

// Obstacle types
enum ObstacleType {
    ELECTRIC_HORIZONTAL = 'electric_h',
    ELECTRIC_VERTICAL = 'electric_v',
    LASER = 'laser'
}
```

**Achievement Examples:**
- Rookie Pilot: Fly 100 meters
- Coin Hunter: Collect 100 coins
- Obstacle Master: Avoid 50 obstacles
- High Flyer: Reach top of screen 10 times
- Veteran Pilot: Score 1000 points

**Estimated Implementation Time:** 3-4 weeks

---

### 4. **Runner Rush (Parkour Style)**

**Complexity Level:** Medium

**Description:** Fast-paced side-scroller with a character running and performing parkour moves over obstacles.

**Why This Game Fits:**
- Action-packed gameplay
- Multiple movement types (run, jump, slide)
- Dynamic animations
- Modern mobile game feel

**Implementation Strategy:**
1. **Player Mechanics**
   - Running character animation
   - Tap to jump over obstacles
   - Swipe down to slide under obstacles
   - Wall jump for advanced moves (optional)

2. **Obstacle Variety**
   - Low obstacles (slide under)
   - High obstacles (jump over)
   - Combination obstacles requiring timing
   - Moving platforms

3. **Progressive Speed**
   - Starts moderate pace
   - Increases speed gradually
   - Speed boosts for combos
   - Automatic difficulty progression

4. **Visual Elements**
   - Urban/city environment
   - Rooftop setting
   - Building backgrounds with parallax
   - Motion blur at high speeds

**Scoring Metrics:**
| Metric Type | Description |
| ----------- | ----------- |
| High Score | Maximum score achieved |
| Distance | Total distance run |
| Combos | Consecutive obstacle clears |
| Perfect Moves | Frame-perfect timing bonus |

**Database Integration:**
- Game ID: 20 (or next available)
- Metrics: `highScore`, `distance`, `combos`, `perfectMoves`

**Technical Implementation:**
```typescript
// Movement types
enum MoveType {
    RUN = 'run',
    JUMP = 'jump',
    SLIDE = 'slide',
    WALL_JUMP = 'wall_jump'
}

// Obstacle configurations
interface ObstacleConfig {
    type: 'low' | 'high' | 'moving';
    requiredMove: MoveType;
    height: number;
}

// Combo system
const checkCombo = (consecutiveClears: number) => {
    if (consecutiveClears >= 5) return 2.0; // 2x multiplier
    if (consecutiveClears >= 3) return 1.5; // 1.5x multiplier
    return 1.0;
};
```

**Achievement Examples:**
- First Steps: Run 50 meters
- Combo Master: Achieve 5x combo
- Parkour Pro: Clear 100 obstacles
- Speed Demon: Reach maximum speed
- Distance Runner: Run 1000 meters

**Estimated Implementation Time:** 3-4 weeks

---

### 5. **Submarine Adventure**

**Complexity Level:** Low-Medium

**Description:** Navigate a submarine through underwater obstacles and sea creatures, with vertical movement in water.

**Why This Game Fits:**
- Unique underwater theme
- Different from existing games
- Buoyancy physics for interesting gameplay
- Visual variety with ocean theme

**Implementation Strategy:**
1. **Player Mechanics**
   - Submarine sprite with propeller animation
   - Tap to dive deeper (or rise, depending on design)
   - Water physics (buoyancy, momentum)
   - Smooth underwater movement

2. **Obstacles**
   - Rocks and coral
   - Sea mines
   - Fish schools
   - Underwater structures

3. **Environmental Elements**
   - Bubbles rising
   - Light rays from surface
   - Seaweed swaying
   - Depth gradient (darker deeper)

4. **Visual Elements**
   - Ocean blue gradient background
   - Particle effects (bubbles, debris)
   - Light effects
   - Sea creatures as decorations

**Scoring Metrics:**
| Metric Type | Description |
| ----------- | ----------- |
| High Score | Best depth reached |
| Distance | Total distance traveled |
| Treasures Found | Collectibles gathered |
| Time Underwater | Duration of dive |

**Database Integration:**
- Game ID: 21 (or next available)
- Metrics: `highScore`, `distance`, `treasures`, `time`

**Technical Implementation:**
```typescript
// Underwater physics
const BUOYANCY = 0.5;  // Upward force
const DIVE_FORCE = -2;  // Downward force when diving
const WATER_RESISTANCE = 0.9;  // Dampening factor

// Depth system
const calculateDepthEffects = (depth: number) => {
    const darkness = Math.min(depth / 1000, 0.7);  // Max 70% dark
    const speed = 1 + (depth / 500);  // Increases with depth
    return { darkness, speed };
};
```

**Achievement Examples:**
- Deep Diver: Reach 100 meters depth
- Treasure Hunter: Collect 50 treasures
- Ocean Explorer: Travel 500 meters
- Mine Avoider: Avoid 25 mines
- Submarine Captain: Score 1000 points

**Estimated Implementation Time:** 2-3 weeks

---

## Implementation Priority

For app expansion and variety, recommended priority order:

### Priority 1: **Dino Run**
- **Reason:** Most recognizable, simplest to implement
- **Complexity:** Low-Medium
- **Time:** 2-3 weeks
- **Impact:** High nostalgia factor, proven gameplay

### Priority 2: **Helicopter Game**
- **Reason:** Unique control scheme, classic game
- **Complexity:** Low-Medium
- **Time:** 2-3 weeks
- **Impact:** Different feel from existing runners

### Priority 3: **Submarine Adventure**
- **Reason:** Unique theme, visual variety
- **Complexity:** Low-Medium
- **Time:** 2-3 weeks
- **Impact:** Adds underwater theme to library

### Priority 4: **Runner Rush**
- **Reason:** Modern mobile game feel
- **Complexity:** Medium
- **Time:** 3-4 weeks
- **Impact:** Appeals to action game fans

### Priority 5: **Jetpack Joyride Style**
- **Reason:** Complex but high quality
- **Complexity:** Medium
- **Time:** 3-4 weeks
- **Impact:** Premium feel, high replay value

## Database Schema Updates

When adding new endless runner games, update the database:

### Add to Games Table

```sql
INSERT INTO Games (id, title, description, category) VALUES 
(17, 'Dino Run', 'Jump and duck to avoid obstacles in this endless runner', 'Arcade'),
(18, 'Helicopter', 'Navigate through a cave without crashing', 'Arcade'),
(19, 'Jetpack Hero', 'Fly with your jetpack and collect coins', 'Arcade'),
(20, 'Runner Rush', 'Parkour through obstacles at high speed', 'Arcade'),
(21, 'Submarine Adventure', 'Dive deep and avoid underwater obstacles', 'Arcade');
```

### Scores Table Structure

Endless runner games typically use these metrics:

| Metric | Type | Description |
|--------|------|-------------|
| score | INTEGER | Primary score (obstacles passed/distance) |
| highScore | INTEGER | Best score achieved |
| distance | INTEGER | Total distance traveled |
| obstaclesAvoided | INTEGER | Count of obstacles cleared |
| collectibles | INTEGER | Coins/items collected (if applicable) |
| time | INTEGER | Duration of run in seconds |
| actions | INTEGER | Jumps/flaps/moves performed |

## Achievement System Integration

### Multi-Tier Achievement Structure

Follow the existing pattern from OstrichHaul and GoGoBird:

**Tier System:**
- **Bronze (10 points):** Score 10, easy to achieve
- **Silver (25 points):** Score 50, moderate challenge
- **Gold (50 points):** Score 100, significant achievement
- **Platinum (100 points):** Score 200, expert level
- **Diamond (150 points):** Score 500+, master level

### Example Achievement Definitions

```json
{
  "id": 101,
  "title": "Dino Starter",
  "description": "Score 10 in Dino Run",
  "category": "score",
  "tier": "bronze",
  "points": 10,
  "criteria": {
    "game": "Dino Run",
    "metric": "score",
    "value": 10
  }
},
{
  "id": 102,
  "title": "Dino Runner",
  "description": "Score 50 in Dino Run",
  "category": "score",
  "tier": "silver",
  "points": 25,
  "criteria": {
    "game": "Dino Run",
    "metric": "score",
    "value": 50
  }
},
{
  "id": 103,
  "title": "Dino Champion",
  "description": "Score 100 in Dino Run",
  "category": "score",
  "tier": "gold",
  "points": 50,
  "criteria": {
    "game": "Dino Run",
    "metric": "score",
    "value": 100
  }
}
```

### Achievement Categories for Endless Runners

1. **Score-Based:**
   - Reach milestone scores (10, 50, 100, 200, 500)
   - Multi-tier progression

2. **Distance-Based:**
   - Travel specific distances (100m, 500m, 1000m)
   - Long-distance achievements

3. **Action-Based:**
   - Perform X jumps/flaps
   - Perfect timing achievements
   - Combo achievements

4. **Collectible-Based:**
   - Collect X coins/items (if applicable)
   - Collect all items in single run

5. **Time-Based:**
   - Survive for X seconds/minutes
   - Play during specific times of day

6. **Difficulty-Based:**
   - Complete on hard difficulty
   - Reach score on hardest setting

## User Experience Considerations

### Onboarding

**First-Time Players:**
- Brief tutorial overlay showing tap to jump/fly
- Simple text instructions
- Practice mode optional
- Gradual difficulty increase in first game

### Difficulty Selection

**Options:**
- **Easy:** Slower speed, larger gaps, longer spawn intervals
- **Medium:** Standard speed and spacing
- **Hard:** Fast speed, tight gaps, frequent obstacles

**Auto-Progression Alternative:**
- Start easy, gradually increase difficulty
- Based on score/distance
- No manual difficulty selection
- Example: Dino Run, Flappy Bird

### End Game Experience

**Information to Display:**
- Final score (large, prominent)
- High score comparison
- Distance traveled
- Actions performed (jumps, flaps, etc.)
- Achievements unlocked (if any)

**Actions Available:**
- **Restart:** Quick restart for another attempt
- **Home:** Return to main menu
- **Share:** Share score (optional feature)

### Visual Feedback

**During Gameplay:**
- Score increases visually
- Particle effects on actions
- Screen shake on collision
- Distance markers

**End Game:**
- High score celebration if beaten
- Achievement unlock animations
- Confetti for new records

## Testing Checklist

Before releasing a new endless runner game:

### Gameplay Testing

- [ ] All difficulty levels balanced and playable
- [ ] Collision detection accurate but not frustrating
- [ ] Physics feel responsive and fair
- [ ] Score increments correctly
- [ ] Game over triggers properly
- [ ] Restart functionality works
- [ ] Pause/resume works correctly

### Visual Testing

- [ ] Animations smooth at 60 FPS
- [ ] No visual glitches or clipping
- [ ] Sprites render correctly
- [ ] Background scrolls smoothly
- [ ] UI elements clearly visible
- [ ] Responsive on different screen sizes

### Database Integration

- [ ] Game appears in game list
- [ ] Scores save to database
- [ ] High scores retrieve correctly
- [ ] All metrics track properly
- [ ] End game modal displays stats

### Achievement System

- [ ] Achievements defined in JSON
- [ ] Achievement checking triggers
- [ ] Unlocks appear in UI
- [ ] Points awarded correctly
- [ ] Multi-tier progression works

### Performance Testing

- [ ] No memory leaks during long sessions
- [ ] Frame rate stable on target devices
- [ ] No lag or stuttering
- [ ] Battery usage acceptable
- [ ] Works on iOS and Android

### Edge Cases

- [ ] Handles rapid tapping
- [ ] Handles pausing mid-game
- [ ] Handles app backgrounding
- [ ] Handles device rotation (if supported)
- [ ] Handles score overflow (very high scores)

## Next Steps

### Immediate Actions

1. **Choose First Game to Implement**
   - Recommend starting with Dino Run (simplest, most recognizable)
   - Or Helicopter Game for unique mechanics

2. **Set Up Project Structure**
   - Create component folders
   - Set up constants and types files
   - Prepare asset folders

3. **Implement Core Mechanics**
   - Follow Phase 1 (Foundation) steps
   - Focus on physics and controls first
   - Test gameplay feel early

4. **Iterate and Polish**
   - Get feedback from testers
   - Balance difficulty
   - Add visual polish

### Long-Term Goals

- Add 2-3 new endless runner games to complement existing ones
- Create variety in mechanics (jumping, flying, sliding, etc.)
- Maintain consistent quality with OstrichHaul and GoGoBird
- Build comprehensive achievement system for all runners
- Consider leaderboards or social features (future enhancement)

### Success Metrics

- **Player Engagement:** Average session length for endless runners
- **Retention:** Players returning to endless runner games
- **Achievement Completion:** Percentage unlocking achievements
- **Balance:** Distribution of scores across difficulty levels
- **Performance:** Maintain 60 FPS on target devices

## Conclusion

Endless runner games provide quick, addictive gameplay that complements the puzzle-focused games in the library. By following the established patterns from OstrichHaul and GoGoBird, new endless runners can be implemented efficiently while maintaining quality and consistency.

**Key Takeaways:**
- Focus on responsive controls and fair physics
- Keep gameplay simple but challenging
- Add visual polish for professional feel
- Integrate with achievement system for progression
- Test thoroughly across devices and difficulty levels

The recommended games (Dino Run, Helicopter, Submarine Adventure) would provide excellent variety while staying true to the endless runner format that players enjoy in OstrichHaul and GoGoBird.
