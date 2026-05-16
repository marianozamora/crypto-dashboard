import { CurrencyPair } from '../value-objects/currency-pair.vo'

type HourlyAverageProps = {
  readonly pair: CurrencyPair
  readonly average: number
  readonly periodStart: number
  readonly periodEnd: number
}

class HourlyAverage {
  private constructor(private readonly props: HourlyAverageProps) {}

  static create(
    pair: CurrencyPair,
    average: number,
    periodStart: number,
    periodEnd: number,
  ): HourlyAverage {
    return new HourlyAverage({ pair, average, periodStart, periodEnd })
  }

  getPair(): CurrencyPair {
    return this.props.pair
  }

  getAverage(): number {
    return this.props.average
  }

  getPeriodStart(): number {
    return this.props.periodStart
  }

  getPeriodEnd(): number {
    return this.props.periodEnd
  }
}

export { HourlyAverage }
export type { HourlyAverageProps }
