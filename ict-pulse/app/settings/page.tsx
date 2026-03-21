'use client'

import { useState } from 'react'
import { useStore } from '@/lib/store'

const symbols = ['EUR/USD', 'GBP/USD', 'USD/JPY', 'AUD/USD', 'USD/CAD', 'NZD/USD', 'XAU/USD']
const timeframes = ['M1', 'M5', 'M15', 'M30', 'H1', 'H4', 'D1']

export default function SettingsPage() {
  const { symbol, timeframe, setSymbol, setTimeframe, connected } = useStore()
  const [wsUrl, setWsUrl] = useState('wss://localhost:9000')

  return (
    <div className="min-h-screen bg-[#0a0e17] text-white p-4 lg:p-6">
      <h1 className="text-2xl font-bold mb-6">Settings</h1>

      <div className="space-y-6 max-w-2xl">
        <div className="bg-[#111827] border border-zinc-800 rounded-2xl p-4">
          <h2 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider mb-4">MT5 Connection</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-zinc-400 mb-2">WebSocket URL</label>
              <input type="text" value={wsUrl} onChange={(e) => setWsUrl(e.target.value)} className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyan-500/50" />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-zinc-400">Status</span>
              <span className={`flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium ${connected ? 'bg-green-500/20 text-green-400' : 'bg-amber-500/20 text-amber-400'}`}>
                <span className={`w-2 h-2 rounded-full ${connected ? 'bg-green-400' : 'bg-amber-400'}`} />
                {connected ? 'Connected' : 'Disconnected'}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-[#111827] border border-zinc-800 rounded-2xl p-4">
          <h2 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider mb-4">Trading Preferences</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-zinc-400 mb-2">Default Symbol</label>
              <select value={symbol} onChange={(e) => setSymbol(e.target.value)} className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyan-500/50">
                {symbols.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm text-zinc-400 mb-2">Default Timeframe</label>
              <select value={timeframe} onChange={(e) => setTimeframe(e.target.value)} className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyan-500/50">
                {timeframes.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
          </div>
        </div>

        <div className="bg-[#111827] border border-zinc-800 rounded-2xl p-4">
          <h2 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider mb-4">About</h2>
          <div className="space-y-2 text-sm text-zinc-400">
            <p>ICT Pulse v2.0</p>
            <p>AI-powered trading platform based on ICT methodology</p>
            <p className="text-xs text-zinc-500">Built for institutional trading analysis</p>
          </div>
        </div>
      </div>
    </div>
  )
}
