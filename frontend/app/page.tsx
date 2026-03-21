'use client'

import { StatCard } from '@/components/cards/StatCard'
import { MarketOverviewCard } from '@/components/cards/MarketOverviewCard'
import { SignalsCard } from '@/components/cards/SignalsCard'
import { RecentTradesCard } from '@/components/cards/RecentTradesCard'
import { AIInsightsCard } from '@/components/cards/AIInsightsCard'
import { MiniChart } from '@/components/charts/MiniChart'
import { useTradingStore } from '@/lib/store'
import { TrendingUp, TrendingDown, DollarSign, Activity, Zap } from 'lucide-react'

export default function Dashboard() {
  const { equity, balance, tradingMode } = useTradingStore()
  const pnl = equity - balance
  const pnlPercent = (pnl / balance) * 100
  const isPositive = pnl >= 0

  return (
    <div className="min-h-screen bg-bg-primary">
      <div className="max-w-[1800px] mx-auto p-6">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-text-primary font-display tracking-tight">
              ICT Pulse Dashboard
            </h1>
            <p className="text-text-secondary mt-2">
              Real-time trading intelligence powered by ICT methodology
            </p>
          </div>
          <div className="flex items-center gap-3">
            <span className="px-3 py-1 bg-indigo-600/20 text-indigo-400 rounded-full text-sm font-medium">
              {tradingMode.toUpperCase()} MODE
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard
            label="Equity"
            value={`$${equity.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
            subValue={`${isPositive ? '+' : ''}${pnlPercent.toFixed(2)}%`}
            icon={DollarSign}
            trend={{ value: pnlPercent, isPositive }}
            accentColor="green"
          />
          <StatCard
            label="Balance"
            value={`$${balance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
            icon={TrendingUp}
            accentColor="blue"
          />
          <StatCard
            label="Open Positions"
            value="2"
            subValue="+$213.00"
            icon={Activity}
            trend={{ value: 3.05, isPositive: true }}
            accentColor="purple"
          />
          <StatCard
            label="Active Signals"
            value="4"
            subValue="78% accuracy"
            icon={Zap}
            accentColor="blue"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-2">
            <MiniChart />
          </div>
          <div>
            <MarketOverviewCard />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <SignalsCard />
          <AIInsightsCard />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <RecentTradesCard />
          <div className="bg-bg-secondary border border-border rounded-xl p-6">
            <h3 className="text-xl font-semibold text-text-primary mb-4">Performance Summary</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-text-secondary">Win Rate</span>
                <span className="text-emerald-400 font-medium">68%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-text-secondary">Profit Factor</span>
                <span className="text-text-primary font-medium">2.14</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-text-secondary">Avg. Win</span>
                <span className="text-emerald-400 font-medium">$145.50</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-text-secondary">Avg. Loss</span>
                <span className="text-red-400 font-medium">-$68.25</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-text-secondary">Best Trade</span>
                <span className="text-emerald-400 font-medium">+$425.00</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-text-secondary">Worst Trade</span>
                <span className="text-red-400 font-medium">-$125.00</span>
              </div>
              <div className="pt-4 border-t border-border">
                <div className="flex justify-between items-center">
                  <span className="text-text-secondary">Sharpe Ratio</span>
                  <span className="text-text-primary font-medium">1.85</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
