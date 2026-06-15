# Chérie — Step 2b: Registration Form (Auth)

Build the actual register/login forms — needed to test the payment flow from Step 2.

## Tasks

1. **`app/(auth)/register/page.tsx`**:
   - Mobile-first form, cream bg, Chérie logo at top
   - Fields: Mobile number (10 digits, validated), Password (min 6 chars), Confirm password
   - On submit:
     - Use Supabase Auth `signUp` with mobile as a pseudo-email (e.g. `${mobile}@cherie.app`) or use Supabase phone auth if simpler — pick whichever requires less config for now
     - Insert row into `users` table with `mobile`, `subscription_status='payment_pending'`
     - On success, redirect to `/payment`
   - Show inline validation errors, loading state on submit button

2. **`app/(auth)/login/page.tsx`**:
   - Fields: Mobile number, Password
   - On submit: Supabase `signInWithPassword`
   - On success: redirect to `/dashboard` (middleware will bounce to `/payment` if subscription inactive)
   - Link to `/register` for new users

3. **Link the pages**: Add a "Register" link on login page and "Already have an account? Login" on register page.

4. Keep styling consistent: burgundy headings, cream bg, shadcn `Input`, `Button`, `Card`, `Label` components already installed.

Run dev server, confirm `/register` shows a working form (not just a heading).
