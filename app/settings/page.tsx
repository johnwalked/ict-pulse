'use client'

import { useState } from 'react'
import { useTradingStore, useConnectionStore } from '@/lib/store'
import { Settings, Wifi, WifiOff, Loader2, Shield, Zap, Eye, Moon, Sun } from 'lucide-react'
import { clsx } from 'clsx'

export default function SettingsPage() {
  const { symbol, timeframe, tradingMode, setSymbol, setTimeframe, setTradingMode } = useTradingStore()
  const { mt5Connected, connect, disconnect } = useConnectionStore()
  
  const [wsUrl, setWsUrl] = useState('ws://localhost:8080')
  const [darkMode, setDarkMode] = useState(true)
  const [showIndicators, setShowIndicators] = useState({
    orderBlocks: true,
    fvg: true,
    fibonacci: true,
    liquidity: true,
    sessionLines: true
  })
  
  const symbols = ['EURUSD', 'GBPUSD', 'USDJPY', 'XAUUSD', 'NAS100', 'US500']
  const timeframes = ['1m', '5m', '15m', '30m', '1H', '4H', '1D']
  
  return (
    <div className="min-h-screen bg-[#0a0e17] text-white">
      {/* Header */}
      <div className="border-b border-zinc-800 px-6 py-4">
        <h1 className="text-2xl font-bold">Settings</h1>
        <p className="text-zinc-500">Configure your ICT Pulse experience</p>
      </div>
      
      <div className="p-6 max-w-4xl space-y-6">
        {/* Connection Settings */}
        <SettingsSection title="MT5 Connection" icon={Wifi}>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-zinc-800/50 rounded-lg">
              <div className="flex items-center gap-3">
                {mt5Connected ? (
                  <div className="p-2 bg-green-500/20 rounded-lg">
                    <Wifi className="w-5 h-5 text-green-400" />
                  </div>
                ) : (
                  <div className="p-2 bg-red-500/20 rounded-lg">
                    <WifiOff className="w-5 h-5 text-red-400" />
                  </div>
                )}
                <div>
                  <p className="font-semibold">{mt5Connected ? 'Connected' : 'Disconnected'}</p>
                  <p className="text-sm text-zinc-500">
                    {mt5Connected ? 'Receiving live data' : 'Demo mode active'}
                  </p>
                </div>
              </div>
              <button
                onClick={mt5Connected ? disconnect : connect}
                className={clsx(
                  'px-4 py-2 rounded-lg font-medium transition-colors',
                  mt5Connected 
                    ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30' 
                    : 'bg-green-500/20 text-green-400 hover:bg-green-500/30'
                )}
              >
                {mt5Connected ? 'Disconnect' : 'Connect'}
              </button>
            </div>
            
            <div>
              <label className="block text-sm text-zinc-400 mb-2">WebSocket URL</label>
              <input
                type="text"
                value={wsUrl}
                onChange={(e) => setWsUrl(e.target.value)}
                className="w-full px-4 py-2 bg-zinc-900 border border-zinc-700 rounded-lg text-white focus:outline-none focus:border-cyan-500"
                placeholder="ws://localhost:8080"
              />
            </div>
          </div>
        </SettingsSection>
        
        {/* Trading Settings */}
        <SettingsSection title="Trading Preferences" icon={Zap}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-zinc-400 mb-2">Default Symbol</label>
              <select
                value={symbol}
                onChange={(e) => setSymbol(e.target.value)}
                className="w-full px-4 py-2 bg-zinc-900 border border-zinc-700 rounded-lg text-white focus:outline-none focus:border-cyan-500"
              >
                {symbols.map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm text-zinc-400 mb-2">Default Timeframe</label>
              <select
                value={timeframe}
                onChange={(e) => setTimeframe(e.target.value)}
                className="w-full px-4 py-2 bg-zinc-900 border border-zinc-700 rounded-lg text-white focus:outline-none focus:border-cyan-500"
              >
                {timeframes.map(tf => (
                  <option key={tf} value={tf}>{tf}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm text-zinc-400 mb-2">Trading Mode</label>
              <div className="grid grid-cols-3 gap-2">
                {(['swing', 'scalp', 'hft'] as const).map((mode) => (
                  <button
                    key={mode}
                    onClick={() => setTradingMode(mode)}
                    className={clsx(
                      'px-4 py-3 rounded-lg font-medium transition-colors',
                      tradingMode === mode
                        ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/50'
                        : 'bg-zinc-800 text-zinc-400 border border-zinc-700 hover:bg-zinc-700'
                    )}
                  >
                    {mode.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </SettingsSection>
        
        {/* Chart Indicators */}
        <SettingsSection title="Chart Indicators" icon={Eye}>
          <div className="space-y-3">
            {Object.entries(showIndicators).map(([key, value]) => (
              <div key={key} className="flex items-center justify-between p-3 bg-zinc-800/50 rounded-lg">
                <span className="text-zinc-300 capitalize">{key.replace(/([A-Z])/g, ' $1')}</span>
                <button
                  onClick={() => setShowIndicators(prev => ({ ...prev, [key]: !prev[key as keyof typeof prev] }))}
                  className={clsx(
                    'w-12 h-6 rounded-full transition-colors relative',
                    value ? 'bg-cyan-500' : 'bg-zinc-600'
                  )}
                >
                  <div className={clsx(
                    'absolute top-1 w-4 h-4 rounded-full bg-white transition-transform',
                    value ? 'translate-x-7' : 'translate-x-1'
                  )} />
                </button>
              </div>
            ))}
          </div>
        </SettingsSection>
        
        {/* Appearance */}
        <SettingsSection title="Appearance" icon={Moon}>
          <div className="flex items-center justify-between p-4 bg-zinc-800/50 rounded-lg">
            <div className="flex items-center gap-3">
              {darkMode ? (
                <Moon className="w-5 h-5 text-cyan-400" />
              ) : (
                <Sun className="w-5 h-5 text-amber-400" />
              )}
              <span>Dark Mode</span>
            </div>
            <button
              onClick={() => setDarkMode(!darkMode)}
              className={clsx(
                'w-12 h-6 rounded-full transition-colors relative',
                darkMode ? 'bg-cyan-500' : 'bg-zinc-600'
              )}
            >
              <div className={clsx(
                'absolute top-1 w-4 h-4 rounded-full bg-white transition-transform',
                darkMode ? 'translate-x-7' : 'translate-x-1'
              )} />
            </button>
          </div>
        </SettingsSection>
        
        {/* About */}
        <SettingsSection title="About" icon={Shield}>
          <div className="p-4 bg-zinc-800/50 rounded-lg">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-bold">ICT Pulse</h3>
                <p className="text-sm text-zinc-500">Version 1.0.0</p>
              </div>
            </div>
            <p className="text-sm text-zinc-400">
              AI-powered trading platform implementing ICT methodology by Michael Huddleston.
              Built for traders who want institutional-grade analysis with AI assistance.
            </p>
          </div>
        </SettingsSection>
      </div>
    </div>
  )
}

function SettingsSection({ title, icon: Icon, children }: { title: string, icon: any, children: React.ReactNode }) {
  return (
    <div className="bg-zinc-900/80 border border-zinc-800 rounded-xl overflow-hidden">
      <div className="px-6 py-4 border-b border-zinc-800 flex items-center gap-2">
        <Icon className="w-5 h-5 text-cyan-400" />
        <h2 className="text-lg font-semibold">{title}</h2>
      </div>
      <div className="p-6">
        {children}
      </div>
    </div>
  )
}
