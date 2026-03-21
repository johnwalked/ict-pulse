# ICT Pulse - Institutional Trading Dashboard

![ICT Pulse](https://img.shields.io/badge/ICT-Pulse-cyan)
![Next.js](https://img.shields.io/badge/Next.js-14-black)
![License](https://img.shields.io/badge/license-MIT-blue)

## Overview

**ICT Pulse** is a sophisticated AI-powered trading platform that implements the **ICT (Inner Circle Trader) methodology** by Michael Huddleston. It provides real-time market analysis, order flow visualization, and AI-assisted trading signals based on institutional trading concepts.

## ICT Methodology Features

### Kill Zones
- **London Kill Zone**: 7:00 AM - 10:00 AM GMT
- **NY AM Kill Zone**: 8:00 AM - 11:00 AM EST
- **NY PM Kill Zone**: 1:00 PM - 4:00 PM EST
- **Asia Kill Zone**: 12:00 AM - 3:00 AM GMT

### Core Concepts Implemented
- **Market Structure Shift (MSS)**: Trend change confirmation
- **Break of Structure (BOS)**: Higher highs/lower lows detection
- **Order Blocks**: Institutional order zones
- **Fair Value Gaps (FVG)**: Price imbalances
- **Optimal Trade Entry (OTE)**: Fibonacci retracements
- **Liquidity Pools**: Stop hunt detection
- **Premium/Discount Zones**: Daily midpoint analysis
- **Silver Bullet**: High-probability entries

### Trading Modes
- **Swing Trading**: Position trades with multi-day holding
- **Scalp Trading**: Quick intra-day entries
- **HFT Scalp**: High-frequency micro-movements

## Pages

| Page | Description |
|------|-------------|
| `/` | Dashboard with kill zones, market structure, positions |
| `/chart` | Full trading chart with ICT overlays |
| `/orderflow` | Delta analysis and volume flow |
| `/analysis` | Comprehensive ICT analysis |
| `/positions` | Open trades management |
| `/journal` | Trade history and performance |
| `/ai` | AI assistant with ICT knowledge |
| `/settings` | MT5 connection and preferences |

## Tech Stack

- **Frontend**: Next.js 14, React, TypeScript
- **Styling**: Tailwind CSS
- **State**: Zustand
- **Charts**: Lightweight Charts (TradingView)
- **AI**: GPT-4 integration
- **Real-time**: WebSocket for MT5

## Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/YOUR_USERNAME/ict-pulse.git
cd ict-pulse

# Install dependencies
npm install

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the dashboard.

### MT5 Connection

The app works in **demo mode** by default with simulated data. To connect to MT5:

1. Install the MT5 WebSocket bridge on your machine
2. Update the WebSocket URL in Settings
3. Connect to your MT5 terminal

## Deployment to Vercel

### Option 1: One-Click Deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/import/project?template=https://github.com/YOUR_USERNAME/ict-pulse)

### Option 2: GitHub Actions

1. Fork this repository
2. Create a Vercel project
3. Add secrets to GitHub:
   - `VERCEL_TOKEN`
   - `VERCEL_ORG_ID`
   - `VERCEL_PROJECT_ID`
4. Push to main branch

## Environment Variables

```env
OPENAI_API_KEY=sk-...        # For AI features
NEXT_PUBLIC_WS_URL=ws://...   # MT5 WebSocket URL
```

## Project Structure

```
ict-pulse/
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   ├── chart/             # Chart page
│   ├── orderflow/         # Order flow page
│   ├── positions/         # Positions page
│   ├── journal/           # Journal page
│   ├── ai/                # AI chat page
│   ├── analysis/          # Analysis page
│   └── settings/          # Settings page
├── components/
│   ├── cards/             # Dashboard cards
│   └── layout/            # Layout components
├── lib/
│   ├── ict/               # ICT analysis engine
│   ├── store.ts            # Zustand store
│   └── utils.ts            # Utilities
├── types/                  # TypeScript types
└── public/                 # Static assets
```

## ICT Concepts Explained

### Market Structure
```
Bullish: Higher Highs + Higher Lows
Bearish: Lower Highs + Lower Lows
Neutral: No clear structure
```

### Premium vs Discount
- **Premium**: Above daily midpoint - favoring shorts
- **Discount**: Below daily midpoint - favoring longs
- **Mid**: Within 30% of midpoint - neutral

### Kill Zone Trading
High-probability entries during specific session overlaps:
- London + NY morning = Highest momentum
- 10:00 AM close = Key reversal time
- 9:50 AM = Reversal candle formation

## License

MIT License - see LICENSE file for details.

## Disclaimer

This software is for educational purposes only. Trading forex and crypto carries significant risk. Past performance does not guarantee future results. Always practice proper risk management.

---

**Built with ❤️ for the ICT Community**

*"Trade the chart, not the news."* - Michael Huddleston
