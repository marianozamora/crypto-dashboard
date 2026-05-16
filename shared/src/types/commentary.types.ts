import type { CurrencyPair } from './rate.types'

type MarketCommentary = {
  readonly text: string
  readonly generatedAt: string
  readonly pairs: readonly CurrencyPair[]
}

export type { MarketCommentary }
