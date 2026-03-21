# ICT Pulse - AI-Powered Trading Platform

![ICT Pulse](https://img.shields.io/badge/ICT-Pulse-blue)
![Next.js](https://img.shields.io/badge/Next.js-14-black)
![License](https://img.shields.io/badge/license-MIT-green)

An AI-powered trading platform that implements ICT (Inner Circle Trader) methodology with MetaTrader 5 integration. Features real-time OHLC data, order flow analysis, and intelligent trade signals.

## 🚀 Features

### Trading Features
- **Real-time Charts** - TradingView-style charts with lightweight-charts
- **ICT Methodology** - Market Structure, Order Blocks, Fair Value Gaps, Liquidity Pools
- **Order Flow** - Time & Sales, Delta Analysis, Volume Profile
- **Trade Journal** - Track and analyze your trading history
- **Demo Mode** - Simulated market data for learning

### AI Features
- **AI Assistant** - Chat with AI about ICT concepts and trade setups
- **Pattern Recognition** - Automatic detection of trading patterns
- **Trade Signals** - AI-powered trade idea generation

### Trading Modes
- **Swing Trading** - Higher timeframes, multi-day holds
- **HFT Scalp** - Lower timeframes, quick entries

## 📁 Project Structure

```
frontend/                 # Next.js web application
├── app/                  # App router pages
│   ├── page.tsx         # Dashboard
│   ├── chart/           # Trading chart
│   ├── orderflow/       # Order flow analysis
│   ├── positions/       # Open positions
│   ├── journal/         # Trade journal
│   ├── ai/             # AI assistant
│   ├── settings/       # App settings
│   └── api/ai/         # AI API route
├── components/          # React components
├── lib/                # Utilities
│   ├── websocket.ts   # WebSocket client
│   ├── store.ts        # Zustand state
│   └── ict/            # ICT analysis algorithms
└── package.json

backend/                  # WebSocket server
├── server.js           # Main server
└── package.json
```

## 🛠️ Setup

### Prerequisites
- Node.js 18+
- npm or yarn
- MetaTrader 5 (for live trading)
- OpenAI API key (for AI features)

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### Backend Setup

```bash
cd backend
npm install
npm run dev
```

The backend runs on `ws://localhost:8080`

### Environment Variables

Create a `.env.local` in the frontend directory:

```env
OPENAI_API_KEY=your_openai_api_key
```

## 📊 ICT Methodology

### Market Structure
- **BOS (Break of Structure)** - Trend continuation signals
- **ChoCH (Change of Character)** - Trend reversal signals
- **HH/HL, LH/LL** - Swing point patterns

### Key Concepts
- **Order Blocks** - Institutional order zones
- **Fair Value Gaps** - Price imbalances
- **Liquidity Pools** - Stop hunt areas
- **OTE** - Optimal Trade Entry with Fibonacci

## 🌐 Deployment

### Vercel (Frontend)

1. Push to GitHub
2. Connect to Vercel
3. Deploy automatically

```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/username/ict-pulse.git
git push -u origin main
```

### Backend Hosting

For production, deploy the WebSocket server to:
- Railway
- Render
- AWS Elastic Beanstalk
- DigitalOcean App Platform

## 🎯 Usage

1. **Dashboard** - Overview of your trading status
2. **Chart** - Analyze price action and ICT patterns
3. **Order Flow** - Real-time order book and delta analysis
4. **Positions** - Manage open trades
5. **Journal** - Review trade history
6. **AI Assistant** - Get trading insights

## ⚠️ Disclaimer

This platform is for educational purposes only. Trading forex and CFDs involves substantial risk of loss. Past performance is not indicative of future results. Always practice proper risk management and only trade with capital you can afford to lose.

## 📄 License

MIT License - see LICENSE file for details

---

Built with ❤️ for the ICT trading community
