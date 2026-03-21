'use client'

import { useState, useEffect, useRef } from 'react'
import { useTradingStore } from '@/lib/store'
import { Activity, TrendingUp, TrendingDown, BarChart3, Clock } from 'lucide-react'
import { clsx } from 'clsx'

interface OrderFlowItem {
  time: string
  price: number
  bidVol: number
  askVol: number
  delta: number
  cumulative: number
  type: 'buy' | 'sell' | 'neutral'
}

const demoOrderFlow: OrderFlowItem[] = Array.from({ length: 50 }, (_, i) => {
  const bidVol = Math.floor(Math.random() * 1000) + 500
  const askVol = Math.floor(Math.random() * 1000) + 500
  const delta = bidVol - askVol
  return {
    time: `${Math.floor(i / 60)}:${String(i % 60).padStart(2, '0')}`,
    price: 1.0850 + (Math.random() - 0.5) * 0.001,
    bidVol,
    askVol,
    delta,
    cumulative: delta + (i > 0 ? (Math.random() - 0.5) * 200 : 0),
    type: delta > 0 ? 'buy' : delta < 0 ? 'sell' : 'neutral'
  }
})

export default function OrderFlowPage() {
  const { symbol, timeframe } = useTradingStore()
  const [orderFlow] = useState<OrderFlowItem[]>(demoOrderFlow)
  const [selectedRange, setSelectedRange] = useState('1H')

  return (
    <div className="min-h-screen bg-bg-primary p-6">
      <div className="max-w-[1800px] mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-text-primary font-display">
              Order Flow Analysis
            </h1>
            <p className="text-text-secondary mt-1">
              {symbol} • {timeframe} • Real-time delta tracking
            </p>
          </div>
          <div className="flex items-center gap-3">
            <select 
              value={selectedRange}
              onChange={(e) => setSelectedRange(e.target.value)}
              className="bg-bg-secondary border border-border rounded-lg px-4 py-2 text-text-primary"
            >
              <option value="15m">15 Minutes</option>
              <option value="30m">30 Minutes</option>
              <option value="1H" selected>1 Hour</option>
              <option value="4H">4 Hours</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-bg-secondary border border-border rounded-xl overflow-hidden">
            <div className="px-4 py-3 border-b border-border flex items-center justify-between">
              <div className="flex items-center gap-4">
                <h2 className="text-lg font-semibold text-text-primary">Delta Flow</h2>
                <div className="flex items-center gap-4 text-sm">
                  <span className="flex items-center gap-1">
                    <span className="w-3 h-3 bg-emerald-500 rounded"></span>
                    Buy Volume
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="w-3 h-3 bg-red-500 rounded"></span>
                    Sell Volume
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-emerald-400" />
                <span className="text-sm text-text-secondary">Live</span>
              </div>
            </div>
            <div className="p-4">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="text-text-secondary text-xs border-b border-border">
                      <th className="text-left py-2 px-3">Time</th>
                      <th className="text-right py-2 px-3">Price</th>
                      <th className="text-right py-2 px-3">Bid Vol</th>
                      <th className="text-right py-2 px-3">Ask Vol</th>
                      <th className="text-right py-2 px-3">Delta</th>
                      <th className="text-right py-2 px-3">Cumulative</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orderFlow.slice(0, 20).map((row, i) => (
                      <tr key={i} className={clsx(
                        'border-b border-border/50 hover:bg-bg-tertiary/50',
                        row.type === 'buy' && 'bg-emerald-500/5',
                        row.type === 'sell' && 'bg-red-500/5'
                      )}>
                        <td className="py-2 px-3 text-text-secondary text-sm">{row.time}</td>
                        <td className="py-2 px-3 text-text-primary text-right font-mono">{row.price.toFixed(5)}</td>
                        <td className="py-2 px-3 text-emerald-400 text-right">{row.bidVol.toLocaleString()}</td>
                        <td className="py-2 px-3 text-red-400 text-right">{row.askVol.toLocaleString()}</td>
                        <td className={clsx(
                          'py-2 px-3 text-right font-medium',
                          row.delta > 0 ? 'text-emerald-400' : row.delta < 0 ? 'text-red-400' : 'text-text-secondary'
                        )}>
                          {row.delta > 0 ? '+' : ''}{row.delta.toLocaleString()}
                        </td>
                        <td className={clsx(
                          'py-2 px-3 text-right font-medium',
                          row.cumulative > 0 ? 'text-emerald-400' : row.cumulative < 0 ? 'text-red-400' : 'text-text-secondary'
                        )}>
                          {row.cumulative > 0 ? '+' : ''}{Math.round(row.cumulative).toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-bg-secondary border border-border rounded-xl p-4">
              <h3 className="text-lg font-semibold text-text-primary mb-4">Order Flow Metrics</h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-text-secondary text-sm">Buy Pressure</span>
                    <span className="text-emerald-400 font-medium">62%</span>
                  </div>
                  <div className="h-2 bg-bg-tertiary rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-500 rounded-full" style={{ width: '62%' }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-text-secondary text-sm">Sell Pressure</span>
                    <span className="text-red-400 font-medium">38%</span>
                  </div>
                  <div className="h-2 bg-bg-tertiary rounded-full overflow-hidden">
                    <div className="h-full bg-red-500 rounded-full" style={{ width: '38%' }}></div>
                  </div>
                </div>
                <div className="pt-4 border-t border-border">
                  <div className="flex justify-between items-center">
                    <span className="text-text-secondary text-sm">Cumulative Delta</span>
                    <span className="text-emerald-400 font-bold text-lg">+2,450</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-bg-secondary border border-border rounded-xl p-4">
              <h3 className="text-lg font-semibold text-text-primary mb-4">Imbalances</h3>
              <div className="space-y-3">
                <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-lg">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-emerald-400 text-sm font-medium">Bullish Imbalance</span>
                    <TrendingUp className="w-4 h-4 text-emerald-400" />
                  </div>
                  <p className="text-text-secondary text-xs">1.0852 - 1.0855</p>
                  <p className="text-text-secondary text-xs mt-1">Ratio: 3.2:1</p>
                </div>
                <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-red-400 text-sm font-medium">Bearish Imbalance</span>
                    <TrendingDown className="w-4 h-4 text-red-400" />
                  </div>
                  <p className="text-text-secondary text-xs">1.0868 - 1.0872</p>
                  <p className="text-text-secondary text-xs mt-1">Ratio: 2.1:1</p>
                </div>
              </div>
            </div>

            <div className="bg-bg-secondary border border-border rounded-xl p-4">
              <h3 className="text-lg font-semibold text-text-primary mb-4">Time Statistics</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-text-secondary text-sm">High Volume Nodes</span>
                  <span className="text-text-primary font-medium">1.0855</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-text-secondary text-sm">Low Volume Nodes</span>
                  <span className="text-text-primary font-medium">1.0830</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-text-secondary text-sm">Max Delta Time</span>
                  <span className="text-text-primary font-medium">14:32</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
