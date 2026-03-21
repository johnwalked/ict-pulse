'use client'

import { useState, useEffect } from 'react'
import { clsx } from 'clsx'
import { Minimize2, TrendingUp, TrendingDown, CheckCircle, XCircle } from 'lucide-react'
import { useChartStore } from '@/lib/store'
import { ictEngine } from '@/lib/ict/engine'
import type { FairValueGap } from '@/types'

export function FVGListCard() {
  const { fairValueGaps, ohlcData, addFVG } = useChartStore()
  const [filter, setFilter] = useState<'all' | 'active' | 'filled'>('all')
  
  useEffect(() => {
    if (ohlcData.length > 0) {
      ictEngine.setData(ohlcData)
      const detectedFVGs = ictEngine.detectFVG()
      detectedFVGs.forEach(fvg => {
        if (!fairValueGaps.find(existing => existing.id === fvg.id)) {
          addFVG(fvg)
        }
      })
    }
  }, [ohlcData, addFVG])
  
  const filteredFVGs = fairValueGaps.filter(fvg => {
    if (filter === 'active') return !fvg.filled
    if (filter === 'filled') return fvg.filled
    return true
  }).slice(0, 8)
  
  return (
    <div className="bg-zinc-900/80 border border-zinc-800 rounded-xl p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Minimize2 className="w-5 h-5 text-purple-400" />
          <h3 className="text-lg font-semibold text-white">Fair Value Gaps</h3>
        </div>
        
        <div className="flex gap-1">
          {(['all', 'active', 'filled'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={clsx(
                'px-2 py-1 text-xs rounded transition-colors',
                filter === f 
                  ? 'bg-purple-500/20 text-purple-400' 
                  : 'text-zinc-500 hover:text-zinc-300'
              )}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>
      </div>
      
      <div className="space-y-2">
        {filteredFVGs.map((fvg) => (
          <FVGRow key={fvg.id} fvg={fvg} />
        ))}
        
        {filteredFVGs.length === 0 && (
          <div className="text-center py-4">
            <p className="text-sm text-zinc-500">No FVGs found</p>
            <p className="text-xs text-zinc-600 mt-1">Gaps appear at market opens</p>
          </div>
        )}
      </div>
    </div>
  )
}

function FVGRow({ fvg }: { fvg: FairValueGap }) {
  const size = ((fvg.high - fvg.low) * 10000).toFixed(1)
  
  return (
    <div className={clsx(
      'p-3 rounded-lg border transition-all',
      fvg.type === 'bullish' 
        ? 'bg-green-500/5 border-green-500/20' 
        : 'bg-red-500/5 border-red-500/20'
    )}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {fvg.type === 'bullish' ? (
            <TrendingUp className="w-4 h-4 text-green-400" />
          ) : (
            <TrendingDown className="w-4 h-4 text-red-400" />
          )}
          <div>
            <div className="flex items-center gap-2">
              <p className={clsx(
                'text-sm font-semibold',
                fvg.type === 'bullish' ? 'text-green-400' : 'text-red-400'
              )}>
                {fvg.type === 'bullish' ? 'Bullish FVG' : 'Bearish FVG'}
              </p>
              {fvg.filled ? (
                <XCircle className="w-4 h-4 text-zinc-500" />
              ) : (
                <CheckCircle className="w-4 h-4 text-cyan-400" />
              )}
            </div>
            <p className="text-xs text-zinc-500">
              {fvg.high.toFixed(5)} - {fvg.low.toFixed(5)}
            </p>
          </div>
        </div>
        
        <div className="text-right">
          <p className="text-sm font-bold text-zinc-300">{size} pips</p>
          <p className={clsx(
            'text-xs',
            fvg.filled ? 'text-zinc-500' : 'text-cyan-400'
          )}>
            {fvg.filled ? 'FILLED' : 'ACTIVE'}
          </p>
        </div>
      </div>
      
      <div className="mt-2 relative h-6 bg-zinc-800 rounded overflow-hidden">
        <div 
          className={clsx(
            'absolute inset-y-0',
            fvg.type === 'bullish' ? 'bg-green-500/30' : 'bg-red-500/30'
          )}
          style={{
            top: fvg.type === 'bullish' ? '0' : '50%',
            bottom: fvg.type === 'bullish' ? '50%' : '0',
            left: '0',
            right: '0'
          }}
        />
        {fvg.filled && (
          <div className="absolute inset-0 bg-zinc-700/50" />
        )}
      </div>
    </div>
  )
}
