# backend — NestJS · TypeScript · TypeORM · PostgreSQL

## Architecture

Hexagonal (ports and adapters). See `.claude/rules/hexagonal.md` for the complete rule set.

```
src/
  domain/          ← pure types, no framework deps
    model/         ← domain types and value objects
    port/          ← port type definitions
    service/       ← stateless domain services
  application/     ← use cases (one file = one use case)
  infrastructure/  ← NestJS controllers, TypeORM repos, Finnhub WS adapter
  shared/          ← tokens, logger, config, constants
```

## Hexagonal import rules (enforced by CI)

- `domain/` → no NestJS, no TypeORM, no `infrastructure/`
- `application/` → no NestJS, no TypeORM, no `infrastructure/`
- `infrastructure/` → may import everything; must never be imported by `domain/` or `application/`
- Ports are `type`, not `interface`
- DI tokens live in `src/shared/tokens.ts`; use cases inject ports via tokens only

## Finnhub symbols

These are the only WebSocket symbols this project subscribes to:

```
BINANCE:ETHUSDC
BINANCE:ETHUSDT
BINANCE:ETHBTC
```

They are defined as constants in `src/shared/constants.ts`. Never use raw strings in adapter code.

## Testing conventions

- **Framework:** Vitest (`vitest.config.ts` — globals enabled, no imports needed for describe/it/expect)
- **Unit tests:** instantiate classes directly — do NOT use `Test.createTestingModule`
- **Integration tests:** `Test.createTestingModule` is allowed
- **Mocks:** `vi.fn()` with explicit types — no `any` (e.g. `{ findBySymbol: vi.fn<...>() }`)
- **Naming:** `"should [behavior] when [condition]"`
- **Coverage:** every use case needs happy path + at least one error path

## TypeScript requirements

All rules from `.claude/rules/typescript.md` apply:
- `type` over `interface` — no exceptions
- Zero `any`
- Explicit return types on every function and method
- No `as` casting
- Type guards at all external boundaries (WebSocket messages, HTTP request bodies, DB results)

## Scripts

```bash
npm run start:dev      # NestJS watch mode
npm run build          # tsc compile
npm run lint           # ESLint
npm run type-check     # tsc --noEmit
npm run test           # Vitest (run once)
npm run test:watch     # Vitest (watch mode)
npm run test:coverage  # Vitest with v8 coverage report
```
