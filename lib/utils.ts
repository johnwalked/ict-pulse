// Utility functions for ICT Pulse

import type { OHLC } from '@/types'

export function generateDemoData(count: number, symbol: string): OHLC[] {
  const data: OHLC[] = []
  const now = Date.now()
  const interval = 3600000 // 1 hour candles
  
  // Base price varies by symbol
  let basePrice = 1.0850 // EURUSD
  if (symbol === 'GBPUSD') basePrice = 1.2650
  if (symbol === 'USDJPY') basePrice = 149.50
  if (symbol === 'XAUUSD') basePrice = 2340.00
  if (symbol === 'NAS100') basePrice = 18500.00
  
  let currentPrice = basePrice
  
  for (let i = count; i > 0; i--) {
    const volatility = symbol === 'XAUUSD' ? 15 : symbol === 'NAS100' ? 50 : 0.0010
    
    const open = currentPrice
    const change = (Math.random() - 0.5) * volatility
    const close = open + change
    
    const high = Math.max(open, close) + Math.random() * volatility * 0.5
    const low = Math.min(open, close) - Math.random() * volatility * 0.5
    
    const volume = Math.floor(Math.random() * 10000) + 5000
    
    data.push({
      time: Math.floor((now - i * interval) / 1000),
      open,
      high,
      low,
      close,
      volume
    })
    
    currentPrice = close
  }
  
  return data
}

export function formatPrice(price: number, decimals?: number): string {
  if (decimals !== undefined) {
    return price.toFixed(decimals)
  }
  // Auto-detect decimals based on price level
  if (price > 100) return price.toFixed(2)
  if (price > 10) return price.toFixed(3)
  return price.toFixed(5)
}

export function formatPips(price: number, isJPY: boolean = false): string {
  const multiplier = isJPY ? 100 : 10000
  const pips = (price * multiplier).toFixed(1)
  return `${pips} pips`
}

export function calculatePnl(entry: number, current: number, lots: number, isLong: boolean, symbol: string): number {
  const pipValue = lots * 10 // $10 per pip per standard lot
  const pipDiff = isLong 
    ? (current - entry) * (symbol.includes('JPY') ? 100 : 10000)
    : (entry - current) * (symbol.includes('JPY') ? 100 : 10000)
  return pipValue * pipDiff
}

export function formatTime(timestamp: number, format: 'time' | 'date' | 'full' = 'time'): string {
  const date = new Date(timestamp)
  
  if (format === 'time') {
    return date.toLocaleTimeString('en-US', { hour12: false })
  }
  if (format === 'date') {
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  }
  return date.toLocaleString('en-US', { 
    month: 'short', 
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  })
}

export function getSessionFromTime(timestamp: number): string {
  const date = new Date(timestamp)
  const hour = date.getUTCHours()
  
  if (hour >= 22 || hour < 7) return 'Sydney'
  if (hour >= 7 && hour < 16) return 'London'
  if (hour >= 13 && hour < 18) return 'New York'
  return 'Off Hours'
}

export function calculateFibonacciLevels(high: number, low: number): { level: number; price: number }[] {
  const diff = high - low
  const levels = [
    { level: 0, price: low },
    { level: 0.236, price: low + diff * 0.236 },
    { level: 0.382, price: low + diff * 0.382 },
    { level: 0.5, price: low + diff * 0.5 },
    { level: 0.618, price: low + diff * 0.618 },
    { level: 0.786, price: low + diff * 0.786 },
    { level: 1, price: high },
    { level: 1.272, price: high + diff * 0.272 },
    { level: 1.618, price: high + diff * 0.618 },
    { level: 2.618, price: high + diff * 1.618 },
  ]
  
  return levels
}

export function detectPattern(prices: number[]): string | null {
  if (prices.length < 10) return null
  
  const recent = prices.slice(-10)
  const max = Math.max(...recent)
  const min = Math.min(...recent)
  const range = max - min
  
  // Double top detection
  const topIndices = recent.map((p, i) => p > max - range * 0.1 ? i : -1).filter(i => i >= 0)
  if (topIndices.length >= 2 && topIndices[topIndices.length - 1] - topIndices[0] > 3) {
    return 'double_top'
  }
  
  // Double bottom detection
  const bottomIndices = recent.map((p, i) => p < min + range * 0.1 ? i : -1).filter(i => i >= 0)
  if (bottomIndices.length >= 2 && bottomIndices[bottomIndices.length - 1] - bottomIndices[0] > 3) {
    return 'double_bottom'
  }
  
  // Higher high (bullish)
  if (recent[recent.length - 1] > recent[recent.length - 3] && 
      recent[recent.length - 3] > recent[recent.length - 5]) {
    return 'higher_high'
  }
  
  // Lower low (bearish)
  if (recent[recent.length - 1] < recent[recent.length - 3] && 
      recent[recent.length - 3] < recent[recent.length - 5]) {
    return 'lower_low'
  }
  
  return null
}
