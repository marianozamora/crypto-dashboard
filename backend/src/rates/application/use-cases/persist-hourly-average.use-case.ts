import { VALID_PAIRS } from '@domain/value-objects/currency-pair.vo'
import { createHourlyAverage } from '@domain/entities/hourly-average.entity'
import type { HourlyAverage } from '@domain/entities/hourly-average.entity'
import { calculateHourlyAverage } from '@domain/services/rate-aggregator.service'
import type { RateRepositoryPort } from '@domain/ports/outbound/rate-repository.port'
import { AppLoggerService } from '@logger/app-logger.service'
import type { ProcessRateTickUseCase } from './process-rate-tick.use-case'

const PERSIST_HOURLY_AVERAGE_USE_CASE = Symbol('PersistHourlyAverageUseCase')

type PersistHourlyAverageUseCase = {
  execute(): Promise<void>
}

const ONE_HOUR_MS = 3_600_000

const buildHourlyAverages = (processRateTick: ProcessRateTickUseCase): readonly HourlyAverage[] => {
  const now = new Date()
  const periodEnd = now.toISOString()
  const periodStart = new Date(now.getTime() - ONE_HOUR_MS).toISOString()
  return VALID_PAIRS.flatMap((pair) => {
    const ticks = processRateTick.getTicksForPair(pair)
    const average = calculateHourlyAverage(ticks)
    if (average === null) return []
    return [createHourlyAverage(pair, average, periodStart, periodEnd)]
  })
}

const createPersistHourlyAverageUseCase = (
  rateRepository: RateRepositoryPort,
  processRateTick: ProcessRateTickUseCase,
  appLogger: AppLoggerService,
): PersistHourlyAverageUseCase => ({
  execute: async (): Promise<void> => {
    const averages = buildHourlyAverages(processRateTick)
    await Promise.all(
      averages.map(async (average) => {
        await rateRepository.saveHourlyAverage(average)
        appLogger.logHourlyAverageCalculated(average.pair, average.average)
      }),
    )
  },
})

export { PERSIST_HOURLY_AVERAGE_USE_CASE, createPersistHourlyAverageUseCase }
export type { PersistHourlyAverageUseCase }
