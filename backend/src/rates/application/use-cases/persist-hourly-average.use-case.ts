import { Injectable, Inject } from '@nestjs/common'
import { VALID_PAIRS } from '@domain/value-objects/currency-pair.vo'
import type { CurrencyPairValue } from '@domain/value-objects/currency-pair.vo'
import { createHourlyAverage } from '@domain/entities/hourly-average.entity'
import { calculateHourlyAverage } from '@domain/services/rate-aggregator.service'
import type { RateTickForAggregation } from '@domain/services/rate-aggregator.service'
import { RATE_REPOSITORY_PORT } from '@domain/ports/outbound/rate-repository.port'
import type { RateRepositoryPort } from '@domain/ports/outbound/rate-repository.port'
import { AppLoggerService } from '@logger/app-logger.service'
import { ProcessRateTickUseCase } from './process-rate-tick.use-case'

const ONE_HOUR_MS = 3_600_000

@Injectable()
export class PersistHourlyAverageUseCase {
  constructor(
    @Inject(RATE_REPOSITORY_PORT) private readonly rateRepository: RateRepositoryPort,
    private readonly processRateTickUseCase: ProcessRateTickUseCase,
    private readonly appLogger: AppLoggerService,
  ) {}

  async execute(): Promise<void> {
    const now = new Date()
    const periodEnd = now.toISOString()
    const periodStart = new Date(now.getTime() - ONE_HOUR_MS).toISOString()
    for (const pair of VALID_PAIRS) {
      await this.persistPairAverage(pair, periodStart, periodEnd)
    }
  }

  private async persistPairAverage(
    pair: CurrencyPairValue,
    periodStart: string,
    periodEnd: string,
  ): Promise<void> {
    try {
      const ticks: readonly RateTickForAggregation[] =
        this.processRateTickUseCase.getTicksForPair(pair)
      const average = calculateHourlyAverage(ticks)
      if (average === null) return
      const hourlyAvg = createHourlyAverage(pair, average, periodStart, periodEnd)
      await this.rateRepository.saveHourlyAverage(hourlyAvg)
      this.appLogger.logHourlyAverageCalculated(pair, average)
    } catch (error) {
      this.appLogger.logError('persist_hourly_average_failed', error)
    }
  }
}
