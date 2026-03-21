'use client'

import { useState, useEffect } from 'react'
import { Zap, Wifi, WifiOff, TrendingUp, TrendingDown, Activity, Wallet, Target, Power } from 'lucide-react'

type Platform = 'ctrader' | 'ninjatrader' | null
type TradingMode = 'demo' | 'swing' | 'scalp' | 'hft'

export default function Dashboard() {
  const [platform, setPlatform] = useState<Platform>(null)
  const [connected, setConnected] = useState(false)
  const [mode, setMode] = useState<TradingMode>('demo')
  const [autoTrader, setAutoTrader] = useState(false)
  const [symbol, setSymbol] = useState('EURUSD')
  const [time, setTime] = useState(new Date())

  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(t)
  }, [])

  const getSession = () => {
    const h = time.getUTCHours()
    if (h >= 7 && h < 10) return { name: 'London Kill Zone', color: '#f59e0b', active: true }
    if (h >= 12 && h < 15) return { name: 'NY AM Kill Zone', color: '#3b82f6', active: true }
    if (h >= 17 && h < 20) return { name: 'NY PM Kill Zone', color: '#a855f7', active: true }
    if (h >= 0 && h < 3) return { name: 'Asia Session', color: '#10b981', active: true }
    return { name: 'Off Hours', color: '#6b7280', active: false }
  }

  const session = getSession()
  const symbols = ['EURUSD', 'GBPUSD', 'USDJPY', 'AUDUSD', 'USDCAD', 'XAUUSD', 'XAGUSD', 'BTCUSD', 'ETHUSD']

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <header className="sticky top-0 z-50 bg-slate-900/95 backdrop-blur border-b border-slate-800">
        <div className="px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">ICT Pulse</h1>
              <p className="text-[10px] text-slate-500">Live Trading Dashboard</p>
            </div>
          </div>
          <select value={symbol} onChange={(e) => setSymbol(e.target.value)} className="bg-slate-800 text-cyan-400 px-3 py-1.5 rounded-lg text-sm font-semibold">
            {symbols.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
          <button onClick={() => connected ? setConnected(false) : setConnected(true)} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium ${connected ? 'bg-green-500/20 text-green-400' : 'bg-slate-800 text-slate-400'}`}>
            {connected ? <><Wifi className="w-3.5 h-3.5" />{platform}</> : <><WifiOff className="w-3.5 h-3.5" />Connect</>}
          </button>
        </div>
        <div className="px-4 py-2 bg-slate-800/30 border-t border-slate-800/50 flex justify-between text-xs">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: session.color }} />
              <span>{session.name}</span>
              {session.active && <span className="text-slate-500">• Active</span>}
            </div>
            <span className="text-slate-500 font-mono">{time.toISOString().slice(11, 19)} GMT</span>
          </div>
          <span className="text-slate-400">{time.toLocaleDateString()}</span>
        </div>
      </header>

      <main className="p-4 space-y-4 max-w-6xl mx-auto">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <Card icon={<Wallet className="w-4 h-4" />} label="Equity" value="$10,247.50" sub="+2.47%" color="text-green-400" />
          <Card icon={<TrendingUp className="w-4 h-4" />} label="Today's P&L" value="+$247.50" sub="2 wins" color="text-green-400" />
          <Card icon={<Activity className="w-4 h-4" />} label="Positions" value="2" sub="Active" color="text-cyan-400" />
          <Card icon={<Target className="w-4 h-4" />} label="Signals" value="3" sub="ICT alerts" color="text-cyan-400" />
        </div>

        <div className="bg-slate-900 rounded-2xl p-4 border border-slate-800">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${autoTrader ? 'bg-green-500/20' : 'bg-slate-800'}`}>
                <Power className={`w-6 h-6 ${autoTrader ? 'text-green-400' : 'text-slate-500'}`} />
              </div>
              <div>
                <h3 className="font-semibold">Auto Trader</h3>
                <p className="text-xs text-slate-500">{autoTrader ? 'ICT methodology active' : 'Manual mode'}</p>
              </div>
            </div>
            <button onClick={() => setAutoTrader(!autoTrader)} className={`relative w-16 h-8 rounded-full transition ${autoTrader ? 'bg-green-500' : 'bg-slate-700'}`}>
              <div className={`absolute top-1 w-6 h-6 bg-white rounded-full shadow transition-transform ${autoTrader ? 'translate-x-9' : 'translate-x-1'}`} />
            </button>
          </div>
          <div className="mt-4 pt-4 border-t border-slate-800">
            <p className="text-xs text-slate-500 mb-2">Trading Mode</p>
            <div className="grid grid-cols-4 gap-2">
              {(['demo', 'swing', 'scalp', 'hft'] as const).map((m) => (
                <button key={m} onClick={() => setMode(m)} className={`py-2 rounded-xl text-xs font-medium transition ${mode === m ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30' : 'bg-slate-800 text-slate-400'}`}>
                  {m.toUpperCase()}
                </button>
              ))}
            </div>
          </div>
        </div>

        <Signals connected={connected} />
        <Positions connected={connected} />
      </main>
    </div>
  )
}

function Card({ icon, label, value, sub, color }: { icon: any, label: string, value: string, sub: string, color: string }) {
  return (
    <div className="bg-slate-900 rounded-2xl p-4 border border-slate-800">
      <div className="flex items-center justify-between mb-2">{icon}<span className="text-[10px] text-green-400">{sub}</span></div>
      <p className={`text-xl font-bold ${color}`}>{value}</p>
      <p className="text-xs text-slate-500">{label}</p>
    </div>
  )
}

function Signals({ connected }: { connected: boolean }) {
  const signals = connected ? [
    { id: '1', symbol: 'EURUSD', side: 'BUY', price: 1.0856, sl: 1.0836, tp: 1.0896, conf: 78, reason: 'Bullish BOS + OB', time: '09:45' },
    { id: '2', symbol: 'XAUUSD', side: 'SELL', price: 2024.50, sl: 2027.50, tp: 2019.50, conf: 85, reason: 'Bearish FVG + Kill Zone', time: '13:22' },
    { id: '3', symbol: 'GBPUSD', side: 'BUY', price: 1.2678, sl: 1.2648, tp: 1.2738, conf: 72, reason: 'London Kill Zone', time: '08:15' },
  ] : []

  return (
    <div className="bg-slate-900 rounded-2xl p-4 border border-slate-800">
      <h3 className="font-semibold flex items-center gap-2 mb-4"><Target className="w-4 h-4 text-cyan-500" />ICT Signals</h3>
      <div className="space-y-3">
        {signals.map((s) => (
          <div key={s.id} className="bg-slate-800/50 rounded-xl p-3">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className={`px-2 py-0.5 rounded text-xs font-medium ${s.side === 'BUY' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>{s.side}</span>
                <span className="font-semibold">{s.symbol}</span>
                <span className="text-xs text-slate-500">{s.time}</span>
              </div>
              <span className="text-xs text-cyan-400">{s.conf}%</span>
            </div>
            <p className="text-xs text-slate-400 mb-2">{s.reason}</p>
            <div className="flex gap-4 text-xs">
              <span>Entry: <b>{s.price}</b></span>
              <span className="text-red-400">SL: {s.sl}</span>
              <span className="text-green-400">TP: {s.tp}</span>
            </div>
          </div>
        ))}
        {!connected && <p className="text-center text-slate-500 text-sm py-4">Connect to receive live ICT signals</p>}
      </div>
    </div>
  )
}

function Positions({ connected }: { connected: boolean }) {
  const positions = connected ? [
    { ticket: '184725', symbol: 'EURUSD', side: 'BUY', vol: 0.10, entry: 1.0834, current: 1.0856, pnl: 22.00 },
    { ticket: '184726', symbol: 'XAUUSD', side: 'BUY', vol: 0.05, entry: 2018.00, current: 2024.50, pnl: 32.50 },
  ] : []

  return (
    <div className="bg-slate-900 rounded-2xl p-4 border border-slate-800">
      <h3 className="font-semibold flex items-center gap-2 mb-4"><Activity className="w-4 h-4 text-green-500" />Open Positions</h3>
      <div className="space-y-3">
        {positions.map((p) => (
          <div key={p.ticket} className="bg-slate-800/50 rounded-xl p-3">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-500">#{p.ticket}</span>
                <span className="font-semibold">{p.symbol}</span>
                <span className={`px-2 py-0.5 rounded text-xs ${p.side === 'BUY' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>{p.side}</span>
              </div>
              <span className={p.pnl >= 0 ? 'text-green-400' : 'text-red-400'}>{p.pnl >= 0 ? '+' : ''}{p.pnl.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-xs text-slate-400">
              <span>Vol: {p.vol}</span>
              <span>Entry: {p.entry}</span>
              <span>Current: {p.current}</span>
            </div>
          </div>
        ))}
        {!connected && <p className="text-center text-slate-500 text-sm py-4">Connect to see live positions</p>}
      </div>
    </div>
  )
}
