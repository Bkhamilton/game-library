# Animation Testing Checklist

This document provides a comprehensive list of all animations added to the app for testing purposes.

## 🎨 Core Animation Components

### 1. AnimatedButton
**Location**: `components/animations/ReanimatedExamples.tsx`

**What it does**: Provides spring-based press feedback with scale animation (0.95x)

**Test Steps**:
1. Press and hold any animated button
2. Observe the button scale down to 95% smoothly
3. Release and observe it spring back to 100%
4. Verify smooth 60fps animation

---

### 2. FadeInView
**Location**: `components/animations/ReanimatedExamples.tsx`

**What it does**: Fades in content with slight upward translation on mount (400ms default)

**Test Steps**:
1. Navigate to any screen with FadeInView
2. Observe content fades from opacity 0 to 1
3. Content should also slide up slightly (20px)
4. Total animation duration: 400ms

---

### 3. PulseView
**Location**: `components/animations/ReanimatedExamples.tsx`

**What it does**: Continuously pulses content (scale 1.0 → 1.05 → 1.0) every 2 seconds

**Test Steps**:
1. Find any pulsing element
2. Observe continuous scale animation
3. Animation should loop infinitely
4. Each pulse cycle: 2 seconds total

---

### 4. ShakeView
**Location**: `components/animations/ReanimatedExamples.tsx`

**What it does**: Shakes content horizontally when triggered (250ms total)

**Test Steps**:
1. Trigger an error state (e.g., invalid Sudoku move)
2. Observe horizontal shake animation (-10px, +10px, -10px, +10px, 0px)
3. Total duration: 250ms
4. Should only trigger when error occurs

---

### 5. LoadingSpinner
**Location**: `components/animations/GameAnimations.tsx`

**What it does**: Rotating activity indicator

**Test Steps**:
1. Start a new game (Sudoku, Minesweeper, or Word Search)
2. Observe the loading spinner during initialization
3. Spinner should rotate smoothly at 360°/second
4. Disappears after 300ms when game loads

---

### 6. VictoryAnimation
**Location**: `components/animations/GameAnimations.tsx`

**What it does**: Celebration overlay with scale and fade (visible when game is won)

**Test Steps**:
1. Complete a game
2. Observe scale animation (0 → 1.2 → 1.0) over 600ms
3. Fade-in should occur simultaneously (400ms)
4. Should display victory content

---

### 7. GameVictoryConfetti
**Location**: `components/animations/GameAnimations.tsx`

**What it does**: Confetti particle effects (2.3 second total animation)

**Test Steps**:
1. Complete a game (Sudoku, Minesweeper, or Word Search)
2. Observe confetti particles appear
3. Particles should fade in (300ms), hold (1500ms), then fade out (500ms)
4. Total duration: 2.3 seconds

---

## 🏠 Screen-Level Animations

### Home Screen
**File**: `screens/HomeScreen.tsx`

**Animations**:
- FadeInView wrapper (400ms fade-in on screen load)

**Test Steps**:
1. Navigate to home screen from another screen
2. Observe smooth fade-in of entire screen
3. Duration: 400ms
4. Content should slide up 20px while fading

---

### Profile Screen
**File**: `screens/ProfileScreen.tsx`

**Animations**:
- FadeInView wrapper (400ms fade-in on screen load)

**Test Steps**:
1. Navigate to profile screen
2. Observe smooth fade-in
3. Pull-to-refresh should still work
4. Duration: 400ms

---

### Settings Screen
**File**: `screens/SettingsScreen.tsx`

**Animations**:
- FadeInView wrapper (400ms fade-in on screen load)

**Test Steps**:
1. Navigate to settings screen
2. Observe smooth fade-in
3. All interactive elements should be accessible after fade
4. Duration: 400ms

---

## 🎮 Game Selector Animations

### Game Tiles
**File**: `components/Home/GameSelector/GameSelector.tsx`

**Animations**:
- Spring press animation on each game tile (scale: 0.95)

**Test Steps**:
1. On home screen, press any game tile
2. Observe tile scales down to 95% with spring physics
3. Release and observe spring back to 100%
4. Test all 10 game tiles
5. Spring config: damping 15, stiffness 150

---

## 🧩 Sudoku Game Animations

### File: `components/Home/Sudoku/SudokuGame.tsx` & `SudokuBoard.tsx`

### 1. Number Placement Animation
**What happens**: When placing a number, it pops in with scale and fade

**Test Steps**:
1. Start a Sudoku game
2. Select a number (1-9)
3. Tap an empty cell
4. Observe number scales from 0 to 1 with spring bounce
5. Simultaneously fades from 0 to 1 opacity (200ms)

---

### 2. Number Button Press
**What happens**: Number selection buttons have spring press feedback

**Test Steps**:
1. In Sudoku game, tap any number button (1-9)
2. Observe button scales to 90% on press
3. Springs back to 100% on release
4. Also test the backspace button
5. Spring feedback should feel responsive

---

### 3. Invalid Move Shake
**What happens**: Board shakes when invalid number is placed

**Test Steps**:
1. Try to place a duplicate number in same row/column/box
2. Observe entire board shakes horizontally
3. Shake sequence: 250ms total
4. Wrong count should increment

---

### 4. Victory Confetti
**What happens**: Confetti appears when puzzle is solved

**Test Steps**:
1. Complete a Sudoku puzzle
2. Observe confetti particles appear
3. Duration: 2.3 seconds
4. End game modal should appear after 500ms delay

---

### 5. Loading Spinner
**What happens**: Spinner shows during puzzle generation

**Test Steps**:
1. Start a new Sudoku game or change difficulty
2. Observe loading spinner for 300ms
3. Spinner should disappear when board loads
4. Board should fade in smoothly

---

## 💣 Minesweeper Game Animations

### File: `components/Home/MineSweeper/MineSweeperGame.tsx` & `Cell.tsx`

### 1. Cell Reveal Animation
**What happens**: Cells bounce when revealed

**Test Steps**:
1. Start Minesweeper game
2. Tap any cell to reveal it
3. Observe cell content scales to 110% then back to 100%
4. Spring animation with damping 15, stiffness 150

---

### 2. Flag Placement Animation
**What happens**: Flag icon pulses when placed or removed

**Test Steps**:
1. Long-press a cell to place flag
2. Observe flag scales to 120% then back to 100%
3. Long-press again to remove flag
4. Should animate on both placement and removal
5. Spring animation: damping 10, stiffness 200 (bouncy)

---

### 3. Mine Hit Shake
**What happens**: Board shakes when you hit a mine

**Test Steps**:
1. Click on a mine (you'll lose the game)
2. Observe board shakes horizontally
3. Shake duration: 250ms
4. Loss modal should appear

---

### 4. Victory Confetti
**What happens**: Confetti appears when you clear the board

**Test Steps**:
1. Successfully clear all non-mine cells
2. Observe confetti animation (2.3 seconds)
3. Victory modal should appear after 500ms delay

---

### 5. Loading Spinner
**What happens**: Spinner shows during board generation

**Test Steps**:
1. Start new game or change difficulty
2. Observe loading spinner for 300ms
3. Board should appear after loading

---

## 🔍 Word Search Game Animations

### File: `components/Home/WordSearch/WordSearchGame.tsx`

### 1. Victory Confetti
**What happens**: Confetti appears when all words are found

**Test Steps**:
1. Find all words in the puzzle
2. Observe confetti animation (2.3 seconds)
3. Victory modal should appear after 500ms

---

### 2. Loading Spinner
**What happens**: Spinner shows during grid generation

**Test Steps**:
1. Start new game or change difficulty
2. Observe loading spinner for 300ms
3. Grid should appear after loading

---

## 📱 Modal Animations

### SelectGame Modal
**File**: `components/Modals/SelectGame.jsx`

**Animations**:
- All buttons have spring press animation (scale: 0.95)

**Test Steps**:
1. From home screen, tap any game tile
2. Modal appears with game info
3. Test all buttons:
   - Difficulty selector button
   - Continue button
   - New Game button
   - Close button
4. Each should have spring press feedback
5. Open difficulty selector and test those buttons too

---

## 🎯 Animation Testing Summary

### Quick Test Sequence

1. **Home Screen** (30 seconds)
   - Navigate to home, observe fade-in
   - Press 3-4 game tiles, check spring animations

2. **Sudoku** (2 minutes)
   - Start new game, observe loading spinner
   - Place valid numbers, check pop-in animation
   - Try invalid move, check shake
   - Complete puzzle if possible, check confetti

3. **Minesweeper** (2 minutes)
   - Start new game, observe loading spinner
   - Click cells, check reveal bounce
   - Place/remove flags, check pulse
   - Hit mine or win, check shake/confetti

4. **Word Search** (1 minute)
   - Start new game, observe loading spinner
   - Find all words or complete puzzle
   - Check victory confetti

5. **Modals** (1 minute)
   - Open SelectGame modal from home
   - Test all button animations
   - Test difficulty selector

6. **Other Screens** (1 minute)
   - Navigate to Profile, check fade-in
   - Navigate to Settings, check fade-in

**Total Test Time**: ~7-8 minutes for complete coverage

---

## 🔧 Performance Verification

For each animation, verify:
- [ ] Runs at 60fps (smooth, no stuttering)
- [ ] No jank or frame drops
- [ ] Animation completes fully
- [ ] No memory leaks (test multiple times)
- [ ] Works on both iOS and Android (if applicable)

---

## 📊 Animation Specifications Reference

| Animation | Duration | Type | Config |
|-----------|----------|------|--------|
| Button Press | ~150ms | Spring | damping: 15, stiffness: 150 |
| FadeInView | 400ms | Timing | Linear |
| PulseView | 2000ms | Sequence | 1s up, 1s down |
| ShakeView | 250ms | Sequence | 5 steps, 50ms each |
| Loading Spinner | Continuous | Timing | 1s per rotation |
| Victory Animation | 600ms | Spring+Timing | Scale + Fade |
| Confetti | 2300ms | Sequence | 300ms in, 1500ms hold, 500ms out |
| Cell Reveal | ~300ms | Spring | damping: 15, stiffness: 150 |
| Flag Pulse | ~300ms | Spring | damping: 10, stiffness: 200 |
| Number Pop-in | 200ms | Spring+Timing | Scale + Fade |

---

## 🐛 Known Limitations

- Tests are currently snapshots, not interactive
- Accessibility preferences for reduced motion not yet implemented
- Some animations may need performance tuning on low-end devices

---

Last Updated: Based on commits through 038aa53
