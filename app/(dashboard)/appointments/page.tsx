import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import AppointmentsList from '@/components/appointments/appointments-list'

export default async function AppointmentsPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: business } = await supabase
    .from('business_profiles')
    .select('id')
    .eq('user_id', user.id)
    .single()
  if (!business) redirect('/setup-business')

  const { data: appointments } = await supabase
    .from('appointments')
    .select(
      'id, client_name, client_mobile, client_address, service_type, booking_type, start_date, end_date, status'
    )
    .eq('business_id', business.id)
    .order('start_date', { ascending: true })

  return <AppointmentsList appointments={appointments ?? []} />
}
