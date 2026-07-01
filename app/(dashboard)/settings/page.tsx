import { redirect } from 'next/navigation'
import { getUser, getBusinessProfile, getUserProfile } from '@/lib/supabase/queries'
import { SettingsPanel } from '@/components/settings/settings-panel'

export default async function SettingsPage() {
  const user = await getUser()
  if (!user) redirect('/login')

  const [profile, business] = await Promise.all([
    getUserProfile(user.id),
    getBusinessProfile(user.id),
  ])

  if (!business) redirect('/setup-business')

  const isOnTrial = profile?.subscription_status === 'trial'
  const expiryDateStr = isOnTrial ? profile?.trial_expires_at : profile?.subscription_expires_at
  const expiresInDays = expiryDateStr
    ? Math.floor((new Date(expiryDateStr).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
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
