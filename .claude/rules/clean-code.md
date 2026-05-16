# Clean Code Rules

## Naming conventions

Follow these prefixes and patterns consistently:

| Pattern | Used for | Examples |
|---|---|---|
| `isX` / `hasX` / `canX` | boolean state or checks | `isLoading`, `hasError`, `canSubmit` |
| `verb + noun` | functions and handlers | `fetchPrice`, `formatCurrency`, `handleSubmit` |
| `onX` | event prop names | `onPriceUpdate`, `onChange`, `onClose` |
| `UPPER_SNAKE` | constants | `MAX_RETRIES`, `DEFAULT_INTERVAL_MS` |
| `XRepository` | repository classes | `PriceRepository` |
| `XUseCase` | use case classes | `FetchPriceUseCase` |
| `useX` | React hooks | `usePrice`, `useCryptoStream` |
| `XSlice` | Zustand slices | `priceSlice` |

**Wrong:**
```typescript
const loading = true
function data() { ... }
const r = new Repository()
```

**Right:**
```typescript
const isLoading = true
function fetchPriceData(): Promise<Price[]> { ... }
const priceRepository = new PriceRepository()
```

## Max 20 lines per function

Functions longer than 20 lines must be split. Count blank lines and comments.

**Wrong:**
```typescript
function processWebSocketMessage(raw: unknown): void {
  if (typeof raw !== 'string') throw new Error('Expected string')
  const parsed = JSON.parse(raw)
  if (!parsed.type) throw new Error('Missing type')
  if (parsed.type === 'price') {
    const price = parsed.data.price
    const symbol = parsed.data.symbol
    const timestamp = new Date(parsed.data.ts)
    store.dispatch({ type: 'SET_PRICE', symbol, price, timestamp })
    metrics.increment('price_update')
    logger.debug(`Price update: ${symbol} = ${price}`)
    // ... continues past 20 lines
  }
}
```

**Right — extract sub-functions:**
```typescript
function parseRawMessage(raw: unknown): WebSocketMessage {
  if (typeof raw !== 'string') throw new Error('Expected string')
  const parsed: unknown = JSON.parse(raw)
  if (!isWebSocketMessage(parsed)) throw new Error('Invalid shape')
  return parsed
}

function handlePriceMessage(message: PriceMessage): void {
  const price = mapToDomainPrice(message.data)
  store.dispatch(priceActions.setPrice(price))
  metrics.increment('price_update')
  logger.debug(`Price update: ${price.symbol} = ${price.value}`)
}

function processWebSocketMessage(raw: unknown): void {
  const message = parseRawMessage(raw)
  if (message.type === 'price') handlePriceMessage(message)
}
```

## No magic numbers

Every literal number must be assigned to a named constant.

**Wrong:**
```typescript
await delay(5000)
if (retries > 3) throw new Error('Too many retries')
const fee = price * 0.025
```

**Right:**
```typescript
const RECONNECT_DELAY_MS = 5_000
const MAX_RETRIES = 3
const TRADING_FEE_RATE = 0.025

await delay(RECONNECT_DELAY_MS)
if (retries > MAX_RETRIES) throw new Error('Too many retries')
const fee = price * TRADING_FEE_RATE
```

Constants live in a `constants.ts` file in the same module.

## Early returns over nesting

Reduce nesting with early returns (guard clauses). The happy path should be at the bottom.

**Wrong:**
```typescript
function getFormattedPrice(ticker: Ticker | null): string {
  if (ticker !== null) {
    if (ticker.price > 0) {
      if (ticker.currency === 'USD') {
        return `$${ticker.price.toFixed(2)}`
      } else {
        return `${ticker.price.toFixed(2)} ${ticker.currency}`
      }
    } else {
      return 'N/A'
    }
  } else {
    return 'Loading...'
  }
}
```

**Right:**
```typescript
function getFormattedPrice(ticker: Ticker | null): string {
  if (ticker === null) return 'Loading...'
  if (ticker.price <= 0) return 'N/A'
  if (ticker.currency !== 'USD') return `${ticker.price.toFixed(2)} ${ticker.currency}`
  return `$${ticker.price.toFixed(2)}`
}
```

## No commented-out code

Commented-out code must not be committed. Use git to recover old code.

**Wrong:**
```typescript
// function oldFetch(url: string) {
//   return fetch(url).then(r => r.json())
// }

function fetchPrice(symbol: string): Promise<Price> {
  // TODO: add caching
  return priceRepository.findBySymbol(symbol)
}
```

**Right:**
```typescript
function fetchPrice(symbol: string): Promise<Price> {
  return priceRepository.findBySymbol(symbol)
}
```

If a TODO is genuine, create a GitHub issue instead of leaving it in the code.
