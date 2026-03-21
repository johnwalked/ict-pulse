/**
 * ICT Pulse Trading Engine
 * Implements ICT methodology for automated trading
 */

export class TradingEngine {
  constructor() {
    this.adapter = null
    this.subscriptions = new Map()
    this.ohlcCache = new Map()
    this.positions = []
    this.orders = []
    this.account = {
      balance: 10000,
      equity: 10000,
      margin: 0,
      freeMargin: 10000,
      profit: 0
    }
    this.autoTraderEnabled = false
    this.tradingMode = 'demo'
    this.riskPerTrade = 1
  }

  setAdapter(adapter) {
    this.adapter = adapter
    adapter.on('ohlc', (data) => this.handleOHLC(data))
    adapter.on('tick', (data) => this.handleTick(data))
    adapter.on('position', (data) => this.handlePosition(data))
  }

  subscribe(symbol, timeframe) {
    const key = `${symbol}_${timeframe}`
    this.subscriptions.set(key, { symbol, timeframe })
    if (this.adapter) this.adapter.getOHLC(symbol, timeframe)
  }

  unsubscribe(symbol, timeframe) {
    this.subscriptions.delete(`${symbol}_${timeframe}`)
  }

  getAvailableSymbols() {
    return [
      { symbol: 'EURUSD', name: 'Euro/US Dollar', type: 'forex', spread: 0.1 },
      { symbol: 'GBPUSD', name: 'British Pound/US Dollar', type: 'forex', spread: 0.2 },
      { symbol: 'USDJPY', name: 'US Dollar/Japanese Yen', type: 'forex', spread: 0.1 },
      { symbol: 'AUDUSD', name: 'Australian Dollar/US Dollar', type: 'forex', spread: 0.2 },
      { symbol: 'USDCAD', name: 'US Dollar/Canadian Dollar', type: 'forex', spread: 0.3 },
      { symbol: 'XAUUSD', name: 'Gold/US Dollar', type: 'commodity', spread: 0.3 },
      { symbol: 'XAGUSD', name: 'Silver/US Dollar', type: 'commodity', spread: 0.5 },
      { symbol: 'US100', name: 'US Tech 100', type: 'index', spread: 0.1 },
      { symbol: 'BTCUSD', name: 'Bitcoin/US Dollar', type: 'crypto', spread: 1.0 },
      { symbol: 'ETHUSD', name: 'Ethereum/US Dollar', type: 'crypto', spread: 0.5 }
    ]
  }

  getOHLC(symbol, timeframe) {
    return this.ohlcCache.get(`${symbol}_${timeframe}`) || []
  }

  handleOHLC(data) {
    const key = `${data.symbol}_${data.timeframe}`
    const existing = this.ohlcCache.get(key) || []
    existing.push(data)
    if (existing.length > 500) existing.shift()
    this.ohlcCache.set(key, existing)
    if (this.autoTraderEnabled) {
      this.runICTAnalysis(data.symbol, data.timeframe)
    }
  }

  handleTick(data) {
    if (this.autoTraderEnabled) this.checkAutoTrade(data)
  }

  handlePosition(data) {
    this.positions = data
  }

  getPositions() { return this.positions }
  
  getAccountInfo() {
    return { ...this.account, autoTrader: this.autoTraderEnabled, mode: this.tradingMode }
  }

  async executeOrder(orderParams) {
    if (!this.adapter) throw new Error('No trading adapter connected')
    const order = {
      symbol: orderParams.symbol,
      volume: orderParams.volume || this.calculateLotSize(orderParams),
      type: orderParams.type || 'MARKET',
      side: orderParams.side,
      price: orderParams.price,
      sl: orderParams.stopLoss,
      tp: orderParams.takeProfit,
      comment: orderParams.comment || 'ICT Pulse'
    }
    const result = await this.adapter.placeOrder(order)
    this.orders.push({ ticket: result.ticket, ...order, time: Date.now(), status: 'pending' })
    return result
  }

  calculateLotSize(orderParams) {
    const accountBalance = this.account.balance || 10000
    const riskAmount = (accountBalance * this.riskPerTrade) / 100
    const stopLossPips = Math.abs((orderParams.sl - orderParams.price) * 10000) || 10
    return Math.max(0.01, Math.min(riskAmount / (stopLossPips * 10), 1.0))
  }

  async cancelOrder(ticket) {
    if (!this.adapter) throw new Error('No adapter')
    return this.adapter.cancelOrder(ticket)
  }

  runICTAnalysis(symbol, timeframe) {
    const ohlc = this.getOHLC(symbol, timeframe)
    if (ohlc.length < 50) return
    const structure = this.detectMarketStructure(ohlc)
    const orderBlocks = this.findOrderBlocks(ohlc)
    const fvg = this.findFairValueGaps(ohlc)
    const session = this.getCurrentSession()
    if (structure.bullishBreak && session.active) {
      this.generateSignal('BUY', { symbol, structure, orderBlocks, fvg })
    } else if (structure.bearishBreak && session.active) {
      this.generateSignal('SELL', { symbol, structure, orderBlocks, fvg })
    }
  }

  detectMarketStructure(ohlc) {
    const highs = [], lows = []
    for (let i = 2; i < ohlc.length - 2; i++) {
      if (ohlc[i].high > ohlc[i-1].high && ohlc[i].high > ohlc[i-2].high &&
          ohlc[i].high > ohlc[i+1].high && ohlc[i].high > ohlc[i+2].high) {
        highs.push({ index: i, price: ohlc[i].high })
      }
      if (ohlc[i].low < ohlc[i-1].low && ohlc[i].low < ohlc[i-2].low &&
          ohlc[i].low < ohlc[i+1].low && ohlc[i].low < ohlc[i+2].low) {
        lows.push({ index: i, price: ohlc[i].low })
      }
    }
    const lastHigh = highs[highs.length - 1], prevHigh = highs[highs.length - 2]
    const lastLow = lows[lows.length - 1], prevLow = lows[lows.length - 2]
    return {
      highs, lows,
      bullishBreak: lastHigh && prevHigh && lastHigh.price > prevHigh.price * 1.001,
      bearishBreak: lastLow && prevLow && lastLow.price < prevLow.price * 0.999,
      trend: lastHigh && lastLow ? (lastHigh.index > lastLow.index ? 'bullish' : 'bearish') : 'neutral'
    }
  }

  findOrderBlocks(ohlc) {
    const orderBlocks = []
    for (let i = 1; i < ohlc.length - 1; i++) {
      if (ohlc[i].close < ohlc[i].open && ohlc[i+1].close > ohlc[i+1].open * 1.002) {
        orderBlocks.push({ type: 'bullish', high: ohlc[i].high, low: ohlc[i].low, index: i })
      }
      if (ohlc[i].close > ohlc[i].open && ohlc[i+1].close < ohlc[i+1].open * 0.998) {
        orderBlocks.push({ type: 'bearish', high: ohlc[i].high, low: ohlc[i].low, index: i })
      }
    }
    return orderBlocks.slice(-10)
  }

  findFairValueGaps(ohlc) {
    const gaps = []
    for (let i = 1; i < ohlc.length - 1; i++) {
      if (ohlc[i+1].low > ohlc[i].high + 0.0001) {
        gaps.push({ type: 'bullish', top: ohlc[i+1].low, bottom: ohlc[i].high, index: i, filled: false })
      }
      if (ohlc[i+1].high < ohlc[i].low - 0.0001) {
        gaps.push({ type: 'bearish', top: ohlc[i].low, bottom: ohlc[i+1].high, index: i, filled: false })
      }
    }
    return gaps.slice(-10)
  }

  checkAutoTrade(tick) {
    if (!this.autoTraderEnabled) return
    const ohlc = this.getOHLC(tick.symbol, 'M5')
    if (ohlc.length < 20) return
    const structure = this.detectMarketStructure(ohlc)
    if (this.tradingMode === 'hft') {
      this.scalpStrategy(tick, structure)
    } else if (this.tradingMode === 'swing') {
      this.swingStrategy(tick, structure)
    }
  }

  scalpStrategy(tick, structure) {
    const pipSize = tick.pipSize || 0.0001
    if (structure.bullishBreak && structure.trend === 'bullish') {
      this.executeOrder({
        symbol: tick.symbol, side: 'BUY', volume: 0.1,
        stopLoss: tick.bid - 10 * pipSize, takeProfit: tick.bid + 15 * pipSize,
        comment: 'ICT Scalp - Bullish BOS'
      })
    }
    if (structure.bearishBreak && structure.trend === 'bearish') {
      this.executeOrder({
        symbol: tick.symbol, side: 'SELL', volume: 0.1,
        stopLoss: tick.ask + 10 * pipSize, takeProfit: tick.ask - 15 * pipSize,
        comment: 'ICT Scalp - Bearish BOS'
      })
    }
  }

  swingStrategy(tick, structure) {
    const pipSize = tick.pipSize || 0.0001
    if (structure.bullishBreak) {
      this.executeOrder({
        symbol: tick.symbol, side: 'BUY', volume: 0.2,
        stopLoss: tick.bid - 30 * pipSize, takeProfit: tick.bid + 100 * pipSize,
        comment: 'ICT Swing - Bullish BOS'
      })
    }
    if (structure.bearishBreak) {
      this.executeOrder({
        symbol: tick.symbol, side: 'SELL', volume: 0.2,
        stopLoss: tick.ask + 30 * pipSize, takeProfit: tick.ask - 100 * pipSize,
        comment: 'ICT Swing - Bearish BOS'
      })
    }
  }

  generateSignal(side, context) {
    return {
      type: 'signal', side, symbol: context.symbol, timestamp: Date.now(),
      confidence: this.calculateConfidence(context),
      entry: context.structure.lastPrice,
      reasoning: this.buildReasoning(side, context)
    }
  }

  calculateConfidence(context) {
    let c = 50
    if (context.structure.trend !== 'neutral') c += 20
    if (context.orderBlocks?.length > 0) c += 15
    if (context.fvg?.length > 0) c += 15
    return Math.min(c, 95)
  }

  buildReasoning(side, context) {
    const reasons = []
    if (context.structure.trend === 'bullish' && side === 'BUY') reasons.push('Bullish structure confirmed')
    if (context.structure.trend === 'bearish' && side === 'SELL') reasons.push('Bearish structure confirmed')
    if (context.orderBlocks?.some(ob => ob.type === 'bullish' && side === 'BUY')) reasons.push('Bullish OB present')
    if (context.fvg?.some(f => f.type === 'bullish' && side === 'BUY')) reasons.push('Bullish FVG present')
    return reasons.join(' • ') || 'ICT methodology signal'
  }

  getCurrentSession() {
    const now = new Date()
    const gmt = new Date(now.toLocaleString('en-US', { timeZone: 'GMT' }))
    const hour = gmt.getHours()
    const day = gmt.getDay()
    if (day === 0 || day === 6) return { name: 'Weekend', active: false }
    if (hour >= 7 && hour < 10) return { name: 'London Kill Zone', active: true, type: 'bullish' }
    if (hour >= 12 && hour < 15) return { name: 'NY AM Kill Zone', active: true, type: 'mixed' }
    if (hour >= 17 && hour < 20) return { name: 'NY PM Kill Zone', active: true, type: 'bearish' }
    if (hour >= 0 && hour < 3) return { name: 'Asia Session', active: true, type: 'mixed' }
    return { name: 'Off Hours', active: false }
  }

  getSessionTimes() {
    return [
      { name: 'London Kill Zone', start: '07:00', end: '10:00', tz: 'GMT', color: '#f59e0b' },
      { name: 'NY AM Kill Zone', start: '12:00', end: '15:00', tz: 'GMT', color: '#3b82f6' },
      { name: 'NY PM Kill Zone', start: '17:00', end: '20:00', tz: 'GMT', color: '#a855f7' },
      { name: 'Asia Session', start: '00:00', end: '03:00', tz: 'GMT', color: '#10b981' }
    ]
  }

  getEconomicCalendar() {
    return [
      { time: '08:30', currency: 'USD', event: 'Retail Sales', impact: 'high', forecast: '0.4%', previous: '0.3%' },
      { time: '10:00', currency: 'USD', event: 'ISM Manufacturing PMI', impact: 'high', forecast: '48.5', previous: '47.8' },
      { time: '14:00', currency: 'USD', event: 'FOMC Minutes', impact: 'high', forecast: '-', previous: '-' },
      { time: '08:00', currency: 'EUR', event: 'German CPI', impact: 'medium', forecast: '2.1%', previous: '2.0%' }
    ]
  }
}
