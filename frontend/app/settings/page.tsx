'use client'

import { useState } from 'react'
import { useTradingStore, useConnectionStore } from '@/lib/store'
import { Settings, Wifi, WifiOff, Loader2, Shield, Zap, Eye, Moon, Sun, Bell, Volume2 } from 'lucide-react'
import { clsx } from 'clsx'

export default function SettingsPage() {
  const { wsUrl, setWsUrl, demoMode, setDemoMode, tradingMode, setTradingMode } = useTradingStore()
  const { status, latency } = useConnectionStore()
  const [activeTab, setActiveTab] = useState('connection')

  return (
    <div className="min-h-screen bg-bg-primary p-6">
      <div className="max-w-[1000px] mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-bg-secondary rounded-xl">
            <Settings className="w-8 h-8 text-text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-text-primary font-display">
              Settings
            </h1>
            <p className="text-text-secondary">
              Configure your trading platform
            </p>
          </div>
        </div>

        <div className="flex gap-6">
          <div className="w-64 space-y-2">
            {['connection', 'trading', 'appearance', 'notifications'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={clsx(
                  'w-full text-left px-4 py-3 rounded-lg capitalize transition-colors',
                  activeTab === tab 
                    ? 'bg-indigo-600 text-white' 
                    : 'text-text-secondary hover:bg-bg-secondary hover:text-text-primary'
                )}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="flex-1 bg-bg-secondary border border-border rounded-xl p-6">
            {activeTab === 'connection' && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-text-primary">Connection Settings</h2>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-text-secondary text-sm mb-2">WebSocket URL</label>
                    <input
                      type="text"
                      value={wsUrl}
                      onChange={(e) => setWsUrl(e.target.value)}
                      className="w-full bg-bg-tertiary border border-border rounded-lg px-4 py-3 text-text-primary"
                      placeholder="ws://localhost:8080"
                    />
                  </div>

                  <div className="flex items-center justify-between p-4 bg-bg-tertiary rounded-lg">
                    <div className="flex items-center gap-3">
                      {status === 'connected' ? (
                        <Wifi className="w-5 h-5 text-emerald-400" />
                      ) : status === 'connecting' ? (
                        <Loader2 className="w-5 h-5 text-amber-400 animate-spin" />
                      ) : (
                        <WifiOff className="w-5 h-5 text-red-400" />
                      )}
                      <div>
                        <p className="text-text-primary font-medium">MT5 Connection</p>
                        <p className="text-text-secondary text-sm capitalize">{status}</p>
                      </div>
                    </div>
                    {status === 'connected' && latency && (
                      <span className="text-text-secondary text-sm">{latency}ms</span>
                    )}
                  </div>

                  <div className="flex items-center justify-between p-4 bg-bg-tertiary rounded-lg">
                    <div>
                      <p className="text-text-primary font-medium">Demo Mode</p>
                      <p className="text-text-secondary text-sm">Use simulated market data</p>
                    </div>
                    <button
                      onClick={() => setDemoMode(!demoMode)}
                      className={clsx(
                        'w-12 h-6 rounded-full transition-colors relative',
                        demoMode ? 'bg-emerald-500' : 'bg-bg-primary'
                      )}
                    >
                      <span className={clsx(
                        'absolute top-1 w-4 h-4 bg-white rounded-full transition-transform',
                        demoMode ? 'translate-x-7' : 'translate-x-1'
                      )} />
                    </button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'trading' && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-text-primary">Trading Settings</h2>
                
                <div>
                  <label className="block text-text-secondary text-sm mb-2">Default Trading Mode</label>
                  <div className="grid grid-cols-3 gap-3">
                    {(['swing', 'scalp', 'hft'] as const).map((mode) => (
                      <button
                        key={mode}
                        onClick={() => setTradingMode(mode)}
                        className={clsx(
                          'p-4 rounded-lg border transition-colors capitalize',
                          tradingMode === mode
                            ? 'border-indigo-500 bg-indigo-500/20 text-indigo-400'
                            : 'border-border bg-bg-tertiary text-text-secondary hover:text-text-primary'
                        )}
                      >
                        {mode}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-text-secondary text-sm mb-2">Risk Per Trade (%)</label>
                  <input
                    type="number"
                    defaultValue={1}
                    className="w-full bg-bg-tertiary border border-border rounded-lg px-4 py-3 text-text-primary"
                  />
                </div>

                <div>
                  <label className="block text-text-secondary text-sm mb-2">Default Timeframe</label>
                  <select className="w-full bg-bg-tertiary border border-border rounded-lg px-4 py-3 text-text-primary">
                    <option value="1m">1 Minute</option>
                    <option value="5m">5 Minutes</option>
                    <option value="15m">15 Minutes</option>
                    <option value="1H" selected>1 Hour</option>
                    <option value="4H">4 Hours</option>
                    <option value="1D">Daily</option>
                  </select>
                </div>
              </div>
            )}

            {activeTab === 'appearance' && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-text-primary">Appearance</h2>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-bg-tertiary rounded-lg">
                    <div className="flex items-center gap-3">
                      <Moon className="w-5 h-5 text-text-secondary" />
                      <div>
                        <p className="text-text-primary font-medium">Dark Mode</p>
                        <p className="text-text-secondary text-sm">Optimized for trading</p>
                      </div>
                    </div>
                    <div className="w-12 h-6 bg-indigo-600 rounded-full relative">
                      <span className="absolute top-1 right-1 w-4 h-4 bg-white rounded-full" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-text-secondary text-sm mb-2">Chart Theme</label>
                    <select className="w-full bg-bg-tertiary border border-border rounded-lg px-4 py-3 text-text-primary">
                      <option value="dark">Dark (Default)</option>
                      <option value="midnight">Midnight</option>
                      <option value="terminal">Terminal Green</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'notifications' && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-text-primary">Notifications</h2>
                
                <div className="space-y-4">
                  {['Trade Alerts', 'Signal Notifications', 'P&L Updates', 'AI Insights'].map((item) => (
                    <div key={item} className="flex items-center justify-between p-4 bg-bg-tertiary rounded-lg">
                      <div className="flex items-center gap-3">
                        <Bell className="w-5 h-5 text-text-secondary" />
                        <p className="text-text-primary">{item}</p>
                      </div>
                      <button className="w-12 h-6 bg-emerald-500 rounded-full relative">
                        <span className="absolute top-1 right-1 w-4 h-4 bg-white rounded-full" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
