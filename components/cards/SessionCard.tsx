'use client'

import { useState, useEffect } from 'react'
import { clsx } from 'clsx'
import { Globe, Clock, TrendingUp, TrendingDown, Minus } from 'lucide-react'
import { useSessionStore } from '@/lib/store'
import { getActiveKillZones, is10AMClose, is9_50AMReversal } from '@/lib/ict/sessions'

export function SessionCard() {
  const { dailyBias, premiumDiscount } = useSessionStore()
  const [currentTime, setCurrentTime] = useState(new Date())
  const [activeZones, setActiveZones] = useState<string[]>([])
  const [sessionAlert, setSessionAlert] = useState<string | null>(null)
  
  useEffect(() => {
    const update = () => {
      setCurrentTime(new Date())
      setActiveZones(getActiveKillZones())
      
      // ICT-specific alerts
      if (is9_50AMReversal()) {
        setSessionAlert('9:50 AM Reversal Window Active')
      } else if (is10AMClose()) {
        setSessionAlert('10:00 AM NY Close - Key Reversal Time')
      } else {
        setSessionAlert(null)
      }
    }
    
    update()
    const interval = setInterval(update, 60000)
    return () => clearInterval(interval)
  }, [])
  
  const sessions = [
    { name: 'Sydney', status: isSessionActive('sydney') ? 'open' : 'closed', progress: getSessionProgress(22, 7) },
    { name: 'Tokyo', status: isSessionActive('tokyo') ? 'open' : 'closed', progress: getSessionProgress(0, 9) },
    { name: 'London', status: isSessionActive('london') ? 'open' : 'closed', progress: getSessionProgress(7, 16) },
    { name: 'New York', status: isSessionActive('ny') ? 'open' : 'closed', progress: getSessionProgress(8, 17) },
  ]
  
  return (
    <div className="bg-zinc-900/80 border border-zinc-800 rounded-xl p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Globe className="w-5 h-5 text-cyan-400" />
          <h3 className="text-lg font-semibold text-white">Trading Sessions</h3>
        </div>
        <div className="text-right">
          <p className="text-xs text-zinc-500">Current Time (EST)</p>
          <p className="text-sm font-mono text-zinc-300">
            {currentTime.toLocaleTimeString('en-US', { hour12: false, timeZone: 'America/New_York' })}
          </p>
        </div>
      </div>
      
      {/* ICT Alert Banner */}
      {sessionAlert && (
        <div className="mb-4 p-3 bg-amber-500/20 border border-amber-500/30 rounded-lg">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-amber-400" />
            <span className="text-sm font-medium text-amber-300">{sessionAlert}</span>
          </div>
        </div>
      )}
      
      {/* Active Kill Zones */}
      {activeZones.length > 0 && (
        <div className="mb-4 p-3 bg-cyan-500/10 border border-cyan-500/20 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-4 h-4 text-cyan-400" />
            <span className="text-sm font-semibold text-cyan-400">Active Kill Zones</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {activeZones.map(zone => (
              <span key={zone} className="px-2 py-1 bg-cyan-500/20 text-cyan-300 text-xs font-medium rounded">
                {zone}
              </span>
            ))}
          </div>
        </div>
      )}
      
      {/* Sessions Grid */}
      <div className="grid grid-cols-2 gap-3">
        {sessions.map(session => (
          <div 
            key={session.name}
            className={clsx(
              'p-3 rounded-lg border transition-all',
              session.status === 'open' 
                ? 'bg-green-500/10 border-green-500/30' 
                : 'bg-zinc-800/50 border-zinc-700/50'
            )}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-zinc-200">{session.name}</span>
              <span className={clsx(
                'text-xs font-semibold px-2 py-0.5 rounded',
                session.status === 'open' 
                  ? 'bg-green-500/20 text-green-400' 
                  : 'bg-zinc-700 text-zinc-400'
              )}>
                {session.status.toUpperCase()}
              </span>
            </div>
            <div className="h-1 bg-zinc-700 rounded-full overflow-hidden">
              <div 
                className={clsx(
                  'h-full rounded-full transition-all',
                  session.status === 'open' ? 'bg-green-500' : 'bg-zinc-600'
                )}
                style={{ width: `${session.progress}%` }}
              />
            </div>
          </div>
        ))}
      </div>
      
      {/* Premium/Discount Zone */}
      <div className="mt-4 p-4 bg-zinc-800/50 rounded-lg">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-zinc-400">Daily Zone</span>
          <span className={clsx(
            'text-xs font-bold px-2 py-1 rounded',
            premiumDiscount === 'premium' ? 'bg-red-500/20 text-red-400' :
            premiumDiscount === 'discount' ? 'bg-green-500/20 text-green-400' :
            'bg-zinc-700 text-zinc-300'
          )}>
            {premiumDiscount.toUpperCase()}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex-1 h-2 bg-zinc-700 rounded-full overflow-hidden relative">
            <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-zinc-500" />
            <div 
              className={clsx(
                'h-full rounded-full transition-all',
                premiumDiscount === 'premium' ? 'bg-red-500 w-3/4' :
                premiumDiscount === 'discount' ? 'bg-green-500 w-1/4' :
                'bg-zinc-500 w-1/2'
              )}
            />
          </div>
        </div>
        <div className="flex justify-between mt-1">
          <span className="text-xs text-zinc-500">Discount</span>
          <span className="text-xs text-zinc-500">Mid</span>
          <span className="text-xs text-zinc-500">Premium</span>
        </div>
      </div>
    </div>
  )
}

// Helper functions
function isSessionActive(session: string): boolean {
  const now = new Date()
  const est = new Date(now.toLocaleString('en-US', { timeZone: 'America/New_York' }))
  const hour = est.getHours()
  
  switch (session) {
    case 'sydney':
      return hour >= 14 || hour < 21 // 10 PM - 5 AM EST = 14 - 21 UTC
    case 'tokyo':
      return hour >= 16 || hour < 1 // 12 AM - 9 AM EST = 16 - 21 UTC  
    case 'london':
      return hour >= 3 && hour < 12 // 7 AM - 4 PM EST = 3 - 12 UTC
    case 'ny':
      return hour >= 9 && hour < 18 // 8 AM - 5 PM EST
    default:
      return false
  }
}

function getSessionProgress(openHour: number, closeHour: number): number {
  const now = new Date()
  const est = new Date(now.toLocaleString('en-US', { timeZone: 'America/New_York' }))
  const currentHour = est.getHours() + est.getMinutes() / 60
  
  // Convert to UTC
  const utcHour = (currentHour + 5) % 24
  
  if (openHour > closeHour) {
    // Overnight session
    if (utcHour >= openHour) {
      return Math.min(100, ((utcHour - openHour) / (24 - openHour + closeHour)) * 100)
    } else if (utcHour < closeHour) {
      return Math.min(100, ((utcHour + 24 - openHour) / (24 - openHour + closeHour)) * 100)
    }
  } else {
    if (utcHour >= openHour && utcHour < closeHour) {
      return ((utcHour - openHour) / (closeHour - openHour)) * 100
    }
  }
  
  return 0
}
