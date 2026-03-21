'use client'

import { useTradingStore } from '@/lib/store'
import { clsx } from 'clsx'

const timeframes = [
  { label: '1m', value: '1m' },
  { label: '5m', value: '5m' },
  { label: '15m', value: '15m' },
  { label: '30m', value: '30m' },
  { label: '1H', value: '1H' },
  { label: '4H', value: '4H' },
  { label: '1D', value: '1D' },
  { label: '1W', value: '1W' },
]

export function TimeframeSelector() {
  const { timeframe, setTimeframe } = useTradingStore()

  return (
    <div className="flex items-center bg-bg-tertiary rounded-lg p-1 gap-1">
      {timeframes.map((tf) => (
        <button
          key={tf.value}
          onClick={() => setTimeframe(tf.value)}
          className={clsx(
            'px-2.5 py-1 text-xs font-mono font-medium rounded transition-all duration-200',
            timeframe === tf.value
              ? 'bg-accent-primary text-white'
              : 'text-text-secondary hover:text-text-primary hover:bg-bg-secondary'
          )}
        >
          {tf.label}
        </button>
      ))}
    </div>
  )
}
