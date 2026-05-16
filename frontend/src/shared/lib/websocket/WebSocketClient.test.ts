import { createWebSocketClient } from './WebSocketClient'
import { RECONNECT_DELAYS_MS } from '@config/constants'

type MockSocket = {
  connected: boolean
  on: ReturnType<typeof vi.fn>
  off: ReturnType<typeof vi.fn>
  connect: ReturnType<typeof vi.fn>
  disconnect: ReturnType<typeof vi.fn>
}

const createMockSocket = (): MockSocket => ({
  connected: false,
  on: vi.fn(),
  off: vi.fn(),
  connect: vi.fn(),
  disconnect: vi.fn(),
})

let mockSocket: MockSocket

vi.mock('socket.io-client', () => ({
  io: vi.fn().mockImplementation(function () {
    return mockSocket
  }),
}))

const getRegisteredHandler = (event: string): (() => void) => {
  const call = (mockSocket.on.mock.calls as [string, () => void][]).find(
    ([e]) => e === event,
  )
  if (!call) throw new Error(`No handler registered for event: ${event}`)
  return call[1]
}

describe('WebSocketClient', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    mockSocket = createMockSocket()
  })

  afterEach(() => {
    vi.useRealTimers()
    vi.clearAllMocks()
  })

  describe('initial state', () => {
    it('should start with connecting state', () => {
      const client = createWebSocketClient({ url: 'http://localhost:3001' })
      expect(client.getConnectionState()).toBe('connecting')
    })
  })

  describe('connect()', () => {
    it('should create socket with correct url', async () => {
      const { io } = await import('socket.io-client')
      const client = createWebSocketClient({ url: 'http://localhost:3001' })
      client.connect()
      expect(io).toHaveBeenCalledWith('http://localhost:3001', expect.any(Object))
    })

    it('should register connect, disconnect, connect_error handlers', () => {
      const client = createWebSocketClient({ url: 'http://localhost:3001' })
      client.connect()
      const events = (mockSocket.on.mock.calls as [string, unknown][]).map(([e]) => e)
      expect(events).toContain('connect')
      expect(events).toContain('disconnect')
      expect(events).toContain('connect_error')
    })

    it('should not create duplicate socket if already connected', async () => {
      const { io } = await import('socket.io-client')
      const client = createWebSocketClient({ url: 'http://localhost:3001' })
      mockSocket.connected = true
      client.connect()
      client.connect()
      expect(io).toHaveBeenCalledTimes(1)
    })
  })

  describe('disconnect()', () => {
    it('should update state to disconnected', () => {
      const client = createWebSocketClient({ url: 'http://localhost:3001' })
      client.connect()
      client.disconnect()
      expect(client.getConnectionState()).toBe('disconnected')
    })

    it('should prevent reconnection after manual disconnect', () => {
      const client = createWebSocketClient({ url: 'http://localhost:3001' })
      client.connect()
      client.disconnect()
      vi.advanceTimersByTime(30_000)
      expect(mockSocket.connect).toHaveBeenCalledTimes(1)
    })
  })

  describe('reconnection', () => {
    it('should schedule reconnect after unexpected disconnect', () => {
      const client = createWebSocketClient({ url: 'http://localhost:3001' })
      client.connect()
      const onDisconnect = getRegisteredHandler('disconnect')
      onDisconnect()
      expect(client.getConnectionState()).toBe('disconnected')
    })

    it('should use first delay on first attempt', () => {
      const client = createWebSocketClient({ url: 'http://localhost:3001' })
      client.connect()
      const onDisconnect = getRegisteredHandler('disconnect')
      mockSocket = createMockSocket()
      vi.clearAllMocks()
      onDisconnect()
      vi.advanceTimersByTime((RECONNECT_DELAYS_MS[0] ?? 1_000) - 1)
      expect(mockSocket.connect).not.toHaveBeenCalled()
      vi.advanceTimersByTime(1)
      expect(mockSocket.connect).toHaveBeenCalledTimes(1)
    })

    it('should cap delay at max value', async () => {
      const { io } = await import('socket.io-client')
      const client = createWebSocketClient({ url: 'http://localhost:3001' })
      client.connect()
      const onDisconnect = getRegisteredHandler('disconnect')
      const maxDelay = RECONNECT_DELAYS_MS[RECONNECT_DELAYS_MS.length - 1] ?? 30_000
      const extraAttempts = 3
      for (let i = 0; i < RECONNECT_DELAYS_MS.length + extraAttempts; i++) {
        mockSocket = createMockSocket()
        onDisconnect()
        vi.advanceTimersByTime(maxDelay)
      }
      expect(io).toHaveBeenCalled()
      expect(client.getConnectionState()).toBe('disconnected')
    })

    it('should NOT reconnect after manual disconnect', () => {
      const client = createWebSocketClient({ url: 'http://localhost:3001' })
      client.connect()
      client.disconnect()
      const connectCallsBefore = mockSocket.connect.mock.calls.length
      vi.advanceTimersByTime(30_000)
      expect(mockSocket.connect.mock.calls.length).toBe(connectCallsBefore)
    })
  })

  describe('on() and off()', () => {
    it('should store handler and attach to socket', () => {
      const client = createWebSocketClient({ url: 'http://localhost:3001' })
      client.connect()
      const handler = vi.fn()
      client.on('rate_update', handler)
      expect(mockSocket.on).toHaveBeenCalledWith('rate_update', handler)
    })

    it('should remove handler and detach from socket', () => {
      const client = createWebSocketClient({ url: 'http://localhost:3001' })
      client.connect()
      const handler = vi.fn()
      client.on('rate_update', handler)
      client.off('rate_update')
      expect(mockSocket.off).toHaveBeenCalledWith('rate_update')
    })

    it('should reattach all handlers after reconnect', () => {
      const client = createWebSocketClient({ url: 'http://localhost:3001' })
      client.connect()
      const handler = vi.fn()
      client.on('rate_update', handler)
      mockSocket = createMockSocket()
      client.connect()
      const onConnect = getRegisteredHandler('connect')
      onConnect()
      expect(mockSocket.on).toHaveBeenCalledWith('rate_update', handler)
    })
  })

  describe('onStateChange()', () => {
    it('should call handler when state changes to connected', () => {
      const client = createWebSocketClient({ url: 'http://localhost:3001' })
      const stateHandler = vi.fn()
      client.onStateChange(stateHandler)
      client.connect()
      getRegisteredHandler('connect')()
      expect(stateHandler).toHaveBeenCalledWith('connected')
    })

    it('should call handler when state changes to disconnected', () => {
      const client = createWebSocketClient({ url: 'http://localhost:3001' })
      const stateHandler = vi.fn()
      client.onStateChange(stateHandler)
      client.connect()
      getRegisteredHandler('disconnect')()
      expect(stateHandler).toHaveBeenCalledWith('disconnected')
    })
  })
})
