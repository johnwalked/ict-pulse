'use client'

import { useState } from 'react'
import { clsx } from 'clsx'
import { LayoutGrid, TrendingUp, TrendingDown, X, Edit2, Clock, Target } from 'lucide-react'
import { useTradingStore } from '@/lib/store'
import type { Position } from '@/types'

export function PositionsCard() {
  const { positions, closePosition, tradingMode } = useTradingStore()
  const [expanded, setExpanded] = useState<string | null>(null)
  
  const demoPositions: Position[] = positions.length > 0 ? positions : [
    {
      id: 'demo1',
      symbol: 'EURUSD',
      type: 'buy',
      entryPrice: 1.0845,
      currentPrice: 1.0862,
      stopLoss: 1.0820,
      takeProfit: 1.0900,
      lotSize: 0.10,
      openTime: Date.now() - 3600000,
      pnl: 17.00,
      pnlPercent: 0.17,
      entryType: 'kill_zone'
    },
    {
      id: 'demo2',
      symbol: 'XAUUSD',
      type: 'sell',
      entryPrice: 2345.50,
      currentPrice: 2338.20,
      stopLoss: 2360.00,
      takeProfit: 2310.00,
      lotSize: 0.05,
      openTime: Date.now() - 7200000,
      pnl: 36.50,
      pnlPercent: 0.39,
      entryType: 'ote'
    }
  ]
  
  const totalPnl = demoPositions.reduce((sum, p) => sum + p.pnl, 0)
  
  return (
    <div className="bg-zinc-900/80 border border-zinc-800 rounded-xl p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <LayoutGrid className="w-5 h-5 text-cyan-400" />
          <h3 className="text-lg font-semibold text-white">Open Positions</h3>
        </div>
        <div className="text-right">
          <p className={clsx(
            'text-lg font-bold',
            totalPnl >= 0 ? 'text-green-400' : 'text-red-400'
          )}>
            {totalPnl >= 0 ? '+' : ''}${totalPnl.toFixed(2)}
          </p>
        </div>
      </div>
      
      <div className="space-y-3">
        {demoPositions.map((pos) => (
          <PositionRow 
            key={pos.id} 
            position={pos}
            isExpanded={expanded === pos.id}
            onToggle={() => setExpanded(expanded === pos.id ? null : pos.id)}
            onClose={() => closePosition(pos.id)}
          />
        ))}
        
        {demoPositions.length === 0 && (
          <div className="text-center py-6">
            <p className="text-sm text-zinc-500">No open positions</p>
            <p className="text-xs text-zinc-600 mt-1">Wait for ICT signals</p>
          </div>
        )}
      </div>
      
      {demoPositions.length > 0 && (
        <div className="mt-4 pt-4 border-t border-zinc-800 flex justify-between text-xs">
          <span className="text-zinc-500">
            {demoPositions.length} positions | Mode: <span className="text-cyan-400">{tradingMode.toUpperCase()}</span>
          </span>
          <button className="text-cyan-400 hover:text-cyan-300">View All</button>
        </div>
      )}
    </div>
  )
}

function PositionRow({ 
  position, 
  isExpanded, 
  onToggle, 
  onClose 
}: { 
  position: Position
  isExpanded: boolean
  onToggle: () => void
  onClose: () => void
}) {
  const pnlColor = position.pnl >= 0 ? 'text-green-400' : 'text-red-400'
  
  return (
    <div className={clsx(
      'rounded-lg border transition-all',
      isExpanded ? 'bg-zinc-800/80 border-zinc-700' : 'bg-zinc-800/30 border-zinc-800'
    )}>
      <div 
        className="p-3 cursor-pointer"
        onClick={onToggle}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={clsx(
              'p-1.5 rounded',
              position.type === 'buy' ? 'bg-green-500/20' : 'bg-red-500/20'
            )}>
              {position.type === 'buy' ? (
                <TrendingUp className={clsx('w-4 h-4', position.pnl >= 0 ? 'text-green-400' : 'text-red-400')} />
              ) : (
                <TrendingDown className={clsx('w-4 h-4', position.pnl >= 0 ? 'text-green-400' : 'text-red-400')} />
              )}
            </div>
            
            <div>
              <div className="flex items-center gap-2">
                <p className="font-semibold text-white">{position.symbol}</p>
                <span className={clsx(
                  'text-xs px-1.5 py-0.5 rounded font-medium',
                  position.type === 'buy' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                )}>
                  {position.type.toUpperCase()}
                </span>
              </div>
              <p className="text-xs text-zinc-500">
                {position.entryType.replace('_', ' ').toUpperCase()} | {position.lotSize} lots
              </p>
            </div>
          </div>
          
          <div className="text-right">
            <p className={clsx('font-bold', pnlColor)}>
              {position.pnl >= 0 ? '+' : ''}${position.pnl.toFixed(2)}
            </p>
            <p className="text-xs text-zinc-500">
              {position.pnlPercent >= 0 ? '+' : ''}{position.pnlPercent.toFixed(2)}%
            </p>
          </div>
        </div>
      </div>
      
      {isExpanded && (
        <div className="px-3 pb-3 pt-1 border-t border-zinc-700/50">
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div>
              <p className="text-zinc-500">Entry</p>
              <p className="text-white font-mono">{position.entryPrice.toFixed(5)}</p>
            </div>
            <div>
              <p className="text-zinc-500">Current</p>
              <p className="text-white font-mono">{position.currentPrice.toFixed(5)}</p>
            </div>
            <div>
              <p className="text-zinc-500">Stop Loss</p>
              <p className="text-red-400 font-mono">{position.stopLoss.toFixed(5)}</p>
            </div>
            <div>
              <p className="text-zinc-500">Take Profit</p>
              <p className="text-green-400 font-mono">{position.takeProfit.toFixed(5)}</p>
            </div>
          </div>
          
          <div className="mt-3 flex gap-2">
            <button className="flex-1 py-1.5 px-3 bg-zinc-700 hover:bg-zinc-600 text-xs font-medium rounded transition-colors flex items-center justify-center gap-1">
              <Edit2 className="w-3 h-3" />
              Modify
            </button>
            <button 
              onClick={onClose}
              className="flex-1 py-1.5 px-3 bg-red-500/20 hover:bg-red-500/30 text-red-400 text-xs font-medium rounded transition-colors flex items-center justify-center gap-1"
            >
              <X className="w-3 h-3" />
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
