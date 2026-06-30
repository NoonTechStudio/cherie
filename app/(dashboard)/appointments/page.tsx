import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { getUser, getBusinessProfile } from '@/lib/supabase/queries'
import AppointmentsList from '@/components/appointments/appointments-list'

export default async function AppointmentsPage() {
  const user = await getUser()
  if (!user) redirect('/login')

  const business = await getBusinessProfile(user.id)
  if (!business) redirect('/setup-business')

  const supabase = await createClient()
  const { data: appointments } = await supabase
    .from('appointments')
    .select(
      'id, client_name, client_mobile, client_address, service_type, booking_type, start_date, end_date, status'
    )
    .eq('business_id', business.id)
    .order('start_date', { ascending: true })

  return <AppointmentsList appointments={appointments ?? []} />
}
