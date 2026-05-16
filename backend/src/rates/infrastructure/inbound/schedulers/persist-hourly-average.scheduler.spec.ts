import { PersistHourlyAverageScheduler } from './persist-hourly-average.scheduler'
import type { PersistHourlyAverageUseCase } from '@application/use-cases/persist-hourly-average.use-case'
import type { AppLoggerService } from '@logger/app-logger.service'

type MockLogger = { [K in keyof AppLoggerService]: ReturnType<typeof vi.fn> }
type MockUseCase = { execute: ReturnType<typeof vi.fn> }

const createMockLogger = (): MockLogger => ({
  logRateTick: vi.fn(),
  logReconnectionAttempt: vi.fn(),
  logClientConnected: vi.fn(),
  logClientDisconnected: vi.fn(),
  logHourlyAverageCalculated: vi.fn(),
  logCommentaryEmitted: vi.fn(),
  logError: vi.fn(),
})

describe('PersistHourlyAverageScheduler', () => {
  let scheduler: PersistHourlyAverageScheduler
  let mockUseCase: MockUseCase
  let mockLogger: MockLogger

  beforeEach(() => {
    mockUseCase = { execute: vi.fn().mockResolvedValue(undefined) }
    mockLogger = createMockLogger()
    scheduler = new PersistHourlyAverageScheduler(
      mockUseCase as unknown as PersistHourlyAverageUseCase,
      mockLogger as unknown as AppLoggerService,
    )
  })

  it('should call persistHourlyAverageUseCase.execute on runHourly', async () => {
    await scheduler.runHourly()
    expect(mockUseCase.execute).toHaveBeenCalledOnce()
  })

  it('should log error and not throw when use case fails', async () => {
    const error = new Error('DB unavailable')
    mockUseCase.execute.mockRejectedValue(error)
    await expect(scheduler.runHourly()).resolves.toBeUndefined()
    expect(mockLogger.logError).toHaveBeenCalledWith('persist_hourly_average_scheduler_failed', error)
  })
})
