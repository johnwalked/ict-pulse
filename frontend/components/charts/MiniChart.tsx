'use client'

import { useEffect, useRef } from 'react'
import { useTradingStore, OHLCData } from '@/lib/store'
import { TrendingUp, TrendingDown } from 'lucide-react'

function generateDemoOHLC(days: number = 30): OHLCData[] {
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

declare global {
  interface Window {
    TradingView: any
  }
}

export function MiniChart() {
  const chartContainerRef = useRef<HTMLDivElement>(null)
  const { symbol, timeframe } = useTradingStore()
  const lastPrice = 1.0865
  const priceChange = 0.0012
  const priceChangePercent = 0.11
  const isPositive = priceChange >= 0

  useEffect(() => {
    if (!chartContainerRef.current) return

    const script = document.createElement('script')
    script.src = 'https://s3.tradingview.com/tv.js'
    script.async = true
    script.onload = () => {
      if (chartContainerRef.current && window.TradingView) {
        new window.TradingView.widget({
          autosize: true,
          symbol: 'EURUSD',
          interval: '60',
          timezone: 'Etc/UTC',
          theme: 'dark',
          style: '1',
          locale: 'en',
          toolbar_bg: '#111827',
          enable_publishing: false,
          hide_side_toolbar: true,
          container_id: chartContainerRef.current.id,
        })
      }
    }
    document.head.appendChild(script)

    return () => {
      if (chartContainerRef.current) {
        chartContainerRef.current.innerHTML = ''
      }
    }
  }, [])

  return (
    <div className="bg-bg-secondary border border-border rounded-xl overflow-hidden h-full">
      <div className="flex items-center justify-between px-4 py-3 border-b border-border">
        <div className="flex items-center gap-4">
          <div>
            <h3 className="text-lg font-semibold text-text-primary">{symbol}</h3>
            <p className="text-text-secondary text-xs">{timeframe} Chart</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-2xl font-bold text-text-primary">{lastPrice.toFixed(5)}</span>
            <div className={`flex items-center gap-1 ${isPositive ? 'text-emerald-400' : 'text-red-400'}`}>
              {isPositive ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
              <span className="text-sm font-medium">
                {isPositive ? '+' : ''}{priceChange.toFixed(5)} ({priceChangePercent.toFixed(2)}%)
              </span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="px-2 py-1 bg-indigo-500/20 text-indigo-400 rounded text-xs">ICT Silver Bullet</span>
          <span className="px-2 py-1 bg-emerald-500/20 text-emerald-400 rounded text-xs">Bullish</span>
        </div>
      </div>
      <div id="tradingview_chart" ref={chartContainerRef} style={{ height: '350px' }} />
    </div>
  )
}
