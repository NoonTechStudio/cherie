# Chérie — Step 1: Foundation Setup

App: mobile-first booking SaaS for Heena artists & beauty parlors. Stack: Next.js 15 App Router + TS, Tailwind, shadcn/ui, Supabase (Auth + Postgres).

## Tailwind colors
primary: #6B0F1A, accent: #C0392B, background: #FFF8F5, foreground: #2C1010

## Tasks

1. **shadcn/ui init** (New York style). Install: button, input, card, form, label, select, table, badge, dialog, dropdown-menu, toast, skeleton.

2. **Supabase setup**: install `@supabase/supabase-js` + `@supabase/ssr`. Create `.env.local.example` (NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY, SUPABASE_SERVICE_ROLE_KEY). Create `lib/supabase/client.ts` + `lib/supabase/server.ts` per SSR best practices.

3. **DB schema** at `supabase/schema.sql`:

- `users`: id (uuid, ref auth.users, pk), mobile (text unique), subscription_status (text, default 'payment_pending'), subscription_expires_at (timestamptz), payment_intent_id (text), created_at (timestamptz default now())
- `business_profiles`: id (uuid pk default gen_random_uuid()), user_id (uuid ref users.id unique cascade), business_name (text), category (text: heena_artist|beauty_parlor), address (text), operating_hours (jsonb), created_at
- `appointments`: id (uuid pk default gen_random_uuid()), business_id (uuid ref business_profiles.id cascade), client_name, client_mobile, client_address (text), service_type (text), booking_type (text: single_day|date_range), start_date (date), end_date (date nullable), status (text default 'confirmed'), created_at
- `failed_notifications`: id (uuid pk), appointment_id (ref appointments.id cascade), error_message (text), retry_count (int default 0), created_at

Add RLS so businesses only access their own rows via auth.uid().

4. **`lib/constants.ts`**:
```ts
export const SERVICE_TYPES = {
  heena_artist: ["Bridal Mehendi","Party Mehendi","Arabic Mehendi","Simple/Kids Mehendi"],
  beauty_parlor: ["Bridal Makeup","Party Makeup","Hair Styling","Facial & Cleanup","Waxing & Threading","Nail Art"],
} as const;
```

5. **Routes** (empty page.tsx, just heading + cream bg):
- app/(auth)/login/page.tsx
- app/(auth)/register/page.tsx
- app/(onboarding)/setup-business/page.tsx
- app/(dashboard)/dashboard/page.tsx
- app/(dashboard)/appointments/page.tsx
- app/(dashboard)/appointments/new/page.tsx

6. **app/layout.tsx**: title "Chérie — Booking made simple", cream bg + warm text globally, centered header with `public/logo.png`.

Run dev server, confirm no errors, show final folder structure.
