'use client'

import { clsx } from 'clsx'
import { LucideIcon, TrendingUp, TrendingDown, Minus } from 'lucide-react'

interface StatCardProps {
  label: string
  value: string
  icon: LucideIcon
  trend?: 'up' | 'down' | 'neutral'
  subValue?: string
  color?: string
}

export function StatCard({ label, value, icon: Icon, trend = 'neutral', subValue, color }: StatCardProps) {
  return (
    <div className="bg-zinc-900/80 border border-zinc-800 rounded-xl p-4 hover:border-zinc-700 transition-all group">
      <div className="flex items-start justify-between mb-3">
        <div className={clsx(
          'p-2 rounded-lg transition-colors',
          color || (trend === 'up' ? 'bg-green-500/20' : trend === 'down' ? 'bg-red-500/20' : 'bg-zinc-800')
        )}>
          <Icon className={clsx(
            'w-5 h-5 transition-colors',
            trend === 'up' ? 'text-green-400' : trend === 'down' ? 'text-red-400' : 'text-zinc-400'
          )} />
        </div>
        
        {trend !== 'neutral' && (
          <div className={clsx(
            'flex items-center gap-0.5 text-xs font-medium',
            trend === 'up' ? 'text-green-400' : 'text-red-400'
          )}>
            {trend === 'up' ? (
              <TrendingUp className="w-3 h-3" />
            ) : (
              <TrendingDown className="w-3 h-3" />
            )}
          </div>
        )}
      </div>
      
      <div>
        <p className="text-xs text-zinc-500 mb-1">{label}</p>
        <p className={clsx(
          'text-xl font-bold transition-colors',
          trend === 'up' ? 'text-green-400' : trend === 'down' ? 'text-red-400' : 'text-white'
        )}>
          {value}
        </p>
        {subValue && (
          <p className="text-xs text-zinc-500 mt-1">{subValue}</p>
        )}
      </div>
    </div>
  )
}
