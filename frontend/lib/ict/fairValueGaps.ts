// ICT Fair Value Gap (FVG) Detection
// FVG occurs when there's a gap between the body of one candle and the wick of another

export interface FairValueGap {
  time: number
  high: number
  low: number
  type: 'bullish' | 'bearish'
  strength: number
  filled: boolean
  fillPercent: number
  age: number
}

export interface OHLC {
  time: number
  open: number
  high: number
  low: number
  close: number
}

export function detectFairValueGaps(prices: OHLC[]): FairValueGap[] {
  const gaps: FairValueGap[] = []
  
  for (let i = 2; i < prices.length; i++) {
    const current = prices[i]
    const prev = prices[i - 1]
    const prevPrev = prices[i - 2]
    
    // Bullish FVG: gap between prev.low and prevPrev.high
    if (current.close > current.open) {
      const gapLow = current.low
      const gapHigh = Math.min(prevPrev.open, prevPrev.close)
      
      if (gapLow > gapHigh) {
        const gapSize = gapLow - gapHigh
        gaps.push({
          time: current.time,
          high: gapLow,
          low: gapHigh,
          type: 'bullish',
          strength: Math.min(100, Math.round((gapSize / current.close) * 10000)),
          filled: false,
          fillPercent: 0,
          age: 0
        })
      }
    } else {
      // Bearish FVG: gap between prevPrev.low and prev.high
      const gapLow = Math.max(prevPrev.open, prevPrev.close)
      const gapHigh = current.high
      
      if (gapHigh > gapLow) {
        const gapSize = gapHigh - gapLow
        gaps.push({
          time: current.time,
          high: gapHigh,
          low: gapLow,
          type: 'bearish',
          strength: Math.min(100, Math.round((gapSize / current.close) * 10000)),
          filled: false,
          fillPercent: 0,
          age: 0
        })
      }
    }
  }
  
  return gaps
}

export function checkFVGFill(fvg: FairValueGap, currentPrice: number): FairValueGap {
  let fillPercent = fvg.fillPercent
  let filled = fvg.filled
  
  if (fvg.type === 'bullish') {
    if (currentPrice <= fvg.low) {
      fillPercent = 100
      filled = true
    } else if (currentPrice < fvg.high) {
      fillPercent = ((fvg.high - currentPrice) / (fvg.high - fvg.low)) * 100
      filled = fillPercent >= 80
    }
  } else {
    if (currentPrice >= fvg.high) {
      fillPercent = 100
      filled = true
    } else if (currentPrice > fvg.low) {
      fillPercent = ((currentPrice - fvg.low) / (fvg.high - fvg.low)) * 100
      filled = fillPercent >= 80
    }
  }
  
  return { ...fvg, filled, fillPercent }
}

export function ageFairValueGaps(gaps: FairValueGap[]): FairValueGap[] {
  return gaps.map(gap => ({
    ...gap,
    age: gap.age + 1,
    filled: gap.fillPercent >= 100
  }))
}

export function getActiveFVGs(gaps: FairValueGap[], maxAge: number = 10): FairValueGap[] {
  return gaps.filter(gap => !gap.filled && gap.age < maxAge)
}
