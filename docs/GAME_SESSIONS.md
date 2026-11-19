# Game session contract

This document defines the SESSION-01 behavior contract for the eight games in
the current puzzle/strategy release: Sudoku, Minesweeper, Word Search,
Crossword, 2048, Memory Match, Simon Says, and Connect Four. It describes the
shared lifecycle and score policy. Native-device verification is tracked
separately in QA-02.

## Shared lifecycle and persistence defaults

- **States:** A run is ready, playing, paused, or terminal. Terminal outcomes
  remain distinct: won, lost, drawn, or stopped (Endless only). Leaving an
  unfinished run is abandonment, not a loss.
- **Session identity:** Keep at most one unfinished run per game and mode.
  Difficulty is part of the saved run and must match when it is restored.
  Daily Sudoku uses a separate identity for each game, Daily mode, local start
  date, and difficulty; different dates or difficulties do not replace one
  another.
- **Start and replacement:** Starting a run with an occupied identity offers
  Continue or a clearly labeled replacement. Replacing requires confirmation;
  never silently discard unfinished progress. A completed run does not occupy
  an unfinished slot.
- **Save and resume:** Save progress when the player navigates Back, before
  leaving the game. Back preserves the run; it does not imply loss or
  abandonment. After returning from app backgrounding, navigation, or another
  interruption, restore the run paused and require an explicit Resume action.
  Do not count interrupted time as active play or resume timers, input,
  animations, playback, or AI work automatically.
- **Restoration:** Restore the exact game, mode, difficulty, board/content,
  progress counters, elapsed active time, and any needed random seed or pending
  turn/sequence state. A restored run must not restart generation or replay
  already-earned outcomes. A save that cannot be restored must be reported and
  must not be silently treated as a new run.
- **Restart and exit:** Restart creates a clean run in the same game/mode and
  chosen difficulty; confirm if it would replace an unfinished run. Explicit
  exit/abandonment may clear that run only after the player chooses to discard
  it. Merely closing a result or leaving a route never reactivates a terminal
  run.
- **Outcomes and scores:** Write one result per terminal run, at most once.
  Record only metrics applicable to that game and mode, with the run's
  difficulty and identity. Do not write a win/loss/draw, award, or completion
  for pause, interruption, Back, restart, or abandonment. Stopping Endless is
  not a puzzle win. Do not compare unlike games, modes, difficulties, or
  different score units; elapsed time is not a success criterion in untimed
  modes.

## Mode matrix

“Metrics” below are run metrics, not a promise that unlike metrics can be
combined into a single leaderboard. Existing database metric names are noted
where useful; the contract does not redefine legacy records.

| Game and shipped mode | Run rules and terminal outcomes | Clock and score/result policy |
| --- | --- | --- |
| **Sudoku — Classic** | Difficulty selects the generated puzzle. Win when the board is solved; loss at four mistakes. | Elapsed time is a count-up clock, not a countdown. Record result, completion time, and mistake count. |
| **Sudoku — Frenzy** | Difficulty selects the puzzle and countdown length (Easy 15s, Medium 20s, Hard 25s, Extreme 30s). A correct entry resets the countdown; expiration is a loss. | Countdown is gameplay state and must restore with its remaining time. Record result and applicable mistake/time metrics; do not treat countdown duration as a comparable completion time. |
| **Sudoku — Daily Challenge** | A date-seeded puzzle at the selected difficulty. The current rules have no Daily mistake-limit loss; solving completes it. Only one completion is allowed per local start date and difficulty. | Untimed count-up clock. Record result, completion time, and mistakes, keyed to the original local start date and difficulty. If resumed after midnight, finish and record against that original date; do not generate the new day's board. |
| **Minesweeper — Classic** | Difficulty selects the board. The first reveal is safe. Win by revealing every non-mine cell; loss by revealing a mine. | Untimed count-up clock, starting with play. Record result, completion time, correct mine flags, and incorrect flags/mistakes. Flags are progress/metrics, not points. |
| **Word Search — Classic** | Difficulty selects the word set and grid. Win by finding every target; there is no loss condition. | Untimed count-up clock. Record result, completion time, words found, and hints used. |
| **Word Search — Endless** | Progress through successive generated word-search levels. A level completion advances the run; player stop is a distinct stopped outcome. | Preserve current level, accumulated points, current board, found words, hints, and active elapsed time. The displayed per-level award is 100 × level; record final level/score as Endless metrics, not as a puzzle win. |
| **Crossword — Classic** | Difficulty selects the number of words. Win by filling all answers; loss at four incorrect guesses. | Untimed count-up clock. Record result, completion time, correct words, and hints used. |
| **Crossword — Endless** | Complete successive crossword levels; four incorrect guesses ends the run as a loss. Player stop is a distinct stopped outcome. | Preserve current level, accumulated points, current crossword, guesses, hints, and active elapsed time. The displayed per-level award is 100 × level. A stop records final level/score metrics, not a win. |
| **2048 — Classic** | Merge tiles to reach 2048 for a win; no legal moves is a loss. The current game ends on reaching 2048. | Count-up time and move count. Record result, achieved tile/highest tile, total score, moves, and time where applicable. Score is the sum of merge points; retain the final board and score on interruption. |
| **Memory Match — Classic** | Difficulty selects the card layout and miss limit. Win by matching all pairs; loss when the incorrect-guess limit is reached. Preserve matched cards, face-up cards, and any pending match-resolution delay. | Count-up time. Record result, completion time, matched-pair total, and incorrect guesses where supported. Card-pair progress, not speed alone, defines success. |
| **Simon Says — single mode** | Repeat the growing sequence. A wrong input loses the run; there is no separate win or Endless-stop outcome. Preserve the sequence, current round, input/playback phase, and playback position safely. | Do not rank by elapsed time. The primary metric is the highest round successfully repeated (not merely shown or started). Timer display, if retained, is informational. |
| **Connect Four — Classic (player vs AI)** | One human plays the configured AI difficulty. Four in a row wins for the corresponding side; a full board with no winner is a draw. This is not a local two-human mode. | Count-up time and the player's legal-move count. Record win, loss, or draw separately, plus applicable moves and time. A draw must not be persisted as a loss. Preserve board, current player, and whether an AI response is pending. |

## Implementation notes

- The eight-game release scope is grounded in [`BACKLOG.md`](BACKLOG.md);
  selectable modes are grounded in
  [`constants/GameModes.js`](../constants/GameModes.js) and the game routes.
  Sudoku is the only shipped Daily mode; Crossword and Word Search are the
  Endless modes. Simon Says has no selectable alternate mode.
- New Endless stops and Connect Four draws are stored as distinct outcomes.
  The legacy win/loss metric is not written for either.
- Daily identity keeps the local start date. New completions are written
  transactionally to SQLite; legacy completion markers remain readable.
- The legacy score store uses independent metric rows. Preserve existing
  earned history; do not reinterpret historical rows as new outcome types or
  make score/schema changes as part of SESSION-01.

## References

- [Session implementation backlog](BACKLOG.md#3-shared-game-session-model)
- [Score metric inventory](Scores.md)
- [Daily Challenge date and seed helpers](../utils/DailyChallenge.js)
- [Mode definitions](../constants/GameModes.js)

## Shared hook API

`hooks/useGameSession.ts` implements the native lifecycle independently of storage.
Mount its owner with a stable run-ID React `key`; mount a new owner to replace a
run only after the provider has durably accepted the replacement.

```ts
useGameSession<BoardState, Outcome>({
  initialState,
  restored: saved && {
    state: saved.state, elapsedMs: saved.elapsedMs, revision: saved.revision,
  },
  checkpoint: snapshot => provider.save(runId, snapshot),
  onTerminal: (outcome, snapshot) => provider.finish(runId, outcome, snapshot),
});
```

The callbacks are adapter examples, not provider method names. They must reject
on failure; terminal persistence must be idempotent by run ID. Validate restored
state before mounting. A restored run always starts paused. Updates are immutable.

Returned fields and actions:

- `state`, `status` (`ready`, `playing`, `paused`, `terminal`), `elapsedMs`,
  `isActive`, and `runToken`.
- `getSnapshot()` synchronously returns the authoritative latest state, revision,
  and precise active elapsed time between display ticks. Use it for countdown
  deadlines before accepting gameplay input; `elapsedMs` is a display value.
- `start()` and `resume()` return whether activation was accepted.
  `pause()` freezes synchronously and returns `Promise<boolean>` for its save.
- `change(nextStateOrUpdater, token?)` rejects inactive/stale input, updates
  state synchronously, and queues a checkpoint; it returns acceptance.
  `checkpoint()` explicitly saves and returns `Promise<boolean>`.
- `finish(outcome, token?)` latches the terminal state synchronously and returns
  `Promise<boolean>` for persistence. Repeated calls cannot dispatch another
  outcome. `isTerminalSaved` becomes true only after successful finalization.
- `leave(action)` freezes, checkpoints, and permits navigation only after the
  ordered save succeeds. `action` may be synchronous or return a promise.
  Its returned boolean acknowledges the save/dispatch scheduling; navigation
  failures are subsequently exposed through `error`, not reported as success.
- `error` is null or `{ operation, cause }`; `retry()` retries the failed durable
  boundary/navigation without resuming gameplay. `isSaving` covers queued work.

Checkpoints have `{ state, elapsedMs, revision }`. Writes execute in invocation
order. A failed checkpoint freezes play, blocks subsequent work, and retries the
latest state. A terminal intent supersedes a failed earlier checkpoint only on
explicit retry. Navigation failure retains the run and provides retry.

The hook uses Expo Router focus and SDK 58's `usePreventRemove` continuation,
AppState changes, and Android blur/focus. Foregrounding and route refocus never
activate play. The accumulated active clock uses `performance.now`, not wall
time. Blur/unmount are fallback saves, not the primary removal boundary.

For delayed AI, card resolution, playback or countdown work, effects must depend
on **both `isActive` and `runToken`**, clean up timers/animations on effect cleanup,
and capture/pass the token to `change` or `finish`. The hook guards state dispatch,
not arbitrary side effects performed before that dispatch. Persist enough
pending-phase state to restart that work safely after explicit Resume.

`components/Session` exports themed, accessible `SessionControls` (start, pause,
resume, help, save/leave, saving/error/retry) and `SessionResult` (caller-supplied
outcome heading/content, replay/home). Disable result actions until
`isTerminalSaved`; the adapter supplies game-specific instructions and metrics.
Native swipe/header/Android Back behavior still requires device verification.

Memory Match stores preview and pending pair resolution; an interrupted delay
restarts after Resume. Connect Four stores the pending AI turn and records draws
separately. Simon Says replays an interrupted round from the beginning and
clears partial input; its `highScore` is the highest completed round.
Connect Four keeps legacy `moves` and `timeScore` win-only for win achievements;
draws and losses use `drawMoves`/`drawTimeScore` and `lossMoves`/`lossTimeScore`.
