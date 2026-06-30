'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Check, X, Loader2, ShieldCheck, Star } from 'lucide-react'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

type PlanId = '1mo' | '3mo' | '6mo'

type Plan = {
  id: PlanId
  label: string
  price: string
  amount: number
  perMonth: string
  saving?: string
  tag?: string
}

const PLANS: Plan[] = [
  {
    id: '1mo', label: '1 Month', price: '₹79', amount: 7900, perMonth: '₹79 / mo',
  },
  {
    id: '3mo', label: '3 Months', price: '₹199', amount: 19900, perMonth: '₹66 / mo',
    saving: 'Save ₹38', tag: 'Most Popular',
  },
  {
    id: '6mo', label: '6 Months', price: '₹379', amount: 37900, perMonth: '₹63 / mo',
    saving: 'Save ₹95', tag: 'Best Value',
  },
]

const FEATURES = [
  'Unlimited appointment bookings',
  'Full client management',
  'Today\'s schedule highlight on dashboard',
  'Business profile page',
]

interface PlansUIProps {
  subscriptionStatus?: string | null
  expiresInDays?: number | null
  userMobile?: string | null
  userName?: string | null
}

function loadRazorpayScript(): Promise<boolean> {
  return new Promise((resolve) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if (typeof (window as any).Razorpay !== 'undefined') { resolve(true); return }
    const script = document.createElement('script')
    script.src = 'https://checkout.razorpay.com/v1/checkout.js'
    script.onload = () => resolve(true)
    script.onerror = () => resolve(false)
    document.head.appendChild(script)
  })
}

export default function PlansUI({ subscriptionStatus, expiresInDays, userMobile, userName }: PlansUIProps) {
  const [selected, setSelected] = useState<PlanId>('3mo')
  const [loading, setLoading] = useState(false)
  const plan = PLANS.find((p) => p.id === selected)!

  const canExit = (subscriptionStatus === 'trial' || subscriptionStatus === 'active') &&
    typeof expiresInDays === 'number' && expiresInDays > 0

  const trialBanner = subscriptionStatus === 'trial' && typeof expiresInDays === 'number' && expiresInDays > 0
    ? `${expiresInDays} day${expiresInDays === 1 ? '' : 's'} of free trial remaining`
    : subscriptionStatus === 'active' && typeof expiresInDays === 'number' && expiresInDays <= 7
    ? `Subscription expires in ${expiresInDays} day${expiresInDays === 1 ? '' : 's'}`
    : null

  async function handleSubscribe() {
    setLoading(true)
    try {
      const loaded = await loadRazorpayScript()
      if (!loaded) { toast.error('Could not load payment gateway. Check your connection.'); return }

      const res = await fetch('/api/payment/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan: selected }),
      })
      if (!res.ok) { toast.error('Failed to create order. Please try again.'); return }

      const { order_id, razorpay_key } = await res.json()

      const options = {
        key: razorpay_key,
        amount: plan.amount,
        currency: 'INR',
        name: 'Chérie',
        description: `${plan.label} Plan`,
        image: '/icons/icon-96x96.png',
        order_id,
        prefill: {
          contact: userMobile ? `+91${userMobile}` : '',
          name: userName ?? '',
        },
        theme: { color: '#6B0F1A' },
        modal: { ondismiss: () => {} },
        handler: () => {
          toast.success('Payment successful! Activating your subscription…')
          setTimeout(() => { window.location.href = '/dashboard' }, 1500)
        },
      }

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const rzp = new (window as any).Razorpay(options)
      rzp.on('payment.failed', () => toast.error('Payment failed. Please try again.'))
      rzp.open()
    } catch {
      toast.error('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-[#F8F4F4] flex flex-col">
      {/* Header */}
      <div className="relative bg-white px-5 pt-10 pb-6 border-b border-[#F0EAEA]">
        {canExit && (
          <button
            onClick={() => { window.location.href = '/dashboard' }}
            className="absolute top-5 right-5 w-8 h-8 flex items-center justify-center rounded-full bg-[#F2F2F7] text-[#8E8E93]"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        )}
        <div className="flex flex-col items-center">
          <Image src="/logo.png" alt="Chérie" width={90} height={32} className="mb-4 object-contain" />
          <h1 className="text-[22px] font-bold text-[#1C1C1E] tracking-tight">Upgrade to Pro</h1>
          <p className="text-[13px] text-[#8E8E93] mt-1">Unlock all features for your business</p>

          {trialBanner && (
            <div className="mt-3 bg-amber-50 border border-amber-200 rounded-xl px-3 py-1.5">
              <p className="text-[12px] font-semibold text-amber-700">{trialBanner}</p>
            </div>
          )}
        </div>
      </div>

      <div className="flex-1 px-4 py-5 space-y-4">

        {/* Plan selector */}
        <div className="space-y-2.5">
          {PLANS.map((p) => {
            const isSelected = selected === p.id
            return (
              <button
                key={p.id}
                onClick={() => setSelected(p.id)}
                className={cn(
                  'w-full rounded-2xl p-4 text-left transition-all active:scale-[0.98] relative border-2',
                  isSelected
                    ? 'bg-[#6B0F1A] border-[#6B0F1A] shadow-lg shadow-[#6B0F1A]/20'
                    : 'bg-white border-transparent shadow-sm'
                )}
              >
                {p.tag && (
                  <span className={cn(
                    'absolute -top-2.5 left-3.5 text-[10px] font-bold px-2 py-0.5 rounded-full',
                    isSelected ? 'bg-white text-[#6B0F1A]' : 'bg-[#6B0F1A] text-white'
                  )}>
                    {p.tag}
                  </span>
                )}

                <div className="flex items-center justify-between">
                  <div>
                    <p className={cn('text-[15px] font-bold leading-tight', isSelected ? 'text-white' : 'text-[#1C1C1E]')}>
                      {p.label}
                    </p>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <p className={cn('text-[12px]', isSelected ? 'text-white/70' : 'text-[#8E8E93]')}>
                        {p.perMonth}
                      </p>
                      {p.saving && (
                        <span className={cn(
                          'text-[10px] font-bold px-1.5 py-0.5 rounded-md',
                          isSelected ? 'bg-white/20 text-white' : 'bg-[#FFF0F2] text-[#6B0F1A]'
                        )}>
                          {p.saving}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <p className={cn('text-[28px] font-black tracking-tight', isSelected ? 'text-white' : 'text-[#1C1C1E]')}>
                      {p.price}
                    </p>
                    <div className={cn(
                      'w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-all',
                      isSelected ? 'border-white bg-white' : 'border-[#D1D1D6] bg-transparent'
                    )}>
                      {isSelected && <div className="w-2.5 h-2.5 rounded-full bg-[#6B0F1A]" />}
                    </div>
                  </div>
                </div>
              </button>
            )
          })}
        </div>

        {/* Features */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="px-4 pt-3.5 pb-1 flex items-center gap-2">
            <Star className="w-3.5 h-3.5 text-[#6B0F1A]" fill="#6B0F1A" />
            <p className="text-[11px] font-bold text-[#6B0F1A] uppercase tracking-wider">Everything included</p>
          </div>
          {FEATURES.map((f, i) => (
            <div
              key={f}
              className={cn(
                'flex items-center gap-3 px-4 py-3',
                i < FEATURES.length - 1 && 'border-b border-[#F2F2F7]'
              )}
            >
              <div className="w-5 h-5 rounded-full bg-[#F0FFF8] border border-[#BBF0D6] flex items-center justify-center shrink-0">
                <Check className="w-3 h-3 text-[#16A34A]" strokeWidth={3} />
              </div>
              <p className="text-[14px] text-[#1C1C1E] font-medium">{f}</p>
            </div>
          ))}
        </div>

        {/* Trust line */}
        <div className="flex items-center justify-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-[#8E8E93]" />
          <p className="text-[12px] text-[#8E8E93]">Secure payment · Powered by Razorpay</p>
        </div>
      </div>

      {/* Sticky CTA */}
      <div className="sticky bottom-0 bg-white border-t border-[#F0EAEA] px-4 py-4"
        style={{ paddingBottom: 'calc(1rem + env(safe-area-inset-bottom, 0px))' }}>
        <button
          onClick={handleSubscribe}
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 bg-[#6B0F1A] text-white rounded-2xl py-4 text-[16px] font-bold shadow-lg shadow-[#6B0F1A]/30 active:scale-[0.98] transition-all disabled:opacity-70"
        >
          {loading ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            `Subscribe · ${plan.price}`
          )}
        </button>
        <p className="text-center text-[11px] text-[#AEAEB2] mt-2">No hidden charges · Cancel anytime</p>
      </div>
    </main>
  )
}
