import { renderHook, act } from '@testing-library/react'
import { useRates } from './useRates'
import { useRatesStore } from '../store/rates.store'
import type { RateUpdate } from '@crypto/shared'

const mockUpdate: RateUpdate = {
  pair: 'ETH/USDC',
  price: 2341.56,
  timestamp: '2025-01-15T10:30:00.000Z',
  hourlyAverage: 2310.0,
}

describe('useRates', () => {
  beforeEach(() => {
    useRatesStore.getState().reset()
  })

  it('should return null for all pairs initially', () => {
    const { result } = renderHook(() => useRates())
    expect(result.current.rates['ETH/USDC']).toBeNull()
    expect(result.current.rates['ETH/USDT']).toBeNull()
    expect(result.current.rates['ETH/BTC']).toBeNull()
  })

  it('should return updated rate after store update', () => {
    const { result } = renderHook(() => useRates())
    act(() => { useRatesStore.getState().updateRate(mockUpdate) })
    expect(result.current.rates['ETH/USDC']).toEqual(mockUpdate)
  })

  it('should return correct rate for specific pair via getRateForPair', () => {
    const { result } = renderHook(() => useRates())
    act(() => { useRatesStore.getState().updateRate(mockUpdate) })
    expect(result.current.getRateForPair('ETH/USDC')).toEqual(mockUpdate)
  })

  it('should return null for pair that has not been updated', () => {
    const { result } = renderHook(() => useRates())
    act(() => { useRatesStore.getState().updateRate(mockUpdate) })
    expect(result.current.getRateForPair('ETH/BTC')).toBeNull()
  })

  it('should not affect other pairs when one updates', () => {
    const { result } = renderHook(() => useRates())
    act(() => { useRatesStore.getState().updateRate(mockUpdate) })
    expect(result.current.rates['ETH/USDT']).toBeNull()
    expect(result.current.rates['ETH/BTC']).toBeNull()
  })
})
