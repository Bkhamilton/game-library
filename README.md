# 🎮 Game Library

A comprehensive mobile game collection built with React Native and Expo, featuring classic puzzle games, action games, and a robust achievement system.

## 📱 About

Game Library is a mobile application that brings together a diverse collection of classic and modern games in one place. Each game offers multiple difficulty levels and contributes to an extensive achievement system, providing hours of engaging gameplay and progression tracking.

## 🎯 Current Games

### Fully Functional Games

#### 1. **Sudoku** 🔢
A logic-based number placement puzzle where you fill a 9×9 grid with numbers 1-9.
- **Difficulty Levels**: Easy, Medium, Hard, Extreme
- **Game Type**: Logic Puzzle
- **Achievements**: 12+ including First Win, win streaks, difficulty mastery

#### 2. **Minesweeper** 💣
Clear a board containing hidden mines without detonating any of them.
- **Difficulty Levels**: Easy, Medium, Hard, Extreme
- **Game Type**: Logic Puzzle
- **Achievements**: 12+ including First Win, perfect clears, speed completions

#### 3. **Word Search** 🔍
Find hidden words in a grid of letters in any direction.
- **Difficulty Levels**: Easy, Medium, Hard
- **Game Type**: Word Puzzle
- **Achievements**: 12+ including First Win, no hint completions, time challenges

#### 4. **Crossword** 📝
Classic word puzzle with intersecting words based on clues.
- **Difficulty Levels**: Easy, Medium, Hard
- **Game Type**: Word Puzzle
- **Achievements**: 12+ including First Win, perfect games, mastery tiers

#### 5. **Ostrich Haul** 🦅
An action game where you control an ostrich jumping over obstacles.
- **Difficulty Levels**: Easy, Hard
- **Game Type**: Action/Arcade
- **Achievements**: 10+ including high score milestones, win streaks

#### 6. **GoGoBird** 🐦
Navigate a bird through obstacles in this fast-paced action game.
- **Difficulty Levels**: Easy, Hard
- **Game Type**: Action/Arcade
- **Achievements**: 10+ including high score milestones, skill challenges

### Games in Development

#### 7. **2048** 🎲
A sliding tile puzzle where you combine numbered tiles to reach 2048.
- **Planned Difficulty Levels**: Easy, Medium, Hard
- **Game Type**: Puzzle
- **Status**: Partially implemented

#### 8. **Memory Match** 🃏
A card-flipping game where you match pairs of identical cards.
- **Planned Difficulty Levels**: Easy, Medium, Hard
- **Game Type**: Memory Puzzle
- **Status**: Partially implemented

## 🚀 Planned Features

### Future Games (Roadmap)

The following games are planned for future releases:

**Phase 1 (Quick Wins):**
- ✅ Memory Match - Card-flipping memory game
- Simon Says - Pattern memory game
- ✅ 2048 - Popular tile-merging puzzle

**Phase 2 (Medium Effort):**
- Connect Four - Strategic two-player game with AI
- Tetris - Classic falling block game

**Phase 3 (High Effort):**
- Solitaire (Klondike) - Classic card game
- Nonogram (Picross) - Picture logic puzzles

## 🏆 Achievement System

Game Library features a comprehensive achievement system with **73 total achievements** worth **3,805 points**!

### Achievement Categories

1. **Completion Achievements** (24 total)
   - First wins for each game
   - Multi-tier progression (5, 25, 50, 100, 250 wins)
   - Game mastery milestones

2. **Score Achievements** (16 total)
   - High score milestones
   - Point thresholds for action games
   - Score progression tiers

3. **Skill Achievements** (8 total)
   - Perfect games (no mistakes)
   - No hints completions
   - Special skill challenges

4. **Time-Based Achievements** (4 total)
   - Speed completions
   - Beat the clock challenges
   - Time trial victories

5. **Streak Achievements** (8 total)
   - Win streaks (3, 5, 10, 20 consecutive wins)
   - Game-specific streaks
   - Consistency rewards

6. **Collection Achievements** (13 total)
   - Play all games
   - Master all difficulty levels
   - Point milestones (1,000, 2,500, 5,000 points)
   - Achievement unlock milestones (10, 25, 50 achievements)

### Achievement Tiers

- **Bronze** (10 points) - Entry level achievements
- **Silver** (25 points) - Intermediate milestones
- **Gold** (50 points) - Advanced accomplishments
- **Platinum** (100 points) - Expert achievements
- **Diamond** (200 points) - Elite mastery

## 🛠️ Technology Stack

- **Framework**: React Native with Expo
- **Language**: JavaScript/TypeScript
- **Database**: SQLite (expo-sqlite)
- **State Management**: React Context API
- **Navigation**: Expo Router
- **Game Engine**: react-native-game-engine
- **Physics**: matter-js (for action games)
- **Storage**: AsyncStorage

## 📦 Installation

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Expo CLI

### Setup

1. Clone the repository:
```bash
git clone https://github.com/Bkhamilton/game-library.git
cd game-library
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

4. Run on your device:
   - **iOS**: Press `i` or scan QR code with Camera app
   - **Android**: Press `a` or scan QR code with Expo Go app
   - **Web**: Press `w` to open in browser

## 🎮 How to Play

1. Launch the app and select a game from the home screen
2. Choose your preferred difficulty level
3. Play the game and try to achieve high scores
4. Unlock achievements by completing challenges
5. Track your progress in the achievements section

## 📊 Game Statistics

The app tracks comprehensive statistics for each game:
- Games played
- Win/loss records
- High scores
- Time records
- Difficulty-specific performance
- Achievement progress

## 🎨 Features

- **Multiple Difficulty Levels**: Each game offers 2-4 difficulty settings
- **Achievement System**: 73 unique achievements across 6 categories
- **Progress Tracking**: SQLite database stores all game statistics
- **Responsive Design**: Optimized for various screen sizes
- **Dark/Light Mode**: Automatic UI style based on system preferences
- **Offline Play**: All games work without internet connection

## 📄 License

This project is private and proprietary.

## 👤 Developer

Developed by Hamilton Development

## 📞 Support

For support, please refer to [SUPPORT.md](SUPPORT.md)

For privacy information, see [PRIVACY.md](PRIVACY.md)

## 🔄 Version

Current Version: 1.0.0

---

*Built with ❤️ using React Native and Expo*
