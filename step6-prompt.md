# Chérie — Step 6: Payment History Log

Add a lightweight audit table for payment events, for future customer-support lookups.

## 1. SQL — add to `supabase/schema.sql` (and provide as a separate migration snippet to run in SQL Editor)

```sql
create table public.payments_log (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.users(id) on delete cascade,
  razorpay_payment_id text,
  razorpay_order_id text,
  amount integer, -- in paise
  status text, -- 'captured' | 'failed'
  event_type text, -- 'payment.captured' | 'payment.failed'
  created_at timestamptz default now()
);

alter table public.payments_log enable row level security;

create policy "payments_log_own_user" on public.payments_log
  for select using (user_id = auth.uid());
```

## 2. Update webhook handler — `app/api/payment/webhook/route.ts`
After processing `payment.captured` (and optionally `payment.failed`), insert a row into `payments_log`:
- `user_id` from the order's notes
- `razorpay_payment_id`, `razorpay_order_id`
- `amount` (from payload)
- `status` and `event_type` from the webhook event

Use the service-role client (`lib/supabase/service.ts`) for this insert since it's server-side.

## 3. Update fallback check — `lib/payment/checkStatus.ts`
Same logging: when `checkAndActivateSubscription` activates a subscription via the fallback path (not webhook), also insert a `payments_log` row with `event_type: 'payment.captured_fallback'`.

## Output
- Print the SQL to run manually in Supabase SQL Editor (since schema.sql changes don't auto-apply)
- Confirm webhook + fallback code updated, no build errors
