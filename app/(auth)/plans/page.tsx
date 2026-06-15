import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import PlansUI from './plans-ui'

export default async function PlansPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  // Check subscription status
  const { data: profile } = await supabase
    .from('users')
    .select('subscription_status, trial_expires_at, subscription_expires_at')
    .eq('id', user.id)
    .single()

  const isOnTrial = profile?.subscription_status === 'trial'
  const expiryDateStr = isOnTrial
    ? profile?.trial_expires_at
    : profile?.subscription_expires_at

  const expiresInDays = expiryDateStr
    ? Math.ceil((new Date(expiryDateStr).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
    : null

  return (
    <PlansUI
      subscriptionStatus={profile?.subscription_status ?? null}
      expiresInDays={expiresInDays}
    />
  )
}
