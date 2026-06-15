'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Check, Zap, X } from 'lucide-react'

type Plan = {
  id: '1mo' | '3mo' | '6mo'
  label: string
  price: string
  perMonth: string
  badge?: string
  popular?: boolean
  paymentLink: string
}

const PLANS: Plan[] = [
  {
    id: '1mo', label: '1 Month', price: '₹79', perMonth: '₹79 / mo',
    paymentLink: 'https://rzp.io/rzp/6E6mIZf',
  },
  {
    id: '3mo', label: '3 Months', price: '₹222', perMonth: '₹74 / mo',
    badge: '20% off', popular: true,
    paymentLink: 'https://rzp.io/rzp/3rp9O1UB',
  },
  {
    id: '6mo', label: '6 Months', price: '₹444', perMonth: '₹74 / mo',
    badge: '20% off',
    paymentLink: 'https://rzp.io/rzp/ZmLODfx',
  },
]

const FEATURES = [
  'Unlimited appointment bookings',
  'Full client management',
  'SMS & WhatsApp reminders',
  'Business profile page',
]

interface PlansUIProps {
  subscriptionStatus?: string | null
  expiresInDays?: number | null
}

export default function PlansUI({ subscriptionStatus, expiresInDays }: PlansUIProps) {
  const [selected, setSelected] = useState<Plan['id']>('3mo')
  const plan = PLANS.find((p) => p.id === selected)!

  let subtitle = 'Your free trial has ended'
  if (subscriptionStatus === 'trial' && typeof expiresInDays === 'number' && expiresInDays > 0) {
    subtitle = `${expiresInDays} day${expiresInDays === 1 ? '' : 's'} of free trial left`
  } else if (subscriptionStatus === 'active' && typeof expiresInDays === 'number' && expiresInDays > 0) {
    subtitle = `${expiresInDays} day${expiresInDays === 1 ? '' : 's'} left on subscription`
  }

  const canExit = (subscriptionStatus === 'trial' || subscriptionStatus === 'active') && typeof expiresInDays === 'number' && expiresInDays > 0

  return (
    <main className="min-h-screen bg-white flex flex-col px-5 pt-12 pb-10 relative">
        {canExit && (
          <button
            onClick={() => { window.location.href = '/dashboard' }}
            className="absolute top-6 right-5 p-2 rounded-full hover:bg-black/5 active:scale-95 transition-all text-[#8E8E93]"
            aria-label="Close"
          >
            <X className="w-6 h-6" />
          </button>
        )}
        <div className="flex flex-col items-center mb-7">
          <Image src="/logo.png" alt="Chérie" width={140} height={48} className="mb-3" />
          <h1 className="text-[24px] font-bold text-[#1C1C1E]">Choose a Plan</h1>
          <p className="text-[14px] text-[#8E8E93] mt-1">{subtitle}</p>
        </div>
        <div className="space-y-3 mb-5">
          {PLANS.map((p) => (
            <button key={p.id} onClick={() => setSelected(p.id)}
              className={`w-full rounded-2xl p-4 text-left transition-all active:scale-[0.98] relative ${selected === p.id ? 'bg-[#6B0F1A] shadow-lg' : 'bg-[#F5F5F5]'}`}>
              {p.popular && selected !== p.id && (
                <span className="absolute -top-2 left-4 bg-[#6B0F1A] text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full">Most Popular</span>
              )}
              <div className="flex items-center justify-between">
                <div>
                  <p className={`text-[16px] font-bold ${selected === p.id ? 'text-white' : 'text-[#1C1C1E]'}`}>{p.label}</p>
                  <p className={`text-[12px] mt-0.5 ${selected === p.id ? 'text-white/70' : 'text-[#8E8E93]'}`}>
                    {p.perMonth}
                    {p.badge && <span className={`ml-2 font-semibold px-1.5 py-0.5 rounded-md text-[11px] ${selected === p.id ? 'bg-white/20 text-white' : 'bg-[#6B0F1A]/10 text-[#6B0F1A]'}`}>{p.badge}</span>}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <p className={`text-[26px] font-bold ${selected === p.id ? 'text-white' : 'text-[#1C1C1E]'}`}>{p.price}</p>
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${selected === p.id ? 'border-white bg-white' : 'border-[#C7C7CC]'}`}>
                    {selected === p.id && <div className="w-2.5 h-2.5 rounded-full bg-[#6B0F1A]" />}
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>
        <div className="bg-[#F5F5F5] rounded-2xl px-4 py-3 mb-6">
          {FEATURES.map((f, i) => (
            <div key={f} className={`flex items-center gap-3 py-2.5 ${i < FEATURES.length - 1 ? 'border-b border-[#E5E5EA]' : ''}`}>
              <div className="w-5 h-5 rounded-full bg-[#6B0F1A] flex items-center justify-center shrink-0">
                <Check className="w-3 h-3 text-white" strokeWidth={3} />
              </div>
              <p className="text-[14px] text-[#1C1C1E]">{f}</p>
            </div>
          ))}
        </div>
        <a
          href={plan.paymentLink}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full flex items-center justify-center gap-2 bg-[#6B0F1A] text-white rounded-2xl py-4 text-[17px] font-bold shadow-sm active:scale-[0.98] transition-transform"
        >
          <Zap className="w-4 h-4" />
          {`Subscribe · ${plan.price}`}
        </a>
        <p className="text-center text-[12px] text-[#8E8E93] mt-3">Secure · Powered by Razorpay · Cancel anytime</p>
      </main>
  )
}
