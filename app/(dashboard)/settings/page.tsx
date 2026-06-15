import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { SettingsPanel } from '@/components/settings/settings-panel'

export default async function SettingsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const [{ data: profile }, { data: business }] = await Promise.all([
    supabase
      .from('users')
      .select('mobile, name, address, city, subscription_status, subscription_expires_at, trial_expires_at')
      .eq('id', user.id)
      .single(),
    supabase
      .from('business_profiles')
      .select('business_name, category, address')
      .eq('user_id', user.id)
      .single(),
  ])

  const isOnTrial = profile?.subscription_status === 'trial'
  const expiryDateStr = isOnTrial ? profile?.trial_expires_at : profile?.subscription_expires_at
  const expiresInDays = expiryDateStr
    ? Math.ceil((new Date(expiryDateStr).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
    : null

  return (
    <SettingsPanel
      mobile={profile?.mobile ?? null}
      name={profile?.name ?? null}
      address={profile?.address ?? null}
      city={profile?.city ?? null}
      subscriptionStatus={profile?.subscription_status ?? null}
      subscriptionExpiresAt={expiryDateStr ?? null}
      expiresInDays={expiresInDays}
      businessName={business?.business_name ?? null}
      category={business?.category ?? null}
      businessAddress={business?.address ?? null}
    />
  )
}
