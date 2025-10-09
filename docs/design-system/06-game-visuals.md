# Game-Specific Visual Standards

## Overview

This document provides visual specifications, layout standards, and interaction patterns tailored for each game type in the library. Use these guidelines to maintain consistency within game categories while allowing for unique game identities.

---

## Puzzle Games (Grid-Based)

### Category Overview

Includes: Sudoku, Minesweeper, Word Search, Crossword, 2048

**Common Characteristics:**
- Grid-based layouts
- Cell-based interaction
- Turn-based gameplay
- Focus on clarity and readability

---

### Sudoku

#### Grid Layout Specifications

**Grid Structure:**
```typescript
const sudokuGridStyles = {
  container: {
    aspectRatio: 1,
    backgroundColor: currentTheme.colors.background,
    padding: 8,
  },
  // 3x3 major boxes
  box: {
    borderWidth: 2,
    borderColor: currentTheme.colors.border,
  },
  // Individual cells
  cell: {
    flex: 1,
    aspectRatio: 1,
    backgroundColor: currentTheme.colors.grayBackground,
    borderWidth: 0.5,
    borderColor: currentTheme.colors.grayBorder,
    alignItems: 'center',
    justifyContent: 'center',
  },
};
```

**Grid Properties:**
- Total size: 9×9 cells
- Major divisions: 3×3 boxes with thick borders (2px)
- Minor divisions: Individual cells with thin borders (0.5px)
- Cell size: Minimum 32px × 32px for touch targets
- Spacing: Consistent gaps between major boxes

---

#### Cell States

**Given Number (Pre-filled):**
```typescript
{
  backgroundColor: currentTheme.colors.background,
  text: {
    color: currentTheme.colors.text,
    fontFamily: 'SpaceMono',
    fontSize: 20,
    fontWeight: 'bold',
  },
  readOnly: true,
}
```

**User Input:**
```typescript
{
  backgroundColor: currentTheme.colors.grayBackground,
  text: {
    color: currentTheme.colors.primary,
    fontFamily: 'SpaceMono',
    fontSize: 20,
    fontWeight: 'normal',
  },
  editable: true,
}
```

**Selected Cell:**
```typescript
{
  backgroundColor: Color(currentTheme.colors.primary).alpha(0.2).toString(),
  borderWidth: 2,
  borderColor: currentTheme.colors.primary,
}
```

**Same Number Highlight:**
```typescript
{
  backgroundColor: Color(currentTheme.colors.secondary).alpha(0.15).toString(),
}
```

**Conflict/Error:**
```typescript
{
  backgroundColor: Color(currentTheme.colors.accent).alpha(0.2).toString(),
  borderColor: currentTheme.colors.accent,
}
```

---

#### Number Pad

```typescript
const numberPadStyles = {
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 16,
    gap: 8,
  },
  button: {
    width: '18%',
    aspectRatio: 1,
    backgroundColor: currentTheme.colors.grayBackground,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: currentTheme.colors.grayBorder,
  },
  number: {
    fontFamily: 'SpaceMono',
    fontSize: 18,
    fontWeight: 'bold',
    color: currentTheme.colors.text,
  },
  // Show count of remaining numbers
  count: {
    fontSize: 10,
    color: currentTheme.colors.text,
    opacity: 0.6,
    marginTop: 2,
  },
};
```

---

#### UI Elements

**Timer:**
```typescript
{
  position: 'absolute',
  top: 16,
  right: 16,
  fontFamily: 'SpaceMono',
  fontSize: 18,
  color: currentTheme.colors.text,
}
```

**Difficulty Badge:**
```typescript
{
  position: 'absolute',
  top: 16,
  left: 16,
  paddingVertical: 4,
  paddingHorizontal: 12,
  backgroundColor: currentTheme.colors.primary,
  borderRadius: 12,
  text: {
    color: currentTheme.colors.background,
    fontFamily: 'Poppins-SemiBold',
    fontSize: 12,
  },
}
```

**Action Buttons:**
- Hint: Icon button, positioned below grid
- Undo: Icon button, positioned below grid
- Clear: Text button
- Pencil Marks: Toggle button

---

#### Animations

**Number Entry:**
- Duration: 200ms
- Effect: Scale from 0.8 to 1.0 with spring
- Purpose: Confirm placement

**Error Indication:**
- Duration: 250ms
- Effect: Shake animation (±8px)
- Color: Red flash
- Purpose: Clear error feedback

**Same Number Highlight:**
- Duration: 300ms
- Effect: Fade in background tint
- Purpose: Visual aid

**Victory:**
- Duration: 2000ms
- Effect: Confetti + grid sparkle
- Sound: Success chime

---

### Minesweeper

#### Grid Layout Specifications

**Grid Structure:**
```typescript
const minesweeperGridStyles = {
  container: {
    aspectRatio: 1,
    backgroundColor: currentTheme.colors.border,
    gap: 1, // Pixel-perfect borders using gaps
  },
  cell: {
    aspectRatio: 1,
    backgroundColor: currentTheme.colors.grayBackground,
    alignItems: 'center',
    justifyContent: 'center',
    // 3D beveled appearance
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 0,
  },
};
```

**Grid Sizes:**
- Beginner: 9×9 (10 mines)
- Intermediate: 16×16 (40 mines)
- Expert: 16×30 (99 mines)

---

#### Cell States

**Unrevealed:**
```typescript
{
  backgroundColor: currentTheme.colors.grayBackground,
  shadowOffset: { width: 2, height: 2 }, // Raised 3D effect
}
```

**Revealed (Safe):**
```typescript
{
  backgroundColor: currentTheme.colors.background,
  shadowOffset: { width: 0, height: 0 }, // Flat
  number: {
    fontFamily: 'SpaceMono',
    fontSize: 16,
    fontWeight: 'bold',
    // Color based on number (1=blue, 2=green, 3=red, etc.)
  },
}
```

**Flagged:**
```typescript
{
  backgroundColor: currentTheme.colors.grayBackground,
  icon: {
    name: 'flag',
    size: 16,
    color: currentTheme.colors.accent,
  },
}
```

**Mine (Revealed):**
```typescript
{
  backgroundColor: currentTheme.colors.accent,
  icon: {
    name: 'warning',
    size: 20,
    color: currentTheme.colors.background,
  },
}
```

---

#### Number Colors

```typescript
const mineNumberColors = {
  1: '#0000FF', // Blue
  2: '#008000', // Green
  3: '#FF0000', // Red
  4: '#000080', // Navy
  5: '#800000', // Maroon
  6: '#008080', // Teal
  7: '#000000', // Black
  8: '#808080', // Gray
};
```

---

#### UI Elements

**Mine Counter:**
```typescript
{
  fontFamily: 'SpaceMono',
  fontSize: 24,
  color: currentTheme.colors.accent,
  backgroundColor: currentTheme.colors.grayBackground,
  padding: 8,
  borderRadius: 4,
}
```

**Timer:**
```typescript
{
  fontFamily: 'SpaceMono',
  fontSize: 24,
  color: currentTheme.colors.text,
  backgroundColor: currentTheme.colors.grayBackground,
  padding: 8,
  borderRadius: 4,
}
```

**Flag Toggle Button:**
- Icon: Flag symbol
- Active state: Highlighted
- Position: Bottom of screen or header

---

#### Animations

**Cell Reveal:**
- Duration: 300ms
- Effect: 3D flip (rotateY 180°)
- Easing: easeOut

**Cascade Reveal:**
- Duration: 50ms per cell (staggered)
- Effect: Ripple outward from clicked cell
- Purpose: Satisfying chain reaction

**Flag Placement:**
- Duration: 200ms
- Effect: Bounce + rotate
- Purpose: Confirm flag placement

**Mine Explosion:**
- Duration: 500ms
- Effect: Expanding red circle + shake
- Purpose: Game over indication

---

### Word Search

#### Grid Layout Specifications

**Grid Structure:**
```typescript
const wordSearchGridStyles = {
  container: {
    aspectRatio: 1,
    backgroundColor: currentTheme.colors.background,
    padding: 8,
  },
  cell: {
    aspectRatio: 1,
    backgroundColor: currentTheme.colors.grayBackground,
    borderWidth: 0.5,
    borderColor: currentTheme.colors.grayBorder,
    alignItems: 'center',
    justifyContent: 'center',
  },
  letter: {
    fontFamily: 'Poppins-Bold',
    fontSize: 18,
    color: currentTheme.colors.text,
    textTransform: 'uppercase',
  },
};
```

**Grid Sizes:**
- Easy: 10×10
- Medium: 15×15
- Hard: 20×20

---

#### Word List

```typescript
const wordListStyles = {
  container: {
    backgroundColor: currentTheme.colors.grayBackground,
    borderRadius: 12,
    padding: 16,
  },
  word: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 14,
    color: currentTheme.colors.text,
    paddingVertical: 8,
  },
  foundWord: {
    color: currentTheme.colors.primary,
    textDecorationLine: 'line-through',
    opacity: 0.6,
  },
};
```

---

#### Selection States

**Normal Letter:**
```typescript
{
  backgroundColor: currentTheme.colors.grayBackground,
  text: { color: currentTheme.colors.text },
}
```

**Selected (During Drag):**
```typescript
{
  backgroundColor: Color(currentTheme.colors.primary).alpha(0.3).toString(),
}
```

**Found Word:**
```typescript
{
  backgroundColor: Color(currentTheme.colors.secondary).alpha(0.5).toString(),
  // Or use color gradient based on word category
}
```

---

#### Visual Enhancements

**Word Highlight Colors:**
```typescript
const highlightColors = [
  '#FF6B6B', // Red
  '#4ECDC4', // Teal
  '#45B7D1', // Blue
  '#FFA07A', // Orange
  '#98D8C8', // Green
  '#F7DC6F', // Yellow
  '#BB8FCE', // Purple
  '#F8B4D9', // Pink
];
```

Use different colors for each found word to create a rainbow effect.

---

#### Animations

**Letter Selection:**
- Duration: 150ms
- Effect: Scale pulse (1.0 → 1.1 → 1.0)
- Purpose: Touch feedback

**Word Found:**
- Duration: 600ms
- Effect: Highlight sweep along word path
- Color: Fade in highlight color
- Purpose: Celebration

**Word List Update:**
- Duration: 300ms
- Effect: Strikethrough animation
- Purpose: Progress indication

---

### Crossword

#### Grid Layout Specifications

**Grid Structure:**
```typescript
const crosswordGridStyles = {
  container: {
    backgroundColor: currentTheme.colors.background,
    padding: 8,
  },
  cell: {
    aspectRatio: 1,
    borderWidth: 0.5,
    borderColor: currentTheme.colors.grayBorder,
    alignItems: 'center',
    justifyContent: 'center',
  },
  whiteCell: {
    backgroundColor: currentTheme.colors.background,
  },
  blackCell: {
    backgroundColor: currentTheme.colors.text,
  },
  number: {
    position: 'absolute',
    top: 2,
    left: 2,
    fontSize: 8,
    color: currentTheme.colors.text,
    opacity: 0.5,
  },
  letter: {
    fontFamily: 'Poppins-Bold',
    fontSize: 18,
    color: currentTheme.colors.text,
    textTransform: 'uppercase',
  },
};
```

---

#### Cell States

**Empty Cell:**
```typescript
{
  backgroundColor: currentTheme.colors.background,
  borderColor: currentTheme.colors.grayBorder,
}
```

**Selected Cell:**
```typescript
{
  backgroundColor: Color(currentTheme.colors.primary).alpha(0.3).toString(),
  borderWidth: 2,
  borderColor: currentTheme.colors.primary,
}
```

**Current Word Highlight:**
```typescript
{
  backgroundColor: Color(currentTheme.colors.secondary).alpha(0.15).toString(),
}
```

**Correct Letter:**
```typescript
{
  text: { color: currentTheme.colors.primary },
}
```

**Incorrect Letter:**
```typescript
{
  text: { color: currentTheme.colors.accent },
}
```

---

#### Clue Display

```typescript
const clueStyles = {
  container: {
    backgroundColor: currentTheme.colors.grayBackground,
    borderRadius: 12,
    padding: 16,
    marginTop: 16,
  },
  direction: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 14,
    color: currentTheme.colors.primary,
    marginBottom: 8,
  },
  clue: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: currentTheme.colors.text,
    lineHeight: 20,
  },
};
```

---

#### Animations

**Letter Entry:**
- Duration: 200ms
- Effect: Typewriter effect (fade in + slight scale)
- Purpose: Mimic typing

**Word Completion:**
- Duration: 400ms
- Effect: Green glow + checkmark
- Purpose: Positive feedback

**Error Indication:**
- Duration: 250ms
- Effect: Red flash + shake
- Purpose: Clear error feedback

---

### 2048

#### Grid Layout Specifications

**Grid Structure:**
```typescript
const grid2048Styles = {
  container: {
    aspectRatio: 1,
    backgroundColor: currentTheme.colors.grayBorder,
    padding: 8,
    gap: 8,
  },
  cell: {
    aspectRatio: 1,
    backgroundColor: currentTheme.colors.grayBackground,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tile: {
    position: 'absolute',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    // Shadow for elevation
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
};
```

**Grid Size:** 4×4 cells

---

#### Tile Colors

```typescript
const tileColors = {
  2: { bg: '#EEE4DA', text: '#776E65' },
  4: { bg: '#EDE0C8', text: '#776E65' },
  8: { bg: '#F2B179', text: '#F9F6F2' },
  16: { bg: '#F59563', text: '#F9F6F2' },
  32: { bg: '#F67C5F', text: '#F9F6F2' },
  64: { bg: '#F65E3B', text: '#F9F6F2' },
  128: { bg: '#EDCF72', text: '#F9F6F2' },
  256: { bg: '#EDCC61', text: '#F9F6F2' },
  512: { bg: '#EDC850', text: '#F9F6F2' },
  1024: { bg: '#EDC53F', text: '#F9F6F2' },
  2048: { bg: '#EDC22E', text: '#F9F6F2' },
  // Higher numbers use gold/super colors
};
```

---

#### Tile Display

```typescript
const tileStyles = (value: number) => ({
  backgroundColor: tileColors[value]?.bg || '#3C3A32',
  text: {
    fontFamily: 'Poppins-Bold',
    fontSize: value >= 1024 ? 28 : value >= 128 ? 32 : 36,
    color: tileColors[value]?.text || '#F9F6F2',
  },
});
```

---

#### Score Display

```typescript
const scoreStyles = {
  container: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 16,
  },
  scoreBox: {
    backgroundColor: currentTheme.colors.grayBorder,
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
  },
  label: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 12,
    color: currentTheme.colors.text,
    opacity: 0.7,
  },
  value: {
    fontFamily: 'SpaceMono',
    fontSize: 24,
    fontWeight: 'bold',
    color: currentTheme.colors.text,
  },
};
```

---

#### Animations

**Tile Spawn:**
- Duration: 200ms
- Effect: Scale from 0 to 1 with spring
- Purpose: New tile appearance

**Tile Merge:**
- Duration: 300ms
- Effect: Scale pulse (1 → 1.2 → 1)
- Purpose: Merge celebration

**Tile Move:**
- Duration: 150ms
- Effect: Smooth translation
- Easing: easeOut
- Purpose: Swipe feedback

**Score Increment:**
- Duration: 400ms
- Effect: Count up animation + pulse
- Purpose: Score update feedback

---

## Action/Endless Runner Games

### Category Overview

Includes: GoGoBird, Ostrich Haul

**Common Characteristics:**
- Side-scrolling gameplay
- Continuous movement
- Reflex-based interactions
- Score-based progression

---

### GoGoBird (Flappy Bird Clone)

#### Game Area Specifications

```typescript
const gogoBirdStyles = {
  gameArea: {
    flex: 1,
    backgroundColor: '#87CEEB', // Sky blue
  },
  ground: {
    height: 100,
    backgroundColor: '#8B4513', // Brown
    position: 'absolute',
    bottom: 0,
    width: '100%',
  },
};
```

---

#### Bird Sprite

```typescript
const birdStyles = {
  container: {
    width: 40,
    height: 40,
    position: 'absolute',
  },
  sprite: {
    width: 40,
    height: 40,
    // Use sprite sheet for animation frames
  },
};
```

**Animation:**
- Frame count: 3-4 frames
- Frame duration: 100ms
- Effect: Wing flap cycle

---

#### Obstacles (Pipes)

```typescript
const pipeStyles = {
  pipe: {
    width: 60,
    backgroundColor: '#228B22', // Green
    position: 'absolute',
  },
  topPipe: {
    top: 0,
  },
  bottomPipe: {
    bottom: 100, // Above ground
  },
  gap: 150, // Vertical gap between pipes
};
```

---

#### HUD Elements

**Score:**
```typescript
{
  position: 'absolute',
  top: 40,
  alignSelf: 'center',
  fontFamily: 'Poppins-Bold',
  fontSize: 48,
  color: '#fff',
  textShadowColor: '#000',
  textShadowOffset: { width: 2, height: 2 },
  textShadowRadius: 4,
}
```

**High Score:**
```typescript
{
  position: 'absolute',
  top: 100,
  alignSelf: 'center',
  fontFamily: 'SpaceMono',
  fontSize: 16,
  color: '#fff',
  opacity: 0.8,
}
```

---

#### Visual Effects

**Parallax Background:**
- Multiple layers (sky, clouds, distant mountains)
- Different scroll speeds (0.2x, 0.5x, 1x)
- Creates depth perception

**Death Animation:**
- Duration: 500ms
- Effect: Rotate + fall
- Screen shake: ±5px for 300ms

**Score Popup:**
- Duration: 300ms
- Effect: Scale + fade out
- Position: At obstacle passage point

---

### Visual Feedback Patterns

#### Success Indicators

**Pattern:**
```typescript
const successFeedback = {
  color: currentTheme.colors.primary,
  icon: 'checkmark-circle',
  animation: 'scale-pulse',
  sound: 'success.mp3',
  duration: 300,
};
```

**Usage:**
- Correct answer
- Level completion
- Achievement unlock
- High score

---

#### Error Indicators

**Pattern:**
```typescript
const errorFeedback = {
  color: currentTheme.colors.accent,
  icon: 'close-circle',
  animation: 'shake',
  sound: 'error.mp3',
  duration: 250,
};
```

**Usage:**
- Incorrect answer
- Invalid move
- Game over
- Violation of rules

---

#### Progress Indicators

**Loading State:**
```typescript
{
  component: 'Spinner',
  size: 40,
  color: currentTheme.colors.primary,
  position: 'center',
}
```

**Progress Bar:**
```typescript
{
  height: 8,
  backgroundColor: currentTheme.colors.grayBackground,
  borderRadius: 4,
  progressColor: currentTheme.colors.primary,
  animated: true,
  duration: 300,
}
```

---

## Common UI Patterns

### Game Over Screen

```typescript
const gameOverStyles = {
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modal: {
    backgroundColor: currentTheme.colors.background,
    borderRadius: 16,
    padding: 24,
    width: '80%',
    maxWidth: 400,
    alignItems: 'center',
  },
  title: {
    fontFamily: 'Poppins-Bold',
    fontSize: 32,
    color: currentTheme.colors.text,
    marginBottom: 16,
  },
  score: {
    fontFamily: 'SpaceMono',
    fontSize: 48,
    color: currentTheme.colors.primary,
    marginBottom: 24,
  },
  stats: {
    width: '100%',
    gap: 12,
    marginBottom: 24,
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  buttons: {
    flexDirection: 'row',
    gap: 12,
  },
};
```

---

### Pause Screen

```typescript
const pauseStyles = {
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  menu: {
    backgroundColor: currentTheme.colors.background,
    borderRadius: 16,
    padding: 24,
    minWidth: 200,
    gap: 16,
  },
  title: {
    fontFamily: 'Poppins-Bold',
    fontSize: 24,
    color: currentTheme.colors.text,
    textAlign: 'center',
    marginBottom: 8,
  },
};
```

---

### Settings/Options Menu

```typescript
const settingsStyles = {
  container: {
    backgroundColor: currentTheme.colors.background,
    flex: 1,
    padding: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 18,
    color: currentTheme.colors.text,
    marginBottom: 12,
  },
  option: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: currentTheme.colors.grayBorder,
  },
  optionLabel: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: currentTheme.colors.text,
  },
};
```

---

## Testing Game Visuals

### Visual Testing Checklist

For each game:

- [ ] Grid/layout scales properly on all screen sizes
- [ ] Touch targets are at least 44×44px
- [ ] Colors work in all 5 themes
- [ ] Text is readable on all backgrounds
- [ ] Animations run smoothly at 60fps
- [ ] Visual feedback is clear for all interactions
- [ ] States (selected, disabled, error) are distinct
- [ ] Icons and symbols are recognizable
- [ ] Loading states are shown for async operations
- [ ] Victory/defeat screens display correctly

---

## Best Practices

### Do's ✅

- Maintain consistent visual language within game types
- Use theme colors for all game elements
- Provide clear visual feedback for all interactions
- Scale UI appropriately for different screen sizes
- Test on multiple devices and orientations
- Use appropriate animations for game tempo
- Maintain readability as top priority

### Don'ts ❌

- Don't use hardcoded colors
- Don't make touch targets too small
- Don't overcomplicate visuals
- Don't ignore performance on animations
- Don't remove visual feedback
- Don't make games inaccessible
- Don't ignore theme consistency

---

## Related Documentation

- [Theme System](./01-themes.md) - Applying themes to games
- [Typography](./02-typography.md) - Text in game interfaces
- [Colors](./03-colors.md) - Color usage and accessibility
- [Components](./04-components.md) - Reusable UI components
- [Animations](./05-animations.md) - Game-specific animations
