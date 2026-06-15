'use client'

import { useState } from 'react'
import Image from 'next/image'
import { setupBusinessAction } from './actions'

const CATEGORIES = [
  { value: 'heena_artist', label: 'Heena Artist', emoji: '🌿' },
  { value: 'beauty_parlor', label: 'Beauty Parlor', emoji: '💄' },
]

export default function SetupBusinessPage() {
  const [category, setCategory] = useState('')
  const [error, setError] = useState('')

  async function handleAction(formData: FormData) {
    if (!category) {
      setError('Please select a business type')
      return
    }
    if (!formData.get('businessName')?.toString().trim()) {
      setError('Please enter your business name')
      return
    }
    formData.set('category', category)
    await setupBusinessAction(formData)
  }

  return (
    <main className="min-h-screen bg-white flex flex-col px-5 pt-14 pb-10">
      <div className="flex flex-col items-center mb-10">
        <Image src="/logo.png" alt="Chérie" width={140} height={48} className="mb-2" />
        <p className="text-[22px] font-bold text-[#1C1C1E] mt-1">Set up your business</p>
        <p className="text-[14px] text-[#8E8E93] mt-1">Just a few details to get started</p>
      </div>

      <form action={handleAction} className="flex flex-col gap-4">
        {/* Business Name */}
        <div>
          <p className="text-[12px] font-bold text-[#8E8E93] uppercase tracking-widest mb-2 px-1">Business Name</p>
          <div className="bg-[#F5F5F5] rounded-2xl px-4 py-4">
            <input
              name="businessName"
              placeholder="e.g. Zara Bridal Studio"
              className="w-full text-[17px] text-[#1C1C1E] placeholder:text-[#C7C7CC] bg-transparent outline-none"
            />
          </div>
        </div>

        {/* Category cards */}
        <div>
          <p className="text-[12px] font-bold text-[#8E8E93] uppercase tracking-widest mb-2 px-1">Business Type</p>
          <div className="grid grid-cols-2 gap-3">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.value}
                type="button"
                onClick={() => { setCategory(cat.value); setError('') }}
                className={`rounded-2xl p-4 text-left border-2 transition-all active:scale-[0.97] ${
                  category === cat.value
                    ? 'border-[#6B0F1A] bg-[#6B0F1A]'
                    : 'border-[#F0F0F0] bg-[#F5F5F5]'
                }`}
              >
                <p className="text-2xl mb-2">{cat.emoji}</p>
                <p className={`text-[14px] font-bold leading-tight ${category === cat.value ? 'text-white' : 'text-[#1C1C1E]'}`}>
                  {cat.label}
                </p>
              </button>
            ))}
          </div>
        </div>

        {error && (
          <div className="bg-red-50 rounded-2xl px-4 py-3">
            <p className="text-[13px] text-red-600 text-center">{error}</p>
          </div>
        )}

        <button
          type="submit"
          className="w-full bg-[#6B0F1A] text-white rounded-2xl py-4 text-[17px] font-bold shadow-sm active:scale-[0.98] transition-transform mt-2"
        >
          Go to Dashboard →
        </button>
      </form>
    </main>
  )
}
