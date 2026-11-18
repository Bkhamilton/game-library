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

#### 7. **2048** 🎲
A sliding tile puzzle where you combine numbered tiles to reach 2048.
- **Difficulty Levels**: Easy, Medium, Hard
- **Game Type**: Puzzle
- **Achievements**: 12+ including First Win, tile milestones, score achievements

#### 8. **Memory Match** 🃏
A card-flipping game where you match pairs of identical cards.
- **Difficulty Levels**: Easy, Medium, Hard
- **Game Type**: Memory Puzzle
- **Achievements**: 12+ including First Win, perfect matches, speed completions

#### 9. **Connect Four** 🔴🟡
Strategic two-player game where you drop colored discs to get four in a row.
- **Difficulty Levels**: Easy, Medium, Hard (AI Opponent)
- **Game Type**: Strategy/Board Game
- **Achievements**: In development (gameplay fully functional)

#### 10. **Simon Says** 🎨
Memory game where you repeat increasingly longer sequences of colored tiles.
- **Difficulty Levels**: Easy, Medium, Hard
- **Game Type**: Memory/Pattern Recognition
- **Achievements**: Partially implemented (gameplay fully functional)

### Games in Development

#### 11. **Dolphin Dive** 🐬
An endless runner where a dolphin dives underwater to build momentum for jumps.
- **Planned Difficulty Levels**: Easy, Hard
- **Game Type**: Action/Endless Runner
- **Status**: Early development - basic physics implemented, sprites and gameplay in progress

## 🚀 Planned Features

### Future Games (Roadmap)

The following games are planned for future releases:

**Phase 1 (Quick Wins) - COMPLETED:**
- ✅ Memory Match - Card-flipping memory game (Fully functional with achievements)
- ✅ Simon Says - Pattern memory game (Fully functional, achievements being perfected)
- ✅ 2048 - Popular tile-merging puzzle (Fully functional with achievements)

**Phase 2 (Medium Effort):**
- ✅ Connect Four - Strategic two-player game with AI (Fully functional, achievements planned)
- Tetris - Classic falling block game
- 🚧 Dolphin Dive - Endless runner with momentum mechanics (In development)

**Phase 3 (High Effort):**
- Solitaire (Klondike) - Classic card game
- Nonogram (Picross) - Picture logic puzzles

## 🏆 Achievement System

Game Library features a comprehensive achievement system with **124 total achievements** worth **6,745 points**!

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
- **Storage**: AsyncStorage
- **Animations**: 
  - react-native-reanimated (60fps native animations)
  - lottie-react-native (complex vector animations)
  - react-native-confetti-cannon (particle effects)

## 🎨 Animation System

Game Library features a comprehensive animation system for enhanced visual feedback:

- **Micro-interactions**: Button presses, card flips, tile reveals
- **Game-specific animations**: Number entries, tile reveals, word highlights
- **Success celebrations**: Confetti effects, victory animations
- **Visual feedback**: Error shakes, pulsing indicators, fade transitions
- **Performance optimized**: Native driver support for 60fps animations

See [Animation Documentation](docs/ANIMATION_LIBRARIES.md) for details.

## 📦 Installation

### Prerequisites

- Node.js 24.3 or later in the 24.x series and npm
- Expo Go with SDK 58 support for testing on a phone

### Setup

1. Clone the repository:
```bash
git clone https://github.com/Bkhamilton/game-library.git
cd game-library
```

2. Install dependencies:
```bash
npm ci
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
- **Achievement System**: 124 unique achievements across 6 categories
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
