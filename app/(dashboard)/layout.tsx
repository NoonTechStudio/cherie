import { redirect } from 'next/navigation'
import { AppShell } from '@/components/layout/app-shell'
import { getUser, getBusinessProfile, getUserProfile } from '@/lib/supabase/queries'
import { daysRemaining } from '@/lib/trial'

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
    const days = profile?.trial_expires_at ? daysRemaining(profile.trial_expires_at) : null
    if (days === null || days <= 0) redirect('/plans')
  } else if (status === 'active') {
    const days = profile?.subscription_expires_at ? daysRemaining(profile.subscription_expires_at) : null
    if (days === null || days <= 0) redirect('/plans')
  } else {
    redirect('/plans')
  }

  return (
    <AppShell businessName={business.business_name ?? null}>
      {children}
    </AppShell>
  )
}
