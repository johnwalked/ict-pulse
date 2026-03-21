// Real-time trading WebSocket client

type MessageHandler = (data: any) => void

class TradingClient {
  private ws: WebSocket | null = null
  private handlers: Map<string, Set<MessageHandler>> = new Map()
  private reconnectAttempts = 0
  private maxReconnects = 5
  private reconnectDelay = 3000
  private url: string

  constructor(url: string = 'ws://localhost:3001') {
    this.url = url
  }

  connect(platform: 'ctrader' | 'ninjatrader', credentials: any) {
    return new Promise((resolve, reject) => {
      try {
        this.ws = new WebSocket(this.url)

        this.ws.onopen = () => {
          console.log('Connected to trading server')
          this.reconnectAttempts = 0
          this.send({ type: 'connect', payload: { platform, credentials } })
          resolve(true)
        }

        this.ws.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data)
            this.notifyHandlers(data.type, data)
            if (data.type === 'connection_status') resolve(data)
          } catch (e) {
            console.error('Failed to parse message:', e)
          }
        }

        this.ws.onerror = (error) => {
          console.error('WebSocket error:', error)
          reject(error)
        }

        this.ws.onclose = () => {
          console.log('Disconnected from trading server')
          this.attemptReconnect()
        }
      } catch (err) {
        reject(err)
      }
    })
  }

  private attemptReconnect() {
    if (this.reconnectAttempts < this.maxReconnects) {
      this.reconnectAttempts++
      console.log(`Reconnecting... attempt ${this.reconnectAttempts}`)
      setTimeout(() => this.connect, this.reconnectDelay)
    }
  }

  disconnect() {
    if (this.ws) {
      this.ws.close()
      this.ws = null
    }
  }

  send(data: any) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(data))
    }
  }

  on(type: string, handler: MessageHandler) {
    if (!this.handlers.has(type)) {
      this.handlers.set(type, new Set())
    }
    this.handlers.get(type)!.add(handler)
  }

  off(type: string, handler: MessageHandler) {
    this.handlers.get(type)?.delete(handler)
  }

  private notifyHandlers(type: string, data: any) {
    this.handlers.get(type)?.forEach(handler => handler(data))
    this.handlers.get('*')?.forEach(handler => handler(data))
  }

  // Trading methods
  subscribe(symbol: string, timeframe: string) {
    this.send({ type: 'subscribe', payload: { symbol, timeframe } })
  }

  unsubscribe(symbol: string, timeframe: string) {
    this.send({ type: 'unsubscribe', payload: { symbol, timeframe } })
  }

  getOHLC(symbol: string, timeframe: string) {
    this.send({ type: 'get_ohlc', payload: { symbol, timeframe } })
  }

  getPositions() {
    this.send({ type: 'get_positions' })
  }

  getAccount() {
    this.send({ type: 'get_account' })
  }

  executeOrder(order: {
    symbol: string
    side: 'BUY' | 'SELL'
    volume?: number
    type?: 'MARKET' | 'LIMIT' | 'STOP'
    price?: number
    stopLoss?: number
    takeProfit?: number
    comment?: string
  }) {
    this.send({ type: 'execute_order', payload: order })
  }

  cancelOrder(ticket: string) {
    this.send({ type: 'cancel_order', payload: { ticket } })
  }
}

export const tradingClient = new TradingClient()
export default tradingClient
