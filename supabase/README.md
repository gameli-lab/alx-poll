# Supabase Database Schema

This directory contains the database schema and migrations for the Polling App.

## Schema Overview

The database consists of three main tables:

### 1. `polls` table

- Stores poll information including title, description, author, and settings
- Fields: `id`, `title`, `description`, `author_id`, `is_active`, `allow_multiple`, `expires_at`, `created_at`, `updated_at`, `total_votes`

### 2. `poll_options` table

- Stores individual options for each poll
- Fields: `id`, `poll_id`, `text`, `votes`, `created_at`, `updated_at`

### 3. `votes` table

- Stores individual votes cast by users
- Fields: `id`, `poll_id`, `option_id`, `user_id`, `created_at`

## Key Features

- **Automatic vote counting**: Triggers automatically update vote counts when votes are added/removed
- **Row Level Security (RLS)**: Proper security policies for data access
- **Poll expiration**: Support for polls with expiration dates
- **Multiple vote support**: Configurable to allow or disallow multiple votes per user
- **Performance optimized**: Proper indexes for fast queries

## Applying the Migration

### Option 1: Using Supabase CLI

```bash
# If you have Supabase CLI installed
supabase db push
```

### Option 2: Using Supabase Dashboard

1. Go to your Supabase project dashboard
2. Navigate to the SQL Editor
3. Copy and paste the contents of `001_create_polls_schema.sql`
4. Run the migration

### Option 3: Using psql

```bash
psql -h your-db-host -U postgres -d postgres -f supabase/migrations/001_create_polls_schema.sql
```

## Database Functions

The schema includes several useful functions:

- `can_user_vote(poll_id, user_id, option_id)`: Checks if a user can vote on a specific option
- `is_poll_active(poll_id)`: Checks if a poll is active and not expired
- `update_poll_total_votes()`: Automatically updates total vote count
- `update_option_votes()`: Automatically updates option vote count

## Views

- `polls_with_author`: A view that joins polls with author information from the auth.users table

## Security

All tables have Row Level Security (RLS) enabled with appropriate policies:

- Users can view all polls and options
- Users can only create/modify their own polls
- Users can only vote on active polls
- Vote restrictions are enforced based on poll settings
