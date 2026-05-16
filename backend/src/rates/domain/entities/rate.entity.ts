import type { CurrencyPairValue } from '../value-objects/currency-pair.vo'
import type { Price } from '../value-objects/price.vo'

type Rate = {
  readonly pair: CurrencyPairValue
  readonly price: Price
  readonly timestamp: number
}

const createRate = (pair: CurrencyPairValue, price: Price, timestamp: number): Rate => ({
  pair,
  price,
  timestamp,
})

export { createRate }
export type { Rate }
