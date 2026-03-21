'use client'

import { useState } from 'react'
import { useTradingStore } from '@/lib/store'
import { Plus, X, Edit2, TrendingUp, TrendingDown, Clock, Target, AlertCircle, Wallet } from 'lucide-react'
import { clsx } from 'clsx'
import type { Position } from '@/types'

export default function PositionsPage() {
  const { positions, closePosition } = useTradingStore()
  const [showModal, setShowModal] = useState(false)
  
  const demoPositions: Position[] = [
    {
      id: '1',
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
      id: '2',
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
    },
    {
      id: '3',
      symbol: 'GBPUSD',
      type: 'buy',
      entryPrice: 1.2610,
      currentPrice: 1.2595,
      stopLoss: 1.2580,
      takeProfit: 1.2700,
      lotSize: 0.20,
      openTime: Date.now() - 1800000,
      pnl: -15.00,
      pnlPercent: -0.12,
      entryType: 'order_block'
    }
  ]
  
  const allPositions = positions.length > 0 ? positions : demoPositions
  const totalPnl = allPositions.reduce((sum, p) => sum + p.pnl, 0)
  const totalEquity = 25000 + totalPnl
  
  return (
    <div className="min-h-screen bg-[#0a0e17] text-white">
      {/* Header */}
      <div className="border-b border-zinc-800 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Positions</h1>
            <p className="text-zinc-500">Manage your open trades</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-xs text-zinc-500">Total Equity</p>
              <p className="text-xl font-bold text-white">${totalEquity.toFixed(2)}</p>
            </div>
            <div className={clsx(
              'text-right',
              totalPnl >= 0 ? 'text-green-400' : 'text-red-400'
            )}>
              <p className="text-xs text-zinc-500">Unrealized P&L</p>
              <p className="text-xl font-bold">
                {totalPnl >= 0 ? '+' : ''}${totalPnl.toFixed(2)}
              </p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Positions List */}
      <div className="p-6">
        <div className="space-y-4">
          {allPositions.map((pos) => (
            <PositionCard 
              key={pos.id} 
              position={pos} 
              onClose={() => closePosition(pos.id)}
            />
          ))}
          
          {allPositions.length === 0 && (
            <div className="text-center py-12">
              <Wallet className="w-16 h-16 text-zinc-700 mx-auto mb-4" />
              <p className="text-zinc-400">No open positions</p>
              <p className="text-sm text-zinc-600">Wait for ICT signals to enter trades</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function PositionCard({ position, onClose }: { position: Position, onClose: () => void }) {
  const isProfitable = position.pnl >= 0
  const riskReward = Math.abs((position.takeProfit - position.entryPrice) / (position.entryPrice - position.stopLoss))
  
  return (
    <div className={clsx(
      'bg-zinc-900/80 border rounded-xl overflow-hidden',
      isProfitable ? 'border-green-500/30' : 'border-red-500/30'
    )}>
      <div className="p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className={clsx(
              'p-2 rounded-lg',
              position.type === 'buy' ? 'bg-green-500/20' : 'bg-red-500/20'
            )}>
              {position.type === 'buy' ? (
                <TrendingUp className="w-6 h-6 text-green-400" />
              ) : (
                <TrendingDown className="w-6 h-6 text-red-400" />
              )}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-white">{position.symbol}</h3>
                <span className={clsx(
                  'px-2 py-0.5 rounded text-xs font-bold',
                  position.type === 'buy' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                )}>
                  {position.type.toUpperCase()}
                </span>
                <span className="px-2 py-0.5 bg-zinc-700 rounded text-xs text-zinc-300">
                  {position.entryType.replace('_', ' ').toUpperCase()}
                </span>
              </div>
              <p className="text-xs text-zinc-500">
                Opened {new Date(position.openTime).toLocaleString()} | {position.lotSize} lots
              </p>
            </div>
          </div>
          
          <div className={clsx(
            'text-right',
            isProfitable ? 'text-green-400' : 'text-red-400'
          )}>
            <p className="text-2xl font-bold">
              {isProfitable ? '+' : ''}${position.pnl.toFixed(2)}
            </p>
            <p className="text-sm text-zinc-400">
              {position.pnlPercent >= 0 ? '+' : ''}{position.pnlPercent.toFixed(2)}%
            </p>
          </div>
        </div>
        
        <div className="grid grid-cols-4 gap-4 mb-4 p-3 bg-zinc-800/50 rounded-lg">
          <div>
            <p className="text-xs text-zinc-500 mb-1">Entry</p>
            <p className="font-mono font-semibold text-white">{position.entryPrice.toFixed(5)}</p>
          </div>
          <div>
            <p className="text-xs text-zinc-500 mb-1">Current</p>
            <p className="font-mono font-semibold text-white">{position.currentPrice.toFixed(5)}</p>
          </div>
          <div>
            <p className="text-xs text-zinc-500 mb-1">Stop Loss</p>
            <p className="font-mono font-semibold text-red-400">{position.stopLoss.toFixed(5)}</p>
          </div>
          <div>
            <p className="text-xs text-zinc-500 mb-1">Take Profit</p>
            <p className="font-mono font-semibold text-green-400">{position.takeProfit.toFixed(5)}</p>
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 text-xs text-zinc-500">
              <Target className="w-4 h-4" />
              R:R 1:{riskReward.toFixed(1)}
            </div>
            <div className="h-4 w-px bg-zinc-700" />
            <div className="flex items-center gap-1 text-xs text-zinc-500">
              <Clock className="w-4 h-4" />
              {Math.floor((Date.now() - position.openTime) / 3600000)}h
            </div>
          </div>
          
          <div className="flex gap-2">
            <button className="px-4 py-2 bg-zinc-700 hover:bg-zinc-600 rounded-lg text-sm font-medium transition-colors flex items-center gap-2">
              <Edit2 className="w-4 h-4" />
              Modify
            </button>
            <button 
              onClick={onClose}
              className="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
            >
              <X className="w-4 h-4" />
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
