'use client'

import { useState, useRef, useEffect } from 'react'
import { useTradingStore } from '@/lib/store'
import { Search, ChevronDown } from 'lucide-react'
import { clsx } from 'clsx'

const popularSymbols = [
  { symbol: 'EURUSD', name: 'Euro / US Dollar', type: 'Forex' },
  { symbol: 'GBPUSD', name: 'British Pound / US Dollar', type: 'Forex' },
  { symbol: 'USDJPY', name: 'US Dollar / Japanese Yen', type: 'Forex' },
  { symbol: 'GBPJPY', name: 'British Pound / Japanese Yen', type: 'Forex' },
  { symbol: 'AUDUSD', name: 'Australian Dollar / US Dollar', type: 'Forex' },
  { symbol: 'USDCAD', name: 'US Dollar / Canadian Dollar', type: 'Forex' },
  { symbol: 'XAUUSD', name: 'Gold / US Dollar', type: 'Commodity' },
  { symbol: 'BTCUSD', name: 'Bitcoin / US Dollar', type: 'Crypto' },
  { symbol: 'NAS100', name: 'Nasdaq 100', type: 'Index' },
  { symbol: 'US30', name: 'Dow Jones 30', type: 'Index' },
]

export function SymbolSearch() {
  const { symbol, setSymbol } = useTradingStore()
  const [isOpen, setIsOpen] = useState(false)
  const [search, setSearch] = useState('')
  const dropdownRef = useRef<HTMLDivElement>(null)

  const currentSymbol = popularSymbols.find(s => s.symbol === symbol)
  const filteredSymbols = popularSymbols.filter(
    s => 
      s.symbol.toLowerCase().includes(search.toLowerCase()) ||
      s.name.toLowerCase().includes(search.toLowerCase())
  )

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 bg-bg-tertiary rounded-lg hover:bg-border transition-colors"
      >
        <span className="font-mono font-semibold text-sm">{symbol}</span>
        <ChevronDown size={14} className={clsx('text-text-tertiary transition-transform', isOpen && 'rotate-180')} />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-72 bg-bg-secondary border border-border rounded-lg shadow-xl z-50">
          {/* Search input */}
          <div className="p-2 border-b border-border">
            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-tertiary" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search symbol..."
                className="w-full pl-9 pr-3 py-2 bg-bg-tertiary rounded-lg text-sm text-text-primary placeholder:text-text-tertiary focus:outline-none focus:ring-1 focus:ring-accent-primary"
                autoFocus
              />
            </div>
          </div>

          {/* Symbol list */}
          <div className="max-h-64 overflow-y-auto p-1">
            {filteredSymbols.map((s) => (
              <button
                key={s.symbol}
                onClick={() => {
                  setSymbol(s.symbol)
                  setIsOpen(false)
                  setSearch('')
                }}
                className={clsx(
                  'w-full flex items-center justify-between px-3 py-2 rounded-lg transition-colors',
                  symbol === s.symbol
                    ? 'bg-accent-primary/10 text-accent-primary'
                    : 'hover:bg-bg-tertiary text-text-secondary'
                )}
              >
                <div className="flex items-center gap-2">
                  <span className="font-mono font-medium text-sm">{s.symbol}</span>
                  <span className="text-xs text-text-tertiary">{s.name}</span>
                </div>
                <span className={clsx(
                  'text-xs px-1.5 py-0.5 rounded',
                  s.type === 'Forex' && 'bg-accent-primary/20 text-accent-primary',
                  s.type === 'Commodity' && 'bg-warning/20 text-warning',
                  s.type === 'Crypto' && 'bg-gold/20 text-gold',
                  s.type === 'Index' && 'bg-accent-secondary/20 text-accent-secondary',
                )}>
                  {s.type}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Current symbol info */}
      {currentSymbol && (
        <span className="ml-2 text-xs text-text-tertiary hidden md:inline">
          {currentSymbol.name}
        </span>
      )}
    </div>
  )
}
