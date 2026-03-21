'use client'

import { useState, useRef, useEffect } from 'react'

interface Message { role: 'user' | 'ai'; content: string }

export default function AIPage() {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'ai', content: 'Hello! I\'m your ICT trading assistant. Ask me about order blocks, FVGs, kill zones, or any ICT concepts.' }
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  useEffect(() => scrollToBottom(), [messages])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || loading) return

    const userMessage = input.trim()
    setMessages((prev) => [...prev, { role: 'user', content: userMessage }])
    setInput('')
    setLoading(true)

    // Demo AI response
    setTimeout(() => {
      let response = 'I\'m analyzing the market structure for you. Based on ICT methodology, look for order blocks in the LNZ and NY kill zones for high probability setups.'
      if (userMessage.toLowerCase().includes('order block')) response = 'Order blocks are zones where institutional traders have placed large orders. Look for the last bullish/bearish candle before a strong move. These act as demand/supply zones.'
      else if (userMessage.toLowerCase().includes('fvg')) response = 'Fair Value Gaps (FVGs) are areas where price moved too fast, creating imbalance. These gaps often get filled and act as reversal zones.'
      else if (userMessage.toLowerCase().includes('kill zone')) response = 'Kill zones are high-probability times for trading. LNZ (07-10 UTC) and NY AM (12-15 UTC) are the most liquid. Trade with the trend during these times.'
      
      setMessages((prev) => [...prev, { role: 'ai', content: response }])
      setLoading(false)
    }, 1000)
  }

  return (
    <div className="min-h-screen bg-[#0a0e17] text-white flex flex-col">
      <header className="p-4 lg:p-6 border-b border-zinc-800">
        <h1 className="text-2xl font-bold">AI Trading Assistant</h1>
        <p className="text-sm text-zinc-500">ICT Methodology Expert</p>
      </header>

      <div className="flex-1 overflow-y-auto p-4 lg:p-6 space-y-4">
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] rounded-2xl px-4 py-3 ${msg.role === 'user' ? 'bg-cyan-500 text-black' : 'bg-[#111827] border border-zinc-800'}`}>
              <p className="text-sm">{msg.content}</p>
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-[#111827] border border-zinc-800 rounded-2xl px-4 py-3">
              <div className="flex gap-1"><span className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" /><span className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce delay-100" /><span className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce delay-200" /></div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSubmit} className="p-4 lg:p-6 border-t border-zinc-800">
        <div className="flex gap-3">
          <input type="text" value={input} onChange={(e) => setInput(e.target.value)} placeholder="Ask about ICT concepts..."
            className="flex-1 bg-[#111827] border border-zinc-800 rounded-xl px-4 py-3 text-white placeholder-zinc-500 focus:outline-none focus:border-cyan-500/50" />
          <button type="submit" disabled={loading} className="px-6 py-3 bg-cyan-500 hover:bg-cyan-400 disabled:opacity-50 text-black font-semibold rounded-xl transition-all">Send</button>
        </div>
      </form>
    </div>
  )
}
