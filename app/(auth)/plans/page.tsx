import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import PlansUI from './plans-ui'
import { daysRemaining } from '@/lib/trial'

export default async function PlansPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  // Check subscription status
  const { data: profile } = await supabase
    .from('users')
    .select('subscription_status, trial_expires_at, subscription_expires_at, name, mobile')
    .eq('id', user.id)
    .single()

  const isOnTrial = profile?.subscription_status === 'trial'
  const expiryDateStr = isOnTrial ? profile?.trial_expires_at : profile?.subscription_expires_at
  const expiresInDays = expiryDateStr ? daysRemaining(expiryDateStr) : null

  return (
    <PlansUI
      subscriptionStatus={profile?.subscription_status ?? null}
      expiresInDays={expiresInDays}
      userMobile={profile?.mobile ?? null}
      userName={profile?.name ?? null}
    />
  )
}
