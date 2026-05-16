import type { CurrencyPair, RateUpdate } from '@crypto/shared'

type RateMap = Record<CurrencyPair, RateUpdate | null>
type TimestampMap = Record<CurrencyPair, number | null>

type RateState = {
  readonly rates: RateMap
  readonly lastUpdatedAt: TimestampMap
}

type RateActions = {
  readonly updateRate: (update: RateUpdate) => void
  readonly reset: () => void
}

type RateStore = RateState & RateActions

export type { RateMap, TimestampMap, RateState, RateActions, RateStore }
