'use client'

import { LucideIcon } from 'lucide-react'
import { clsx } from 'clsx'
import { TrendingUp, TrendingDown } from 'lucide-react'

interface StatCardProps {
  label: string
  value: string
  subValue?: string
  icon: LucideIcon
  trend?: {
    value: number
    isPositive: boolean
  }
  accentColor?: 'blue' | 'green' | 'red' | 'purple'
}

export function StatCard({ label, value, subValue, icon: Icon, trend, accentColor = 'blue' }: StatCardProps) {
  const accentColors = {
    blue: 'border-indigo-500/30',
    green: 'border-emerald-500/30',
    red: 'border-red-500/30',
    purple: 'border-violet-500/30',
  }

  return (
    <div className={clsx(
      'bg-bg-secondary border rounded-xl p-5',
      accentColors[accentColor]
    )}>
      <div className="flex items-center justify-between mb-3">
        <span className="text-text-secondary text-sm">{label}</span>
        <div className={clsx(
          'p-2 rounded-lg',
          accentColor === 'blue' && 'bg-indigo-500/20',
          accentColor === 'green' && 'bg-emerald-500/20',
          accentColor === 'red' && 'bg-red-500/20',
          accentColor === 'purple' && 'bg-violet-500/20'
        )}>
          <Icon className={clsx(
            'w-4 h-4',
            accentColor === 'blue' && 'text-indigo-400',
            accentColor === 'green' && 'text-emerald-400',
            accentColor === 'red' && 'text-red-400',
            accentColor === 'purple' && 'text-violet-400'
          )} />
        </div>
      </div>
      <div className="flex items-end justify-between">
        <p className="text-2xl font-bold text-text-primary">{value}</p>
        {subValue && (
          <span className={clsx(
            'text-sm font-medium',
            trend?.isPositive !== undefined 
              ? trend.isPositive ? 'text-emerald-400' : 'text-red-400'
              : 'text-text-secondary'
          )}>
            {trend?.isPositive !== undefined && (
              trend.isPositive ? <TrendingUp className="w-3 h-3 inline mr-1" /> : <TrendingDown className="w-3 h-3 inline mr-1" />
            )}
            {subValue}
          </span>
        )}
      </div>
    </div>
  )
}
