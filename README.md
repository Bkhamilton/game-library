# 🎮 Game Library

A mobile puzzle and strategy collection built with React Native and Expo.

## 📱 About

Game Library is being refined into a cohesive, ad-free puzzle collection, with Sudoku as the quality reference for its theme, feedback, and animations.

See the [current-app backlog](docs/BACKLOG.md) for prioritized correctness, session,
accessibility, achievement, and release work. New games and SDK modernization are
outside that backlog's scope.

## 🎯 Current Games

### Current Puzzle and Strategy Games

The eight games below remain in the catalog. Known defects and validation gaps
are tracked in the [backlog](docs/BACKLOG.md).

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

#### 5. **2048** 🎲
A sliding tile puzzle where you combine numbered tiles to reach 2048.
- **Difficulty Levels**: Easy, Medium, Hard
- **Game Type**: Puzzle
- **Achievements**: 12+ including First Win, tile milestones, score achievements

#### 6. **Memory Match** 🃏
A card-flipping game where you match pairs of identical cards.
- **Difficulty Levels**: Easy, Medium, Hard
- **Game Type**: Memory Puzzle
- **Achievements**: 12+ including First Win, perfect matches, speed completions

#### 7. **Connect Four** 🔴🟡
Strategic two-player game where you drop colored discs to get four in a row.
- **Difficulty Levels**: Easy, Medium, Hard (AI Opponent)
- **Game Type**: Strategy/Board Game
- **Achievements**: In development (gameplay fully functional)

#### 8. **Simon Says** 🎨
Memory game where you repeat increasingly longer sequences of colored tiles.
- **Difficulty Levels**: Easy, Medium, Hard
- **Game Type**: Memory/Pattern Recognition
- **Achievements**: Partially implemented (gameplay fully functional)

### Preserved Arcade Code (Not Displayed)

GoGoBird, Ostrich Haul, and Dolphin Dive are hidden from the home catalog,
achievement filters, and arcade-specific achievement previews. Their source,
routes, assets, saved records, and earned points are retained. Direct routes are
not disabled. Arcade completion and new game additions are not part of the
current release backlog.

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

## Read-only audit agents

Two repository-local Copilot custom agents support product planning:

- [UI & Experience Auditor](.github/agents/ui-experience-auditor.agent.md):
  visual identity, usability, accessibility, and consistency across games.
- [Product & Content Auditor](.github/agents/product-content-auditor.agent.md):
  distinctive player value, content depth, progression, and a focused release
  strategy rather than extra complexity.

Open this repository in VS Code with Copilot and select either reviewer from the
agent picker in a new chat. If missing, check **Chat: Open Customizations > Agents**
and confirm that the profile is discovered without errors.

Example requests:

- UI reviewer: "Audit the app's visual identity and user experience. Use the
  attached screenshots alongside the code, distinguish polish from
  differentiation, and recommend the highest-impact changes."
- Product reviewer: "Audit the implemented games and progression against the
  existing plans. Recommend a coherent differentiation direction and a focused
  first release. Here is the App Review rejection text: ..."

Supply screenshots or supported recordings of key flows, or captures from an
already-running preview, for visual review. Without them, visual conclusions are
provisional and source-based. The reviewers cannot launch or operate the app.
Both allow only reading, searching, and public web research, not editing,
terminal execution, or delegation. Check the host's effective tool permissions
before use; enforcement varies across Copilot hosts.

Reports stay in chat. SDK modernization is excluded, and no recommendation
guarantees App Store approval. Run the actual audits separately after setup.

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
