'use client'

import { useConnectionStore, useTradingStore } from '@/lib/store'
import { ConnectionStatus } from '@/components/ui/ConnectionStatus'
import { TimeframeSelector } from '@/components/ui/TimeframeSelector'
import { TradingModeToggle } from '@/components/ui/TradingModeToggle'
import { SymbolSearch } from '@/components/ui/SymbolSearch'
import { Bell, User } from 'lucide-react'

export function TopBar() {
  const { tradingMode } = useTradingStore()

  return (
    <header className="h-14 bg-bg-secondary border-b border-border flex items-center justify-between px-4">
      {/* Left side */}
      <div className="flex items-center gap-4">
        <SymbolSearch />
        <TimeframeSelector />
        <TradingModeToggle />
      </div>

      {/* Center */}
      <div className="flex items-center gap-2">
        <span className="text-xs text-text-tertiary font-mono">
          {tradingMode === 'swing' ? 'SWING MODE' : 'HFT SCALP MODE'}
        </span>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-4">
        <ConnectionStatus />
        <button className="relative p-2 rounded-lg hover:bg-bg-tertiary transition-colors text-text-secondary">
          <Bell size={18} />
          <span className="absolute top-1 right-1 w-2 h-2 bg-bear rounded-full" />
        </button>
        <div className="flex items-center gap-2 pl-3 border-l border-border">
          <div className="w-8 h-8 rounded-full bg-accent-primary/20 flex items-center justify-center">
            <User size={16} className="text-accent-primary" />
          </div>
          <span className="text-sm font-medium text-text-secondary">Demo User</span>
        </div>
      </div>
    </header>
  )
}
