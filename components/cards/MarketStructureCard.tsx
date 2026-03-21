'use client'

import { useState, useEffect } from 'react'
import { clsx } from 'clsx'
import { TrendingUp, TrendingDown, Minus, ArrowRight, Zap } from 'lucide-react'
import { useChartStore } from '@/lib/store'
import { ictEngine } from '@/lib/ict/engine'

export function MarketStructureCard() {
  const { marketStructure, ohlcData, setMarketStructure } = useChartStore()
  const [patterns, setPatterns] = useState<any[]>([])
  
  useEffect(() => {
    if (ohlcData.length > 0) {
      ictEngine.setData(ohlcData)
      const ms = ictEngine.analyzeMarketStructure()
      setMarketStructure(ms)
      setPatterns(ictEngine.analyzeAllPatterns())
    }
  }, [ohlcData, setMarketStructure])
  
  return (
    <div className="bg-zinc-900/80 border border-zinc-800 rounded-xl p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className={clsx(
            'p-2 rounded-lg',
            marketStructure.trend === 'bullish' ? 'bg-green-500/20' :
            marketStructure.trend === 'bearish' ? 'bg-red-500/20' : 'bg-zinc-800'
          )}>
            {marketStructure.trend === 'bullish' ? (
              <TrendingUp className="w-5 h-5 text-green-400" />
            ) : marketStructure.trend === 'bearish' ? (
              <TrendingDown className="w-5 h-5 text-red-400" />
            ) : (
              <Minus className="w-5 h-5 text-zinc-400" />
            )}
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white">Market Structure</h3>
            <p className="text-xs text-zinc-500">ICT Methodology Analysis</p>
          </div>
        </div>
      </div>
      
      {/* Trend Indicator */}
      <div className={clsx(
        'p-4 rounded-lg mb-4 transition-all',
        marketStructure.trend === 'bullish' ? 'bg-green-500/10 border border-green-500/20' :
        marketStructure.trend === 'bearish' ? 'bg-red-500/10 border border-red-500/20' :
        'bg-zinc-800/50 border border-zinc-700/50'
      )}>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-zinc-400 mb-1">Current Trend</p>
            <p className={clsx(
              'text-2xl font-bold',
              marketStructure.trend === 'bullish' ? 'text-green-400' :
              marketStructure.trend === 'bearish' ? 'text-red-400' : 'text-zinc-400'
            )}>
              {marketStructure.trend.toUpperCase()}
            </p>
          </div>
          <div className="text-right">
            <p className="text-xs text-zinc-400 mb-1">BOS</p>
            <p className={clsx(
              'text-lg font-bold',
              marketStructure.bos === 'bullish' ? 'text-green-400' :
              marketStructure.bos === 'bearish' ? 'text-red-400' : 'text-zinc-400'
            )}>
              {marketStructure.bos?.toUpperCase() || 'NONE'}
            </p>
          </div>
        </div>
      </div>
      
      {/* ICT Events */}
      <div className="space-y-3">
        {/* MSS Alert */}
        {marketStructure.mss && (
          <div className="flex items-center gap-3 p-3 bg-cyan-500/10 border border-cyan-500/20 rounded-lg">
            <Zap className="w-5 h-5 text-cyan-400" />
            <div>
              <p className="text-sm font-semibold text-cyan-400">Market Structure Shift</p>
              <p className="text-xs text-zinc-400">Trend change confirmed - trade in direction of displacement</p>
            </div>
          </div>
        )}
        
        {/* Equal Highs/Lows */}
        {marketStructure.equalHighs && (
          <div className="flex items-center gap-3 p-3 bg-amber-500/10 border border-amber-500/20 rounded-lg">
            <ArrowRight className="w-5 h-5 text-amber-400" />
            <div>
              <p className="text-sm font-semibold text-amber-400">Equal Highs Detected</p>
              <p className="text-xs text-zinc-400">Liquitity pool above - expect stop run</p>
            </div>
          </div>
        )}
        
        {marketStructure.equalLows && (
          <div className="flex items-center gap-3 p-3 bg-amber-500/10 border border-amber-500/20 rounded-lg">
            <ArrowRight className="w-5 h-5 text-amber-400" />
            <div>
              <p className="text-sm font-semibold text-amber-400">Equal Lows Detected</p>
              <p className="text-xs text-zinc-400">Liquitity pool below - expect stop run</p>
            </div>
          </div>
        )}
        
        {/* No significant events */}
        {!marketStructure.mss && !marketStructure.equalHighs && !marketStructure.equalLows && (
          <div className="text-center py-4">
            <p className="text-sm text-zinc-500">Analyzing market structure...</p>
            <p className="text-xs text-zinc-600 mt-1">Awaiting displacement or liquidity sweep</p>
          </div>
        )}
      </div>
      
      {/* Recent Patterns */}
      {patterns.length > 0 && (
        <div className="mt-4 pt-4 border-t border-zinc-800">
          <p className="text-xs text-zinc-500 mb-2">Recent Patterns</p>
          <div className="space-y-2">
            {patterns.slice(0, 3).map((pattern, i) => (
              <div key={i} className="flex items-center justify-between text-xs">
                <span className={clsx(
                  'px-2 py-1 rounded font-medium',
                  pattern.direction === 'bullish' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                )}>
                  {pattern.type.toUpperCase()}
                </span>
                <span className="text-zinc-400">{pattern.confidence}%</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
