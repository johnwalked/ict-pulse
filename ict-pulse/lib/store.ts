import { create } from 'zustand'

export interface OHLC { time: number; open: number; high: number; low: number; close: number; volume?: number }
export interface OrderBlock { id: string; type: 'bullish' | 'bearish'; high: number; low: number; startTime: number; strength: number; filled: boolean }
export interface FairValueGap { id: string; type: 'bullish' | 'bearish'; high: number; low: number; createdAt: number; filled: boolean }
export interface LiquidityPool { id: string; type: 'buy' | 'sell'; price: number; size: number; grabbed: boolean }
export interface Trade { id: string; symbol: string; type: 'buy' | 'sell'; volume: number; entryPrice: number; currentPrice: number; pnl: number; openTime: number }
export interface KillZone { name: string; shortName: string; startHour: number; endHour: number; active: boolean; progress: number }
export type TradingMode = 'swing' | 'scalp' | 'hft'
export type BiasDirection = 'bullish' | 'bearish' | 'neutral'
export type PremiumZone = 'premium' | 'mid' | 'discount'

interface AppState {
  connected: boolean; setConnected: (v: boolean) => void
  symbol: string; timeframe: string; setSymbol: (s: string) => void; setTimeframe: (t: string) => void
  tradingMode: TradingMode; setTradingMode: (m: TradingMode) => void
  ohlcData: OHLC[]; setOHLCData: (data: OHLC[]) => void
  currentPrice: number; priceChange: number; priceChangePercent: number
  setCurrentPrice: (price: number, change: number, changePercent: number) => void
  bias: BiasDirection; premiumZone: PremiumZone; setBias: (b: BiasDirection, zone: PremiumZone) => void
  killZones: KillZone[]; setKillZones: (zones: KillZone[]) => void
  orderBlocks: OrderBlock[]; setOrderBlocks: (blocks: OrderBlock[]) => void
  fairValueGaps: FairValueGap[]; setFairValueGaps: (gaps: FairValueGap[]) => void
  liquidityPools: LiquidityPool[]; setLiquidityPools: (pools: LiquidityPool[]) => void
  positions: Trade[]; setPositions: (trades: Trade[]) => void
  equity: number; todayPnl: number; winRate: number
}

function generateDemoData(count: number): OHLC[] {
  const data: OHLC[] = []
  let basePrice = 1.0850
  const now = Math.floor(Date.now() / 1000)
  for (let i = count; i >= 0; i--) {
    const time = now - (i * 3600)
    const volatility = 0.0005 + Math.random() * 0.001
    const trend = Math.sin(i / 20) * 0.0002
    const open = basePrice
    const close = open + (Math.random() - 0.5) * volatility + trend
    const high = Math.max(open, close) + Math.random() * volatility * 0.5
    const low = Math.min(open, close) - Math.random() * volatility * 0.5
    data.push({ time, open, high, low, close, volume: Math.floor(Math.random() * 10000) + 1000 })
    basePrice = close
  }
  return data
}

function generateKillZones(): KillZone[] {
  const hour = new Date().getUTCHours()
  return [
    { name: 'London Kill Zone', shortName: 'LNZ', startHour: 7, endHour: 10, active: hour >= 7 && hour < 10, progress: hour >= 7 && hour < 10 ? ((hour - 7) / 3) * 100 : 0 },
    { name: 'NY AM Kill Zone', shortName: 'NYAM', startHour: 12, endHour: 15, active: hour >= 12 && hour < 15, progress: hour >= 12 && hour < 15 ? ((hour - 12) / 3) * 100 : 0 },
    { name: 'NY PM Kill Zone', shortName: 'NYPM', startHour: 17, endHour: 20, active: hour >= 17 && hour < 20, progress: hour >= 17 && hour < 20 ? ((hour - 17) / 3) * 100 : 0 },
    { name: 'Asia Kill Zone', shortName: 'ASIA', startHour: 0, endHour: 3, active: hour >= 0 && hour < 3, progress: hour >= 0 && hour < 3 ? ((hour) / 3) * 100 : 0 },
  ]
}

export const useStore = create<AppState>((set) => ({
  connected: false,
  setConnected: (v) => set({ connected: v }),
  symbol: 'EUR/USD',
  timeframe: 'H1',
  setSymbol: (s) => set({ symbol: s }),
  setTimeframe: (t) => set({ timeframe: t }),
  tradingMode: 'swing',
  setTradingMode: (m) => set({ tradingMode: m }),
  ohlcData: generateDemoData(100),
  setOHLCData: (data) => set({ ohlcData: data }),
  currentPrice: 1.0852,
  priceChange: 0.0025,
  priceChangePercent: 0.23,
  setCurrentPrice: (price, change, changePercent) => set({ currentPrice: price, priceChange: change, priceChangePercent: changePercent }),
  bias: 'bullish',
  premiumZone: 'premium',
  setBias: (b, zone) => set({ bias: b, premiumZone: zone }),
  killZones: generateKillZones(),
  setKillZones: (zones) => set({ killZones: zones }),
  orderBlocks: [
    { id: 'ob-1', type: 'bullish', high: 1.0820, low: 1.0815, startTime: Date.now() - 86400000, strength: 85, filled: false },
    { id: 'ob-2', type: 'bearish', high: 1.0890, low: 1.0885, startTime: Date.now() - 172800000, strength: 72, filled: true },
    { id: 'ob-3', type: 'bullish', high: 1.0780, low: 1.0775, startTime: Date.now() - 259200000, strength: 90, filled: false },
  ],
  setOrderBlocks: (blocks) => set({ orderBlocks: blocks }),
  fairValueGaps: [
    { id: 'fvg-1', type: 'bullish', high: 1.0865, low: 1.0860, createdAt: Date.now() - 3600000, filled: false },
    { id: 'fvg-2', type: 'bearish', high: 1.0835, low: 1.0830, createdAt: Date.now() - 7200000, filled: true },
  ],
  setFairValueGaps: (gaps) => set({ fairValueGaps: gaps }),
  liquidityPools: [
    { id: 'lp-1', type: 'buy', price: 1.0910, size: 2500000, grabbed: false },
    { id: 'lp-2', type: 'sell', price: 1.0750, size: 1800000, grabbed: true },
  ],
  setLiquidityPools: (pools) => set({ liquidityPools: pools }),
  positions: [
    { id: 't-1', symbol: 'EUR/USD', type: 'buy', volume: 0.5, entryPrice: 1.0830, currentPrice: 1.0852, pnl: 110, openTime: Date.now() - 7200000 },
    { id: 't-2', symbol: 'GBP/USD', type: 'sell', volume: 0.3, entryPrice: 1.2720, currentPrice: 1.2695, pnl: 75, openTime: Date.now() - 3600000 },
  ],
  setPositions: (trades) => set({ positions: trades }),
  equity: 24847.00,
  todayPnl: 185.50,
  winRate: 67,
}))
