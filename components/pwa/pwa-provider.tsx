'use client'

import { useEffect, useState } from 'react'
import { Download, X } from 'lucide-react'
import Image from 'next/image'

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

export function PWAProvider() {
  const [installPrompt, setInstallPrompt] = useState<BeforeInstallPromptEvent | null>(null)
  const [showBanner, setShowBanner] = useState(false)

  useEffect(() => {
    // Register service worker
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js').catch(() => {})
    }

    // Capture install prompt
    const handler = (e: Event) => {
      e.preventDefault()
      setInstallPrompt(e as BeforeInstallPromptEvent)
      // Only show banner if not already installed
      if (!window.matchMedia('(display-mode: standalone)').matches) {
        setShowBanner(true)
      }
    }

    window.addEventListener('beforeinstallprompt', handler)
    return () => window.removeEventListener('beforeinstallprompt', handler)
  }, [])

  async function handleInstall() {
    if (!installPrompt) return
    await installPrompt.prompt()
    const { outcome } = await installPrompt.userChoice
    if (outcome === 'accepted') setShowBanner(false)
    setInstallPrompt(null)
  }

  if (!showBanner) return null

  return (
    <div className="fixed bottom-24 left-4 right-4 z-50 animate-in slide-in-from-bottom-4 duration-300">
      <div className="bg-white rounded-2xl shadow-xl border border-[#E5E5EA] p-4 flex items-center gap-3">
        <Image
          src="/icons/icon-96x96.png"
          alt="Chérie"
          width={44}
          height={44}
          className="rounded-xl shrink-0"
        />
        <div className="flex-1 min-w-0">
          <p className="text-[14px] font-bold text-[#1C1C1E] leading-tight">Install Chérie</p>
          <p className="text-[12px] text-[#8E8E93] mt-0.5">Add to home screen for quick access</p>
        </div>
        <button
          onClick={handleInstall}
          className="shrink-0 bg-[#6B0F1A] text-white text-[13px] font-semibold px-3.5 py-2 rounded-xl flex items-center gap-1.5"
        >
          <Download className="w-3.5 h-3.5" />
          Install
        </button>
        <button
          onClick={() => setShowBanner(false)}
          className="shrink-0 w-7 h-7 flex items-center justify-center rounded-full bg-[#F2F2F7]"
          aria-label="Dismiss"
        >
          <X className="w-3.5 h-3.5 text-[#8E8E93]" />
        </button>
      </div>
    </div>
  )
}
