'use client'

import { useEffect, useRef, useState } from 'react'
import { useChartStore, useTradingStore, useConnectionStore } from '@/lib/store'
import { createChart, IChartApi, ISeriesApi, CandlestickData, Time, LineData } from 'lightweight-charts'
import { generateDemoData } from '@/lib/utils'
import { ictEngine } from '@/lib/ict/engine'
import { 
  ZoomIn, ZoomOut, RotateCcw, Crosshair, TrendingUp, TrendingDown,
  Eye, EyeOff, Box, Minimize2, LineChart, Settings, Play, Pause
} from 'lucide-react'
import { clsx } from 'clsx'

export default function ChartPage() {
  const chartContainerRef = useRef<HTMLDivElement>(null)
  const chartRef = useRef<IChartApi | null>(null)
  const candleSeriesRef = useRef<ISeriesApi<'Candlestick'> | null>(null)
  const volumeSeriesRef = useRef<ISeriesApi<'Histogram'> | null>(null)
  
  const { ohlcData, setOHLCData, orderBlocks, fairValueGaps, marketStructure } = useChartStore()
  const { symbol, timeframe } = useTradingStore()
  
  const [showOB, setShowOB] = useState(true)
  const [showFVG, setShowFVG] = useState(true)
  const [showVolume, setShowVolume] = useState(true)
  const [showFibs, setShowFibs] = useState(true)
  const [isLive, setIsLive] = useState(true)
  
  useEffect(() => {
    if (!chartContainerRef.current) return
    
    const chart = createChart(chartContainerRef.current, {
      width: chartContainerRef.current.clientWidth,
      height: chartContainerRef.current.clientHeight,
      layout: {
        background: { color: '#0a0e17' },
        textColor: '#9ca3af',
      },
      grid: {
        vertLines: { color: '#1f2937' },
        horzLines: { color: '#1f2937' },
      },
      crosshair: {
        mode: 1,
        vertLine: { color: '#6b7280', labelBackgroundColor: '#374151' },
        horzLine: { color: '#6b7280', labelBackgroundColor: '#374151' },
      },
      rightPriceScale: {
        borderColor: '#374151',
        scaleMargins: { top: 0.1, bottom: 0.2 },
      },
      timeScale: {
        borderColor: '#374151',
        timeVisible: true,
        secondsVisible: false,
      },
    })
    
    const candleSeries = chart.addCandlestickSeries({
      upColor: '#10b981',
      downColor: '#ef4444',
      borderUpColor: '#10b981',
      borderDownColor: '#ef4444',
      wickUpColor: '#10b981',
      wickDownColor: '#ef4444',
    })
    
    const volumeSeries = chart.addHistogramSeries({
      color: '#3b82f6',
      priceFormat: { type: 'volume' },
      priceScaleId: '',
    })
    
    volumeSeries.priceScale().applyOptions({
      scaleMargins: { top: 0.85, bottom: 0 },
    })
    
    chartRef.current = chart
    candleSeriesRef.current = candleSeries
    volumeSeriesRef.current = volumeSeries
    
    const data = generateDemoData(200, symbol)
    setOHLCData(data)
    
    const candleData = data.map(d => ({
      time: d.time as Time,
      open: d.open,
      high: d.high,
      low: d.low,
      close: d.close,
    }))
    
    const volumeData = data.map(d => ({
      time: d.time as Time,
      value: d.volume,
      color: d.close >= d.open ? 'rgba(16, 185, 129, 0.3)' : 'rgba(239, 68, 68, 0.3)',
    }))
    
    candleSeries.setData(candleData)
    volumeSeries.setData(volumeData)
    
    ictEngine.setData(data)
    const ms = ictEngine.analyzeMarketStructure()
    
    if (showFibs && data.length > 0) {
      const fibs = ictEngine.calculateOTE()
      fibs.forEach(fib => {
        candleSeries.createPriceLine({
          price: fib.price,
          color: fib.level === 0.618 ? '#f59e0b' : '#6b7280',
          lineWidth: 1,
          lineStyle: 2,
          axisLabelVisible: true,
          title: `${(fib.level * 100).toFixed(1)}%`,
        })
      })
    }
    
    chart.timeScale().fitContent()
    
    const handleResize = () => {
      if (chartContainerRef.current) {
        chart.applyOptions({ 
          width: chartContainerRef.current.clientWidth,
          height: chartContainerRef.current.clientHeight 
        })
      }
    }
    
    window.addEventListener('resize', handleResize)
    
    return () => {
      window.removeEventListener('resize', handleResize)
      chart.remove()
    }
  }, [symbol])
  
  useEffect(() => {
    if (!isLive) return
    
    const interval = setInterval(() => {
      setOHLCData(generateDemoData(200, symbol))
    }, 5000)
    
    return () => clearInterval(interval)
  }, [isLive, symbol, setOHLCData])
  
  useEffect(() => {
    if (!candleSeriesRef.current || !volumeSeriesRef.current || ohlcData.length === 0) return
    
    const candleData = ohlcData.map(d => ({
      time: d.time as Time,
      open: d.open,
      high: d.high,
      low: d.low,
      close: d.close,
    }))
    
    const volumeData = ohlcData.map(d => ({
      time: d.time as Time,
      value: d.volume,
      color: d.close >= d.open ? 'rgba(16, 185, 129, 0.3)' : 'rgba(239, 68, 68, 0.3)',
    }))
    
    candleSeriesRef.current.setData(candleData)
    volumeSeriesRef.current.setData(volumeData)
  }, [ohlcData])
  
  return (
    <div className="h-screen flex flex-col bg-[#0a0e17]">
      <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800">
        <div className="flex items-center gap-4">
          <div>
            <h1 className="text-xl font-bold text-white">{symbol}</h1>
            <p className="text-sm text-zinc-500">{timeframe} Chart | ICT Methodology</p>
          </div>
          
          <div className={clsx(
            'px-3 py-1 rounded-full text-sm font-semibold',
            marketStructure.trend === 'bullish' ? 'bg-green-500/20 text-green-400' :
            marketStructure.trend === 'bearish' ? 'bg-red-500/20 text-red-400' :
            'bg-zinc-700 text-zinc-400'
          )}>
            {marketStructure.trend.toUpperCase()} | {marketStructure.bos?.toUpperCase() || 'NO BOS'}
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <ChartButton icon={ZoomIn} label="Zoom In" />
          <ChartButton icon={ZoomOut} label="Zoom Out" />
          <ChartButton icon={RotateCcw} label="Reset" />
          <div className="h-6 w-px bg-zinc-700" />
          <ChartButton 
            icon={Box} 
            label="Order Blocks" 
            active={showOB}
            onClick={() => setShowOB(!showOB)}
          />
          <ChartButton 
            icon={Minimize2} 
            label="FVGs" 
            active={showFVG}
            onClick={() => setShowFVG(!showFVG)}
          />
          <ChartButton 
            icon={LineChart} 
            label="Fibonacci" 
            active={showFibs}
            onClick={() => setShowFibs(!showFibs)}
          />
          <div className="h-6 w-px bg-zinc-700" />
          <ChartButton 
            icon={isLive ? Pause : Play} 
            label={isLive ? 'Pause' : 'Play'}
            active={isLive}
            onClick={() => setIsLive(!isLive)}
          />
        </div>
      </div>
      
      <div ref={chartContainerRef} className="flex-1" />
      
      <div className="flex items-center justify-between px-6 py-3 bg-[#111827] border-t border-zinc-800">
        <div className="flex items-center gap-6 text-xs">
          <ICTInfo label="Premium/Discount" value="DISCOUNT" color="text-green-400" />
          <ICTInfo label="Kill Zone" value="LONDON ACTIVE" color="text-amber-400" />
          <ICTInfo label="Pattern" value={marketStructure.mss ? 'MSS DETECTED' : 'No Pattern'} color="text-cyan-400" />
        </div>
        <div className="text-xs text-zinc-500">
          {ohlcData.length > 0 && (
            <span>
              O: {ohlcData[ohlcData.length-1]?.open.toFixed(5)} | H: {ohlcData[ohlcData.length-1]?.high.toFixed(5)} | L: {ohlcData[ohlcData.length-1]?.low.toFixed(5)} | C: {ohlcData[ohlcData.length-1]?.close.toFixed(5)}
            </span>
          )}
        </div>
      </div>
    </div>
  )
}

function ChartButton({ icon: Icon, label, active, onClick }: { 
  icon: any
  label: string
  active?: boolean
  onClick?: () => void
}) {
  return (
    <button
      onClick={onClick}
      className={clsx(
        'p-2 rounded-lg transition-colors',
        active 
          ? 'bg-cyan-500/20 text-cyan-400 hover:bg-cyan-500/30' 
          : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700 hover:text-zinc-300'
      )}
      title={label}
    >
      <Icon className="w-4 h-4" />
    </button>
  )
}

function ICTInfo({ label, value, color }: { label: string, value: string, color: string }) {
  return (
    <div>
      <span className="text-zinc-500 mr-2">{label}:</span>
      <span className={`font-semibold ${color}`}>{value}</span>
    </div>
  )
}
