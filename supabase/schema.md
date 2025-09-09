# Database Schema Documentation

## Overview

This document describes the complete database schema for the Polling App, including tables, relationships, functions, and security policies.

## Tables

### 1. `polls` Table

Stores poll information and metadata.

| Column           | Type                     | Constraints                             | Description                        |
| ---------------- | ------------------------ | --------------------------------------- | ---------------------------------- |
| `id`             | UUID                     | PRIMARY KEY, DEFAULT uuid_generate_v4() | Unique poll identifier             |
| `title`          | VARCHAR(255)             | NOT NULL                                | Poll title                         |
| `description`    | TEXT                     | NULL                                    | Optional poll description          |
| `author_id`      | UUID                     | NOT NULL, REFERENCES auth.users(id)     | Poll creator                       |
| `is_active`      | BOOLEAN                  | NOT NULL, DEFAULT true                  | Whether poll is active             |
| `allow_multiple` | BOOLEAN                  | NOT NULL, DEFAULT false                 | Allow multiple votes per user      |
| `expires_at`     | TIMESTAMP WITH TIME ZONE | NULL                                    | Optional expiration date           |
| `created_at`     | TIMESTAMP WITH TIME ZONE | NOT NULL, DEFAULT NOW()                 | Creation timestamp                 |
| `updated_at`     | TIMESTAMP WITH TIME ZONE | NOT NULL, DEFAULT NOW()                 | Last update timestamp              |
| `total_votes`    | INTEGER                  | NOT NULL, DEFAULT 0                     | Total vote count (auto-calculated) |

### 2. `poll_options` Table

Stores individual options for each poll.

| Column       | Type                     | Constraints                             | Description                                  |
| ------------ | ------------------------ | --------------------------------------- | -------------------------------------------- |
| `id`         | UUID                     | PRIMARY KEY, DEFAULT uuid_generate_v4() | Unique option identifier                     |
| `poll_id`    | UUID                     | NOT NULL, REFERENCES polls(id)          | Parent poll                                  |
| `text`       | VARCHAR(500)             | NOT NULL                                | Option text                                  |
| `votes`      | INTEGER                  | NOT NULL, DEFAULT 0                     | Vote count for this option (auto-calculated) |
| `created_at` | TIMESTAMP WITH TIME ZONE | NOT NULL, DEFAULT NOW()                 | Creation timestamp                           |
| `updated_at` | TIMESTAMP WITH TIME ZONE | NOT NULL, DEFAULT NOW()                 | Last update timestamp                        |

### 3. `votes` Table

Stores individual votes cast by users.

| Column       | Type                     | Constraints                             | Description            |
| ------------ | ------------------------ | --------------------------------------- | ---------------------- |
| `id`         | UUID                     | PRIMARY KEY, DEFAULT uuid_generate_v4() | Unique vote identifier |
| `poll_id`    | UUID                     | NOT NULL, REFERENCES polls(id)          | Poll being voted on    |
| `option_id`  | UUID                     | NOT NULL, REFERENCES poll_options(id)   | Selected option        |
| `user_id`    | UUID                     | NOT NULL, REFERENCES auth.users(id)     | User who voted         |
| `created_at` | TIMESTAMP WITH TIME ZONE | NOT NULL, DEFAULT NOW()                 | Vote timestamp         |

**Unique Constraint**: `(poll_id, user_id, option_id)` - Prevents duplicate votes for the same option.

## Indexes

Performance-optimized indexes for common queries:

- `idx_polls_author_id` - Fast lookups by author
- `idx_polls_created_at` - Sorted by creation date
- `idx_polls_is_active` - Filter active polls
- `idx_poll_options_poll_id` - Options by poll
- `idx_votes_poll_id` - Votes by poll
- `idx_votes_user_id` - Votes by user
- `idx_votes_option_id` - Votes by option

## Functions

### `can_user_vote(poll_id, user_id, option_id)`

Checks if a user can vote on a specific option.

**Parameters:**

- `p_poll_id` (UUID): Poll ID
- `p_user_id` (UUID): User ID
- `p_option_id` (UUID): Option ID

**Returns:** BOOLEAN

**Logic:**

- If `allow_multiple` is false, checks if user already voted on the poll
- Always checks if user already voted for the specific option
- Returns true only if user can vote

### `is_poll_active(poll_id)`

Checks if a poll is active and not expired.

**Parameters:**

- `p_poll_id` (UUID): Poll ID

**Returns:** BOOLEAN

**Logic:**

- Poll must have `is_active = true`
- If `expires_at` is set, must not be in the past
- Returns true only if poll is active

### `update_poll_total_votes()`

Trigger function that automatically updates the total vote count for a poll.

### `update_option_votes()`

Trigger function that automatically updates the vote count for a poll option.

### `update_updated_at_column()`

Trigger function that automatically updates the `updated_at` timestamp.

## Triggers

### Vote Count Triggers

- `trigger_update_poll_total_votes` - Updates poll total votes on vote changes
- `trigger_update_option_votes` - Updates option vote counts on vote changes

### Timestamp Triggers

- `trigger_update_polls_updated_at` - Updates polls.updated_at on changes
- `trigger_update_poll_options_updated_at` - Updates poll_options.updated_at on changes

## Views

### `polls_with_author`

Joins polls with author information from auth.users.

**Columns:**

- All poll columns
- `author_email` - Author's email
- `author_name` - Author's display name
- `author_avatar` - Author's avatar URL

## Row Level Security (RLS)

### Polls Table Policies

- **View**: All users can view all polls
- **Create**: Users can create polls (author_id must match auth.uid())
- **Update**: Users can only update their own polls
- **Delete**: Users can only delete their own polls

### Poll Options Table Policies

- **View**: All users can view all options
- **Create**: Users can create options for their own polls
- **Update**: Users can only update options for their own polls
- **Delete**: Users can only delete options for their own polls

### Votes Table Policies

- **View**: All users can view all votes
- **Create**: Users can create votes with restrictions:
  - Must be authenticated user
  - Poll must be active
  - User must be allowed to vote (respects allow_multiple setting)
- **Delete**: Users can only delete their own votes

## Data Flow

1. **Creating a Poll:**

   - Insert into `polls` table
   - Insert options into `poll_options` table
   - Vote counts start at 0

2. **Voting:**

   - Insert into `votes` table
   - Triggers automatically update vote counts
   - RLS policies enforce voting rules

3. **Viewing Results:**
   - Query polls with options and vote counts
   - Use `polls_with_author` view for author information

## Security Considerations

- All tables have RLS enabled
- Users can only modify their own data
- Vote restrictions are enforced at the database level
- Automatic vote counting prevents data inconsistency
- Proper foreign key constraints maintain referential integrity
