# Connect Four Medium AI Implementation Update

## Overview

The Medium difficulty AI has been updated to use a reduced-depth MinMax algorithm instead of sharing the same algorithm as Hard difficulty. This creates a proper difficulty progression: Easy (simple blocking) → Medium (strategic but beatable) → Hard (nearly unbeatable).

## Implementation Date
October 13, 2025

## Status
✅ **COMPLETE** - Medium difficulty now uses shallow MinMax (depth 3)

## Problem Statement

Previously, both Medium and Hard difficulties used the same MinMax algorithm with depth 4-5, making them nearly identical in strength. The goal was to create a Medium difficulty that:
- Is smarter than Easy (which only blocks horizontal/vertical threats)
- Is more beatable than Hard (which looks 4-5 moves ahead)
- Provides an intermediate challenge (30-50% player win rate target)

## Solution: Reduced-Depth MinMax

### Algorithm Choice
Medium AI uses the **same MinMax algorithm with Alpha-Beta pruning** as Hard, but with a **fixed shallow depth of 3**.

### Why Depth 3?
- **Depth 1-2**: Too shallow, barely better than Easy AI
- **Depth 3**: Good balance - strategic but can be tricked with multi-move setups
- **Depth 4-5**: Hard difficulty - looks far enough ahead to be nearly unbeatable

## Medium AI Strategy

### 1. Priority Order
The Medium AI makes decisions in the following priority order:

1. **Opening Move**: Prefers center column (column 3) for strategic advantage
2. **Take Winning Moves**: If the AI can win immediately, it will do so
3. **Block Opponent Wins**: Blocks horizontal, vertical, AND diagonal winning threats
4. **Strategic MinMax**: Uses MinMax (depth 3) to evaluate all valid moves and select the best

### 2. Threat Detection
Unlike Easy AI which only blocks simple horizontal/vertical threats, Medium AI:
- ✅ Blocks horizontal winning threats
- ✅ Blocks vertical winning threats
- ✅ Blocks diagonal winning threats
- ✅ Uses strategic planning (looks 3 moves ahead)
- ❌ Doesn't look as far ahead as Hard AI (can be tricked with 4+ move setups)

### 3. Strategic Depth Comparison

| Difficulty | Algorithm | Depth | Characteristics |
|-----------|-----------|-------|----------------|
| Easy | Simple blocking + random | 0 | Only blocks obvious threats |
| Medium | MinMax + Alpha-Beta | 3 | Strategic but beatable |
| Hard | MinMax + Alpha-Beta | 4-5 | Nearly unbeatable |

## Code Implementation

### Key Function

```typescript
// Medium AI: uses MinMax with reduced depth for intermediate difficulty
const getMediumAIMove = (board: Board): number => {
    const validMoves = getValidMoves(board);
    
    if (validMoves.length === 0) {
        return -1; // No valid moves
    }
    
    // Opening move - prefer center column
    const totalMoves = ROWS * COLS - validMoves.length;
    if (totalMoves <= 1) {
        const centerCol = Math.floor(COLS / 2);
        if (validMoves.includes(centerCol)) {
            return centerCol;
        }
    }
    
    // Check for immediate winning move
    for (const col of validMoves) {
        const newBoard = placeDisc(board, col, 'ai');
        if (newBoard && checkWinner(newBoard) === 'ai') {
            return col;
        }
    }
    
    // Check for blocking opponent's winning move
    for (const col of validMoves) {
        const newBoard = placeDisc(board, col, 'player');
        if (newBoard && checkWinner(newBoard) === 'player') {
            return col;
        }
    }
    
    // Use MinMax with reduced depth (3) for medium difficulty
    // This makes it strategic but beatable
    const depth = 3;
    
    // Use MinMax to find best move
    let bestScore = -Infinity;
    let bestCol = validMoves[0];
    
    for (const col of validMoves) {
        const newBoard = placeDisc(board, col, 'ai');
        if (newBoard) {
            const score = minimax(newBoard, depth - 1, -Infinity, Infinity, false);
            if (score > bestScore) {
                bestScore = score;
                bestCol = col;
            }
        }
    }
    
    return bestCol;
};
```

## Difficulty Routing

The `getAIMove` function now routes to three different strategies:

```typescript
export const getAIMove = (board: Board, difficulty: Difficulty = 'Medium'): number => {
    // Use easy AI for Easy difficulty
    if (difficulty === 'Easy') {
        return getEasyAIMove(board);
    }
    
    // Use medium AI for Medium difficulty
    if (difficulty === 'Medium') {
        return getMediumAIMove(board);
    }
    
    // Use advanced AI for Hard difficulty (depth 4-5)
    // ... existing Hard AI logic
}
```

## Test Coverage

### New Tests for Medium AI (6 tests added)

1. ✅ Returns valid column number
2. ✅ Takes immediate winning move
3. ✅ Blocks opponent winning move
4. ✅ Blocks diagonal threats (unlike Easy AI)
5. ✅ Prefers center column for opening move
6. ✅ Returns -1 when no valid moves available

### New Tests for Hard AI (5 tests added)

1. ✅ Returns valid column number
2. ✅ Takes immediate winning move
3. ✅ Blocks opponent winning move
4. ✅ Prefers center column for opening move
5. ✅ Returns -1 when no valid moves available

### Total Test Coverage
- **53 tests total**, all passing
- 42 original tests + 11 new difficulty-specific tests

## Performance Characteristics

### Time Complexity by Difficulty

| Difficulty | Depth | Nodes Evaluated (worst case) | Typical Time |
|-----------|-------|------------------------------|-------------|
| Easy | 0 | ~7 (just valid moves) | <1ms |
| Medium | 3 | ~7^3 = ~343 | <10ms |
| Hard | 4-5 | ~7^4 to 7^5 = ~2,401-16,807 | <100ms |

### Memory Usage
All difficulties use the same memory-efficient board representation with immutable copies.

## Player Experience

### Expected Win Rates (estimated)

| Difficulty | Player Win Rate | AI Characteristics |
|-----------|----------------|-------------------|
| Easy | 60-80% | Beatable with diagonal strategies |
| Medium | 30-50% | Requires planning but is beatable |
| Hard | <10% | Nearly unbeatable, requires expert play |

### Gameplay Feel

- **Easy**: Good for beginners, AI makes obvious mistakes
- **Medium**: Challenging but fair, AI thinks ahead but can be outsmarted
- **Hard**: Expert challenge, AI rarely makes mistakes

## Comparison with Other Difficulties

| Feature | Easy | Medium | Hard |
|---------|------|--------|------|
| Algorithm | Simple blocking + random | MinMax (depth 3) | MinMax (depth 4-5) |
| Blocks horizontal threats | ✅ | ✅ | ✅ |
| Blocks vertical threats | ✅ | ✅ | ✅ |
| Blocks diagonal threats | ❌ | ✅ | ✅ |
| Strategic planning | ❌ | ✅ (3 moves) | ✅ (4-5 moves) |
| Multi-move ahead thinking | ❌ | Limited | Extensive |
| Expected player winrate | 60-80% | 30-50% | <10% |

## Usage

Players can select difficulty when starting a game:
- Select **"Easy"** for beginners or casual play
- Select **"Medium"** for an intermediate challenge
- Select **"Hard"** for expert-level AI opponents

The AI automatically uses the appropriate strategy based on the selected difficulty.

## Benefits of This Approach

1. **Clear Progression**: Each difficulty level is noticeably different in strength
2. **Code Reuse**: Medium and Hard share the same MinMax algorithm, just different depths
3. **Maintainable**: Easy to adjust difficulty by changing the depth constant
4. **Efficient**: Medium AI is faster than Hard while still being strategic
5. **Balanced**: Medium provides a good challenge for intermediate players

## Future Enhancements

Possible improvements for Medium AI:
- Dynamic depth adjustment based on board complexity
- Occasional random moves to add unpredictability (5-10% chance)
- Adaptive difficulty that adjusts based on player skill
- Time-based depth limits for consistent performance

## Conclusion

The Medium AI implementation successfully fills the gap between Easy and Hard difficulties. By using MinMax with reduced depth, it provides strategic gameplay that is challenging but beatable, creating a proper difficulty curve for all player skill levels.
