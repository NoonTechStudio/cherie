-- Enable UUID extension
create extension if not exists "pgcrypto";

-- Users table (mirrors auth.users)
create table if not exists public.users (
  id uuid references auth.users(id) on delete cascade primary key,
  mobile text unique,
  name text,
  address text,
  city text,
  subscription_status text not null default 'trial',
  subscription_expires_at timestamptz,
  trial_expires_at timestamptz,
  payment_intent_id text,
  created_at timestamptz not null default now()
);

-- Business profiles
create table if not exists public.business_profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.users(id) on delete cascade unique,
  business_name text,
  category text check (category in ('heena_artist', 'beauty_parlor')),
  address text,
  operating_hours jsonb,
  created_at timestamptz not null default now()
);

-- Appointments
create table if not exists public.appointments (
  id uuid primary key default gen_random_uuid(),
  business_id uuid references public.business_profiles(id) on delete cascade,
  client_name text,
  client_mobile text,
  client_address text,
  service_type text,
  booking_type text check (booking_type in ('single_day', 'date_range')),
  start_date date,
  end_date date,
  status text not null default 'confirmed',
  created_at timestamptz not null default now()
);

-- Failed notifications
create table if not exists public.failed_notifications (
  id uuid primary key default gen_random_uuid(),
  appointment_id uuid references public.appointments(id) on delete cascade,
  error_message text,
  retry_count int not null default 0,
  created_at timestamptz not null default now()
);

-- RLS
alter table public.users enable row level security;
alter table public.business_profiles enable row level security;
alter table public.appointments enable row level security;
alter table public.failed_notifications enable row level security;

-- Users: own row only
create policy "users_own_row" on public.users
  for all using (auth.uid() = id);

-- Business profiles: own profile only
create policy "business_profiles_own" on public.business_profiles
  for all using (
    auth.uid() = user_id
  );

-- Appointments: business owner only
create policy "appointments_own_business" on public.appointments
  for all using (
    exists (
      select 1 from public.business_profiles bp
      where bp.id = appointments.business_id
        and bp.user_id = auth.uid()
    )
  );

-- Failed notifications: business owner only
create policy "failed_notifications_own_business" on public.failed_notifications
  for all using (
    exists (
      select 1 from public.appointments a
      join public.business_profiles bp on bp.id = a.business_id
      where a.id = failed_notifications.appointment_id
        and bp.user_id = auth.uid()
    )
  );

-- Payment audit log
create table public.payments_log (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.users(id) on delete cascade,
  razorpay_payment_id text,
  razorpay_order_id text,
  amount integer, -- in paise
  plan_months integer default 1,
  status text, -- 'captured' | 'failed'
  event_type text, -- 'payment.captured' | 'payment.failed' | 'payment.captured_fallback'
  created_at timestamptz default now()
);

alter table public.payments_log enable row level security;

create policy "payments_log_own_user" on public.payments_log
  for select using (user_id = auth.uid());
