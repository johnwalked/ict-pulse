'use client'

import { useState, useEffect } from 'react'
import { useChartStore, useTradingStore, useConnectionStore, useSessionStore } from '@/lib/store'
import { KillZoneCard } from '@/components/cards/KillZoneCard'
import { SessionCard } from '@/components/cards/SessionCard'
import { MarketStructureCard } from '@/components/cards/MarketStructureCard'
import { OrderBlocksCard } from '@/components/cards/OrderBlocksCard'
import { FVGListCard } from '@/components/cards/FVGListCard'
import { PositionsCard } from '@/components/cards/PositionsCard'
import { SignalsCard } from '@/components/cards/SignalsCard'
import { AIBuddyCard } from '@/components/cards/AIBuddyCard'
import { StatCard } from '@/components/cards/StatCard'
import { generateDemoData } from '@/lib/utils'
import { 
  TrendingUp, TrendingDown, Activity, Wallet, 
  Target, Clock, Zap, Bot, BarChart3, Calendar,
  ChevronRight, Wifi, WifiOff, Sun, Moon
} from 'lucide-react'

export default function Dashboard() {
  const { mt5Connected, connect } = useConnectionStore()
  const { positions, symbol, tradingMode, timeframe, setTradingMode } = useTradingStore()
  const { ohlcData, setOHLCData, marketStructure, setMarketStructure, fairValueGaps, orderBlocks } = useChartStore()
  const { currentSession, dailyBias, premiumDiscount, setDailyBias, setPremiumDiscount } = useSessionStore()
  
  useEffect(() => {
    // Initialize with demo data
    const data = generateDemoData(200, symbol)
    setOHLCData(data)
    
    // Set initial bias
    setDailyBias({
      bias: 'neutral',
      premium: 'mid',
      reason: 'Awaiting market structure confirmation',
      confidence: 50
    })
    
    // Connect simulation
    const timer = setTimeout(() => {
      connect()
    }, 1000)
    
    return () => clearTimeout(timer)
  }, [])
  
  // Calculate demo stats
  const totalPnl = positions.reduce((sum, p) => sum + p.pnl, 0)
  const winRate = 67
  const totalTrades = 23
  const profitableTrades = Math.round(totalTrades * winRate / 100)
  
  // Premium/Discount calculation based on current price
  const currentPrice = ohlcData[ohlcData.length - 1]?.close || 1.0850
  const dailyHigh = Math.max(...ohlcData.slice(-24).map(c => c.high))
  const dailyLow = Math.min(...ohlcData.slice(-24).map(c => c.low))
  const dailyMid = (dailyHigh + dailyLow) / 2
  const pdZone = currentPrice > dailyMid ? 'premium' : currentPrice < dailyMid ? 'discount' : 'mid'
  
  useEffect(() => {
    setPremiumDiscount(pdZone)
  }, [pdZone])
  
  return (
    <div className="min-h-screen bg-[#0a0e17] text-white">
      {/* Header Bar */}
      <header className="border-b border-zinc-800 bg-[#111827]/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-lg flex items-center justify-center">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                ICT Pulse
              </span>
            </div>
            
            <div className="h-6 w-px bg-zinc-700" />
            
            <div className="flex items-center gap-2">
              <span className="text-lg font-mono font-semibold text-zinc-200">{symbol}</span>
              <span className="text-sm text-zinc-500">|</span>
              <span className="text-sm text-zinc-400">{timeframe}</span>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            {/* Connection Status */}
            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium ${
              mt5Connected ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
            }`}>
              {mt5Connected ? <Wifi className="w-3.5 h-3.5" /> : <WifiOff className="w-3.5 h-3.5" />}
              {mt5Connected ? 'MT5 Live' : 'Demo Mode'}
            </div>
            
            {/* Trading Mode Toggle */}
            <div className="flex bg-zinc-800 rounded-lg p-1">
              {(['swing', 'scalp', 'hft'] as const).map((mode) => (
                <button
                  key={mode}
                  onClick={() => setTradingMode(mode)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
                    tradingMode === mode
                      ? 'bg-cyan-500/20 text-cyan-400'
                      : 'text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  {mode.toUpperCase()}
                </button>
              ))}
            </div>
          </div>
        </div>
      </header>
      
      <main className="p-6">
        {/* ICT Kill Zones Banner */}
        <div className="mb-6 grid grid-cols-1 md:grid-cols-4 gap-4">
          <KillZoneCard 
            name="London Kill Zone" 
            shortName="LNDN"
            startHour={7}
            endHour={10}
            timezone="GMT"
            color="from-amber-500 to-orange-600"
          />
          <KillZoneCard 
            name="NY AM Kill Zone" 
            shortName="NY-AM"
            startHour={8}
            endHour={11}
            timezone="EST"
            color="from-blue-500 to-cyan-600"
          />
          <KillZoneCard 
            name="NY PM Kill Zone" 
            shortName="NY-PM"
            startHour={13}
            endHour={16}
            timezone="EST"
            color="from-purple-500 to-pink-600"
          />
          <KillZoneCard 
            name="Asia Kill Zone" 
            shortName="ASIA"
            startHour={0}
            endHour={3}
            timezone="GMT"
            color="from-emerald-500 to-teal-600"
          />
        </div>
        
        {/* Main Stats Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-6">
          <StatCard
            label="Equity"
            value="$24,847.00"
            icon={Wallet}
            trend={totalPnl >= 0 ? 'up' : 'down'}
            subValue={`${totalPnl >= 0 ? '+' : ''}$${totalPnl.toFixed(2)}`}
          />
          <StatCard
            label="Today's P&L"
            value={`${totalPnl >= 0 ? '+' : ''}$${totalPnl.toFixed(2)}`}
            icon={totalPnl >= 0 ? TrendingUp : TrendingDown}
            trend={totalPnl >= 0 ? 'up' : 'down'}
            subValue={`${winRate}% win rate`}
          />
          <StatCard
            label="Open Positions"
            value={positions.length.toString()}
            icon={Activity}
            trend="neutral"
          />
          <StatCard
            label="Total Trades"
            value={totalTrades.toString()}
            icon={BarChart3}
            trend="neutral"
            subValue={`${profitableTrades} wins`}
          />
          <StatCard
            label="Active Signals"
            value="3"
            icon={Target}
            trend="neutral"
            subValue="2 bullish, 1 bearish"
          />
          <StatCard
            label="Win Rate"
            value={`${winRate}%`}
            icon={Activity}
            trend="up"
            subValue="Last 30 days"
          />
        </div>
        
        {/* Primary Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* Left Column - Market Structure & Patterns */}
          <div className="space-y-6">
            <MarketStructureCard />
            <OrderBlocksCard />
            <FVGListCard />
          </div>
          
          {/* Center Column - Price Chart & Session */}
          <div className="space-y-6">
            <SessionCard />
            <PositionsCard />
          </div>
          
          {/* Right Column - AI & Signals */}
          <div className="space-y-6">
            <SignalsCard />
            <AIBuddyCard />
          </div>
        </div>
        
        {/* Bottom Row - Quick Access */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          <QuickAccessButton icon={BarChart3} label="Full Chart" href="/chart" />
          <QuickAccessButton icon={Activity} label="Order Flow" href="/orderflow" />
          <QuickAccessButton icon={Target} label="Analysis" href="/analysis" />
          <QuickAccessButton icon={Calendar} label="Journal" href="/journal" />
          <QuickAccessButton icon={Bot} label="AI Chat" href="/ai" />
          <QuickAccessButton icon={Settings} label="Settings" href="/settings" />
        </div>
      </main>
    </div>
  )
}

function QuickAccessButton({ icon: Icon, label, href }: { icon: any, label: string, href: string }) {
  return (
    <a
      href={href}
      className="flex items-center justify-center gap-2 px-4 py-3 bg-zinc-800/50 hover:bg-zinc-800 border border-zinc-700/50 hover:border-zinc-600 rounded-xl transition-all group"
    >
      <Icon className="w-5 h-5 text-zinc-400 group-hover:text-cyan-400 transition-colors" />
      <span className="text-sm font-medium text-zinc-300 group-hover:text-white transition-colors">
        {label}
      </span>
      <ChevronRight className="w-4 h-4 text-zinc-600 group-hover:text-zinc-400 transition-colors" />
    </a>
  )
}

function Settings(props: any) {
  return <div {...props}><LucideSettings className="w-5 h-5" /></div>
}

import { LucideSettings } from 'lucide-react'
