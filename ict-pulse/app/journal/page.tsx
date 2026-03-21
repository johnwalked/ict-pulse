'use client'

import { useState } from 'react'

const trades = [
  { id: 1, symbol: 'EUR/USD', type: 'buy', date: '2024-01-15', result: 'win', pnl: 150, notes: 'Bullish OB on H1, filled in LNZ', strategy: 'Order Block' },
  { id: 2, symbol: 'GBP/USD', type: 'sell', date: '2024-01-14', result: 'loss', pnl: -75, notes: 'FVG not held, early entry', strategy: 'FVG' },
  { id: 3, symbol: 'EUR/USD', type: 'buy', date: '2024-01-13', result: 'win', pnl: 220, notes: 'Liquidity sweep, retrace to OB', strategy: 'Liquidity' },
]

export default function JournalPage() {
  const [filter, setFilter] = useState<'all' | 'win' | 'loss'>('all')

  const filteredTrades = trades.filter((t) => filter === 'all' || t.result === filter)
  const totalPnl = filteredTrades.reduce((sum, t) => sum + t.pnl, 0)

  return (
    <div className="min-h-screen bg-[#0a0e17] text-white p-4 lg:p-6">
      <h1 className="text-2xl font-bold mb-6">Trade Journal</h1>

      <div className="flex gap-2 mb-6">
        {(['all', 'win', 'loss'] as const).map((f) => (
          <button key={f} onClick={() => setFilter(f)} className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${filter === f ? 'bg-cyan-500 text-black' : 'bg-zinc-800 text-zinc-400'}`}>{f.toUpperCase()}</button>
        ))}
        <div className="flex-1" />
        <div className={`px-4 py-2 rounded-xl text-sm font-bold ${totalPnl >= 0 ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>Total: {totalPnl >= 0 ? '+' : ''}${totalPnl.toFixed(2)}</div>
      </div>

      <div className="space-y-3">
        {filteredTrades.map((trade) => (
          <div key={trade.id} className="bg-[#111827] border border-zinc-800 rounded-2xl p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-3">
                <span className="font-bold">{trade.symbol}</span>
                <span className={`text-xs px-2 py-1 rounded ${trade.type === 'buy' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>{trade.type.toUpperCase()}</span>
                <span className="text-xs text-zinc-500">{trade.date}</span>
              </div>
              <span className={`font-bold ${trade.pnl >= 0 ? 'text-green-400' : 'text-red-400'}`}>{trade.pnl >= 0 ? '+' : ''}${trade.pnl.toFixed(2)}</span>
            </div>
            <p className="text-sm text-zinc-400 mb-2">{trade.notes}</p>
            <span className="text-xs text-cyan-400">{trade.strategy}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
