import { CurrencyPair } from '../value-objects/currency-pair.vo'
import { Price } from '../value-objects/price.vo'

type RateProps = {
  readonly pair: CurrencyPair
  readonly price: Price
  readonly timestamp: number
}

class Rate {
  private constructor(private readonly props: RateProps) {}

  static create(pair: CurrencyPair, price: number, timestamp: number): Rate {
    return new Rate({ pair, price: Price.create(price), timestamp })
  }

  getPair(): CurrencyPair {
    return this.props.pair
  }

  getPrice(): number {
    return this.props.price.getValue()
  }

  getTimestamp(): number {
    return this.props.timestamp
  }
}

export { Rate }
export type { RateProps }
