import { useRatesStore } from '../store/rates.store'
import type { RateMap, TimestampMap } from '../types/rate.types'
import type { CurrencyPair, RateUpdate } from '@crypto/shared'

type UseRatesReturn = {
  readonly rates: RateMap
  readonly lastUpdatedAt: TimestampMap
  readonly getRateForPair: (pair: CurrencyPair) => RateUpdate | null
}

const useRates = (): UseRatesReturn => {
  const rates = useRatesStore((state) => state.rates)
  const lastUpdatedAt = useRatesStore((state) => state.lastUpdatedAt)

  const getRateForPair = (pair: CurrencyPair): RateUpdate | null => rates[pair] ?? null

  return { rates, lastUpdatedAt, getRateForPair }
}

export { useRates, type UseRatesReturn }
