import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { AppShell } from '@/components/layout/app-shell'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  console.log('DASHBOARD LAYOUT: user.id =', user.id)

  const { data: business, error: bizError } = await supabase
    .from('business_profiles')
    .select('business_name')
    .eq('user_id', user.id)
    .single()

  console.log('DASHBOARD LAYOUT: business =', business, 'bizError =', bizError)

  if (!business) redirect('/setup-business')

  return (
    <AppShell businessName={business.business_name ?? null}>
      {children}
    </AppShell>
  )
}
