'use client'

import { Clock, ArrowUpRight, ArrowDownRight, Tag } from 'lucide-react'
import { clsx } from 'clsx'

const recentTrades = [
  { 
    id: 1,
    symbol: 'EURUSD',
    type: 'buy',
    entry: 1.0832,
    exit: 1.0865,
    pnl: 33.00,
    pnlPercent: 0.31,
    tags: ['FVG', 'BOS'],
    time: '2h ago'
  },
  { 
    id: 2,
    symbol: 'GBPUSD',
    type: 'sell',
    entry: 1.2750,
    exit: 1.2734,
    pnl: 48.00,
    pnlPercent: 0.48,
    tags: ['OB'],
    time: '5h ago'
  },
  { 
    id: 3,
    symbol: 'XAUUSD',
    type: 'sell',
    entry: 2058.00,
    exit: 2045.80,
    pnl: -122.00,
    pnlPercent: -1.18,
    tags: ['Liq'],
    time: '1d ago'
  },
]

export function RecentTradesCard() {
  return (
    <div className="bg-bg-secondary border border-border rounded-xl p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-semibold text-text-primary">Recent Trades</h3>
        <span className="text-text-secondary text-sm">Last 24h</span>
      </div>
      <div className="space-y-3">
        {recentTrades.map((trade) => (
          <div key={trade.id} className="flex items-center justify-between p-3 bg-bg-tertiary rounded-lg hover:bg-bg-tertiary/80 transition-colors">
            <div className="flex items-center gap-3">
              <div className={clsx(
                'p-2 rounded-lg',
                trade.type === 'buy' ? 'bg-emerald-500/20' : 'bg-red-500/20'
              )}>
                {trade.type === 'buy' ? (
                  <ArrowUpRight className="w-4 h-4 text-emerald-400" />
                ) : (
                  <ArrowDownRight className="w-4 h-4 text-red-400" />
                )}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-text-primary font-medium">{trade.symbol}</span>
                  <span className={clsx(
                    'px-1.5 py-0.5 rounded text-xs font-medium',
                    trade.type === 'buy' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'
                  )}>
                    {trade.type.toUpperCase()}
                  </span>
                </div>
                <div className="flex items-center gap-2 mt-1">
                  {trade.tags.map((tag) => (
                    <span key={tag} className="flex items-center gap-1 text-text-secondary text-xs">
                      <Tag className="w-3 h-3" />
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
            <div className="text-right">
              <p className={clsx(
                'font-medium',
                trade.pnl >= 0 ? 'text-emerald-400' : 'text-red-400'
              )}>
                {trade.pnl >= 0 ? '+' : ''}${trade.pnl.toFixed(2)}
              </p>
              <div className="flex items-center justify-end gap-1 mt-1">
                <Clock className="w-3 h-3 text-text-secondary" />
                <span className="text-text-secondary text-xs">{trade.time}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
