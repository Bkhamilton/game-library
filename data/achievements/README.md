# Achievements Directory

This directory contains achievement definitions split by game for better organization and maintainability.

## Structure

Each file contains achievements for a specific game or category:

- **sudoku.json** - 10 Sudoku achievements (IDs: 1, 101-105, 701-703)
- **minesweeper.json** - 10 Minesweeper achievements (IDs: 2, 201-205, 801-803)
- **word-search.json** - 10 Word Search achievements (IDs: 3, 301-305, 901-903)
- **crossword.json** - 10 Crossword achievements (IDs: 4, 401-405, 1001-1003)
- **ostrich-haul.json** - 8 Ostrich Haul achievements (IDs: 5, 501-504, 1101-1103)
- **gogobird.json** - 8 GoGoBird achievements (IDs: 6, 601-604, 1201-1203)
- **2048.json** - 17 2048 achievements (IDs: 7, 1501-1516)
- **general.json** - 17 general achievements (IDs: 1301-1413)
  - Includes: Streaks, Collections, and Meta achievements

**Total: 90 achievements**

## Achievement Schema

Each achievement follows this structure:

```json
{
  "id": 1,
  "title": "Achievement Title",
  "description": "Achievement description",
  "tier": "Bronze|Silver|Gold|Platinum|Diamond",
  "points": 10,
  "icon": "trophy",
  "category": "Completion|Score|Skill|Time-Based|Streak|Collection",
  "criteria": {
    "game": "Game Name (optional)",
    "metric": "result|highScore|time|etc",
    "threshold": 1,
    "operator": "less_than (optional)"
  }
}
```

## Loading

These files are loaded in `api/startup.js` and combined into a single array before being inserted into the database during app initialization.

## Adding New Achievements

1. Add the achievement to the appropriate game file
2. Ensure the ID is unique across all files
3. Follow the existing schema structure
4. Update this README with the new count if needed
