'use client'

import { useState, useEffect } from 'react'
import { clsx } from 'clsx'
import { Clock, Zap } from 'lucide-react'

interface KillZoneCardProps {
  name: string
  shortName: string
  startHour: number
  endHour: number
  timezone: string
  color: string
}

export function KillZoneCard({ name, shortName, startHour, endHour, timezone, color }: KillZoneCardProps) {
  const [isActive, setIsActive] = useState(false)
  const [progress, setProgress] = useState(0)
  const [timeUntil, setTimeUntil] = useState('')
  
  useEffect(() => {
    const updateStatus = () => {
      const now = new Date()
      const currentHour = now.getUTCHours()
      
      // Calculate progress based on GMT
      let start = startHour
      let end = endHour
      
      // Adjust for timezone difference
      if (timezone === 'EST') {
        start = (startHour + 5) % 24
        end = (endHour + 5) % 24
      }
      
      let inZone = false
      let prog = 0
      
      if (start > end) {
        // Overnight (e.g., 22 to 3)
        if (currentHour >= start || currentHour < end) {
          inZone = true
          if (currentHour >= start) {
            prog = ((currentHour - start + (now.getUTCMinutes() / 60)) / (24 - start + end)) * 100
          } else {
            prog = ((currentHour + 24 - start + (now.getUTCMinutes() / 60)) / (24 - start + end)) * 100
          }
        }
      } else {
        if (currentHour >= start && currentHour < end) {
          inZone = true
          prog = ((currentHour - start + (now.getUTCMinutes() / 60)) / (end - start)) * 100
        }
      }
      
      setIsActive(inZone)
      setProgress(Math.min(100, Math.max(0, prog)))
      
      // Calculate time until next
      let hoursUntil: number
      if (currentHour < start) {
        hoursUntil = start - currentHour
      } else if (currentHour >= end) {
        hoursUntil = (24 - currentHour) + start
      } else {
        hoursUntil = end - currentHour
      }
      
      setTimeUntil(`${hoursUntil}h ${60 - now.getUTCMinutes()}m`)
    }
    
    updateStatus()
    const interval = setInterval(updateStatus, 60000)
    return () => clearInterval(interval)
  }, [startHour, endHour, timezone])
  
  return (
    <div className={clsx(
      'relative overflow-hidden rounded-xl border transition-all duration-300',
      isActive 
        ? 'bg-gradient-to-br ' + color + ' border-transparent shadow-lg shadow-' + color.split('-')[1] + '/20'
        : 'bg-zinc-900/80 border-zinc-800'
    )}>
      <div className="relative p-4">
        {/* Active indicator */}
        {isActive && (
          <div className="absolute top-2 right-2 flex items-center gap-1">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
            </span>
            <span className="text-xs font-semibold text-white/90">LIVE</span>
          </div>
        )}
        
        <div className="flex items-start justify-between mb-3">
          <div>
            <p className={clsx(
              'text-xs font-semibold tracking-wider uppercase',
              isActive ? 'text-white/80' : 'text-zinc-500'
            )}>
              {shortName}
            </p>
            <h3 className={clsx(
              'text-lg font-bold mt-1',
              isActive ? 'text-white' : 'text-zinc-200'
            )}>
              {name}
            </h3>
          </div>
          <div className={clsx(
            'p-2 rounded-lg',
            isActive ? 'bg-white/20' : 'bg-zinc-800'
          )}>
            {isActive ? (
              <Zap className="w-5 h-5 text-white" />
            ) : (
              <Clock className="w-5 h-5 text-zinc-500" />
            )}
          </div>
        </div>
        
        {/* Time Display */}
        <div className="flex items-center justify-between text-sm">
          <span className={clsx(isActive ? 'text-white/80' : 'text-zinc-400')}>
            {startHour.toString().padStart(2, '0')}:00 - {endHour.toString().padStart(2, '0')}:00 {timezone}
          </span>
        </div>
        
        {/* Progress Bar */}
        <div className="mt-3">
          <div className="h-1.5 bg-black/30 rounded-full overflow-hidden">
            <div 
              className={clsx(
                'h-full rounded-full transition-all duration-1000',
                isActive ? 'bg-white' : 'bg-zinc-600'
              )}
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
        
        {/* Status Text */}
        <div className="mt-2 flex items-center justify-between">
          <span className={clsx(
            'text-xs font-medium',
            isActive ? 'text-white/90' : 'text-zinc-500'
          )}>
            {isActive ? `${progress.toFixed(0)}% complete` : `Starts in ${timeUntil}`}
          </span>
          {isActive && (
            <span className="text-xs font-bold text-white/90 bg-white/20 px-2 py-0.5 rounded">
              HIGH PROBABILITY
            </span>
          )}
        </div>
      </div>
    </div>
  )
}
