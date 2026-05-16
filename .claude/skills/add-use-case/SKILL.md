# Skill: add-use-case

Adds a complete backend use case following hexagonal architecture.

## When to use

When asked to add a new business operation to the backend (e.g., "add a use case to fetch historical prices").

## Steps

### 1. Define the port (if it does not exist)

Create or update `src/domain/port/<port-name>.port.ts`:

```typescript
// src/domain/port/price-history-repository.port.ts
import type { PriceHistory } from '../model/price-history.model'

type PriceHistoryRepositoryPort = {
  findBySymbol(symbol: string, limit: number): Promise<readonly PriceHistory[]>
}

export type { PriceHistoryRepositoryPort }
```

Add the token to `src/shared/tokens.ts`.

### 2. Create the use case

Create `src/application/use-case/<name>.use-case.ts`:

```typescript
import { Inject, Injectable } from '@nestjs/common'
import { TOKENS } from '../../shared/tokens'
import type { PriceHistoryRepositoryPort } from '../../domain/port/price-history-repository.port'
import type { PriceHistory } from '../../domain/model/price-history.model'

type FetchHistoryInput = {
  symbol: string
  limit: number
}

@Injectable()
export class FetchPriceHistoryUseCase {
  constructor(
    @Inject(TOKENS.PriceHistoryRepository)
    private readonly repository: PriceHistoryRepositoryPort,
  ) {}

  async execute({ symbol, limit }: FetchHistoryInput): Promise<readonly PriceHistory[]> {
    return this.repository.findBySymbol(symbol, limit)
  }
}
```

### 3. Register in module

Add to the relevant NestJS module:
- `providers`: the use case class
- `providers`: the adapter bound to the token (`{ provide: TOKENS.X, useClass: Y }`)
- `exports`: the use case if needed by other modules

### 4. Write the test

Run the `test-writer` agent with the use case file path. The test must:
- Use plain Jest (no `Test.createTestingModule`)
- Cover happy path, not-found, and error cases
- Use typed mocks (no `any`)

### 5. Verify

```bash
npm run type-check:backend
npm run lint:backend
npm run test:backend
```

All three must pass with zero errors before the task is complete.
