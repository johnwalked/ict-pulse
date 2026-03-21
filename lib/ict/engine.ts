// ICT Trading Engine - Complete ICT Methodology Implementation
// Based on Inner Circle Trader (Michael Huddleston) teachings

import type { 
  OHLC, OrderBlock, FairValueGap, LiquidityPool, 
  SwingPoint, MarketStructure, FibonacciLevel, ICTPattern
} from '@/types'

export class ICTTradingEngine {
  private ohlcData: OHLC[] = []
  private swingLookback = 5
  private fibLevels = [0, 0.236, 0.382, 0.5, 0.618, 0.786, 1, 1.272, 1.618, 2.618]
  
  // Set data for analysis
  setData(data: OHLC[]): void {
    this.ohlcData = data
  }
  
  // Analyze market structure
  analyzeMarketStructure(): MarketStructure {
    if (this.ohlcData.length < 20) {
      return { trend: 'neutral', bos: null, mss: false, equalHighs: false, equalLows: false }
    }
    
    const recent = this.ohlcData.slice(-20)
    const swingPoints = this.identifySwingPoints(recent)
    
    // Determine trend using swing highs and lows
    let trend: 'bullish' | 'bearish' | 'neutral' = 'neutral'
    let bos: 'bullish' | 'bearish' | null = null
    let mss = false
    
    // Get last swing points
    const highs = swingPoints.filter(sp => sp.type === 'swing_high')
    const lows = swingPoints.filter(sp => sp.type === 'swing_low')
    
    if (highs.length >= 2 && lows.length >= 2) {
      const lastHigh = highs[highs.length - 1]
      const prevHigh = highs[highs.length - 2]
      const lastLow = lows[lows.length - 1]
      const prevLow = lows[lows.length - 2]
      
      // Bullish trend: higher highs and higher lows
      if (lastHigh.price > prevHigh.price && lastLow.price > prevLow.price) {
        trend = 'bullish'
        bos = 'bullish'
      }
      // Bearish trend: lower highs and lower lows
      else if (lastHigh.price < prevHigh.price && lastLow.price < prevLow.price) {
        trend = 'bearish'
        bos = 'bearish'
      }
      
      // Market Structure Shift: displacement candle breaks the trend
      if (this.detectMSS(swingPoints)) {
        mss = true
      }
    }
    
    // Detect equal highs/lows
    const equalHighs = this.detectEqualHighs(swingPoints)
    const equalLows = this.detectEqualLows(swingPoints)
    
    return { trend, bos, mss, equalHighs, equalLows }
  }
  
  // Identify swing highs and lows
  private identifySwingPoints(data: OHLC[]): SwingPoint[] {
    const points: SwingPoint[] = []
    
    for (let i = 2; i < data.length - 2; i++) {
      // Swing high: higher than 2 candles on each side
      if (data[i].high > data[i-1].high && 
          data[i].high > data[i-2].high &&
          data[i].high > data[i+1].high && 
          data[i].high > data[i+2].high) {
        points.push({
          id: `sh_${i}`,
          time: data[i].time,
          price: data[i].high,
          type: 'swing_high',
          broken: false
        })
      }
      
      // Swing low: lower than 2 candles on each side
      if (data[i].low < data[i-1].low && 
          data[i].low < data[i-2].low &&
          data[i].low < data[i+1].low && 
          data[i].low < data[i+2].low) {
        points.push({
          id: `sl_${i}`,
          time: data[i].time,
          price: data[i].low,
          type: 'swing_low',
          broken: false
        })
      }
    }
    
    return points
  }
  
  // Detect Market Structure Shift (MSS)
  private detectMSS(swingPoints: SwingPoint[]): boolean {
    if (swingPoints.length < 4) return false
    
    const highs = swingPoints.filter(sp => sp.type === 'swing_high')
    const lows = swingPoints.filter(sp => sp.type === 'swing_low')
    
    if (highs.length >= 2 && lows.length >= 2) {
      const lastHigh = highs[highs.length - 1]
      const prevHigh = highs[highs.length - 2]
      const lastLow = lows[lows.length - 1]
      const prevLow = lows[lows.length - 2]
      
      // MSS Bullish: price breaks above last swing high
      // MSS Bearish: price breaks below last swing low
      const currentPrice = this.ohlcData[this.ohlcData.length - 1].close
      
      if (currentPrice > lastHigh.price && lastHigh.price > prevHigh.price) {
        return true
      }
      if (currentPrice < lastLow.price && lastLow.price < prevLow.price) {
        return true
      }
    }
    
    return false
  }
  
  // Detect Equal Highs (double top pattern)
  private detectEqualHighs(swingPoints: SwingPoint[]): boolean {
    const highs = swingPoints.filter(sp => sp.type === 'swing_high')
    if (highs.length < 2) return false
    
    const last = highs[highs.length - 1]
    const prev = highs[highs.length - 2]
    
    const tolerance = last.price * 0.0005 // 5 pip tolerance for EURUSD
    return Math.abs(last.price - prev.price) <= tolerance
  }
  
  // Detect Equal Lows (double bottom pattern)
  private detectEqualLows(swingPoints: SwingPoint[]): boolean {
    const lows = swingPoints.filter(sp => sp.type === 'swing_low')
    if (lows.length < 2) return false
    
    const last = lows[lows.length - 1]
    const prev = lows[lows.length - 2]
    
    const tolerance = last.price * 0.0005
    return Math.abs(last.price - prev.price) <= tolerance
  }
  
  // Detect Order Blocks
  detectOrderBlocks(): OrderBlock[] {
    const orderBlocks: OrderBlock[] = []
    
    if (this.ohlcData.length < 3) return orderBlocks
    
    for (let i = 1; i < this.ohlcData.length - 1; i++) {
      const curr = this.ohlcData[i]
      const prev = this.ohlcData[i - 1]
      const next = this.ohlcData[i + 1]
      
      // Bullish OB: candle with body near low, followed by bearish candle
      if (curr.close > curr.open && next.close < next.open) {
        // Strong bullish candle that was "absorbed"
        if (this.isAbsorbed(i, 'bullish')) {
          orderBlocks.push({
            id: `ob_bull_${i}`,
            time: curr.time,
            high: curr.high,
            low: curr.open,
            type: 'bullish',
            strength: this.calculateOBStrength(curr),
            touched: false,
            expired: false
          })
        }
      }
      
      // Bearish OB: candle with body near high, followed by bullish candle
      if (curr.close < curr.open && next.close > next.open) {
        if (this.isAbsorbed(i, 'bearish')) {
          orderBlocks.push({
            id: `ob_bear_${i}`,
            time: curr.time,
            high: curr.close,
            low: curr.low,
            type: 'bearish',
            strength: this.calculateOBStrength(curr),
            touched: false,
            expired: false
          })
        }
      }
    }
    
    return orderBlocks.slice(-10) // Keep last 10
  }
  
  // Check if a candle was absorbed by the next candle
  private isAbsorbed(index: number, type: 'bullish' | 'bearish'): boolean {
    if (index >= this.ohlcData.length - 1) return false
    
    const curr = this.ohlcData[index]
    const next = this.ohlcData[index + 1]
    
    if (type === 'bullish') {
      // Next candle should be bearish and engulf the bullish one
      return next.close < next.open && next.low < curr.low && next.high > curr.high
    } else {
      // Next candle should be bullish and engulf the bearish one
      return next.close > next.open && next.low < curr.low && next.high > curr.high
    }
  }
  
  // Calculate order block strength
  private calculateOBStrength(candle: OHLC): number {
    const bodySize = Math.abs(candle.close - candle.open)
    const range = candle.high - candle.low
    const bodyRatio = bodySize / (range || 1)
    
    // Stronger if it's a large candle (institutional)
    return Math.min(bodyRatio * 100, 100)
  }
  
  // Detect Fair Value Gaps (FVG)
  detectFVG(): FairValueGap[] {
    const fvgs: FairValueGap[] = []
    
    if (this.ohlcData.length < 3) return fvgs
    
    for (let i = 2; i < this.ohlcData.length; i++) {
      const candle1 = this.ohlcData[i - 2]
      const candle2 = this.ohlcData[i - 1]
      const candle3 = this.ohlcData[i]
      
      // Bullish FVG: gap between candle1 high and candle3 low
      if (candle3.low > candle1.high) {
        fvgs.push({
          id: `fvg_bull_${i}`,
          time: candle2.time,
          high: candle3.low,
          low: candle1.high,
          type: 'bullish',
          filled: this.checkFVGFill(i, 'bullish')
        })
      }
      
      // Bearish FVG: gap between candle3 high and candle1 low
      if (candle1.low > candle3.high) {
        fvgs.push({
          id: `fvg_bear_${i}`,
          time: candle2.time,
          high: candle1.low,
          low: candle3.high,
          type: 'bearish',
          filled: this.checkFVGFill(i, 'bearish')
        })
      }
    }
    
    return fvgs.slice(-15) // Keep last 15
  }
  
  // Check if FVG has been filled
  private checkFVGFill(index: number, type: 'bullish' | 'bearish'): boolean {
    for (let i = index; i < this.ohlcData.length; i++) {
      const candle = this.ohlcData[i]
      if (type === 'bullish') {
        if (candle.low <= this.ohlcData[index - 2]?.high) return true
      } else {
        if (candle.high >= this.ohlcData[index - 2]?.low) return true
      }
    }
    return false
  }
  
  // Detect Liquidity Pools (stop runs)
  detectLiquidityPools(): LiquidityPool[] {
    const pools: LiquidityPool[] = []
    const swingPoints = this.identifySwingPoints(this.ohlcData.slice(-50))
    
    // Find equal highs/lows (liquidity zones)
    for (let i = 0; i < swingPoints.length - 1; i++) {
      const sp = swingPoints[i]
      const tolerance = sp.price * 0.0002
      
      for (let j = i + 1; j < swingPoints.length; j++) {
        const nextSp = swingPoints[j]
        
        if (sp.type === 'swing_high' && nextSp.type === 'swing_high') {
          if (Math.abs(sp.price - nextSp.price) <= tolerance) {
            pools.push({
              id: `liq_buy_${i}`,
              price: sp.price,
              type: 'buy',
              time: sp.time,
              swept: this.checkLiquiditySweep(sp.price)
            })
          }
        }
        
        if (sp.type === 'swing_low' && nextSp.type === 'swing_low') {
          if (Math.abs(sp.price - nextSp.price) <= tolerance) {
            pools.push({
              id: `liq_sell_${i}`,
              price: sp.price,
              type: 'sell',
              time: sp.time,
              swept: this.checkLiquiditySweep(sp.price)
            })
          }
        }
      }
    }
    
    return pools.slice(-10)
  }
  
  // Check if liquidity was swept
  private checkLiquiditySweep(price: number): boolean {
    const recent = this.ohlcData.slice(-10)
    for (const candle of recent) {
      // Check for wick beyond the level
      if (candle.high > price * 1.0005 || candle.low < price * 0.9995) {
        return true
      }
    }
    return false
  }
  
  // Calculate Fibonacci levels from swing
  calculateFibonacciLevels(swingHigh: number, swingLow: number): FibonacciLevel[] {
    const diff = swingHigh - swingLow
    
    return this.fibLevels.map(level => ({
      level,
      price: swingLow + (diff * level),
      type: level <= 1 ? 'retracement' : 'extension'
    }))
  }
  
  // Calculate OTE (Optimal Trade Entry) retracements
  calculateOTE(): FibonacciLevel[] {
    if (this.ohlcData.length < 20) return []
    
    const swings = this.identifySwingPoints(this.ohlcData.slice(-50))
    const highs = swings.filter(sp => sp.type === 'swing_high')
    const lows = swings.filter(sp => sp.type === 'swing_low')
    
    if (highs.length < 2 || lows.length < 2) return []
    
    // Use the last major swing
    const lastHigh = highs[highs.length - 1]
    const lastLow = lows[lows.length - 1]
    
    if (lastHigh.price > lastLow.price) {
      // Bullish move up
      return this.calculateFibonacciLevels(lastHigh.price, lastLow.price)
    } else {
      // Bearish move down
      return this.calculateFibonacciLevels(lastLow.price, lastHigh.price)
    }
  }
  
  // Calculate daily mid-point (fairest price)
  calculateDailyMidpoint(): number | null {
    const today = new Date().setHours(0, 0, 0, 0)
    const todayCandles = this.ohlcData.filter(c => c.time * 1000 >= today)
    
    if (todayCandles.length === 0) return null
    
    const high = Math.max(...todayCandles.map(c => c.high))
    const low = Math.min(...todayCandles.map(c => c.low))
    
    return (high + low) / 2
  }
  
  // Determine premium/discount zone
  getPremiumDiscount(): 'premium' | 'discount' | 'mid' {
    const mid = this.calculateDailyMidpoint()
    if (!mid) return 'mid'
    
    const currentPrice = this.ohlcData[this.ohlcData.length - 1]?.close
    if (!currentPrice) return 'mid'
    
    const diff = currentPrice - mid
    const threshold = (this.ohlcData[this.ohlcData.length - 1]?.high - 
                      this.ohlcData[this.ohlcData.length - 1]?.low) * 0.3
    
    if (diff > threshold) return 'premium'
    if (diff < -threshold) return 'discount'
    return 'mid'
  }
  
  // Generate all patterns
  analyzeAllPatterns(): ICTPattern[] {
    const patterns: ICTPattern[] = []
    const ms = this.analyzeMarketStructure()
    
    if (ms.mss) {
      patterns.push({
        id: 'mss_bull',
        type: 'mss',
        direction: ms.bos === 'bullish' ? 'bullish' : 'bearish',
        confidence: 85,
        price: this.ohlcData[this.ohlcData.length - 1]?.close || 0,
        time: Date.now(),
        description: 'Market Structure Shift detected - trend change confirmed'
      })
    }
    
    const obs = this.detectOrderBlocks()
    obs.forEach(ob => {
      patterns.push({
        id: ob.id,
        type: 'order_block',
        direction: ob.type === 'bullish' ? 'bullish' : 'bearish',
        confidence: ob.strength,
        price: ob.type === 'bullish' ? ob.low : ob.high,
        time: ob.time,
        description: `${ob.type.charAt(0).toUpperCase() + ob.type.slice(1)} Order Block - ${ob.strength.toFixed(0)}% strength`
      })
    })
    
    const fvgs = this.detectFVG()
    fvgs.forEach(fvg => {
      patterns.push({
        id: fvg.id,
        type: 'fvf',
        direction: fvg.type === 'bullish' ? 'bullish' : 'bearish',
        confidence: fvg.filled ? 30 : 80,
        price: fvg.type === 'bullish' ? fvg.low : fvg.high,
        time: fvg.time,
        description: `Fair Value Gap - ${fvg.filled ? 'FILLED' : 'ACTIVE'}`
      })
    })
    
    return patterns
  }
}

export const ictEngine = new ICTTradingEngine()
