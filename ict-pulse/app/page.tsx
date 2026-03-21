'use client'

import { useEffect, useState } from 'react'
import { useStore } from '@/lib/store'

export default function Dashboard() {
  const {
    connected, symbol, timeframe, tradingMode, setTradingMode,
    currentPrice, priceChange, priceChangePercent,
    bias, killZones, positions,
    equity, todayPnl, winRate, orderBlocks, fairValueGaps, liquidityPools
  } = useStore()

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => useStore.getState().setConnected(true), 1500)
    return () => clearTimeout(timer)
  }, [])

  const navItems = [
    { href: '/', label: 'Dashboard' },
    { href: '/chart', label: 'Chart' },
    { href: '/positions', label: 'Positions' },
    { href: '/journal', label: 'Journal' },
    { href: '/ai', label: 'AI Bot' },
    { href: '/settings', label: 'Settings' },
  ]

  return (
    <div className="min-h-screen bg-[#0a0e17] text-white">
      {/* Mobile Header */}
      <header className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-[#111827]/95 backdrop-blur-xl border-b border-zinc-800/50">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-gradient-to-br from-cyan-400 to-cyan-600 rounded-xl flex items-center justify-center shadow-lg shadow-cyan-500/20">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <span className="font-bold text-lg bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">ICT Pulse</span>
          </div>
          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="p-2 hover:bg-zinc-800 rounded-lg transition-colors">
            {mobileMenuOpen ? (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            ) : (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
            )}
          </button>
        </div>
        {mobileMenuOpen && (
          <nav className="bg-[#111827] border-t border-zinc-800 py-2 px-4">
            {navItems.map((item) => (
              <a key={item.href} href={item.href} onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 px-4 py-3 rounded-xl mb-1 transition-all hover:bg-zinc-800 text-zinc-400">
                <span className="text-sm font-medium">{item.label}</span>
              </a>
            ))}
          </nav>
        )}
      </header>

      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col w-64 bg-[#111827] border-r border-zinc-800 fixed h-screen">
        <div className="p-6 border-b border-zinc-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-cyan-500/20">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
            </div>
            <div>
              <h1 className="font-bold text-lg bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">ICT Pulse</h1>
              <p className="text-xs text-zinc-500">Institutional Trading</p>
            </div>
          </div>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => (
            <a key={item.href} href={item.href}
              className="flex items-center gap-3 px-4 py-3 rounded-xl transition-all hover:bg-zinc-800/50 text-zinc-400">
              <span className="text-sm font-medium">{item.label}</span>
            </a>
          ))}
        </nav>
        <div className="p-4 border-t border-zinc-800">
          <div className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium ${connected ? 'bg-green-500/10 text-green-400' : 'bg-amber-500/10 text-amber-400'}`}>
            <span className={`w-2 h-2 rounded-full ${connected ? 'bg-green-400 animate-pulse' : 'bg-amber-400'}`} />
            {connected ? 'MT5 Connected' : 'Demo Mode'}
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="lg:ml-64 pt-16 lg:pt-0 min-h-screen">
        {/* Top Bar */}
        <div className="sticky top-0 z-40 bg-[#0a0e17]/95 backdrop-blur-xl border-b border-zinc-800/50 px-4 lg:px-6 py-3">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-bold">{symbol}</span>
                <span className="text-sm text-zinc-500">{timeframe}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-mono font-semibold">{currentPrice.toFixed(5)}</span>
                <span className={`text-sm font-medium ${priceChange >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {priceChange >= 0 ? '+' : ''}{priceChange.toFixed(5)} ({priceChangePercent.toFixed(2)}%)
                </span>
              </div>
            </div>
            <div className="flex bg-zinc-800/50 rounded-xl p-1">
              {(['swing', 'scalp', 'hft'] as const).map((mode) => (
                <button key={mode} onClick={() => setTradingMode(mode)}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${tradingMode === mode ? 'bg-cyan-500 text-black' : 'text-zinc-400 hover:text-white'}`}>
                  {mode.toUpperCase()}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="p-4 lg:p-6 space-y-4 lg:space-y-6">
          {/* Kill Zones */}
          <section>
            <h2 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider mb-3">Kill Zones</h2>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
              {killZones.map((zone) => (
                <div key={zone.shortName} className={`bg-[#111827] border ${zone.active ? 'border-cyan-500/50' : 'border-zinc-800'} rounded-2xl p-4 relative overflow-hidden`}>
                  {zone.active && <div className="absolute inset-0 bg-cyan-500/5" />}
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold text-zinc-400">{zone.shortName}</span>
                    {zone.active && <span className="flex items-center gap-1 text-xs text-cyan-400"><span className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-pulse" />Live</span>}
                  </div>
                  <div className="text-sm font-medium">{zone.name}</div>
                  <div className="text-xs text-zinc-500">{zone.startHour}:00 - {zone.endHour}:00 UTC</div>
                  {zone.active && <div className="mt-2 h-1 bg-zinc-700 rounded-full overflow-hidden"><div className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 transition-all duration-500" style={{ width: `${zone.progress}%` }} /></div>}
                </div>
              ))}
            </div>
          </section>

          {/* Stats Row */}
          <section className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            <div className="bg-[#111827] border border-zinc-800 rounded-2xl p-4">
              <div className="text-xs text-zinc-500 mb-1">Equity</div>
              <div className="text-xl font-bold font-mono">${equity.toLocaleString()}</div>
            </div>
            <div className="bg-[#111827] border border-zinc-800 rounded-2xl p-4">
              <div className="text-xs text-zinc-500 mb-1">Today P&L</div>
              <div className={`text-xl font-bold font-mono ${todayPnl >= 0 ? 'text-green-400' : 'text-red-400'}`}>{todayPnl >= 0 ? '+' : ''}${todayPnl.toFixed(2)}</div>
            </div>
            <div className="bg-[#111827] border border-zinc-800 rounded-2xl p-4">
              <div className="text-xs text-zinc-500 mb-1">Win Rate</div>
              <div className="text-xl font-bold font-mono text-cyan-400">{winRate}%</div>
            </div>
            <div className="bg-[#111827] border border-zinc-800 rounded-2xl p-4">
              <div className="text-xs text-zinc-500 mb-1">Bias</div>
              <div className={`text-xl font-bold ${bias === 'bullish' ? 'text-green-400' : bias === 'bearish' ? 'text-red-400' : 'text-zinc-400'}`}>{bias.charAt(0).toUpperCase() + bias.slice(1)}</div>
            </div>
          </section>

          {/* Main Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* Order Blocks */}
            <div className="bg-[#111827] border border-zinc-800 rounded-2xl p-4">
              <h3 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider mb-3">Order Blocks</h3>
              <div className="space-y-2">
                {orderBlocks.map((ob) => (
                  <div key={ob.id} className={`p-3 rounded-xl ${ob.type === 'bullish' ? 'bg-green-500/10 border border-green-500/20' : 'bg-red-500/10 border border-red-500/20'}`}>
                    <div className="flex items-center justify-between">
                      <span className={`text-xs font-semibold ${ob.type === 'bullish' ? 'text-green-400' : 'text-red-400'}`}>{ob.type === 'bullish' ? 'BULLISH OB' : 'BEARISH OB'}</span>
                      {ob.filled && <span className="text-xs text-zinc-500">FILLED</span>}
                    </div>
                    <div className="text-sm font-mono mt-1">{ob.low.toFixed(5)} - {ob.high.toFixed(5)}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Fair Value Gaps */}
            <div className="bg-[#111827] border border-zinc-800 rounded-2xl p-4">
              <h3 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider mb-3">Fair Value Gaps</h3>
              <div className="space-y-2">
                {fairValueGaps.map((fvg) => (
                  <div key={fvg.id} className={`p-3 rounded-xl ${fvg.type === 'bullish' ? 'bg-cyan-500/10 border border-cyan-500/20' : 'bg-purple-500/10 border border-purple-500/20'}`}>
                    <div className="flex items-center justify-between">
                      <span className={`text-xs font-semibold ${fvg.type === 'bullish' ? 'text-cyan-400' : 'text-purple-400'}`}>{fvg.type === 'bullish' ? 'BULLISH FVG' : 'BEARISH FVG'}</span>
                      {fvg.filled && <span className="text-xs text-zinc-500">FILLED</span>}
                    </div>
                    <div className="text-sm font-mono mt-1">{fvg.low.toFixed(5)} - {fvg.high.toFixed(5)}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Liquidity Pools */}
            <div className="bg-[#111827] border border-zinc-800 rounded-2xl p-4">
              <h3 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider mb-3">Liquidity Pools</h3>
              <div className="space-y-2">
                {liquidityPools.map((pool) => (
                  <div key={pool.id} className={`p-3 rounded-xl ${pool.type === 'buy' ? 'bg-blue-500/10 border border-blue-500/20' : 'bg-orange-500/10 border border-orange-500/20'}`}>
                    <div className="flex items-center justify-between">
                      <span className={`text-xs font-semibold ${pool.type === 'buy' ? 'text-blue-400' : 'text-orange-400'}`}>{pool.type === 'buy' ? 'BUY LIQUIDITY' : 'SELL LIQUIDITY'}</span>
                      {pool.grabbed && <span className="text-xs text-red-400">GRABBED</span>}
                    </div>
                    <div className="text-sm font-mono mt-1">{pool.price.toFixed(5)}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Open Positions */}
          <section className="bg-[#111827] border border-zinc-800 rounded-2xl p-4">
            <h3 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider mb-3">Open Positions</h3>
            {positions.length === 0 ? (
              <div className="text-center py-8 text-zinc-500">No open positions</div>
            ) : (
              <div className="space-y-2">
                {positions.map((pos) => (
                  <div key={pos.id} className="flex items-center justify-between p-3 bg-zinc-800/50 rounded-xl">
                    <div className="flex items-center gap-3">
                      <div className={`w-2 h-2 rounded-full ${pos.type === 'buy' ? 'bg-green-400' : 'bg-red-400'}`} />
                      <div>
                        <div className="text-sm font-medium">{pos.symbol}</div>
                        <div className="text-xs text-zinc-500">{pos.type.toUpperCase()} {pos.volume} lots</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-mono">{pos.currentPrice.toFixed(5)}</div>
                      <div className={`text-xs font-mono ${pos.pnl >= 0 ? 'text-green-400' : 'text-red-400'}`}>{pos.pnl >= 0 ? '+' : ''}${pos.pnl.toFixed(2)}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* Quick Links */}
          <section className="grid grid-cols-3 lg:grid-cols-6 gap-3">
            {navItems.slice(1).map((item) => (
              <a key={item.href} href={item.href}
                className="flex flex-col items-center gap-2 p-4 bg-[#111827] border border-zinc-800 rounded-2xl hover:border-zinc-700 transition-all">
                <span className="text-sm font-medium text-zinc-300">{item.label}</span>
              </a>
            ))}
          </section>
        </div>
      </main>
    </div>
  )
}
