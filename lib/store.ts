import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { 
  OHLC, OrderBlock, FairValueGap, LiquidityPool, 
  SwingPoint, Position, Trade, TradingSignal, 
  MarketStructure, SessionInfo, DailyBias, FibonacciLevel,
  KillZone, TradeSession
} from '@/types'

interface ConnectionState {
  mt5Connected: boolean
  wsConnected: boolean
  lastUpdate: number
  connect: () => void
  disconnect: () => void
}

interface TradingState {
  symbol: string
  timeframe: string
  tradingMode: 'swing' | 'scalp' | 'hft'
  positions: Position[]
  trades: Trade[]
  signals: TradingSignal[]
  
  setSymbol: (symbol: string) => void
  setTimeframe: (tf: string) => void
  setTradingMode: (mode: 'swing' | 'scalp' | 'hft') => void
  addPosition: (pos: Position) => void
  closePosition: (id: string) => void
  updatePosition: (id: string, updates: Partial<Position>) => void
}

interface ChartState {
  ohlcData: OHLC[]
  orderBlocks: OrderBlock[]
  fairValueGaps: FairValueGap[]
  liquidityPools: LiquidityPool[]
  swingPoints: SwingPoint[]
  fibLevels: FibonacciLevel[]
  marketStructure: MarketStructure
  
  setOHLCData: (data: OHLC[]) => void
  addOHLC: (candle: OHLC) => void
  updateLastCandle: (candle: Partial<OHLC>) => void
  addOrderBlock: (ob: OrderBlock) => void
  addFVG: (fvg: FairValueGap) => void
  addLiquidityPool: (pool: LiquidityPool) => void
  addSwingPoint: (sp: SwingPoint) => void
  setFibLevels: (levels: FibonacciLevel[]) => void
  setMarketStructure: (ms: MarketStructure) => void
  clearExpiredPatterns: () => void
}

interface SessionState {
  currentSession: SessionInfo
  nextSessions: SessionInfo[]
  dailyBias: DailyBias
  premiumDiscount: 'premium' | 'discount' | 'mid'
  
  setSessionInfo: (session: SessionInfo) => void
  setNextSessions: (sessions: SessionInfo[]) => void
  setDailyBias: (bias: DailyBias) => void
  setPremiumDiscount: (pd: 'premium' | 'discount' | 'mid') => void
}

interface AIState {
  messages: Array<{role: 'user' | 'assistant'; content: string; timestamp: number}>
  isProcessing: boolean
  
  addMessage: (role: 'user' | 'assistant', content: string) => void
  setProcessing: (status: boolean) => void
  clearMessages: () => void
}

export const useConnectionStore = create<ConnectionState>((set) => ({
  mt5Connected: false,
  wsConnected: false,
  lastUpdate: 0,
  connect: () => set({ mt5Connected: true, wsConnected: true, lastUpdate: Date.now() }),
  disconnect: () => set({ mt5Connected: false, wsConnected: false }),
}))

export const useTradingStore = create<TradingState>((set) => ({
  symbol: 'EURUSD',
  timeframe: '1H',
  tradingMode: 'swing',
  positions: [],
  trades: [],
  signals: [],
  
  setSymbol: (symbol) => set({ symbol }),
  setTimeframe: (timeframe) => set({ timeframe }),
  setTradingMode: (tradingMode) => set({ tradingMode }),
  addPosition: (pos) => set((state) => ({ positions: [...state.positions, pos] })),
  closePosition: (id) => set((state) => ({ 
    positions: state.positions.filter(p => p.id !== id) 
  })),
  updatePosition: (id, updates) => set((state) => ({
    positions: state.positions.map(p => p.id === id ? {...p, ...updates} : p)
  })),
}))

export const useChartStore = create<ChartState>((set) => ({
  ohlcData: [],
  orderBlocks: [],
  fairValueGaps: [],
  liquidityPools: [],
  swingPoints: [],
  fibLevels: [],
  marketStructure: { trend: 'neutral', bos: null, mss: false, equalHighs: false, equalLows: false },
  
  setOHLCData: (ohlcData) => set({ ohlcData }),
  addOHLC: (candle) => set((state) => ({ 
    ohlcData: [...state.ohlcData, candle] 
  })),
  updateLastCandle: (candle) => set((state) => {
    const newData = [...state.ohlcData]
    if (newData.length > 0) {
      newData[newData.length - 1] = { ...newData[newData.length - 1], ...candle }
    }
    return { ohlcData: newData }
  }),
  addOrderBlock: (ob) => set((state) => ({ orderBlocks: [...state.orderBlocks, ob] })),
  addFVG: (fvg) => set((state) => ({ fairValueGaps: [...state.fairValueGaps, fvg] })),
  addLiquidityPool: (pool) => set((state) => ({ liquidityPools: [...state.liquidityPools, pool] })),
  addSwingPoint: (sp) => set((state) => ({ swingPoints: [...state.swingPoints, sp] })),
  setFibLevels: (fibLevels) => set({ fibLevels }),
  setMarketStructure: (marketStructure) => set({ marketStructure }),
  clearExpiredPatterns: () => set((state) => ({
    orderBlocks: state.orderBlocks.filter(ob => !ob.expired),
    fairValueGaps: state.fairValueGaps.filter(fvg => !fvg.filled),
    liquidityPools: state.liquidityPools.filter(lp => !lp.swept),
  })),
}))

export const useSessionStore = create<SessionState>((set) => ({
  currentSession: {
    name: 'New York',
    isActive: true,
    isKillZone: true,
    timeUntilStart: '00:00',
    timeUntilKillZone: '00:00',
    progress: 65,
  },
  nextSessions: [],
  dailyBias: { bias: 'neutral', premium: 'mid', reason: 'Awaiting market structure confirmation', confidence: 0 },
  premiumDiscount: 'mid',
  
  setSessionInfo: (currentSession) => set({ currentSession }),
  setNextSessions: (nextSessions) => set({ nextSessions }),
  setDailyBias: (dailyBias) => set({ dailyBias }),
  setPremiumDiscount: (premiumDiscount) => set({ premiumDiscount }),
}))

export const useAIStore = create<AIState>((set) => ({
  messages: [],
  isProcessing: false,
  
  addMessage: (role, content) => set((state) => ({
    messages: [...state.messages, { role, content, timestamp: Date.now() }]
  })),
  setProcessing: (isProcessing) => set({ isProcessing }),
  clearMessages: () => set({ messages: [] }),
}))

// ICT Trading Sessions Configuration
export const ICT_SESSIONS: TradeSession[] = [
  { name: 'Sydney', openHour: 22, closeHour: 7, timezone: 'GMT', killZoneStart: 22, killZoneEnd: 1 },
  { name: 'Tokyo', openHour: 0, closeHour: 9, timezone: 'GMT', killZoneStart: 0, killZoneEnd: 3 },
  { name: 'London', openHour: 7, closeHour: 16, timezone: 'GMT', killZoneStart: 7, killZoneEnd: 10 },
  { name: 'New York AM', openHour: 8, closeHour: 12, timezone: 'EST', killZoneStart: 8, killZoneEnd: 11 },
  { name: 'New York PM', openHour: 13, closeHour: 17, timezone: 'EST', killZoneStart: 13, killZoneEnd: 16 },
]

// Kill Zones
export const ICT_KILL_ZONES: KillZone[] = [
  { name: 'london', startHour: 7, endHour: 10, timezone: 'GMT', active: false },
  { name: 'ny_am', startHour: 8, endHour: 11, timezone: 'EST', active: false },
  { name: 'ny_pm', startHour: 13, endHour: 16, timezone: 'EST', active: false },
  { name: 'asia', startHour: 0, endHour: 3, timezone: 'GMT', active: false },
]
