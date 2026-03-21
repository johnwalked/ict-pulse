'use client'

import { useEffect, useRef, useState } from 'react'
import { useTradingStore, OHLCData } from '@/lib/store'
import { ZoomIn, ZoomOut, RotateCcw, Crosshair, TrendingUp, TrendingDown, Minus } from 'lucide-react'

function generateDemoOHLC(days: number = 90): OHLCData[] {
  const data: OHLCData[] = []
  let basePrice = 1.0850
  const now = Math.floor(Date.now() / 1000)
  const dayInSeconds = 86400
  
  for (let i = days; i >= 0; i--) {
    const time = now - (i * dayInSeconds)
    const volatility = 0.002 + Math.random() * 0.003
    const trend = Math.sin(i / 20) * 0.001
    
    const open = basePrice
    const close = basePrice + (Math.random() - 0.5) * volatility + trend
    const high = Math.max(open, close) + Math.random() * volatility * 0.5
    const low = Math.min(open, close) - Math.random() * volatility * 0.5
    
    data.push({
      time,
      open: Number(open.toFixed(5)),
      high: Number(high.toFixed(5)),
      low: Number(low.toFixed(5)),
      close: Number(close.toFixed(5)),
    })
    
    basePrice = close
  }
  return data
}

export default function ChartPage() {
  const chartContainerRef = useRef<HTMLDivElement>(null)
  const chartRef = useRef<any>(null)
  const candleSeriesRef = useRef<any>(null)
  const { symbol, timeframe, setOhlcData, ohlcData } = useTradingStore()
  const [showControls, setShowControls] = useState(true)
  const [chartType, setChartType] = useState<'candle' | 'line'>('candle')

  useEffect(() => {
    if (!chartContainerRef.current) return

    const chart = (window as any).TradingView.createChart(chartContainerRef.current, {
      layout: {
        background: { type: 'solid', color: '#0a0e17' },
        textColor: '#9ca3af',
      },
      grid: {
        vertLines: { color: '#1f2937' },
        horzLines: { color: '#1f2937' },
      },
      crosshair: {
        mode: 1,
        vertLine: { color: '#6366f1', width: 1, style: 2 },
        horzLine: { color: '#6366f1', width: 1, style: 2 },
      },
      rightPriceScale: {
        borderColor: '#374151',
        scaleMargins: { top: 0.1, bottom: 0.1 },
      },
      timeScale: {
        borderColor: '#374151',
        timeVisible: true,
      },
      width: chartContainerRef.current.clientWidth,
      height: 600,
    })

    const candleSeries = chart.addCandlestickSeries({
      upColor: '#10b981',
      downColor: '#ef4444',
      borderUpColor: '#10b981',
      borderDownColor: '#ef4444',
      wickUpColor: '#10b981',
      wickDownColor: '#ef4444',
    })

    const demoData = generateDemoOHLC()
    candleSeries.setData(demoData)
    setOhlcData(demoData)

    chart.timeScale().fitContent()

    chartRef.current = chart
    candleSeriesRef.current = candleSeries

    const handleResize = () => {
      if (chartContainerRef.current) {
        chart.applyOptions({ 
          width: chartContainerRef.current.clientWidth,
          height: 600
        })
      }
    }

    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
      chart.remove()
    }
  }, [setOhlcData])

  const handleZoomIn = () => {
    if (chartRef.current) {
      chartRef.current.timeScale().zoomIn()
    }
  }

  const handleZoomOut = () => {
    if (chartRef.current) {
      chartRef.current.timeScale().zoomOut()
    }
  }

  const handleReset = () => {
    if (chartRef.current && candleSeriesRef.current) {
      chartRef.current.timeScale().fitContent()
    }
  }

  return (
    <div className="min-h-screen bg-bg-primary p-6">
      <div className="max-w-[1800px] mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-text-primary font-display">
              {symbol} Chart
            </h1>
            <p className="text-text-secondary mt-1">
              {timeframe} timeframe • ICT Trading Analysis
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowControls(!showControls)}
              className="px-4 py-2 bg-bg-secondary border border-border rounded-lg text-text-primary hover:bg-bg-tertiary transition-colors"
            >
              {showControls ? 'Hide' : 'Show'} Controls
            </button>
          </div>
        </div>

        {showControls && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-bg-secondary border border-border rounded-lg p-4">
              <label className="text-text-secondary text-sm mb-2 block">Timeframe</label>
              <select className="w-full bg-bg-tertiary border border-border rounded-lg px-3 py-2 text-text-primary">
                <option value="1m">1 Minute</option>
                <option value="5m">5 Minutes</option>
                <option value="15m">15 Minutes</option>
                <option value="1H" selected>1 Hour</option>
                <option value="4H">4 Hours</option>
                <option value="1D">Daily</option>
              </select>
            </div>
            <div className="bg-bg-secondary border border-border rounded-lg p-4">
              <label className="text-text-secondary text-sm mb-2 block">Chart Type</label>
              <div className="flex gap-2">
                <button
                  onClick={() => setChartType('candle')}
                  className={`flex-1 py-2 px-3 rounded-lg transition-colors ${
                    chartType === 'candle' ? 'bg-indigo-600 text-white' : 'bg-bg-tertiary text-text-secondary'
                  }`}
                >
                  Candle
                </button>
                <button
                  onClick={() => setChartType('line')}
                  className={`flex-1 py-2 px-3 rounded-lg transition-colors ${
                    chartType === 'line' ? 'bg-indigo-600 text-white' : 'bg-bg-tertiary text-text-secondary'
                  }`}
                >
                  Line
                </button>
              </div>
            </div>
            <div className="bg-bg-secondary border border-border rounded-lg p-4">
              <label className="text-text-secondary text-sm mb-2 block">Indicators</label>
              <div className="flex flex-wrap gap-2">
                <span className="px-2 py-1 bg-indigo-600/20 text-indigo-400 rounded text-xs">OB</span>
                <span className="px-2 py-1 bg-emerald-600/20 text-emerald-400 rounded text-xs">FVG</span>
                <span className="px-2 py-1 bg-amber-600/20 text-amber-400 rounded text-xs">Liq</span>
                <span className="px-2 py-1 bg-violet-600/20 text-violet-400 rounded text-xs">BOS</span>
              </div>
            </div>
            <div className="bg-bg-secondary border border-border rounded-lg p-4 flex items-center justify-center gap-2">
              <button onClick={handleZoomIn} className="p-2 bg-bg-tertiary rounded-lg hover:bg-indigo-600 transition-colors">
                <ZoomIn className="w-5 h-5 text-text-primary" />
              </button>
              <button onClick={handleZoomOut} className="p-2 bg-bg-tertiary rounded-lg hover:bg-indigo-600 transition-colors">
                <ZoomOut className="w-5 h-5 text-text-primary" />
              </button>
              <button onClick={handleReset} className="p-2 bg-bg-tertiary rounded-lg hover:bg-indigo-600 transition-colors">
                <RotateCcw className="w-5 h-5 text-text-primary" />
              </button>
            </div>
          </div>
        )}

        <div className="bg-bg-secondary border border-border rounded-xl overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b border-border">
            <div className="flex items-center gap-4">
              <span className="text-text-secondary text-sm">ICT Silver Bullet</span>
              <span className="text-text-secondary text-sm">•</span>
              <span className="text-text-secondary text-sm">Order Blocks</span>
              <span className="text-text-secondary text-sm">•</span>
              <span className="text-text-secondary text-sm">Fair Value Gaps</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="flex items-center gap-1 text-xs">
                <span className="w-2 h-2 bg-emerald-500 rounded-full"></span>
                Bullish
              </span>
              <span className="flex items-center gap-1 text-xs ml-3">
                <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                Bearish
              </span>
            </div>
          </div>
          <div ref={chartContainerRef} className="w-full" style={{ height: '600px' }} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          <div className="bg-bg-secondary border border-border rounded-xl p-4">
            <h3 className="text-lg font-semibold text-text-primary mb-3">Market Structure</h3>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-text-secondary">Trend</span>
                <span className="text-emerald-400 font-medium">Bullish</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-text-secondary">Last BOS</span>
                <span className="text-text-primary">Broken @ 1.0832</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-text-secondary">Swing High</span>
                <span className="text-text-primary">1.0925</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-text-secondary">Swing Low</span>
                <span className="text-text-primary">1.0750</span>
              </div>
            </div>
          </div>
          <div className="bg-bg-secondary border border-border rounded-xl p-4">
            <h3 className="text-lg font-semibold text-text-primary mb-3">Key Levels</h3>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-text-secondary">Daily POC</span>
                <span className="text-indigo-400 font-medium">1.0855</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-text-secondary">Order Block</span>
                <span className="text-amber-400 font-medium">1.0820-30</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-text-secondary">FVG</span>
                <span className="text-violet-400 font-medium">1.0845-50</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-text-secondary">Liquidity</span>
                <span className="text-rose-400 font-medium">1.0900</span>
              </div>
            </div>
          </div>
          <div className="bg-bg-secondary border border-border rounded-xl p-4">
            <h3 className="text-lg font-semibold text-text-primary mb-3">Trade Setup</h3>
            <div className="space-y-3">
              <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-lg">
                <div className="flex items-center gap-2 mb-1">
                  <TrendingUp className="w-4 h-4 text-emerald-400" />
                  <span className="text-emerald-400 font-medium">Long Setup</span>
                </div>
                <p className="text-text-secondary text-xs">Entry: 1.0845 | SL: 1.0810 | TP: 1.0920</p>
              </div>
              <div className="text-xs text-text-secondary">
                <span className="text-indigo-400">Confidence:</span> 78%
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
