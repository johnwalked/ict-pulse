import express from 'express'
import { createServer } from 'http'
import { WebSocketServer } from 'ws'
import cors from 'cors'
import dotenv from 'dotenv'
import { CTraderAdapter } from './adapters/ctrader.js'
import { NinjaTraderAdapter } from './adapters/ninjatrader.js'
import { TradingEngine } from './services/engine.js'

dotenv.config()

const app = express()
const server = createServer(app)
const wss = new WebSocketServer({ server })

app.use(cors())
app.use(express.json())

// Trading engine instance
const engine = new TradingEngine()

// Platform adapters
const ctrader = new CTraderAdapter()
const ninjatrader = new NinjaTraderAdapter()

// WebSocket clients
const clients = new Set()

wss.on('connection', (ws) => {
  clients.add(ws)
  console.log('Client connected. Total:', clients.size)
  
  ws.on('message', (message) => {
    try {
      const data = JSON.parse(message)
      handleMessage(ws, data)
    } catch (e) {
      console.error('Invalid message:', e)
    }
  })
  
  ws.on('close', () => {
    clients.delete(ws)
    console.log('Client disconnected. Total:', clients.size)
  })
})

function broadcast(data) {
  const msg = JSON.stringify(data)
  clients.forEach(client => {
    if (client.readyState === 1) client.send(msg)
  })
}

// Message handler
async function handleMessage(ws, data) {
  const { type, payload } = data
  
  switch (type) {
    case 'connect':
      await handleConnect(ws, payload)
      break
    case 'subscribe':
      engine.subscribe(payload.symbol, payload.timeframe)
      break
    case 'unsubscribe':
      engine.unsubscribe(payload.symbol, payload.timeframe)
      break
    case 'execute_order':
      await engine.executeOrder(payload)
      break
    case 'get_ohlc':
      const ohlc = engine.getOHLC(payload.symbol, payload.timeframe)
      ws.send(JSON.stringify({ type: 'ohlc_response', data: ohlc }))
      break
    case 'get_positions':
      const positions = engine.getPositions()
      ws.send(JSON.stringify({ type: 'positions_response', data: positions }))
      break
    case 'get_account':
      const account = engine.getAccountInfo()
      ws.send(JSON.stringify({ type: 'account_response', data: account }))
      break
  }
}

async function handleConnect(ws, payload) {
  const { platform, credentials } = payload
  
  try {
    let adapter
    if (platform === 'ctrader') {
      adapter = ctrader
      await ctrader.connect(credentials)
    } else if (platform === 'ninjatrader') {
      adapter = ninjatrader
      await ninjatrader.connect(credentials)
    }
    
    engine.setAdapter(adapter)
    
    ws.send(JSON.stringify({
      type: 'connection_status',
      status: 'connected',
      platform
    }))
    
    broadcast({
      type: 'platform_status',
      status: 'connected',
      platform
    })
  } catch (error) {
    ws.send(JSON.stringify({
      type: 'connection_error',
      error: error.message
    }))
  }
}

// REST API routes
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: Date.now() })
})

app.get('/api/symbols', (req, res) => {
  res.json(engine.getAvailableSymbols())
})

app.get('/api/ohlc/:symbol/:timeframe', (req, res) => {
  const { symbol, timeframe } = req.params
  res.json(engine.getOHLC(symbol, timeframe))
})

app.get('/api/positions', (req, res) => {
  res.json(engine.getPositions())
})

app.get('/api/account', (req, res) => {
  res.json(engine.getAccountInfo())
})

app.post('/api/order', async (req, res) => {
  try {
    const result = await engine.executeOrder(req.body)
    res.json(result)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

app.post('/api/order/cancel/:ticket', async (req, res) => {
  try {
    const result = await engine.cancelOrder(req.params.ticket)
    res.json(result)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

app.get('/api/calendar', async (req, res) => {
  // ICT economic calendar
  res.json(engine.getEconomicCalendar())
})

app.get('/api/sessions', (req, res) => {
  res.json(engine.getSessionTimes())
})

// Start server
const PORT = process.env.PORT || 3001
server.listen(PORT, () => {
  console.log(`🚀 ICT Pulse Server running on port ${PORT}`)
  console.log(`📊 WebSocket ready for connections`)
})

export { app, server, wss }
