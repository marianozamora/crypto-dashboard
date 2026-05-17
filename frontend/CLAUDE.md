# frontend — React · Vite · Zustand · Recharts · Tailwind CSS

## Architecture

Feature-Sliced Design (FSD). See `.claude/rules/fsd.md` for the complete rule set.

```
src/
  app/        ← providers, router, global styles
  pages/      ← page compositions (no business logic)
  widgets/    ← complex blocks connected to Zustand
  features/   ← user actions and interactions
  entities/   ← price, ticker, portfolio — stores and domain types
  shared/     ← ui, lib, api, config
```

## FSD import direction (enforced by CI)

```
app → pages → widgets → features → entities → shared
```

Lower layers cannot import from higher layers. Use path aliases:

```json
{
  "@/app":      "src/app",
  "@/pages":    "src/pages",
  "@/widgets":  "src/widgets",
  "@/features": "src/features",
  "@/entities": "src/entities",
  "@/shared":   "src/shared"
}
```

## Atomic design rules

Components live in `shared/ui/` by complexity tier:
- **Atoms** (`shared/ui/atoms/`): zero domain knowledge, zero Zustand, zero API calls
- **Molecules** (`shared/ui/molecules/`): compose atoms; still no domain types, no data fetching
- **Organisms** (`shared/ui/organisms/`): accept domain types as props; never fetch or subscribe internally; Storybook story required

## Testing conventions

- **Framework:** Vitest + React Testing Library
- **Hooks:** `renderHook` from `@testing-library/react`
- **Mocks:** typed with `vi.fn()`, no `any`
- **Naming:** `"should [behavior] when [condition]"`
- **Coverage:** every hook needs loading, success, and error states

## Zustand patterns

- One slice per entity (`priceSlice`, `tickerSlice`)
- State shape is a `type`, never an `interface`
- Selectors are named functions exported from the store file
- Never mutate state directly — always use `set`

```typescript
type PriceState = {
  prices: Readonly<Record<string, Price>>
  isConnected: boolean
  setPrice: (symbol: string, price: Price) => void
  setConnected: (isConnected: boolean) => void
}

const usePriceStore = create<PriceState>((set) => ({
  prices: {},
  isConnected: false,
  setPrice: (symbol, price): void =>
    set((state) => ({ prices: { ...state.prices, [symbol]: price } })),
  setConnected: (isConnected): void => set({ isConnected }),
}))
```

## TypeScript requirements

All rules from `.claude/rules/typescript.md` apply:
- `type` over `interface` — no exceptions
- Zero `any`
- Explicit return types on every function, hook, and component
- No `as` casting
- Type guards at API response boundaries

## Scripts

```bash
npm run dev              # Vite dev server
npm run build            # Vite production build
npm run lint             # ESLint
npm run type-check       # tsc --noEmit
npm run test             # Vitest
npm run test:coverage    # Vitest with coverage report
npm run storybook        # Storybook dev server
npm run storybook:build  # Storybook static build
```

## Design system

Always read `/STYLE.md` before creating or editing components. Follow it strictly:
- Use only colors defined in STYLE.md
- Numbers and prices: always `font-mono`
- Labels: always `stat-label` class (`text-white/40 text-xs uppercase tracking-wide`)
- Cards: always `.card` class (defined in `globals.css`)
- Never add `box-shadow`
- Never use light backgrounds
