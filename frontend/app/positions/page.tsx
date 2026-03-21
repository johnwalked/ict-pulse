'use client'

import { useState } from 'react'
import { useTradingStore } from '@/lib/store'
import { Plus, X, Edit2, TrendingUp, TrendingDown, Clock, Target, AlertCircle } from 'lucide-react'
import { clsx } from 'clsx'

interface Position {
  id: string
  symbol: string
  type: 'buy' | 'sell'
  entryPrice: number
  currentPrice: number
  volume: number
  pnl: number
  pnlPercent: number
  sl: number
  tp: number
  timeframe: string
  openTime: string
}

const demoPositions: Position[] = [
  {
    id: '1',
    symbol: 'EURUSD',
    type: 'buy',
    entryPrice: 1.0832,
    currentPrice: 1.0865,
    volume: 0.5,
    pnl: 165.00,
    pnlPercent: 3.05,
    sl: 1.0810,
    tp: 1.0920,
    timeframe: '1H',
    openTime: '2h ago'
  },
  {
    id: '2',
    symbol: 'GBPUSD',
    type: 'sell',
    entryPrice: 1.2750,
    currentPrice: 1.2734,
    volume: 0.3,
    pnl: 48.00,
    pnlPercent: 1.26,
    sl: 1.2780,
    tp: 1.2680,
    timeframe: '4H',
    openTime: '5h ago'
  }
]

export default function PositionsPage() {
  const { positions, removePosition } = useTradingStore()
  const [showModal, setShowModal] = useState(false)
  const displayPositions = positions.length > 0 ? positions : demoPositions
  const totalPnl = displayPositions.reduce((sum, p) => sum + p.pnl, 0)

  return (
    <div className="min-h-screen bg-bg-primary p-6">
      <div className="max-w-[1400px] mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-text-primary font-display">
              Open Positions
            </h1>
            <p className="text-text-secondary mt-1">
              Manage your active trades
            </p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors"
          >
            <Plus className="w-5 h-5" />
            New Position
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-bg-secondary border border-border rounded-xl p-4">
            <div className="flex items-center justify-between">
              <span className="text-text-secondary text-sm">Total P&L</span>
              <span className={clsx(
                'text-lg font-bold',
                totalPnl >= 0 ? 'text-emerald-400' : 'text-red-400'
              )}>
                {totalPnl >= 0 ? '+' : ''}${totalPnl.toFixed(2)}
              </span>
            </div>
          </div>
          <div className="bg-bg-secondary border border-border rounded-xl p-4">
            <div className="flex items-center justify-between">
              <span className="text-text-secondary text-sm">Active Positions</span>
              <span className="text-lg font-bold text-text-primary">{displayPositions.length}</span>
            </div>
          </div>
          <div className="bg-bg-secondary border border-border rounded-xl p-4">
            <div className="flex items-center justify-between">
              <span className="text-text-secondary text-sm">Win Rate</span>
              <span className="text-lg font-bold text-emerald-400">68%</span>
            </div>
          </div>
        </div>

        <div className="bg-bg-secondary border border-border rounded-xl overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="text-text-secondary text-sm border-b border-border">
                <th className="text-left py-4 px-4">Symbol</th>
                <th className="text-left py-4 px-4">Type</th>
                <th className="text-right py-4 px-4">Entry</th>
                <th className="text-right py-4 px-4">Current</th>
                <th className="text-right py-4 px-4">Volume</th>
                <th className="text-right py-4 px-4">P&L</th>
                <th className="text-right py-4 px-4">SL / TP</th>
                <th className="text-right py-4 px-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {displayPositions.map((pos) => (
                <tr key={pos.id} className="border-b border-border/50 hover:bg-bg-tertiary/50">
                  <td className="py-4 px-4">
                    <div>
                      <span className="text-text-primary font-medium">{pos.symbol}</span>
                      <span className="text-text-secondary text-xs ml-2">{pos.timeframe}</span>
                    </div>
                    <span className="text-text-secondary text-xs">{pos.openTime}</span>
                  </td>
                  <td className="py-4 px-4">
                    <span className={clsx(
                      'inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium',
                      pos.type === 'buy' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'
                    )}>
                      {pos.type === 'buy' ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                      {pos.type.toUpperCase()}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-right font-mono text-text-primary">{pos.entryPrice.toFixed(5)}</td>
                  <td className="py-4 px-4 text-right font-mono text-text-primary">{pos.currentPrice.toFixed(5)}</td>
                  <td className="py-4 px-4 text-right text-text-primary">{pos.volume.toFixed(2)}</td>
                  <td className="py-4 px-4 text-right">
                    <span className={clsx(
                      'font-medium',
                      pos.pnl >= 0 ? 'text-emerald-400' : 'text-red-400'
                    )}>
                      {pos.pnl >= 0 ? '+' : ''}${pos.pnl.toFixed(2)}
                      <span className="text-xs ml-1">({pos.pnlPercent >= 0 ? '+' : ''}{pos.pnlPercent.toFixed(2)}%)</span>
                    </span>
                  </td>
                  <td className="py-4 px-4 text-right text-text-secondary text-sm">
                    {pos.sl.toFixed(5)} / {pos.tp.toFixed(5)}
                  </td>
                  <td className="py-4 px-4 text-right">
                    <button
                      onClick={() => removePosition(pos.id)}
                      className="p-2 hover:bg-red-500/20 rounded transition-colors"
                    >
                      <X className="w-4 h-4 text-red-400" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
