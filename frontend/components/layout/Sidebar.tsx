'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  LayoutDashboard, 
  LineChart, 
  Activity, 
  Briefcase, 
  BookOpen, 
  Bot, 
  Settings,
  ChevronLeft,
  ChevronRight
} from 'lucide-react'
import { useState } from 'react'
import { clsx } from 'clsx'

const navItems = [
  { href: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/chart', icon: LineChart, label: 'Chart' },
  { href: '/orderflow', icon: Activity, label: 'Order Flow' },
  { href: '/positions', icon: Briefcase, label: 'Positions' },
  { href: '/journal', icon: BookOpen, label: 'Journal' },
  { href: '/ai', icon: Bot, label: 'AI Assistant' },
  { href: '/settings', icon: Settings, label: 'Settings' },
]

export function Sidebar() {
  const pathname = usePathname()
  const [collapsed, setCollapsed] = useState(false)

  return (
    <aside 
      className={clsx(
        'bg-bg-secondary border-r border-border flex flex-col transition-all duration-300',
        collapsed ? 'w-16' : 'w-60'
      )}
    >
      {/* Logo */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-border">
        {!collapsed && (
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-accent-primary to-accent-secondary flex items-center justify-center">
              <span className="text-white font-bold text-sm">ICT</span>
            </div>
            <span className="font-mono font-bold text-lg">PULSE</span>
          </div>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-1.5 rounded-lg hover:bg-bg-tertiary transition-colors text-text-secondary"
        >
          {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4 px-2 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              className={clsx(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200',
                isActive 
                  ? 'bg-accent-primary/10 text-accent-primary border border-accent-primary/30' 
                  : 'text-text-secondary hover:text-text-primary hover:bg-bg-tertiary'
              )}
            >
              <item.icon size={20} className={clsx(isActive && 'text-accent-primary')} />
              {!collapsed && (
                <span className="font-medium text-sm">{item.label}</span>
              )}
            </Link>
          )
        })}
      </nav>

      {/* Footer */}
      {!collapsed && (
        <div className="p-4 border-t border-border">
          <div className="bg-bg-tertiary rounded-lg p-3">
            <p className="text-xs text-text-tertiary mb-1">Demo Mode</p>
            <p className="text-sm font-medium text-text-secondary">Simulated Data</p>
          </div>
        </div>
      )}
    </aside>
  )
}
