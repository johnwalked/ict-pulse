'use client'

import { Bot, ChevronRight, Zap, AlertTriangle, CheckCircle2 } from 'lucide-react'
import Link from 'next/link'
import { clsx } from 'clsx'

const insights = [
  {
    id: 1,
    type: 'opportunity',
    title: 'Bullish Setup Forming on EURUSD',
    description: 'Order block detected at 1.0820-1.0830 zone. FVG forming on 1H. High probability long entry.',
    time: '5m ago'
  },
  {
    id: 2,
    type: 'warning',
    title: 'Liquidity Sweep Expected',
    description: 'Price approaching major liquidity zone at 1.0900. Watch for shakeout before continuation.',
    time: '15m ago'
  },
  {
    id: 3,
    type: 'success',
    title: 'Trade Closed: +$165',
    description: 'EURUSD long from 1.0832 hit TP at 1.0865. Classic FVG + BOS setup.',
    time: '2h ago'
  },
]

export function AIInsightsCard() {
  return (
    <div className="bg-bg-secondary border border-border rounded-xl p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Bot className="w-5 h-5 text-indigo-400" />
          <h3 className="text-xl font-semibold text-text-primary">AI Insights</h3>
        </div>
        <Link 
          href="/ai"
          className="flex items-center gap-1 text-indigo-400 text-sm hover:text-indigo-300 transition-colors"
        >
          View All
          <ChevronRight className="w-4 h-4" />
        </Link>
      </div>
      <div className="space-y-3">
        {insights.map((insight) => (
          <div 
            key={insight.id} 
            className={clsx(
              'p-4 rounded-lg border',
              insight.type === 'opportunity' && 'bg-indigo-500/10 border-indigo-500/30',
              insight.type === 'warning' && 'bg-amber-500/10 border-amber-500/30',
              insight.type === 'success' && 'bg-emerald-500/10 border-emerald-500/30'
            )}
          >
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center gap-2">
                {insight.type === 'opportunity' && <Zap className="w-4 h-4 text-indigo-400" />}
                {insight.type === 'warning' && <AlertTriangle className="w-4 h-4 text-amber-400" />}
                {insight.type === 'success' && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
                <span className="text-text-primary font-medium text-sm">{insight.title}</span>
              </div>
              <span className="text-text-secondary text-xs">{insight.time}</span>
            </div>
            <p className="text-text-secondary text-sm">{insight.description}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
