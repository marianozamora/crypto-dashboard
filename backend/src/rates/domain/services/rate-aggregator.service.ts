import type { Price } from '../value-objects/price.vo'

type RateTickForAggregation = {
  readonly price: Price
  readonly timestamp: number
}

const calculateHourlyAverage = (ticks: readonly RateTickForAggregation[]): number | null => {
  if (ticks.length === 0) return null
  const sum = ticks.reduce((acc, tick) => acc + tick.price.value, 0)
  return sum / ticks.length
}

export { calculateHourlyAverage }
export type { RateTickForAggregation }
