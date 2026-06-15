'use client'

import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { createClient } from '@/lib/supabase/client'
import {
  Building2,
  Phone,
  MapPin,
  Tag,
  CreditCard,
  Calendar,
  BadgeCheck,
  LogOut,
  ChevronRight,
} from 'lucide-react'
import Link from 'next/link'

const CATEGORY_LABELS: Record<string, string> = {
  heena_artist: 'Heena Artist',
  beauty_parlor: 'Beauty Parlor',
}

interface SettingsPanelProps {
  mobile: string | null
  subscriptionStatus: string | null
  subscriptionExpiresAt: string | null
  expiresInDays: number | null
  businessName: string | null
  category: string | null
  address: string | null
}

function InfoRow({
  icon: Icon,
  label,
  value,
  last,
}: {
  icon: React.ElementType
  label: string
  value: string
  last?: boolean
}) {
  return (
    <div className={`flex items-center gap-3 px-4 py-3.5 ${!last ? 'border-b border-[#E5E5EA]' : ''}`}>
      <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center shrink-0">
        <Icon className="w-4 h-4 text-[#6B0F1A]" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[11px] text-[#8E8E93] font-medium">{label}</p>
        <p className="text-[14px] text-[#1C1C1E] font-medium truncate">{value}</p>
      </div>
    </div>
  )
}

function subscriptionLabel(status: string | null, expiresInDays: number | null): string {
  if (status === 'trial') {
    if (expiresInDays === null || expiresInDays <= 0) return 'Trial ended'
    return `Free trial · ${expiresInDays}d left`
  }
  if (status === 'active') {
    if (expiresInDays === null) return 'Active'
    if (expiresInDays <= 0) return 'Expired'
    return `Active · ${expiresInDays}d left`
  }
  if (status === 'payment_pending') return 'Payment pending'
  return status ?? 'Unknown'
}

export function SettingsPanel({
  mobile,
  subscriptionStatus,
  subscriptionExpiresAt,
  expiresInDays,
  businessName,
  category,
  address,
}: SettingsPanelProps) {
  const router = useRouter()

  async function handleSignOut() {
    const supabase = createClient()
    await supabase.auth.signOut()
    toast.success('Signed out')
    router.push('/login')
  }

  const subLabel = subscriptionLabel(subscriptionStatus, expiresInDays)
  const subColor = subscriptionStatus === 'active' && (expiresInDays === null || expiresInDays > 0)
    ? 'text-[#085041]'
    : 'text-red-500'

  const expiryFormatted = subscriptionExpiresAt
    ? new Date(subscriptionExpiresAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
    : '—'

  return (
    <div className="pt-1 space-y-5">
      <p className="text-[22px] font-bold text-[#1C1C1E]">Settings</p>

      {/* Business profile */}
      <div>
        <p className="text-[12px] font-semibold text-[#8E8E93] uppercase tracking-wide mb-2 px-1">Business</p>
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <InfoRow icon={Building2} label="Business Name" value={businessName ?? '—'} />
          <InfoRow icon={Tag} label="Category" value={category ? (CATEGORY_LABELS[category] ?? category) : '—'} />
          <InfoRow icon={MapPin} label="Address" value={address ?? '—'} last />
        </div>
      </div>

      {/* Account */}
      <div>
        <p className="text-[12px] font-semibold text-[#8E8E93] uppercase tracking-wide mb-2 px-1">Account</p>
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <InfoRow icon={Phone} label="Mobile Number" value={mobile ?? '—'} last />
        </div>
      </div>

      {/* Subscription */}
      <div>
        <p className="text-[12px] font-semibold text-[#8E8E93] uppercase tracking-wide mb-2 px-1">Subscription</p>
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="flex items-center gap-3 px-4 py-3.5 border-b border-[#E5E5EA]">
            <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center shrink-0">
              <BadgeCheck className="w-4 h-4 text-[#6B0F1A]" />
            </div>
            <div className="flex-1">
              <p className="text-[11px] text-[#8E8E93] font-medium">Status</p>
              <p className={`text-[14px] font-semibold ${subColor}`}>{subLabel}</p>
            </div>
            {(subscriptionStatus !== 'active' || (expiresInDays !== null && expiresInDays <= 7)) && (
              <Link href="/plans" className="text-[13px] font-semibold text-[#6B0F1A] bg-[#FFF0F0] px-3 py-1.5 rounded-lg shrink-0">
                {subscriptionStatus === 'active' ? 'Renew' : 'Subscribe'}
              </Link>
            )}
          </div>
          <InfoRow icon={Calendar} label="Expires on" value={expiryFormatted} last />
        </div>
      </div>

      {/* Sign out */}
      <div>
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <button
            onClick={handleSignOut}
            className="w-full flex items-center gap-3 px-4 py-3.5 text-left active:bg-red-50 transition-colors"
          >
            <div className="w-8 h-8 rounded-lg bg-red-50 flex items-center justify-center shrink-0">
              <LogOut className="w-4 h-4 text-red-500" />
            </div>
            <p className="flex-1 text-[15px] font-semibold text-red-500">Sign Out</p>
            <ChevronRight className="w-4 h-4 text-[#C7C7CC]" />
          </button>
        </div>
      </div>

      <p className="text-center text-[12px] text-[#C7C7CC] pb-2">Chérie · Made with ♥ for beauty pros</p>
    </div>
  )
}
