# Chérie — Step 2: Payment & Subscription (₹149/mo)

Continue in same project. Razorpay account already exists (live keys available).

## Tasks

1. **Install** `razorpay` npm package.

2. **`.env.local.example`**: add `RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET`, `RAZORPAY_WEBHOOK_SECRET`.

3. **Order creation API** — `app/api/payment/create-order/route.ts`:
   - POST, requires authenticated user (Supabase session)
   - Creates Razorpay order for ₹149 (14900 paise)
   - Attach `notes: { user_id }`
   - Return `order_id`, `razorpay_key` (public key only) to client

4. **Webhook handler** — `app/api/payment/webhook/route.ts`:
   - POST, verify Razorpay signature using `RAZORPAY_WEBHOOK_SECRET`
   - On `payment.captured` event: update `users` table — set `subscription_status='active'`, `subscription_expires_at = now() + 30 days`, `payment_intent_id = payment_id`
   - Use idempotency: skip if `payment_intent_id` already matches (avoid duplicate processing)

5. **Fallback check** — `lib/payment/checkStatus.ts`:
   - Function `checkAndActivateSubscription(userId)`:
     - If user.subscription_status === 'payment_pending' and payment_intent_id exists, call Razorpay API to fetch payment status
     - If `captured`, activate subscription (same logic as webhook)
   - Call this in dashboard layout/middleware before rendering, redirect to `/payment` if still pending

6. **Payment page** — `app/(auth)/payment/page.tsx`:
   - Mobile-first UI, cream bg
   - "Subscribe for ₹149/month" card
   - Button calls create-order API, opens Razorpay Checkout (use `razorpay-checkout` script via Next Script component)
   - On success callback, redirect to `/setup-business`

7. **Subscription middleware** — `middleware.ts` or route-level check:
   - Protect `/dashboard/*` and `/appointments/*` routes
   - If `subscription_status !== 'active'` or `subscription_expires_at < now()`, redirect to `/payment` with a message "Your subscription has expired. Renew for ₹149 to continue."

8. **Renewal banner** — small component shown in dashboard header if `subscription_expires_at` is within 7 days, showing days remaining.

Run dev server, confirm no build errors. Use Razorpay test mode keys for now — note in output where I should replace with live keys.
