# TypeScript Rules

## type over interface — always, no exceptions

Use `type` for every type declaration. Never use `interface`.

**Wrong:**
```typescript
interface User {
  id: string
  email: string
}
```

**Right:**
```typescript
type User = {
  id: string
  email: string
}
```

**Why:** `interface` can be accidentally extended via declaration merging, which breaks the closed-world assumption we rely on in domain types. `type` is always closed and explicit.

## Zero `any`

Never use `any`. It silently disables type checking.

**Wrong:**
```typescript
function parse(data: any): any {
  return data.value
}
```

**Right — use `unknown` and narrow:**
```typescript
type ParsedResult = { value: string }

function isValidResult(data: unknown): data is ParsedResult {
  return (
    typeof data === 'object' &&
    data !== null &&
    'value' in data &&
    typeof (data as Record<string, unknown>).value === 'string'
  )
}

function parse(data: unknown): ParsedResult {
  if (!isValidResult(data)) throw new Error('Invalid data shape')
  return data
}
```

If you receive `any` from a third-party library, immediately cast it to `unknown` at the boundary and narrow before use.

## Explicit return types — always

Every function (named, arrow, method) must declare its return type.

**Wrong:**
```typescript
function getUser(id: string) {
  return repository.findById(id)
}

const formatPrice = (price: number) => `$${price.toFixed(2)}`
```

**Right:**
```typescript
function getUser(id: string): Promise<User | null> {
  return repository.findById(id)
}

const formatPrice = (price: number): string => `$${price.toFixed(2)}`
```

This applies to React components too:
```typescript
function PriceCard({ price }: PriceCardProps): JSX.Element {
  return <div>{formatPrice(price)}</div>
}
```

## Type guards over casting

Prefer user-defined type guards over `as` casting. Type guards are runtime-safe; `as` casting is a lie you tell the compiler.

**Wrong:**
```typescript
const event = raw as WebSocketEvent
```

**Right:**
```typescript
function isWebSocketEvent(raw: unknown): raw is WebSocketEvent {
  return (
    typeof raw === 'object' &&
    raw !== null &&
    'type' in raw &&
    'payload' in raw
  )
}

if (!isWebSocketEvent(raw)) throw new Error('Unexpected message shape')
const event = raw // inferred as WebSocketEvent
```

## Path aliases

Never use deep relative imports (`../../`, `../../../`, etc.). Use path aliases instead.

**Wrong:**
```typescript
import { createPrice } from '../../domain/value-objects/price.vo'
import { AppLoggerService } from '../../../shared/logger/app-logger.service'
```

**Right:**
```typescript
import { createPrice } from '@domain/value-objects/price.vo'
import { AppLoggerService } from '@logger/app-logger.service'
```

### Backend aliases (`backend/tsconfig.json`)

| Alias | Resolves to |
|-------|------------|
| `@domain/*` | `src/rates/domain/*` |
| `@application/*` | `src/rates/application/*` |
| `@infrastructure/*` | `src/rates/infrastructure/*` |
| `@ai/*` | `src/ai/*` |
| `@shared/*` | `src/shared/*` |
| `@config/*` | `src/shared/config/*` |
| `@logger/*` | `src/shared/logger/*` |

### Frontend aliases (`frontend/tsconfig.json`)

| Alias | Resolves to |
|-------|------------|
| `@app/*` | `src/app/*` |
| `@pages/*` | `src/pages/*` |
| `@widgets/*` | `src/widgets/*` |
| `@features/*` | `src/features/*` |
| `@entities/*` | `src/entities/*` |
| `@shared/*` | `src/shared/*` |

Same-directory (`./`) and one-level-up (`../`) relative imports are allowed when both files are in the same module boundary. Cross-module imports always use aliases.

Runtime resolution: `tsconfig-paths/register` (Node.js); `vite-tsconfig-paths` plugin (Vite / Vitest).

## Never use `as` casting

`as` casting tells TypeScript "trust me" — it bypasses type checking entirely and hides bugs.

**The only accepted exceptions:**
1. `as const` — to infer literal types
2. `as unknown as T` — when you have exhausted all alternatives, documented with a comment explaining why

**Wrong:**
```typescript
const price = response.data as PriceData
const el = document.getElementById('root') as HTMLElement
```

**Right:**
```typescript
const el = document.getElementById('root')
if (!(el instanceof HTMLElement)) throw new Error('Root element not found')
// el is now HTMLElement
```

## Zero classes in frontend

Use factory functions instead of classes everywhere in the frontend.
The only exception is `react-error-boundary`, which abstracts the class
requirement internally.

**Wrong:**
```typescript
class WebSocketClient {
  connect(): void { ... }
}
```

**Right:**
```typescript
type WebSocketClient = { connect(): void }
const createWebSocketClient = (options: WebSocketClientOptions): WebSocketClient => ({
  connect: () => { ... },
})
```
