# Sudoku Daily Challenge

Sudoku is the only game with a Daily Challenge. Each difficulty has an
independent puzzle and completion record for the local calendar date.
Players can retry an unfinished challenge. Once a date and difficulty have
been completed, a second win cannot be credited for that challenge.

## Starting and continuing

Starting a Daily run pins its local date (`YYYY-MM-DD`). The date determines
the seed; the save contains the actual givens, solution, progress, and active
play time. Continue restores that content rather than regenerating it from the
seed. This preserves a run even when the puzzle collection changes.

An unfinished run can be continued after midnight. The picker labels older
saves with their date. Completing an older challenge credits its original
date, not today's. A time zone change does not change the date already stored
on a run.

## Completion storage

New completions are written to SQLite in the same transaction as the outcome
and score metrics. A failed write does not mark the Daily complete; retrying the
same result is safe. The picker also reads legacy AsyncStorage completion
markers (`dailyChallenge_<GameName>_<Difficulty>_<YYYY-MM-DD>`). No new
completion markers are written to AsyncStorage.

See the [session contract](GAME_SESSIONS.md) and
[difficulty grading](SUDOKU_DIFFICULTY.md).
