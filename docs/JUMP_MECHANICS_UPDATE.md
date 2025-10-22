# OstrichHaul Jump Mechanics Update

## Summary
Updated the OstrichHaul game jumping mechanic to support variable jump heights based on how long the screen is held down, with a gliding effect when the button is held at peak height.

## Changes Made

### 1. **Touch Input Handling**
- Changed from `onPress` to `onPressIn` and `onPressOut` events
- `onPressIn`: Initiates the jump when the screen is first touched
- `onPressOut`: Stops applying upward force and ends glide mode when touch is released

### 2. **Game State Enhancement**
Added `isHolding` boolean to the `GameState` interface to track when the player is holding down the screen.

### 3. **Jump Mechanics**

#### **Variable Jump Height**
- **Light Tap**: When the player quickly taps the screen, the ostrich receives an initial upward velocity (`jumpVelocity = -15`) and then immediately falls back down with normal gravity. This results in a small jump.
  
- **Holding Down**: When the player holds down the screen:
  - The ostrich starts with the same initial velocity
  - While `isHolding` is true and the ostrich is still moving upward (`velocity < 0`), the game continues to apply upward force up to `maxJumpVelocity = -18`
  - This allows the ostrich to jump up to a maximum height of 250 pixels from the ground
  - Once the player releases, normal gravity takes over

#### **Gliding Mechanic**
When the player holds down the screen while the ostrich is falling (velocity > 0):
- Reduced gravity of `0.3` is applied instead of the normal `1.0`
- This creates a gliding effect where the ostrich falls more slowly
- Allows for more control during descent

### 4. **Updated Constants**
Added new physics constants in `constants.ts`:
```typescript
maxJumpVelocity = -18      // Maximum upward velocity when holding
minJumpHeight = 50         // Minimum jump height for a tap
maxJumpHeight = 250        // Maximum jump height when holding
glideGravity = 0.3         // Reduced gravity when gliding down
```

### 5. **Gravity Calculation Update**
Enhanced the `calculateGravity()` function in `utils.ts`:
- Now takes an additional `isHolding` parameter
- Prioritizes glide gravity when holding and falling
- Returns `0.3` (glide gravity) when `isHolding` is true and velocity is positive

## How It Works

### Jump Flow:
1. **Player presses screen** → `handlePressIn()` is called
   - Sets `isJumping = true`
   - Sets `isHolding = true`
   - Applies initial upward velocity

2. **While holding and rising** (velocity < 0, jumped height < 250):
   - Game loop continues to apply upward force
   - Velocity is capped at `maxJumpVelocity` for sustained lift
   - Ostrich continues rising to maximum height

3. **Player releases screen** → `handlePressOut()` is called
   - Sets `isHolding = false`
   - Normal gravity takes over immediately

4. **While holding and falling** (velocity > 0):
   - Glide gravity (0.3) is applied
   - Ostrich descends slowly in a controlled glide

5. **Ostrich lands** → `isJumping = false`, ready for next jump

## Testing
Created unit tests in `components/__tests__/OstrichHaul-utils-test.js` to verify:
- Normal gravity behavior when not holding
- Glide gravity when holding and falling
- Peak gravity behavior remains unchanged
- Glide gravity takes priority over peak gravity when both conditions are met

## Expected Behavior
- **Quick Tap**: Small hop off the ground (~50-100 pixels)
- **Brief Hold**: Medium jump (~100-150 pixels)
- **Full Hold**: Maximum height jump (~250 pixels) with gliding descent
- **Variable Control**: Players can fine-tune jump height and landing by controlling hold duration

## Files Modified
1. `components/Home/OstrichHaul/types.ts` - Added `isHolding` to GameState
2. `components/Home/OstrichHaul/constants.ts` - Added jump/glide constants
3. `components/Home/OstrichHaul/utils.ts` - Updated `calculateGravity()` function
4. `components/Home/OstrichHaul/OstrichHaulGame.tsx` - Main game loop and input handling
5. `components/__tests__/OstrichHaul-utils-test.js` - New unit tests (created)
