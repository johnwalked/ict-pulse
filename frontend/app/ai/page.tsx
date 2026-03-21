'use client'

import { useState, useRef, useEffect } from 'react'
import { Bot, Send, Sparkles, TrendingUp, BarChart3, HelpCircle, Loader2 } from 'lucide-react'
import { clsx } from 'clsx'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: number
}

const quickPrompts = [
  { icon: TrendingUp, label: 'Analyze EURUSD setup', prompt: 'Analyze the current EURUSD chart for ICT trading opportunities' },
  { icon: BarChart3, label: 'Explain Order Block', prompt: 'What is an ICT Order Block and how do I trade it?' },
  { icon: HelpCircle, label: 'Trading psychology', prompt: 'Tips for maintaining discipline in trading' },
]

export default function AIPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: 'Welcome to ICT Pulse AI! I\'m trained on ICT methodology by Michael Huddleston. I can help you with:\n\n• Chart analysis using ICT concepts\n• Explaining market structure, order blocks, FVGs\n• Trade setups and entry timing\n• Risk management strategies\n\nWhat would you like to explore?',
      timestamp: Date.now()
    }
  ])
  const [input, setInput] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSend = async () => {
    if (!input.trim() || isProcessing) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: Date.now()
    }

    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsProcessing(true)

    // Simulate AI response
    setTimeout(() => {
      const responses = [
        "Based on ICT methodology, I can see a potential bullish setup forming on EURUSD. The 1-hour timeframe shows a break of market structure to the upside, with a newly formed bullish order block in the 1.0820-1.0830 zone. Fair value gaps are being filled, which is typical before continuation moves.",
        "For the current market conditions, I'd focus on the London and NY sessions for optimal entries. The killzones are where institutional activity is highest. Look for liquidity grabs followed by efficient price action rejections.",
        "Remember the core ICT principles: Trade from the high timeframe to lower timeframes, always trade in the direction of the trend, and respect the killzones. Your entries should come from order blocks or fair value gaps.",
      ]
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: responses[Math.floor(Math.random() * responses.length)],
        timestamp: Date.now()
      }
      setMessages(prev => [...prev, aiMessage])
      setIsProcessing(false)
    }, 1500)
  }

  const handleQuickPrompt = (prompt: string) => {
    setInput(prompt)
  }

  return (
    <div className="min-h-screen bg-bg-primary flex flex-col">
      <div className="flex-1 max-w-[1000px] w-full mx-auto p-6 flex flex-col">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-indigo-600 rounded-xl">
            <Bot className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-text-primary font-display">
              ICT AI Assistant
            </h1>
            <p className="text-text-secondary">
              Powered by ICT methodology • Michael Huddleston concepts
            </p>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto mb-4 space-y-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={clsx(
                'flex gap-3',
                msg.role === 'user' && 'flex-row-reverse'
              )}
            >
              <div className={clsx(
                'w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0',
                msg.role === 'assistant' ? 'bg-indigo-600' : 'bg-emerald-600'
              )}>
                {msg.role === 'assistant' ? (
                  <Bot className="w-5 h-5 text-white" />
                ) : (
                  <Sparkles className="w-5 h-5 text-white" />
                )}
              </div>
              <div className={clsx(
                'p-4 rounded-2xl max-w-[80%]',
                msg.role === 'assistant' 
                  ? 'bg-bg-secondary border border-border text-text-primary' 
                  : 'bg-indigo-600 text-white'
              )}>
                <p className="whitespace-pre-wrap text-sm leading-relaxed">{msg.content}</p>
              </div>
            </div>
          ))}
          {isProcessing && (
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <div className="p-4 rounded-2xl bg-bg-secondary border border-border">
                <Loader2 className="w-5 h-5 text-indigo-400 animate-spin" />
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="mb-4 flex flex-wrap gap-2">
          {quickPrompts.map((qp, i) => (
            <button
              key={i}
              onClick={() => handleQuickPrompt(qp.prompt)}
              className="flex items-center gap-2 px-3 py-2 bg-bg-secondary border border-border rounded-lg text-text-secondary hover:text-text-primary hover:border-indigo-500/50 transition-colors text-sm"
            >
              <qp.icon className="w-4 h-4" />
              {qp.label}
            </button>
          ))}
        </div>

        <div className="bg-bg-secondary border border-border rounded-2xl p-4">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), handleSend())}
            placeholder="Ask about ICT concepts, chart analysis, or trading strategies..."
            className="w-full bg-transparent text-text-primary placeholder:text-text-secondary resize-none outline-none min-h-[60px]"
            rows={2}
          />
          <div className="flex items-center justify-between pt-3 border-t border-border/50">
            <span className="text-text-secondary text-xs">
              Press Enter to send, Shift + Enter for new line
            </span>
            <button
              onClick={handleSend}
              disabled={!input.trim() || isProcessing}
              className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
            >
              <Send className="w-4 h-4" />
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
