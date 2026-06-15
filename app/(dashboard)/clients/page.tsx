import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import ClientsList, { type ClientSummary } from '@/components/clients/clients-list'

export default async function ClientsPage() {
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
    .order('start_date', { ascending: false })

  const allApts = appointments ?? []

  // Derive unique clients from appointments, grouped by client_mobile.
  // Query is DESC so first encounter per mobile = most recent appointment.
  const clientMap = new Map<string, ClientSummary>()
  for (const apt of allApts) {
    const existing = clientMap.get(apt.client_mobile)
    if (!existing) {
      clientMap.set(apt.client_mobile, {
        client_name: apt.client_name,
        client_mobile: apt.client_mobile,
        client_address: apt.client_address,
        total_visits: 1,
        last_visit: apt.start_date,
        last_service: apt.service_type,
      })
    } else {
      existing.total_visits++
      if (apt.client_address && !existing.client_address) {
        existing.client_address = apt.client_address
      }
    }
  }

  const clients: ClientSummary[] = Array.from(clientMap.values()).sort((a, b) =>
    b.last_visit.localeCompare(a.last_visit)
  )

  return <ClientsList clients={clients} appointments={allApts} />
}
