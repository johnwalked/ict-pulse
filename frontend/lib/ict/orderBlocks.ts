// ICT Order Block Detection
// Order blocks are zones where institutional traders placed orders

export interface OrderBlock {
  time: number
  high: number
  low: number
  type: 'bullish' | 'bearish'
  strength: number
  filled: boolean
  fillPercent: number
}

export interface OHLC {
  time: number
  open: number
  high: number
  low: number
  close: number
}

export function detectOrderBlocks(prices: OHLC[], minBodySize: number = 0.0005): OrderBlock[] {
  const blocks: OrderBlock[] = []
  
  for (let i = 2; i < prices.length; i++) {
    const current = prices[i]
    const prev = prices[i - 1]
    const prevPrev = prices[i - 2]
    
    const bodySize = Math.abs(current.close - current.open)
    if (bodySize < minBodySize) continue
    
    const isBullish = current.close > current.open
    const isPrevBullish = prev.close > prev.open
    const isPrevPrevBullish = prevPrev.close > prevPrev.open
    
    if (isBullish && !isPrevBullish && !isPrevPrevBullish) {
      const bodyHigh = Math.max(current.open, current.close)
      const bodyLow = Math.min(current.open, current.close)
      const wickBelow = bodyLow - Math.min(current.low, prev.low)
      
      if (wickBelow > bodySize * 1.5) {
        blocks.push({
          time: current.time,
          high: bodyHigh,
          low: Math.min(current.low, prev.low),
          type: 'bullish',
          strength: Math.min(100, Math.round((wickBelow / bodySize) * 50)),
          filled: false,
          fillPercent: 0
        })
      }
    } else if (!isBullish && isPrevBullish && isPrevPrevBullish) {
      const bodyHigh = Math.max(current.open, current.close)
      const bodyLow = Math.min(current.open, current.close)
      const wickAbove = Math.max(current.high, prev.high) - bodyHigh
      
      if (wickAbove > bodySize * 1.5) {
        blocks.push({
          time: current.time,
          high: Math.max(current.high, prev.high),
          low: bodyLow,
          type: 'bearish',
          strength: Math.min(100, Math.round((wickAbove / bodySize) * 50)),
          filled: false,
          fillPercent: 0
        })
      }
    }
  }
  
  return blocks
}

export function checkOrderBlockFill(block: OrderBlock, currentPrice: number): OrderBlock {
  let fillPercent = 0
  let filled = false
  
  if (block.type === 'bullish') {
    if (currentPrice <= block.high && currentPrice >= block.low) {
      fillPercent = ((block.high - currentPrice) / (block.high - block.low)) * 100
      filled = fillPercent >= 80
    } else if (currentPrice < block.low) {
      fillPercent = 100
      filled = true
    }
  } else {
    if (currentPrice >= block.low && currentPrice <= block.high) {
      fillPercent = ((currentPrice - block.low) / (block.high - block.low)) * 100
      filled = fillPercent >= 80
    } else if (currentPrice > block.high) {
      fillPercent = 100
      filled = true
    }
  }
  
  return { ...block, filled, fillPercent }
}

export function isOrderBlockActive(block: OrderBlock, currentPrice: number, maxAge: number = 20): boolean {
  if (block.filled) return false
  return block.fillPercent < 100
}
