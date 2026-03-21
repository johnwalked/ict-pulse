'use client'

import { useStore } from '@/lib/store'

export default function PositionsPage() {
  const { positions, equity, todayPnl, winRate } = useStore()

  const totalPnl = positions.reduce((sum, p) => sum + p.pnl, 0)

  return (
    <div className="min-h-screen bg-[#0a0e17] text-white p-4 lg:p-6">
      <h1 className="text-2xl font-bold mb-6">Open Positions</h1>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-[#111827] border border-zinc-800 rounded-2xl p-4">
          <div className="text-xs text-zinc-500 mb-1">Equity</div>
          <div className="text-xl font-bold font-mono">${equity.toLocaleString()}</div>
        </div>
        <div className="bg-[#111827] border border-zinc-800 rounded-2xl p-4">
          <div className="text-xs text-zinc-500 mb-1">Unrealized P&L</div>
          <div className={`text-xl font-bold font-mono ${totalPnl >= 0 ? 'text-green-400' : 'text-red-400'}`}>{totalPnl >= 0 ? '+' : ''}${totalPnl.toFixed(2)}</div>
        </div>
        <div className="bg-[#111827] border border-zinc-800 rounded-2xl p-4">
          <div className="text-xs text-zinc-500 mb-1">Today's P&L</div>
          <div className={`text-xl font-bold font-mono ${todayPnl >= 0 ? 'text-green-400' : 'text-red-400'}`}>{todayPnl >= 0 ? '+' : ''}${todayPnl.toFixed(2)}</div>
        </div>
        <div className="bg-[#111827] border border-zinc-800 rounded-2xl p-4">
          <div className="text-xs text-zinc-500 mb-1">Win Rate</div>
          <div className="text-xl font-bold font-mono text-cyan-400">{winRate}%</div>
        </div>
      </div>

      {positions.length === 0 ? (
        <div className="bg-[#111827] border border-zinc-800 rounded-2xl p-8 text-center">
          <p className="text-zinc-500">No open positions</p>
        </div>
      ) : (
        <div className="space-y-3">
          {positions.map((pos) => (
            <div key={pos.id} className="bg-[#111827] border border-zinc-800 rounded-2xl p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${pos.type === 'buy' ? 'bg-green-400' : 'bg-red-400'}`} />
                  <span className="font-bold">{pos.symbol}</span>
                  <span className="text-sm text-zinc-500">{pos.type.toUpperCase()}</span>
                </div>
                <span className={`text-lg font-bold font-mono ${pos.pnl >= 0 ? 'text-green-400' : 'text-red-400'}`}>{pos.pnl >= 0 ? '+' : ''}${pos.pnl.toFixed(2)}</span>
              </div>
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div><span className="text-zinc-500">Volume</span><p className="font-mono">{pos.volume} lots</p></div>
                <div><span className="text-zinc-500">Entry</span><p className="font-mono">{pos.entryPrice.toFixed(5)}</p></div>
                <div><span className="text-zinc-500">Current</span><p className="font-mono">{pos.currentPrice.toFixed(5)}</p></div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
