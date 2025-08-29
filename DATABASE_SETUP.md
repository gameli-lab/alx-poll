# Database Setup Guide

This guide will help you set up the Supabase database for your polling app.

## Prerequisites

1. **Supabase Account**: Sign up at [supabase.com](https://supabase.com)
2. **Supabase Project**: Create a new project
3. **Database Access**: You'll need access to the SQL editor

## Step 1: Create Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign in
2. Click "New Project"
3. Choose your organization
4. Enter project details:
   - **Name**: `polling-app` (or your preferred name)
   - **Database Password**: Choose a strong password
   - **Region**: Select the closest region to your users
5. Click "Create new project"
6. Wait for the project to be ready (usually 2-3 minutes)

## Step 2: Get API Keys

1. In your project dashboard, go to **Settings** → **API**
2. Copy these values:
   - **Project URL** → Use for `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public** → Use for `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **service_role** → Use for `SUPABASE_SERVICE_ROLE_KEY`

## Step 3: Set Up Environment Variables

1. Create a `.env.local` file in your project root
2. Add the following variables:

```bash
NEXT_PUBLIC_SUPABASE_URL=your_project_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
```

## Step 4: Run Database Migration

1. In your Supabase dashboard, go to **SQL Editor**
2. Click **New Query**
3. Copy the contents of `supabase/migrations/001_initial_schema.sql`
4. Paste it into the SQL editor
5. Click **Run** to execute the migration

## Step 5: Verify Database Setup

After running the migration, you should see:

### Tables Created

- `profiles` - User profiles
- `polls` - Poll information
- `poll_options` - Poll options/choices
- `votes` - User votes

### Row Level Security (RLS)

- All tables have RLS enabled
- Policies ensure users can only access appropriate data
- Public polls are viewable by everyone
- Private polls are only viewable by creators

### Triggers

- Automatic profile creation on user signup
- Automatic `updated_at` timestamp updates

## Step 6: Test Authentication

1. Start your development server: `npm run dev`
2. Navigate to `/register` to create a test account
3. Check the `profiles` table in Supabase to verify the user was created
4. Try signing in at `/login`

## Database Schema Overview

### Profiles Table

```sql
profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE,
  updated_at TIMESTAMP WITH TIME ZONE
)
```

### Polls Table

```sql
polls (
  id UUID PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  creator_id UUID REFERENCES profiles(id),
  status poll_status DEFAULT 'active',
  end_date TIMESTAMP WITH TIME ZONE,
  is_public BOOLEAN DEFAULT true,
  allow_multiple_votes BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE,
  updated_at TIMESTAMP WITH TIME ZONE
)
```

### Poll Options Table

```sql
poll_options (
  id UUID PRIMARY KEY,
  poll_id UUID REFERENCES polls(id),
  text TEXT NOT NULL,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE
)
```

### Votes Table

```sql
votes (
  id UUID PRIMARY KEY,
  poll_id UUID REFERENCES polls(id),
  option_id UUID REFERENCES poll_options(id),
  voter_id UUID REFERENCES profiles(id),
  created_at TIMESTAMP WITH TIME ZONE,
  UNIQUE(poll_id, voter_id, option_id)
)
```

## Security Features

### Row Level Security (RLS)

- **Profiles**: Users can only access their own profile
- **Polls**: Public polls are viewable by everyone, private polls by creators only
- **Options**: Options are viewable for accessible polls
- **Votes**: Users can only vote once per poll option

### Authentication

- Automatic profile creation on signup
- Secure session management
- Protected routes and API endpoints

## Troubleshooting

### Common Issues

1. **"relation does not exist" error**

   - Make sure you ran the migration in the correct database
   - Check that you're in the right project

2. **Authentication not working**

   - Verify your environment variables are correct
   - Check that the `handle_new_user` trigger was created

3. **RLS blocking queries**
   - Ensure you're authenticated when accessing protected data
   - Check that the RLS policies are correctly applied

### Getting Help

- Check the [Supabase documentation](https://supabase.com/docs)
- Review the [Next.js App Router docs](https://nextjs.org/docs/app)
- Check the console for error messages

## Next Steps

After setting up the database:

1. **Test the authentication flow**
2. **Create some sample polls**
3. **Test voting functionality**
4. **Implement additional features**

Your polling app is now ready with a secure, scalable database backend!
