import Image from 'next/image'
import { BottomNav } from './bottom-nav'

interface AppShellProps {
  businessName: string | null
  children: React.ReactNode
}

function getGreeting(): string {
  const hour = new Date().getHours()
  if (hour >= 5 && hour < 12) return 'Good morning'
  if (hour >= 12 && hour < 17) return 'Good afternoon'
  return 'Good evening'
}

export function AppShell({ businessName, children }: AppShellProps) {
  const greeting = getGreeting()

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Sticky header */}
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-xl border-b border-[#F0F0F0]"
        style={{ paddingTop: 'env(safe-area-inset-top, 0px)' }}>
        <div className="flex items-center justify-between px-5 py-3">
          <div>
            <p className="text-[12px] text-[#8E8E93] font-medium">{greeting}</p>
            <p className="text-[17px] font-bold text-[#1C1C1E] leading-tight mt-0.5">
              {businessName ?? 'Chérie'}
            </p>
          </div>
          <Image
            src="/icons/cherry-mark.png"
            alt="Chérie"
            width={48}
            height={48}
            className="object-contain"
          />
        </div>
      </header>

      <main className="flex-1 px-4 pb-32 pt-4">
        {children}
      </main>

      <BottomNav />
    </div>
  )
}
