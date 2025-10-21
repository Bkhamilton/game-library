# Sudoku Visual Highlight Enhancement

## Summary
This update improves the visual feedback when a square is selected in the Sudoku game. When a player selects a cell, not only is that cell highlighted, but all cells in the same row and column now receive a dimmer highlight to help players easily identify which spaces are affected by their selection.

## Visual Changes

### Before
- Only the selected cell was highlighted with the theme's secondary color
- Other cells remained unhighlighted

### After
- **Selected cell**: Highlighted with full opacity using the theme's secondary color
- **Same row/column cells**: Highlighted with 30% opacity using the theme's secondary color
- **Other cells**: Remain unhighlighted

## Implementation Details

### Code Changes
**File**: `components/Home/Sudoku/SudokuBoard.tsx`

1. **Added helper function** `hexToRgba()`:
   - Converts hex color codes to RGBA format with specified opacity
   - Allows for semi-transparent background colors without affecting text opacity

2. **Enhanced `getCellStyle()` function**:
   - Added logic to detect if a cell is in the same row or column as the selected cell
   - Applied dimmer background color (30% opacity) to row/column cells
   - Maintained full opacity for the selected cell itself

### Example Behavior
```
If cell at position (4, 4) is selected:

Legend:
[X] = Selected cell (full highlight)
[·] = Row/column cell (dim highlight)
[ ] = Other cell (no highlight)

  0 1 2 3 4 5 6 7 8
0 [ ][ ][ ][ ][·][ ][ ][ ][ ]
1 [ ][ ][ ][ ][·][ ][ ][ ][ ]
2 [ ][ ][ ][ ][·][ ][ ][ ][ ]
3 [ ][ ][ ][ ][·][ ][ ][ ][ ]
4 [·][·][·][·][X][·][·][·][·]
5 [ ][ ][ ][ ][·][ ][ ][ ][ ]
6 [ ][ ][ ][ ][·][ ][ ][ ][ ]
7 [ ][ ][ ][ ][·][ ][ ][ ][ ]
8 [ ][ ][ ][ ][·][ ][ ][ ][ ]
```

## Theme Compatibility
The implementation uses the theme's secondary color, ensuring compatibility with all available themes:
- Light theme: `#6db36b` (green)
- Dark theme: `#112921` (dark green)
- Retro theme: `#F7931E` (orange)
- Nature theme: `#4A7C2E` (forest green)
- Neon theme: `#00FFFF` (cyan)

## Testing
- ✅ All existing Sudoku generator tests pass
- ✅ New visual highlighting logic tests added and passing
- ✅ CodeQL security check passed with no issues
- ✅ No regressions in existing functionality

## User Benefits
1. **Improved spatial awareness**: Easier to see which cells are in the same row/column
2. **Better decision making**: Visual cues help identify affected spaces when placing numbers
3. **Enhanced UX**: More intuitive gameplay without overwhelming visual noise
4. **Accessible**: Clear differentiation between selected cell and affected cells
