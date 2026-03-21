'use client'

import { useState, useEffect } from 'react'
import { useChartStore, useTradingStore } from '@/lib/store'
import { 
  Activity, TrendingUp, TrendingDown, BarChart3, Clock, 
  ArrowUpRight, ArrowDownRight, PieChart, Zap
} from 'lucide-react'
import { clsx } from 'clsx'

export default function OrderFlowPage() {
  const { ohlcData } = useChartStore()
  const { symbol } = useTradingStore()
  const [orderFlow, setOrderFlow] = useState<any[]>([])
  const [delta, setDelta] = useState<number[]>([])
  
  useEffect(() => {
    // Generate demo order flow data
    const generateOrderFlow = () => {
      const flow = Array.from({ length: 20 }, (_, i) => {
        const buyVolume = Math.floor(Math.random() * 5000) + 1000
        const sellVolume = Math.floor(Math.random() * 5000) + 1000
        const netDelta = buyVolume - sellVolume
        
        return {
          index: i,
          price: 1.0850 + (Math.random() - 0.5) * 0.01,
          buyVolume,
          sellVolume,
          netDelta,
          cumulativeDelta: 0,
          timestamp: Date.now() - (20 - i) * 60000
        }
      })
      
      // Calculate cumulative delta
      let cumDelta = 0
      flow.forEach(f => {
        cumDelta += f.netDelta
        f.cumulativeDelta = cumDelta
      })
      
      setOrderFlow(flow)
      setDelta(flow.map(f => f.cumulativeDelta))
    }
    
    generateOrderFlow()
    const interval = setInterval(generateOrderFlow, 5000)
    return () => clearInterval(interval)
  }, [])
  
  const totalBuy = orderFlow.reduce((sum, f) => sum + f.buyVolume, 0)
  const totalSell = orderFlow.reduce((sum, f) => sum + f.sellVolume, 0)
  const totalDelta = totalBuy - totalSell
  const imbalance = ((totalBuy - totalSell) / (totalBuy + totalSell)) * 100
  
  return (
    <div className="min-h-screen bg-[#0a0e17] text-white">
      {/* Header */}
      <div className="border-b border-zinc-800 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Order Flow Analysis</h1>
            <p className="text-zinc-500">{symbol} | Real-time delta and volume analysis</p>
          </div>
          <div className="flex items-center gap-4">
            <div className={clsx(
              'px-4 py-2 rounded-lg font-bold text-lg',
              totalDelta >= 0 ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
            )}>
              Delta: {totalDelta >= 0 ? '+' : ''}{totalDelta.toLocaleString()}
            </div>
          </div>
        </div>
      </div>
      
      <div className="p-6">
        {/* Stats Row */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          <OrderFlowStatCard 
            label="Total Buy Volume" 
            value={totalBuy.toLocaleString()} 
            icon={TrendingUp}
            color="text-green-400"
            bgColor="bg-green-500/10"
          />
          <OrderFlowStatCard 
            label="Total Sell Volume" 
            value={totalSell.toLocaleString()} 
            icon={TrendingDown}
            color="text-red-400"
            bgColor="bg-red-500/10"
          />
          <OrderFlowStatCard 
            label="Imbalance" 
            value={`${imbalance >= 0 ? '+' : ''}${imbalance.toFixed(1)}%`} 
            icon={PieChart}
            color={imbalance >= 0 ? 'text-green-400' : 'text-red-400'}
            bgColor={imbalance >= 0 ? 'bg-green-500/10' : 'bg-red-500/10'}
          />
          <OrderFlowStatCard 
            label="Net Delta" 
            value={totalDelta >= 0 ? 'Bullish' : 'Bearish'} 
            icon={Zap}
            color={totalDelta >= 0 ? 'text-green-400' : 'text-red-400'}
            bgColor={totalDelta >= 0 ? 'bg-green-500/10' : 'bg-red-500/10'}
          />
        </div>
        
        {/* Order Flow Table */}
        <div className="bg-zinc-900/80 border border-zinc-800 rounded-xl overflow-hidden">
          <div className="px-4 py-3 border-b border-zinc-800 flex items-center gap-2">
            <Activity className="w-5 h-5 text-cyan-400" />
            <h2 className="text-lg font-semibold">Live Order Flow</h2>
          </div>
          
          {/* Table Header */}
          <div className="grid grid-cols-7 gap-4 px-4 py-2 bg-zinc-800/50 text-xs text-zinc-500 font-medium">
            <div>Time</div>
            <div className="text-right">Price</div>
            <div className="text-right">Buy Vol</div>
            <div className="text-right">Sell Vol</div>
            <div className="text-right">Delta</div>
            <div className="text-right">Cumulative</div>
            <div>Visual</div>
          </div>
          
          {/* Table Rows */}
          <div className="max-h-96 overflow-y-auto">
            {orderFlow.slice().reverse().map((flow) => (
              <div 
                key={flow.index} 
                className="grid grid-cols-7 gap-4 px-4 py-2 border-b border-zinc-800/50 hover:bg-zinc-800/30 transition-colors text-sm"
              >
                <div className="text-zinc-400 text-xs">
                  {new Date(flow.timestamp).toLocaleTimeString('en-US', { hour12: false })}
                </div>
                <div className="text-right font-mono text-zinc-200">
                  {flow.price.toFixed(5)}
                </div>
                <div className="text-right text-green-400 font-mono">
                  {flow.buyVolume.toLocaleString()}
                </div>
                <div className="text-right text-red-400 font-mono">
                  {flow.sellVolume.toLocaleString()}
                </div>
                <div className={clsx(
                  'text-right font-mono font-semibold',
                  flow.netDelta >= 0 ? 'text-green-400' : 'text-red-400'
                )}>
                  {flow.netDelta >= 0 ? '+' : ''}{flow.netDelta.toLocaleString()}
                </div>
                <div className={clsx(
                  'text-right font-mono font-semibold',
                  flow.cumulativeDelta >= 0 ? 'text-green-400' : 'text-red-400'
                )}>
                  {flow.cumulativeDelta >= 0 ? '+' : ''}{flow.cumulativeDelta.toLocaleString()}
                </div>
                <div className="flex items-center gap-1">
                  <div 
                    className="h-4 bg-green-500/50 rounded-l"
                    style={{ width: `${(flow.buyVolume / 10000) * 100}%` }}
                  />
                  <div 
                    className="h-4 bg-red-500/50 rounded-r"
                    style={{ width: `${(flow.sellVolume / 10000) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Delta Cumulative Chart */}
        <div className="mt-6 bg-zinc-900/80 border border-zinc-800 rounded-xl p-4">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-cyan-400" />
            Cumulative Delta
          </h3>
          <div className="h-32 flex items-end gap-1">
            {delta.map((d, i) => (
              <div 
                key={i} 
                className={clsx(
                  'flex-1 rounded-t transition-all',
                  d >= 0 ? 'bg-green-500/60' : 'bg-red-500/60'
                )}
                style={{ 
                  height: `${Math.min(100, Math.abs(d) / 100)}%`,
                  opacity: 0.3 + (i / delta.length) * 0.7
                }}
              />
            ))}
          </div>
          <div className="flex justify-between mt-2 text-xs text-zinc-500">
            <span>20 bars ago</span>
            <span>Current</span>
          </div>
        </div>
      </div>
    </div>
  )
}

function OrderFlowStatCard({ label, value, icon: Icon, color, bgColor }: any) {
  return (
    <div className="bg-zinc-900/80 border border-zinc-800 rounded-xl p-4">
      <div className="flex items-center gap-2 mb-2">
        <div className={clsx('p-2 rounded-lg', bgColor)}>
          <Icon className={clsx('w-4 h-4', color)} />
        </div>
        <span className="text-xs text-zinc-500">{label}</span>
      </div>
      <p className={clsx('text-2xl font-bold', color)}>{value}</p>
    </div>
  )
}
