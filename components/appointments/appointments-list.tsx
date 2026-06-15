'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { CalendarDays, X, CheckCircle2, XCircle, Phone, MapPin, Scissors, CalendarRange } from 'lucide-react'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import { createClient } from '@/lib/supabase/client'
import { SearchBar } from '@/components/appointments/search-bar'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

export type Appointment = {
  id: string
  client_name: string
  client_mobile: string
  client_address: string | null
  service_type: string
  booking_type: string
  start_date: string
  end_date: string | null
  status: string
}

const AVATAR_COLORS = [
  { bg: '#FBEAF0', text: '#993556' },
  { bg: '#EEEDFE', text: '#3C3489' },
  { bg: '#E1F5EE', text: '#085041' },
]

function getInitials(name: string) {
  return name.split(' ').map((n) => n[0] ?? '').join('').toUpperCase().slice(0, 2)
}

function formatDate(dateStr: string) {
  return new Date(dateStr + 'T00:00:00').toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
  })
}

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    confirmed: 'bg-[#E1F5EE] text-[#085041]',
    completed: 'bg-[#F2F2F7] text-[#8E8E93]',
    cancelled: 'bg-red-50 text-red-500',
  }
  return (
    <span className={cn('text-[11px] font-semibold px-2.5 py-1 rounded-full capitalize', styles[status] ?? styles.confirmed)}>
      {status}
    </span>
  )
}

type FilterTab = 'upcoming' | 'past' | 'all'

export default function AppointmentsList({ appointments }: { appointments: Appointment[] }) {
  const router = useRouter()
  const [search, setSearch] = useState('')
  const [tab, setTab] = useState<FilterTab>('upcoming')
  const [selected, setSelected] = useState<Appointment | null>(null)
  const [updating, setUpdating] = useState(false)

  const today = new Date().toISOString().split('T')[0]

  const filtered = appointments.filter((apt) => {
    if (tab === 'upcoming' && apt.start_date < today) return false
    if (tab === 'past' && apt.start_date >= today) return false
    if (search) {
      const q = search.toLowerCase()
      return apt.client_name.toLowerCase().includes(q) || apt.client_mobile.includes(q)
    }
    return true
  })

  async function updateStatus(id: string, status: 'completed' | 'cancelled') {
    setUpdating(true)
    const supabase = createClient()
    const { error } = await supabase.from('appointments').update({ status }).eq('id', id)
    if (error) {
      toast.error('Failed to update status')
    } else {
      toast.success(`Marked as ${status}`)
      setSelected(null)
      router.refresh()
    }
    setUpdating(false)
  }

  if (appointments.length === 0) {
    return (
      <div className="pt-1">
        <p className="text-[22px] font-bold text-[#1C1C1E] mb-5">Bookings</p>
        <div className="bg-white rounded-2xl shadow-sm py-12 flex flex-col items-center text-center px-4">
          <div className="w-14 h-14 rounded-full bg-white flex items-center justify-center mb-4">
            <CalendarDays className="w-6 h-6 text-[#C7C7CC]" />
          </div>
          <p className="text-[15px] font-semibold text-[#1C1C1E]">No bookings yet</p>
          <p className="text-[13px] text-[#8E8E93] mt-1">Add your first appointment to get started</p>
          <Link
            href="/appointments/new"
            className="mt-4 bg-[#6B0F1A] text-white text-[14px] font-semibold px-5 py-2.5 rounded-xl"
          >
            Add Appointment
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="pt-1">
      <p className="text-[22px] font-bold text-[#1C1C1E] mb-4">Bookings</p>

      <div className="mb-3">
        <SearchBar value={search} onChange={setSearch} />
      </div>

      {/* Filter tabs — iOS segmented control style */}
      <div className="flex gap-1 bg-[#E5E5EA] rounded-[10px] p-1 mb-4">
        {(['upcoming', 'past', 'all'] as FilterTab[]).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={cn(
              'flex-1 py-1.5 text-[13px] font-semibold rounded-[8px] capitalize transition-all',
              tab === t ? 'bg-white text-[#1C1C1E] shadow-sm' : 'text-[#8E8E93]'
            )}
          >
            {t}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-sm py-10 text-center">
          <p className="text-[14px] text-[#8E8E93]">No appointments found</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          {filtered.map((apt, i) => {
            const colors = AVATAR_COLORS[i % 3]
            return (
              <button
                key={apt.id}
                onClick={() => setSelected(apt)}
                className={`w-full flex items-center gap-3 px-4 py-3.5 text-left active:bg-white transition-colors ${i < filtered.length - 1 ? 'border-b border-[#E5E5EA]' : ''}`}
              >
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 text-[12px] font-semibold"
                  style={{ backgroundColor: colors.bg, color: colors.text }}
                >
                  {getInitials(apt.client_name)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[14px] font-semibold text-[#1C1C1E] leading-tight truncate">{apt.client_name}</p>
                  <p className="text-[12px] text-[#8E8E93] mt-0.5 truncate">{apt.service_type}</p>
                </div>
                <div className="flex flex-col items-end gap-1.5 shrink-0">
                  <p className="text-[12px] text-[#8E8E93] font-medium">{formatDate(apt.start_date)}</p>
                  <StatusBadge status={apt.status} />
                </div>
              </button>
            )
          })}
        </div>
      )}

      {/* Detail sheet */}
      <Dialog open={!!selected} onOpenChange={(open) => !open && setSelected(null)}>
        <DialogContent className="max-w-[360px] rounded-3xl p-0 overflow-hidden bg-white border-0 shadow-2xl">
          <DialogHeader className="bg-white px-5 pt-5 pb-4 border-b border-[#E5E5EA]">
            <DialogTitle className="text-[17px] font-bold text-[#1C1C1E]">
              Appointment Details
            </DialogTitle>
          </DialogHeader>
          {selected && (
            <div className="p-4 space-y-3">
              {/* Client avatar + name */}
              <div className="bg-white rounded-2xl p-4 flex items-center gap-3 shadow-sm">
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center text-[14px] font-bold shrink-0"
                  style={{ backgroundColor: AVATAR_COLORS[0].bg, color: AVATAR_COLORS[0].text }}
                >
                  {getInitials(selected.client_name)}
                </div>
                <div>
                  <p className="text-[16px] font-bold text-[#1C1C1E]">{selected.client_name}</p>
                  <StatusBadge status={selected.status} />
                </div>
              </div>

              {/* Details */}
              <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
                <div className="flex items-center gap-3 px-4 py-3 border-b border-[#E5E5EA]">
                  <Phone className="w-4 h-4 text-[#8E8E93] shrink-0" />
                  <div>
                    <p className="text-[11px] text-[#8E8E93]">Mobile</p>
                    <p className="text-[14px] text-[#1C1C1E] font-medium">{selected.client_mobile}</p>
                  </div>
                </div>
                {selected.client_address && (
                  <div className="flex items-center gap-3 px-4 py-3 border-b border-[#E5E5EA]">
                    <MapPin className="w-4 h-4 text-[#8E8E93] shrink-0" />
                    <div>
                      <p className="text-[11px] text-[#8E8E93]">Address</p>
                      <p className="text-[14px] text-[#1C1C1E] font-medium">{selected.client_address}</p>
                    </div>
                  </div>
                )}
                <div className="flex items-center gap-3 px-4 py-3 border-b border-[#E5E5EA]">
                  <Scissors className="w-4 h-4 text-[#8E8E93] shrink-0" />
                  <div>
                    <p className="text-[11px] text-[#8E8E93]">Service</p>
                    <p className="text-[14px] text-[#1C1C1E] font-medium">{selected.service_type}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 px-4 py-3">
                  <CalendarRange className="w-4 h-4 text-[#8E8E93] shrink-0" />
                  <div>
                    <p className="text-[11px] text-[#8E8E93]">Date</p>
                    <p className="text-[14px] text-[#1C1C1E] font-medium">
                      {selected.end_date
                        ? `${formatDate(selected.start_date)} – ${formatDate(selected.end_date)}`
                        : formatDate(selected.start_date)}
                    </p>
                  </div>
                </div>
              </div>

              {selected.status === 'confirmed' && (
                <div className="flex gap-2">
                  <button
                    onClick={() => updateStatus(selected.id, 'completed')}
                    disabled={updating}
                    className="flex-1 flex items-center justify-center gap-1.5 py-3 text-[13px] font-semibold bg-[#E1F5EE] text-[#085041] rounded-2xl disabled:opacity-50"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    Completed
                  </button>
                  <button
                    onClick={() => updateStatus(selected.id, 'cancelled')}
                    disabled={updating}
                    className="flex-1 flex items-center justify-center gap-1.5 py-3 text-[13px] font-semibold bg-red-50 text-red-500 rounded-2xl disabled:opacity-50"
                  >
                    <XCircle className="w-4 h-4" />
                    Cancel
                  </button>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
