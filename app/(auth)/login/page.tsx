'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import Link from 'next/link'
import Image from 'next/image'
import { Eye, EyeOff } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

const schema = z.object({
  mobile: z.string().regex(/^\d{10}$/, 'Enter a valid 10-digit number'),
  password: z.string().min(1, 'Password is required'),
})

type FormValues = z.infer<typeof schema>

export default function LoginPage() {
  const router = useRouter()
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

    const { error } = await supabase.auth.signInWithPassword({
      email: `${data.mobile}@cherie.app`,
      password: data.password,
    })

    if (error) {
      setServerError('Invalid mobile number or password')
      return
    }

    window.location.href = '/dashboard'
  }

  return (
    <main className="min-h-screen bg-white flex flex-col px-5 pt-14 pb-10">
      {/* Logo */}
      <div className="flex flex-col items-center mb-10">
        <Image src="/logo.png" alt="Chérie" width={150} height={52} className="mb-2" />
        <p className="text-[15px] text-[#8E8E93]">Welcome back</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-3">
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

        {/* Password */}
        <div className="bg-[#F5F5F5] rounded-2xl px-4 py-3.5">
          <p className="text-[11px] font-bold text-[#8E8E93] uppercase tracking-widest mb-1">Password</p>
          <div className="flex items-center gap-2">
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Enter your password"
              autoComplete="current-password"
              {...register('password')}
              className="flex-1 text-[17px] text-[#1C1C1E] placeholder:text-[#C7C7CC] bg-transparent outline-none"
            />
            <button type="button" onClick={() => setShowPassword(!showPassword)} className="shrink-0 text-[#8E8E93]">
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          {errors.password && <p className="text-[12px] text-red-500 mt-1">{errors.password.message}</p>}
        </div>

        {serverError && (
          <div className="bg-red-50 rounded-2xl px-4 py-3">
            <p className="text-[13px] text-red-600 text-center">{serverError}</p>
          </div>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-[#6B0F1A] text-white rounded-2xl py-4 text-[17px] font-bold shadow-sm disabled:opacity-60 active:scale-[0.98] transition-transform mt-2"
        >
          {isSubmitting ? 'Signing in…' : 'Sign In'}
        </button>
      </form>

      <p className="text-center text-[14px] text-[#8E8E93] mt-8">
        New to Chérie?{' '}
        <Link href="/register" className="font-bold text-[#6B0F1A]">Create account</Link>
      </p>
    </main>
  )
}
