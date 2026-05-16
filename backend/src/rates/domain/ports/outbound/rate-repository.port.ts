import type { Rate } from '../../entities/rate.entity'
import type { HourlyAverage } from '../../entities/hourly-average.entity'
import type { CurrencyPairValue } from '../../value-objects/currency-pair.vo'

type RateRepositoryPort = {
  save(rate: Rate): Promise<void>
  findHourlyAverage(pair: CurrencyPairValue): Promise<number | null>
  saveHourlyAverage(average: HourlyAverage): Promise<void>
}

const RATE_REPOSITORY_PORT = Symbol('RateRepositoryPort')

export { RATE_REPOSITORY_PORT }
export type { RateRepositoryPort }
