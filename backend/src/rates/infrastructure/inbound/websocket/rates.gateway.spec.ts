import { RatesGateway } from './rates.gateway'
import { SOCKET_EVENTS } from '@crypto/shared'
import type { AppLoggerService } from '@logger/app-logger.service'
import type { RateUpdate, MarketCommentary } from '@crypto/shared'

type MockLogger = { [K in keyof AppLoggerService]: ReturnType<typeof vi.fn> }
type MockServer = { emit: ReturnType<typeof vi.fn>; sockets: { sockets: { size: number } } }
type MockSocket = { id: string; emit: ReturnType<typeof vi.fn> }

const createMockLogger = (): MockLogger => ({
  logRateTick: vi.fn(),
  logReconnectionAttempt: vi.fn(),
  logClientConnected: vi.fn(),
  logClientDisconnected: vi.fn(),
  logHourlyAverageCalculated: vi.fn(),
  logCommentaryEmitted: vi.fn(),
  logError: vi.fn(),
})

const MOCK_RATE_UPDATE: RateUpdate = {
  pair: 'ETH/USDT',
  price: 3_000,
  timestamp: new Date().toISOString(),
  hourlyAverage: 2_900,
}

const MOCK_COMMENTARY: MarketCommentary = {
  text: 'Markets are stable.',
  generatedAt: new Date().toISOString(),
  pairs: ['ETH/USDT'],
}

describe('RatesGateway', () => {
  let gateway: RatesGateway
  let mockLogger: MockLogger
  let mockServer: MockServer

  beforeEach(() => {
    mockLogger = createMockLogger()
    mockServer = { emit: vi.fn(), sockets: { sockets: { size: 3 } } }
    gateway = new RatesGateway(mockLogger as unknown as AppLoggerService)
    Object.assign(gateway, { server: mockServer })
  })

  it('should emit rate update to all clients', () => {
    gateway.emit(MOCK_RATE_UPDATE)
    expect(mockServer.emit).toHaveBeenCalledWith(SOCKET_EVENTS.RATE_UPDATE, MOCK_RATE_UPDATE)
  })

  it('should emit commentary to all clients', () => {
    gateway.emitCommentary(MOCK_COMMENTARY)
    expect(mockServer.emit).toHaveBeenCalledWith(SOCKET_EVENTS.COMMENTARY_UPDATE, MOCK_COMMENTARY)
  })

  it('should return connected client count from server', () => {
    expect(gateway.getConnectedClientCount()).toBe(3)
  })

  it('should log when client connects', () => {
    const mockClient: MockSocket = { id: 'client-1', emit: vi.fn() }
    gateway.handleConnection(mockClient as never)
    expect(mockLogger.logClientConnected).toHaveBeenCalledWith('client-1')
  })

  it('should send last known rates to newly connected client', () => {
    gateway.emit(MOCK_RATE_UPDATE)
    const mockClient: MockSocket = { id: 'client-2', emit: vi.fn() }
    gateway.handleConnection(mockClient as never)
    expect(mockClient.emit).toHaveBeenCalledWith(SOCKET_EVENTS.RATE_UPDATE, MOCK_RATE_UPDATE)
  })

  it('should log when client disconnects', () => {
    const mockClient: MockSocket = { id: 'client-1', emit: vi.fn() }
    gateway.handleDisconnect(mockClient as never)
    expect(mockLogger.logClientDisconnected).toHaveBeenCalledWith('client-1')
  })
})
