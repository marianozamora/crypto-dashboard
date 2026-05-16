# Hexagonal Architecture Rules

## Layer overview

```
src/
  domain/          ← pure business logic, no framework dependencies
    model/         ← types, value objects, aggregates
    port/          ← inbound and outbound port types
    service/       ← domain services (stateless logic)

  application/     ← use cases — orchestrate domain, call ports
    use-case/

  infrastructure/  ← adapters — implement outbound ports
    persistence/   ← TypeORM repositories
    websocket/     ← Finnhub WS client
    http/          ← REST adapters, controllers

  shared/          ← cross-cutting (logger, config, DI tokens)
```

## What lives in each layer

**Domain (`src/domain/`)**
- Pure TypeScript types only — no `class`, no decorators
- Domain models are `type`, not `class`
- Port types define what the application needs from the outside world
- Zero framework imports — no `import { Injectable } from '@nestjs/common'`
- Zero ORM imports — no `import { Entity } from 'typeorm'`

**Application (`src/application/`)**
- One file = one use case
- Imports only from `domain/` and `shared/`
- Receives ports via constructor injection (DI tokens, not concrete classes)
- Contains business flow logic — no SQL, no HTTP, no WebSocket protocol details

**Infrastructure (`src/infrastructure/`)**
- Implements domain ports
- Allowed to import NestJS, TypeORM, external SDKs
- Never imported by `domain/` or `application/`

## Import violations

These imports are **forbidden** and will fail CI:

| From | Cannot import |
|---|---|
| `domain/` | `@nestjs/*`, `typeorm`, `express`, anything in `infrastructure/` |
| `application/` | `@nestjs/*`, `typeorm`, anything in `infrastructure/` |
| `infrastructure/` | anything in `application/` (adapters implement ports, not use cases) |

## Ports are types, not interfaces

Ports define contracts as TypeScript `type` aliases.

**Wrong:**
```typescript
interface PriceRepository {
  findBySymbol(symbol: string): Promise<Price | null>
}
```

**Right:**
```typescript
// src/domain/port/price-repository.port.ts
type PriceRepositoryPort = {
  findBySymbol(symbol: string): Promise<Price | null>
  save(price: Price): Promise<void>
}

export type { PriceRepositoryPort }
```

## DI token pattern

Each port has a corresponding injection token defined in `shared/tokens.ts`.

```typescript
// src/shared/tokens.ts
export const TOKENS = {
  PriceRepository: Symbol('PriceRepository'),
  FinnhubClient: Symbol('FinnhubClient'),
  Logger: Symbol('Logger'),
} as const

type Tokens = typeof TOKENS
export type { Tokens }
```

Inject by token in use cases:
```typescript
// src/application/use-case/fetch-price.use-case.ts
import { Inject, Injectable } from '@nestjs/common'
import { TOKENS } from '../../shared/tokens'
import type { PriceRepositoryPort } from '../../domain/port/price-repository.port'
import type { Price } from '../../domain/model/price.model'

@Injectable()
export class FetchPriceUseCase {
  constructor(
    @Inject(TOKENS.PriceRepository)
    private readonly priceRepository: PriceRepositoryPort,
  ) {}

  async execute(symbol: string): Promise<Price | null> {
    return this.priceRepository.findBySymbol(symbol)
  }
}
```

Bind in the NestJS module:
```typescript
{
  provide: TOKENS.PriceRepository,
  useClass: TypeOrmPriceRepository,
}
```
