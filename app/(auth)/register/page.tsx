'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import Link from 'next/link'
import Image from 'next/image'
import { Eye, EyeOff, Check, Sparkles, ArrowRight } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

const schema = z.object({
  name: z.string().min(2, 'Enter your full name'),
  mobile: z.string().regex(/^\d{10}$/, 'Enter a valid 10-digit number'),
  address: z.string().min(5, 'Enter your address'),
  city: z.string().min(2, 'Enter your city'),
  password: z.string().min(6, 'Min. 6 characters'),
})

type FormValues = z.infer<typeof schema>

const PLANS = [
  { id: '1mo', label: '1 Month',  price: '₹79',  per: '/mo',  badge: null,       highlight: false },
  { id: '3mo', label: '3 Months', price: '₹222', per: '/3mo', badge: 'Save 20%', highlight: true },
  { id: '6mo', label: '6 Months', price: '₹444', per: '/6mo', badge: 'Save 20%', highlight: false },
]

const TRIAL_FEATURES = [
  'Unlimited appointment bookings',
  'Client management & history',
  'SMS & WhatsApp reminders',
]

export default function RegisterPage() {
  const router = useRouter()
  const [step, setStep] = useState<'form' | 'plans'>('form')
  const [serverError, setServerError] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(schema) })

  async function onSubmit(data: FormValues) {
    setServerError('')
    const supabase = createClient()

    const { data: authData, error: signUpError } = await supabase.auth.signUp({
      email: `${data.mobile}@cherie.app`,
      password: data.password,
    })

    if (signUpError) {
      setServerError(signUpError.message)
      return
    }

    if (!authData.session) {
      setServerError('Please check your email to confirm your account.')
      return
    }

    const trialExpiresAt = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString()
    const { error: profileError } = await supabase.from('users').upsert({
      id: authData.user!.id,
      mobile: data.mobile,
      name: data.name,
      address: data.address,
      city: data.city,
      subscription_status: 'trial',
      trial_expires_at: trialExpiresAt,
    }, { onConflict: 'id' })

    if (profileError) {
      setServerError(profileError.message)
      return
    }

    setStep('plans')
  }

  /* ── Step 2: Trial + Plan Preview ── */
  if (step === 'plans') {
    return (
      <main className="min-h-screen bg-white flex flex-col px-5 pt-14 pb-10">
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <Image src="/logo.png" alt="Chérie" width={140} height={48} className="mb-2" />
        </div>

        {/* Trial badge */}
        <div className="bg-[#6B0F1A] rounded-3xl px-6 py-6 mb-6 text-center">
          <p className="text-white/70 text-[13px] font-medium mb-1">You&apos;ve unlocked</p>
          <p className="text-white text-[44px] font-bold leading-none">3</p>
          <p className="text-white text-[22px] font-semibold">Days Free Trial</p>
          <div className="mt-3 flex flex-col gap-1.5">
            {TRIAL_FEATURES.map((f) => (
              <div key={f} className="flex items-center justify-center gap-2">
                <div className="w-4 h-4 rounded-full bg-white/20 flex items-center justify-center">
                  <Check className="w-2.5 h-2.5 text-white" strokeWidth={3} />
                </div>
                <p className="text-white/85 text-[13px]">{f}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Plans */}
        <p className="text-[13px] font-semibold text-[#8E8E93] uppercase tracking-wide mb-3">
          After your trial — pick a plan
        </p>
        <div className="space-y-2.5 mb-8">
          {PLANS.map((p) => (
            <div
              key={p.id}
              className={`rounded-2xl px-4 py-3.5 flex items-center justify-between ${
                p.highlight
                  ? 'bg-[#6B0F1A] text-white'
                  : 'bg-[#F5F5F5] text-[#1C1C1E]'
              }`}
            >
              <div>
                <p className={`text-[15px] font-bold ${p.highlight ? 'text-white' : 'text-[#1C1C1E]'}`}>{p.label}</p>
                {p.badge && (
                  <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${p.highlight ? 'bg-white/20 text-white' : 'bg-[#6B0F1A]/10 text-[#6B0F1A]'}`}>
                    {p.badge}
                  </span>
                )}
              </div>
              <div className="text-right">
                <p className={`text-[24px] font-bold leading-none ${p.highlight ? 'text-white' : 'text-[#1C1C1E]'}`}>{p.price}</p>
                <p className={`text-[12px] ${p.highlight ? 'text-white/70' : 'text-[#8E8E93]'}`}>{p.per}</p>
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={() => { window.location.href = '/setup-business?t=' + Date.now() }}
          className="w-full bg-[#6B0F1A] text-white rounded-2xl py-4 text-[16px] font-bold flex items-center justify-center gap-2 shadow-sm active:scale-[0.98] transition-transform"
        >
          Let&apos;s Go! <ArrowRight className="w-5 h-5" />
        </button>
        <p className="text-center text-[12px] text-[#8E8E93] mt-3">
          No card needed during trial · Cancel anytime
        </p>
      </main>
    )
  }

  /* ── Step 1: Registration Form ── */
  return (
    <main className="min-h-screen bg-white flex flex-col px-5 pt-14 pb-10">
      {/* Logo */}
      <div className="flex flex-col items-center mb-8">
        <Image src="/logo.png" alt="Chérie" width={140} height={48} className="mb-1" />
        <p className="text-[15px] text-[#8E8E93]">Create your free account</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-3">

        {/* Full Name */}
        <div className="bg-[#F5F5F5] rounded-2xl px-4 py-3.5">
          <p className="text-[11px] font-bold text-[#8E8E93] uppercase tracking-widest mb-1">Full Name</p>
          <input
            placeholder="e.g. Fatima Shaikh"
            autoComplete="name"
            {...register('name')}
            className="w-full text-[17px] text-[#1C1C1E] placeholder:text-[#C7C7CC] bg-transparent outline-none"
          />
          {errors.name && <p className="text-[12px] text-red-500 mt-1">{errors.name.message}</p>}
        </div>

        {/* Mobile */}
        <div className="bg-[#F5F5F5] rounded-2xl px-4 py-3.5">
          <p className="text-[11px] font-bold text-[#8E8E93] uppercase tracking-widest mb-1">Mobile Number</p>
          <input
            type="tel"
            inputMode="numeric"
            placeholder="9876543210"
            maxLength={10}
            autoComplete="tel"
            {...register('mobile')}
            className="w-full text-[17px] text-[#1C1C1E] placeholder:text-[#C7C7CC] bg-transparent outline-none"
          />
          {errors.mobile && <p className="text-[12px] text-red-500 mt-1">{errors.mobile.message}</p>}
        </div>

        {/* Address */}
        <div className="bg-[#F5F5F5] rounded-2xl px-4 py-3.5">
          <p className="text-[11px] font-bold text-[#8E8E93] uppercase tracking-widest mb-1">Address</p>
          <input
            placeholder="House / Shop / Street"
            autoComplete="street-address"
            {...register('address')}
            className="w-full text-[17px] text-[#1C1C1E] placeholder:text-[#C7C7CC] bg-transparent outline-none"
          />
          {errors.address && <p className="text-[12px] text-red-500 mt-1">{errors.address.message}</p>}
        </div>

        {/* City */}
        <div className="bg-[#F5F5F5] rounded-2xl px-4 py-3.5">
          <p className="text-[11px] font-bold text-[#8E8E93] uppercase tracking-widest mb-1">City</p>
          <input
            placeholder="e.g. Mumbai"
            autoComplete="address-level2"
            {...register('city')}
            className="w-full text-[17px] text-[#1C1C1E] placeholder:text-[#C7C7CC] bg-transparent outline-none"
          />
          {errors.city && <p className="text-[12px] text-red-500 mt-1">{errors.city.message}</p>}
        </div>

        {/* Password */}
        <div className="bg-[#F5F5F5] rounded-2xl px-4 py-3.5">
          <p className="text-[11px] font-bold text-[#8E8E93] uppercase tracking-widest mb-1">Password</p>
          <div className="flex items-center gap-2">
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Min. 6 characters"
              autoComplete="new-password"
              {...register('password')}
              className="flex-1 text-[17px] text-[#1C1C1E] placeholder:text-[#C7C7CC] bg-transparent outline-none"
            />
            <button type="button" onClick={() => setShowPassword(!showPassword)} className="shrink-0 text-[#8E8E93]">
              {showPassword ? <EyeOff className="w-4.5 h-4.5" /> : <Eye className="w-4.5 h-4.5" />}
            </button>
          </div>
          {errors.password && <p className="text-[12px] text-red-500 mt-1">{errors.password.message}</p>}
        </div>

        {serverError && (
          <div className="bg-red-50 rounded-2xl px-4 py-3">
            <p className="text-[13px] text-red-600 text-center">{serverError}</p>
          </div>
        )}

        {/* Trial teaser */}
        <div className="flex items-center gap-2 px-1">
          <Sparkles className="w-4 h-4 text-[#6B0F1A] shrink-0" />
          <p className="text-[13px] text-[#8E8E93]">3-day free trial included — no card required</p>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-[#6B0F1A] text-white rounded-2xl py-4 text-[17px] font-bold shadow-sm disabled:opacity-60 active:scale-[0.98] transition-transform mt-1"
        >
          {isSubmitting ? 'Creating account…' : 'Create Account'}
        </button>
      </form>

      <p className="text-center text-[14px] text-[#8E8E93] mt-6">
        Already have an account?{' '}
        <Link href="/login" className="font-bold text-[#6B0F1A]">Sign in</Link>
      </p>
    </main>
  )
}
