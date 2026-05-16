import type { MarketCommentary } from '@crypto/shared'
import { VALID_PAIRS } from '@domain/value-objects/currency-pair.vo'
import type { CurrencyPairValue } from '@domain/value-objects/currency-pair.vo'
import { calculateHourlyAverage, calculateChangePercent } from '@domain/services/rate-aggregator.service'
import type { RateTickForAggregation } from '@domain/services/rate-aggregator.service'
import { AI_COMMENTARY_PORT } from '@ai/domain/ports/outbound/ai-commentary.port'
import type { AiCommentaryPort, CommentaryInput, CommentaryInputPair } from '@ai/domain/ports/outbound/ai-commentary.port'
import { AppLoggerService } from '@logger/app-logger.service'
import type { ProcessRateTickUseCase } from '@application/use-cases/process-rate-tick.use-case'

const GENERATE_COMMENTARY_USE_CASE = Symbol('GenerateCommentaryUseCase')

type GenerateCommentaryUseCase = {
  execute(): Promise<MarketCommentary>
}

const buildCommentaryInputPair = (
  pair: CurrencyPairValue,
  ticks: readonly RateTickForAggregation[],
): CommentaryInputPair => {
  const currentPrice = ticks.at(-1)?.price.value ?? null
  const hourlyAverage = calculateHourlyAverage(ticks)
  const changePercent = calculateChangePercent(currentPrice ?? 0, hourlyAverage)
  return { name: pair, currentPrice, hourlyAverage, changePercent }
}

const buildCommentaryInput = (processRateTick: ProcessRateTickUseCase): CommentaryInput => ({
  pairs: VALID_PAIRS.map((pair) =>
    buildCommentaryInputPair(pair, processRateTick.getTicksForPair(pair)),
  ),
  generatedAt: new Date(),
})

const createGenerateCommentaryUseCase = (
  aiCommentary: AiCommentaryPort,
  processRateTick: ProcessRateTickUseCase,
  appLogger: AppLoggerService,
): GenerateCommentaryUseCase => ({
  execute: async (): Promise<MarketCommentary> => {
    const input = buildCommentaryInput(processRateTick)
    try {
      return await aiCommentary.generateCommentary(input)
    } catch (error) {
      appLogger.logError('generate_commentary_failed', error)
      throw error
    }
  },
})

export { GENERATE_COMMENTARY_USE_CASE, AI_COMMENTARY_PORT, createGenerateCommentaryUseCase }
export type { GenerateCommentaryUseCase }
