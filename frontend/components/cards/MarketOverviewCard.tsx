'use client'

import { TrendingUp, TrendingDown, Minus } from 'lucide-react'
import { clsx } from 'clsx'

const marketData = [
  { symbol: 'EURUSD', name: 'Euro / US Dollar', price: 1.0856, change: 0.0012, changePercent: 0.11 },
  { symbol: 'GBPUSD', name: 'British Pound / USD', price: 1.2734, change: -0.0008, changePercent: -0.06 },
  { symbol: 'USDJPY', name: 'US Dollar / Yen', price: 148.52, change: 0.45, changePercent: 0.30 },
  { symbol: 'XAUUSD', name: 'Gold / US Dollar', price: 2045.80, change: -12.40, changePercent: -0.60 },
]

export function MarketOverviewCard() {
  return (
    <div className="bg-bg-secondary border border-border rounded-xl p-6 h-full">
      <h3 className="text-xl font-semibold text-text-primary mb-4">Market Overview</h3>
      <div className="space-y-3">
        {marketData.map((market) => (
          <div key={market.symbol} className="flex items-center justify-between p-3 bg-bg-tertiary rounded-lg hover:bg-bg-tertiary/80 transition-colors">
            <div>
              <span className="text-text-primary font-medium">{market.symbol}</span>
              <p className="text-text-secondary text-xs">{market.name}</p>
            </div>
            <div className="text-right">
              <p className="text-text-primary font-mono">{market.price.toFixed(market.symbol === 'XAUUSD' ? 2 : 4)}</p>
              <div className="flex items-center gap-1 justify-end">
                {market.change > 0 ? (
                  <TrendingUp className="w-3 h-3 text-emerald-400" />
                ) : market.change < 0 ? (
                  <TrendingDown className="w-3 h-3 text-red-400" />
                ) : (
                  <Minus className="w-3 h-3 text-text-secondary" />
                )}
                <span className={clsx(
                  'text-xs font-medium',
                  market.change > 0 ? 'text-emerald-400' : market.change < 0 ? 'text-red-400' : 'text-text-secondary'
                )}>
                  {market.changePercent > 0 ? '+' : ''}{market.changePercent.toFixed(2)}%
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
