# Environment Variables Setup

To use Supabase authentication in your polling app, you need to set up the following environment variables in your `.env.local` file:

## Required Variables

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Supabase Service Role Key (for server-side operations)
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```

## How to Get These Values

1. **Go to your Supabase project dashboard**
2. **Navigate to Settings > API**
3. **Copy the following values:**
   - Project URL → `NEXT_PUBLIC_SUPABASE_URL`
   - anon/public key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - service_role key → `SUPABASE_SERVICE_ROLE_KEY`

## Example .env.local File

```bash
NEXT_PUBLIC_SUPABASE_URL=https://abcdefghijklmnop.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## Security Notes

- **Never commit your `.env.local` file to version control**
- **The `SUPABASE_SERVICE_ROLE_KEY` has admin privileges - keep it secure**
- **Only use the service role key in server-side code**
- **The anon key is safe to expose in client-side code**
