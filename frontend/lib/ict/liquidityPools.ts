// ICT Liquidity Pools Detection
// Liquidity pools are areas where stop orders accumulate

export interface LiquidityPool {
  time: number
  price: number
  type: 'buy' | 'sell'
  size: number
  swept: boolean
  sweepTime?: number
}

export interface OHLC {
  time: number
  open: number
  high: number
  low: number
  close: number
  volume?: number
}

export function detectLiquidityPools(prices: OHLC[], volumeThreshold: number = 1.5): LiquidityPool[] {
  const pools: LiquidityPool[] = []
  const lookback = 20
  
  for (let i = lookback; i < prices.length; i++) {
    const current = prices[i]
    const lookbackPrices = prices.slice(i - lookback, i)
    
    // Detect swing highs as potential sell liquidity
    const isSwingHigh = current.high === Math.max(...lookbackPrices.map(p => p.high))
    // Detect swing lows as potential buy liquidity
    const isSwingLow = current.low === Math.min(...lookbackPrices.map(p => p.low))
    
    const avgVolume = lookbackPrices.reduce((sum, p) => sum + (p.volume || 1), 0) / lookback
    const volumeRatio = (current.volume || 1) / avgVolume
    
    if (isSwingHigh && volumeRatio >= volumeThreshold) {
      pools.push({
        time: current.time,
        price: current.high,
        type: 'sell',
        size: Math.round(volumeRatio * 100),
        swept: false
      })
    }
    
    if (isSwingLow && volumeRatio >= volumeThreshold) {
      pools.push({
        time: current.time,
        price: current.low,
        type: 'buy',
        size: Math.round(volumeRatio * 100),
        swept: false
      })
    }
  }
  
  return pools
}

export function checkPoolSweep(pool: LiquidityPool, currentPrice: number): LiquidityPool {
  let swept = pool.swept
  let sweepTime = pool.sweepTime
  
  if (!swept) {
    if (pool.type === 'sell' && currentPrice > pool.price) {
      swept = true
    } else if (pool.type === 'buy' && currentPrice < pool.price) {
      swept = true
    }
  }
  
  return { ...pool, swept, sweepTime }
}

export function detectStopHuntPatterns(prices: OHLC[]): LiquidityPool[] {
  const hunts: LiquidityPool[] = []
  
  for (let i = 3; i < prices.length; i++) {
    const current = prices[i]
    const prev = prices[i - 1]
    const prevPrev = prices[i - 2]
    
    // Detect liquidity grab followed by reversal
    if (current.close > current.open) {
      // Bullish rejection after sweep
      if (prevPrev.high < prev.high && current.low < prev.low && current.close > prev.high) {
        hunts.push({
          time: current.time,
          price: prev.low,
          type: 'buy',
          size: 75,
          swept: false
        })
      }
    } else {
      // Bearish rejection after sweep  
      if (prevPrev.low > prev.low && current.high > prev.low && current.close < prev.low) {
        hunts.push({
          time: current.time,
          price: prev.high,
          type: 'sell',
          size: 75,
          swept: false
        })
      }
    }
  }
  
  return hunts
}

export function getActivePools(pools: LiquidityPool[]): LiquidityPool[] {
  return pools.filter(pool => !pool.swept)
}
