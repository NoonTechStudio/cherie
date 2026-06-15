'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Users, Phone, MapPin, CalendarRange, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import { SearchBar } from '@/components/appointments/search-bar'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import type { Appointment } from '@/components/appointments/appointments-list'

export type ClientSummary = {
  client_name: string
  client_mobile: string
  client_address: string | null
  total_visits: number
  last_visit: string
  last_service: string
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
    year: 'numeric',
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

export default function ClientsList({
  clients,
  appointments,
}: {
  clients: ClientSummary[]
  appointments: Appointment[]
}) {
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState<ClientSummary | null>(null)

  if (clients.length === 0) {
    return (
      <div className="pt-1">
        <p className="text-[22px] font-bold text-[#1C1C1E] mb-5">Clients</p>
        <div className="bg-white rounded-2xl shadow-sm py-12 flex flex-col items-center text-center px-4">
          <div className="w-14 h-14 rounded-full bg-white flex items-center justify-center mb-4">
            <Users className="w-6 h-6 text-[#C7C7CC]" />
          </div>
          <p className="text-[15px] font-semibold text-[#1C1C1E]">No clients yet</p>
          <p className="text-[13px] text-[#8E8E93] mt-1">
            Clients appear here after you add appointments
          </p>
        </div>
      </div>
    )
  }

  const filtered = clients.filter((c) => {
    if (!search) return true
    const q = search.toLowerCase()
    return c.client_name.toLowerCase().includes(q) || c.client_mobile.includes(q)
  })

  const clientHistory = selected
    ? appointments
        .filter((a) => a.client_mobile === selected.client_mobile)
        .sort((a, b) => b.start_date.localeCompare(a.start_date))
    : []

  const newBookingUrl = selected
    ? `/appointments/new?name=${encodeURIComponent(selected.client_name)}&mobile=${encodeURIComponent(selected.client_mobile)}${selected.client_address ? `&address=${encodeURIComponent(selected.client_address)}` : ''}`
    : ''

  return (
    <div className="pt-1">
      <p className="text-[22px] font-bold text-[#1C1C1E] mb-4">Clients</p>

      <div className="mb-4">
        <SearchBar value={search} onChange={setSearch} />
      </div>

      {filtered.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-sm py-10 text-center">
          <p className="text-[14px] text-[#8E8E93]">No clients found</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          {filtered.map((client, i) => {
            const colors = AVATAR_COLORS[i % 3]
            return (
              <button
                key={client.client_mobile}
                onClick={() => setSelected(client)}
                className={`w-full flex items-center gap-3 px-4 py-3.5 text-left active:bg-white transition-colors ${i < filtered.length - 1 ? 'border-b border-[#E5E5EA]' : ''}`}
              >
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 text-[12px] font-semibold"
                  style={{ backgroundColor: colors.bg, color: colors.text }}
                >
                  {getInitials(client.client_name)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[14px] font-semibold text-[#1C1C1E] leading-tight truncate">{client.client_name}</p>
                  <p className="text-[12px] text-[#8E8E93] mt-0.5">{client.client_mobile}</p>
                </div>
                <div className="flex flex-col items-end gap-1 shrink-0">
                  <span className="text-[12px] font-semibold text-[#6B0F1A] bg-[#FFF0F0] px-2 py-0.5 rounded-full">
                    {client.total_visits} {client.total_visits === 1 ? 'visit' : 'visits'}
                  </span>
                  <ChevronRight className="w-3.5 h-3.5 text-[#C7C7CC]" />
                </div>
              </button>
            )
          })}
        </div>
      )}

      <Dialog open={!!selected} onOpenChange={(open) => !open && setSelected(null)}>
        <DialogContent className="max-w-[360px] rounded-3xl p-0 overflow-hidden bg-white border-0 shadow-2xl">
          <DialogHeader className="bg-white px-5 pt-5 pb-4 border-b border-[#E5E5EA]">
            <DialogTitle className="text-[17px] font-bold text-[#1C1C1E]">Client Profile</DialogTitle>
          </DialogHeader>
          {selected && (
            <div className="p-4 space-y-3">
              {/* Avatar + name */}
              <div className="bg-white rounded-2xl p-4 flex items-center gap-3 shadow-sm">
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center text-[14px] font-bold shrink-0"
                  style={{ backgroundColor: AVATAR_COLORS[0].bg, color: AVATAR_COLORS[0].text }}
                >
                  {getInitials(selected.client_name)}
                </div>
                <div>
                  <p className="text-[16px] font-bold text-[#1C1C1E]">{selected.client_name}</p>
                  <p className="text-[12px] text-[#8E8E93]">
                    {selected.total_visits} {selected.total_visits === 1 ? 'visit' : 'visits'} · Last: {formatDate(selected.last_visit)}
                  </p>
                </div>
              </div>

              {/* Contact */}
              <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
                <div className="flex items-center gap-3 px-4 py-3 border-b border-[#E5E5EA]">
                  <Phone className="w-4 h-4 text-[#8E8E93] shrink-0" />
                  <div>
                    <p className="text-[11px] text-[#8E8E93]">Mobile</p>
                    <p className="text-[14px] text-[#1C1C1E] font-medium">{selected.client_mobile}</p>
                  </div>
                </div>
                {selected.client_address && (
                  <div className="flex items-center gap-3 px-4 py-3">
                    <MapPin className="w-4 h-4 text-[#8E8E93] shrink-0" />
                    <div>
                      <p className="text-[11px] text-[#8E8E93]">Address</p>
                      <p className="text-[14px] text-[#1C1C1E] font-medium">{selected.client_address}</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Booking history */}
              {clientHistory.length > 0 && (
                <div>
                  <p className="text-[12px] font-semibold text-[#8E8E93] uppercase tracking-wide mb-2 px-1">Booking History</p>
                  <div className="bg-white rounded-2xl shadow-sm overflow-hidden max-h-44 overflow-y-auto">
                    {clientHistory.map((apt, i) => (
                      <div
                        key={apt.id}
                        className={`px-4 py-3 ${i < clientHistory.length - 1 ? 'border-b border-[#E5E5EA]' : ''}`}
                      >
                        <div className="flex items-center justify-between gap-2">
                          <p className="text-[13px] font-medium text-[#1C1C1E] truncate">{apt.service_type}</p>
                          <StatusBadge status={apt.status} />
                        </div>
                        <p className="text-[12px] text-[#8E8E93] mt-0.5">
                          {formatDate(apt.start_date)}
                          {apt.end_date ? ` – ${formatDate(apt.end_date)}` : ''}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <Link
                href={newBookingUrl}
                onClick={() => setSelected(null)}
                className="block w-full text-center bg-[#6B0F1A] text-white rounded-2xl py-3.5 text-[15px] font-semibold"
              >
                New Booking for {selected.client_name.split(' ')[0]}
              </Link>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
