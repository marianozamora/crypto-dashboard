# cryptostream

[![CI](https://github.com/marianozamora/crypto-dashboard/actions/workflows/ci.yml/badge.svg)](https://github.com/marianozamora/crypto-dashboard/actions/workflows/ci.yml)
[![TypeScript](https://img.shields.io/badge/TypeScript-strict-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![NestJS](https://img.shields.io/badge/NestJS-E0234E?logo=nestjs&logoColor=white)](https://nestjs.com/)
[![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![Vitest](https://img.shields.io/badge/tested_with-Vitest-6E9F18?logo=vitest&logoColor=white)](https://vitest.dev/)
[![Playwright](https://img.shields.io/badge/E2E-Playwright-2EAD33?logo=playwright&logoColor=white)](https://playwright.dev/)
[![Storybook](https://img.shields.io/badge/Storybook-FF4785?logo=storybook&logoColor=white)](https://storybook.js.org/)
[![Railway](https://img.shields.io/badge/backend-Railway-0B0D0E?logo=railway&logoColor=white)](https://railway.app/)
[![Vercel](https://img.shields.io/badge/frontend-Vercel-000000?logo=vercel&logoColor=white)](https://vercel.com/)
[![License](https://img.shields.io/badge/license-MIT-green)](LICENSE)

Real-time cryptocurrency dashboard streaming live ETH/USDC, ETH/USDT, and ETH/BTC prices from Finnhub, with AI-generated hourly market commentary powered by Claude.

![cryptostream dashboard](docs/screenshot.png)

## Features

- Live price streaming via Socket.IO — prices update in real time without polling
- Three currency pairs: ETH/USDC, ETH/USDT, ETH/BTC
- Rolling 50-tick price chart per pair (Recharts)
- Hourly average vs. current price with percentage change
- AI market commentary generated every hour by Claude (Anthropic)
- WebSocket reconnection with exponential backoff
- Connection status indicator
- Responsive layout with dark theme

## Architecture

```
Finnhub WebSocket
      │
      ▼
┌─────────────────────────────────────────┐
│  NestJS Backend (hexagonal)             │
│                                         │
│  infrastructure/  ← Finnhub WS adapter │
│  application/     ← use cases           │
│  domain/          ← pure types, ports  │
│                                         │
│  ProcessRateTickUseCase                 │
│  GetHourlyAverageUseCase                │
│  PersistHourlyAverageUseCase            │
│  GenerateCommentaryUseCase (hourly)     │
└───────────────┬─────────────────────────┘
                │ Socket.IO (rate_update, commentary_update)
                ▼
┌─────────────────────────────────────────┐
│  React Frontend (Feature-Sliced Design) │
│                                         │
│  app/       ← providers, global styles  │
│  widgets/   ← PairCard, RateChart,      │
│               CommentaryWidget          │
│  features/  ← Zustand stores, hooks     │
│  shared/ui/ ← atoms → molecules →       │
│               organisms                 │
└─────────────────────────────────────────┘
                │
      PostgreSQL (rates, hourly_averages)
```

## Tech Stack

| Layer | Technologies |
|---|---|
| Backend | NestJS · TypeORM · PostgreSQL · Socket.IO · Zod · Swagger |
| Frontend | React · Vite · Zustand · Recharts · Tailwind CSS |
| AI | Anthropic SDK (Claude) |
| Shared | `@crypto/shared` — cross-boundary types and Socket.IO event constants |
| Testing | Vitest · React Testing Library · Playwright |
| Visual | Storybook |

## Architectural Decisions

### Real-time data flow
Finnhub sends trade ticks over WebSocket. The backend processes each tick through a use case pipeline: validate the symbol → extract price → publish to all connected Socket.IO clients → persist hourly aggregates to PostgreSQL. Clients never poll; they receive every tick pushed server-side.

Prices are held in a shared in-memory buffer (up to 3,600 ticks per pair) for chart history without a database round-trip on every read. PostgreSQL stores only hourly averages — the data that needs to survive restarts.

### Reconnection strategy
Both the Finnhub adapter (backend) and the Socket.IO client (frontend) use exponential backoff: `[1s, 2s, 4s, 8s, 16s, 30s]`. After a manual disconnect the backoff resets. Handlers are preserved across reconnects so no event subscriptions are lost.

### Hexagonal architecture (backend)
The domain layer has zero framework dependencies — no NestJS, no TypeORM. Use cases depend only on port types (TypeScript `type` aliases). Infrastructure adapters implement those ports and are injected via DI tokens. This makes business logic independently testable without starting the full NestJS container.

### Feature-Sliced Design (frontend)
Import direction is enforced: `app → pages → widgets → features → entities → shared`. Widgets are the only layer connected to Zustand; organisms and below are pure presentational components that receive props and know nothing about global state. This makes the component library fully testable in Storybook without any store setup.

### Schema management
In development (`NODE_ENV !== production`) TypeORM auto-syncs the schema for fast iteration. Production deployments use TypeORM migrations (see `backend/src/migrations/`), which are versioned and reversible. The `migration:generate` script diffs the current entity definitions against the database and produces a migration automatically.

### AI commentary
An `@Cron` job runs every hour, fetches the last hour of rate data, and calls Claude via the Anthropic SDK. The generated commentary is broadcast to all connected clients via the `commentary_update` Socket.IO event. If the AI call fails, the frontend stays in its loading state — it never shows stale or errored commentary.

---

## Local Setup

**Prerequisites:** Node.js 20+, Docker (for PostgreSQL)

```bash
# 1. Clone and install
git clone https://github.com/marianozamora/crypto-dashboard.git
cd crypto-dashboard
npm install

# 2. Environment variables
cp .env.example .env
cp backend/.env.example backend/.env
```

Edit `backend/.env` with your API keys:

**Getting a Finnhub API key (free tier, takes ~2 minutes):**
1. Go to [finnhub.io/register](https://finnhub.io/register) and create a free account
2. After login, your API key is shown on the dashboard home page
3. The free tier supports up to 60 API calls/minute — sufficient for this dashboard

**Getting an Anthropic API key:**
1. Go to [console.anthropic.com](https://console.anthropic.com) and create an account
2. Navigate to API Keys and create a new key
3. The AI commentary feature is optional — the dashboard works without it (commentary section stays in loading state)

| Variable | Description |
|---|---|
| `FINNHUB_API_KEY` | Finnhub WebSocket API key (required) |
| `ANTHROPIC_API_KEY` | Claude API key (optional — commentary disabled if absent) |
| `DATABASE_URL` | PostgreSQL connection string (default works with Docker) |
| `PORT` | Backend port (default: `3001`) |
| `FRONTEND_URL` | CORS origin (default: `http://localhost:3000`) |

Frontend `.env` (optional — defaults work out of the box):

| Variable | Description |
|---|---|
| `VITE_WS_URL` | Backend WebSocket URL (default: `http://localhost:3001`) |

```bash
# 3. Start database
docker compose up postgres -d

# 4. Run migrations
cd backend && npm run migration:run && cd ..

# 5. Start dev server
npm run dev
```

Or run everything with Docker:

```bash
docker compose up
```

## Local URLs

| Service | URL |
|---|---|
| Frontend | http://localhost:3000 |
| Backend API | http://localhost:3001 |
| Swagger UI | http://localhost:3001/api/docs |
| Storybook | http://localhost:6006 |

## Commands

| Command | Description |
|---|---|
| `npm run dev` | Backend + frontend concurrently |
| `npm run dev:backend` | NestJS in watch mode |
| `npm run dev:frontend` | Vite dev server |
| `npm run test` | All unit tests (backend + frontend) |
| `npm run test:e2e` | Playwright E2E tests |
| `npm run lint` | ESLint backend + frontend |
| `npm run type-check` | TypeScript check backend + frontend |
| `npm run build` | Production build |
| `npm run storybook` | Storybook dev server |

### Database migrations (backend)

```bash
cd backend
npm run migration:run       # apply pending migrations
npm run migration:revert    # roll back last migration
npm run migration:generate -- src/migrations/MyChange  # generate from entity diff
npm run migration:create -- src/migrations/MyChange    # empty migration scaffold
```

## Project Structure

```
monorepo/
├── shared/                    @crypto/shared — RateUpdate, MarketCommentary, SOCKET_EVENTS
├── backend/src/
│   ├── rates/
│   │   ├── domain/            pure types and port contracts (no framework deps)
│   │   ├── application/       use cases — orchestrate domain, call ports
│   │   └── infrastructure/    NestJS controllers, TypeORM repos, Finnhub WS adapter
│   ├── ai/                    GenerateCommentaryUseCase — hourly Claude call
│   ├── migrations/            TypeORM migration files
│   └── shared/                DI tokens, logger, config, Zod env validation
└── frontend/src/
    ├── app/                   providers (WebSocketProvider), global styles
    ├── pages/                 DashboardPage — page composition only
    ├── widgets/               PairCard · RateChart · CommentaryWidget · ConnectionStatus
    ├── features/              Zustand stores, useWebSocket hook, useRates hook
    └── shared/ui/
        ├── atoms/             Badge · PriceTag · Spinner
        ├── molecules/         PriceDisplay · StatRow
        └── organisms/         DataCard
```

## Testing

```bash
npm run test              # 202 unit + integration tests (73 backend, 129 frontend)
npm run test:e2e          # Playwright E2E (dashboard, connection, reconnection, charts)
cd frontend && npm run test:coverage   # coverage report (threshold: 80%)
```

**Coverage:**
- Every use case: happy path + error paths
- Every Zustand store and selector
- Every React hook (loading, connected, error states)
- Integration tests: WebSocket event → store update → DOM re-render (no manual rerender)
- E2E: initial load, real-time price updates, offline/reconnection, chart data rendering

## Design System

Storybook documents the full component library with live interactive stories:

```bash
npm run storybook   # http://localhost:6006
```

Component hierarchy:
- **Atoms** — `Badge`, `PriceTag`, `Spinner` (zero domain knowledge)
- **Molecules** — `PriceDisplay`, `StatRow` (compose atoms)
- **Organisms** — `DataCard` (accepts domain types as props, no data fetching)
- **Widgets** — `PairCard`, `RateChart`, `CommentaryWidget`, `ConnectionStatus` (connected to Zustand via decorator pattern)

## API

The backend exposes a REST health endpoint and a Socket.IO interface:

**Socket.IO events (server → client):**

| Event | Payload type | Description |
|---|---|---|
| `rate_update` | `RateUpdate` | New price tick for a currency pair |
| `commentary_update` | `MarketCommentary` | Hourly AI-generated market analysis |

**REST:**

| Endpoint | Description |
|---|---|
| `GET /health` | `finnhubConnected`, `connectedClients`, `uptime`, `timestamp` |
| `GET /api/docs` | Swagger UI |

## CI/CD

GitHub Actions runs on every push to `main`:

1. Type-check `@crypto/shared`
2. Backend — lint · type-check · unit tests + coverage
3. Frontend — lint · type-check · unit tests + coverage
4. Storybook — static build verification
5. E2E — Playwright against Docker Compose stack
6. Deploy — Vercel (frontend + Storybook on separate projects)
