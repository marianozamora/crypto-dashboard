import { Injectable, Inject } from '@nestjs/common'
import { createCurrencyPair } from '@domain/value-objects/currency-pair.vo'
import { RATE_REPOSITORY_PORT } from '@domain/ports/outbound/rate-repository.port'
import type { RateRepositoryPort } from '@domain/ports/outbound/rate-repository.port'
import type { GetHourlyAveragePort } from '@domain/ports/inbound/rate-use-cases.port'

@Injectable()
export class GetHourlyAverageUseCase implements GetHourlyAveragePort {
  constructor(
    @Inject(RATE_REPOSITORY_PORT) private readonly rateRepository: RateRepositoryPort,
  ) {}

  async execute(pair: string): Promise<number | null> {
    const currencyPair = createCurrencyPair(pair)
    return this.rateRepository.findHourlyAverage(currencyPair)
  }
}
