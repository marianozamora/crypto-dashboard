import type { Rate } from '@domain/entities/rate.entity'
import type { HourlyAverage } from '@domain/entities/hourly-average.entity'
import type { CurrencyPairValue } from '@domain/value-objects/currency-pair.vo'

type RateRepositoryPort = {
  save(rate: Rate): Promise<void>
  findHourlyAverage(pair: CurrencyPairValue): Promise<number | null>
  saveHourlyAverage(average: HourlyAverage): Promise<void>
}

const RATE_REPOSITORY_PORT = Symbol('RateRepositoryPort')

export { RATE_REPOSITORY_PORT }
export type { RateRepositoryPort }
