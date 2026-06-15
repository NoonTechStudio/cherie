'use client'

import { useState, useEffect } from 'react'
import { Home, Calendar, Plus, Users, Settings, X } from 'lucide-react'

const TOUR_KEY = 'cherie_tour_done_v1'

const STEPS = [
  {
    icon: Home,
    iconBg: '#FFF0F3',
    iconColor: '#6B0F1A',
    title: 'Welcome to Chérie! 🌸',
    body: "You're all set! This is your home dashboard. Here you'll see today's bookings and upcoming appointments at a glance.",
    step: 1,
  },
  {
    icon: Calendar,
    iconBg: '#EEEDFE',
    iconColor: '#3C3489',
    title: 'Manage Bookings',
    body: "Tap Bookings to see all your appointments. Filter by upcoming or past, search clients, and update appointment status.",
    step: 2,
  },
  {
    icon: Plus,
    iconBg: '#6B0F1A',
    iconColor: '#ffffff',
    title: 'Add New Appointment',
    body: "Tap the ＋ button in the centre of the bottom bar to quickly add a new appointment for any client.",
    step: 3,
  },
  {
    icon: Users,
    iconBg: '#E1F5EE',
    iconColor: '#085041',
    title: 'Your Clients',
    body: "The Clients tab shows every client you've served, their visit history, and lets you instantly book them again.",
    step: 4,
  },
  {
    icon: Settings,
    iconBg: '#F2F2F7',
    iconColor: '#8E8E93',
    title: "You're Ready!",
    body: "Head to Settings any time to update your business info, subscription, or sign out. Enjoy using Chérie!",
    step: 5,
  },
]

export function OnboardingTour() {
  const [visible, setVisible] = useState(false)
  const [step, setStep] = useState(0)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const done = localStorage.getItem(TOUR_KEY)
      if (!done) setVisible(true)
    }
  }, [])

  function dismiss() {
    localStorage.setItem(TOUR_KEY, '1')
    setVisible(false)
  }

  function next() {
    if (step < STEPS.length - 1) {
      setStep((s) => s + 1)
    } else {
      dismiss()
    }
  }

  if (!visible) return null

  const current = STEPS[step]
  const Icon = current.icon
  const isLast = step === STEPS.length - 1

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/40 z-50"
        onClick={dismiss}
        aria-hidden="true"
      />

      {/* Tour card — sits just above the bottom nav */}
      <div
        className="fixed left-4 right-4 z-50 bg-white rounded-3xl shadow-2xl overflow-hidden"
        style={{ bottom: 'calc(72px + env(safe-area-inset-bottom, 0px))' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Progress dots */}
        <div className="flex items-center justify-between px-5 pt-4 pb-2">
          <div className="flex gap-1.5">
            {STEPS.map((_, i) => (
              <div
                key={i}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  i === step ? 'w-5 bg-[#6B0F1A]' : 'w-1.5 bg-[#E5E5EA]'
                }`}
              />
            ))}
          </div>
          <button
            onClick={dismiss}
            className="w-7 h-7 rounded-full bg-[#F2F2F7] flex items-center justify-center"
            aria-label="Skip tour"
          >
            <X className="w-3.5 h-3.5 text-[#8E8E93]" />
          </button>
        </div>

        {/* Content */}
        <div className="px-5 pb-2">
          <div className="flex items-center gap-4 mb-4">
            <div
              className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0"
              style={{ backgroundColor: current.iconBg }}
            >
              <Icon
                className="w-6 h-6"
                style={{ color: current.iconColor }}
                strokeWidth={2}
              />
            </div>
            <div className="flex-1">
              <p className="text-[16px] font-bold text-[#1C1C1E] leading-tight">{current.title}</p>
              <p className="text-[12px] text-[#8E8E93] mt-0.5">
                Step {step + 1} of {STEPS.length}
              </p>
            </div>
          </div>

          <p className="text-[14px] text-[#3C3C43] leading-relaxed mb-5">{current.body}</p>
        </div>

        {/* Actions */}
        <div className="flex gap-2 px-5 pb-5">
          {step > 0 && (
            <button
              onClick={() => setStep((s) => s - 1)}
              className="flex-1 py-3 rounded-2xl border border-[#E5E5EA] text-[14px] font-semibold text-[#8E8E93]"
            >
              Back
            </button>
          )}
          <button
            onClick={next}
            className="flex-1 py-3 rounded-2xl bg-[#6B0F1A] text-white text-[14px] font-semibold"
          >
            {isLast ? 'Finish 🎉' : 'Next'}
          </button>
          {step === 0 && (
            <button
              onClick={dismiss}
              className="py-3 px-4 rounded-2xl border border-[#E5E5EA] text-[14px] font-semibold text-[#8E8E93]"
            >
              Skip
            </button>
          )}
        </div>
      </div>
    </>
  )
}
