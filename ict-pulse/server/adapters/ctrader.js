/**
 * CTrader Open API Adapter
 * Documentation: https://ctrader.com/open-api/
 */

export class CTraderAdapter {
  constructor() {
    this.host = 'demo.ctraderapi.com'
    this.port = 5035
    this.ws = null
    this.connected = false
    this.token = ''
  }

  async connect(credentials) {
    this.token = credentials.token || process.env.CTRADER_TOKEN
    
    return new Promise((resolve, reject) => {
      try {
        this.ws = new WebSocket(`wss://${this.host}:${this.port}`)

        this.ws.on('open', () => {
          // Authenticate
          this.send({
            type: 'auth',
            data: {
              ctidTraderAccountId: credentials.accountId,
              token: this.token
            }
          })
        })

        this.ws.on('message', (data) => {
          const msg = JSON.parse(data)
          this.handleMessage(msg)
        })

        this.ws.on('close', () => {
          this.connected = false
          console.log('CTrader disconnected')
        })

        this.ws.on('error', (err) => {
          reject(err)
        })

        // Timeout
        setTimeout(() => {
          if (!this.connected) reject(new Error('Connection timeout'))
        }, 5000)
      } catch (err) {
        reject(err)
      }
    })
  }

  send(data) {
    if (this.ws && this.connected) {
      this.ws.send(JSON.stringify(data))
    }
  }

  handleMessage(msg) {
    switch (msg.type) {
      case 'auth':
        if (msg.data.success) {
          this.connected = true
          // Subscribe to symbols
          this.send({ type: 'subscribe', symbols: ['EURUSD', 'GBPUSD', 'USDJPY', 'XAUUSD'] })
        }
        break
      case 'ohlc':
        this.emit('ohlc', msg.data)
        break
      case 'tick':
        this.emit('tick', msg.data)
        break
      case 'order':
        this.emit('order', msg.data)
        break
      case 'position':
        this.emit('position', msg.data)
        break
    }
  }

  on(event, callback) {
    this.events = this.events || {}
    this.events[event] = callback
  }

  emit(event, data) {
    if (this.events && this.events[event]) {
      this.events[event](data)
    }
  }

  async getOHLC(symbol, timeframe, count = 100) {
    this.send({
      type: 'get_ohlc',
      data: { symbol, timeframe, count }
    })
  }

  async getPositions() {
    this.send({ type: 'get_positions' })
  }

  async placeOrder(order) {
    this.send({
      type: 'place_order',
      data: {
        symbol: order.symbol,
        volume: order.volume,
        orderType: order.type, // MARKET, LIMIT, STOP
        side: order.side, // BUY, SELL
        price: order.price,
        stopLoss: order.sl,
        takeProfit: order.tp
      }
    })
  }

  async closePosition(ticket) {
    this.send({
      type: 'close_position',
      data: { ticket }
    })
  }

  async modifyOrder(ticket, modifications) {
    this.send({
      type: 'modify_order',
      data: { ticket, ...modifications }
    })
  }

  disconnect() {
    if (this.ws) {
      this.ws.close()
    }
  }
}
