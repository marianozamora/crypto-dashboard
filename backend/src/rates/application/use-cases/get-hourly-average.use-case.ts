import { createCurrencyPair } from '@domain/value-objects/currency-pair.vo'
import type { RateRepositoryPort } from '@domain/ports/outbound/rate-repository.port'

const GET_HOURLY_AVERAGE_USE_CASE = Symbol('GetHourlyAverageUseCase')

type GetHourlyAverageUseCase = {
  execute(pair: string): Promise<number | null>
}

const createGetHourlyAverageUseCase = (
  rateRepository: RateRepositoryPort,
): GetHourlyAverageUseCase => ({
  execute: async (pair): Promise<number | null> => {
    const currencyPair = createCurrencyPair(pair)
    return rateRepository.findHourlyAverage(currencyPair)
  },
})

export { GET_HOURLY_AVERAGE_USE_CASE, createGetHourlyAverageUseCase }
export type { GetHourlyAverageUseCase }
