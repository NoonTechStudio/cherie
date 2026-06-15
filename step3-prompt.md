# Chérie — Step 3: Design System + Dashboard Shell

Redesign UI to a premium, clean SaaS feel (mobile-first). Replace placeholder pages with real layouts.

## Design tokens (update globals.css / tailwind config)
- Background: #FFF8F5 (cream) for page bg, #FFFFFF for cards
- Text primary: #2C1010, text secondary: #6B6258 (muted brown-grey), text tertiary: #9C948A
- Accent (burgundy): #6B0F1A — used ONLY for: floating action button, active nav icon, primary buttons, badges
- Borders: 0.5px solid #E8E2DC throughout
- Font: Inter or system sans-serif. Two weights only: 400 regular, 500 medium. No bold/700.
- Border radius: 8px (cards/inputs), 12px (containers)
- NO header/navbar bar with background color — top bar is transparent/cream, just text + icon

## Components to build

### 1. `components/layout/app-shell.tsx`
Mobile-first shell wrapping all `(dashboard)` pages:
- Top bar: greeting ("Good evening" / "Good morning" based on time) + business name on left, cherry icon badge on right (38px circle, white bg, 0.5px border, contains `public/icons/cherry-mark.png` at ~20px)
- Bottom tab bar (fixed): Home, Bookings, [floating + button raised in center, burgundy #6B0F1A bg, white plus icon, 46px circle], Clients, Settings
- Active tab: burgundy icon + label, inactive: muted grey (#9C948A)
- Use Tabler icons (lucide-react already installed, use equivalents: Home, Calendar, Users, Settings, Plus)

### 2. `app/(dashboard)/dashboard/page.tsx`
- Two stat cards side by side: "Today" (count of today's appointments) and "This week" (count), each bordered, uppercase tracked label, large number (26px/500)
- Subscription renewal banner (bordered, amber clock icon) if expiry ≤7 days — reuse existing renewal-banner component, restyle to match: bordered container, no filled background, small icon in tinted circle
- "Upcoming" section: header with "See all" link, list of next appointments in a single bordered container with hairline dividers between rows (not separate cards) — each row: avatar circle with initials (tinted background, color varies per row from: pink #FBEAF0/#993556, purple #EEEDFE/#3C3489, teal #E1F5EE/#085041), name + service type, time on right

### 3. `app/(onboarding)/setup-business/page.tsx`
Restyle with same design tokens — form fields: Business Name, Category (select: Heena Artist / Beauty Parlor), Address. Bordered inputs, burgundy submit button. On submit, insert into business_profiles, redirect to /dashboard.

### 4. Update `app/layout.tsx`
- Remove old burgundy header
- Body bg #FFF8F5
- Import Inter font via next/font/google

### 5. Update `app/(dashboard)/layout.tsx`
Wrap children in the new `app-shell.tsx`

## Notes
- Cherry icon file is at `public/icons/cherry-mark.png` — use with next/image
- Keep existing data-fetching logic (Supabase queries) from prior steps, just restyle
- Run dev server, confirm dashboard renders with new design, no errors
