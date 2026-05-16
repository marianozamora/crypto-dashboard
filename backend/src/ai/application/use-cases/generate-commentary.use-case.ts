import { Injectable, Inject, Logger } from '@nestjs/common'
import type { MarketCommentary } from '@crypto/shared'
import { VALID_PAIRS } from '@domain/value-objects/currency-pair.vo'
import type { CurrencyPairValue } from '@domain/value-objects/currency-pair.vo'
import { calculateHourlyAverage, calculateChangePercent } from '@domain/services/rate-aggregator.service'
import { AI_COMMENTARY_PORT } from '@ai/domain/ports/outbound/ai-commentary.port'
import type { AiCommentaryPort, CommentaryInput, CommentaryInputPair } from '@ai/domain/ports/outbound/ai-commentary.port'
import { AppLoggerService } from '@logger/app-logger.service'
import { ProcessRateTickUseCase } from '@application/use-cases/process-rate-tick.use-case'

@Injectable()
export class GenerateCommentaryUseCase {
  private readonly logger = new Logger(GenerateCommentaryUseCase.name)

  constructor(
    @Inject(AI_COMMENTARY_PORT) private readonly aiCommentary: AiCommentaryPort,
    private readonly processRateTickUseCase: ProcessRateTickUseCase,
    private readonly appLogger: AppLoggerService,
  ) {}

  async execute(): Promise<MarketCommentary> {
    const input = this.buildCommentaryInput()
    try {
      const commentary = await this.aiCommentary.generateCommentary(input)
      this.logger.log(JSON.stringify({ event: 'commentary_generated', timestamp: new Date().toISOString() }))
      return commentary
    } catch (error) {
      this.appLogger.logError('generate_commentary_failed', error)
      throw error
    }
  }

  private buildCommentaryInput(): CommentaryInput {
    return {
      pairs: VALID_PAIRS.map((pair) => this.buildPairInput(pair)),
      generatedAt: new Date(),
    }
  }

  private buildPairInput(pair: CurrencyPairValue): CommentaryInputPair {
    const ticks = this.processRateTickUseCase.getTicksForPair(pair)
    const lastTick = ticks.at(-1)
    const currentPrice = lastTick?.price.value ?? 0
    const hourlyAverage = calculateHourlyAverage(ticks)
    const changePercent = calculateChangePercent(currentPrice, hourlyAverage)
    return { name: pair, currentPrice, hourlyAverage, changePercent }
  }
}
