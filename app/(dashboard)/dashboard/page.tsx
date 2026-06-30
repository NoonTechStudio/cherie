import Link from 'next/link'
import { redirect } from 'next/navigation'
import { Clock, CalendarDays, TrendingUp, ChevronRight, Sparkles } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { getUser, getBusinessProfile, getUserProfile } from '@/lib/supabase/queries'
import { OnboardingTour } from '@/components/onboarding/tour'

const AVATAR_COLORS = [
  { bg: '#FBEAF0', text: '#993556' },
  { bg: '#EEEDFE', text: '#3C3489' },
  { bg: '#E1F5EE', text: '#085041' },
]

function getInitials(name: string): string {
  return name
    .split(' ')
    .map((n) => n[0] ?? '')
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

function formatDate(dateStr: string): string {
  const date = new Date(dateStr + 'T00:00:00')
  return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })
}

function getWeekBounds(): { start: string; end: string } {
  const now = new Date()
  const day = now.getDay()
  const diffToMon = day === 0 ? -6 : 1 - day
  const mon = new Date(now)
  mon.setDate(now.getDate() + diffToMon)
  const sun = new Date(mon)
  sun.setDate(mon.getDate() + 6)
  return {
    start: mon.toISOString().split('T')[0],
    end: sun.toISOString().split('T')[0],
  }
}

export default async function DashboardPage() {
  const user = await getUser()
  if (!user) redirect('/login')

  const business = await getBusinessProfile(user.id)
  if (!business) redirect('/setup-business')

  const today = new Date().toISOString().split('T')[0]
  const { start: weekStart, end: weekEnd } = getWeekBounds()

  const supabase = await createClient()
  const [
    { count: todayCount },
    { count: weekCount },
    { data: todayAppointments },
    { data: upcoming },
    userProfile,
  ] = await Promise.all([
    supabase
      .from('appointments')
      .select('*', { count: 'exact', head: true })
      .eq('business_id', business.id)
      .eq('start_date', today),
    supabase
      .from('appointments')
      .select('*', { count: 'exact', head: true })
      .eq('business_id', business.id)
      .gte('start_date', weekStart)
      .lte('start_date', weekEnd),
    supabase
      .from('appointments')
      .select('client_name, service_type, start_time')
      .eq('business_id', business.id)
      .eq('start_date', today)
      .eq('status', 'confirmed')
      .order('start_time', { ascending: true }),
    supabase
      .from('appointments')
      .select('id, client_name, service_type, start_date')
      .eq('business_id', business.id)
      .gte('start_date', today)
      .order('start_date', { ascending: true })
      .limit(5),
    getUserProfile(user.id),
  ])

  const isOnTrial = userProfile?.subscription_status === 'trial'

  const expiryDate = isOnTrial
    ? (userProfile?.trial_expires_at ? new Date(userProfile.trial_expires_at) : null)
    : (userProfile?.subscription_expires_at ? new Date(userProfile.subscription_expires_at) : null)

  const expiresInDays = expiryDate
    ? Math.ceil((expiryDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24))
    : null

  const confirmedToday = todayAppointments ?? []

  function formatTime(val: string | null) {
    if (!val) return null
    const [hStr, mStr] = val.split(':')
    const h = parseInt(hStr, 10)
    const period = h >= 12 ? 'PM' : 'AM'
    const h12 = h % 12 === 0 ? 12 : h % 12
    return `${h12}:${mStr} ${period}`
  }

  return (
    <div className="space-y-5">
      <OnboardingTour />

      {/* Today's appointment highlight banner */}
      {confirmedToday.length > 0 && (
        <div className="bg-[#6B0F1A] rounded-2xl p-4 shadow-lg shadow-[#6B0F1A]/20">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="w-4 h-4 text-white/80" />
            <p className="text-[12px] font-semibold text-white/80 uppercase tracking-wide">Today's Schedule</p>
          </div>
          <p className="text-[22px] font-bold text-white leading-tight mb-3">
            {confirmedToday.length === 1
              ? 'You have 1 appointment today'
              : `You have ${confirmedToday.length} appointments today`}
          </p>
          <div className="space-y-2">
            {confirmedToday.slice(0, 3).map((apt, i) => (
              <div key={i} className="flex items-center gap-2.5 bg-white/10 rounded-xl px-3 py-2">
                <div className="w-1.5 h-1.5 rounded-full bg-white/60 shrink-0" />
                <p className="text-[13px] font-semibold text-white truncate flex-1">{apt.client_name}</p>
                <p className="text-[12px] text-white/60 shrink-0">{apt.service_type}</p>
                {apt.start_time && (
                  <p className="text-[12px] font-semibold text-white/80 shrink-0">{formatTime(apt.start_time)}</p>
                )}
              </div>
            ))}
            {confirmedToday.length > 3 && (
              <p className="text-[12px] text-white/60 text-center pt-1">
                +{confirmedToday.length - 3} more
              </p>
            )}
          </div>
          <Link
            href="/appointments"
            className="mt-3 flex items-center justify-center gap-1 bg-white/15 rounded-xl py-2.5 text-[13px] font-semibold text-white"
          >
            View all bookings <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      )}

      {/* Trial / renewal banner */}
      {isOnTrial && expiresInDays !== null && (
        <div className="bg-[#FFF8E7] border border-amber-200/80 rounded-2xl p-4 flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-amber-100 flex items-center justify-center shrink-0">
            <Clock className="w-4 h-4 text-amber-600" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[13px] font-semibold text-amber-900">
              {expiresInDays <= 0 ? 'Free trial ended' : `${expiresInDays} day${expiresInDays === 1 ? '' : 's'} of free trial left`}
            </p>
            <p className="text-[12px] text-amber-700 mt-0.5">Subscribe to keep your bookings</p>
          </div>
          <Link href="/plans" className="text-[13px] font-semibold text-amber-800 bg-amber-100 px-3 py-1.5 rounded-lg shrink-0">
            View Plans
          </Link>
        </div>
      )}

      {!isOnTrial && expiresInDays !== null && expiresInDays <= 7 && (
        <div className="bg-amber-50 border border-amber-200/80 rounded-2xl p-4 flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-amber-100 flex items-center justify-center shrink-0">
            <Clock className="w-4 h-4 text-amber-600" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[13px] font-semibold text-amber-900">
              {expiresInDays <= 0 ? 'Subscription expired' : `${expiresInDays} day${expiresInDays === 1 ? '' : 's'} left`}
            </p>
            <p className="text-[12px] text-amber-700 mt-0.5">Renew to continue using Chérie</p>
          </div>
          <Link href="/plans" className="text-[13px] font-semibold text-amber-800 bg-amber-100 px-3 py-1.5 rounded-lg shrink-0">
            Renew
          </Link>
        </div>
      )}

      {/* Stat cards */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-white rounded-2xl p-4 shadow-sm">
          <div className="w-8 h-8 rounded-full bg-[#FFF0F0] flex items-center justify-center mb-3">
            <CalendarDays className="w-4 h-4 text-[#6B0F1A]" />
          </div>
          <p className="text-[30px] font-bold text-[#1C1C1E] leading-none">{todayCount ?? 0}</p>
          <p className="text-[12px] text-[#8E8E93] mt-1 font-medium">Today</p>
        </div>
        <div className="bg-white rounded-2xl p-4 shadow-sm">
          <div className="w-8 h-8 rounded-full bg-[#F0F4FF] flex items-center justify-center mb-3">
            <TrendingUp className="w-4 h-4 text-[#3C3489]" />
          </div>
          <p className="text-[30px] font-bold text-[#1C1C1E] leading-none">{weekCount ?? 0}</p>
          <p className="text-[12px] text-[#8E8E93] mt-1 font-medium">This Week</p>
        </div>
      </div>

      {/* Upcoming appointments */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <p className="text-[17px] font-semibold text-[#1C1C1E]">Upcoming</p>
          <Link href="/appointments" className="text-[14px] font-semibold text-[#6B0F1A] flex items-center gap-0.5">
            See all <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        {!upcoming || upcoming.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm py-10 flex flex-col items-center text-center px-4">
            <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center mb-3">
              <CalendarDays className="w-5 h-5 text-[#C7C7CC]" />
            </div>
            <p className="text-[14px] font-semibold text-[#1C1C1E]">No upcoming appointments</p>
            <p className="text-[13px] text-[#8E8E93] mt-1">Tap + to add your first booking</p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
            {upcoming.map((apt, i) => {
              const colors = AVATAR_COLORS[i % 3]
              const initials = getInitials(apt.client_name ?? '?')
              return (
                <div
                  key={apt.id}
                  className={`flex items-center gap-3 px-4 py-3.5 ${i < upcoming.length - 1 ? 'border-b border-[#E5E5EA]' : ''}`}
                >
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 text-[12px] font-semibold"
                    style={{ backgroundColor: colors.bg, color: colors.text }}
                  >
                    {initials}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[14px] font-semibold text-[#1C1C1E] leading-tight truncate">
                      {apt.client_name}
                    </p>
                    <p className="text-[12px] text-[#8E8E93] mt-0.5 truncate">{apt.service_type}</p>
                  </div>
                  <div className="shrink-0 text-right">
                    <p className="text-[12px] font-medium text-[#8E8E93]">{formatDate(apt.start_date)}</p>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
