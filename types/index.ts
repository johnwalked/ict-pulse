// ICT Trading Types & Interfaces

export interface OHLC {
  time: number
  open: number
  high: number
  low: number
  close: number
  volume: number
}

export interface OrderBlock {
  id: string
  time: number
  high: number
  low: number
  type: 'bullish' | 'bearish'
  strength: number
  touched: boolean
  expired: boolean
}

export interface FairValueGap {
  id: string
  time: number
  high: number
  low: number
  type: 'bullish' | 'bearish'
  filled: boolean
}

export interface LiquidityPool {
  id: string
  price: number
  type: 'buy' | 'sell'
  time: number
  swept: boolean
}

export interface SwingPoint {
  id: string
  time: number
  price: number
  type: 'swing_high' | 'swing_low'
  broken: boolean
}

export interface KillZone {
  name: 'london' | 'ny_am' | 'ny_pm' | 'asia'
  startHour: number
  endHour: number
  timezone: string
  active: boolean
}

export interface TradeSession {
  name: string
  openHour: number
  closeHour: number
  timezone: string
  killZoneStart: number
  killZoneEnd: number
}

export interface ICTPattern {
  id: string
  type: 'mss' | 'bos' | 'obos' | 'fvf' | 'order_block' | 'liquidity' | 'ote'
  direction: 'bullish' | 'bearish'
  confidence: number
  price: number
  time: number
  description: string
}

export interface Position {
  id: string
  symbol: string
  type: 'buy' | 'sell'
  entryPrice: number
  currentPrice: number
  stopLoss: number
  takeProfit: number
  lotSize: number
  openTime: number
  pnl: number
  pnlPercent: number
  oteLevel?: number
  entryType: 'kill_zone' | 'silver_bullet' | 'ote' | 'fvg' | 'order_block'
}

export interface Trade {
  id: string
  symbol: string
  type: 'buy' | 'sell'
  entryPrice: number
  exitPrice: number
  lotSize: number
  openTime: number
  closeTime: number
  pnl: number
  pnlPercent: number
  outcome: 'win' | 'loss' | 'breakeven'
  model: string
  session: string
  notes: string
}

export interface TradingSignal {
  id: string
  symbol: string
  type: 'buy' | 'sell'
  entry: number
  stopLoss: number
  takeProfit: number
  confidence: number
  model: string
  killZone: string
  timestamp: number
  triggered: boolean
  expired: boolean
}

export interface FibonacciLevel {
  level: number
  price: number
  type: 'retracement' | 'extension'
}

export interface MarketStructure {
  trend: 'bullish' | 'bearish' | 'neutral'
  bos: 'bullish' | 'bearish' | null
  mss: boolean
  equalHighs: boolean
  equalLows: boolean
}

export interface SessionInfo {
  name: string
  isActive: boolean
  isKillZone: boolean
  timeUntilStart: string
  timeUntilKillZone: string
  progress: number
}

export interface DailyBias {
  bias: 'bullish' | 'bearish' | 'neutral'
  premium: 'premium' | 'discount' | 'mid'
  reason: string
  confidence: number
}
