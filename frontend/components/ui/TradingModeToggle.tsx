'use client'

import { useTradingStore } from '@/lib/store'
import { TrendingUp, Zap } from 'lucide-react'
import { clsx } from 'clsx'

export function TradingModeToggle() {
  const { tradingMode, setTradingMode } = useTradingStore()

  return (
    <div className="flex items-center bg-bg-tertiary rounded-lg p-1 gap-1">
      <button
        onClick={() => setTradingMode('swing')}
        className={clsx(
          'flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded transition-all duration-200',
          tradingMode === 'swing'
            ? 'bg-accent-secondary text-white'
            : 'text-text-secondary hover:text-text-primary'
        )}
      >
        <TrendingUp size={14} />
        Swing
      </button>
      <button
        onClick={() => setTradingMode('hft')}
        className={clsx(
          'flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded transition-all duration-200',
          tradingMode === 'hft'
            ? 'bg-warning text-bg-primary'
            : 'text-text-secondary hover:text-text-primary'
        )}
      >
        <Zap size={14} />
        HFT Scalp
      </button>
    </div>
  )
}
