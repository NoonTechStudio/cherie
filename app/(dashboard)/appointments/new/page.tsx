'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { ChevronLeft, AlertCircle, ChevronDown } from 'lucide-react'
import { toast } from 'sonner'
import { createClient } from '@/lib/supabase/client'
import { SERVICE_TYPES } from '@/lib/constants'
import { checkDateConflict } from '@/lib/appointments/checkConflict'

const schema = z
  .object({
    client_name: z.string().min(1, 'Client name is required'),
    client_mobile: z.string().regex(/^\d{10}$/, 'Enter a valid 10-digit mobile number'),
    client_address: z.string().optional(),
    booking_type: z.enum(['single_day', 'date_range']),
    start_date: z.string().min(1, 'Start date is required'),
    end_date: z.string().optional(),
    service_type: z.string().min(1, 'Service type is required'),
  })
  .refine(
    (data) => {
      if (data.booking_type === 'date_range') {
        return !!data.end_date && data.end_date >= data.start_date
      }
      return true
    },
    { message: 'End date must be on or after start date', path: ['end_date'] }
  )

type FormData = z.infer<typeof schema>
type ConflictRow = { client_name: string; start_date: string }

function FieldGroup({ children }: { children: React.ReactNode }) {
  return <div className="bg-white rounded-2xl shadow-sm overflow-hidden">{children}</div>
}

function Field({
  label,
  error,
  children,
  last,
}: {
  label: string
  error?: string
  children: React.ReactNode
  last?: boolean
}) {
  return (
    <div className={`px-4 py-3.5 ${!last ? 'border-b border-[#E5E5EA]' : ''}`}>
      <label className="block text-[12px] font-semibold text-[#8E8E93] uppercase tracking-wide mb-1.5">
        {label}
      </label>
      {children}
      {error && <p className="text-[12px] text-red-500 mt-1">{error}</p>}
    </div>
  )
}

export default function NewAppointmentPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const prefillName = searchParams.get('name') ?? ''
  const prefillMobile = searchParams.get('mobile') ?? ''
  const prefillAddress = searchParams.get('address') ?? ''
  const [businessId, setBusinessId] = useState<string | null>(null)
  const [category, setCategory] = useState<'heena_artist' | 'beauty_parlor' | null>(null)
  const [saving, setSaving] = useState(false)
  const [conflicts, setConflicts] = useState<ConflictRow[]>([])
  const [pendingData, setPendingData] = useState<FormData | null>(null)

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      booking_type: 'single_day',
      client_name: prefillName,
      client_mobile: prefillMobile,
      client_address: prefillAddress,
    },
  })

  const bookingType = watch('booking_type')

  useEffect(() => {
    async function loadBusiness() {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return
      const { data } = await supabase
        .from('business_profiles')
        .select('id, category')
        .eq('user_id', user.id)
        .single()
      if (data) {
        setBusinessId(data.id)
        setCategory(data.category as 'heena_artist' | 'beauty_parlor')
      }
    }
    loadBusiness()
  }, [])

  async function saveAppointment(data: FormData) {
    if (!businessId) return
    setSaving(true)
    try {
      const supabase = createClient()
      const { error } = await supabase.from('appointments').insert({
        business_id: businessId,
        client_name: data.client_name,
        client_mobile: data.client_mobile,
        client_address: data.client_address ?? null,
        booking_type: data.booking_type,
        start_date: data.start_date,
        end_date: data.booking_type === 'date_range' ? (data.end_date ?? null) : null,
        service_type: data.service_type,
        status: 'confirmed',
      })
      if (error) throw error
      toast.success('Appointment saved!')
      router.push('/appointments')
    } catch {
      toast.error('Failed to save appointment')
    } finally {
      setSaving(false)
    }
  }

  async function onSubmit(data: FormData) {
    if (!businessId) return
    try {
      const found = await checkDateConflict(
        businessId,
        data.start_date,
        data.booking_type === 'date_range' ? (data.end_date ?? null) : null
      )
      if (found.length > 0) {
        setConflicts(found)
        setPendingData(data)
        return
      }
    } catch {
      // conflict check failure is non-blocking
    }
    saveAppointment(data)
  }

  const serviceOptions = category ? SERVICE_TYPES[category] : []

  return (
    <div className="pt-1 pb-8">
      {/* Header */}
      <div className="flex items-center gap-3 mb-5">
        <Link
          href="/appointments"
          className="w-8 h-8 rounded-full bg-white shadow-sm flex items-center justify-center"
          aria-label="Back"
        >
          <ChevronLeft className="w-4 h-4 text-[#1C1C1E]" />
        </Link>
        <p className="text-[22px] font-bold text-[#1C1C1E]">New Appointment</p>
      </div>

      {/* Conflict warning */}
      {conflicts.length > 0 && pendingData && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 mb-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-amber-600 mt-0.5 shrink-0" />
            <div className="flex-1">
              <p className="text-[13px] font-semibold text-amber-900">Date conflict detected</p>
              <p className="text-[12px] text-amber-700 mt-0.5">
                {conflicts.map((c) => c.client_name).join(', ')} already booked on this date.
              </p>
              <div className="flex gap-4 mt-3">
                <button
                  onClick={() => { setConflicts([]); setPendingData(null) }}
                  className="text-[13px] font-semibold text-amber-800"
                >
                  Go back
                </button>
                <button
                  onClick={() => {
                    const data = pendingData
                    setConflicts([])
                    setPendingData(null)
                    saveAppointment(data)
                  }}
                  className="text-[13px] font-semibold text-[#6B0F1A]"
                >
                  Save anyway
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-4">
        {/* Client info */}
        <FieldGroup>
          <Field label="Client Name" error={errors.client_name?.message}>
            <input
              {...register('client_name')}
              placeholder="Enter client name"
              className="w-full text-[16px] text-[#1C1C1E] placeholder:text-[#C7C7CC] bg-transparent outline-none"
            />
          </Field>
          <Field label="Mobile Number" error={errors.client_mobile?.message}>
            <input
              {...register('client_mobile')}
              type="tel"
              inputMode="numeric"
              maxLength={10}
              placeholder="10-digit number"
              className="w-full text-[16px] text-[#1C1C1E] placeholder:text-[#C7C7CC] bg-transparent outline-none"
            />
          </Field>
          <Field label="Address (optional)" last>
            <input
              {...register('client_address')}
              placeholder="Client address"
              className="w-full text-[16px] text-[#1C1C1E] placeholder:text-[#C7C7CC] bg-transparent outline-none"
            />
          </Field>
        </FieldGroup>

        {/* Booking details */}
        <FieldGroup>
          <Field label="Booking Type">
            <div className="relative">
              <select
                {...register('booking_type')}
                className="w-full text-[16px] text-[#1C1C1E] bg-transparent outline-none appearance-none pr-6"
              >
                <option value="single_day">Single Day</option>
                <option value="date_range">Date Range</option>
              </select>
              <ChevronDown className="pointer-events-none absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 text-[#C7C7CC]" />
            </div>
          </Field>

          <Field label="Start Date" error={errors.start_date?.message}>
            <input
              {...register('start_date')}
              type="date"
              className="w-full text-[16px] text-[#1C1C1E] bg-transparent outline-none"
            />
          </Field>

          {bookingType === 'date_range' && (
            <Field label="End Date" error={errors.end_date?.message}>
              <input
                {...register('end_date')}
                type="date"
                className="w-full text-[16px] text-[#1C1C1E] bg-transparent outline-none"
              />
            </Field>
          )}

          <Field label="Service Type" error={errors.service_type?.message} last>
            <div className="relative">
              <select
                {...register('service_type')}
                disabled={!category}
                className="w-full text-[16px] text-[#1C1C1E] bg-transparent outline-none appearance-none pr-6 disabled:opacity-50"
              >
                <option value="">Select service</option>
                {serviceOptions.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 text-[#C7C7CC]" />
            </div>
          </Field>
        </FieldGroup>

        <button
          onClick={handleSubmit(onSubmit)}
          disabled={saving || !category}
          className="w-full bg-[#6B0F1A] text-white rounded-2xl py-4 text-[16px] font-semibold shadow-sm disabled:opacity-60 active:scale-[0.98] transition-transform"
        >
          {saving ? 'Saving…' : 'Save Appointment'}
        </button>
      </div>
    </div>
  )
}
