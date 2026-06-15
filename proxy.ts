import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { createServerClient } from '@supabase/ssr'

export async function proxy(request: NextRequest) {
  let response = NextResponse.next({
    request: { headers: request.headers },
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => {
            request.cookies.set(name, value)
          })
          response = NextResponse.next({ request: { headers: request.headers } })
          cookiesToSet.forEach(({ name, value, options }) => {
            response.cookies.set(name, value, options)
          })
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  const { data: profile } = await supabase
    .from('users')
    .select('subscription_status, subscription_expires_at, trial_expires_at')
    .eq('id', user.id)
    .single()

  const now = new Date()

  const isOnActiveTrial =
    profile?.subscription_status === 'trial' &&
    profile?.trial_expires_at != null &&
    new Date(profile.trial_expires_at) > now

  const isOnActiveSubscription =
    profile?.subscription_status === 'active' &&
    profile?.subscription_expires_at != null &&
    new Date(profile.subscription_expires_at) > now

  const isActive = isOnActiveTrial || isOnActiveSubscription

  if (!isActive) {
    return NextResponse.redirect(new URL('/payment', request.url))
  }

  return response
}

export const config = {
  matcher: ['/dashboard/:path*', '/appointments/:path*'],
}
