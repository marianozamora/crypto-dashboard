import { calculateHourlyAverage, calculateChangePercent } from './rate-aggregator.service'
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

  it('should return the price when single tick provided', () => {
    expect(calculateHourlyAverage([makeTick(100)])).toBe(100)
  })

  it('should calculate average correctly for multiple ticks', () => {
    expect(calculateHourlyAverage([makeTick(100), makeTick(200), makeTick(300)])).toBe(200)
  })

  it('should handle large arrays without precision issues', () => {
    const PRICE = 3_000.5
    const ticks = Array.from({ length: 1_000 }, () => makeTick(PRICE))
    expect(calculateHourlyAverage(ticks)).toBeCloseTo(PRICE, 10)
  })
})

describe('calculateChangePercent', () => {
  it('should return null when previous is null', () => {
    expect(calculateChangePercent(100, null)).toBeNull()
  })

  it('should return null when previous is zero', () => {
    expect(calculateChangePercent(100, 0)).toBeNull()
  })

  it('should calculate positive change correctly', () => {
    expect(calculateChangePercent(110, 100)).toBeCloseTo(10, 10)
  })

  it('should calculate negative change correctly', () => {
    expect(calculateChangePercent(90, 100)).toBeCloseTo(-10, 10)
  })

  it('should return zero when current equals previous', () => {
    expect(calculateChangePercent(100, 100)).toBe(0)
  })
})
