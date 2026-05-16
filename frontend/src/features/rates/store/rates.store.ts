import { create } from 'zustand'
import type { RateStore, RateMap, TimestampMap } from '../types/rate.types'
import { CURRENCY_PAIRS } from '@config/constants'
import type { RateUpdate } from '@crypto/shared'

const buildInitialRates = (): RateMap =>
  Object.fromEntries(CURRENCY_PAIRS.map((pair) => [pair, null])) as RateMap

const buildInitialTimestamps = (): TimestampMap =>
  Object.fromEntries(CURRENCY_PAIRS.map((pair) => [pair, null])) as TimestampMap

const useRatesStore = create<RateStore>((set) => ({
  rates: buildInitialRates(),
  lastUpdatedAt: buildInitialTimestamps(),

  updateRate: (update: RateUpdate): void =>
    set((state) => ({
      rates: { ...state.rates, [update.pair]: update },
      lastUpdatedAt: {
        ...state.lastUpdatedAt,
        [update.pair]: new Date(update.timestamp).getTime(),
      },
    })),

  reset: (): void =>
    set({
      rates: buildInitialRates(),
      lastUpdatedAt: buildInitialTimestamps(),
    }),
}))

export { useRatesStore }
