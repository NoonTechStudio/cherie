'use server'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export async function setupBusinessAction(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const businessName = (formData.get('businessName') as string | null)?.trim() ?? ''
  const category = (formData.get('category') as string | null) ?? ''

  if (!businessName || !category) return

  await supabase.from('business_profiles').upsert(
    { user_id: user.id, business_name: businessName, category },
    { onConflict: 'user_id' }
  )

  redirect('/dashboard')
}
