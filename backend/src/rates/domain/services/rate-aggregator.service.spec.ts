import { calculateHourlyAverage } from './rate-aggregator.service'
import type { RateTickForAggregation } from './rate-aggregator.service'
import { createPrice } from '../value-objects/price.vo'

const makeTick = (price: number): RateTickForAggregation => ({
  price: createPrice(price),
  timestamp: Date.now(),
})

describe('calculateHourlyAverage', () => {
  it('should return null when ticks array is empty', () => {
    expect(calculateHourlyAverage([])).toBeNull()
  })

  it('should calculate average correctly for single tick', () => {
    expect(calculateHourlyAverage([makeTick(100)])).toBe(100)
  })

  it('should calculate average correctly for multiple ticks', () => {
    const ticks = [makeTick(100), makeTick(200), makeTick(300)]
    expect(calculateHourlyAverage(ticks)).toBe(200)
  })

  it('should handle large arrays without precision loss', () => {
    const PRICE = 3_000.5
    const ticks = Array.from({ length: 1_000 }, () => makeTick(PRICE))
    expect(calculateHourlyAverage(ticks)).toBeCloseTo(PRICE, 10)
  })
})
