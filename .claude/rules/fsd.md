# Feature-Sliced Design Rules

## Folder structure

```
src/
  app/          ← providers, routing, global styles
  pages/        ← page compositions (no business logic)
  widgets/      ← complex self-contained blocks
  features/     ← user interactions (actions, forms, filters)
  entities/     ← business entities (price, ticker, portfolio)
  shared/       ← reusable primitives (ui, lib, api, config)
```

## Import direction — strictly one-way

Higher layers may import from lower layers. Lower layers must never import from higher.

```
app → pages → widgets → features → entities → shared
```

**Forbidden imports:**
```typescript
// In shared/ — WRONG
import { usePrice } from 'features/price'

// In entities/ — WRONG
import { PriceWidget } from 'widgets/price-widget'

// In features/ — WRONG
import { DashboardPage } from 'pages/dashboard'
```

**Correct:**
```typescript
// In features/ — importing from entities and shared is fine
import type { Price } from '@/entities/price'
import { formatCurrency } from '@/shared/lib/format'
```

Use path aliases (`@/shared`, `@/entities`, etc.) so imports are unambiguous.

## Atomic design rules

Atomic components live in `shared/ui/` and are organized by complexity:

```
shared/ui/
  atoms/        ← Button, Input, Badge, Spinner
  molecules/    ← PriceTag, SearchField, CurrencyInput
  organisms/    ← PriceTable, CandlestickChart, TickerList
```

**Atoms** — single-responsibility, zero domain knowledge:
- Renders one visual primitive
- Props are generic (no `Price`, no `Ticker` types)
- No Zustand, no API calls

**Molecules** — compose atoms:
- Combines 2–4 atoms into a small unit
- Props are still generic where possible
- No Zustand, no API calls

**Organisms** — compose molecules/atoms:
- May accept domain types as props (passed in, not fetched)
- No Zustand, no API calls — data always passed as props
- Storybook stories required

**Wrong (organism fetching its own data):**
```typescript
function PriceTable(): JSX.Element {
  const prices = usePriceStore(s => s.prices) // ← violation
  return <table>...</table>
}
```

**Right (organism receives data as props):**
```typescript
type PriceTableProps = {
  prices: readonly Price[]
  isLoading: boolean
}

function PriceTable({ prices, isLoading }: PriceTableProps): JSX.Element {
  return <table>...</table>
}
```

Connect data in a `feature` or `widget`, not inside the organism.

## What goes where

| Thing | Layer |
|---|---|
| Page-level layout | `pages/` |
| Chart connected to Zustand | `widgets/` |
| "Add to watchlist" button with logic | `features/` |
| Price domain type | `entities/price/model` |
| Zustand price store | `entities/price/model` |
| `fetchPrice` API call | `entities/price/api` |
| `Button`, `Spinner` components | `shared/ui/atoms` |
| `formatCurrency` util | `shared/lib` |
| API base client | `shared/api` |
| Constants, env | `shared/config` |
