# Cryptostream

Real-time cryptocurrency dashboard streaming ETH/USDC, ETH/USDT and ETH/BTC prices via WebSocket.

## Stack

**Backend:** NestJS · TypeScript · TypeORM · PostgreSQL · Socket.IO  
**Frontend:** React · Vite · Zustand · Recharts · Tailwind CSS  
**Shared:** `@crypto/shared` — cross-boundary types and Socket.IO event constants  
**Testing:** Vitest (unit) · Playwright (E2E) · Storybook (visual)

## Quick start

```bash
# 1. Copy env files
cp .env.example .env
cp backend/.env.example backend/.env   # fill in API keys

# 2. Start with Docker
docker compose up

# 3. Or run locally (requires PostgreSQL)
npm run dev
```

## Local URLs

| Service | URL |
|---|---|
| Frontend | http://localhost:3000 |
| Backend API | http://localhost:3001 |
| Swagger UI | http://localhost:3001/api/docs |
| API JSON spec | http://localhost:3001/api/docs-json |
| Storybook | http://localhost:6006 |

## Commands

| Command | Description |
|---|---|
| `npm run dev` | Backend + frontend concurrently |
| `npm run dev:backend` | NestJS in watch mode |
| `npm run dev:frontend` | Vite dev server |
| `npm run test` | All unit tests |
| `npm run test:e2e` | Playwright E2E tests |
| `npm run lint` | ESLint backend + frontend |
| `npm run type-check` | TypeScript check backend + frontend |
| `npm run build` | Production build |
| `npm run storybook` | Storybook dev server |

## Environment variables

### Backend (`backend/.env`)

| Variable | Description |
|---|---|
| `FINNHUB_API_KEY` | Finnhub WebSocket API key — [finnhub.io](https://finnhub.io) |
| `ANTHROPIC_API_KEY` | Claude API key — [console.anthropic.com](https://console.anthropic.com) |
| `DATABASE_URL` | PostgreSQL connection string |
| `PORT` | Backend port (default: `3001`) |
| `FRONTEND_URL` | CORS origin (default: `http://localhost:3000`) |

### Frontend (`frontend/.env`)

| Variable | Description |
|---|---|
| `VITE_WS_URL` | Backend WebSocket URL (default: `http://localhost:3001`) |

## Architecture

```
monorepo/
├── shared/          @crypto/shared — cross-boundary types
├── backend/         NestJS — hexagonal architecture
│   ├── domain/      pure types, ports
│   ├── application/ use cases
│   └── infrastructure/ NestJS adapters, TypeORM, Finnhub WS
└── frontend/        React — Feature-Sliced Design
    ├── app/         providers, global styles
    ├── features/    Zustand stores, hooks
    ├── widgets/     connected components
    └── shared/ui/   atoms → molecules → organisms
```

See [`docs/architecture/`](docs/architecture/) for ADRs and the C4 context diagram.

## CI/CD

GitHub Actions runs on every push to `main`:

1. **Shared** — type-check `@crypto/shared`
2. **Backend** — lint · type-check · unit tests + coverage
3. **Frontend** — lint · type-check · unit tests + coverage
4. **Storybook** — static build check
5. **Deploy** — Railway deploy (main branch only)
6. **E2E** — Playwright tests against Docker Compose stack
