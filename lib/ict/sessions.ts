// ICT Kill Zones & Session Analysis

export interface KillZoneInfo {
  name: string
  shortName: string
  startHour: number
  endHour: number
  timezone: string
  startTime: Date
  endTime: Date
  isActive: boolean
  isInKillZone: boolean
  progress: number
  timeUntilStart: string
  timeUntilEnd: string
}

export interface SessionInfo {
  name: string
  isActive: boolean
  isKillZone: boolean
  currentTime: string
  progress: number
  nextEvent: string
  nextEventTime: string
}

// ICT Kill Zones in EST (New York time)
export const KILL_ZONES = {
  london: {
    name: 'London Kill Zone',
    shortName: 'LNDN',
    startHour: 7, // GMT = 3 AM EST
    endHour: 10,  // GMT = 6 AM EST
    timezone: 'GMT',
    estOffset: -5, // EST is GMT-5 (or -4 during DST)
  },
  ny_am: {
    name: 'New York AM Kill Zone',
    shortName: 'NY-AM',
    startHour: 8,
    endHour: 11,
    timezone: 'EST',
    estOffset: 0,
  },
  ny_pm: {
    name: 'New York PM Kill Zone',
    shortName: 'NY-PM',
    startHour: 13,
    endHour: 16,
    timezone: 'EST',
    estOffset: 0,
  },
  asia: {
    name: 'Asia Kill Zone',
    shortName: 'ASIA',
    startHour: 0,
    endHour: 3,
    timezone: 'GMT',
    estOffset: -5,
  },
}

// ICT Sessions
export const SESSIONS = {
  sydney: { name: 'Sydney', openHour: 22, closeHour: 7, timezone: 'GMT', killStart: 22, killEnd: 1 },
  tokyo: { name: 'Tokyo', openHour: 0, closeHour: 9, timezone: 'GMT', killStart: 0, killEnd: 3 },
  london: { name: 'London', openHour: 7, closeHour: 16, timezone: 'GMT', killStart: 7, killEnd: 10 },
  ny_am: { name: 'New York AM', openHour: 8, closeHour: 12, timezone: 'EST', killStart: 8, killEnd: 11 },
  ny_pm: { name: 'New York PM', openHour: 13, closeHour: 17, timezone: 'EST', killStart: 13, killEnd: 16 },
}

export function getTimezoneOffset(timezone: string): number {
  const now = new Date()
  if (timezone === 'EST' || timezone === 'EST') {
    return -5 // Standard time
  }
  return 0 // GMT
}

export function convertToTimezone(date: Date, timezone: string): Date {
  const offset = getTimezoneOffset(timezone)
  const utc = date.getTime() + (date.getTimezoneOffset() * 60000)
  return new Date(utc + (offset * 3600000))
}

export function isSessionActive(session: typeof SESSIONS[keyof typeof SESSIONS], currentTime?: Date): boolean {
  const time = currentTime || new Date()
  const sessionTime = convertToTimezone(time, session.timezone)
  const currentHour = sessionTime.getHours()
  
  // Handle overnight sessions (e.g., 22 to 7)
  if (session.openHour > session.closeHour) {
    return currentHour >= session.openHour || currentHour < session.closeHour
  }
  
  return currentHour >= session.openHour && currentHour < session.closeHour
}

export function isInKillZone(session: typeof SESSIONS[keyof typeof SESSIONS], currentTime?: Date): boolean {
  const time = currentTime || new Date()
  const sessionTime = convertToTimezone(time, session.timezone)
  const currentHour = sessionTime.getHours()
  
  if (session.openHour > session.killEnd) {
    return currentHour >= session.openHour && currentHour < session.killEnd + 24
  }
  
  return currentHour >= session.openHour + session.killStart && currentHour < session.killEnd
}

export function getKillZoneProgress(killZone: typeof KILL_ZONES[keyof typeof KILL_ZONES]): number {
  const now = new Date()
  const currentTime = convertToTimezone(now, killZone.timezone)
  const currentHour = currentTime.getHours()
  const currentMinute = currentTime.getMinutes()
  const currentTotalMinutes = currentHour * 60 + currentMinute
  
  let startMinutes = killZone.startHour * 60
  let endMinutes = killZone.endHour * 60
  
  // Handle overnight kill zones
  if (endMinutes < startMinutes) {
    if (currentTotalMinutes >= startMinutes) {
      return Math.min(100, ((currentTotalMinutes - startMinutes) / ((24 * 60 - startMinutes) + endMinutes)) * 100)
    } else {
      return 0
    }
  }
  
  if (currentTotalMinutes < startMinutes) return 0
  if (currentTotalMinutes >= endMinutes) return 100
  
  return ((currentTotalMinutes - startMinutes) / (endMinutes - startMinutes)) * 100
}

export function formatTimeUntil(targetHour: number, timezone: string): string {
  const now = new Date()
  const currentTime = convertToTimezone(now, timezone)
  const currentHour = currentTime.getHours()
  const currentMinute = currentTime.getMinutes()
  
  let hoursUntil: number
  if (targetHour > currentHour) {
    hoursUntil = targetHour - currentHour
  } else {
    hoursUntil = (24 - currentHour) + targetHour
  }
  
  const minutesUntil = 60 - currentMinute
  return `${hoursUntil}h ${minutesUntil}m`
}

export function getActiveKillZones(): string[] {
  const active: string[] = []
  
  if (getKillZoneProgress(KILL_ZONES.london) > 0 && getKillZoneProgress(KILL_ZONES.london) < 100) {
    active.push('London')
  }
  if (getKillZoneProgress(KILL_ZONES.ny_am) > 0 && getKillZoneProgress(KILL_ZONES.ny_am) < 100) {
    active.push('NY-AM')
  }
  if (getKillZoneProgress(KILL_ZONES.ny_pm) > 0 && getKillZoneProgress(KILL_ZONES.ny_pm) < 100) {
    active.push('NY-PM')
  }
  if (getKillZoneProgress(KILL_ZONES.asia) > 0 && getKillZoneProgress(KILL_ZONES.asia) < 100) {
    active.push('Asia')
  }
  
  return active
}

export function getNextKillZone(): { name: string; timeUntil: string; startHour: number; timezone: string } | null {
  const now = new Date()
  const zones = [
    { ...KILL_ZONES.london, startHour: 7, timezone: 'GMT' },
    { ...KILL_ZONES.ny_am, startHour: 8, timezone: 'EST' },
    { ...KILL_ZONES.ny_pm, startHour: 13, timezone: 'EST' },
    { ...KILL_ZONES.asia, startHour: 0, timezone: 'GMT' },
  ]
  
  // Sort by next occurrence
  const currentTime = convertToTimezone(now, 'GMT')
  const currentHour = currentTime.getHours()
  
  let next: typeof zones[0] | null = null
  let minHoursUntil = 24
  
  for (const zone of zones) {
    let hoursUntil: number
    if (zone.startHour > currentHour) {
      hoursUntil = zone.startHour - currentHour
    } else {
      hoursUntil = (24 - currentHour) + zone.startHour
    }
    
    if (hoursUntil < minHoursUntil) {
      minHoursUntil = hoursUntil
      next = zone
    }
  }
  
  return next ? { name: next.name, timeUntil: `${minHoursUntil}h`, startHour: next.startHour, timezone: next.timezone } : null
}

// ICT Specific Time Events
export function is9_50AMReversal(): boolean {
  const now = new Date()
  const est = convertToTimezone(now, 'EST')
  const hour = est.getHours()
  const minute = est.getMinutes()
  return hour === 9 && minute >= 50 && minute < 60
}

export function is10AMClose(): boolean {
  const now = new Date()
  const est = convertToTimezone(now, 'EST')
  return est.getHours() === 10 && est.getMinutes() < 30
}

export function is2AMFade(): boolean {
  const now = new Date()
  const est = convertToTimezone(now, 'EST')
  return est.getHours() === 2 && est.getMinutes() < 30
}

export function isLiquidityRun(hour: number, minute: number): boolean {
  // 7:00-7:30 GMT (London open), 8:30-9:00 EST (NY morning), 10:00-10:30 EST (NY close)
  const times = [
    { hour: 7, min: 0, tz: 'GMT' },
    { hour: 8, min: 30, tz: 'EST' },
    { hour: 10, min: 0, tz: 'EST' },
  ]
  
  return times.some(t => {
    if (t.tz === 'GMT') {
      const now = convertToTimezone(new Date(), 'GMT')
      return now.getHours() === t.hour && now.getMinutes() >= t.min && now.getMinutes() < t.min + 30
    } else {
      const now = convertToTimezone(new Date(), 'EST')
      return now.getHours() === t.hour && now.getMinutes() >= t.min && now.getMinutes() < t.min + 30
    }
  })
}
