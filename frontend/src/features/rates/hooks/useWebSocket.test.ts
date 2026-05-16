import { renderHook, act } from '@testing-library/react'
import { useWebSocket } from './useWebSocket'
import { useRatesStore } from '../store/rates.store'
import { useCommentaryStore } from '@features/commentary/store/commentary.store'
import { SOCKET_EVENTS } from '@crypto/shared'
import type { RateUpdate, MarketCommentary } from '@crypto/shared'

type MockClient = {
  connect: ReturnType<typeof vi.fn>
  disconnect: ReturnType<typeof vi.fn>
  on: ReturnType<typeof vi.fn>
  onStateChange: ReturnType<typeof vi.fn>
  getConnectionState: ReturnType<typeof vi.fn>
}

const mockClient = vi.hoisted(
  (): MockClient => ({
    connect: vi.fn(),
    disconnect: vi.fn(),
    on: vi.fn(),
    onStateChange: vi.fn(),
    getConnectionState: vi.fn().mockReturnValue('connecting'),
  }),
)

vi.mock('@lib/websocket/WebSocketClient', () => ({
  createWebSocketClient: vi.fn().mockImplementation(function () {
    return mockClient
  }),
}))

const getOnHandler = (event: string): ((data: unknown) => void) => {
  const call = (mockClient.on.mock.calls as [string, (data: unknown) => void][]).find(
    ([e]) => e === event,
  )
  if (!call) throw new Error(`No handler registered for: ${event}`)
  return call[1]
}

describe('useWebSocket', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    useRatesStore.getState().reset()
    useCommentaryStore.setState({ commentary: null })
  })

  it('should start with connecting state', () => {
    const { result } = renderHook(() => useWebSocket())
    expect(result.current.connectionState).toBe('connecting')
  })

  it('should call client.connect() on mount', () => {
    renderHook(() => useWebSocket())
    expect(mockClient.connect).toHaveBeenCalledTimes(1)
  })

  it('should call client.disconnect() on unmount', () => {
    const { unmount } = renderHook(() => useWebSocket())
    unmount()
    expect(mockClient.disconnect).toHaveBeenCalledTimes(1)
  })

  it('should register handler for RATE_UPDATE event', () => {
    renderHook(() => useWebSocket())
    const events = (mockClient.on.mock.calls as [string, unknown][]).map(([e]) => e)
    expect(events).toContain(SOCKET_EVENTS.RATE_UPDATE)
  })

  it('should register handler for COMMENTARY_UPDATE event', () => {
    renderHook(() => useWebSocket())
    const events = (mockClient.on.mock.calls as [string, unknown][]).map(([e]) => e)
    expect(events).toContain(SOCKET_EVENTS.COMMENTARY_UPDATE)
  })

  it('should update connectionState when onStateChange fires', () => {
    const { result } = renderHook(() => useWebSocket())
    const stateHandler = (mockClient.onStateChange.mock.calls[0] as [
      (s: string) => void,
    ])[0]
    act(() => { stateHandler('connected') })
    expect(result.current.connectionState).toBe('connected')
  })

  it('should call updateRate when RATE_UPDATE received', () => {
    renderHook(() => useWebSocket())
    const handler = getOnHandler(SOCKET_EVENTS.RATE_UPDATE)
    const update: RateUpdate = {
      pair: 'ETH/USDC',
      price: 2341.56,
      timestamp: '2025-01-15T10:30:00.000Z',
      hourlyAverage: 2310.0,
    }
    act(() => { handler(update) })
    expect(useRatesStore.getState().rates['ETH/USDC']).toEqual(update)
  })

  it('should call setCommentary when COMMENTARY_UPDATE received', () => {
    renderHook(() => useWebSocket())
    const handler = getOnHandler(SOCKET_EVENTS.COMMENTARY_UPDATE)
    const commentary: MarketCommentary = {
      text: 'ETH markets strong.',
      generatedAt: '2025-01-15T10:00:00.000Z',
      pairs: ['ETH/USDT', 'ETH/USDC', 'ETH/BTC'],
    }
    act(() => { handler(commentary) })
    expect(useCommentaryStore.getState().commentary).toEqual(commentary)
  })
})
