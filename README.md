# Cryptostream

Real-time cryptocurrency dashboard. Monorepo with NestJS backend and React frontend.

## Stack

**Backend:** NestJS · TypeScript · TypeORM · PostgreSQL · Socket.IO  
**Frontend:** React · Vite · Zustand · Recharts · Tailwind CSS

## Commands

| Command | Description |
|---|---|
| `npm run dev` | Run backend + frontend concurrently |
| `npm run dev:backend` | Start NestJS in watch mode |
| `npm run dev:frontend` | Start Vite dev server |
| `npm run test` | Run all unit tests |
| `npm run test:e2e` | Run Playwright end-to-end tests |
| `npm run lint` | Lint backend + frontend |
| `npm run type-check` | Type-check backend + frontend |
| `npm run build` | Build backend + frontend |
| `npm run storybook` | Start Storybook dev server |

## Local URLs

| Service | URL |
|---|---|
| Backend API | http://localhost:3001 |
| Frontend | http://localhost:5173 |
| Swagger UI | http://localhost:3001/api/docs |
| API spec | http://localhost:3001/api/docs-json |

## API Documentation

Interactive API docs available via Swagger UI once the backend is running:

http://localhost:3001/api/docs

## Environment

Copy `backend/.env.example` to `backend/.env` and fill in the required values:

```
FINNHUB_API_KEY=your_finnhub_api_key
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/crypto_dashboard
ANTHROPIC_API_KEY=your_anthropic_api_key
PORT=3001
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
```
