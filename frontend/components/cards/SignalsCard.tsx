'use client'

import { Signal, Clock, Target, TrendingUp } from 'lucide-react'
import { clsx } from 'clsx'

const signals = [
  { 
    id: 1,
    type: 'Bullish FVG', 
    symbol: 'EURUSD', 
    timeframe: '1H',
    strength: 85,
    entry: 1.0845,
    sl: 1.0810,
    tp: 1.0920,
    timeLeft: '2h 30m'
  },
  { 
    id: 2,
    type: 'Order Block', 
    symbol: 'GBPUSD', 
    timeframe: '4H',
    strength: 72,
    entry: 1.2720,
    sl: 1.2685,
    tp: 1.2790,
    timeLeft: 'Expired'
  },
  { 
    id: 3,
    type: 'Liquidity Grab', 
    symbol: 'USDJPY', 
    timeframe: '15m',
    strength: 68,
    entry: 148.80,
    sl: 149.00,
    tp: 148.20,
    timeLeft: '45m'
  },
]

export function SignalsCard() {
  return (
    <div className="bg-bg-secondary border border-border rounded-xl p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-semibold text-text-primary">Active Signals</h3>
        <span className="px-2 py-1 bg-emerald-500/20 text-emerald-400 rounded text-xs font-medium">
          {signals.length} Active
        </span>
      </div>
      <div className="space-y-3">
        {signals.map((signal) => (
          <div key={signal.id} className="p-4 bg-bg-tertiary rounded-lg hover:bg-bg-tertiary/80 transition-colors">
            <div className="flex items-start justify-between mb-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-text-primary font-medium">{signal.type}</span>
                  <span className="text-text-secondary text-sm">• {signal.symbol}</span>
                </div>
                <div className="flex items-center gap-2 mt-1">
                  <Clock className="w-3 h-3 text-text-secondary" />
                  <span className="text-text-secondary text-xs">{signal.timeframe}</span>
                </div>
              </div>
              <div className="text-right">
                <div className="flex items-center gap-1">
                  <Signal className="w-3 h-3 text-indigo-400" />
                  <span className="text-indigo-400 font-medium text-sm">{signal.strength}%</span>
                </div>
                <span className="text-text-secondary text-xs">{signal.timeLeft}</span>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-2 text-xs">
              <div>
                <span className="text-text-secondary">Entry</span>
                <p className="text-text-primary font-mono">{signal.entry.toFixed(5)}</p>
              </div>
              <div>
                <span className="text-text-secondary">SL</span>
                <p className="text-red-400 font-mono">{signal.sl.toFixed(5)}</p>
              </div>
              <div>
                <span className="text-text-secondary">TP</span>
                <p className="text-emerald-400 font-mono">{signal.tp.toFixed(5)}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
