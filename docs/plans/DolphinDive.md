# DolphinDive - Gravity-Based Endless Runner Game

## Overview

**DolphinDive** is an innovative endless runner game featuring a dolphin that must strategically dive underwater to build momentum and jump out of the water to overcome obstacles and collect treats. The game introduces a unique gravity-momentum mechanic where diving deeper provides more upward velocity for higher jumps, creating engaging risk-reward gameplay.

**Complexity Level:** Medium

**Game Type:** Endless Runner with Vertical Momentum Mechanics

## Game Concept

### Core Mechanic: Dive-to-Jump Momentum System

The dolphin continuously swims forward through an ocean environment. The player controls the dolphin's depth:

- **Tap and Hold**: Dive deeper underwater (builds downward momentum)
- **Release**: Dolphin naturally rises due to buoyancy
- **Deeper Dives = Higher Jumps**: The deeper you dive, the more momentum you build for jumping out of the water

### Strategic Depth Mechanics

Different obstacles and collectibles require different dive depths:

1. **Shallow Obstacles** (Low Birds/Buoys): Require minimal dive (surface level)
2. **Medium Obstacles** (Flying Fish/Boats): Require moderate dive (mid-depth)
3. **High Obstacles** (Seagulls/Cliffs): Require deep dive (maximum depth)
4. **Underwater Hazards** (Rocks/Jellyfish): Must avoid while diving
5. **Collectibles** (Fish Treats): Placed at various heights to encourage risk-taking

### Risk-Reward Balance

- **Shallow Dives**: Safe but limited jump height
- **Medium Dives**: Balanced risk/reward
- **Deep Dives**: Risk hitting underwater obstacles but achieve maximum jump height
- **Timing**: Must time the release perfectly to reach the target height

## Why This Game Fits

- **Unique Gravity Mechanic**: Not found in existing games in the library
- **Strategic Depth**: More complex than simple tap-to-jump mechanics
- **Visual Appeal**: Beautiful ocean theme with water surface transitions
- **Skill Progression**: Players improve through understanding momentum physics
- **Replayability**: Multiple depth strategies for different obstacle patterns
- **Educational**: Teaches basic physics concepts (momentum, gravity, buoyancy)

## Implementation Strategy

### 1. Player Mechanics

**Dolphin Movement:**
- Forward-scrolling dolphin sprite with swimming animation
- Vertical position controlled by tap-and-hold
- Smooth transitions between diving and rising
- Surface-breaking jump animation when leaving water

**Physics System:**
```typescript
// Water physics constants
const GRAVITY_UNDERWATER = 0.3;        // Reduced gravity in water
const GRAVITY_AIRBORNE = 1.2;          // Full gravity in air
const DIVE_FORCE = -2.5;               // Downward force when holding
const BUOYANCY = 1.5;                  // Upward force when not diving
const WATER_RESISTANCE = 0.92;         // Dampening factor underwater
const AIR_RESISTANCE = 0.98;           // Less dampening in air

// Momentum-to-jump conversion
const JUMP_MOMENTUM_MULTIPLIER = 2.0;  // Converts dive depth to jump height
const MAX_DIVE_DEPTH = 200;            // Maximum depth in pixels
const WATER_SURFACE_Y = 300;           // Y position of water surface
const MAX_JUMP_HEIGHT = 250;           // Maximum height above water
```

**Dolphin States:**
- `DIVING`: Actively diving (tap held) - accelerating downward
- `RISING_UNDERWATER`: Rising underwater (tap released) - buoyancy applied
- `JUMPING`: Above water surface - using momentum from dive
- `FALLING`: Returning to water - gravity pulling down

**Momentum Calculation:**
```typescript
interface DolphinState {
    y: number;              // Current vertical position
    velocity: number;       // Current vertical velocity
    maxDepthReached: number; // Deepest point in current dive
    isUnderwater: boolean;  // Below water surface
    isDiving: boolean;      // Tap is held
}

const calculateJumpVelocity = (maxDepth: number): number => {
    // Deeper dives = more upward momentum
    const depthFactor = Math.min(maxDepth / MAX_DIVE_DEPTH, 1.0);
    return -15 * (1 + depthFactor * JUMP_MOMENTUM_MULTIPLIER);
};

const updatePhysics = (state: DolphinState, isDiving: boolean): DolphinState => {
    let newVelocity = state.velocity;
    
    if (state.isUnderwater) {
        // Underwater physics
        if (isDiving) {
            newVelocity += DIVE_FORCE;
        } else {
            newVelocity += BUOYANCY - GRAVITY_UNDERWATER;
        }
        newVelocity *= WATER_RESISTANCE;
        
        // Track maximum depth for momentum calculation
        const newDepth = Math.max(state.y - WATER_SURFACE_Y, 0);
        const maxDepth = Math.max(state.maxDepthReached, newDepth);
        
        return {
            ...state,
            velocity: newVelocity,
            maxDepthReached: maxDepth,
            isDiving
        };
    } else {
        // Airborne physics
        newVelocity += GRAVITY_AIRBORNE;
        newVelocity *= AIR_RESISTANCE;
        
        return {
            ...state,
            velocity: newVelocity,
            isDiving
        };
    }
};

// When dolphin breaks the surface going up
const onSurfaceBreak = (state: DolphinState): DolphinState => {
    const jumpVelocity = calculateJumpVelocity(state.maxDepthReached);
    return {
        ...state,
        velocity: jumpVelocity,
        maxDepthReached: 0,  // Reset for next dive
        isUnderwater: false
    };
};
```

### 2. Obstacles and Collectibles

**Obstacle Types:**

| Type | Location | Avoidance Strategy | Sprite |
|------|----------|-------------------|--------|
| **Seagulls** | High in air (200-250px above water) | Deep dive required | Bird sprite |
| **Boats** | Medium height (100-150px above water) | Moderate dive | Boat silhouette |
| **Buoys** | Surface level (0-50px above water) | Shallow dive or go under | Buoy sprite |
| **Rocks** | Underwater (50-100px below surface) | Stay above or time dive | Rock formations |
| **Jellyfish** | Deep underwater (100-150px below) | Avoid deep dives in this area | Animated jellyfish |
| **Fishing Nets** | Mid-depth underwater (50-100px below) | Navigate around carefully | Net texture |

**Collectibles:**

| Type | Location | Reward | Sprite |
|------|----------|--------|--------|
| **Fish (Small)** | Various heights | +1 point | Small fish |
| **Fish (Medium)** | Challenging positions | +3 points | Medium fish |
| **Starfish** | Deep underwater | +5 points (risky) | Starfish |
| **Pearls** | High in air | +10 points (perfect timing) | Pearl with glow |
| **Multiplier Bubbles** | Scattered | 2x score for 10 seconds | Glowing bubble |

**Obstacle Generation:**
```typescript
interface Obstacle {
    key: string;
    x: Animated.Value;
    y: number;                    // Fixed Y position
    type: ObstacleType;
    width: number;
    height: number;
    requiredDiveDepth: number;    // Hint for players
}

const generateObstacle = (difficulty: number): Obstacle => {
    const types: ObstacleType[] = ['seagull', 'boat', 'buoy', 'rock', 'jellyfish', 'net'];
    const type = types[Math.floor(Math.random() * types.length)];
    
    let y: number;
    let requiredDepth: number;
    
    switch(type) {
        case 'seagull':
            y = WATER_SURFACE_Y - 225;  // High in air
            requiredDepth = 150;         // Need deep dive
            break;
        case 'boat':
            y = WATER_SURFACE_Y - 125;  // Medium height
            requiredDepth = 80;          // Moderate dive
            break;
        case 'buoy':
            y = WATER_SURFACE_Y - 25;   // Surface level
            requiredDepth = 0;           // Can go under
            break;
        case 'rock':
            y = WATER_SURFACE_Y + 75;   // Underwater
            requiredDepth = -1;          // Avoid or stay shallow
            break;
        case 'jellyfish':
            y = WATER_SURFACE_Y + 125;  // Deep underwater
            requiredDepth = -1;          // Must avoid
            break;
        case 'net':
            y = WATER_SURFACE_Y + 75;   // Mid-depth
            requiredDepth = -1;          // Navigate around
            break;
    }
    
    return {
        key: Math.random().toString(),
        x: new Animated.Value(screenWidth),
        y,
        type,
        width: 60,
        height: 60,
        requiredDiveDepth: requiredDepth
    };
};
```

### 3. Visual Elements

**Water Surface:**
- Animated wave texture at y = WATER_SURFACE_Y
- Ripple effects when dolphin breaks surface
- Foam particles when jumping
- Splash animation on re-entry

**Underwater Environment:**
- Blue gradient (lighter at surface, darker at depth)
- Bubbles rising continuously
- Light rays from surface (animated)
- Seaweed swaying at bottom
- Sand/coral on ocean floor
- Fish schools moving in background (decorative)

**Above Water Environment:**
- Sky gradient (blue to light blue)
- Animated clouds moving slowly
- Sun with rays (optional)
- Birds flying in distance (decorative)
- Island/mountain silhouettes on horizon

**Visual Feedback:**
- Depth indicator (shows current dive depth and max depth)
- Momentum meter (shows jump potential)
- Trajectory arc prediction (dotted line showing jump path)
- Screen tint based on depth (darker when deeper)
- Speed lines when moving fast

**Particle Effects:**
```typescript
// Water particles
interface WaterParticle {
    x: number;
    y: number;
    velocity: { x: number; y: number };
    size: number;
    opacity: number;
}

// Bubble generation
const generateBubbles = (dolphinY: number): WaterParticle[] => {
    if (dolphinY > WATER_SURFACE_Y) {
        return [{
            x: dolphinX + 20,
            y: dolphinY,
            velocity: { x: Math.random() * 2 - 1, y: -2 },
            size: Math.random() * 10 + 5,
            opacity: 0.7
        }];
    }
    return [];
};

// Splash particles when breaking surface
const generateSplash = (): WaterParticle[] => {
    const particles: WaterParticle[] = [];
    for (let i = 0; i < 10; i++) {
        particles.push({
            x: dolphinX + Math.random() * 40 - 20,
            y: WATER_SURFACE_Y,
            velocity: {
                x: Math.random() * 6 - 3,
                y: Math.random() * -8 - 2
            },
            size: Math.random() * 8 + 4,
            opacity: 1.0
        });
    }
    return particles;
};
```

### 4. Difficulty Levels

| Difficulty | Obstacle Speed | Spawn Rate | Underwater Hazards | Collectible Frequency |
|------------|----------------|------------|--------------------|-----------------------|
| **Easy** | 3000ms | 2.5-3.5s | Low (30%) | High (70%) |
| **Medium** | 2200ms | 2.0-3.0s | Medium (50%) | Medium (50%) |
| **Hard** | 1500ms | 1.5-2.5s | High (70%) | Low (30%) |

**Progressive Difficulty:**
```typescript
interface DifficultySettings {
    obstacleSpeed: number;        // Animation duration
    minSpawnInterval: number;     // Minimum time between obstacles
    maxSpawnInterval: number;     // Maximum time between obstacles
    underwaterHazardChance: number; // Probability of underwater obstacles
    collectibleChance: number;    // Probability of spawning collectibles
}

const getDifficultySettings = (level: DifficultyLevel): DifficultySettings => {
    switch(level) {
        case 'Easy':
            return {
                obstacleSpeed: 3000,
                minSpawnInterval: 2500,
                maxSpawnInterval: 3500,
                underwaterHazardChance: 0.3,
                collectibleChance: 0.7
            };
        case 'Medium':
            return {
                obstacleSpeed: 2200,
                minSpawnInterval: 2000,
                maxSpawnInterval: 3000,
                underwaterHazardChance: 0.5,
                collectibleChance: 0.5
            };
        case 'Hard':
            return {
                obstacleSpeed: 1500,
                minSpawnInterval: 1500,
                maxSpawnInterval: 2500,
                underwaterHazardChance: 0.7,
                collectibleChance: 0.3
            };
    }
};

// Dynamic difficulty increase over time
const getSpeedMultiplier = (distance: number): number => {
    return Math.min(1.5, 1 + (distance / 1000) * 0.1);
};
```

### 5. Scoring System

**Score Calculation:**
```typescript
interface ScoreMetrics {
    score: number;              // Primary score
    distance: number;           // Total distance traveled
    fishCollected: number;      // Fish treats collected
    perfectJumps: number;       // Obstacles cleared with minimal depth
    deepDives: number;          // Number of max-depth dives
    timeAlive: number;          // Seconds survived
}

// Score for avoiding obstacles
const OBSTACLE_CLEAR_POINTS = 5;

// Score for collectibles (already defined in collectibles table)
const FISH_SMALL = 1;
const FISH_MEDIUM = 3;
const STARFISH = 5;
const PEARL = 10;

// Bonus scoring
const PERFECT_JUMP_BONUS = 10;     // Used minimal dive for obstacle
const DEEP_DIVE_BONUS = 5;         // Reached max depth successfully
const COMBO_MULTIPLIER = 1.5;      // Active during multiplier bubble
```

### 6. Collision Detection

```typescript
// Dolphin collision box (smaller than sprite for forgiveness)
const DOLPHIN_WIDTH = 80;
const DOLPHIN_HEIGHT = 40;
const COLLISION_TOLERANCE = 10;

const checkCollision = (
    dolphinY: number,
    obstacles: Obstacle[]
): boolean => {
    const dolphinLeft = DOLPHIN_X + COLLISION_TOLERANCE;
    const dolphinRight = DOLPHIN_X + DOLPHIN_WIDTH - COLLISION_TOLERANCE;
    const dolphinTop = dolphinY + COLLISION_TOLERANCE;
    const dolphinBottom = dolphinY + DOLPHIN_HEIGHT - COLLISION_TOLERANCE;
    
    for (const obstacle of obstacles) {
        const obstacleLeft = obstacle.x.__getValue();
        const obstacleRight = obstacleLeft + obstacle.width;
        const obstacleTop = obstacle.y;
        const obstacleBottom = obstacle.y + obstacle.height;
        
        // Check if in X range
        if (dolphinRight > obstacleLeft && dolphinLeft < obstacleRight) {
            // Check if in Y range
            if (dolphinBottom > obstacleTop && dolphinTop < obstacleBottom) {
                return true;  // Collision detected
            }
        }
    }
    
    return false;
};

// Collectible pickup (larger tolerance for better UX)
const PICKUP_TOLERANCE = 20;

const checkCollectible = (
    dolphinY: number,
    collectibles: Collectible[]
): Collectible | null => {
    const dolphinCenterX = DOLPHIN_X + DOLPHIN_WIDTH / 2;
    const dolphinCenterY = dolphinY + DOLPHIN_HEIGHT / 2;
    
    for (const collectible of collectibles) {
        const collectibleX = collectible.x.__getValue();
        const collectibleCenterX = collectibleX + collectible.width / 2;
        const collectibleCenterY = collectible.y + collectible.height / 2;
        
        const distance = Math.sqrt(
            Math.pow(dolphinCenterX - collectibleCenterX, 2) +
            Math.pow(dolphinCenterY - collectibleCenterY, 2)
        );
        
        if (distance < PICKUP_TOLERANCE + collectible.width / 2) {
            return collectible;
        }
    }
    
    return null;
};
```

## Scoring Metrics

| Metric Type | Description | Usage |
|-------------|-------------|-------|
| **High Score** | Best score achieved | Main leaderboard |
| **Distance** | Total distance traveled in meters | Secondary metric |
| **Fish Collected** | Total fish treats collected | Collection achievement |
| **Perfect Jumps** | Obstacles cleared with optimal dive | Skill metric |
| **Deep Dives** | Number of maximum depth dives | Risk-taking metric |
| **Time Alive** | Duration of longest run in seconds | Endurance metric |

## Database Integration

**Game Entry:**
- Game ID: 22 (or next available)
- Game Name: "DolphinDive"
- Category: "Endless Runner"
- Difficulty Levels: Easy, Medium, Hard

**Metrics Schema:**
```typescript
interface DolphinDiveMetrics {
    highScore: number;
    distance: number;
    fishCollected: number;
    perfectJumps: number;
    deepDives: number;
    timeAlive: number;
}
```

**Database Table Structure:**
```sql
-- Add to games table
INSERT INTO games (id, name, category, hasMultiplayer, hasDifficulty)
VALUES (22, 'DolphinDive', 'Endless Runner', 0, 1);

-- Scores table already supports these columns
-- highScore, distance, fishCollected (as collectibles),
-- perfectJumps (as custom metric), deepDives (as actions),
-- timeAlive (as time)
```

## Achievement Examples

### Tier 1: Beginner
- **First Splash** - Complete your first dive (5 points)
- **Fish Friend** - Collect 10 fish (10 points)
- **Surface Surfer** - Jump above water 25 times (10 points)
- **Depth Explorer** - Reach 100 meters depth (15 points)

### Tier 2: Intermediate  
- **Dolphin Diver** - Score 100 points (20 points)
- **School's Out** - Collect 50 fish in one run (25 points)
- **Perfect Form** - Achieve 5 perfect jumps in one run (30 points)
- **Deep Sea Adventurer** - Complete 25 deep dives (25 points)

### Tier 3: Advanced
- **Master Dolphin** - Score 500 points (50 points)
- **Fish Collector** - Collect 100 total fish (40 points)
- **Accuracy Expert** - Achieve 20 perfect jumps (50 points)
- **Abyss Walker** - Reach maximum depth 50 times (45 points)

### Tier 4: Expert
- **Dolphin Legend** - Score 1000 points in one run (75 points)
- **Ocean Marathon** - Travel 2000 meters in one run (75 points)
- **Perfect Dive** - Complete a run with 15+ perfect jumps (80 points)
- **Treasure Hunter** - Collect a pearl (100 points)

### Tier 5: Master
- **Dolphin God** - Score 2000 points (100 points)
- **Endless Ocean** - Travel 5000 meters (100 points)
- **Momentum Master** - Achieve 100 perfect jumps total (100 points)
- **Deep Blue** - Survive 300 seconds in Hard mode (100 points)

## File Structure

Following the repository's standard structure:

```
components/Home/DolphinDive/
├── DolphinDiveGame.tsx         # Main game component
├── Dolphin.tsx                 # Dolphin character component
├── Obstacle.tsx                # Obstacle component (unified)
├── Collectible.tsx             # Collectible item component
├── WaterSurface.tsx            # Animated water surface
├── ParticleSystem.tsx          # Bubbles and splash effects
├── DepthIndicator.tsx          # UI showing dive depth
├── MomentumMeter.tsx           # UI showing jump potential
├── BackgroundLayer.tsx         # Parallax background layers
├── constants.ts                # Game constants and difficulty settings
├── types.ts                    # TypeScript interfaces
└── utils.ts                    # Collision detection, physics helpers

utils/
└── DolphinDive.ts              # Game-specific utilities

app/
└── dolphindive.tsx             # Screen entry point

assets/images/DolphinDive/
├── sprites/
│   ├── dolphinSwim1.png        # Swimming animation frames
│   ├── dolphinSwim2.png
│   ├── dolphinSwim3.png
│   ├── dolphinJump.png         # Jump pose
│   └── dolphinDive.png         # Dive pose
├── obstacles/
│   ├── seagull.png
│   ├── boat.png
│   ├── buoy.png
│   ├── rock.png
│   ├── jellyfish.png
│   └── fishingNet.png
├── collectibles/
│   ├── fishSmall.png
│   ├── fishMedium.png
│   ├── starfish.png
│   ├── pearl.png
│   └── multiplierBubble.png
└── background/
    ├── waterTexture.png
    ├── waves.png
    ├── clouds.png
    ├── seaweed.png
    └── lightRays.png

data/
├── games.json                  # Add DolphinDive entry
└── achievements.json           # Add DolphinDive achievements
```

## Implementation Phases

### Phase 1: Foundation (Week 1)

**Goal:** Basic dolphin movement and water physics

**Tasks:**
1. **Create Component Structure**
   - Main game component setup
   - Dolphin component with sprite rendering
   - Constants file with physics values
   - Types file for interfaces
   
2. **Implement Core Physics**
   - Gravity system (underwater vs. airborne)
   - Buoyancy mechanics
   - Dive force on tap-and-hold
   - Water surface detection
   
3. **Basic Rendering**
   - Dolphin sprite with position
   - Water surface line
   - Blue gradient background
   - Simple depth indicator

4. **Game Loop**
   - 60 FPS update interval
   - Physics updates
   - Position tracking
   - Start/restart functionality

**Deliverables:**
- Dolphin responds to tap-and-hold
- Smooth diving and rising
- Water surface transition works
- Basic physics feel good

### Phase 2: Momentum System (Week 2)

**Goal:** Implement dive-to-jump momentum mechanics

**Tasks:**
1. **Momentum Tracking**
   - Track maximum dive depth
   - Calculate jump velocity from depth
   - Reset momentum on water re-entry
   
2. **Jump Mechanics**
   - Surface-breaking detection
   - Momentum-to-velocity conversion
   - Airborne physics
   - Landing back in water

3. **Visual Feedback**
   - Momentum meter UI
   - Depth indicator enhancement
   - Trajectory prediction (optional)
   - Screen tint based on depth

4. **Testing and Tuning**
   - Adjust physics constants
   - Test different dive depths
   - Ensure satisfying jump feel
   - Balance risk/reward

**Deliverables:**
- Deeper dives result in higher jumps
- Momentum system feels intuitive
- Visual feedback is clear
- Physics are balanced

### Phase 3: Obstacles and Collectibles (Week 3)

**Goal:** Add obstacles, collectibles, and collision detection

**Tasks:**
1. **Obstacle System**
   - Multiple obstacle types
   - Spawn logic with timing
   - Animated movement
   - Off-screen cleanup

2. **Collectible System**
   - Multiple collectible types
   - Strategic placement
   - Collection detection
   - Visual pickup effects

3. **Collision Detection**
   - Dolphin vs. obstacles
   - Dolphin vs. collectibles
   - Tolerance adjustments
   - Game over trigger

4. **Scoring**
   - Score calculation
   - Obstacle clear points
   - Collectible points
   - Bonus calculations

**Deliverables:**
- Obstacles spawn and move correctly
- Collision detection works accurately
- Collectibles can be picked up
- Score increases properly

### Phase 4: Visual Polish (Week 4)

**Goal:** Enhance visual presentation and effects

**Tasks:**
1. **Animation System**
   - Dolphin swimming animation
   - Dolphin jump/dive poses
   - Smooth state transitions
   
2. **Environmental Effects**
   - Animated water surface
   - Rising bubbles
   - Light rays from surface
   - Splash effects on surface break

3. **Background Layers**
   - Parallax scrolling
   - Underwater gradient
   - Sky and clouds above water
   - Decorative elements

4. **UI Enhancement**
   - Score display styling
   - High score indicator
   - Depth meter design
   - Momentum meter design

**Deliverables:**
- Animated sprites
- Particle effects working
- Layered backgrounds
- Professional UI design

### Phase 5: Difficulty and Balance (Week 5)

**Goal:** Implement difficulty levels and game balance

**Tasks:**
1. **Difficulty Settings**
   - Easy, Medium, Hard configurations
   - Speed adjustments
   - Spawn rate variations
   - Collectible frequency

2. **Progressive Difficulty**
   - Speed increases over time
   - More complex obstacle patterns
   - Mixed obstacle types
   
3. **Balance Testing**
   - Playtest each difficulty
   - Adjust physics values
   - Tune scoring
   - Ensure fair progression

4. **Difficulty Selection UI**
   - Selection screen
   - Difficulty descriptions
   - Best score per difficulty

**Deliverables:**
- Three balanced difficulty levels
- Progressive difficulty works
- Each level feels distinct
- Fair and fun gameplay

### Phase 6: Database Integration (Week 6)

**Goal:** Integrate with database and achievement system

**Tasks:**
1. **Database Setup**
   - Add game entry to games.json
   - Define metric mappings
   - Add to GameTitle type
   
2. **Score Tracking**
   - Save high score
   - Track all metrics
   - Retrieve personal best
   - Display statistics

3. **Achievement Integration**
   - Define 20+ achievements
   - Implement tracking logic
   - Test unlock conditions
   - Add achievement notifications

4. **End Game Modal**
   - Score summary
   - Metrics display
   - Achievement unlocks
   - Share/replay buttons

**Deliverables:**
- Scores save to database
- Achievements unlock correctly
- End game modal displays properly
- Full integration complete

### Phase 7: Testing and Refinement (Week 7)

**Goal:** Final testing, bug fixes, and polish

**Tasks:**
1. **Comprehensive Testing**
   - Test all difficulty levels
   - Verify achievement unlocks
   - Check edge cases
   - Performance testing

2. **Bug Fixes**
   - Fix collision issues
   - Resolve animation glitches
   - Fix scoring bugs
   - Address performance issues

3. **Balance Refinement**
   - Adjust difficulty curves
   - Fine-tune physics
   - Balance scoring
   - Optimize spawn rates

4. **Final Polish**
   - Improve animations
   - Enhance effects
   - Optimize performance
   - Add final touches

**Deliverables:**
- Bug-free gameplay
- Smooth performance
- Balanced difficulty
- Ready for release

## Technical Implementation Details

### Game Loop Structure

```typescript
// Main game component state
const [isGameRunning, setIsGameRunning] = useState(false);
const [score, setScore] = useState(0);
const [distance, setDistance] = useState(0);
const [gameState, setGameState] = useState<DolphinState>({
    y: WATER_SURFACE_Y,
    velocity: 0,
    maxDepthReached: 0,
    isUnderwater: false,
    isDiving: false
});
const [obstacles, setObstacles] = useState<Obstacle[]>([]);
const [collectibles, setCollectibles] = useState<Collectible[]>([]);

// Main game loop (60 FPS)
useEffect(() => {
    if (!isGameRunning) return;
    
    const gameLoop = setInterval(() => {
        setGameState(prev => {
            // Update physics
            const newState = updatePhysics(prev, isDiving);
            const newY = prev.y + newState.velocity;
            
            // Check water surface crossing
            const wasUnderwater = prev.y > WATER_SURFACE_Y;
            const isNowUnderwater = newY > WATER_SURFACE_Y;
            
            if (wasUnderwater && !isNowUnderwater) {
                // Breaking surface - apply momentum
                return onSurfaceBreak({ ...newState, y: newY, isUnderwater: false });
            } else if (!wasUnderwater && isNowUnderwater) {
                // Entering water - reset momentum
                return { ...newState, y: newY, isUnderwater: true, maxDepthReached: 0 };
            }
            
            return { ...newState, y: newY, isUnderwater: isNowUnderwater };
        });
        
        // Check collisions
        if (checkCollision(gameState.y, obstacles)) {
            handleGameOver();
            return;
        }
        
        // Check collectibles
        const collected = checkCollectible(gameState.y, collectibles);
        if (collected) {
            handleCollectible(collected);
        }
        
        // Update distance
        setDistance(prev => prev + 1);
        
    }, 1000 / 60);  // 60 FPS
    
    return () => clearInterval(gameLoop);
}, [isGameRunning, gameState, obstacles, collectibles, isDiving]);
```

### Sprite Animation

```typescript
// Dolphin sprite animation
const DOLPHIN_SPRITES = [
    require('@/assets/images/DolphinDive/sprites/dolphinSwim1.png'),
    require('@/assets/images/DolphinDive/sprites/dolphinSwim2.png'),
    require('@/assets/images/DolphinDive/sprites/dolphinSwim3.png'),
];

const [spriteFrame, setSpriteFrame] = useState(0);

useEffect(() => {
    if (!isGameRunning) return;
    
    const spriteInterval = setInterval(() => {
        setSpriteFrame(prev => (prev + 1) % DOLPHIN_SPRITES.length);
    }, 150);  // Change frame every 150ms
    
    return () => clearInterval(spriteInterval);
}, [isGameRunning]);

// Use different sprite when jumping or diving
const getDolphinSprite = (state: DolphinState) => {
    if (!state.isUnderwater && state.velocity < 0) {
        return require('@/assets/images/DolphinDive/sprites/dolphinJump.png');
    } else if (state.isDiving) {
        return require('@/assets/images/DolphinDive/sprites/dolphinDive.png');
    } else {
        return DOLPHIN_SPRITES[spriteFrame];
    }
};
```

## User Experience Considerations

### Tutorial System

For first-time players, implement a brief tutorial:

1. **Step 1**: "Tap and hold to dive"
2. **Step 2**: "Dive deeper for higher jumps"
3. **Step 3**: "Release to rise and jump"
4. **Step 4**: "Collect fish and avoid obstacles"

### Visual Feedback

**During Gameplay:**
- Depth indicator shows current and max dive depth
- Momentum meter shows jump potential
- Score increases with visual animation
- Collectible pickup sparkle effect
- Screen darkens when diving deep

**End Game:**
- Show final score prominently
- Display all metrics
- Show personal best comparison
- Achievement unlock animations
- Confetti for new high score

### Accessibility

- **Colorblind Mode**: Adjust obstacle colors
- **Visual Indicators**: Show depth zones with different tints
- **Haptic Feedback**: Vibration on collection and collision
- **Adjustable Difficulty**: Clear difficulty descriptions
- **Practice Mode**: No obstacles, learn mechanics

## Performance Optimization

- Use `useNativeDriver: true` for animations where possible
- Limit particle effects (max 50 bubbles on screen)
- Remove off-screen obstacles and collectibles
- Optimize collision detection (check only nearby objects)
- Use sprite sheets to reduce image loading
- Throttle depth calculations to every 3rd frame

## Estimated Implementation Time

**Total: 7 weeks**

- Week 1: Foundation and basic physics
- Week 2: Momentum system
- Week 3: Obstacles and collision
- Week 4: Visual polish
- Week 5: Difficulty and balance
- Week 6: Database integration
- Week 7: Testing and refinement

**Quick Prototype (2 weeks):**
If rapid implementation is needed, focus on:
- Core physics and momentum (Week 1)
- Basic obstacles and scoring (Week 2)
- Skip particle effects and advanced visuals
- Use placeholder sprites

## Key Differentiators

What makes DolphinDive unique:

1. **Momentum-Based Gameplay**: Unlike tap-to-jump games, requires planning ahead
2. **Risk-Reward Decisions**: Deeper dives are riskier but necessary for higher obstacles
3. **Dual Environment**: Seamlessly transitions between underwater and airborne
4. **Strategic Depth**: Players must judge required dive depth for each obstacle
5. **Physics-Based Learning**: Teaches momentum and gravity concepts naturally
6. **Visual Appeal**: Beautiful ocean theme with multiple layers
7. **Skill Progression**: Mastery comes from understanding physics, not just reflexes

## Success Metrics

Track these metrics to measure game success:

- **Player Retention**: 40%+ players return within 24 hours
- **Session Length**: Average 3-5 minutes per session
- **Achievement Rate**: 60%+ players unlock at least 5 achievements
- **Difficulty Distribution**: 40% Easy, 40% Medium, 20% Hard
- **Score Progression**: Average high scores increase over time
- **Performance**: Maintain 60 FPS on target devices

## Future Enhancements

Potential additions for future versions:

### Power-Ups
- **Speed Boost**: Temporary faster movement
- **Shield**: One-time collision protection
- **Magnet**: Attracts nearby collectibles
- **Slow Motion**: Slows obstacles temporarily

### Game Modes
- **Time Trial**: Score as much as possible in 60 seconds
- **Zen Mode**: No obstacles, just collect fish
- **Challenge Mode**: Specific objective to complete

### Social Features
- **Daily Challenges**: Specific goals with bonus rewards
- **Leaderboards**: Compare scores with friends
- **Replay Sharing**: Share your best runs
- **Multiplayer**: Race against another player

### Customization
- **Dolphin Skins**: Unlock different dolphin colors/patterns
- **Ocean Themes**: Different time of day, weather
- **Trail Effects**: Visual trails behind dolphin
- **Sound Themes**: Different music and sound effects

---

## Getting Started

To begin implementing DolphinDive:

1. **Review this document thoroughly**
2. **Set up the component structure** following the file structure template
3. **Start with Phase 1** (foundation and basic physics)
4. **Test frequently** - the physics need to feel right
5. **Adjust constants** in `constants.ts` to tune gameplay
6. **Gather feedback** early and iterate on the mechanics
7. **Follow the repository patterns** for consistency with other games

## Questions and Considerations

Before starting development, consider:

- **Sprite Assets**: Will you create custom sprites or use placeholders initially?
- **Sound Design**: Will you add sound effects and music?
- **Platform Testing**: Have you tested performance on target devices?
- **Difficulty Balance**: What should the average high score be for each difficulty?
- **Tutorial**: How intrusive should the tutorial be for first-time players?

---

*Document Version: 1.0*  
*Created: 2024*  
*Game Concept: DolphinDive - Gravity-Based Endless Runner*

---

## Implementation Progress

### Phase 1: Foundation - Initial Setup (COMPLETED)

**Date:** December 2024

**Completed Tasks:**

1. **Component Structure Created**
   - ✅ Created `components/Home/DolphinDive/` directory
   - ✅ Created all necessary component files following the planned structure:
     - `DolphinDiveGame.tsx` - Main game component with basic game loop
     - `Dolphin.tsx` - Dolphin character component (black box placeholder)
     - `Obstacle.tsx` - Obstacle component (placeholder)
     - `Collectible.tsx` - Collectible item component (placeholder)
     - `WaterSurface.tsx` - Water surface line visualization
     - `ParticleSystem.tsx` - Particle effects (placeholder)
     - `DepthIndicator.tsx` - Depth indicator UI (placeholder)
     - `MomentumMeter.tsx` - Momentum meter UI (placeholder)
     - `BackgroundLayer.tsx` - Background layers (placeholder)
     - `constants.ts` - Game constants and physics values
     - `types.ts` - TypeScript interfaces for game state
     - `utils.ts` - Physics calculations and helper functions

2. **Navigation and Routing**
   - ✅ Created `app/dolphindive.tsx` screen entry point
   - ✅ Added DolphinDive to `data/games.json` (ID: 11)
   - ✅ Updated `constants/Types.ts` to include "DolphinDive" in GameTitle
   - ✅ Added difficulty levels to `constants/Difficulties.js` (Easy, Hard)
   - ✅ Created placeholder logo and added to `constants/GameLogos.js`
   - ✅ Added routing case in `screens/HomeScreen.tsx`
   - ✅ Added Stack.Screen in `app/_layout.tsx`

3. **Basic Game Prototype**
   - ✅ Implemented game loop running at ~60 FPS
   - ✅ Created basic physics system with gravity and buoyancy
   - ✅ Implemented dolphin movement (tap-and-hold to dive)
   - ✅ Created visual representation with:
     - Sky Blue (#87CEEB) for the sky
     - Ocean Blue (#006994) for the ocean
     - Black box for dolphin placeholder
     - Water surface line at y=300
   - ✅ Added start screen with instructions
   - ✅ Added basic score display

**Current State:**
- Game is navigable from home screen
- Basic prototype is functional and playable
- Dolphin responds to tap-and-hold input
- Physics system is implemented but needs tuning
- All placeholder files are in place for future development

**Next Steps for Phase 1 Continuation:**
- Fine-tune physics constants for better "feel"
- Add proper collision detection
- Implement obstacle spawning system
- Add depth indicator UI
- Add momentum meter UI
- Test and iterate on gameplay mechanics

**Files Modified:**
- `data/games.json`
- `constants/Types.ts`
- `constants/Difficulties.js`
- `constants/GameLogos.js`
- `screens/HomeScreen.tsx`
- `app/_layout.tsx`

**Files Created:**
- `app/dolphindive.tsx`
- `components/Home/DolphinDive/DolphinDiveGame.tsx`
- `components/Home/DolphinDive/Dolphin.tsx`
- `components/Home/DolphinDive/Obstacle.tsx`
- `components/Home/DolphinDive/Collectible.tsx`
- `components/Home/DolphinDive/WaterSurface.tsx`
- `components/Home/DolphinDive/ParticleSystem.tsx`
- `components/Home/DolphinDive/DepthIndicator.tsx`
- `components/Home/DolphinDive/MomentumMeter.tsx`
- `components/Home/DolphinDive/BackgroundLayer.tsx`
- `components/Home/DolphinDive/constants.ts`
- `components/Home/DolphinDive/types.ts`
- `components/Home/DolphinDive/utils.ts`
- `assets/images/gamelogo/dolphinDiveLogo.jpg` (placeholder)

