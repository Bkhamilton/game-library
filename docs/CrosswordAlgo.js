/* DESCRIPTION

This is where I will be writing down the algorithm for the crossword puzzle.

CROSSWORD PUZZLE ALGORITHM

1. **Initialize Grid:** Create a 15x15 grid of empty strings.
2. **Place First Word:**
   - Select a random long word from the word bank
   - Place it horizontally/vertically near the center (to maximize expansion).
3. **Iterative Placement:**
   - **Step A:** Identify all "viable" intersections on the board:
     - A character is viable if it has space in the perpendicular direction (e.g., for a horizontal word, check vertical space).
   - **Step B:** For each viable intersection:
     - Collect words from the bank that:
       - Contain the intersecting character.
       - Are not already placed.
       - Fit within grid bounds when placed perpendicularly.
   - **Step C:** Attempt to place a word:
     - Validate:
       - All non-intersecting cells are empty.
       - Adjacent cells (non-diagonal, outside the new word’s direction) are empty.
       - Direction is perpendicular to the existing word.
     - If valid, place the word and repeat from Step A.
   - **Step D:** If no words fit, backtrack (remove the last placed word) or retry with a new intersection (limit retries).
4. **Termination:**
   - Stop when a target number of words are placed, or no more valid placements exist.


### **Additional Notes**
- **Testing:** Start with small grids (e.g., 5x5) and a tiny word bank to debug.
- **Optimization:** Use a word bank sorted by length (longest first) and track placed words’ positions/directions.
- **UI:** Ensure the React Native grid updates dynamically as words are placed.

*/