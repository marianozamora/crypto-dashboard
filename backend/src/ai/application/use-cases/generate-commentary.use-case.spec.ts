import { GenerateCommentaryUseCase } from './generate-commentary.use-case'
import type { AiCommentaryPort, CommentaryInput } from '../../domain/ports/outbound/ai-commentary.port'
import type { AppLoggerService } from '../../../shared/logger/app-logger.service'
import type { ProcessRateTickUseCase } from '../../../rates/application/use-cases/process-rate-tick.use-case'
import type { MarketCommentary } from '@crypto/shared'
import type { RateTickForAggregation } from '../../../rates/domain/services/rate-aggregator.service'

type MockAiCommentary = { [K in keyof AiCommentaryPort]: ReturnType<typeof vi.fn> }
type MockLogger = { [K in keyof AppLoggerService]: ReturnType<typeof vi.fn> }
type MockProcessRateTick = { getTicksForPair: ReturnType<typeof vi.fn> }

const MOCK_COMMENTARY: MarketCommentary = {
  text: 'ETH markets are stable.',
  generatedAt: new Date().toISOString(),
  pairs: ['ETH/USDT'],
}

const EMPTY_TICKS: readonly RateTickForAggregation[] = []

const createMockAiCommentary = (): MockAiCommentary => ({
  generateCommentary: vi.fn().mockResolvedValue(MOCK_COMMENTARY),
})

const createMockLogger = (): MockLogger => ({
  logRateTick: vi.fn(),
  logReconnectionAttempt: vi.fn(),
  logClientConnected: vi.fn(),
  logClientDisconnected: vi.fn(),
  logHourlyAverageCalculated: vi.fn(),
  logError: vi.fn(),
})

describe('GenerateCommentaryUseCase', () => {
  let useCase: GenerateCommentaryUseCase
  let mockAiCommentary: MockAiCommentary
  let mockLogger: MockLogger
  let mockProcessRateTick: MockProcessRateTick

  beforeEach(() => {
    mockAiCommentary = createMockAiCommentary()
    mockLogger = createMockLogger()
    mockProcessRateTick = { getTicksForPair: vi.fn().mockReturnValue(EMPTY_TICKS) }
    useCase = new GenerateCommentaryUseCase(
      mockAiCommentary as unknown as AiCommentaryPort,
      mockProcessRateTick as unknown as ProcessRateTickUseCase,
      mockLogger as unknown as AppLoggerService,
    )
  })

  it('should return commentary when AI adapter succeeds', async () => {
    const result = await useCase.execute()
    expect(result).toEqual(MOCK_COMMENTARY)
  })

  it('should build correct input with all three pairs', async () => {
    await useCase.execute()
    const input = mockAiCommentary.generateCommentary.mock.calls[0][0] as CommentaryInput
    const pairNames = input.pairs.map((p) => p.name)
    expect(pairNames).toContain('ETH/USDC')
    expect(pairNames).toContain('ETH/USDT')
    expect(pairNames).toContain('ETH/BTC')
  })

  it('should handle null hourly averages in input gracefully', async () => {
    mockProcessRateTick.getTicksForPair.mockReturnValue(EMPTY_TICKS)
    const result = await useCase.execute()
    const input = mockAiCommentary.generateCommentary.mock.calls[0][0] as CommentaryInput
    expect(input.pairs.every((p) => p.hourlyAverage === null)).toBe(true)
    expect(result).toEqual(MOCK_COMMENTARY)
  })

  it('should throw when AI adapter fails', async () => {
    const error = new Error('AI service unavailable')
    mockAiCommentary.generateCommentary.mockRejectedValue(error)
    await expect(useCase.execute()).rejects.toThrow('AI service unavailable')
    expect(mockLogger.logError).toHaveBeenCalledWith('generate_commentary_failed', error)
  })
})
