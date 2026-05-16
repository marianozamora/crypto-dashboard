import { PersistHourlyAverageUseCase } from './persist-hourly-average.use-case'
import type { RateRepositoryPort } from '@domain/ports/outbound/rate-repository.port'
import type { AppLoggerService } from '@logger/app-logger.service'
import type { ProcessRateTickUseCase } from './process-rate-tick.use-case'
import { createPrice } from '@domain/value-objects/price.vo'
import type { RateTickForAggregation } from '@domain/services/rate-aggregator.service'

type MockRepository = { [K in keyof RateRepositoryPort]: ReturnType<typeof vi.fn> }
type MockLogger = { [K in keyof AppLoggerService]: ReturnType<typeof vi.fn> }
type MockProcessRateTick = { getTicksForPair: ReturnType<typeof vi.fn> }

const EMPTY_TICKS: readonly RateTickForAggregation[] = []

const makeTicks = (...prices: number[]): readonly RateTickForAggregation[] =>
  prices.map((p) => ({ price: createPrice(p), timestamp: Date.now() }))

const createMockRepository = (): MockRepository => ({
  save: vi.fn().mockResolvedValue(undefined),
  findHourlyAverage: vi.fn().mockResolvedValue(null),
  saveHourlyAverage: vi.fn().mockResolvedValue(undefined),
})

const createMockLogger = (): MockLogger => ({
  logRateTick: vi.fn(),
  logReconnectionAttempt: vi.fn(),
  logClientConnected: vi.fn(),
  logClientDisconnected: vi.fn(),
  logHourlyAverageCalculated: vi.fn(),
  logError: vi.fn(),
})

describe('PersistHourlyAverageUseCase', () => {
  let useCase: PersistHourlyAverageUseCase
  let mockRepository: MockRepository
  let mockLogger: MockLogger
  let mockProcessRateTick: MockProcessRateTick

  beforeEach(() => {
    mockRepository = createMockRepository()
    mockLogger = createMockLogger()
    mockProcessRateTick = { getTicksForPair: vi.fn().mockReturnValue(EMPTY_TICKS) }
    useCase = new PersistHourlyAverageUseCase(
      mockRepository as unknown as RateRepositoryPort,
      mockProcessRateTick as unknown as ProcessRateTickUseCase,
      mockLogger as unknown as AppLoggerService,
    )
  })

  it('should persist average for all pairs when ticks exist', async () => {
    mockProcessRateTick.getTicksForPair.mockReturnValue(makeTicks(100, 200, 300))
    await useCase.execute()
    expect(mockRepository.saveHourlyAverage).toHaveBeenCalledTimes(3)
  })

  it('should skip pairs with no ticks', async () => {
    mockProcessRateTick.getTicksForPair
      .mockReturnValueOnce(makeTicks(100, 200))
      .mockReturnValueOnce(EMPTY_TICKS)
      .mockReturnValueOnce(EMPTY_TICKS)
    await useCase.execute()
    expect(mockRepository.saveHourlyAverage).toHaveBeenCalledTimes(1)
  })

  it('should log each calculated average', async () => {
    mockProcessRateTick.getTicksForPair.mockReturnValue(makeTicks(100, 200))
    await useCase.execute()
    expect(mockLogger.logHourlyAverageCalculated).toHaveBeenCalledTimes(3)
  })

  it('should not throw when repository save fails gracefully', async () => {
    mockProcessRateTick.getTicksForPair.mockReturnValue(makeTicks(100))
    mockRepository.saveHourlyAverage.mockRejectedValue(new Error('DB error'))
    await expect(useCase.execute()).resolves.toBeUndefined()
    expect(mockLogger.logError).toHaveBeenCalledTimes(3)
  })
})
