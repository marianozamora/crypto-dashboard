import { renderHook, act } from '@testing-library/react'
import { useCommentary } from './useCommentary'
import { useCommentaryStore } from '../store/commentary.store'
import type { MarketCommentary } from '@crypto/shared'

const mockCommentary: MarketCommentary = {
  text: 'ETH markets show strong momentum.',
  generatedAt: '2025-01-15T10:00:00.000Z',
  pairs: ['ETH/USDT', 'ETH/USDC', 'ETH/BTC'],
}

describe('useCommentary', () => {
  beforeEach(() => {
    useCommentaryStore.setState({ commentary: null })
  })

  it('should return null commentary initially', () => {
    const { result } = renderHook(() => useCommentary())
    expect(result.current.commentary).toBeNull()
  })

  it('should return false for hasCommentary initially', () => {
    const { result } = renderHook(() => useCommentary())
    expect(result.current.hasCommentary).toBe(false)
  })

  it('should return commentary after store update', () => {
    const { result } = renderHook(() => useCommentary())
    act(() => { useCommentaryStore.getState().setCommentary(mockCommentary) })
    expect(result.current.commentary).toEqual(mockCommentary)
  })

  it('should return true for hasCommentary after store update', () => {
    const { result } = renderHook(() => useCommentary())
    act(() => { useCommentaryStore.getState().setCommentary(mockCommentary) })
    expect(result.current.hasCommentary).toBe(true)
  })
})
