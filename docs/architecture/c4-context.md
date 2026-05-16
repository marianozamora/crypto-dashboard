# C4 Context Diagram

## System Context

```
┌─────────────────────────────────────────────────────────────┐
│                        Cryptostream                         │
│                                                             │
│  ┌─────────────┐   WebSocket    ┌──────────────────────┐   │
│  │  React SPA  │◄──────────────►│   NestJS Backend     │   │
│  │  (Vite)     │  Socket.IO     │   (Port 3001)        │   │
│  │  Port 3000  │                │                      │   │
│  └─────────────┘                │  ┌────────────────┐  │   │
│                                 │  │   PostgreSQL   │  │   │
│                                 │  │   (TypeORM)    │  │   │
│                                 │  └────────────────┘  │   │
│                                 └──────────┬───────────┘   │
└────────────────────────────────────────────┼───────────────┘
                                             │
                    ┌────────────────────────┼───────────────┐
                    │   External Systems     │               │
                    │                        ▼               │
                    │  ┌──────────────────────────────────┐  │
                    │  │  Finnhub WebSocket API           │  │
                    │  │  wss://ws.finnhub.io             │  │
                    │  │  Streams: ETHUSDC, ETHUSDT,      │  │
                    │  │          ETHBTC trade ticks      │  │
                    │  └──────────────────────────────────┘  │
                    │                                        │
                    │  ┌──────────────────────────────────┐  │
                    │  │  Anthropic Claude API            │  │
                    │  │  Generates hourly AI commentary  │  │
                    │  └──────────────────────────────────┘  │
                    └────────────────────────────────────────┘
```

## Data Flow

1. Finnhub → Backend: raw trade ticks via WebSocket
2. Backend: validates, stores in PostgreSQL, calculates hourly averages
3. Backend → Frontend: `rate_update` and `commentary_update` events via Socket.IO
4. Frontend: Zustand store updates → React re-renders in real time
