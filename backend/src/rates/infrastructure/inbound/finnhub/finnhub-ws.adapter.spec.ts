import { FinnhubWsAdapter } from './finnhub-ws.adapter'
import { RECONNECT_DELAYS_MS } from './finnhub.config'
import type { ProcessRateTickUseCase } from '@application/use-cases/process-rate-tick.use-case'
import type { AppLoggerService } from '@logger/app-logger.service'
import type { Env } from '@config/env.validation'
import type { ConfigService } from '@nestjs/config'

type MockLogger = { [K in keyof AppLoggerService]: ReturnType<typeof vi.fn> }
type MockProcessRateTick = { execute: ReturnType<typeof vi.fn> }
type MockConfigService = { get: ReturnType<typeof vi.fn> }

type MockWebSocket = {
  send: ReturnType<typeof vi.fn>
  close: ReturnType<typeof vi.fn>
  readyState: number
  onopen: (() => void) | null
  onmessage: ((event: { data: string }) => void) | null
  onclose: (() => void) | null
  onerror: ((error: unknown) => void) | null
}

let mockWsInstance: MockWebSocket

vi.mock('ws', () => {
  const Ctor = vi.fn().mockImplementation(() => mockWsInstance)
  Object.assign(Ctor, { OPEN: 1 })
  return { default: Ctor }
})

const createMockLogger = (): MockLogger => ({
  logRateTick: vi.fn(),
  logReconnectionAttempt: vi.fn(),
  logClientConnected: vi.fn(),
  logClientDisconnected: vi.fn(),
  logHourlyAverageCalculated: vi.fn(),
  logCommentaryEmitted: vi.fn(),
  logError: vi.fn(),
})

const makeTrade = (s: string, p: number): string =>
  JSON.stringify({ type: 'trade', data: [{ s, p, t: Date.now(), v: 1 }] })

describe('FinnhubWsAdapter', () => {
  let adapter: FinnhubWsAdapter
  let mockLogger: MockLogger
  let mockProcessRateTick: MockProcessRateTick
  let mockConfigService: MockConfigService

  beforeEach(() => {
    vi.useFakeTimers()
    mockWsInstance = {
      send: vi.fn(),
      close: vi.fn(),
      readyState: 1,
      onopen: null,
      onmessage: null,
      onclose: null,
      onerror: null,
    }
    mockLogger = createMockLogger()
    mockProcessRateTick = { execute: vi.fn().mockResolvedValue(undefined) }
    mockConfigService = { get: vi.fn().mockReturnValue('test-key') }
    adapter = new FinnhubWsAdapter(
      mockProcessRateTick as unknown as ProcessRateTickUseCase,
      mockLogger as unknown as AppLoggerService,
      mockConfigService as unknown as ConfigService<Env, true>,
    )
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('should call subscribeAll on connection open', () => {
    adapter.onModuleInit()
    mockWsInstance.onopen?.()
    expect(mockWsInstance.send).toHaveBeenCalledTimes(3)
    const messages = mockWsInstance.send.mock.calls.map((c) => JSON.parse(c[0] as string))
    expect(messages.every((m: { type: string }) => m.type === 'subscribe')).toBe(true)
  })

  it('should call processRateTickUseCase.execute when valid tick received', async () => {
    adapter.onModuleInit()
    mockWsInstance.onmessage?.({ data: makeTrade('BINANCE:ETHUSDT', 3_000) })
    await vi.runAllTimersAsync()
    expect(mockProcessRateTick.execute).toHaveBeenCalledWith('ETH/USDT', 3_000, expect.any(Number))
  })

  it('should silently skip tick with invalid price (log error, no throw)', async () => {
    mockProcessRateTick.execute.mockRejectedValue(new Error('InvalidPriceError'))
    adapter.onModuleInit()
    mockWsInstance.onmessage?.({ data: makeTrade('BINANCE:ETHUSDT', -1) })
    await vi.runAllTimersAsync()
    expect(mockLogger.logError).toHaveBeenCalledWith('invalid_price_tick', expect.any(Error))
  })

  it('should silently skip tick with unknown symbol (log error, no throw)', async () => {
    adapter.onModuleInit()
    mockWsInstance.onmessage?.({ data: makeTrade('UNKNOWN:PAIR', 1_000) })
    await vi.runAllTimersAsync()
    expect(mockProcessRateTick.execute).not.toHaveBeenCalled()
    expect(mockLogger.logError).toHaveBeenCalledWith('invalid_pair_tick', expect.any(Error))
  })

  it('should schedule reconnect when connection closes unexpectedly', () => {
    adapter.onModuleInit()
    mockWsInstance.onopen?.()
    mockWsInstance.onclose?.()
    expect(mockLogger.logReconnectionAttempt).toHaveBeenCalledWith(0, RECONNECT_DELAYS_MS[0])
    vi.advanceTimersByTime(RECONNECT_DELAYS_MS[0])
    expect(mockWsInstance.send).toHaveBeenCalled()
  })

  it('should use exponential backoff delays across reconnect attempts', () => {
    adapter.onModuleInit()
    mockWsInstance.onopen?.()

    mockWsInstance.onclose?.()
    expect(mockLogger.logReconnectionAttempt).toHaveBeenLastCalledWith(0, RECONNECT_DELAYS_MS[0])

    vi.advanceTimersByTime(RECONNECT_DELAYS_MS[0])
    mockWsInstance.onclose?.()
    expect(mockLogger.logReconnectionAttempt).toHaveBeenLastCalledWith(1, RECONNECT_DELAYS_MS[1])
  })

  it('should NOT reconnect when isShuttingDown is true', () => {
    adapter.onModuleInit()
    mockWsInstance.onopen?.()
    adapter.onApplicationShutdown()
    vi.clearAllMocks()

    mockWsInstance.onclose?.()
    vi.advanceTimersByTime(30_000)
    expect(mockLogger.logReconnectionAttempt).not.toHaveBeenCalled()
  })

  it('should unsubscribeAll on application shutdown', () => {
    adapter.onModuleInit()
    mockWsInstance.onopen?.()
    vi.clearAllMocks()

    adapter.onApplicationShutdown()
    expect(mockWsInstance.send).toHaveBeenCalledTimes(3)
    const messages = mockWsInstance.send.mock.calls.map((c) => JSON.parse(c[0] as string))
    expect(messages.every((m: { type: string }) => m.type === 'unsubscribe')).toBe(true)
  })

  it('should resubscribe to all pairs after reconnect', () => {
    adapter.onModuleInit()
    mockWsInstance.onopen?.()
    expect(mockWsInstance.send).toHaveBeenCalledTimes(3)
    vi.clearAllMocks()

    mockWsInstance.onclose?.()
    vi.advanceTimersByTime(RECONNECT_DELAYS_MS[0])
    mockWsInstance.onopen?.()
    expect(mockWsInstance.send).toHaveBeenCalledTimes(3)
  })
})
