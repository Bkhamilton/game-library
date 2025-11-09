# DolphinDive - Obstacle Implementation

## Overview

This document describes the obstacle system implemented for the DolphinDive endless runner game. The system features 5 different obstacle types positioned at various heights to create engaging gameplay challenges.

## Obstacle Types

### 1. Boat 🚤 (Red)
- **Color:** Red (#D32F2F)
- **Sprite Sheet:** 256px × 256px (5 frames)
- **Display Size:** 128px × 128px (scale: 0.5)
- **Position:** 40px above water surface (Y = 360)
- **Challenge:** Sits in the water - dolphin must dive completely under it
- **Strategy:** Forces the player to go underwater, making it impossible to jump over
- **Visual:** Animated sprite sheet scaled to 50% of original size

### 2. Seagull 🐦 (Blue)
- **Color:** Blue (#1976D2)
- **Sprite Sheet:** 256px × 256px (9 frames)
- **Display Size:** 128px × 128px (scale: 0.5)
- **Position:** 200px above water surface (Y = 200)
- **Challenge:** High in the air - requires maximum jump height
- **Strategy:** Player must perform a deep dive first to build enough momentum for a high jump
- **Visual:** Animated sprite sheet scaled to 50% of original size

### 3. Buoy ⚓ (Yellow)
- **Color:** Yellow (#FBC02D)
- **Sprite Sheet:** 256px × 256px (4 frames)
- **Display Size:** 128px × 128px (scale: 0.5)
- **Position:** 30px above water surface (Y = 370)
- **Challenge:** Near surface level - can be avoided by going under or with a shallow jump
- **Strategy:** Offers flexibility - players can choose to dive slightly or jump slightly
- **Visual:** Animated sprite sheet scaled to 50% of original size

### 4. Rock 🪨 (Gray)
- **Color:** Gray (#757575)
- **Sprite Sheet:** 256px × 256px (4 frames)
- **Display Size:** 128px × 128px (scale: 0.5)
- **Position:** 50px below water surface (Y = 450)
- **Challenge:** Underwater obstacle that blocks diving paths
- **Strategy:** Player must stay shallow or time their dive to avoid it
- **Visual:** Animated sprite sheet scaled to 50% of original size

### 5. Jellyfish 🪼 (Purple)
- **Color:** Purple (#9C27B0)
- **Sprite Sheet:** 256px × 256px (4 frames)
- **Display Size:** 60px × 85px (scale: 1.0, custom size)
- **Position:** 150px below water surface (Y = 550)
- **Challenge:** Deep underwater - punishes overly aggressive diving
- **Strategy:** Forces players to moderate dive depth and not go too deep
- **Visual:** Animated sprite sheet at custom size

### 6. Big Boat 🚢 (Pink)
- **Color:** Pink (#C2185B)
- **Size:** 230px × 100px (no sprite sheet)
- **Display Size:** 230px × 100px (scale: 1.0)
- **Position:** 50px above water surface (Y = 350)
- **Challenge:** Large boat obstacle, requires significant vertical movement
- **Strategy:** Requires deeper dive or higher jump to avoid
- **Visual:** Colored rectangle (sprite sheet to be added)

## Technical Implementation

### Type System
```typescript
export type ObstacleType = 'boat' | 'seagull' | 'buoy' | 'rock' | 'jellyfish' | 'bigBoat';

export interface Obstacle {
    key: string;
    x: number;
    y: number;
    type: ObstacleType;
    width: number;
    height: number;
    color: string;
    scale?: number;  // Optional scale factor for sprite sheets
}
```

### Scaling System
Obstacles now support sprite sheet scaling to allow fine-tuning of displayed sizes:
- **Sprite sheets** are created at a base size (typically 256×256)
- **Scale property** determines the displayed size (e.g., 0.5 = 50% of original)
- **Width and height** are calculated as: `originalSize * scale`
- Most obstacles use a 0.5 scale to reduce the 256×256 sprite sheets to 128×128
- Jellyfish and bigBoat keep their original sizes (scale: 1.0)

### Obstacle Generation
Obstacles are randomly generated using the `generateObstacle()` function in `utils.ts`:
- Random type selection from all 5 types
- Spawn at screen width (x = 375)
- Fixed Y positions based on obstacle type
- Consistent sizes for each obstacle type
- Distinct colors for easy identification

### Spawning System
- Obstacles spawn at intervals based on difficulty settings
- Easy mode: ~2500ms between spawns (with ±1000ms variation)
- Hard mode: ~1800ms between spawns (with ±1000ms variation)
- Random variation prevents predictable patterns

### Movement System
- Obstacles move left across the screen at constant speed
- Speed varies by difficulty (3px/frame for Easy, 5px/frame for Hard)
- Obstacles are removed when they move off-screen (x < -150)
- Movement runs at 60 FPS for smooth animation

### Rendering
Each obstacle is rendered as a colored `View` component with:
- Absolute positioning based on x, y coordinates
- Size determined by width and height properties
- Background color matching the obstacle type
- Positioned relative to the water surface (Y = 400)

## Gameplay Design

### Vertical Distribution
The obstacles are strategically placed at different heights:
- **Above Water:** Seagull (200px), Boat (40px), Buoy (30px)
- **Below Water:** Rock (75px), Jellyfish (150px)

This distribution ensures:
- Players must use the full vertical range of movement
- Both diving and jumping mechanics are exercised
- Varied gameplay patterns emerge naturally

### Challenge Balance
- **Easy obstacles:** Buoy (flexible avoidance options)
- **Medium obstacles:** Boat (forces underwater), Rock (limits diving)
- **Hard obstacles:** Seagull (requires momentum planning), Jellyfish (punishes over-diving)

### Strategic Depth
The boat obstacle is particularly interesting because:
- It sits on the water surface, partially submerged
- Cannot be jumped over, only gone under
- Forces a different play pattern than typical jumping obstacles
- Tests the player's underwater navigation skills

## Future Enhancements

Potential improvements for the obstacle system:
1. ✅ Replace colored boxes with actual sprite graphics (COMPLETED - sprite sheets implemented)
2. ✅ Add animation to obstacles (COMPLETED - using animated sprite sheets)
3. Add sprite sheet for bigBoat obstacle type
4. Implement obstacle combinations/patterns
5. Add visual warnings before obstacles spawn
6. Create special/rare obstacle types
7. Add particle effects for obstacle interactions
8. Implement difficulty scaling (more obstacles over time)
9. Fine-tune scale values for better gameplay balance

## Testing

The obstacle generation has been tested to ensure:
- ✅ All 5 types spawn correctly
- ✅ Positions are accurate relative to water surface
- ✅ Sizes are consistent for each type
- ✅ Colors are distinct and visible
- ✅ Random distribution is working
- ✅ Obstacles spawn and move smoothly in the game

## Notes

- Sprite sheets are now implemented for most obstacle types (boat, seagull, buoy, rock, jellyfish)
- The scale property allows flexible sizing - sprites can be created at high resolution and scaled down for display
- All sprite sheets are created at 256×256 base size and scaled to 128×128 for most obstacles
- The SpriteSheet component automatically calculates the correct scale factor to match sprite frame dimensions to container dimensions, ensuring proper display and animation
- The boat obstacle fulfills the requirement for "an obstacle that sits in the water in such a way that the dolphin has to go under it the entire way"
- All obstacles are designed for an endless runner style game with vertical movement
- BigBoat still uses colored rectangles as a placeholder until sprite sheets are created
