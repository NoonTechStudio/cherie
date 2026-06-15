'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, Calendar, Plus, Users, Settings } from 'lucide-react'
import { cn } from '@/lib/utils'

const LEFT_TABS = [
  { href: '/dashboard',    icon: Home,     label: 'Home',     exact: true },
  { href: '/appointments', icon: Calendar, label: 'Bookings', exact: false },
]

const RIGHT_TABS = [
  { href: '/clients',  icon: Users,     label: 'Clients',  exact: false },
  { href: '/settings', icon: Settings,  label: 'Settings', exact: false },
]

function NavTab({ href, icon: Icon, label, active }: {
  href: string; icon: React.ElementType; label: string; active: boolean
}) {
  return (
    <Link
      href={href}
      className="flex-1 flex flex-col items-center justify-center gap-[3px] h-full pt-1"
    >
      <div className={cn(
        'w-8 h-7 flex items-center justify-center rounded-lg transition-colors',
        active ? 'bg-[#6B0F1A]/10' : ''
      )}>
        <Icon
          className={cn('w-[22px] h-[22px] transition-colors', active ? 'text-[#6B0F1A]' : 'text-[#AEAEB2]')}
          strokeWidth={active ? 2.2 : 1.7}
        />
      </div>
      <span className={cn('text-[10px] font-semibold leading-none', active ? 'text-[#6B0F1A]' : 'text-[#AEAEB2]')}>
        {label}
      </span>
    </Link>
  )
}

export function BottomNav() {
  const pathname = usePathname()

  function isActive(href: string, exact: boolean) {
    if (exact) return pathname === href
    return pathname === href || pathname.startsWith(href + '/')
  }

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 bg-white border-t border-[#F0F0F0] flex items-start z-50 shadow-[0_-1px_0_rgba(0,0,0,0.05)]"
      style={{
        height: 'calc(62px + env(safe-area-inset-bottom, 0px))',
        paddingBottom: 'env(safe-area-inset-bottom, 0px)',
      }}
    >
      {LEFT_TABS.map((tab) => (
        <NavTab key={tab.href} {...tab} active={isActive(tab.href, tab.exact)} />
      ))}

      {/* FAB */}
      <div className="flex-1 flex justify-center items-start pt-0.5">
        <Link
          href="/appointments/new"
          className="w-12 h-12 rounded-full bg-[#6B0F1A] flex items-center justify-center shadow-lg -translate-y-5 active:scale-95 transition-transform"
          aria-label="New appointment"
        >
          <Plus className="w-5 h-5 text-white" strokeWidth={2.5} />
        </Link>
      </div>

      {RIGHT_TABS.map((tab) => (
        <NavTab key={tab.href} {...tab} active={isActive(tab.href, tab.exact)} />
      ))}
    </nav>
  )
}
