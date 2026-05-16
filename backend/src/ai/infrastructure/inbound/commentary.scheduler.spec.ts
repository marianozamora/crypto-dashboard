import { CommentaryScheduler } from './commentary.scheduler'
import type { GenerateCommentaryUseCase } from '@ai/application/use-cases/generate-commentary.use-case'
import type { RatesGateway } from '@rates/infrastructure/inbound/websocket/rates.gateway'
import type { AppLoggerService } from '@logger/app-logger.service'
import type { MarketCommentary } from '@crypto/shared'

type MockLogger = { [K in keyof AppLoggerService]: ReturnType<typeof vi.fn> }
type MockUseCase = { execute: ReturnType<typeof vi.fn> }
type MockGateway = { emitCommentary: ReturnType<typeof vi.fn> }

const MOCK_COMMENTARY: MarketCommentary = {
  text: 'ETH markets are bullish.',
  generatedAt: '2025-01-01T00:00:00.000Z',
  pairs: ['ETH/USDT'],
}

const createMockLogger = (): MockLogger => ({
  logRateTick: vi.fn(),
  logReconnectionAttempt: vi.fn(),
  logClientConnected: vi.fn(),
  logClientDisconnected: vi.fn(),
  logHourlyAverageCalculated: vi.fn(),
  logCommentaryEmitted: vi.fn(),
  logError: vi.fn(),
})

describe('CommentaryScheduler', () => {
  let scheduler: CommentaryScheduler
  let mockUseCase: MockUseCase
  let mockGateway: MockGateway
  let mockLogger: MockLogger

  beforeEach(() => {
    mockUseCase = { execute: vi.fn().mockResolvedValue(MOCK_COMMENTARY) }
    mockGateway = { emitCommentary: vi.fn() }
    mockLogger = createMockLogger()
    scheduler = new CommentaryScheduler(
      mockUseCase as unknown as GenerateCommentaryUseCase,
      mockGateway as unknown as RatesGateway,
      mockLogger as unknown as AppLoggerService,
    )
  })

  it('should emit commentary and log on success', async () => {
    await scheduler.runHourly()
    expect(mockGateway.emitCommentary).toHaveBeenCalledWith(MOCK_COMMENTARY)
    expect(mockLogger.logCommentaryEmitted).toHaveBeenCalledWith(MOCK_COMMENTARY.generatedAt)
  })

  it('should log error and not throw when use case fails', async () => {
    const error = new Error('AI unavailable')
    mockUseCase.execute.mockRejectedValue(error)
    await expect(scheduler.runHourly()).resolves.toBeUndefined()
    expect(mockLogger.logError).toHaveBeenCalledWith('commentary_scheduler_failed', error)
    expect(mockGateway.emitCommentary).not.toHaveBeenCalled()
  })
})
