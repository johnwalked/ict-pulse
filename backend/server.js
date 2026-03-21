/**
 * ICT Pulse - MT5 WebSocket Bridge Server
 * 
 * This server acts as a bridge between the web frontend and MetaTrader 5.
 * It receives WebSocket connections from clients and communicates with MT5
 * using the MetaApi SDK or a custom MT5 bridge.
 */

const WebSocket = require('ws')

const PORT = process.env.PORT || 8080
const wss = new WebSocket.Server({ port: PORT })

// Demo mode data generation
let demoMode = true
const subscribedClients = new Set()

// Generate realistic OHLC data
function generateOHLC(symbol, timeframe = '1H') {
  const basePrices = {
    'EURUSD': 1.0850,
    'GBPUSD': 1.2730,
    'USDJPY': 148.50,
    'XAUUSD': 2045.00,
    'BTCUSD': 42500.00,
  }
  
  const basePrice = basePrices[symbol] || 1.0
  const volatility = symbol === 'XAUUSD' ? 5 : symbol === 'BTCUSD' ? 200 : 0.002
  
  const open = basePrice + (Math.random() - 0.5) * volatility
  const close = open + (Math.random() - 0.5) * volatility
  const high = Math.max(open, close) + Math.random() * volatility * 0.5
  const low = Math.min(open, close) - Math.random() * volatility * 0.5
  
  return {
    symbol,
    timeframe,
    time: Date.now(),
    open: Number(open.toFixed(5)),
    high: Number(high.toFixed(5)),
    low: Number(low.toFixed(5)),
    close: Number(close.toFixed(5)),
    volume: Math.floor(Math.random() * 1000) + 500
  }
}

// Generate order flow data
function generateOrderFlow(symbol) {
  const bidVol = Math.floor(Math.random() * 1000) + 500
  const askVol = Math.floor(Math.random() * 1000) + 500
  
  return {
    symbol,
    time: Date.now(),
    bidVolume: bidVol,
    askVolume: askVol,
    delta: bidVol - askVol,
    price: 1.0850 + (Math.random() - 0.5) * 0.001
  }
}

// Generate ICT signals
function generateICTSignal() {
  const signals = [
    {
      type: 'Bullish FVG',
      symbol: 'EURUSD',
      timeframe: '1H',
      direction: 'bullish',
      entryPrice: 1.0845,
      sl: 1.0810,
      tp: 1.0920,
      strength: Math.floor(Math.random() * 20) + 70
    },
    {
      type: 'Bearish Order Block',
      symbol: 'GBPUSD',
      timeframe: '4H',
      direction: 'bearish',
      entryPrice: 1.2760,
      sl: 1.2790,
      tp: 1.2700,
      strength: Math.floor(Math.random() * 20) + 65
    },
    {
      type: 'Liquidity Grab',
      symbol: 'USDJPY',
      timeframe: '15m',
      direction: 'bearish',
      entryPrice: 148.80,
      sl: 149.00,
      tp: 148.20,
      strength: Math.floor(Math.random() * 20) + 60
    }
  ]
  
  return signals[Math.floor(Math.random() * signals.length)]
}

console.log(`🚀 ICT Pulse MT5 Bridge Server running on port ${PORT}`)
console.log(`📊 Demo mode: ${demoMode ? 'ENABLED' : 'DISABLED'}`)

wss.on('connection', (ws) => {
  console.log('Client connected')
  subscribedClients.add(ws)
  
  ws.on('message', (message) => {
    try {
      const data = JSON.parse(message)
      
      switch (data.type) {
        case 'subscribe':
          console.log(`Client subscribed to: ${data.symbols.join(', ')}`)
          ws.symbols = data.symbols
          break
          
        case 'ping':
          ws.send(JSON.stringify({ type: 'pong', time: Date.now() }))
          break
          
        case 'trade':
          console.log('Trade signal received:', data)
          // Handle trade signals from clients
          break
      }
    } catch (error) {
      console.error('Error parsing message:', error)
    }
  })
  
  ws.on('close', () => {
    console.log('Client disconnected')
    subscribedClients.delete(ws)
  })
  
  // Send welcome message
  ws.send(JSON.stringify({
    type: 'connected',
    message: 'ICT Pulse MT5 Bridge connected',
    demoMode: demoMode
  }))
})

// Broadcast OHLC data to all subscribed clients
setInterval(() => {
  if (subscribedClients.size === 0) return
  
  const symbols = ['EURUSD', 'GBPUSD', 'USDJPY', 'XAUUSD']
  
  subscribedClients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      const symbol = client.symbols?.[0] || symbols[Math.floor(Math.random() * symbols.length)]
      
      // Send OHLC data
      client.send(JSON.stringify({
        type: 'ohlc',
        data: generateOHLC(symbol)
      }))
      
      // Send order flow every 5th tick
      if (Math.random() > 0.8) {
        client.send(JSON.stringify({
          type: 'orderflow',
          data: generateOrderFlow(symbol)
        }))
      }
      
      // Send signals occasionally
      if (Math.random() > 0.95) {
        client.send(JSON.stringify({
          type: 'signal',
          data: generateICTSignal()
        }))
      }
    }
  })
}, 1000)

console.log(`
╔═══════════════════════════════════════════════════════════╗
║                                                           ║
║   ICT PULSE MT5 BRIDGE                                    ║
║   WebSocket Server for MetaTrader 5 Integration           ║
║                                                           ║
║   Features:                                               ║
║   • Real-time OHLC data streaming                         ║
║   • Order flow analysis                                   ║
║   • ICT signal generation                                 ║
║   • Multi-symbol support                                  ║
║                                                           ║
║   Documentation: https://docs.ictpulse.trade              ║
║                                                           ║
╚═══════════════════════════════════════════════════════════╝
`)
