# SQLite Database Schema Documentation

This document provides an overview of the schema for the SQLite database tables `Games` and `Scores`.

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
