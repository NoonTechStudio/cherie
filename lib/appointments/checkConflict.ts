import { createClient } from '@/lib/supabase/client'

export type ConflictRow = {
  id: string
  client_name: string
  start_date: string
  end_date: string | null
}

export async function checkDateConflict(
  businessId: string,
  startDate: string,
  endDate: string | null
): Promise<ConflictRow[]> {
  const supabase = createClient()
  const rangeEnd = endDate ?? startDate

  const { data } = await supabase
    .from('appointments')
    .select('id, client_name, start_date, end_date')
    .eq('business_id', businessId)
    .eq('status', 'confirmed')

  if (!data) return []

  return data.filter((apt) => {
    const aptEnd = apt.end_date ?? apt.start_date
    // Two ranges overlap when: aptStart <= rangeEnd AND aptEnd >= startDate
    return apt.start_date <= rangeEnd && aptEnd >= startDate
  })
}
