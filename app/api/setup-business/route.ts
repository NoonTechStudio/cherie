import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  const formData = await request.formData()
  const businessName = (formData.get('businessName') as string | null)?.trim() ?? ''
  const category = (formData.get('category') as string | null) ?? ''

  if (!businessName || !category) {
    return NextResponse.redirect(new URL('/setup-business?error=missing', request.url))
  }

  await supabase.from('business_profiles').upsert(
    { user_id: user.id, business_name: businessName, category },
    { onConflict: 'user_id' }
  )

  // 303 See Other: browser follows redirect as a GET — breaks the POST/redirect/GET pattern cleanly
  return NextResponse.redirect(new URL('/dashboard', request.url), 303)
}
