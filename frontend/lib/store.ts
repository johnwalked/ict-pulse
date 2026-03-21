import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface OHLCData {
  time: number
  open: number
  high: number
  low: number
  close: number
  volume?: number
}

export interface OrderFlowData {
  time: number
  price: number
  bidVolume: number
  askVolume: number
  delta: number
  cumulativeDelta: number
}

export interface Trade {
  id: string
  symbol: string
  type: 'buy' | 'sell'
  entryPrice: number
  currentPrice: number
  volume: number
  pnl: number
  pnlPercent: number
  sl: number
  tp: number
  timeframe: string
  openTime: number
}

export interface Signal {
  id: string
  type: string
  symbol: string
  timeframe: string
  direction: 'bullish' | 'bearish'
  entryPrice: number
  sl: number
  tp: number
  strength: number
  timestamp: number
  description: string
}

interface ConnectionState {
  status: 'connected' | 'connecting' | 'disconnected'
  lastPing: number | null
  latency: number | null
  setStatus: (status: 'connected' | 'connecting' | 'disconnected') => void
  setLastPing: (time: number) => void
  setLatency: (ms: number) => void
}

export const useConnectionStore = create<ConnectionState>((set) => ({
  status: 'disconnected',
  lastPing: null,
  latency: null,
  setStatus: (status) => set({ status }),
  setLastPing: (time) => set({ lastPing: time }),
  setLatency: (ms) => set({ latency: ms }),
}))

interface TradingState {
  symbol: string
  timeframe: string
  tradingMode: 'swing' | 'scalp' | 'hft'
  wsUrl: string
  demoMode: boolean
  ohlcData: OHLCData[]
  orderFlowData: OrderFlowData[]
  positions: Trade[]
  signals: Signal[]
  equity: number
  balance: number
  setSymbol: (symbol: string) => void
  setTimeframe: (timeframe: string) => void
  setTradingMode: (mode: 'swing' | 'scalp' | 'hft') => void
  setWsUrl: (url: string) => void
  setDemoMode: (demo: boolean) => void
  setOhlcData: (data: OHLCData[]) => void
  addOhlcData: (candle: OHLCData) => void
  setOrderFlowData: (data: OrderFlowData[]) => void
  addPosition: (trade: Trade) => void
  removePosition: (id: string) => void
  updatePosition: (id: string, updates: Partial<Trade>) => void
  addSignal: (signal: Signal) => void
  removeSignal: (id: string) => void
  setEquity: (equity: number) => void
  setBalance: (balance: number) => void
}

export const useTradingStore = create<TradingState>((set) => ({
  symbol: 'EURUSD',
  timeframe: '1H',
  tradingMode: 'swing',
  wsUrl: 'ws://localhost:8080',
  demoMode: true,
  ohlcData: [],
  orderFlowData: [],
  positions: [],
  signals: [],
  equity: 25420.50,
  balance: 25000.00,
  setSymbol: (symbol) => set({ symbol }),
  setTimeframe: (timeframe) => set({ timeframe }),
  setTradingMode: (mode) => set({ tradingMode: mode }),
  setWsUrl: (url) => set({ wsUrl: url }),
  setDemoMode: (demo) => set({ demoMode: demo }),
  setOhlcData: (data) => set({ ohlcData: data }),
  addOhlcData: (candle) => set((state) => ({
    ohlcData: [...state.ohlcData.slice(-500), candle]
  })),
  setOrderFlowData: (data) => set({ orderFlowData: data }),
  addPosition: (trade) => set((state) => ({ positions: [...state.positions, trade] })),
  removePosition: (id) => set((state) => ({ positions: state.positions.filter(p => p.id !== id) })),
  updatePosition: (id, updates) => set((state) => ({
    positions: state.positions.map(p => p.id === id ? { ...p, ...updates } : p)
  })),
  addSignal: (signal) => set((state) => ({ signals: [...state.signals, signal] })),
  removeSignal: (id) => set((state) => ({ signals: state.signals.filter(s => s.id !== id) })),
  setEquity: (equity) => set({ equity }),
  setBalance: (balance) => set({ balance }),
}))

interface AIChatState {
  messages: Array<{ id: string; role: 'user' | 'assistant'; content: string; timestamp: number }>
  isProcessing: boolean
  addMessage: (role: 'user' | 'assistant', content: string) => void
  setProcessing: (processing: boolean) => void
  clearMessages: () => void
}

export const useAIChatStore = create<AIChatState>((set) => ({
  messages: [],
  isProcessing: false,
  addMessage: (role, content) => set((state) => ({
    messages: [...state.messages, { id: Date.now().toString(), role, content, timestamp: Date.now() }]
  })),
  setProcessing: (isProcessing) => set({ isProcessing }),
  clearMessages: () => set({ messages: [] }),
}))
