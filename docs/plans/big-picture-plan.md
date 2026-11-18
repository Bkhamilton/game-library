# Big Picture Plan: Puzzle Library App Store Release

## What we're building

A thoughtfully crafted, ad-free puzzle collection that feels like the phone
games we grew up playing: easy to pick up, satisfying to master, and free of
interruptions. The collection should stand out through the care put into each
game and how naturally the games fit together, not through the size of the catalog.

**Sudoku is the flagship and the quality bar.** Preserve its theme, animations,
and feedback. Use what works there to guide typography, controls, difficulty
selection, instructions, and results across the collection. Games should feel
related without forcing different boards or mechanics into the same layout.

## What ships

- **Eight existing games:** Sudoku, Minesweeper, Word Search, Crossword, 2048,
  Memory Match, Simon Says, and Connect Four.
- **Arcade games stay out of the visible catalog and arcade-specific achievement
  displays:** GoGoBird, Ostrich Haul, and Dolphin Dive. Keep their code, routes,
  assets, records, and earned points. Hiding them does not remove them from the
  binary or make their routes inaccessible.
- **Deferred:** New games, a separate arcade app, and a mandatory cross-game
  campaign or shared-resource system. SDK and dependency modernization are
  tracked separately.

## Release priorities

1. **Make every game trustworthy.** Fix invalid puzzles and incorrect outcomes
   first. Agree on shared session behavior so starting, pausing, resuming,
   restarting, and finishing a game work predictably and progress is protected.
2. **Bring the collection up to Sudoku's standard.** Carry its visual identity
   and responsive feedback across the app. Build in accessibility as each
   screen is improved, including readable boards, usable controls, and feedback
   that does not depend on color or animation alone.
3. **Give players optional reasons to return.** Make Daily modes, scores, and
   achievements reliable and understandable. Reward mastery and personal
   progress rather than repetition. Keep ordinary free play available without
   requiring a daily challenge or streak.
4. **Verify the release on iOS devices.** Run the eight-game acceptance matrix
   on the release build. Confirm gameplay, session recovery, accessibility,
   Daily modes, achievement tracking, and catalog visibility before resubmitting.

## App Store resubmission

Start the App Review work in parallel with product fixes. The 4.3(a) rejection
cited similarity in binary, metadata, and/or concept without identifying which
factor applied. Keep the original rejection and submitted version, ask for
clarification where possible, and document the origins and permissions of code,
artwork, audio, puzzle content, and listing materials.

For resubmission, use screenshots, listing copy, and review notes that show what
actually ships. Give reviewers a short path to Sudoku's polished interactions,
Daily modes, and achievements. More games, a new theme, or hiding arcade entries
does not by itself address the similarity concern, and none guarantees approval.

## How to use this plan

This is the release strategy recovered from the audit discussion. The
[backlog](../BACKLOG.md) tracks work items, dependencies, and acceptance criteria.
Use its [release scope](../BACKLOG.md#product-direction-and-scope),
[suggested execution order](../BACKLOG.md#suggested-execution-order), and
[verification and submission tasks](../BACKLOG.md#10-verification-documentation-and-app-store-submission)
to decide what to work on next. The [older expansion proposals](./README.md)
are idea references, not commitments for this release.
