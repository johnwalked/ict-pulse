'use client'

import { useState } from 'react'
import { BookOpen, Filter, Download, Search, Calendar, Tag, TrendingUp, TrendingDown, BarChart3 } from 'lucide-react'
import { clsx } from 'clsx'

const journalEntries = [
  {
    id: '1',
    symbol: 'EURUSD',
    type: 'buy',
    entryPrice: 1.0820,
    exitPrice: 1.0880,
    lotSize: 0.10,
    openTime: Date.now() - 86400000,
    closeTime: Date.now() - 43200000,
    pnl: 60.00,
    pnlPercent: 0.55,
    outcome: 'win' as const,
    model: 'Kill Zone + FVG',
    session: 'London',
    notes: 'Good London KZ long. FVG provided confluence. R:R was 1:3.'
  },
  {
    id: '2',
    symbol: 'GBPUSD',
    type: 'sell',
    entryPrice: 1.2680,
    exitPrice: 1.2720,
    lotSize: 0.10,
    openTime: Date.now() - 172800000,
    closeTime: Date.now() - 86400000,
    pnl: -40.00,
    pnlPercent: -0.32,
    outcome: 'loss' as const,
    model: 'Silver Bullet',
    session: 'NY-AM',
    notes: 'Silver bullet setup failed. Stop hunted. Lesson: wait for displacement confirmation.'
  },
  {
    id: '3',
    symbol: 'XAUUSD',
    type: 'buy',
    entryPrice: 2320.00,
    exitPrice: 2350.00,
    lotSize: 0.05,
    openTime: Date.now() - 259200000,
    closeTime: Date.now() - 172800000,
    pnl: 150.00,
    pnlPercent: 0.64,
    outcome: 'win' as const,
    model: 'OTE Retracement',
    session: 'Asia',
    notes: 'Perfect 61.8% OTE long. Price respected the level. Strong momentum into London.'
  },
  {
    id: '4',
    symbol: 'EURUSD',
    type: 'sell',
    entryPrice: 1.0890,
    exitPrice: 1.0870,
    lotSize: 0.10,
    openTime: Date.now() - 345600000,
    closeTime: Date.now() - 259200000,
    pnl: 20.00,
    pnlPercent: 0.18,
    outcome: 'win' as const,
    model: 'Equal Highs',
    session: 'NY-PM',
    notes: 'Traded equal highs at 1.0890. Quick 20 pip target hit. Good risk management.'
  }
]

export default function JournalPage() {
  const [filter, setFilter] = useState<'all' | 'win' | 'loss'>('all')
  const [searchTerm, setSearchTerm] = useState('')
  
  const filteredEntries = journalEntries.filter(entry => {
    if (filter !== 'all' && entry.outcome !== filter) return false
    if (searchTerm && !entry.symbol.toLowerCase().includes(searchTerm.toLowerCase())) return false
    return true
  })
  
  const totalPnL = journalEntries.reduce((sum, e) => sum + e.pnl, 0)
  const winRate = (journalEntries.filter(e => e.outcome === 'win').length / journalEntries.length) * 100
  const avgWin = journalEntries.filter(e => e.outcome === 'win').reduce((sum, e) => sum + e.pnl, 0) / journalEntries.filter(e => e.outcome === 'win').length
  const avgLoss = journalEntries.filter(e => e.outcome === 'loss').reduce((sum, e) => sum + e.pnl, 0) / journalEntries.filter(e => e.outcome === 'loss').length
  
  return (
    <div className="min-h-screen bg-[#0a0e17] text-white">
      {/* Header */}
      <div className="border-b border-zinc-800 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <BookOpen className="w-6 h-6 text-cyan-400" />
            <div>
              <h1 className="text-2xl font-bold">Trading Journal</h1>
              <p className="text-zinc-500">Review your ICT trades and learn</p>
            </div>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-zinc-800 hover:bg-zinc-700 rounded-lg transition-colors">
            <Download className="w-4 h-4" />
            Export
          </button>
        </div>
      </div>
      
      {/* Stats */}
      <div className="p-6 grid grid-cols-4 gap-4">
        <div className="bg-zinc-900/80 border border-zinc-800 rounded-xl p-4">
          <p className="text-xs text-zinc-500 mb-1">Total P&L</p>
          <p className={clsx('text-2xl font-bold', totalPnL >= 0 ? 'text-green-400' : 'text-red-400')}>
            {totalPnL >= 0 ? '+' : ''}${totalPnL.toFixed(2)}
          </p>
        </div>
        <div className="bg-zinc-900/80 border border-zinc-800 rounded-xl p-4">
          <p className="text-xs text-zinc-500 mb-1">Win Rate</p>
          <p className="text-2xl font-bold text-cyan-400">{winRate.toFixed(0)}%</p>
        </div>
        <div className="bg-zinc-900/80 border border-zinc-800 rounded-xl p-4">
          <p className="text-xs text-zinc-500 mb-1">Avg Win</p>
          <p className="text-2xl font-bold text-green-400">${avgWin.toFixed(2)}</p>
        </div>
        <div className="bg-zinc-900/80 border border-zinc-800 rounded-xl p-4">
          <p className="text-xs text-zinc-500 mb-1">Avg Loss</p>
          <p className="text-2xl font-bold text-red-400">${avgLoss.toFixed(2)}</p>
        </div>
      </div>
      
      {/* Filters */}
      <div className="px-6 flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by symbol..."
            className="w-full pl-10 pr-4 py-2 bg-zinc-900 border border-zinc-800 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:border-cyan-500"
          />
        </div>
        <div className="flex gap-2">
          {(['all', 'win', 'loss'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={clsx(
                'px-4 py-2 rounded-lg text-sm font-medium transition-colors',
                filter === f 
                  ? 'bg-cyan-500/20 text-cyan-400' 
                  : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'
              )}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>
      </div>
      
      {/* Entries */}
      <div className="p-6 space-y-4">
        {filteredEntries.map((entry) => (
          <JournalEntry key={entry.id} entry={entry} />
        ))}
        
        {filteredEntries.length === 0 && (
          <div className="text-center py-12">
            <BookOpen className="w-16 h-16 text-zinc-700 mx-auto mb-4" />
            <p className="text-zinc-400">No journal entries found</p>
          </div>
        )}
      </div>
    </div>
  )
}

function JournalEntry({ entry }: { entry: typeof journalEntries[0] }) {
  return (
    <div className="bg-zinc-900/80 border border-zinc-800 rounded-xl p-4">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className={clsx(
            'p-2 rounded-lg',
            entry.type === 'buy' ? 'bg-green-500/20' : 'bg-red-500/20'
          )}>
            {entry.type === 'buy' ? (
              <TrendingUp className="w-5 h-5 text-green-400" />
            ) : (
              <TrendingDown className="w-5 h-5 text-red-400" />
            )}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-white">{entry.symbol}</h3>
              <span className={clsx(
                'px-2 py-0.5 rounded text-xs font-bold',
                entry.type === 'buy' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
              )}>
                {entry.type.toUpperCase()}
              </span>
              <span className={clsx(
                'px-2 py-0.5 rounded text-xs font-bold',
                entry.outcome === 'win' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
              )}>
                {entry.outcome.toUpperCase()}
              </span>
            </div>
            <p className="text-xs text-zinc-500">
              {entry.model} | {entry.session} | {new Date(entry.openTime).toLocaleDateString()}
            </p>
          </div>
        </div>
        <div className={clsx(
          'text-right',
          entry.pnl >= 0 ? 'text-green-400' : 'text-red-400'
        )}>
          <p className="text-xl font-bold">
            {entry.pnl >= 0 ? '+' : ''}${entry.pnl.toFixed(2)}
          </p>
          <p className="text-sm text-zinc-400">
            {entry.pnlPercent >= 0 ? '+' : ''}{entry.pnlPercent.toFixed(2)}%
          </p>
        </div>
      </div>
      
      <div className="grid grid-cols-4 gap-4 p-3 bg-zinc-800/50 rounded-lg text-sm">
        <div>
          <p className="text-zinc-500">Entry</p>
          <p className="font-mono font-semibold">{entry.entryPrice.toFixed(5)}</p>
        </div>
        <div>
          <p className="text-zinc-500">Exit</p>
          <p className="font-mono font-semibold">{entry.exitPrice.toFixed(5)}</p>
        </div>
        <div>
          <p className="text-zinc-500">Lots</p>
          <p className="font-semibold">{entry.lotSize}</p>
        </div>
        <div>
          <p className="text-zinc-500">Duration</p>
          <p className="font-semibold">{Math.floor((entry.closeTime - entry.openTime) / 3600000)}h</p>
        </div>
      </div>
      
      {entry.notes && (
        <div className="mt-3 p-3 bg-zinc-800/30 rounded-lg">
          <p className="text-sm text-zinc-400 italic">"{entry.notes}"</p>
        </div>
      )}
    </div>
  )
}
