import { ProcessRateTickUseCase } from './process-rate-tick.use-case'
import type { RateRepositoryPort } from '@domain/ports/outbound/rate-repository.port'
import type { RateStreamPort } from '@domain/ports/outbound/rate-stream.port'
import type { AppLoggerService } from '@logger/app-logger.service'
import { InvalidPriceError } from '@domain/value-objects/price.vo'
import { InvalidCurrencyPairError } from '@domain/value-objects/currency-pair.vo'
import type { RateUpdate } from '@crypto/shared'

type MockRepository = { [K in keyof RateRepositoryPort]: ReturnType<typeof vi.fn> }
type MockStream = { [K in keyof RateStreamPort]: ReturnType<typeof vi.fn> }
type MockLogger = { [K in keyof AppLoggerService]: ReturnType<typeof vi.fn> }

const createMockRepository = (): MockRepository => ({
  save: vi.fn().mockResolvedValue(undefined),
  findHourlyAverage: vi.fn().mockResolvedValue(null),
  saveHourlyAverage: vi.fn().mockResolvedValue(undefined),
})

const createMockStream = (): MockStream => ({
  emit: vi.fn(),
  getConnectedClientCount: vi.fn().mockReturnValue(0),
})

const createMockLogger = (): MockLogger => ({
  logRateTick: vi.fn(),
  logReconnectionAttempt: vi.fn(),
  logClientConnected: vi.fn(),
  logClientDisconnected: vi.fn(),
  logHourlyAverageCalculated: vi.fn(),
  logError: vi.fn(),
})

describe('ProcessRateTickUseCase', () => {
  let useCase: ProcessRateTickUseCase
  let mockRepository: MockRepository
  let mockStream: MockStream
  let mockLogger: MockLogger

  beforeEach(() => {
    mockRepository = createMockRepository()
    mockStream = createMockStream()
    mockLogger = createMockLogger()
    useCase = new ProcessRateTickUseCase(
      mockRepository as unknown as RateRepositoryPort,
      mockStream as unknown as RateStreamPort,
      mockLogger as unknown as AppLoggerService,
    )
  })

  it('should emit rate update when valid tick received', async () => {
    await useCase.execute('ETH/USDT', 3_000, Date.now())
    expect(mockStream.emit).toHaveBeenCalledOnce()
    const update = mockStream.emit.mock.calls[0][0] as RateUpdate
    expect(update.pair).toBe('ETH/USDT')
    expect(update.price).toBe(3_000)
  })

  it('should throw InvalidPriceError when price is zero', async () => {
    await expect(useCase.execute('ETH/USDT', 0, Date.now())).rejects.toThrow(InvalidPriceError)
  })

  it('should throw InvalidPriceError when price is negative', async () => {
    await expect(useCase.execute('ETH/USDT', -1, Date.now())).rejects.toThrow(InvalidPriceError)
  })

  it('should throw InvalidPriceError when price is not finite', async () => {
    await expect(useCase.execute('ETH/USDT', Infinity, Date.now())).rejects.toThrow(InvalidPriceError)
  })

  it('should throw InvalidCurrencyPairError when pair is unknown', async () => {
    await expect(useCase.execute('BTC/USD', 50_000, Date.now())).rejects.toThrow(
      InvalidCurrencyPairError,
    )
  })

  it('should accumulate ticks in memory per pair', async () => {
    await useCase.execute('ETH/USDT', 100, Date.now())
    await useCase.execute('ETH/USDT', 200, Date.now())
    expect(useCase.getTicksForPair('ETH/USDT')).toHaveLength(2)
  })

  it('should not affect other pairs when updating one', async () => {
    await useCase.execute('ETH/USDT', 100, Date.now())
    expect(useCase.getTicksForPair('ETH/USDC')).toHaveLength(0)
    expect(useCase.getTicksForPair('ETH/BTC')).toHaveLength(0)
  })

  it('should include hourlyAverage null when no ticks yet', async () => {
    await useCase.execute('ETH/USDT', 3_000, Date.now())
    const update = mockStream.emit.mock.calls[0][0] as RateUpdate
    // first tick: calculateHourlyAverage([tick]) = price — falls back to price.value
    expect(update.hourlyAverage).toBe(3_000)
  })

  it('should include hourlyAverage when ticks exist', async () => {
    await useCase.execute('ETH/USDT', 100, Date.now())
    await useCase.execute('ETH/USDT', 300, Date.now())
    const update = mockStream.emit.mock.calls[1][0] as RateUpdate
    expect(update.hourlyAverage).toBeCloseTo(200, 5)
  })

  it('should log rate tick via appLogger', async () => {
    await useCase.execute('ETH/USDT', 3_000, Date.now())
    expect(mockLogger.logRateTick).toHaveBeenCalledWith('ETH/USDT', 3_000)
  })
})
