import { NextRequest, NextResponse } from 'next/server'

// OpenAI API integration for AI chat
// Note: In production, use environment variables for API key

const OPENAI_API_KEY = process.env.OPENAI_API_KEY || ''

interface Message {
  role: 'system' | 'user' | 'assistant'
  content: string
}

// ICT Trading System Prompt
const ICT_SYSTEM_PROMPT = `You are an AI assistant specialized in ICT (Inner Circle Trader) trading methodology, founded by Michael Huddleston. 

Your expertise includes:
- Market Structure Analysis (BOS, ChoCH, HH/HL, LH/LL patterns)
- Order Blocks identification and trading
- Fair Value Gaps (FVG) detection
- Liquidity Pools and stop hunt identification
- Optimal Trade Entries (OTE) using Fibonacci
- Silver Bullet trading strategy
- Smart Money Concepts (SMC)
- Break of Structure (BOS) and Change of Character (Choch)

You provide:
1. Educational explanations of ICT concepts
2. Trade setup analysis based on described chart patterns
3. Risk management advice
4. Market structure interpretation
5. Trade idea generation aligned with ICT methodology

Important guidelines:
- Always emphasize proper risk management (1-2% per trade max)
- Explain your reasoning using ICT terminology
- Be clear when a setup is high probability vs speculative
- Remind users that AI analysis is for educational purposes
- Do not provide specific financial advice

When analyzing setups, reference:
- Timeframe context (higher timeframe has more authority)
- Order flow and delta analysis
- Recent swing highs/lows and liquidity zones
- Order blocks and FVGs as entry zones
- Fibonacci retracements (61.8%, 78.6% are key levels)

Be concise but thorough. Use bullet points for clarity when appropriate.`

export async function POST(request: NextRequest) {
  try {
    const { messages, userContext } = await request.json()

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: 'Invalid messages format' },
        { status: 400 }
      )
    }

    // If no API key, return a demo response
    if (!OPENAI_API_KEY) {
      const lastMessage = messages[messages.length - 1]?.content || ''
      const demoResponse = generateDemoResponse(lastMessage, userContext)
      
      return NextResponse.json({
        output: demoResponse,
        usage: { total_tokens: 0 },
      })
    }

    // Build messages array for OpenAI
    const openAIMessages: Message[] = [
      { role: 'system', content: ICT_SYSTEM_PROMPT },
    ]

    // Add user context if provided
    if (userContext) {
      openAIMessages.push({
        role: 'system',
        content: `Current market context:
- Symbol: ${userContext.symbol || 'EURUSD'}
- Timeframe: ${userContext.timeframe || '1H'}
- Trading Mode: ${userContext.tradingMode || 'swing'}
- Current Price: ${userContext.currentPrice || 'N/A'}
- Recent Patterns: ${userContext.recentPatterns?.join(', ') || 'None detected'}`,
      })
    }

    // Add conversation history
    messages.forEach((msg: { role: string; content: string }) => {
      openAIMessages.push({
        role: msg.role as 'user' | 'assistant',
        content: msg.content,
      })
    })

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: openAIMessages,
        max_tokens: 1000,
        temperature: 0.7,
      }),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error?.message || 'OpenAI API error')
    }

    const data = await response.json()
    
    return NextResponse.json({
      output: data.choices[0]?.message?.content || 'No response generated',
      usage: data.usage,
    })
  } catch (error) {
    console.error('AI API Error:', error)
    return NextResponse.json(
      { error: 'Failed to process AI request' },
      { status: 500 }
    )
  }
}

function generateDemoResponse(userMessage: string, userContext: any): string {
  const lowerMessage = userMessage.toLowerCase()
  
  // Pattern matching for demo responses
  if (lowerMessage.includes('order block')) {
    return `**Order Block Analysis**

An Order Block (OB) is a key ICT concept representing a zone where institutional traders have placed significant orders before a strong directional move.

**Characteristics:**
- The last 5-10 candles before a strong bullish/bearish candle
- Usually has a full body (not a doji)
- Often coincides with high volume

**Trading an Order Block:**
1. Wait for price to return to the OB zone
2. Look for confirmation (rejection candle, FVG, etc.)
3. Entry: At the OB with stop below/above
4. Target: Next structure high/low or FVG

**Example for EURUSD:**
If we see a bullish OB at 1.0820-1.0830 on the 1H, and price returns to this zone, it's a potential long entry with:
- Stop Loss: Below the OB low (1.0810)
- Take Profit: Next swing high or FVG

Would you like me to explain Fair Value Gaps or Market Structure next?`
  }
  
  if (lowerMessage.includes('fvg') || lowerMessage.includes('fair value gap')) {
    return `**Fair Value Gap (FVG) Analysis**

A Fair Value Gap (FVG) is an imbalance in price where a gap exists between the body of one candle and the wick of another. This represents areas where price moved too quickly, leaving an unfilled gap.

**Types:**
- **Bullish FVG**: Candle 2's low is above Candle 1's high
- **Bearish FVG**: Candle 2's high is below Candle 1's low

**Trading FVGs:**
1. **Fresh FVG**: Just formed, high probability of being filled
2. **Partial Fill**: Partially filled, still valid
3. **Balanced**: Fully filled, loses significance

**Entry Strategies:**
- Aggressive: Enter immediately when price enters FVG
- Conservative: Wait for price to fill FVG, then look for reversal candles

**Risk Management:**
- Stop beyond the FVG
- Target next structure level

FVGs are powerful because institutions create them when sweeping liquidity before continuing in the original direction.`
  }
  
  if (lowerMessage.includes('market structure') || lowerMessage.includes('bos')) {
    return `**Market Structure Analysis**

Market Structure is the foundation of ICT methodology. It helps identify the trend direction and potential reversal points.

**Key Concepts:**

1. **Swing Highs & Lows**
   - Higher High (HH): Higher peak than previous
   - Higher Low (HL): Higher trough than previous
   - Lower High (LH): Lower peak than previous
   - Lower Low (LL): Lower trough than previous

2. **Break of Structure (BOS)**
   - When price breaks above previous HH = Bullish BOS
   - When price breaks below previous LL = Bearish BOS
   - Confirms trend continuation

3. **Change of Character (ChoCH)**
   - Trend reversal signal
   - When HH fails or HL fails in an uptrend
   - Often accompanied by momentum divergence

**Trend Identification:**
- **Uptrend**: HH, HL pattern
- **Downtrend**: LH, LL pattern
- **Ranging**: Equal highs/lows

**Trading with Structure:**
- In uptrend: Buy from HLs, OBs, FVGs
- In downtrend: Sell from LHs, OBs, FVGs
- Avoid counter-trend trades unless structure breaks

Would you like me to analyze the current structure on a specific pair?`
  }
  
  if (lowerMessage.includes('strategy') || lowerMessage.includes('trade idea')) {
    const symbol = userContext?.symbol || 'EURUSD'
    const timeframe = userContext?.timeframe || '4H'
    
    return `**${symbol} ${timeframe} Trade Setup**

Based on current market conditions:

**Bias:** Need to see recent price action to determine direction. 

**Potential Bullish Scenario:**
- Wait for price to pull back to an order block zone
- Look for a bullish FVG forming on lower timeframes
- Entry on retest of the FVG with confirmation candle

**Potential Bearish Scenario:**
- If price makes a failed HH (Lower High)
- Look for liquidity sweep above recent highs
- Short when price rejects from OTE Fibonacci levels

**Key Levels to Watch:**
- Resistance: Previous swing highs
- Support: Order blocks, FVGs
- Fibonacci: 61.8% and 78.6% retracements

**Risk Management:**
- Risk no more than 1-2% of account
- Stop beyond structure
- R:R minimum 1:2

**Next Steps:**
1. Identify current market structure (HH/HL or LH/LL)
2. Mark order blocks on your chart
3. Wait for pullback to OB with FVG
4. Execute on lower timeframe confirmation

Would you like a deeper analysis of any specific aspect?`
  }
  
  // Default response
  return `**ICT Trading Assistant**

I'm here to help you understand and apply ICT (Inner Circle Trader) methodology to your trading.

**I can assist with:**

🔹 **Market Structure** - HH/HL, LH/LL, BOS, ChoCH analysis
🔹 **Order Blocks** - Identification and trading strategies
🔹 **Fair Value Gaps** - Detecting and trading imbalances
🔹 **Liquidity Pools** - Stop hunts, equal highs/lows
🔹 **OTE Fibonacci** - Optimal Trade Entry techniques
🔹 **Silver Bullet** - Premium/discount zone trades
🔹 **Trade Setup Analysis** - Evaluating potential trades

**Example Questions:**
- "What is an order block?"
- "Explain Fair Value Gap trading"
- "Analyze the market structure on EURUSD"
- "Give me a trade idea for GBPUSD"

What would you like to learn about or discuss?`
}
