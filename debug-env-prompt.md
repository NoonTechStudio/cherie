# Debug: Supabase client init error

Getting this error on /register and /payment:
"Error: @supabase/ssr: Your project's URL and API key are required to create a Supabase client"

## Tasks

1. Read `.env.local` (don't print secret values, just confirm variable names present and non-empty).
2. Check `lib/supabase/client.ts` and `lib/supabase/server.ts` — confirm they read `process.env.NEXT_PUBLIC_SUPABASE_URL` and `process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY` with exact matching names (case-sensitive, no typos).
3. Check if `.env.local` is in project root (same level as package.json) — run `ls -la` to confirm.
4. Check if there's a `.env` file that might be overriding or conflicting — Next.js loads `.env` then `.env.local` overrides it, but if `.env` has empty/wrong values for the same keys with different casing, it can cause issues.
5. Confirm dev server was fully restarted after .env.local was edited (check terminal for "Reload env" or restart timestamp).
6. Report findings and fix any mismatch found.
