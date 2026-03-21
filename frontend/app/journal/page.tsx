'use client'

import { useState } from 'react'
import { BookOpen, Filter, Download, Search, Calendar, Tag, TrendingUp, TrendingDown, ArrowUpRight, ArrowDownRight, BarChart3 } from 'lucide-react'
import { clsx } from 'clsx'

interface Trade {
  id: string
  symbol: string
  type: 'buy' | 'sell'
  entryPrice: number
  exitPrice: number
  volume: number
  pnl: number
  pnlPercent: number
  strategy: string
  tags: string[]
  date: string
  notes: string
}

const demoTrades: Trade[] = [
  {
    id: '1',
    symbol: 'EURUSD',
    type: 'buy',
    entryPrice: 1.0832,
    exitPrice: 1.0865,
    volume: 0.5,
    pnl: 165.00,
    pnlPercent: 3.05,
    strategy: 'Silver Bullet',
    tags: ['FVG', 'BOS'],
    date: '2024-01-15',
    notes: 'Classic FVG entry on 1H. Price rejected from order block and filled FVG perfectly.'
  },
  {
    id: '2',
    symbol: 'GBPUSD',
    type: 'sell',
    entryPrice: 1.2750,
    exitPrice: 1.2734,
    volume: 0.3,
    pnl: 48.00,
    pnlPercent: 1.26,
    strategy: 'Order Block',
    tags: ['OB', 'Breaker'],
    date: '2024-01-14',
    notes: 'Bearish order block on 4H. Took liquidity above previous high first.'
  },
  {
    id: '3',
    symbol: 'USDJPY',
    type: 'sell',
    entryPrice: 148.50,
    exitPrice: 148.20,
    volume: 0.4,
    pnl: -80.00,
    pnlPercent: -1.35,
    strategy: 'Liquidity Grab',
    tags: ['Liq', 'Killzone'],
    date: '2024-01-13',
    notes: 'London killzone liquidity grab. Stop hunt triggered before move down.'
  }
]

export default function JournalPage() {
  const [trades] = useState<Trade[]>(demoTrades)
  const [filter, setFilter] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')

  const filteredTrades = trades.filter(trade => {
    if (filter !== 'all' && trade.type !== filter) return false
    if (searchTerm && !trade.symbol.toLowerCase().includes(searchTerm.toLowerCase())) return false
    return true
  })

  const totalPnl = filteredTrades.reduce((sum, t) => sum + t.pnl, 0)
  const winRate = (filteredTrades.filter(t => t.pnl > 0).length / filteredTrades.length * 100) || 0

  return (
    <div className="min-h-screen bg-bg-primary p-6">
      <div className="max-w-[1400px] mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-text-primary font-display">
              Trading Journal
            </h1>
            <p className="text-text-secondary mt-1">
              Review and analyze your trade history
            </p>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-bg-secondary border border-border hover:bg-bg-tertiary text-text-primary rounded-lg transition-colors">
            <Download className="w-5 h-5" />
            Export
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-bg-secondary border border-border rounded-xl p-4">
            <span className="text-text-secondary text-sm">Total P&L</span>
            <p className={clsx('text-2xl font-bold mt-1', totalPnl >= 0 ? 'text-emerald-400' : 'text-red-400')}>
              {totalPnl >= 0 ? '+' : ''}${totalPnl.toFixed(2)}
            </p>
          </div>
          <div className="bg-bg-secondary border border-border rounded-xl p-4">
            <span className="text-text-secondary text-sm">Win Rate</span>
            <p className="text-2xl font-bold text-text-primary mt-1">{winRate.toFixed(1)}%</p>
          </div>
          <div className="bg-bg-secondary border border-border rounded-xl p-4">
            <span className="text-text-secondary text-sm">Total Trades</span>
            <p className="text-2xl font-bold text-text-primary mt-1">{filteredTrades.length}</p>
          </div>
          <div className="bg-bg-secondary border border-border rounded-xl p-4">
            <span className="text-text-secondary text-sm">Avg. Win</span>
            <p className="text-2xl font-bold text-emerald-400 mt-1">
              ${(filteredTrades.filter(t => t.pnl > 0).reduce((s, t) => s + t.pnl, 0) / Math.max(1, filteredTrades.filter(t => t.pnl > 0).length)).toFixed(2)}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4 mb-6">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-secondary" />
            <input
              type="text"
              placeholder="Search trades..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-bg-secondary border border-border rounded-lg pl-10 pr-4 py-2 text-text-primary placeholder:text-text-secondary"
            />
          </div>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="bg-bg-secondary border border-border rounded-lg px-4 py-2 text-text-primary"
          >
            <option value="all">All Trades</option>
            <option value="buy">Long Only</option>
            <option value="sell">Short Only</option>
          </select>
        </div>

        <div className="space-y-4">
          {filteredTrades.map((trade) => (
            <div key={trade.id} className="bg-bg-secondary border border-border rounded-xl p-4 hover:border-indigo-500/50 transition-colors">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className={clsx(
                    'p-2 rounded-lg',
                    trade.type === 'buy' ? 'bg-emerald-500/20' : 'bg-red-500/20'
                  )}>
                    {trade.type === 'buy' ? (
                      <TrendingUp className="w-5 h-5 text-emerald-400" />
                    ) : (
                      <TrendingDown className="w-5 h-5 text-red-400" />
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-lg font-semibold text-text-primary">{trade.symbol}</span>
                      <span className={clsx(
                        'px-2 py-0.5 rounded text-xs font-medium',
                        trade.type === 'buy' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'
                      )}>
                        {trade.type.toUpperCase()}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-text-secondary">
                      <span>{trade.strategy}</span>
                      <span>•</span>
                      <span>{trade.date}</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className={clsx(
                    'text-lg font-bold',
                    trade.pnl >= 0 ? 'text-emerald-400' : 'text-red-400'
                  )}>
                    {trade.pnl >= 0 ? '+' : ''}${trade.pnl.toFixed(2)}
                  </p>
                  <p className="text-text-secondary text-sm">
                    {trade.pnlPercent >= 0 ? '+' : ''}{trade.pnlPercent.toFixed(2)}%
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3 p-3 bg-bg-tertiary rounded-lg">
                <div>
                  <span className="text-text-secondary text-xs">Entry</span>
                  <p className="text-text-primary font-mono">{trade.entryPrice.toFixed(5)}</p>
                </div>
                <div>
                  <span className="text-text-secondary text-xs">Exit</span>
                  <p className="text-text-primary font-mono">{trade.exitPrice.toFixed(5)}</p>
                </div>
                <div>
                  <span className="text-text-secondary text-xs">Volume</span>
                  <p className="text-text-primary">{trade.volume.toFixed(2)}</p>
                </div>
                <div>
                  <span className="text-text-secondary text-xs">Tags</span>
                  <div className="flex gap-1 mt-1">
                    {trade.tags.map((tag) => (
                      <span key={tag} className="px-1.5 py-0.5 bg-indigo-500/20 text-indigo-400 rounded text-xs">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <p className="text-text-secondary text-sm">{trade.notes}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
