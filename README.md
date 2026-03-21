# ICT Pulse - AI-Powered Trading Platform

![ICT Pulse](https://img.shields.io/badge/ICT-Pulse-blue)
![Next.js](https://img.shields.io/badge/Next.js-14-black)
![License](https://img.shields.io/badge/license-MIT-green)

An AI-powered trading platform that implements ICT (Inner Circle Trader) methodology with MetaTrader 5 integration. Features real-time OHLC data, order flow analysis, and AI-driven trade signals.

## 🌟 Features

### ICT Methodology
- **Market Structure Analysis** - Detect BOS (Break of Structure) and趋势反转
- **Order Blocks** - Identify institutional order zones
- **Fair Value Gaps (FVG)** - Find efficient entry points
- **Liquidity Pools** - Locate stop hunts and liquidity grabs
- **Silver Bullet** - ICT's proprietary trading strategy

### Trading Modes
- **Swing Trading** - Position trades with multi-day holding
- **Scalping** - Quick intraday entries
- **HFT** - High-frequency algorithmic trading

### AI Integration
- GPT-powered trade analysis
- Pattern recognition
- Real-time signal generation
- Natural language trade explanations

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn
- MetaTrader 5 (optional, works in demo mode)

### Installation

```bash
# Clone the repository
git clone https://github.com/YOUR_USERNAME/ict-pulse.git
cd ict-pulse

# Install frontend dependencies
cd frontend
npm install

# Install backend dependencies
cd ../backend
npm install
```

### Running the Application

**Frontend (Next.js):**
```bash
cd frontend
npm run dev
```

**Backend (WebSocket Server):**
```bash
cd backend
npm start
```

Access the app at `http://localhost:3000`

## 📁 Project Structure

```
ict-pulse/
├── frontend/                 # Next.js web application
│   ├── app/                  # App router pages
│   │   ├── page.tsx          # Dashboard
│   │   ├── chart/            # Trading charts
│   │   ├── orderflow/        # Order flow analysis
│   │   ├── positions/        # Open positions
│   │   ├── journal/          # Trading journal
│   │   ├── ai/              # AI assistant
│   │   └── settings/         # App settings
│   ├── components/           # React components
│   │   ├── cards/           # Dashboard cards
│   │   ├── charts/          # Chart components
│   │   └── layout/          # Layout components
│   └── lib/                 # Utilities
│       ├── store.ts         # Zustand state
│       ├── websocket.ts     # MT5 WebSocket client
│       └── ict/             # ICT analysis algorithms
│
├── backend/                  # WebSocket server
│   └── server.js            # MT5 bridge server
│
└── SPEC.md                  # Project specification
```

## 🔌 MT5 Integration

### WebSocket Connection
The app connects to MT5 via WebSocket for real-time data:

```javascript
// Connect to MT5 bridge
const ws = new WebSocket('ws://localhost:8080')

// Subscribe to symbols
ws.send(JSON.stringify({
  type: 'subscribe',
  symbols: ['EURUSD', 'GBPUSD', 'USDJPY']
}))

// Receive OHLC data
ws.on('message', (event) => {
  const data = JSON.parse(event.data)
  if (data.type === 'ohlc') {
    console.log('New candle:', data.data)
  }
})
```

### Demo Mode
The app works in demo mode with simulated data when MT5 is not available.

## 🚢 Deployment

### Deploy to Vercel

1. **Push to GitHub:**
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/YOUR_USERNAME/ict-pulse.git
git push -u origin main
```

2. **Connect to Vercel:**
   - Go to [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Vercel will auto-detect Next.js

3. **Set Environment Variables:**
   - `OPENAI_API_KEY` - Your OpenAI API key for AI features

4. **Deploy:**
   - Click "Deploy"

### Deploy Backend (Railway/Render)

1. Create new Railway/Render project
2. Connect to your GitHub repo
3. Set start command: `npm start`
4. Set port: `8080`

### MT5 Bridge Deployment

For production, deploy the WebSocket server to a VPS:

```bash
# On your server
git clone https://github.com/YOUR_USERNAME/ict-pulse.git
cd ict-pulse/backend
npm install
npm start
```

## 🛠️ Configuration

### Environment Variables

Create `.env.local` in frontend:

```env
NEXT_PUBLIC_WS_URL=ws://your-mt5-bridge-server:8080
OPENAI_API_KEY=your-openai-api-key
```

### Symbols Configuration

Edit `lib/store.ts` to add/remove trading symbols:

```typescript
const popularSymbols = [
  { symbol: 'EURUSD', name: 'Euro / US Dollar', type: 'Forex' },
  { symbol: 'GBPUSD', name: 'British Pound / US Dollar', type: 'Forex' },
  // Add more...
]
```

## 📊 ICT Concepts Implemented

| Concept | Description |
|---------|-------------|
| **Market Structure** | HH/HL and LH/LL patterns |
| **Order Blocks** | Institutional order zones |
| **Fair Value Gaps** | Inefficient price areas |
| **Liquidity Pools** | Stop hunt areas |
| **Killzones** | High-probability trading times |
| **Silver Bullet** | Premium ICT entry strategy |

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- **ICT (Inner Circle Trader)** - Trading methodology and concepts by Michael Huddleston
- **MetaTrader 5** - Trading platform
- **OpenAI** - AI capabilities

---

Built with ❤️ for traders who respect the grind
