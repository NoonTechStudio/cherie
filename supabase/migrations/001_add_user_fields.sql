-- Migration 001: Add user profile fields and trial support
-- Run this in Supabase SQL Editor

-- Add personal info columns to users
ALTER TABLE public.users
  ADD COLUMN IF NOT EXISTS name TEXT,
  ADD COLUMN IF NOT EXISTS address TEXT,
  ADD COLUMN IF NOT EXISTS city TEXT,
  ADD COLUMN IF NOT EXISTS trial_expires_at TIMESTAMPTZ;

-- subscription_status now supports: 'payment_pending' | 'trial' | 'active' | 'expired'
-- No ALTER needed — it's a free-text column already.

-- Add plan_months to payments_log so webhook can set correct expiry
ALTER TABLE public.payments_log
  ADD COLUMN IF NOT EXISTS plan_months INTEGER DEFAULT 1;
