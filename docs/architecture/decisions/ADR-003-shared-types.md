# ADR-003: Shared Types Package

## Status
Accepted

## Context
`RateUpdate`, `CurrencyPair`, and `SOCKET_EVENTS` are used by both backend and frontend. Defining them separately risks silent type mismatches across the WebSocket boundary.

## Decision
Create `@crypto/shared` package with all cross-boundary types and constants. Both backend and frontend reference it via `file:../shared`.

- Backend resolves `@crypto/shared` via node_modules symlink → `shared/dist/` (CJS)
- Frontend resolves `@crypto/shared` via tsconfig path alias → `shared/src/index.ts` (ESM, compiled by Vite)

## Consequences
✅ Type mismatch between WS server and client is a compile error  
✅ Single source of truth for `SOCKET_EVENTS` constants  
✅ `CurrencyPair` union type enforced on both sides  
✅ Vite can tree-shake the TypeScript source directly without CJS interop issues  
❌ Backend needs shared compiled to dist/ before build  
❌ Slightly more complex monorepo setup  
