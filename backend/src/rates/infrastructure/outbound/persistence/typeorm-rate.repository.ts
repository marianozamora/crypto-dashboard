import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import type { Rate } from '@domain/entities/rate.entity'
import type { HourlyAverage } from '@domain/entities/hourly-average.entity'
import type { CurrencyPairValue } from '@domain/value-objects/currency-pair.vo'
import type { RateRepositoryPort } from '@domain/ports/outbound/rate-repository.port'
import { RateOrmEntity } from './entities/rate.orm-entity'
import { HourlyAverageOrmEntity } from './entities/hourly-average.orm-entity'

@Injectable()
export class TypeOrmRateRepository implements RateRepositoryPort {
  constructor(
    @InjectRepository(RateOrmEntity)
    private readonly rateRepo: Repository<RateOrmEntity>,
    @InjectRepository(HourlyAverageOrmEntity)
    private readonly avgRepo: Repository<HourlyAverageOrmEntity>,
  ) {}

  async save(rate: Rate): Promise<void> {
    await this.rateRepo.save({ pair: rate.pair, price: rate.price.value, timestamp: rate.timestamp })
  }

  async findHourlyAverage(pair: CurrencyPairValue): Promise<number | null> {
    const result = await this.avgRepo.findOne({ where: { pair }, order: { id: 'DESC' } })
    return result ? Number(result.average) : null
  }

  async saveHourlyAverage(average: HourlyAverage): Promise<void> {
    await this.avgRepo.save({
      pair: average.pair,
      average: average.average,
      periodStart: average.periodStart,
      periodEnd: average.periodEnd,
    })
  }
}
