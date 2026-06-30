'use client'

import { useEffect, useRef } from 'react'
import { cn } from '@/lib/utils'

const HOURS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
const MINUTES = ['00', '15', '30', '45']

interface TimePickerProps {
  value: string   // "HH:MM" 24-hour, e.g. "14:30"
  onChange: (val: string) => void
}

function to24(hour: number, period: 'AM' | 'PM'): number {
  if (period === 'AM') return hour === 12 ? 0 : hour
  return hour === 12 ? 12 : hour + 12
}

function parse(value: string): { hour: number; minute: string; period: 'AM' | 'PM' } {
  if (!value) {
    const now = new Date()
    const h = now.getHours()
    const m = Math.round(now.getMinutes() / 15) * 15
    const safeM = m >= 60 ? 45 : m
    const period: 'AM' | 'PM' = h >= 12 ? 'PM' : 'AM'
    const hour12 = h % 12 === 0 ? 12 : h % 12
    return { hour: hour12, minute: String(safeM).padStart(2, '0'), period }
  }
  const [hStr, mStr] = value.split(':')
  const h = parseInt(hStr, 10)
  const period: 'AM' | 'PM' = h >= 12 ? 'PM' : 'AM'
  const hour12 = h % 12 === 0 ? 12 : h % 12
  return { hour: hour12, minute: mStr ?? '00', period }
}

export function TimePicker({ value, onChange }: TimePickerProps) {
  const { hour, minute, period } = parse(value)
  const hourRowRef = useRef<HTMLDivElement>(null)

  function emit(h: number, m: string, p: 'AM' | 'PM') {
    const h24 = to24(h, p)
    onChange(`${String(h24).padStart(2, '0')}:${m}`)
  }

  // Scroll selected hour into center on mount / hour change
  useEffect(() => {
    const row = hourRowRef.current
    if (!row) return
    const btn = row.querySelector(`[data-hour="${hour}"]`) as HTMLElement | null
    if (!btn) return
    const offset = btn.offsetLeft - row.clientWidth / 2 + btn.offsetWidth / 2
    row.scrollTo({ left: offset, behavior: 'smooth' })
  }, [hour])

  return (
    <div className="space-y-3 pt-1">
      {/* AM / PM toggle */}
      <div className="flex gap-2">
        {(['AM', 'PM'] as const).map((p) => (
          <button
            key={p}
            type="button"
            onClick={() => emit(hour, minute, p)}
            className={cn(
              'flex-1 py-2 rounded-xl text-[14px] font-semibold transition-colors',
              period === p
                ? 'bg-[#6B0F1A] text-white'
                : 'bg-[#F2F2F7] text-[#8E8E93]'
            )}
          >
            {p}
          </button>
        ))}
      </div>

      {/* Hour scroll row */}
      <div
        ref={hourRowRef}
        className="flex gap-2 overflow-x-auto scrollbar-none pb-1 -mx-1 px-1"
        style={{ scrollSnapType: 'x mandatory' }}
      >
        {HOURS.map((h) => (
          <button
            key={h}
            type="button"
            data-hour={h}
            onClick={() => emit(h, minute, period)}
            style={{ scrollSnapAlign: 'center' }}
            className={cn(
              'flex-shrink-0 w-11 h-11 rounded-xl text-[15px] font-semibold transition-colors',
              hour === h
                ? 'bg-[#6B0F1A] text-white'
                : 'bg-[#F2F2F7] text-[#8E8E93]'
            )}
          >
            {h}
          </button>
        ))}
      </div>

      {/* Minute chips */}
      <div className="flex gap-2">
        {MINUTES.map((m) => (
          <button
            key={m}
            type="button"
            onClick={() => emit(hour, m, period)}
            className={cn(
              'flex-1 py-2.5 rounded-xl text-[14px] font-semibold transition-colors',
              minute === m
                ? 'bg-[#6B0F1A] text-white'
                : 'bg-[#F2F2F7] text-[#8E8E93]'
            )}
          >
            :{m}
          </button>
        ))}
      </div>

      {/* Preview */}
      <p className="text-center text-[13px] text-[#8E8E93] font-medium">
        {hour}:{minute} {period}
      </p>
    </div>
  )
}
