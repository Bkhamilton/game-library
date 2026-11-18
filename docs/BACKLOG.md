# Puzzle Library backlog

## Product direction and scope

Build a cohesive, ad-free puzzle and strategy collection. Use Sudoku's existing
theme, feedback, and animations as the quality reference; preserve what already
works rather than imposing a different visual identity.

The current release scope contains eight games: Sudoku, Minesweeper, Word Search,
Crossword, 2048, Memory Match, Simon Says, and Connect Four.

GoGoBird, Ostrich Haul, and Dolphin Dive are removed from the home catalog and
arcade-specific achievement displays. Keep their code, routes, assets, database
rows, scores, and earned points. This is a presentation change, not deletion or
a deep-link access restriction.

Excluded from this backlog:

- New games, including Nonograms, Bridges, Reversi, and Killer Sudoku.
- Arcade gameplay/art improvements and a separate arcade app.
- A mandatory cross-game expedition, shared-resource mechanic, or campaign.
- SDK/dependency modernization, handled separately.
- Ads, online accounts, multiplayer services, and monetization changes.

More games, more achievements, or a new theme do not guarantee App Store approval.
The release needs reliable gameplay, cohesive presentation, meaningful existing
features, and an evidence-based response to the actual similarity rejection.

## How to use this backlog

This consolidates the two source-only audits and follow-up inspection. It is not
a claim that every possible defect has been discovered. No device playthrough,
rendered accessibility assessment, performance measurement, or generated-puzzle
sampling was performed during the audits.

Each item has a stable ID, priority, evidence classification, acceptance criteria,
and prerequisites. All items are **Open** unless explicitly marked otherwise.
References identify implementation starting points, not necessarily every file
an eventual fix must touch.

| Priority | Meaning |
| --- | --- |
| P0 | Fix before release: incorrect outcomes, invalid content, or risk to saved progress. |
| P1 | Release-quality baseline: trustworthy sessions, achievements, UX, accessibility, and submission evidence. |
| P2 | Follow-up improvement or product decision; not automatically a release blocker. |

| Evidence | Meaning |
| --- | --- |
| Confirmed source defect | A concrete problematic path or mismatch exists in inspected code; runtime frequency is not established. |
| Source gap | Required behavior is absent or inconsistently represented in inspected code. |
| Validation task | A risk to exercise on-device or with tests; not an assertion that the behavior is broken. |
| Product decision / improvement | A choice or enhancement to existing capabilities, not a confirmed defect. |

Do not treat dependencies as a requirement to build a large framework. Prefer
existing components and small shared helpers. Define behavior before changing
scoring, retries, difficulty, daily rules, or legacy achievement totals.

## 1. Release scope and preserved arcade content

### CAT-01 - Hide arcade games without deleting work

**P1 | Source gap | Status: Implemented; device confirmation tracked by QA-02**

- **Evidence:** The database-backed selector previously displayed all seeded
  games, including existing installations' arcade rows.
- **Acceptance:** Home lists only the eight puzzle/strategy games. Full
  achievements, game filters, and profile previews exclude arcade-specific
  entries. Filtering applies to stored rows, not just fresh-install seed data.
  Keep arcade code, routes, assets, records, and earned points unchanged.
- **Boundary:** Retained routes can still be opened directly and hidden code
  can remain in the binary. This is not a remedy for a binary-similarity concern.
  Generic all-time totals remain historical; collection-goal eligibility is
  separate work.
- **References:** [Visibility policy](../utils/gameVisibility.ts),
  [home selector](../components/Home/GameSelector/GameSelector.tsx),
  [achievement data](../hooks/useAchievementData.ts),
  [profile preview](../components/Profile/ProfilePage/ProfileAchievements.tsx).
- **Dependencies:** None.

### CAT-02 - Align collection goals with the puzzle-only release

**P1 | Product decision / improvement**

- **Issue:** Existing general/collection goals and lifetime totals need an
  explicit policy now that some games are hidden. Hiding cards must not leave
  new players needing unavailable games or silently revoke existing rewards.
- **Acceptance:** Review every visible collection goal against the active eight
  games. No new goal requires hidden games. Document and test whether legacy
  points remain all-time totals or are separately labeled; preserve earned
  history and migrate definitions without duplicate awards.
- **References:** [General achievements](../data/achievements/general.json),
  [achievement tracker](../db/Achievements/AchievementTracker.js),
  [profile statistics](../components/Profile/ProfilePage/ProfileStats.tsx).
- **Dependencies:** CAT-01, ACH-01, ACH-02, STAT-01.

## 2. Database safety and explicit failures

### DATA-01 - Bootstrap the SQLite database without destructive setup

**P0 | Confirmed source risk | Status: Implemented; device confirmation tracked by QA-02**

- **Original risk:** A missing AsyncStorage first-launch flag could drop and
  recreate tables in an existing SQLite file.
- **First-release behavior:** On version 0, create the schema and add missing
  default records in one transaction. Record completion in SQLite's
  `user_version`. Reuse compatible development data and stable IDs; never
  reset the database from startup. If setup fails, roll back and surface the
  error before opening the app.
- **Scope:** This establishes schema version 1. Future schema or seed
  changes should use an explicit upgrade; legacy migrations and ongoing
  seed synchronization are not part of this first-release setup.
- **References:** [Database startup](../api/startup.js),
  [SQLite regression tests](../api/__tests__/StartupDatabase-test.js).
- **Dependencies:** None.

### DATA-02 - Surface loading, saving, and initialization failures

**P1 | Source gap / confirmed fallback behavior**

- **Evidence:** Several flows log errors without a user-visible recovery path.
  Daily status reads return "not completed" on storage failure, and completion
  writes can fail without notifying the player.
- **Acceptance:** Distinguish loading, empty, failed, and successful states.
  Failed writes must not appear as saved progress or recorded daily completion.
  Provide actionable retry/recovery UI and repository-standard error logging.
  Do not reset progress as a recovery shortcut.
- **References:** [Startup](../api/startup.js),
  [database context](../contexts/DBContext.tsx),
  [daily storage](../utils/DailyChallenge.js),
  [achievement loading](../hooks/useAchievementData.ts).
- **Dependencies:** DATA-01 for initialization recovery; otherwise independent.

## 3. Shared game-session model

### SESSION-01 - Define one session contract for existing modes

**P1 | Source gap / product decision**

- **Issue:** Games do not share a clear definition of ready, playing, paused,
  completed, lost, drawn, or abandoned states.
- **Acceptance:** Document a behavior matrix for each of the eight games and
  its existing modes: start, pause, interruption, resume, restart, exit,
  win/loss/draw, and Endless stop. Define timer, scoring, and save semantics.
  Do not equate quitting with losing or require speed in untimed modes.
- **References:** [Shared game header](../components/Home/GameHeader/GameHeader.tsx),
  [result modal](../components/Modals/EndGameMessage.jsx),
  [timer](../components/Helpers/Timer.tsx).
- **Dependencies:** None.

### SESSION-02 - Implement pause, interruption, and safe resumption

**P1 | Source gap**

- **Acceptance:** Every shipped game has a reachable pause/resume action.
  Backgrounding and relevant modal interruptions suspend input, timers,
  sequences, animations, and pending AI actions as appropriate. Resuming must
  not skip rounds, advance elapsed play time unexpectedly, or execute stale work.
  Returning repeatedly must not create duplicate timer/listener subscriptions.
- **References:** [Timer](../components/Helpers/Timer.tsx),
  [Simon](../components/Home/SimonSays/SimonSaysGame.tsx),
  [Connect Four](../components/Home/ConnectFour/ConnectFourGame.tsx).
- **Dependencies:** SESSION-01.

### SESSION-03 - Make Continue meaningful with saved sessions

**P1 | Confirmed source defect / source gap**

- **Evidence:** The selection modal displays a Continue button without an
  action handler.
- **Acceptance:** Offer Continue only when a compatible saved session exists.
  Restore board/content, mode, difficulty, elapsed time, moves/mistakes, hints,
  relevant RNG/sequence state, and daily identity. Handle corrupt or obsolete
  saves explicitly. Test restoration after process termination, not only
  navigation. Do not silently overwrite an unfinished session on New Game.
- **References:** [Game selection](../components/Modals/SelectGame.jsx),
  [home navigation](../screens/HomeScreen.tsx).
- **Dependencies:** SESSION-01, DATA-01, DATA-02.

### SESSION-04 - Make restart, exit, and back navigation predictable

**P1 | Source gap / validation task**

- **Acceptance:** Back, home, close, restart, and new-game actions follow the
  same preservation/confirmation rules. Players can leave a puzzle without
  unexpectedly losing it. Restart clears only the intended session state.
  Result-modal dismissal does not reactivate a finished game.
- **References:** [Home screen](../screens/HomeScreen.tsx),
  [navigation](../app/_layout.tsx),
  [result actions](../components/Modals/EndGameMessage.jsx).
- **Dependencies:** SESSION-01, SESSION-03.

### SESSION-05 - Record each terminal outcome exactly once

**P1 | Source gap / validation task**

- **Acceptance:** A run produces one authoritative outcome with associated
  metrics. Repeated taps, repeated effects, remounting, or retrying a failed
  save cannot duplicate wins, points, or achievements. Wins, losses, draws,
  abandoned runs, and stopped Endless runs remain distinct. Agree legacy-data
  treatment before changing statistics.
- **References:** [Score writes](../db/Scores/Scores.js),
  [result handling](../components/Modals/EndGameMessage.jsx),
  [Crossword Endless stop](../components/Home/Crossword/CrosswordGame.tsx),
  [Word Search Endless stop](../components/Home/WordSearch/WordSearchGame.tsx).
- **Dependencies:** SESSION-01, DATA-01; coordinate with STAT-01 and ACH-02.

### SESSION-06 - Standardize instruction, loading, and result flows

**P1 | Source gap**

- **Acceptance:** Each game explains its objective, controls, difficulty,
  mode-specific rules, and loss conditions before first play, with help
  available later. Reuse shared loading/error/result patterns where suitable.
  Results explain what happened, show valid metrics, and offer replay/home.
  Preserve Sudoku's successful feedback and animation behavior.
- **References:** [Selection modal](../components/Modals/SelectGame.jsx),
  [generic help](../components/Modals/HelpModal.jsx),
  [shared results](../components/Modals/EndGameMessage.jsx).
- **Dependencies:** SESSION-01, UX-01.

## 4. Cohesive visual identity and discovery

### UX-01 - Establish Sudoku as the implemented design reference

**P1 | Product decision / source gap**

- **Issue:** The app uses inconsistent naming and game chrome; documentation
  describes design intentions that are not uniformly implemented.
- **Acceptance:** Choose one public-facing name. Capture the Sudoku elements
  worth retaining and define shared spacing, typography, controls, feedback,
  instruction, and result patterns. Apply the system to all eight games,
  home, profile, and settings without making every board visually identical.
- **References:** [Sudoku board](../components/Home/Sudoku/SudokuBoard.tsx),
  [design documentation](design-system/README.md),
  [navigation naming](../app/_layout.tsx),
  [About](../components/Modals/AboutModal.jsx), [configuration](../app.json).
- **Dependencies:** None.

### UX-02 - Make themes consistent and persistent

**P1 | Source gap**

- **Evidence:** Theme preferences use in-memory state, navigation follows the
  device scheme separately, and game surfaces include independent color values.
- **Acceptance:** Persist system/custom preference and selected supported theme.
  Navigation, modals, controls, text, and game surfaces honor it coherently.
  Preserve meaningful board colors and non-color state cues. Verify every
  exposed theme; simplify unsupported choices rather than shipping partial ones.
- **References:** [Theme context](../contexts/ThemeContext.tsx),
  [theme hook](../hooks/useTheme.js),
  [theme selection](../components/Modals/ThemeSelector.tsx),
  [navigation](../app/_layout.tsx).
- **Dependencies:** UX-01; verify with A11Y-03.

### UX-03 - Implement a real typography and feedback system

**P1 | Source gap**

- **Evidence:** Documented typefaces differ from the fonts loaded at startup.
- **Acceptance:** Document the fonts actually bundled and use a consistent
  readable hierarchy for headings, instructions, boards, timers, and results.
  Keep board glyphs legible and avoid clipped large scores. Standardize success,
  mistake, disabled, selected, and pressed states without excessive animation.
- **References:** [Font loading](../app/_layout.tsx),
  [typography guide](design-system/02-typography.md),
  [home tiles](../components/Home/GameSelector/GameSelector.tsx).
- **Dependencies:** UX-01; verify with A11Y-03 through A11Y-05.

### UX-04 - Polish home discovery and mode selection

**P2 | Product improvement / validation task**

- **Acceptance:** Eight active games have clear, accurate descriptions and
  consistent artwork. Difficulty and mode selection explain actual differences.
  Daily availability and resumable sessions are understandable. Layout responds
  to supported device widths and text scaling without hidden controls.
- **References:** [Home selector](../components/Home/GameSelector/GameSelector.tsx),
  [game selection](../components/Modals/SelectGame.jsx),
  [difficulty definitions](../constants/Difficulties.js),
  [mode definitions](../constants/GameModes.js).
- **Dependencies:** CAT-01, SESSION-03, UX-01.

## 5. Accessibility and supported-device behavior

### A11Y-01 - Add meaningful assistive labels, state, and focus

**P1 | Source gap; runtime behavior unverified**

- **Acceptance:** Navigation, icon buttons, cells, hints, counters, and results
  expose meaningful labels, roles, and state. Board announcements include
  coordinates and relevant game information. Modal focus enters and returns
  predictably; completion/error announcements do not overwhelm play. Verify
  actual VoiceOver interaction rather than relying on props alone.
- **References:** [Sudoku board](../components/Home/Sudoku/SudokuBoard.tsx),
  [Minesweeper cell](../components/Home/MineSweeper/Cell.tsx),
  [Word Search board](../components/Home/WordSearch/WordSearchBoard.tsx).
- **Dependencies:** SESSION-01; use UX-01 conventions where applicable.

### A11Y-02 - Make dense boards and controls operable

**P1 | Source risk / validation task**

- **Evidence:** Several boards use fixed cells smaller than the design
  documentation's 44-point target guidance.
- **Acceptance:** Ordinary controls have suitable touch targets. Dense boards
  provide a usable selection/alternate-input or enlargement approach without
  overlapping hit regions or obscuring neighbors. Test flagging, path
  selection, card selection, number entry, and column selection on a small phone.
- **References:** [Crossword input](../components/Home/Crossword/CrosswordGrid.js),
  [Sudoku board](../components/Home/Sudoku/SudokuBoard.tsx),
  [component guidance](design-system/04-components.md).
- **Dependencies:** UX-01.

### A11Y-03 - Verify contrast and remove color-only information

**P1 | Source risk / validation task**

- **Acceptance:** Measure supported themes and actual UI states for text and
  essential graphical contrast, using appropriate accessibility criteria.
  Selected, incorrect, found, opponent, and sequence states have non-color cues.
  Test light/dark/custom themes and color-vision alternatives on rendered UI.
- **References:** [Theme system](../contexts/ThemeContext.tsx),
  [Connect Four board](../components/Home/ConnectFour/ConnectFourBoard.tsx),
  [Simon](../components/Home/SimonSays/SimonSaysGame.tsx),
  [color guidance](design-system/03-colors.md).
- **Dependencies:** UX-01, UX-02.

### A11Y-04 - Validate text scaling, safe areas, keyboard, and tablet layout

**P1 | Validation task**

- **Acceptance:** Test the smallest supported iPhone and a supported tablet in
  the app's declared orientations, including large text. Boards, status,
  instructions, and result actions remain usable. Respect safe areas; keep
  Crossword input and submission visible with the keyboard open. Replace
  fragile fixed geometry/offsets where tests demonstrate a problem.
- **References:** [Supported configuration](../app.json),
  [Simon layout](../components/Home/SimonSays/SimonSaysGame.tsx),
  [Minesweeper layout](../components/Home/MineSweeper/MineSweeperGame.tsx),
  [Crossword input](../components/Home/Crossword/CrosswordGrid.js).
- **Dependencies:** UX-03; coordinate with A11Y-02.

### A11Y-05 - Respect reduced-motion preferences

**P1 | Source gap**

- **Acceptance:** Nonessential entrances, pulsing, shakes, particles, and
  celebrations can be reduced without hiding game state or blocking actions.
  Retain clear static feedback. Test preference changes and return from
  background; do not strip Sudoku's animations for everyone.
- **References:** [Animation components](../components/animations/),
  [animation guidance](design-system/05-animations.md),
  [shared results](../components/Modals/EndGameMessage.jsx).
- **Dependencies:** UX-01.

### A11Y-06 - Define accessible timing and sequence alternatives

**P1 | Product decision / validation task**

- **Acceptance:** Simon has distinguishable non-color signals and an operable
  teaching/input flow. Define whether slower or assisted settings are needed.
  Keep timed variants optional where appropriate; explain how assistance
  affects records without misrepresenting comparable scores.
- **References:** [Simon settings](../utils/SimonSaysGenerator.ts),
  [Simon play flow](../components/Home/SimonSays/SimonSaysGame.tsx),
  [Sudoku Frenzy](../components/Home/Sudoku/SudokuGame.tsx).
- **Dependencies:** SESSION-01, A11Y-01, A11Y-03.

## 6. Individual puzzle correctness and quality

### SUD-01 - Guarantee valid, uniquely solvable Sudoku puzzles

**P0 | Confirmed source gap**

- **Evidence:** The generator checks solvability, not unique solvability.
- **Acceptance:** Every released generated board satisfies Sudoku rules and has
  exactly one solution. Generation terminates with explicit failure handling.
  Regression tests cover classic and seeded generation at every difficulty.
  Start with at least 100 seeds per setting; sampling supplements a correctness
  mechanism and does not prove validity for all seeds.
- **Reference:** [Sudoku generator](../utils/SudokuGenerator.js).
- **Dependencies:** None; preserve seeded reproducibility for DAILY-01.

### SUD-02 - Calibrate and explain Sudoku difficulty

**P1 | Product improvement based on confirmed source limitation**

- **Evidence:** Difficulty primarily changes the number of removed cells.
- **Acceptance:** Define what each difficulty promises using solving techniques
  and/or an evaluated puzzle corpus, not blank count alone. Verify progression
  with human playtesting and document any remaining limits. Preserve legitimate
  harder puzzles rather than merely adding more empty cells.
- **Reference:** [Sudoku generation](../utils/SudokuGenerator.js).
- **Dependencies:** SUD-01.

### SUD-03 - Protect Sudoku's polished play and mode behavior

**P1 | Validation task**

- **Acceptance:** Exercise selection, fixed cells, correct/incorrect entries,
  mistakes, victory, restart, Daily completion, and Frenzy timing. Test rapid
  input, navigation away/back, pause, and process restoration. Existing
  animations and theme behavior must not regress during shared-UI changes.
- **References:** [Sudoku game](../components/Home/Sudoku/SudokuGame.tsx),
  [Sudoku tests](../components/__tests__/SudokuFrenzyMode-test.js).
- **Dependencies:** SESSION-01 through SESSION-05, SUD-01.

### MINE-01 - Use one authoritative mine count

**P0 | Confirmed source defect**

- **Evidence:** Display helpers use 10/40/70/100; board generation uses
  10/35/60/90.
- **Acceptance:** Generator, displayed count, flag counter, and victory
  conditions use the same settings for each difficulty. Add tests inspecting
  generated mine totals and the corresponding displayed/remaining count.
- **References:** [Minesweeper generator](../utils/MineSweeperGenerator.js),
  [Minesweeper game](../components/Home/MineSweeper/MineSweeperGame.tsx).
- **Dependencies:** None.

### MINE-02 - Validate Minesweeper interaction and document fairness

**P1 | Validation task / product decision**

- **Acceptance:** Verify first-click safety, flood reveal, flag/unflag behavior,
  loss reveal, win detection, and timer boundaries on all board sizes. State
  whether classic boards may require guessing. Do not promise no-guess boards
  unless generation and validation actually guarantee them.
- **References:** [Generator](../utils/MineSweeperGenerator.js),
  [cell interaction](../components/Home/MineSweeper/Cell.tsx).
- **Dependencies:** MINE-01, SESSION-01.

### WORD-01 - Ensure every Word Search target is placed

**P0 | Confirmed source defect path**

- **Evidence:** Placement can exhaust attempts while the game retains the
  original target list.
- **Acceptance:** Every listed target has a valid recorded placement in the
  delivered grid. Retry or reject generation explicitly within bounded work;
  never deliver an unwinnable target bank. Exercise crowded grids, long words,
  overlapping placements, and all difficulty settings.
- **References:** [Generator](../utils/WordSearchGenerator.ts),
  [target setup](../components/Home/WordSearch/WordSearchGame.tsx).
- **Dependencies:** None.

### WORD-02 - Validate selection geometry and prevent duplicate finds

**P0 | Confirmed source defect path / validation task**

- **Evidence:** Current matching concatenates selected letters without proving
  one contiguous straight-line path.
- **Acceptance:** Accept only permitted contiguous horizontal, vertical, or
  diagonal paths in supported directions. Reject disconnected, bent, and
  out-of-order selections. A found word counts once. Preserve intersections
  and clearing behavior and explain whether reverse selection is supported.
- **References:** [Selection handling](../components/Home/WordSearch/WordSearchGame.tsx),
  [board interaction](../components/Home/WordSearch/WordSearchBoard.tsx).
- **Dependencies:** WORD-01.

### CROSS-01 - Fix Crossword completion and mistake outcomes

**P0 | Confirmed source defect**

- **Evidence:** The final-word completion condition is outside the correct,
  newly-guessed-word branch.
- **Acceptance:** Only a correct new answer advances completion. Incorrect or
  repeated answers cannot win. Test the final word, crossing cells, mistake
  limit, and restart/reset behavior; no input produces both win and loss.
- **Reference:** [Guess handling](../components/Home/Crossword/CrosswordGame.tsx).
- **Dependencies:** None; integrate with SESSION-05.

### CROSS-02 - Bound Crossword generation and preserve source content

**P0 | Confirmed source defect paths**

- **Evidence:** Generator retries are unbounded and placement mutates the
  supplied list; the game supplies the imported word list.
- **Acceptance:** Work on per-run input rather than consuming shared content.
  Bound generation attempts and show recoverable failure when requirements
  cannot be met. Repeated Classic/Endless puzzles do not degrade the source
  pool, hang, or produce invalid crossings/answer coordinates.
- **References:** [Generator](../utils/CrosswordGenerator.js),
  [game generation](../components/Home/Crossword/CrosswordGame.tsx).
- **Dependencies:** DATA-02 for failure presentation.

### CROSS-03 - Validate clue coverage and improve answer entry

**P1 | Validation task / source gap**

- **Acceptance:** Every delivered answer has an appropriate clue. Validate
  dictionary/clue coverage, spelling, duplicates, and intended difficulty.
  Clue selection identifies the intended word at crossings; input, keyboard,
  and answer feedback are understandable without revealing the solution.
- **References:** [Clue data](../data/crosswordData.json),
  [clue lookup](../components/Home/Crossword/CrosswordGame.tsx),
  [grid input](../components/Home/Crossword/CrosswordGrid.js).
- **Dependencies:** CROSS-01, CROSS-02, A11Y-04.

### TILE-01 - Save 2048 records from the resulting move

**P1 | Confirmed source defect path**

- **Evidence:** Highest-tile recording reads the previous board after a move.
- **Acceptance:** A move that creates a record tile saves that resulting tile,
  including the winning move. Verify score, merge-once rules, no-op moves,
  loss detection, and result persistence with representative edge boards.
- **References:** [2048 game](../components/Home/TwoZeroFourEight/TwoZeroFourEightGame.tsx),
  [move logic](../utils/TwoZeroFourEightGenerator.ts).
- **Dependencies:** SESSION-05 for once-only outcome recording.

### TILE-02 - Make 2048 difficulty promises credible

**P2 | Product decision / validation task**

- **Evidence:** Hard can spawn higher-value tiles, which may help as well as
  hinder. Labels are not proof of increasing difficulty.
- **Acceptance:** Choose and explain board/spawn rules, test their effects, and
  label modes honestly. Do not silently compare records across incompatible
  configurations. Preserve or explicitly migrate existing records.
- **Reference:** [2048 settings](../utils/TwoZeroFourEightGenerator.ts).
- **Dependencies:** STAT-01.

### MEM-01 - Validate Memory Match at every board size

**P1 | Validation task; no specific failure established**

- **Acceptance:** Boards contain exactly two of each selected symbol. Verify
  preview timing, input locks during mismatch resolution, repeated/rapid taps,
  mistake limits, completion, restart, and restoration. Make the 8x8 board
  usable on supported phones; provide accessible card identity and state.
- **References:** [Generator](../utils/MemoryMatchGenerator.ts),
  [game](../components/Home/MemoryMatch/MemoryMatchGame.tsx).
- **Dependencies:** SESSION-01, SESSION-02, A11Y-01, A11Y-02.

### SIM-01 - Persist Simon results and required achievement metrics

**P1 | Source gap**

- **Evidence:** The game reaches results but does not write the run metrics
  required by its achievement definitions.
- **Acceptance:** Record agreed run count, best round/score, and other supported
  metrics exactly once on a completed run. Define whether "round" means shown,
  attempted, or successfully repeated. Restart and refresh preserve records;
  unsupported definitions are hidden or corrected rather than advertised.
- **References:** [Simon game](../components/Home/SimonSays/SimonSaysGame.tsx),
  [Simon achievements](../data/achievements/simon-says.json).
- **Dependencies:** STAT-01, SESSION-05, ACH-01.

### SIM-02 - Validate Simon sequence and input lifecycle

**P1 | Validation task**

- **Acceptance:** Playback and input phases cannot overlap. Rapid taps, pause,
  backgrounding, restart, or leaving the route cannot advance stale sequences.
  Verify speed floors, round growth, failure, and all 4/6/9-tile settings.
- **References:** [Sequence settings](../utils/SimonSaysGenerator.ts),
  [Simon game](../components/Home/SimonSays/SimonSaysGame.tsx).
- **Dependencies:** SESSION-02, A11Y-06.

### CONNECT-01 - Handle Connect Four draws as draws

**P1 | Confirmed source defect**

- **Evidence:** Draw branches call the loss path.
- **Acceptance:** Full boards without a winner show and persist a draw, not a
  loss. Check the last move for a win before declaring a draw. Results, win
  rates, streak semantics, and achievements consistently distinguish outcomes.
- **Reference:** [Connect Four game](../components/Home/ConnectFour/ConnectFourGame.tsx).
- **Dependencies:** SESSION-01, STAT-01.

### CONNECT-02 - Verify AI turns and describe the actual opponent modes

**P1 | Validation task / documentation gap**

- **Acceptance:** Verify immediate wins/blocks, legal moves, full columns, and
  the distinct AI settings. Input is disabled during the AI turn; restart or
  exit cancels stale work. Measure AI responsiveness on supported devices.
  Describe the shipped player-versus-AI mode accurately; do not imply a
  selectable local two-human mode exists.
- **References:** [AI](../utils/ConnectFourGenerator.ts),
  [game](../components/Home/ConnectFour/ConnectFourGame.tsx),
  [catalog description](../data/games.json).
- **Dependencies:** SESSION-02.

## 7. Scores, statistics, and achievements

### STAT-01 - Define comparable metrics and trustworthy statistics

**P1 | Source gap / product decision**

- **Issue:** Independent metric rows, different outcome semantics, and mixed
  modes make aggregate records difficult to interpret. Endless stopping is
  currently recorded as a win.
- **Acceptance:** Define units, direction of improvement, applicable modes,
  difficulty, run identity, and outcome eligibility for every displayed metric.
  Fastest time must represent a qualifying completion, not a loss or unrelated
  mode. Do not compare unlike game scores or count a stopped run as a puzzle
  victory without an explicit product rule. Document legacy-record treatment.
- **References:** [Score persistence](../db/Scores/Scores.js),
  [stat queries](../db/Scores/Results.js),
  [profile stats](../components/Profile/ProfilePage/ProfileStats.tsx).
- **Dependencies:** SESSION-01. Implement storage changes through DATA-01.

### ACH-01 - Reconcile every achievement with implemented events

**P1 | Confirmed unsupported metrics / source gap**

- **Evidence:** Streak and general metrics are not fully supported; some
  definitions require events the associated game never saves.
- **Acceptance:** Create a definition-to-event/metric coverage inventory.
  Implement supported streak, collection, skill, time, and game metrics or
  withdraw unsupported definitions. Define streak reset rules including draws,
  abandonment, and assisted modes. Every visible achievement is demonstrably
  attainable using released content.
- **References:** [Tracker](../db/Achievements/AchievementTracker.js),
  [definitions](../data/achievements/).
- **Dependencies:** STAT-01. Add game-specific producers such as SIM-01 alongside
  their definitions; neither requires waiting for unrelated metrics.

### ACH-02 - Make unlocks and point awards atomic and idempotent

**P1 | Confirmed source risk**

- **Evidence:** Unlock writes and increments to user points are separate
  operations; the unlock helper increments points even when updating an
  existing unlock. Call-site checks alone do not guarantee concurrency safety.
- **Acceptance:** First unlock awards points once; repeated/concurrent checks
  and retries do not award again or change its original earned timestamp.
  Partial failures cannot leave the unlock and total inconsistent. Define how
  existing discrepancies are reconciled without erasing legitimate history.
- **Reference:** [Achievement persistence](../db/Achievements/Achievements.js).
- **Dependencies:** DATA-01 for schema/repair migration if needed.

### ACH-03 - Make displayed progress agree with unlock criteria

**P1 | Source gap / confirmed source risk**

- **Evidence:** Progress and eligibility use separate branches. Time progress
  can default to the target when no time exists, presenting misleading progress.
- **Acceptance:** No-history players have honest initial progress. Counts,
  thresholds, percentages, best-time goals, and unlocked states agree. Respect
  definition difficulty/operator constraints. A refresh, completed game, or
  relaunch yields the same persisted totals and filters.
- **References:** [Eligibility/progress](../db/Achievements/AchievementTracker.js),
  [achievement hook](../hooks/useAchievementData.ts),
  [achievement screen](../screens/AchievementScreen.tsx),
  [profile preview](../components/Profile/ProfilePage/ProfileAchievements.tsx).
- **Dependencies:** ACH-01, ACH-02.

### ACH-04 - Curate achievements around mastery rather than volume

**P2 | Product improvement**

- **Acceptance:** Review descriptions, categories, tiers, points, and thresholds
  for meaningful milestones across the existing games. Balance early discovery,
  difficult accomplishments, and personal improvement. Avoid repetitive grind,
  unsupported social goals, or compulsory daily attendance. Explain assistance
  eligibility and use a consistent unlock presentation.
- **References:** [Definitions](../data/achievements/),
  [achievement components](../components/Achievements/).
- **Dependencies:** ACH-01, ACH-03, UX-01.

## 8. Daily and existing alternate modes

### DAILY-01 - Define and harden the existing Daily Challenge contract

**P1 | Confirmed documentation mismatch / product decision**

- **Evidence:** Only Sudoku exposes Daily. Completion is stored by local date,
  game, and difficulty. A failed attempt can be retried; documentation also
  describes one play per day.
- **Acceptance:** Decide and document local versus canonical date, retries,
  per-difficulty completion, replay, and assistance eligibility. Pin a run's
  date/seed when started so crossing midnight cannot credit the wrong challenge.
  Reproduce content after restart and preserve saved runs across generator
  changes through a deliberate version/content policy. Exercise date rollover,
  timezone changes, write failures, and interrupted completion.
- **References:** [Daily helpers](../utils/DailyChallenge.js),
  [Sudoku integration](../components/Home/Sudoku/SudokuGame.tsx),
  [Daily documentation](DailyChallenge.md).
- **Dependencies:** SESSION-01, SESSION-03, SESSION-05, DATA-02, SUD-01.

### DAILY-02 - Extend the shared Daily experience only where appropriate

**P2 | Product improvement, not an existing broken feature**

- **Acceptance:** Select which existing puzzles should gain Daily after their
  generators and scoring are reliable. Use one visual entry/completion pattern
  and explicit deterministic inputs. Do not advertise Daily on unsupported
  games or imply that more modes inherently establish uniqueness.
- **References:** [Mode definitions](../constants/GameModes.js),
  [daily implementation](../utils/DailyChallenge.js).
- **Dependencies:** DAILY-01, UX-01 and the selected games' correctness items.

## 9. Profile, settings, and supporting states

### SETTINGS-01 - Implement or remove unavailable clear-data behavior

**P1 | Confirmed source gap**

- **Evidence:** Clear User Data currently reports that it is not implemented.
- **Acceptance:** Either hide the unavailable action or implement a clearly
  scoped, confirmed reset. If implemented, coordinate SQLite, preferences,
  saved sessions, Daily keys, profile, and UI refresh atomically where possible.
  Cancel does nothing; partial failure is explicit; next launch remains valid.
  Keep deliberate reset separate from ordinary startup.
- **References:** [Settings](../screens/SettingsScreen.tsx),
  [startup](../api/startup.js).
- **Dependencies:** DATA-01, SESSION-03, DAILY-01 if implementing a full reset.

### SETTINGS-02 - Consolidate profile editing and clarify local identity

**P2 | Source inconsistency / product decision**

- **Acceptance:** Profile and Settings use one consistent edit flow, validation,
  persistence, and feedback. Explain that identity/progress is local if that
  remains the product model. Do not introduce online accounts to solve a local
  presentation issue.
- **References:** [Profile screen](../screens/ProfileScreen.tsx),
  [edit modal](../components/Modals/EditProfileModal.tsx),
  [profile route](../app/(tabs)/profile/editProfile.tsx).
- **Dependencies:** UX-01.

### SETTINGS-03 - Provide reliable refresh, empty, and error states

**P1 | Source gap / validation task**

- **Acceptance:** Home, profile, statistics, and achievements distinguish no
  history from failed loading. Refresh returns to a settled state and updates
  all displayed derived values. Verify app return/navigation after completing
  a game; do not show stale summaries as if they were current.
- **References:** [Achievement loading](../hooks/useAchievementData.ts),
  [profile](../screens/ProfileScreen.tsx),
  [profile stats](../components/Profile/ProfilePage/ProfileStats.tsx).
- **Dependencies:** DATA-02, STAT-01, ACH-03.

## 10. Verification, documentation, and App Store submission

### QA-01 - Add focused behavioral regression tests as fixes land

**P1 | Validation task**

- **Acceptance:** Add tests that fail on each repaired defect, exercising
  production logic rather than reproducing it or merely asserting constants.
  Cover generated content invariants, terminal outcomes, async cancellation,
  save/restore, upgrades, visibility, Daily rules, and unlock idempotency.
  Run targeted suites and type-check changed code; expand only when warranted.
- **Reference:** [Existing tests](../components/__tests__/).
- **Dependencies:** Add alongside the relevant fixes, not after all work ends.

### QA-02 - Run an eight-game release acceptance matrix on devices

**P1 | Validation task**

- **Acceptance:** Exercise clean install and upgraded saved data, offline cold
  launch, each supported mode/difficulty, teaching, active play, interruption,
  restoration, terminal outcomes, replay, settings, themes, and achievements.
  Confirm hidden arcade cards and achievements do not return on upgraded data.
  Check supported phone/tablet layouts, keyboard, VoiceOver, larger text, and
  reduced motion. Measure generation/AI responsiveness and animation behavior
  before claiming performance targets; fix observed stalls or leaked work.
- **References:** [Release configuration](../app.json),
  [navigation](../app/_layout.tsx), all eight game routes.
- **Dependencies:** Relevant P0/P1 implementation items. Test incrementally.

### DOC-01 - Reconcile documentation and copy with the shipped app

**P1 | Confirmed documentation drift**

- **Evidence:** README counts, achievement documentation, old implementation
  claims, and planning documents disagree with actual behavior.
- **Acceptance:** Distinguish released, hidden, partial, and proposed work.
  Correct achievement totals, difficulties, game modes, local/AI descriptions,
  Daily retry rules, theme/font claims, and setup instructions in concert with
  the modernization work. Mark historical plans as historical rather than
  treating them as current commitments. This backlog supersedes earlier
  expansion-first and mandatory original-game proposals for the current scope.
- **References:** [Project README](../README.md),
  [old plans overview](plans/README.md),
  [achievement documentation](../data/achievements/README.md),
  [design system](design-system/README.md).
- **Dependencies:** Update alongside affected implementations; final pass before
  STORE-02. Dependency instructions remain owned by modernization work.

### QA-03 - Resolve existing application type-check failures

**P1 | Confirmed validation failure**

- **Evidence:** Repository-wide TypeScript checking during backlog preparation
  fails on existing application issues, including missing animation-test
  exports, shared component types, Sudoku seed typing, and retained arcade
  source. Hiding a game does not remove its source from type checking.
- **Acceptance:** Coordinate with modernization work to establish a passing
  application type-check/build baseline without suppressing errors or weakening
  types. Keep archived code and fix or deliberately isolate its compilation
  through an explicit decision rather than deleting it. Re-run checks on the
  final integrated branch.
- **References:** [TypeScript configuration](../tsconfig.json),
  [animation-test route](../app/animation-test.tsx),
  [shared themed components](../components/Themed.tsx),
  [Sudoku game](../components/Home/Sudoku/SudokuGame.tsx).
- **Dependencies:** Coordinate with, but do not duplicate, SDK modernization.

### STORE-01 - Clarify the similarity rejection and establish provenance

**P1 | External evidence / release task**

- **Evidence:** The supplied 4.3(a) rejection cites similar binary, metadata,
  and/or concept across developers. It does not establish which factor applies.
- **Acceptance:** Preserve the actual rejection and identify the submitted
  version. Ask App Review for clarification where possible. Inventory original
  versus third-party code, artwork, audio, word/clue data, and listing materials;
  retain accurate licenses/permissions privately as appropriate. Do not assume
  template use, copying, or wrongdoing. A cosmetic reskin alone is not a remedy
  for an unresolved provenance concern.
- **References:** [Apple review guidelines](https://developer.apple.com/app-store/review/guidelines/),
  [contact and appeal guidance](https://developer.apple.com/distribute/app-review/).
- **Dependencies:** None; run in parallel with product work.

### STORE-02 - Prepare truthful metadata and reviewer evidence

**P1 | Release task / validation task**

- **Acceptance:** Listing, icon, onboarding, screenshots, support/privacy links,
  and review notes accurately reflect the ad-free puzzle-focused release.
  Demonstrate the implemented quality and value rather than only game counts.
  Check live support/privacy destinations and consistency with actual data use.
  Exclude hidden arcade games, debug/test entry points, unsupported features,
  and unfinished UI from promoted/reviewer journeys. Review the retained
  animation-test route and decide its release exposure explicitly.
  Provide concise steps to find Daily, achievements, and distinctive polished
  interactions. Do not claim that these changes guarantee approval.
- **References:** [Privacy information](../PRIVACY.md),
  [support information](../SUPPORT.md),
  [test route registration](../app/_layout.tsx),
  [Apple metadata/review guidance](https://developer.apple.com/distribute/app-review/).
- **Dependencies:** STORE-01, DOC-01, QA-02, QA-03 and relevant release-blocking items.

## Suggested execution order

1. **Protect progress and restore trust:** DATA-01; SUD-01, MINE-01, WORD-01,
   WORD-02, CROSS-01, CROSS-02. Keep CAT-01's presentation-only policy in place.
2. **Agree shared semantics:** SESSION-01, STAT-01, UX-01, DAILY-01's behavioral
   decisions. STORE-01 can proceed independently.
3. **Build reliable sessions and records:** SESSION-02 through SESSION-06,
   individual-game P1 fixes, DATA-02, ACH-01 through ACH-03, CAT-02.
4. **Apply the Sudoku-led quality standard:** UX-02/UX-03, accessibility items,
   profile/settings work, and focused game playthroughs. Accessibility should
   shape implementation from the start, not be deferred to a final reskin.
5. **Validate and submit:** QA-01 alongside every change, then QA-02, DOC-01,
   and STORE-02.
6. **Reassess optional improvements:** UX-04, TILE-02, ACH-04, DAILY-02,
   SETTINGS-02. These do not authorize new games or arcade restoration.

This order is guidance, not a blanket prerequisite chain. Use each item's
explicit dependencies and keep independent work parallel where safe.
