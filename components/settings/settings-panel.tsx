'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { createClient } from '@/lib/supabase/client'
import {
  Building2, Phone, MapPin, Tag, CreditCard, Calendar,
  BadgeCheck, LogOut, ChevronRight, Pencil, Check, X,
} from 'lucide-react'
import Link from 'next/link'

const CATEGORY_LABELS: Record<string, string> = {
  heena_artist: 'Heena Artist',
  beauty_parlor: 'Beauty Parlor',
}

interface SettingsPanelProps {
  mobile: string | null
  name: string | null
  address: string | null
  city: string | null
  subscriptionStatus: string | null
  subscriptionExpiresAt: string | null
  expiresInDays: number | null
  businessName: string | null
  category: string | null
  businessAddress: string | null
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

function InfoRow({
  icon: Icon, label, value, last,
}: {
  icon: React.ElementType; label: string; value: string; last?: boolean
}) {
  return (
    <div className={`flex items-center gap-3 px-4 py-3.5 ${!last ? 'border-b border-[#E5E5EA]' : ''}`}>
      <div className="w-8 h-8 rounded-lg bg-[#F5F5F5] flex items-center justify-center shrink-0">
        <Icon className="w-4 h-4 text-[#6B0F1A]" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[11px] text-[#8E8E93] font-medium">{label}</p>
        <p className="text-[14px] text-[#1C1C1E] font-medium truncate">{value || '—'}</p>
      </div>
    </div>
  )
}

function EditableRow({
  icon: Icon, label, value, onSave, last, type = 'text',
}: {
  icon: React.ElementType; label: string; value: string; onSave: (v: string) => Promise<void>; last?: boolean; type?: string
}) {
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState(value)
  const [saving, setSaving] = useState(false)

  async function save() {
    if (!draft.trim()) return
    setSaving(true)
    await onSave(draft.trim())
    setSaving(false)
    setEditing(false)
  }

  function cancel() {
    setDraft(value)
    setEditing(false)
  }

  return (
    <div className={`px-4 py-3.5 ${!last ? 'border-b border-[#E5E5EA]' : ''}`}>
      {editing ? (
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-[#F5F5F5] flex items-center justify-center shrink-0">
            <Icon className="w-4 h-4 text-[#6B0F1A]" />
          </div>
          <input
            autoFocus
            type={type}
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            className="flex-1 text-[14px] text-[#1C1C1E] border-b border-[#6B0F1A] bg-transparent outline-none pb-0.5"
          />
          <button onClick={save} disabled={saving} className="w-7 h-7 rounded-full bg-[#6B0F1A] flex items-center justify-center shrink-0">
            <Check className="w-3.5 h-3.5 text-white" strokeWidth={3} />
          </button>
          <button onClick={cancel} className="w-7 h-7 rounded-full bg-[#F5F5F5] flex items-center justify-center shrink-0">
            <X className="w-3.5 h-3.5 text-[#8E8E93]" />
          </button>
        </div>
      ) : (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-[#F5F5F5] flex items-center justify-center shrink-0">
            <Icon className="w-4 h-4 text-[#6B0F1A]" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[11px] text-[#8E8E93] font-medium">{label}</p>
            <p className="text-[14px] text-[#1C1C1E] font-medium truncate">{value || '—'}</p>
          </div>
          <button onClick={() => { setDraft(value); setEditing(true) }} className="p-1.5 rounded-lg hover:bg-[#F5F5F5] shrink-0">
            <Pencil className="w-3.5 h-3.5 text-[#8E8E93]" />
          </button>
        </div>
      )}
    </div>
  )
}

function CategoryRow({ value, onSave, last }: { value: string; onSave: (v: string) => Promise<void>; last?: boolean }) {
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState(value)
  const [saving, setSaving] = useState(false)

  async function save() {
    setSaving(true)
    await onSave(draft)
    setSaving(false)
    setEditing(false)
  }

  return (
    <div className={`px-4 py-3.5 ${!last ? 'border-b border-[#E5E5EA]' : ''}`}>
      {editing ? (
        <div className="flex items-start gap-2">
          <div className="w-8 h-8 rounded-lg bg-[#F5F5F5] flex items-center justify-center shrink-0 mt-0.5">
            <Tag className="w-4 h-4 text-[#6B0F1A]" />
          </div>
          <div className="flex-1 space-y-2">
            {Object.entries(CATEGORY_LABELS).map(([key, label]) => (
              <button key={key} onClick={() => setDraft(key)}
                className={`w-full text-left px-3 py-2 rounded-xl text-[14px] font-medium border transition-colors ${draft === key ? 'bg-[#6B0F1A] text-white border-[#6B0F1A]' : 'bg-[#F5F5F5] text-[#1C1C1E] border-transparent'}`}>
                {label}
              </button>
            ))}
            <div className="flex gap-2 pt-1">
              <button onClick={save} disabled={saving}
                className="flex-1 bg-[#6B0F1A] text-white rounded-xl py-2 text-[13px] font-semibold">
                {saving ? 'Saving…' : 'Save'}
              </button>
              <button onClick={() => { setDraft(value); setEditing(false) }}
                className="flex-1 bg-[#F5F5F5] text-[#1C1C1E] rounded-xl py-2 text-[13px] font-semibold">
                Cancel
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-[#F5F5F5] flex items-center justify-center shrink-0">
            <Tag className="w-4 h-4 text-[#6B0F1A]" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[11px] text-[#8E8E93] font-medium">Category</p>
            <p className="text-[14px] text-[#1C1C1E] font-medium">{value ? (CATEGORY_LABELS[value] ?? value) : '—'}</p>
          </div>
          <button onClick={() => setEditing(true)} className="p-1.5 rounded-lg hover:bg-[#F5F5F5] shrink-0">
            <Pencil className="w-3.5 h-3.5 text-[#8E8E93]" />
          </button>
        </div>
      )}
    </div>
  )
}

export function SettingsPanel({
  mobile, name, address, city,
  subscriptionStatus, subscriptionExpiresAt, expiresInDays,
  businessName, category, businessAddress,
}: SettingsPanelProps) {
  const router = useRouter()
  const supabase = createClient()

  async function updateBusiness(field: string, value: string) {
    const { error } = await supabase
      .from('business_profiles')
      .update({ [field]: value })
      .eq('user_id', (await supabase.auth.getUser()).data.user!.id)
    if (error) toast.error('Failed to save')
    else { toast.success('Saved'); router.refresh() }
  }

  async function updateProfile(field: string, value: string) {
    const { error } = await supabase
      .from('users')
      .update({ [field]: value })
      .eq('id', (await supabase.auth.getUser()).data.user!.id)
    if (error) toast.error('Failed to save')
    else { toast.success('Saved'); router.refresh() }
  }

  async function handleSignOut() {
    await supabase.auth.signOut()
    toast.success('Signed out')
    router.push('/login')
  }

  const subLabel = subscriptionLabel(subscriptionStatus, expiresInDays)
  const subColor = subscriptionStatus === 'active' && (expiresInDays === null || expiresInDays > 0)
    ? 'text-[#085041]' : 'text-red-500'
  const expiryFormatted = subscriptionExpiresAt
    ? new Date(subscriptionExpiresAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
    : '—'

  return (
    <div className="pt-1 space-y-5">
      <p className="text-[22px] font-bold text-[#1C1C1E]">Settings</p>

      {/* Business */}
      <div>
        <p className="text-[12px] font-semibold text-[#8E8E93] uppercase tracking-wide mb-2 px-1">Business</p>
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <EditableRow icon={Building2} label="Business Name" value={businessName ?? ''}
            onSave={(v) => updateBusiness('business_name', v)} />
          <CategoryRow value={category ?? ''} onSave={(v) => updateBusiness('category', v)} />
          <EditableRow icon={MapPin} label="Business Address" value={businessAddress ?? ''}
            onSave={(v) => updateBusiness('address', v)} last />
        </div>
      </div>

      {/* Personal */}
      <div>
        <p className="text-[12px] font-semibold text-[#8E8E93] uppercase tracking-wide mb-2 px-1">Personal</p>
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <EditableRow icon={Phone} label="Name" value={name ?? ''}
            onSave={(v) => updateProfile('name', v)} />
          <EditableRow icon={MapPin} label="Address" value={address ?? ''}
            onSave={(v) => updateProfile('address', v)} />
          <InfoRow icon={Phone} label="Mobile Number" value={mobile ?? '—'} last />
        </div>
      </div>

      {/* Subscription */}
      <div>
        <p className="text-[12px] font-semibold text-[#8E8E93] uppercase tracking-wide mb-2 px-1">Subscription</p>
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="flex items-center gap-3 px-4 py-3.5 border-b border-[#E5E5EA]">
            <div className="w-8 h-8 rounded-lg bg-[#F5F5F5] flex items-center justify-center shrink-0">
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
          <button onClick={handleSignOut}
            className="w-full flex items-center gap-3 px-4 py-3.5 text-left active:bg-red-50 transition-colors">
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
