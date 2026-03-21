'use client'

import { useState, useEffect } from 'react'
import { useChartStore, useTradingStore } from '@/lib/store'
import { ictEngine } from '@/lib/ict/engine'
import { generateDemoData } from '@/lib/utils'
import { 
  TrendingUp, TrendingDown, Target, Clock, Zap, Box, Minimize2,
  ArrowUpRight, ArrowDownRight, BarChart3, PieChart, LineChart
} from 'lucide-react'
import { clsx } from 'clsx'

export default function AnalysisPage() {
  const { ohlcData, setOHLCData, marketStructure, setMarketStructure, orderBlocks, fairValueGaps } = useChartStore()
  const { symbol } = useTradingStore()
  const [analysis, setAnalysis] = useState<any>(null)
  
  useEffect(() => {
    const data = generateDemoData(200, symbol)
    setOHLCData(data)
    
    ictEngine.setData(data)
    const ms = ictEngine.analyzeMarketStructure()
    setMarketStructure(ms)
    
    const dailyMid = ictEngine.calculateDailyMidpoint()
    const pdZone = ictEngine.getPremiumDiscount()
    const fibs = ictEngine.calculateOTE()
    
    setAnalysis({
      marketStructure: ms,
      dailyMid,
      premiumDiscount: pdZone,
      fibonacciLevels: fibs,
      orderBlocks: ictEngine.detectOrderBlocks(),
      fvgs: ictEngine.detectFVG(),
      liquidityPools: ictEngine.detectLiquidityPools()
    })
  }, [symbol])
  
  if (!analysis) return <div className="p-6 text-zinc-400">Analyzing market...</div>
  
  return (
    <div className="min-h-screen bg-[#0a0e17] text-white">
      <div className="border-b border-zinc-800 px-6 py-4">
        <h1 className="text-2xl font-bold">ICT Market Analysis</h1>
        <p className="text-zinc-500">{symbol} | Comprehensive ICT methodology analysis</p>
      </div>
      
      <div className="p-6 space-y-6">
        <div className="grid grid-cols-3 gap-4">
          <div className={clsx(
            'p-6 rounded-xl border',
            marketStructure.trend === 'bullish' ? 'bg-green-500/10 border-green-500/30' :
            marketStructure.trend === 'bearish' ? 'bg-red-500/10 border-red-500/30' :
            'bg-zinc-900/80 border-zinc-800'
          )}>
            <div className="flex items-center gap-3 mb-4">
              {marketStructure.trend === 'bullish' ? (
                <TrendingUp className="w-8 h-8 text-green-400" />
              ) : marketStructure.trend === 'bearish' ? (
                <TrendingDown className="w-8 h-8 text-red-400" />
              ) : (
                <BarChart3 className="w-8 h-8 text-zinc-400" />
              )}
              <div>
                <p className="text-xs text-zinc-500">Trend</p>
                <p className={clsx(
                  'text-2xl font-bold',
                  marketStructure.trend === 'bullish' ? 'text-green-400' :
                  marketStructure.trend === 'bearish' ? 'text-red-400' : 'text-zinc-400'
                )}>
                  {marketStructure.trend.toUpperCase()}
                </p>
              </div>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-zinc-500">BOS</span>
                <span className={clsx(
                  'font-semibold',
                  marketStructure.bos === 'bullish' ? 'text-green-400' :
                  marketStructure.bos === 'bearish' ? 'text-red-400' : 'text-zinc-400'
                )}>
                  {marketStructure.bos?.toUpperCase() || 'NONE'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-500">MSS</span>
                <span className={marketStructure.mss ? 'text-cyan-400 font-semibold' : 'text-zinc-400'}>
                  {marketStructure.mss ? 'CONFIRMED' : 'NOT YET'}
                </span>
              </div>
            </div>
          </div>
          
          <div className="bg-zinc-900/80 border border-zinc-800 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <PieChart className="w-8 h-8 text-cyan-400" />
              <div>
                <p className="text-xs text-zinc-500">Zone</p>
                <p className={clsx(
                  'text-2xl font-bold',
                  analysis.premiumDiscount === 'premium' ? 'text-red-400' :
                  analysis.premiumDiscount === 'discount' ? 'text-green-400' : 'text-zinc-400'
                )}>
                  {analysis.premiumDiscount?.toUpperCase() || 'MID'}
                </p>
              </div>
            </div>
            <div className="text-sm">
              <p className="text-zinc-500">Daily Midpoint</p>
              <p className="font-mono font-semibold text-white">
                {analysis.dailyMid?.toFixed(5) || 'N/A'}
              </p>
            </div>
          </div>
          
          <div className="bg-zinc-900/80 border border-zinc-800 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <Target className="w-8 h-8 text-amber-400" />
              <div>
                <p className="text-xs text-zinc-500">Bias</p>
                <p className="text-2xl font-bold text-amber-400">NEUTRAL</p>
              </div>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-zinc-500">Confidence</span>
                <span className="text-zinc-300">50%</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-zinc-900/80 border border-zinc-800 rounded-xl p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <LineChart className="w-5 h-5 text-purple-400" />
            OTE Fibonacci Levels
          </h3>
          <div className="grid grid-cols-5 gap-4">
            {analysis.fibonacciLevels?.slice(0, 5).map((fib: any, i: number) => (
              <div key={i} className="text-center p-3 bg-zinc-800/50 rounded-lg">
                <p className="text-xs text-zinc-500">{(fib.level * 100).toFixed(1)}%</p>
                <p className="font-mono font-semibold text-white">{fib.price.toFixed(5)}</p>
              </div>
            ))}
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-6">
          <div className="bg-zinc-900/80 border border-zinc-800 rounded-xl p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Box className="w-5 h-5 text-green-400" />
              Order Blocks ({analysis.orderBlocks?.length || 0})
            </h3>
            <div className="space-y-2">
              {analysis.orderBlocks?.slice(0, 5).map((ob: any) => (
                <div key={ob.id} className={clsx(
                  'p-3 rounded-lg border',
                  ob.type === 'bullish' ? 'bg-green-500/10 border-green-500/20' : 'bg-red-500/10 border-red-500/20'
                )}>
                  <div className="flex justify-between">
                    <span className={ob.type === 'bullish' ? 'text-green-400' : 'text-red-400'}>
                      {ob.type.toUpperCase()} OB
                    </span>
                    <span className="text-zinc-400 text-sm">{ob.strength.toFixed(0)}%</span>
                  </div>
                  <p className="text-xs text-zinc-500 font-mono">
                    {ob.high.toFixed(5)} - {ob.low.toFixed(5)}
                  </p>
                </div>
              ))}
            </div>
          </div>
          
          <div className="bg-zinc-900/80 border border-zinc-800 rounded-xl p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Minimize2 className="w-5 h-5 text-purple-400" />
              Fair Value Gaps ({analysis.fvgs?.length || 0})
            </h3>
            <div className="space-y-2">
              {analysis.fvgs?.slice(0, 5).map((fvg: any) => (
                <div key={fvg.id} className={clsx(
                  'p-3 rounded-lg border',
                  fvg.type === 'bullish' ? 'bg-green-500/10 border-green-500/20' : 'bg-red-500/10 border-red-500/20'
                )}>
                  <div className="flex justify-between">
                    <span className={fvg.type === 'bullish' ? 'text-green-400' : 'text-red-400'}>
                      {fvg.type.toUpperCase()} FVG
                    </span>
                    <span className={fvg.filled ? 'text-zinc-500 text-sm' : 'text-cyan-400 text-sm'}>
                      {fvg.filled ? 'FILLED' : 'ACTIVE'}
                    </span>
                  </div>
                  <p className="text-xs text-zinc-500 font-mono">
                    {fvg.high.toFixed(5)} - {fvg.low.toFixed(5)}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        <div className="bg-zinc-900/80 border border-zinc-800 rounded-xl p-6">
          <h3 className="text-lg font-semibold mb-4">ICT Concepts</h3>
          <div className="grid grid-cols-4 gap-4 text-sm">
            <ICTConcept title="MSS" description="Market Structure Shift - Trend change confirmation" />
            <ICTConcept title="BOS" description="Break of Structure - Higher high/lower low" />
            <ICTConcept title="FVG" description="Fair Value Gap - Imbalance between candles" />
            <ICTConcept title="OTE" description="Optimal Trade Entry - Fibonacci retracements" />
            <ICTConcept title="Kill Zones" description="High-probability session times" />
            <ICTConcept title="Order Blocks" description="Institutional order zones" />
            <ICTConcept title="Liquidity" description="Stop runs above/below structure" />
            <ICTConcept title="Premium" description="Above daily mid - bearish zone" />
          </div>
        </div>
      </div>
    </div>
  )
}

function ICTConcept({ title, description }: { title: string, description: string }) {
  return (
    <div className="p-3 bg-zinc-800/50 rounded-lg">
      <p className="font-semibold text-cyan-400 mb-1">{title}</p>
      <p className="text-zinc-500 text-xs">{description}</p>
    </div>
  )
}
