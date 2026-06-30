import { redirect } from 'next/navigation'
import { AppShell } from '@/components/layout/app-shell'
import { getUser, getBusinessProfile } from '@/lib/supabase/queries'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const user = await getUser()
  if (!user) redirect('/login')

  const business = await getBusinessProfile(user.id)
  if (!business) redirect('/setup-business')

  return (
    <AppShell businessName={business.business_name ?? null}>
      {children}
    </AppShell>
  )
}
