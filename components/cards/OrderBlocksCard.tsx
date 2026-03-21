'use client'

import { useState, useEffect } from 'react'
import { clsx } from 'clsx'
import { Box, TrendingUp, TrendingDown, Eye, EyeOff } from 'lucide-react'
import { useChartStore } from '@/lib/store'
import { ictEngine } from '@/lib/ict/engine'
import type { OrderBlock } from '@/types'

export function OrderBlocksCard() {
  const { orderBlocks, ohlcData, addOrderBlock } = useChartStore()
  const [showAll, setShowAll] = useState(false)
  
  useEffect(() => {
    if (ohlcData.length > 0) {
      ictEngine.setData(ohlcData)
      const detectedOBs = ictEngine.detectOrderBlocks()
      detectedOBs.forEach(ob => {
        if (!orderBlocks.find(existing => existing.id === ob.id)) {
          addOrderBlock(ob)
        }
      })
    }
  }, [ohlcData, addOrderBlock])
  
  const activeOBs = orderBlocks.filter(ob => !ob.expired).slice(0, showAll ? 10 : 5)
  
  return (
    <div className="bg-zinc-900/80 border border-zinc-800 rounded-xl p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Box className="w-5 h-5 text-cyan-400" />
          <h3 className="text-lg font-semibold text-white">Order Blocks</h3>
        </div>
        <span className="text-xs text-zinc-500">{activeOBs.length} active</span>
      </div>
      
      <div className="space-y-2">
        {activeOBs.map((ob) => (
          <OrderBlockRow key={ob.id} orderBlock={ob} />
        ))}
        
        {activeOBs.length === 0 && (
          <div className="text-center py-4">
            <p className="text-sm text-zinc-500">No order blocks detected</p>
            <p className="text-xs text-zinc-600 mt-1">Wait for institutional candles</p>
          </div>
        )}
      </div>
      
      {orderBlocks.length > 5 && (
        <button
          onClick={() => setShowAll(!showAll)}
          className="w-full mt-3 py-2 text-xs text-cyan-400 hover:text-cyan-300 transition-colors"
        >
          {showAll ? 'Show Less' : `View All (${orderBlocks.length})`}
        </button>
      )}
    </div>
  )
}

function OrderBlockRow({ orderBlock }: { orderBlock: OrderBlock }) {
  return (
    <div className={clsx(
      'p-3 rounded-lg border transition-all',
      orderBlock.type === 'bullish' 
        ? 'bg-green-500/5 border-green-500/20 hover:border-green-500/40' 
        : 'bg-red-500/5 border-red-500/20 hover:border-red-500/40'
    )}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {orderBlock.type === 'bullish' ? (
            <TrendingUp className="w-4 h-4 text-green-400" />
          ) : (
            <TrendingDown className="w-4 h-4 text-red-400" />
          )}
          <div>
            <p className={clsx(
              'text-sm font-semibold',
              orderBlock.type === 'bullish' ? 'text-green-400' : 'text-red-400'
            )}>
              {orderBlock.type === 'bullish' ? 'Bullish OB' : 'Bearish OB'}
            </p>
            <p className="text-xs text-zinc-500">
              {orderBlock.high.toFixed(5)} - {orderBlock.low.toFixed(5)}
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <div className="text-right">
            <p className="text-xs text-zinc-400">Strength</p>
            <p className={clsx(
              'text-sm font-bold',
              orderBlock.strength > 70 ? 'text-green-400' :
              orderBlock.strength > 40 ? 'text-amber-400' : 'text-zinc-400'
            )}>
              {orderBlock.strength.toFixed(0)}%
            </p>
          </div>
          {orderBlock.touched ? (
            <EyeOff className="w-4 h-4 text-zinc-500" />
          ) : (
            <Eye className="w-4 h-4 text-cyan-400" />
          )}
        </div>
      </div>
      
      {/* Strength Bar */}
      <div className="mt-2 h-1 bg-zinc-700 rounded-full overflow-hidden">
        <div 
          className={clsx(
            'h-full rounded-full',
            orderBlock.type === 'bullish' ? 'bg-green-500' : 'bg-red-500'
          )}
          style={{ width: `${orderBlock.strength}%` }}
        />
      </div>
    </div>
  )
}
