import { useRatesStore } from './rates.store'
import type { RateUpdate } from '@crypto/shared'

const mockRateUpdate: RateUpdate = {
  pair: 'ETH/USDC',
  price: 2341.56,
  timestamp: '2025-01-15T10:30:00.000Z',
  hourlyAverage: 2310.0,
}

describe('useRatesStore', () => {
  beforeEach(() => {
    useRatesStore.getState().reset()
  })

  describe('initial state', () => {
    it('should initialize all pairs as null', () => {
      const { rates } = useRatesStore.getState()
      expect(rates['ETH/USDC']).toBeNull()
      expect(rates['ETH/USDT']).toBeNull()
      expect(rates['ETH/BTC']).toBeNull()
    })

    it('should initialize all timestamps as null', () => {
      const { lastUpdatedAt } = useRatesStore.getState()
      expect(lastUpdatedAt['ETH/USDC']).toBeNull()
      expect(lastUpdatedAt['ETH/USDT']).toBeNull()
      expect(lastUpdatedAt['ETH/BTC']).toBeNull()
    })
  })

  describe('updateRate', () => {
    it('should update rate for correct pair', () => {
      useRatesStore.getState().updateRate(mockRateUpdate)
      expect(useRatesStore.getState().rates['ETH/USDC']).toEqual(mockRateUpdate)
    })

    it('should update timestamp for correct pair', () => {
      useRatesStore.getState().updateRate(mockRateUpdate)
      expect(useRatesStore.getState().lastUpdatedAt['ETH/USDC']).toBe(
        new Date(mockRateUpdate.timestamp).getTime(),
      )
    })

    it('should not affect other pairs when updating one', () => {
      useRatesStore.getState().updateRate(mockRateUpdate)
      expect(useRatesStore.getState().rates['ETH/USDT']).toBeNull()
      expect(useRatesStore.getState().rates['ETH/BTC']).toBeNull()
    })

    it('should overwrite previous rate for same pair', () => {
      useRatesStore.getState().updateRate(mockRateUpdate)
      const updated: RateUpdate = { ...mockRateUpdate, price: 9999 }
      useRatesStore.getState().updateRate(updated)
      expect(useRatesStore.getState().rates['ETH/USDC']?.price).toBe(9999)
    })

    it('should store hourlyAverage correctly', () => {
      useRatesStore.getState().updateRate(mockRateUpdate)
      expect(useRatesStore.getState().rates['ETH/USDC']?.hourlyAverage).toBe(2310.0)
    })
  })

  describe('reset', () => {
    it('should reset all rates to null after updates', () => {
      useRatesStore.getState().updateRate(mockRateUpdate)
      useRatesStore.getState().reset()
      expect(useRatesStore.getState().rates['ETH/USDC']).toBeNull()
    })

    it('should reset all timestamps to null after updates', () => {
      useRatesStore.getState().updateRate(mockRateUpdate)
      useRatesStore.getState().reset()
      expect(useRatesStore.getState().lastUpdatedAt['ETH/USDC']).toBeNull()
    })
  })
})
