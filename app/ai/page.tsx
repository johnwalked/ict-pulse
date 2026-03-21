'use client'

import { useState, useRef, useEffect } from 'react'
import { Bot, Send, Sparkles, TrendingUp, BarChart3, HelpCircle, Loader2, MessageSquare } from 'lucide-react'
import { clsx } from 'clsx'
import { useAIStore } from '@/lib/store'

const quickPrompts = [
  { icon: TrendingUp, text: 'Analyze EURUSD trend', query: 'Analyze the current trend on EURUSD using ICT methodology' },
  { icon: BarChart3, text: 'Best setups today', query: 'What are the best trading setups today based on kill zones?' },
  { icon: HelpCircle, text: 'What is MSS?', query: 'Explain Market Structure Shift (MSS) in ICT methodology' },
  { icon: MessageSquare, text: 'OTE strategy', query: 'How do I use Optimal Trade Entry (OTE) with Fibonacci?' }
]

const ictKnowledge = `
ICT (Inner Circle Trader) Methodology by Michael Huddleston:

KEY CONCEPTS:
1. Kill Zones - High-probability trading sessions
   - London: 7:00-10:00 GMT
   - NY AM: 8:00-11:00 EST
   - NY PM: 13:00-16:00 EST
   - Asia: 0:00-3:00 GMT

2. Market Structure
   - Bullish: Higher highs, higher lows
   - Bearish: Lower highs, lower lows
   - MSS: Market Structure Shift confirms trend change

3. Order Blocks - Institutional order zones (last bearish/bullish candle before up/down move)

4. Fair Value Gaps - Imbalances between candles (gap between wick and body)

5. Liquidity Pools - Areas where stops accumulate (equal highs/lows, above/below swing points)

6. Premium/Discount - Above/below daily midpoint pricing

7. Silver Bullet - High-probability entries at specific times with confluence

8. OTE - Optimal Trade Entry using Fibonacci retracements (61.8%, 78.6%)

9. 2:00 AM Fade - Counter-trend strategy at 2:00 AM EST

10. 9:50/10:00 AM Reversal - NY session reversal patterns
`

export default function AIPage() {
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const { messages, addMessage, isProcessing, setProcessing, clearMessages } = useAIStore()
  
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])
  
  const handleSend = async (prompt?: string) => {
    const query = prompt || input
    if (!query.trim()) return
    
    addMessage('user', query)
    setInput('')
    setProcessing(true)
    setIsTyping(true)
    
    // Simulate AI response with ICT knowledge
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    let response = ''
    
    const q = query.toLowerCase()
    if (q.includes('trend') || q.includes('eurusd')) {
      response = `Based on current market structure analysis:

📊 **EURUSD TREND ANALYSIS**

**Market Structure:** BULLISH
- Price making higher highs and higher lows
- Last swing high broken - confirming uptrend
- Current trend favors long entries in discount zones

**Kill Zone Alignment:**
- London KZ showing bullish bias
- Price pulled back to 61.8% OTE level
- Order block identified at 1.0820-1.0830

**Bias:** BULLISH (70% confidence)
- Enter long on pullback to discount zone
- Stop below 1.0800
- Target: 1.0900 (previous high)

**Key Levels:**
- Resistance: 1.0880, 1.0900
- Support: 1.0830, 1.0800
- Midpoint: 1.0850`
    } else if (q.includes('kill zone') || q.includes('setup')) {
      response = `⏰ **TODAY'S KILL ZONE SETUPS**

**Current Active Zone:** London Kill Zone

**Bullish Setup:**
- Symbol: EURUSD
- Entry: Pullback to 1.0820-1.0830 (discount zone)
- SL: 1.0790 (below OB)
- TP: 1.0880 (previous high)
- Confidence: 85%
- Model: Kill Zone + FVG confluence

**Bearish Setup:**
- Symbol: GBPUSD
- Entry: 1.2680 (equal highs)
- SL: 1.2710
- TP: 1.2620
- Confidence: 75%
- Model: Silver Bullet

**NY AM Preview:**
- High probability long entries after 10:00 AM close
- Look for 9:50 AM reversal pattern
- Trade toward premium (above daily mid)

Stay patient and wait for price to come to your levels!`
    } else if (q.includes('mss') || q.includes('market structure shift')) {
      response = `📚 **MARKET STRUCTURE SHIFT (MSS)**

MSS is one of ICT's most powerful concepts for confirming trend changes.

**Definition:**
MSS occurs when price displaces (breaks strongly) beyond the last swing point in the direction of the new trend, AFTER establishing a change in character.

**How to Identify MSS:**
1. Price makes a higher high (bullish) or lower low (bearish)
2. Next pullback fails to make a new lower low (bullish) or higher high (bearish)
3. Strong displacement candle breaks above/below the last swing point
4. This confirms institutional involvement in the new direction

**Trading MSS:**
- Wait for MSS confirmation
- Enter on retest of the broken level
- Stop below the last swing low/high
- Target: Next major structure level

**Example:**
- Bearish trend: Price makes lower highs
- MSS: Price breaks above last lower high
- Entry: Long on retest of broken level
- SL: Below the swing high that was broken

This is how you catch major trend changes!`
    } else if (q.includes('ote') || q.includes('fibonacci') || q.includes('optimal trade')) {
      response = `📐 **OPTIMAL TRADE ENTRY (OTE)**

OTE uses Fibonacci retracements to find high-probability entries.

**Key Levels:**
- 61.8% (Golden Ratio) - Primary OTE level
- 78.6% - Secondary level
- 88.6% - Deep entry (needs confluence)

**How to Draw:**
1. Identify the last swing high and low
2. Use the move from low to high for long setups
3. Apply Fibonacci from low to high
4. Look for price to pull back to 61.8% or 78.6%

**Best Practices:**
- Combine with order blocks at same level
- Wait for candle confirmation at OTE
- Higher timeframe OTE more reliable
- Use in kill zones for best results

**Example Trade:**
- Swing Low: 1.0800
- Swing High: 1.0900
- Move: 100 pips
- 61.8% OTE: 1.0800 + 61.8 = 1.0838
- Entry: 1.0835-1.0840 zone
- SL: 1.0790 (below 78.6%)
- TP: 1.0890

Trade the pullback, not the breakout!`
    } else {
      response = `🤖 **ICT AI Assistant**

I'm powered by ICT methodology knowledge. I can help you with:

• Market structure and trend analysis
• Kill zone timing and setups
• Order block identification
• Fair Value Gap (FVG) trading
• OTE Fibonacci entries
• Liquidity pool strategies
• Silver bullet setups
• 9:50/10:00 AM reversal trading

Ask me about any ICT concept or request a market analysis!

Example questions:
- "Analyze EURUSD trend"
- "What are today's best setups?"
- "Explain how to trade FVGs"
- "What is the Silver Bullet strategy?"
${ictKnowledge.slice(0, 500)}...`
    }
    
    addMessage('assistant', response)
    setProcessing(false)
    setIsTyping(false)
  }
  
  return (
    <div className="h-screen flex flex-col bg-[#0a0e17]">
      {/* Header */}
      <div className="border-b border-zinc-800 px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-cyan-500 to-purple-600 rounded-xl">
            <Bot className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold">ICT AI Assistant</h1>
            <p className="text-sm text-zinc-500">Powered by GPT-4 with ICT methodology knowledge</p>
          </div>
          <div className="ml-auto">
            <button 
              onClick={clearMessages}
              className="px-3 py-1.5 text-xs text-zinc-500 hover:text-zinc-300 transition-colors"
            >
              Clear Chat
            </button>
          </div>
        </div>
      </div>
      
      {/* Quick Prompts */}
      <div className="px-6 py-3 border-b border-zinc-800">
        <p className="text-xs text-zinc-500 mb-2">Quick Questions</p>
        <div className="flex gap-2 overflow-x-auto pb-1">
          {quickPrompts.map((q, i) => (
            <button
              key={i}
              onClick={() => handleSend(q.query)}
              className="flex items-center gap-2 px-3 py-2 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 hover:border-zinc-600 rounded-lg text-xs text-zinc-300 whitespace-nowrap transition-all"
            >
              <q.icon className="w-4 h-4 text-cyan-400" />
              {q.text}
            </button>
          ))}
        </div>
      </div>
      
      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages.length === 0 && (
          <div className="text-center py-12">
            <div className="inline-flex p-4 bg-cyan-500/10 rounded-full mb-4">
              <Sparkles className="w-8 h-8 text-cyan-400" />
            </div>
            <h2 className="text-xl font-bold text-white mb-2">Welcome to ICT AI</h2>
            <p className="text-zinc-400 max-w-md mx-auto">
              Ask me anything about ICT methodology, get market analysis, or learn trading concepts.
            </p>
          </div>
        )}
        
        {messages.map((msg, i) => (
          <div 
            key={i}
            className={clsx(
              'flex gap-3',
              msg.role === 'user' ? 'justify-end' : 'justify-start'
            )}
          >
            {msg.role === 'assistant' && (
              <div className="w-8 h-8 bg-gradient-to-br from-cyan-500 to-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
                <Bot className="w-5 h-5 text-white" />
              </div>
            )}
            <div className={clsx(
              'max-w-2xl px-4 py-3 rounded-xl',
              msg.role === 'user' 
                ? 'bg-cyan-500/20 text-cyan-100' 
                : 'bg-zinc-800/80 text-zinc-100'
            )}>
              <div className="whitespace-pre-wrap text-sm leading-relaxed">
                {msg.content}
              </div>
            </div>
            {msg.role === 'user' && (
              <div className="w-8 h-8 bg-zinc-700 rounded-lg flex items-center justify-center flex-shrink-0">
                <span className="text-xs font-bold">Y</span>
              </div>
            )}
          </div>
        ))}
        
        {isTyping && (
          <div className="flex gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-cyan-500 to-purple-600 rounded-lg flex items-center justify-center">
              <Bot className="w-5 h-5 text-white" />
            </div>
            <div className="bg-zinc-800/80 px-4 py-3 rounded-xl">
              <div className="flex gap-1">
                <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>
      
      {/* Input */}
      <div className="p-6 border-t border-zinc-800">
        <div className="flex gap-3">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask about ICT concepts, market analysis..."
            className="flex-1 px-4 py-3 bg-zinc-900 border border-zinc-700 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/20 transition-all"
          />
          <button
            onClick={() => handleSend()}
            disabled={!input.trim() || isProcessing}
            className="px-6 py-3 bg-cyan-500 hover:bg-cyan-400 disabled:bg-zinc-700 disabled:cursor-not-allowed rounded-xl font-medium transition-colors flex items-center gap-2"
          >
            {isProcessing ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Send className="w-5 h-5" />
            )}
            Send
          </button>
        </div>
      </div>
    </div>
  )
}
