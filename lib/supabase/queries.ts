import { cache } from 'react'
import { unstable_cache } from 'next/cache'
import { createClient } from './server'

// Deduplicated per-request: calling getUser() multiple times in one render
// (layout + page) only hits Supabase once.
export const getUser = cache(async () => {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  return user
})

// Deduplicated per-request AND cached across requests for 60s.
// Business name/category rarely changes so this is safe.
export const getBusinessProfile = cache(async (userId: string) => {
  const supabase = await createClient()
  const { data } = await supabase
    .from('business_profiles')
    .select('id, business_name, category, address')
    .eq('user_id', userId)
    .single()
  return data
})

// Cache user subscription info for 30s (needs to stay relatively fresh)
export const getUserProfile = cache(async (userId: string) => {
  const supabase = await createClient()
  const { data } = await supabase
    .from('users')
    .select('mobile, name, address, city, subscription_status, subscription_expires_at, trial_expires_at')
    .eq('id', userId)
    .single()
  return data
})
