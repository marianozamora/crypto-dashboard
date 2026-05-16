import type { CurrencyPairValue } from '../value-objects/currency-pair.vo'

type HourlyAverage = {
  readonly pair: CurrencyPairValue
  readonly average: number
  readonly periodStart: string
  readonly periodEnd: string
}

const createHourlyAverage = (
  pair: CurrencyPairValue,
  average: number,
  periodStart: string,
  periodEnd: string,
): HourlyAverage => ({ pair, average, periodStart, periodEnd })

export { createHourlyAverage }
export type { HourlyAverage }
