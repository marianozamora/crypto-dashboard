import { Injectable, Inject } from '@nestjs/common'
import type { RateUpdate } from '@crypto/shared'
import { createCurrencyPair, VALID_PAIRS } from '../../domain/value-objects/currency-pair.vo'
import type { CurrencyPairValue } from '../../domain/value-objects/currency-pair.vo'
import { createPrice } from '../../domain/value-objects/price.vo'
import type { Price } from '../../domain/value-objects/price.vo'
import { createRate } from '../../domain/entities/rate.entity'
import { calculateHourlyAverage } from '../../domain/services/rate-aggregator.service'
import type { RateTickForAggregation } from '../../domain/services/rate-aggregator.service'
import { RATE_REPOSITORY_PORT } from '../../domain/ports/outbound/rate-repository.port'
import type { RateRepositoryPort } from '../../domain/ports/outbound/rate-repository.port'
import { RATE_STREAM_PORT } from '../../domain/ports/outbound/rate-stream.port'
import type { RateStreamPort } from '../../domain/ports/outbound/rate-stream.port'
import type { ProcessRateTickPort } from '../../domain/ports/inbound/rate-use-cases.port'
import { AppLoggerService } from '../../../shared/logger/app-logger.service'

const MAX_TICKS_PER_PAIR = 3_600

@Injectable()
export class ProcessRateTickUseCase implements ProcessRateTickPort {
  private readonly ticksPerPair: Map<CurrencyPairValue, RateTickForAggregation[]>

  constructor(
    @Inject(RATE_REPOSITORY_PORT) private readonly rateRepository: RateRepositoryPort,
    @Inject(RATE_STREAM_PORT) private readonly rateStream: RateStreamPort,
    private readonly appLogger: AppLoggerService,
  ) {
    this.ticksPerPair = new Map(VALID_PAIRS.map((pair) => [pair, []]))
  }

  async execute(pair: string, price: number, timestamp: number): Promise<void> {
    const currencyPair = createCurrencyPair(pair)
    const priceVO = createPrice(price)
    const rate = createRate(currencyPair, priceVO, timestamp)
    await this.rateRepository.save(rate)
    this.addTickToMemory(currencyPair, priceVO, timestamp)
    const rateUpdate = this.buildRateUpdate(currencyPair, priceVO, timestamp)
    this.rateStream.emit(rateUpdate)
    this.appLogger.logRateTick(currencyPair, price)
  }

  private addTickToMemory(pair: CurrencyPairValue, price: Price, timestamp: number): void {
    const ticks = this.ticksPerPair.get(pair) ?? []
    ticks.push({ price, timestamp })
    if (ticks.length > MAX_TICKS_PER_PAIR) ticks.shift()
  }

  private buildRateUpdate(pair: CurrencyPairValue, price: Price, timestamp: number): RateUpdate {
    const ticks = this.ticksPerPair.get(pair) ?? []
    const hourlyAverage = calculateHourlyAverage(ticks) ?? price.value
    return { pair, price: price.value, timestamp: new Date(timestamp).toISOString(), hourlyAverage }
  }

  getTicksForPair(pair: CurrencyPairValue): readonly RateTickForAggregation[] {
    return this.ticksPerPair.get(pair) ?? []
  }
}
