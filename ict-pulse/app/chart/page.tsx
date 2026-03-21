'use client'

import { useEffect, useRef, useState } from 'react'
import { useStore } from '@/lib/store'
import { createChart, IChartApi, ISeriesApi, CandlestickData, Time } from 'lightweight-charts'

export default function ChartPage() {
  const chartContainerRef = useRef<HTMLDivElement>(null)
  const chartRef = useRef<IChartApi | null>(null)
  const candleSeriesRef = useRef<ISeriesApi<'Candlestick'> | null>(null)
  const { ohlcData, symbol, timeframe } = useStore()
  const [showOB, setShowOB] = useState(true)
  const [showFVG, setShowFVG] = useState(true)

  useEffect(() => {
    if (!chartContainerRef.current) return

    const chart = createChart(chartContainerRef.current, {
      layout: {
        background: { color: '#0a0e17' },
        textColor: '#9ca3af',
      },
      grid: {
        vertLines: { color: '#1f2937' },
        horzLines: { color: '#1f2937' },
      },
      width: chartContainerRef.current.clientWidth,
      height: 500,
    })

    const candleSeries = chart.addCandlestickSeries({
      upColor: '#10b981',
      downColor: '#ef4444',
      borderUpColor: '#10b981',
      borderDownColor: '#ef4444',
      wickUpColor: '#10b981',
      wickDownColor: '#ef4444',
    })

    chartRef.current = chart
    candleSeriesRef.current = candleSeries

    const handleResize = () => {
      if (chartContainerRef.current && chartRef.current) {
        chartRef.current.applyOptions({ width: chartContainerRef.current.clientWidth })
      }
    }

    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
      chart.remove()
    }
  }, [])

  useEffect(() => {
    if (candleSeriesRef.current && ohlcData.length > 0) {
      const chartData: CandlestickData<Time>[] = ohlcData.map((c) => ({
        time: c.time as Time,
        open: c.open,
        high: c.high,
        low: c.low,
        close: c.close,
      }))
      candleSeriesRef.current.setData(chartData)
    }
  }, [ohlcData])

  return (
    <div className="min-h-screen bg-[#0a0e17] text-white p-4 lg:p-6">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold">{symbol}</h1>
          <p className="text-zinc-500">{timeframe} Chart</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setShowOB(!showOB)} className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${showOB ? 'bg-green-500/20 text-green-400' : 'bg-zinc-800 text-zinc-400'}`}>Order Blocks</button>
          <button onClick={() => setShowFVG(!showFVG)} className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${showFVG ? 'bg-cyan-500/20 text-cyan-400' : 'bg-zinc-800 text-zinc-400'}`}>FVGs</button>
        </div>
      </div>

      <div ref={chartContainerRef} className="w-full rounded-2xl overflow-hidden border border-zinc-800" />

      <div className="mt-6 grid grid-cols-2 gap-4">
        <div className="bg-[#111827] border border-zinc-800 rounded-2xl p-4">
          <h3 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider mb-3">ICT Concepts</h3>
          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2"><span className="w-3 h-3 bg-green-500 rounded" /><span className="text-zinc-300">Bullish Order Block</span></div>
            <div className="flex items-center gap-2"><span className="w-3 h-3 bg-red-500 rounded" /><span className="text-zinc-300">Bearish Order Block</span></div>
            <div className="flex items-center gap-2"><span className="w-3 h-3 bg-cyan-500 rounded" /><span className="text-zinc-300">Bullish FVG</span></div>
            <div className="flex items-center gap-2"><span className="w-3 h-3 bg-purple-500 rounded" /><span className="text-zinc-300">Bearish FVG</span></div>
          </div>
        </div>
        <div className="bg-[#111827] border border-zinc-800 rounded-2xl p-4">
          <h3 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider mb-3">Trading Sessions</h3>
          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2"><span className="w-3 h-3 bg-amber-500 rounded" /><span className="text-zinc-300">London: 07:00-10:00 UTC</span></div>
            <div className="flex items-center gap-2"><span className="w-3 h-3 bg-blue-500 rounded" /><span className="text-zinc-300">NY AM: 12:00-15:00 UTC</span></div>
            <div className="flex items-center gap-2"><span className="w-3 h-3 bg-purple-500 rounded" /><span className="text-zinc-300">NY PM: 17:00-20:00 UTC</span></div>
            <div className="flex items-center gap-2"><span className="w-3 h-3 bg-emerald-500 rounded" /><span className="text-zinc-300">Asia: 00:00-03:00 UTC</span></div>
          </div>
        </div>
      </div>
    </div>
  )
}
