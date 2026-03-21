/**
 * NinjaTrader 8 REST API Adapter
 * Requires NinjaTrader with the  <a href="https://ninjatrader.com/" rel="nofollow">https://ninjatrader.com/</a> Web API plugin
 */

export class NinjaTraderAdapter {
  constructor() {
    this.baseUrl = process.env.NT_REST_URL || 'http://localhost:5000/ntapi'
    this.apiKey = process.env.NT_API_KEY || ''
    this.connected = false
    this.pollingInterval = null
  }

  async connect(credentials) {
    this.baseUrl = credentials.url || this.baseUrl
    this.apiKey = credentials.apiKey || this.apiKey

    // Test connection
    const response = await fetch(`${this.baseUrl}/v1/account`, {
      headers: { 'X-API-Key': this.apiKey }
    })

    if (!response.ok) {
      throw new Error(`NinjaTrader connection failed: ${response.statusText}`)
    }

    this.connected = true
    
    // Start polling for real-time data
    this.startPolling()
    
    return true
  }

  startPolling() {
    this.pollingInterval = setInterval(async () => {
      await this.pollData()
    }, 1000) // Poll every second
  }

  stopPolling() {
    if (this.pollingInterval) {
      clearInterval(this.pollingInterval)
    }
  }

  async pollData() {
    try {
      const [positions, orders] = await Promise.all([
        this.getPositions(),
        this.getOrders()
      ])
      
      this.emit('positions', positions)
      this.emit('orders', orders)
    } catch (e) {
      console.error('NinjaTrader polling error:', e)
    }
  }

  async getOHLC(symbol, timeframe, count = 100) {
    const timeframeMap = {
      'M1': '1 min',
      'M5': '5 min', 
      'M15': '15 min',
      'H1': '1 hour',
      'H4': '4 hour',
      'D1': '1 day'
    }

    const response = await fetch(
      `${this.baseUrl}/v1/ исторические данные?symbol=${symbol}&interval=${timeframeMap[timeframe]}&bars=${count}`,
      { headers: { 'X-API-Key': this.apiKey } }
    )

    if (!response.ok) throw new Error('Failed to get OHLC')
    return response.json()
  }

  async getPositions() {
    const response = await fetch(`${this.baseUrl}/v1/positions`, {
      headers: { 'X-API-Key': this.apiKey }
    })
    if (!response.ok) return []
    return response.json()
  }

  async getOrders() {
    const response = await fetch(`${this.baseUrl}/v1/orders`, {
      headers: { 'X-API-Key': this.apiKey }
    })
    if (!response.ok) return []
    return response.json()
  }

  async placeOrder(order) {
    const response = await fetch(`${this.baseUrl}/v1/order`, {
      method: 'POST',
      headers: {
        'X-API-Key': this.apiKey,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        symbol: order.symbol,
        quantity: order.volume,
        orderType: order.type,
        side: order.side === 'BUY' ? 'BUY' : 'SELL',
        price: order.price,
        stopLoss: order.sl,
        takeProfit: order.tp
      })
    })
    return response.json()
  }

  async closePosition(accountId, positionId) {
    const response = await fetch(`${this.baseUrl}/v1/position/close`, {
      method: 'POST',
      headers: {
        'X-API-Key': this.apiKey,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ accountId, positionId })
    })
    return response.json()
  }

  async cancelOrder(orderId) {
    const response = await fetch(`${this.baseUrl}/v1/order/${orderId}`, {
      method: 'DELETE',
      headers: { 'X-API-Key': this.apiKey }
    })
    return response.json()
  }

  emit(event, data) {
    if (this.events && this.events[event]) {
      this.events[event](data)
    }
  }

  on(event, callback) {
    this.events = this.events || {}
    this.events[event] = callback
  }

  disconnect() {
    this.stopPolling()
    this.connected = false
  }
}
