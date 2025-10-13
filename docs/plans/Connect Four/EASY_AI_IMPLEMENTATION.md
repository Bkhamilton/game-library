# Connect Four Easy AI Implementation

## Overview

The Easy AI difficulty has been implemented to provide a more beatable opponent for beginner players. Unlike the Medium and Hard difficulties which use MinMax algorithm with Alpha-Beta pruning, the Easy AI uses a simpler strategy that makes it much easier to defeat while still preventing the most obvious losses.

## Easy AI Strategy

### 1. Priority Order

The Easy AI makes decisions in the following priority order:

1. **Take Winning Moves**: If the AI can win immediately by placing a disc, it will do so
2. **Block Simple Threats**: Block horizontal and vertical 3-in-a-row threats from the player
3. **Random Moves**: Otherwise, make a random move with slight preference for center columns

### 2. Threat Detection

The Easy AI **only** detects and blocks:
- ✅ Horizontal 3-in-a-row threats (consecutive player pieces in a row)
- ✅ Vertical 3-in-a-row threats (consecutive player pieces in a column)
- ❌ Diagonal threats (NOT blocked by Easy AI)
- ❌ Complex multi-threat situations

This limited blocking makes the AI much more beatable, as players can win using diagonal strategies.

### 3. Random Move Selection

When no immediate win or simple threat exists:
- 40% chance to prefer center columns (columns 2, 3, 4)
- 60% chance to pick any random valid column
- This adds unpredictability while maintaining some strategic awareness

## Code Implementation

### Key Functions

```typescript
// Easy AI entry point
const getEasyAIMove = (board: Board): number => {
    // 1. Check for winning moves
    // 2. Block simple threats
    // 3. Make random move
}

// Finds horizontal and vertical threats to block
const findSimpleBlockingMove = (board: Board, validMoves: number[]): number | null => {
    // Checks horizontal windows
    // Checks vertical windows
    // Returns column to block, or null if no threats
}
```

## Difficulty Routing

The `getAIMove` function now routes based on difficulty:

```typescript
export const getAIMove = (board: Board, difficulty: Difficulty = 'Medium'): number => {
    if (difficulty === 'Easy') {
        return getEasyAIMove(board);
    }
    // Medium and Hard use MinMax algorithm
    // ... existing advanced AI logic
}
```

## Test Coverage

### New Tests for Easy AI (8 tests added)

1. ✅ Returns valid column number
2. ✅ Takes immediate winning move
3. ✅ Blocks horizontal 3-in-a-row threat
4. ✅ Blocks vertical 3-in-a-row threat
5. ✅ Does NOT block diagonal threats
6. ✅ Makes random moves when no threats exist
7. ✅ Blocks threats in middle of board (not just edges)
8. ✅ Returns -1 when no valid moves available

### Total Test Coverage
- **42 tests total**, all passing
- 34 original tests + 8 new Easy AI tests

## Player Experience

### Expected Winrate
Players who understand Connect Four should have a **high winrate** (60-80%+) against Easy AI:
- Players can win using diagonal strategies
- Players can set up multi-threat situations
- AI makes random moves that may not be optimal

### What Easy AI Prevents
- Simple horizontal wins (3 in a row → 4 in a row)
- Simple vertical wins (3 in a column → 4 in a column)
- Immediate losses in obvious situations

### What Easy AI Doesn't Prevent
- Diagonal wins
- Complex tactical setups
- Multi-threat situations (where blocking one threat exposes another)
- Strategic column control

## Comparison with Other Difficulties

| Feature | Easy | Medium | Hard |
|---------|------|--------|------|
| Algorithm | Simple blocking + random | MinMax (depth 4-5) | MinMax (depth 4-5) |
| Blocks horizontal threats | ✅ | ✅ | ✅ |
| Blocks vertical threats | ✅ | ✅ | ✅ |
| Blocks diagonal threats | ❌ | ✅ | ✅ |
| Strategic planning | ❌ | ✅ | ✅ |
| Multi-move ahead thinking | ❌ | ✅ | ✅ |
| Expected player winrate | 60-80% | 10-20% | <5% |

## Usage

Players can select difficulty when starting a game:
- Select "Easy" for beginners or casual play
- Select "Medium" or "Hard" for challenging AI opponents

The AI automatically uses the appropriate strategy based on the selected difficulty.

## Future Enhancements

Possible improvements for Easy AI:
- Add occasional "mistake" probability (random bad moves)
- Reduce center column preference
- Add slight delay variation to make AI feel more human-like
- Track player skill and adjust difficulty dynamically
