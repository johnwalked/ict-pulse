// ICT Market Structure Analysis
// Implements concepts from Inner Circle Trader methodology

export interface SwingPoint {
  index: number
  time: number
  price: number
  type: 'high' | 'low'
}

export interface MarketStructure {
  trend: 'bullish' | 'bearish' | 'ranging'
  swings: SwingPoint[]
  bos: { time: number; direction: 'bullish' | 'bearish' } | null
  lastSwingHigh: number
  lastSwingLow: number
}

export interface OHLC {
  time: number
  open: number
  high: number
  low: number
  close: number
}

export function detectSwingPoints(prices: OHLC[], lookback: number = 5): SwingPoint[] {
  const swings: SwingPoint[] = []
  
  for (let i = lookback; i < prices.length - lookback; i++) {
    const current = prices[i]
    let isSwingHigh = true
    let isSwingLow = true
    
    for (let j = i - lookback; j <= i + lookback; j++) {
      if (j === i) continue
      if (prices[j].high >= current.high) isSwingHigh = false
      if (prices[j].low <= current.low) isSwingLow = false
    }
    
    if (isSwingHigh) {
      swings.push({ index: i, time: current.time, price: current.high, type: 'high' })
    } else if (isSwingLow) {
      swings.push({ index: i, time: current.time, price: current.low, type: 'low' })
    }
  }
  
  return swings
}

export function detectBOS(prices: OHLC[], swings: SwingPoint[]): MarketStructure {
  let trend: 'bullish' | 'bearish' | 'ranging' = 'ranging'
  let bos: { time: number; direction: 'bullish' | 'bearish' } | null = null
  let lastSwingHigh = 0
  let lastSwingLow = 0
  
  const bullishSwings = swings.filter(s => s.type === 'low')
  const bearishSwings = swings.filter(s => s.type === 'high')
  
  if (bullishSwings.length >= 2 && bearishSwings.length >= 2) {
    const lastBullSwing = bullishSwings[bullishSwings.length - 1]
    const prevBullSwing = bullishSwings[bullishSwings.length - 2]
    const lastBearSwing = bearishSwings[bearishSwings.length - 1]
    const prevBearSwing = bearishSwings[bearishSwings.length - 2]
    
    if (lastBullSwing.price > prevBullSwing.price && lastBearSwing.price > prevBearSwing.price) {
      trend = 'bullish'
    } else if (lastBullSwing.price < prevBullSwing.price && lastBearSwing.price < prevBearSwing.price) {
      trend = 'bearish'
    }
    
    if (lastBearSwing.index > lastBullSwing.index && lastBearSwing.price > prevBearSwing.price) {
      bos = { time: lastBearSwing.time, direction: 'bullish' }
    } else if (lastBullSwing.index > lastBearSwing.index && lastBullSwing.price < prevBullSwing.price) {
      bos = { time: lastBullSwing.time, direction: 'bearish' }
    }
    
    lastSwingHigh = lastBearSwing.price
    lastSwingLow = lastBullSwing.price
  }
  
  return { trend, swings, bos, lastSwingHigh, lastSwingLow }
}

export function isBullishBreakOfStructure(prices: OHLC[], structure: MarketStructure): boolean {
  if (!structure.bos || structure.bos.direction !== 'bullish') return false
  return prices[prices.length - 1].close > structure.lastSwingHigh
}

export function isBearishBreakOfStructure(prices: OHLC[], structure: MarketStructure): boolean {
  if (!structure.bos || structure.bos.direction !== 'bearish') return false
  return prices[prices.length - 1].close < structure.lastSwingLow
}
