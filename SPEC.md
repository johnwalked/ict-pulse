# ICT Trading Platform - AI-Powered MetaTrader 5 WebApp

## 1. Concept & Vision

**ICT Pulse** is a sophisticated AI-powered trading platform that bridges MetaTrader 5 with web-based trading analytics. Named after Inner Circle Trader (Michael Huddleston), it implements his proprietary methodology—Market Structure, Order Blocks, Fair Value Gaps, and Optimal Trade Entries—while providing real-time OHLC and orderflow data via WebSocket.

The app feels like a professional trading terminal meets modern fintech: dark, focused, data-dense yet breathable. It's designed for traders who want ICT's institutional methodology combined with AI-driven insights, running from swing trading to HFT scalping based on user preference.

**Core Philosophy**: "Trade the chart, not the news." — ICT

## 2. Design Language

### Aesthetic Direction
Dark trading terminal with neon accent highlights—inspired by Bloomberg Terminal meets Cyberpunk. High contrast data visualization with glowing indicators.

### Color Palette
```
--bg-primary: #0a0e17        // Deep space black
--bg-secondary: #111827      // Card backgrounds
--bg-tertiary: #1f2937       // Elevated surfaces
--border: #374151            // Subtle borders
--text-primary: #f9fafb      // Bright white text
--text-secondary: #9ca3af    // Muted text
--text-tertiary: #6b7280     // Subtle labels
--accent-primary: #3b82f6    // Electric blue (primary actions)
--accent-secondary: #8b5cf6   // Purple (AI/secondary)
--bull: #10b981              // Green (buy/long)
--bear: #ef4444              // Red (sell/short)
--warning: #f59e0b           // Orange (alerts)
--gold: #fbbf24              // ICT Silver Bullet gold
```

### Typography
- **Headlines**: `JetBrains Mono` (monospace feel for trading data)
- **Body**: `Inter` (clean readability)
- **Data/Numbers**: `JetBrains Mono` (aligned, technical)

### Spatial System
- Base unit: 4px
- Card padding: 16px (4 units)
- Section gaps: 24px (6 units)
- Page margins: 32px (8 units)

### Motion Philosophy
- Micro-transitions: 150ms ease-out for hovers
- Data updates: 200ms fade for price changes
- Page transitions: 300ms slide-fade
- Chart animations: smooth 60fps canvas rendering
- Pulse effects on live data feeds

## 3. Layout & Structure

### Navigation
- **Left Sidebar** (64px collapsed, 240px expanded): Icon-based navigation with tooltips
  - Dashboard, Chart, Order Flow, Positions, Journal, AI Assistant, Settings
- **Top Bar** (56px): Connection status, MT5 indicator, timeframe selector, AI mode toggle
- **Main Content**: Fluid, responsive grid

### Page Structure

#### Dashboard (/)
- Hero stats row: Account balance, P&L today, open positions, win rate
- 4-panel grid: Market overview, active signals, recent trades, AI insights
- Bottom: Mini chart with market structure overlay

#### Trading Chart (/chart)
- Full-width TradingView-style chart
- Left: Asset selector, timeframe buttons
- Right: Drawing tools, indicators panel
- Bottom: Orderflow heatmap, volume profile

#### Order Flow (/orderflow)
- Time & sales ladder
- Delta cumulative chart
- Order book visualization
- ICT liquidity zones overlay

#### Positions (/positions)
- Active positions table with real-time P&L
- Pending orders
- Position sizing calculator
- One-click close/modify

#### Trade Journal (/journal)
- Filterable trade history
- ICT-specific tagging (OB, FVG, BOS, OTE)
- Performance analytics by strategy component
- Export to CSV/JSON

#### AI Assistant (/ai)
- Chat interface with trade context
- Real-time market analysis requests
- Strategy backtesting queries
- Voice input option

#### Settings (/settings)
- MT5 connection configuration
- WebSocket server URL
- Trading mode (Swing/HFT Scalp)
- Risk management parameters
- Theme customization

## 4. Features & Interactions

### WebSocket Connection to MT5
- **Connection Flow**: Settings page → Enter MT5 server details → Test connection → Connect
- **Data Stream**: OHLC (1s, 5s, 15s, 1m, 5m, 15m, 1h, 4h, 1D), Tick data, Order flow
- **Status Indicator**: Green pulse = live, Yellow = reconnecting, Red = disconnected
- **Auto-reconnect**: Exponential backoff (1s, 2s, 4s, max 30s)

### ICT Methodology Engine

#### Market Structure Analysis
- **BOS (Break of Structure)**: Detect HH/HL, LH/LL patterns
- **ChoCH (Change of Character)**: Inversion signals
- Visual: Colored lines with labels on chart

#### Order Blocks
- Identify institutional order zones (last bearish/bullish candle before change)
- Visual: Semi-transparent rectangles with percentage labels
- Interaction: Click to see order block details, hover for quick info

#### Fair Value Gaps (FVG)
- Detect 3-candle imbalances
- Visual: Semi-transparent gap zones
- Classification: Balanced, Partially filled, Fully filled

#### Liquidity Pools
- Identify above/below swing highs/lows
- Stop hunt zones visualization
- Visual: Dashed lines with pool size labels

#### Optimal Trade Entries (OTE)
- Fibonacci retracement overlays
- Key levels: 61.8%, 78.6%, 100%
- Visual: Colored fibonacci zones

#### Silver Bullet Strategy
- Specific ICT trading setup triggers
- Visual: Gold highlighted patterns

### Trading Modes

#### Swing Trading Mode
- Higher timeframe analysis (4H, Daily)
- Multiple day holds
- Wider stops, larger position sizes
- Daily signal notifications

#### HFT Scalp Mode
- M1-M5 timeframe
- Seconds to minutes holds
- Tight spreads, small position sizes
- Real-time alerts

### Order Execution
- Market orders (simulated for WebSocket demo)
- Limit orders at ICT levels
- Stop losses at order blocks
- Take profits at next structure/FVG

### AI Features

#### Real-time Analysis
- Pattern recognition alerts
- Trade setup suggestions
- Risk assessment on proposed trades
- Market sentiment summary

#### Chat Interface
- Ask about specific setups
- "What's the trade setup on EURUSD?"
- "Identify order blocks on GBPUSD 4H"
- "Calculate position size for $500 risk"

### Error States
- **MT5 Disconnected**: Full-screen overlay with reconnect button, cached last data shown grayed
- **WebSocket Error**: Toast notification, auto-retry indicator
- **Invalid Data**: Skip malformed candles, log error, show last valid
- **Empty States**: Helpful illustrations with setup instructions

## 5. Component Inventory

### Cards

#### StatCard
- States: default, loading (skeleton), error, positive (green glow), negative (red glow)
- Content: Label, value, change percentage, sparkline
- Hover: Subtle elevation, show more details tooltip

#### ChartCard
- States: loading (pulse skeleton), live (green border pulse), paused, error
- Content: TradingView chart embed, timeframe tabs, zoom controls
- Interaction: Crosshair cursor, click-drag to zoom, right-click context menu

#### OrderFlowCard
- States: loading, streaming, paused, disconnected
- Content: Bid/ask ladder, delta bars, cumulative delta line
- Interaction: Click price level to set alert, scroll for time

#### PositionCard
- States: open, pending, closed, breached
- Content: Symbol, direction, entry, current, P&L, actions
- Actions: Close, modify SL/TP, add to position

#### TradeCard
- Content: Entry time, symbol, direction, results, ICT tags
- Tags: Color-coded chips (OB=blue, FVG=purple, BOS=green, OTE=gold)
- Hover: Full trade notes expansion

### Buttons

#### PrimaryButton
- States: default, hover (brighten 10%), active (scale 0.98), disabled (50% opacity), loading (spinner)
- Variants: bull (green), bear (red), neutral (blue)

#### IconButton
- States: default, hover (bg highlight), active, disabled
- Used in: Chart tools, table actions, navigation

### Inputs

#### ConnectionInput
- Fields: Server address, account ID, password (masked)
- Validation: URL format, required fields
- States: empty, valid, invalid (red border + message), connecting

#### TimeframeSelector
- Options: 1m, 5m, 15m, 30m, 1H, 4H, 1D, 1W
- States: unselected, selected (filled), disabled
- Interaction: Click to select, keyboard shortcuts

### Modals

#### TradeModal
- Content: Symbol search, direction toggle, lot size, SL/TP inputs, risk calculator
- Actions: Execute, cancel
- Animation: Scale + fade in

#### SettingsModal
- Tabs: Connection, Trading, Appearance, AI
- Save/Cancel with confirmation on changes

### Status Indicators

#### ConnectionBadge
- States: connected (green pulse), connecting (yellow spin), disconnected (red static)
- Animation: CSS keyframes for pulse/spin

#### MarketStatusBadge
- States: open (green), pre-market (yellow), closed (gray)
- Shows next event countdown

## 6. Technical Approach

### Frontend Stack
- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS 4
- **Charts**: lightweight-charts (TradingView) + custom order flow
- **State**: Zustand for global state
- **WebSocket**: Native WebSocket with reconnection logic
- **AI**: OpenAI API integration via API routes

### Backend Architecture
- **WebSocket Server**: Node.js with `ws` library
- **MT5 Bridge**: Custom WebSocket server that communicates with MT5 Terminal API
- **API Routes**: Next.js API routes for settings, history, AI chat
- **Data Storage**: LocalStorage for settings, IndexedDB for trade history

### WebSocket Protocol

#### Client → Server Messages
```json
{ "type": "subscribe", "symbol": "EURUSD", "timeframe": "1m" }
{ "type": "unsubscribe", "symbol": "EURUSD" }
{ "type": "order", "action": "buy", "symbol": "EURUSD", "volume": 0.1 }
{ "type": "ping" }
```

#### Server → Client Messages
```json
{ "type": "ohlc", "symbol": "EURUSD", "timeframe": "1m", "data": [...] }
{ "type": "tick", "symbol": "EURUSD", "bid": 1.0856, "ask": 1.0858 }
{ "type": "orderflow", "symbol": "EURUSD", "data": { "bidVolume": ..., "askVolume": ... } }
{ "type": "position", "data": { ... } }
{ "type": "pong" }
{ "type": "error", "message": "..." }
```

### ICT Algorithm Implementation

#### Market Structure Detection
1. Identify swing highs/lows using pivots
2. Connect HH/HL sequences
3. Detect BOS on break of previous structure
4. Mark ChoCH on trendline break

#### Order Block Detection
1. Find last 5-10 candles before strong directional move
2. Identify candle with most volume in direction
3. Mark OB zone (high-low of that candle)
4. Classify as bullish (preceded by bearish) or bearish OB

#### Fair Value Gap Detection
1. Detect 3-candle imbalance pattern
2. Gap = candle 2 high < candle 1 low OR candle 2 low > candle 1 high
3. Mark FVG zone
4. Track fill percentage over time

### Deployment

#### GitHub Repository
- `frontend/` - Next.js application
- `backend/` - WebSocket server for MT5
- README with setup instructions

#### Vercel Deployment
- Frontend: Automatic from GitHub
- Backend: Separate Node.js server (Vercel serverless functions or separate hosting)
- Environment variables for API keys

### File Structure
```
/home/workspace/
├── frontend/
│   ├── app/
│   │   ├── layout.tsx
│   │   ├── page.tsx (Dashboard)
│   │   ├── chart/page.tsx
│   │   ├── orderflow/page.tsx
│   │   ├── positions/page.tsx
│   │   ├── journal/page.tsx
│   │   ├── ai/page.tsx
│   │   ├── settings/page.tsx
│   │   └── api/
│   │       └── ai/
│   │           └── route.ts
│   ├── components/
│   │   ├── cards/
│   │   ├── charts/
│   │   ├── layout/
│   │   └── ui/
│   ├── lib/
│   │   ├── websocket.ts
│   │   ├── ict/
│   │   │   ├── marketStructure.ts
│   │   │   ├── orderBlocks.ts
│   │   │   ├── fairValueGaps.ts
│   │   │   └── liquidityPools.ts
│   │   └── store.ts
│   ├── styles/
│   │   └── globals.css
│   └── package.json
├── backend/
│   ├── server.js
│   ├── mt5Bridge.js
│   └── package.json
└── SPEC.md
```

## 7. Demo/Simulation Mode

Since MT5 WebSocket connection requires a running terminal, the app includes a **Simulation Mode**:

- Generates realistic OHLC data based on historical patterns
- Simulates order flow with bid/ask volume dynamics
- Demo positions that can be opened/closed
- All ICT concepts visualized on simulated data
- Toggle between Live and Demo mode in settings

This allows full functionality testing without actual MT5 connection.
