'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  LayoutDashboard, BarChart3, Activity, Target, 
  Bot, BookOpen, Settings, Menu, X, Zap, Wifi, WifiOff
} from 'lucide-react'
import { useConnectionStore, useTradingStore } from '@/lib/store'

const navItems = [
  { href: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/chart', icon: BarChart3, label: 'Chart' },
  { href: '/orderflow', icon: Activity, label: 'Flow' },
  { href: '/analysis', icon: Target, label: 'Analysis' },
  { href: '/ai', icon: Bot, label: 'AI' },
  { href: '/journal', icon: BookOpen, label: 'Journal' },
  { href: '/settings', icon: Settings, label: 'Settings' },
]

export function MobileNav() {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()
  const { mt5Connected } = useConnectionStore()
  const { symbol, timeframe } = useTradingStore()

  return (
    <>
      {/* Mobile Header */}
      <header className="md:hidden fixed top-0 left-0 right-0 z-50 glass border-b border-zinc-800/50">
        <div className="flex items-center justify-between px-4 py-3">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-lg flex items-center justify-center">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-lg bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
              ICT
            </span>
          </Link>
          
          <div className="flex items-center gap-3">
            <div className={`flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium ${
              mt5Connected ? 'bg-green-500/20 text-green-400' : 'bg-zinc-700/50 text-zinc-400'
            }`}>
              {mt5Connected ? <Wifi className="w-3 h-3" /> : <WifiOff className="w-3 h-3" />}
              <span className="hidden">{mt5Connected ? 'Live' : 'Demo'}</span>
            </div>
            
            <button 
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-lg hover:bg-zinc-800/50 transition-colors"
            >
              {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
        
        <div className="px-4 pb-2 flex items-center gap-2 text-sm">
          <span className="font-mono font-semibold text-zinc-200">{symbol}</span>
          <span className="text-zinc-500">•</span>
          <span className="text-zinc-400">{timeframe}</span>
        </div>
      </header>

      {/* Desktop Sidebar */}
      <aside className="hidden md:flex fixed left-0 top-0 bottom-0 w-64 flex-col bg-[#111827] border-r border-zinc-800/50 z-40">
        <div className="p-6 border-b border-zinc-800/50">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="font-bold text-xl text-white">ICT Pulse</h1>
              <p className="text-xs text-zinc-500">Institutional Trading</p>
            </div>
          </Link>
        </div>
        
        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                  isActive 
                    ? 'bg-cyan-500/10 text-cyan-400' 
                    : 'text-zinc-400 hover:text-white hover:bg-zinc-800/50'
                }`}
              >
                <item.icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </Link>
            )
          })}
        </nav>
        
        <div className="p-4 border-t border-zinc-800/50">
          <div className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm ${
            mt5Connected ? 'bg-green-500/10 text-green-400' : 'bg-zinc-800/50 text-zinc-400'
          }`}>
            {mt5Connected ? <Wifi className="w-4 h-4" /> : <WifiOff className="w-4 h-4" />}
            <span>{mt5Connected ? 'MT5 Connected' : 'Demo Mode'}</span>
          </div>
        </div>
      </aside>

      {/* Mobile Menu Overlay */}
      {isOpen && (
        <div className="md:hidden fixed inset-0 z-50 bg-black/80 backdrop-blur-sm" onClick={() => setIsOpen(false)}>
          <nav 
            className="absolute top-0 right-0 w-72 h-full bg-[#111827] border-l border-zinc-800/50 p-4 space-y-1"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <span className="font-bold text-lg">Menu</span>
              <button onClick={() => setIsOpen(false)} className="p-2 rounded-lg hover:bg-zinc-800/50">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            {navItems.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                    isActive 
                      ? 'bg-cyan-500/10 text-cyan-400' 
                      : 'text-zinc-400 hover:text-white hover:bg-zinc-800/50'
                  }`}
                >
                  <item.icon className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                </Link>
              )
            })}
          </nav>
        </div>
      )}

      {/* Bottom Navigation - Mobile */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 glass border-t border-zinc-800/50 safe-bottom">
        <div className="flex items-center justify-around px-2 py-2">
          {navItems.slice(0, 5).map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex flex-col items-center gap-1 px-3 py-2 rounded-xl transition-all min-w-[56px] ${
                  isActive 
                    ? 'text-cyan-400' 
                    : 'text-zinc-500 hover:text-zinc-300'
                }`}
              >
                <item.icon className="w-5 h-5" />
                <span className="text-[10px] font-medium">{item.label}</span>
              </Link>
            )
          })}
        </div>
      </nav>
    </>
  )
}

export function MainContent({ children }: { children: React.ReactNode }) {
  return (
    <main className="md:ml-64 min-h-screen pb-20 md:pb-0 pt-28 md:pt-0">
      <div className="p-4 md:p-6 lg:p-8">
        {children}
      </div>
    </main>
  )
}
