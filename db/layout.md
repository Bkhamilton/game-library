# SQLite Database Schema Documentation

This document provides an overview of the schema for the SQLite database tables `Games` and `Scores`.

## Session persistence (schema version 2)

`GameSessions` retains each run and its versioned JSON checkpoint. An unfinished
slot is unique per game and mode, except Daily Challenge slots also include the
local start date and difficulty. Starting over requires the current slot ID as
an explicit replacement guard. Checkpoint updates use optimistic revisions;
retired runs cannot be saved or restored. The caller must validate the
game-specific checkpoint version and contents before restoring.

Finishing a run atomically retires it, records its outcome and compatible
legacy score rows, and stores a Daily completion for a Daily win.
`finishSession` writes legacy `result` values for wins (1) and losses (0);
callers must not supply a `result` metric. Draws, stops and abandonment do not
become wins or losses. Repeating the same terminal outcome is idempotent.
Daily completion lookups here use SQLite only; callers must also consult legacy
AsyncStorage completions when applicable.

`SessionAchievementWork` records durable pending evaluation work.
`flushPendingSessionAwards(db)` evaluates affected games using existing
criteria and clears the work in the same transaction as progress, guarded
unlocks, and point credits. If a flush fails, retry it separately; the
committed outcome stays saved. Call it after database initialization and
successful result saves, and retry on foregrounding.

Native mutations use Expo's exclusive transaction connection. On web, session
reads and mutations and achievement evaluation/awards share a serialized path
on the provider handle. Unrelated code using that handle directly is not
isolated; web callers must coordinate access before claiming full isolation.

## Table: `Games`

The `Games` table stores information about different games.

### Columns

- **`id`** (Type: `INTEGER`, Primary Key, Auto Increment)

  - A unique identifier for each game. This value is automatically incremented for each new record.

- **`name`** (Type: `TEXT`, Not Null)

  - The name of the game. This field is required and cannot be null.

- **`description`** (Type: `TEXT`, Nullable)
  - A description of the game. This field is optional and can be null.

### Example

```sql
INSERT INTO Games (name, description) VALUES ('Chess', 'A strategic board game for two players.');
```

## Table: `Scores`

The `Scores` table stores score records for games. Each score is associated with a specific game.

### Columns

- **`id`** (Type: `INTEGER`, Primary Key, Auto Increment)

  - A unique identifier for each score record. This value is automatically incremented for each new record.

- **`gameId`** (Type: `INTEGER`, Not Null)

  - The ID of the game associated with this score. This field is a foreign key that references the `id` column in the `Games` table.

- **`score`** (Type: `INTEGER`, Not Null)

  - The score value. This field is required and cannot be null.

- **`metric`** (Type: `TEXT`, Not Null)

  - The metric used to measure the score (e.g., "points", "time", "moves"). This field is required and cannot be null.

- **`createdAt`** (Type: `DATETIME`, Default: `CURRENT_TIMESTAMP`)
  - The timestamp when the score was recorded. If not provided, it defaults to the current date and time.

### Foreign Key

- **`gameId`** references **`Games(id)`**
  - This ensures that each score record is associated with a valid game in the `Games` table.

### Example

```sql
INSERT INTO Scores (gameId, score, metric) VALUES (1, 1500, 'points');
```

## Relationships

- **One-to-Many Relationship**:
  - A single game in the `Games` table can have multiple score records in the `Scores` table.
  - This relationship is enforced by the foreign key `gameId` in the `Scores` table.

## Example Queries

### Retrieve All Games with Their Scores

```sql
SELECT Games.name, Scores.score, Scores.metric, Scores.createdAt
FROM Games
LEFT JOIN Scores ON Games.id = Scores.gameId;
```

### Retrieve Scores for a Specific Game

```sql
SELECT Scores.score, Scores.metric, Scores.createdAt
FROM Scores
WHERE Scores.gameId = 1;
```

### Retrieve the Highest Score for Each Game

```sql
SELECT Games.name, MAX(Scores.score) AS highest_score
FROM Games
LEFT JOIN Scores ON Games.id = Scores.gameId
GROUP BY Games.id;
```

## Conclusion

This schema is designed to store game information and associated scores, allowing for flexible querying and analysis of game data. The use of foreign keys ensures data integrity by enforcing relationships between the `Games` and `Scores` tables.
