import { CommentaryScheduler } from './commentary.scheduler'
import type { GenerateCommentaryUseCase } from '@ai/application/use-cases/generate-commentary.use-case'
import type { RatesGateway } from '@rates/infrastructure/inbound/websocket/rates.gateway'
import type { AppLoggerService } from '@logger/app-logger.service'
import type { ConfigService } from '@nestjs/config'
import type { MarketCommentary } from '@crypto/shared'
import type { Env } from '@config/env.validation'

type MockLogger = { [K in keyof AppLoggerService]: ReturnType<typeof vi.fn> }
type MockUseCase = { execute: ReturnType<typeof vi.fn> }
type MockGateway = { emitCommentary: ReturnType<typeof vi.fn> }
type MockConfig = Pick<ConfigService<Env, true>, 'get'>

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

const createMockConfig = (apiKey: string | undefined): MockConfig => ({
  get: vi.fn().mockReturnValue(apiKey),
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
      createMockConfig('test-api-key') as unknown as ConfigService<Env, true>,
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

  it('should skip silently when ANTHROPIC_API_KEY is not configured', async () => {
    const schedulerWithoutKey = new CommentaryScheduler(
      mockUseCase as unknown as GenerateCommentaryUseCase,
      mockGateway as unknown as RatesGateway,
      mockLogger as unknown as AppLoggerService,
      createMockConfig(undefined) as unknown as ConfigService<Env, true>,
    )
    await schedulerWithoutKey.runHourly()
    expect(mockUseCase.execute).not.toHaveBeenCalled()
    expect(mockGateway.emitCommentary).not.toHaveBeenCalled()
    expect(mockLogger.logError).not.toHaveBeenCalled()
  })
})
