# crypto-dashboard

Real-time cryptocurrency dashboard. Monorepo.

## Stack

**Backend:** NestJS · TypeScript · TypeORM · PostgreSQL
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

## Non-Negotiables

These rules are enforced by ESLint, CI, and pre-commit hooks. PRs violating any of these will not be merged.

- **`type` over `interface` everywhere** — no exceptions, ever
- **Zero `any`** — use `unknown` and narrow, or create a proper type
- **Zero `console.log`** — use a logger service (backend) or remove (frontend)
- **Explicit return types** — every function must declare its return type
- **Max 20 lines per function** — split if longer
- **Tests required** — every use case, every hook, every non-trivial util

## Rules & Agents

- `.claude/rules/typescript.md` — TypeScript strictness rules
- `.claude/rules/clean-code.md` — naming, size, and style rules
- `.claude/rules/hexagonal.md` — backend architecture rules
- `.claude/rules/fsd.md` — frontend Feature-Sliced Design rules
- `.claude/agents/code-reviewer.md` — code review agent
- `.claude/agents/test-writer.md` — test generation agent

## Design

Before generating or modifying any frontend component, read `STYLE.md` — it is the source of truth for all visual decisions. Never improvise colors or spacing.
