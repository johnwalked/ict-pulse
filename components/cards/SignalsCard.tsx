'use client'

import { useState } from 'react'
import { clsx } from 'clsx'
import { Signal, TrendingUp, TrendingDown, Clock, Target, CheckCircle, XCircle, Zap } from 'lucide-react'
import type { TradingSignal } from '@/types'

export function SignalsCard() {
  const [signals, setSignals] = useState<TradingSignal[]>([
    {
      id: 'sig1',
      symbol: 'EURUSD',
      type: 'buy',
      entry: 1.0855,
      stopLoss: 1.0830,
      takeProfit: 1.0910,
      confidence: 82,
      model: 'Kill Zone + FVG',
      killZone: 'London',
      timestamp: Date.now() - 1800000,
      triggered: false,
      expired: false
    },
    {
      id: 'sig2',
      symbol: 'GBPUSD',
      type: 'sell',
      entry: 1.2630,
      stopLoss: 1.2660,
      takeProfit: 1.2550,
      confidence: 75,
      model: 'Silver Bullet',
      killZone: 'NY-AM',
      timestamp: Date.now() - 3600000,
      triggered: false,
      expired: false
    },
    {
      id: 'sig3',
      symbol: 'XAUUSD',
      type: 'buy',
      entry: 2340.00,
      stopLoss: 2320.00,
      takeProfit: 2370.00,
      confidence: 88,
      model: 'OTE Retracement',
      killZone: 'Asia',
      timestamp: Date.now() - 7200000,
      triggered: true,
      expired: false
    }
  ])
  
  const activeSignals = signals.filter(s => !s.expired && !s.triggered)
  
  return (
    <div className="bg-zinc-900/80 border border-zinc-800 rounded-xl p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Signal className="w-5 h-5 text-amber-400" />
          <h3 className="text-lg font-semibold text-white">ICT Signals</h3>
        </div>
        <span className="text-xs text-zinc-500">{activeSignals.length} active</span>
      </div>
      
      <div className="space-y-3">
        {activeSignals.map((signal) => (
          <SignalRow key={signal.id} signal={signal} />
        ))}
        
        {activeSignals.length === 0 && (
          <div className="text-center py-4">
            <p className="text-sm text-zinc-500">No active signals</p>
            <p className="text-xs text-zinc-600 mt-1">AI analyzing market...</p>
          </div>
        )}
      </div>
    </div>
  )
}

function SignalRow({ signal }: { signal: TradingSignal }) {
  const timeAgo = formatTimeAgo(signal.timestamp)
  
  return (
    <div className={clsx(
      'p-3 rounded-lg border transition-all',
      signal.type === 'buy' 
        ? 'bg-green-500/5 border-green-500/20 hover:border-green-500/40' 
        : 'bg-red-500/5 border-red-500/20 hover:border-red-500/40'
    )}>
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center gap-2">
          {signal.type === 'buy' ? (
            <TrendingUp className="w-4 h-4 text-green-400" />
          ) : (
            <TrendingDown className="w-4 h-4 text-red-400" />
          )}
          <div>
            <p className="font-semibold text-white">{signal.symbol}</p>
            <p className="text-xs text-zinc-500">{signal.model}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-1">
          <Zap className="w-3 h-3 text-amber-400" />
          <span className="text-xs font-bold text-amber-400">{signal.confidence}%</span>
        </div>
      </div>
      
      <div className="grid grid-cols-3 gap-2 mb-2">
        <div className="text-center">
          <p className="text-xs text-zinc-500">Entry</p>
          <p className="text-sm font-mono font-semibold text-white">{signal.entry.toFixed(5)}</p>
        </div>
        <div className="text-center">
          <p className="text-xs text-zinc-500">SL</p>
          <p className="text-sm font-mono text-red-400">{signal.stopLoss.toFixed(5)}</p>
        </div>
        <div className="text-center">
          <p className="text-xs text-zinc-500">TP</p>
          <p className="text-sm font-mono text-green-400">{signal.takeProfit.toFixed(5)}</p>
        </div>
      </div>
      
      <div className="flex items-center justify-between pt-2 border-t border-zinc-700/50">
        <div className="flex items-center gap-2 text-xs text-zinc-500">
          <Clock className="w-3 h-3" />
          {timeAgo}
        </div>
        <div className="flex items-center gap-1">
          <Target className="w-3 h-3 text-cyan-400" />
          <span className="text-xs text-cyan-400">{signal.killZone}</span>
        </div>
      </div>
    </div>
  )
}

function formatTimeAgo(timestamp: number): string {
  const seconds = Math.floor((Date.now() - timestamp) / 1000)
  
  if (seconds < 60) return `${seconds}s ago`
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`
  return `${Math.floor(seconds / 86400)}d ago`
}
