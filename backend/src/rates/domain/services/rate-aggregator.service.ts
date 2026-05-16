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

const calculateChangePercent = (current: number, previous: number | null): number | null => {
  if (previous === null || previous === 0) return null
  return ((current - previous) / previous) * 100
}

export { calculateHourlyAverage, calculateChangePercent }
export type { RateTickForAggregation }
