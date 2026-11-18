# Sudoku difficulty

Sudoku levels describe the techniques needed by the app's deterministic logical
solver, not the number of blank cells. Every puzzle has one solution. The
logical solver never guesses or backtracks.

| Level | Allowed reasoning | Admission rule |
| --- | --- | --- |
| Easy | Naked singles | Solvable with cells that have just one candidate. |
| Medium | Easy plus hidden singles | Easy stalls; a number's only position in a row, column, or box finishes the puzzle. |
| Hard | Medium plus locked candidates and naked/hidden pairs | Medium stalls; the Hard solver finishes. |
| Extreme | Hard plus naked/hidden triples and X-Wing | Hard stalls; the Extreme solver finishes. |

Locked candidates include pointing and claiming. Pairs and triples apply to
rows, columns, and boxes. X-Wing works in row and column orientations.
Each placement or elimination is recorded in the grader's deduction trace.
A stalled or invalid puzzle has no difficulty rating; it is not called Extreme.

These are app-specific, reproducible technique bands, not an industry-wide
rating or a guarantee of how long a player will take. Human playtesting is
still needed to calibrate perceived progression. Frenzy timing is a separate
rule and is not part of this rating.

## Puzzle supply and provenance

[The bundled collection](../data/sudoku-puzzles.json) contains 16 original
puzzles per level. They were generated locally from this repository's
uniqueness-preserving SUD-01 generator, not copied from an external collection.
For reproducibility of their origin, the collection was sampled from seeds
0 through 5437, trying the previous Easy (30 blanks) and Extreme (55 blanks)
settings, retaining the first 16 distinct puzzles in each logical band.

Only 3 of an initial 500 puzzles at the previous highest blank setting graded
as Extreme. Rather than search indefinitely on phones, the supplier picks a
bundled original and randomizes digits, rows within bands, columns within
stacks, whole bands/stacks, and transposition. These operations preserve
Sudoku validity and uniqueness.

Technique ordering can affect a logical rating even after a valid
transformation. The supplier therefore regrades every transformed candidate
and accepts it only at the exact requested level. After at most 12 transformed
candidates, it checks the selected original. If that cannot be verified either,
it returns a failure for the existing generation-error UI, never an easier
or ambiguous puzzle.

This is a finite collection of base structures with many equivalent
presentations, not unlimited structurally distinct generation. Expanding it
requires validating new originals against both the grader and an independent
solution counter; do not lower the admission rules to fill a level.

The same seed, level, collection, and algorithm reproduce the same puzzle.
This changes boards relative to the old blank-count generator. Changing the
collection or grading order in future releases can also change Daily boards;
the current app does not persist in-progress Daily boards across such updates.

## Verification

Focused Jest tests cover each deduction, invalid lookalike patterns, grading
boundaries, stalled/invalid grids, all 64 originals, and 100 seeded plus 100
random presentations per level. An independent solver counts solutions;
tests also check that the easier logical solver stalls and that trace
eliminations never remove the actual solution.

Device loading/responsiveness and human difficulty calibration remain release
validation tasks. Desktop grading measurements do not establish phone timing.
