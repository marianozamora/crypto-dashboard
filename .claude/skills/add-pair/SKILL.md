# Skill: add-pair

Adds a matched backend + frontend feature pair: a new data entity that the backend streams and the frontend displays.

## When to use

When asked to add support for a new cryptocurrency pair or data stream (e.g., "add BINANCE:BTCUSDT support").

## Steps

### Backend

#### 1. Domain model

Create `src/domain/model/<pair>.model.ts`:

```typescript
type TradingPair = {
  readonly symbol: string
  readonly displayName: string
  readonly baseCurrency: string
  readonly quoteCurrency: string
}

export type { TradingPair }
```

#### 2. Constants

Add the new symbol to `src/shared/constants.ts`. Finnhub symbols for this project:

```typescript
export const TRADING_PAIRS = {
  ETH_USDC: 'BINANCE:ETHUSDC',
  ETH_USDT: 'BINANCE:ETHUSDT',
  ETH_BTC: 'BINANCE:ETHBTC',
} as const

type TradingPairSymbol = (typeof TRADING_PAIRS)[keyof typeof TRADING_PAIRS]
export type { TradingPairSymbol }
```

Never use raw Finnhub symbol strings in adapter code — always reference the constant.

#### 3. Adapter / infrastructure

Add the new symbol to the Finnhub WebSocket subscription list in the WS adapter. Reference the constant from `shared/constants.ts`.

#### 4. Backend tests

Write unit tests for any new use case or adapter logic using the `test-writer` agent.

---

### Frontend

#### 1. Constants

Mirror the pair in `src/shared/config/trading-pairs.ts`:

```typescript
export const TRADING_PAIRS = {
  ETH_USDC: 'BINANCE:ETHUSDC',
  ETH_USDT: 'BINANCE:ETHUSDT',
  ETH_BTC: 'BINANCE:ETHBTC',
} as const

export type TradingPairSymbol = (typeof TRADING_PAIRS)[keyof typeof TRADING_PAIRS]
```

#### 2. Entity store

Update or create `src/entities/<pair>/model/use-<pair>-store.ts` using Zustand:

```typescript
import { create } from 'zustand'
import type { Price } from '../model/price.model'

type PriceStoreState = {
  prices: Readonly<Record<string, Price>>
  setPrice: (symbol: string, price: Price) => void
}

const usePriceStore = create<PriceStoreState>((set) => ({
  prices: {},
  setPrice: (symbol, price): void =>
    set((state) => ({ prices: { ...state.prices, [symbol]: price } })),
}))

export { usePriceStore }
export type { PriceStoreState }
```

#### 3. Frontend tests

Write Vitest tests for the store and any new hooks using the `test-writer` agent.

---

### Verify

```bash
npm run type-check
npm run lint
npm run test
```

All three must pass with zero errors before the task is complete.
