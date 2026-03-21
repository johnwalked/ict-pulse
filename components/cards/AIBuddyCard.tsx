'use client'

import { useState } from 'react'
import { clsx } from 'clsx'
import { Bot, Send, Sparkles, MessageSquare, TrendingUp, Calendar, HelpCircle, Loader2 } from 'lucide-react'

const quickQuestions = [
  { icon: TrendingUp, text: 'Analyze current trend' },
  { icon: Calendar, text: 'Best trade times today' },
  { icon: HelpCircle, text: 'What is MSS?' },
  { icon: MessageSquare, text: 'Explain OTE strategy' }
]

export function AIBuddyCard() {
  const [message, setMessage] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  
  const suggestions = [
    'Bullish on EURUSD in London KZ',
    'Current premium zone analysis',
    'XAUUSD OTE levels',
    'MSS confirmation criteria'
  ]
  
  const handleSend = () => {
    if (!message.trim()) return
    setIsTyping(true)
    // Simulate AI response
    setTimeout(() => setIsTyping(false), 2000)
    setMessage('')
  }
  
  return (
    <div className="bg-zinc-900/80 border border-zinc-800 rounded-xl p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-gradient-to-br from-cyan-500 to-purple-600 rounded-lg">
            <Bot className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white">ICT AI Buddy</h3>
            <p className="text-xs text-zinc-500">Powered by GPT-4</p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
          </span>
          <span className="text-xs text-green-400">Online</span>
        </div>
      </div>
      
      {/* Quick Questions */}
      <div className="mb-4">
        <p className="text-xs text-zinc-500 mb-2">Quick Questions</p>
        <div className="flex flex-wrap gap-2">
          {quickQuestions.map((q, i) => (
            <button
              key={i}
              className="flex items-center gap-1.5 px-2 py-1 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 hover:border-zinc-600 rounded-lg text-xs text-zinc-300 transition-all"
            >
              <q.icon className="w-3 h-3" />
              {q.text}
            </button>
          ))}
        </div>
      </div>
      
      {/* Chat Input */}
      <div className="relative">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Ask about ICT concepts, signals..."
          className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-xl text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/20 transition-all"
          onKeyPress={(e) => e.key === 'Enter' && handleSend()}
        />
        <button
          onClick={handleSend}
          disabled={!message.trim() || isTyping}
          className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-cyan-500 hover:bg-cyan-400 disabled:bg-zinc-700 disabled:cursor-not-allowed rounded-lg transition-colors"
        >
          {isTyping ? (
            <Loader2 className="w-4 h-4 text-white animate-spin" />
          ) : (
            <Send className="w-4 h-4 text-white" />
          )}
        </button>
      </div>
      
      {/* Sample Analysis */}
      <div className="mt-4 p-3 bg-gradient-to-br from-cyan-500/10 to-purple-500/10 border border-cyan-500/20 rounded-lg">
        <div className="flex items-center gap-2 mb-2">
          <Sparkles className="w-4 h-4 text-cyan-400" />
          <span className="text-xs font-semibold text-cyan-400">Daily Analysis</span>
        </div>
        <p className="text-xs text-zinc-300 leading-relaxed">
          EURUSD showing bullish MSS on 4H. Price action favors long entries in discount zones. 
          London Kill Zone had strong bullish displacement. Expecting pullback to 1.0830 area for OTE setup.
        </p>
        <p className="text-xs text-zinc-500 mt-2">
          Confidence: 78% | Bias: Bullish | Zone: Discount
        </p>
      </div>
    </div>
  )
}
