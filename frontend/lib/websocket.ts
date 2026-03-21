// WebSocket client for MT5 connection
import { useTradingStore, useConnectionStore, OHLCData } from './store'

class MT5WebSocketClient {
  private ws: WebSocket | null = null
  private reconnectAttempts = 0
  private maxReconnectAttempts = 5
  private reconnectDelay = 1000
  private pingInterval: ReturnType<typeof setInterval> | null = null

  connect(url: string = 'ws://localhost:8080') {
    const connectionStore = useConnectionStore.getState()
    
    connectionStore.setStatus('connecting')
    
    try {
      this.ws = new WebSocket(url)
      
      this.ws.onopen = () => {
        connectionStore.setStatus('connected')
        connectionStore.setLastPing(Date.now())
        this.reconnectAttempts = 0
        
        this.pingInterval = setInterval(() => {
          if (this.ws && this.ws.readyState === WebSocket.OPEN) {
            this.ws.send(JSON.stringify({ type: 'ping' }))
          }
        }, 30000)
        
        if (this.ws) {
          this.ws.send(JSON.stringify({
            type: 'subscribe',
            symbols: ['EURUSD', 'GBPUSD', 'USDJPY', 'XAUUSD']
          }))
        }
      }
      
      this.ws.onmessage = (event) => {
        const message = JSON.parse(event.data)
        const tradingStore = useTradingStore.getState()
        const connectionStore = useConnectionStore.getState()
        
        switch (message.type) {
          case 'pong':
            connectionStore.setLatency(Date.now() - (connectionStore.lastPing || Date.now()))
            connectionStore.setLastPing(Date.now())
            break
            
          case 'ohlc':
            tradingStore.addOhlcData(message.data as OHLCData)
            break
            
          case 'tick':
            break
            
          case 'orderflow':
            tradingStore.setOrderFlowData(message.data)
            break
            
          case 'signal':
            tradingStore.addSignal(message.data)
            break
        }
      }
      
      this.ws.onclose = () => {
        connectionStore.setStatus('disconnected')
        if (this.pingInterval) {
          clearInterval(this.pingInterval)
        }
        this.attemptReconnect(url)
      }
      
      this.ws.onerror = () => {
        connectionStore.setStatus('disconnected')
      }
      
    } catch {
      connectionStore.setStatus('disconnected')
      this.attemptReconnect(url)
    }
  }
  
  private attemptReconnect(url: string) {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++
      setTimeout(() => {
        this.connect(url)
      }, this.reconnectDelay * this.reconnectAttempts)
    }
  }
  
  disconnect() {
    if (this.ws) {
      this.ws.close()
      this.ws = null
    }
    if (this.pingInterval) {
      clearInterval(this.pingInterval)
    }
  }
  
  send(message: object) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(message))
    }
  }
}

export const mt5Client = new MT5WebSocketClient()
