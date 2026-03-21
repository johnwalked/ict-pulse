'use client'

import { useConnectionStore } from '@/lib/store'
import { Wifi, WifiOff, Loader2 } from 'lucide-react'
import { clsx } from 'clsx'

export function ConnectionStatus() {
  const { status, latency } = useConnectionStore()

  const statusConfig = {
    connected: {
      icon: Wifi,
      label: 'Live',
      color: 'text-bull',
      dotClass: 'bg-bull',
      pulse: true,
    },
    connecting: {
      icon: Loader2,
      label: 'Connecting',
      color: 'text-warning',
      dotClass: 'bg-warning',
      pulse: false,
    },
    disconnected: {
      icon: WifiOff,
      label: 'Offline',
      color: 'text-bear',
      dotClass: 'bg-bear',
      pulse: false,
    },
  }

  const config = statusConfig[status]
  const Icon = config.icon

  return (
    <div className={clsx('flex items-center gap-2', config.color)}>
      <div className="relative">
        <div className={clsx('status-dot', config.dotClass, config.pulse && 'animate-pulse')} />
      </div>
      <Icon size={16} className={clsx(status === 'connecting' && 'animate-spin')} />
      <span className="text-xs font-medium">{config.label}</span>
      {latency && status === 'connected' && (
        <span className="text-xs text-text-tertiary font-mono">{latency}ms</span>
      )}
    </div>
  )
}
