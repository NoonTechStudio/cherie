import { redirect } from 'next/navigation'
import { AppShell } from '@/components/layout/app-shell'
import { getUser, getBusinessProfile, getUserProfile } from '@/lib/supabase/queries'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const user = await getUser()
  if (!user) redirect('/login')

  const business = await getBusinessProfile(user.id)
  if (!business) redirect('/setup-business')

  // Enforce trial / subscription gate
  const profile = await getUserProfile(user.id)
  const status = profile?.subscription_status

  if (status === 'trial') {
    const trialExpiry = profile?.trial_expires_at ? new Date(profile.trial_expires_at) : null
    if (!trialExpiry || trialExpiry < new Date()) redirect('/plans')
  } else if (status === 'active') {
    const subExpiry = profile?.subscription_expires_at ? new Date(profile.subscription_expires_at) : null
    if (!subExpiry || subExpiry < new Date()) redirect('/plans')
  } else if (!status || status === 'expired') {
    redirect('/plans')
  }

  return (
    <AppShell businessName={business.business_name ?? null}>
      {children}
    </AppShell>
  )
}
