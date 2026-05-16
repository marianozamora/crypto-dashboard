# ADR-001: Hexagonal Architecture for Backend

## Status
Accepted

## Context
The backend connects to Finnhub's WebSocket API and streams data to frontend clients. The data source and streaming mechanism should be replaceable without touching business logic.

## Decision
Use hexagonal architecture with explicit ports (TypeScript types) and adapters (NestJS classes in infrastructure layer).

Layer rules:
- `domain/` — pure TypeScript, zero framework dependencies
- `application/` — use cases, orchestrates domain, calls ports via DI tokens
- `infrastructure/` — NestJS classes with lifecycle hooks, TypeORM entities, WebSocket adapters

## Consequences
✅ Domain logic testable without NestJS, TypeORM, or Finnhub  
✅ Finnhub replaceable by swapping one adapter file  
✅ Streaming mechanism swappable (WebSockets → SSE)  
✅ Use cases testable by instantiating factory functions directly  
❌ More files than a simple service approach  
❌ useFactory pattern in modules is less familiar than @Injectable()  
