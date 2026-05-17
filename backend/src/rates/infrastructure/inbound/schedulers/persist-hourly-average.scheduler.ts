import { Injectable, Inject } from '@nestjs/common'
import { Cron } from '@nestjs/schedule'
import {
  PERSIST_HOURLY_AVERAGE_USE_CASE,
} from '@application/use-cases/persist-hourly-average.use-case'
import type { PersistHourlyAverageUseCase } from '@application/use-cases/persist-hourly-average.use-case'
import { AppLoggerService } from '@logger/app-logger.service'
import { HOURLY_CRON } from '@shared/config/constants'

@Injectable()
export class PersistHourlyAverageScheduler {
  constructor(
    @Inject(PERSIST_HOURLY_AVERAGE_USE_CASE)
    private readonly persistHourlyAverageUseCase: PersistHourlyAverageUseCase,
    private readonly appLogger: AppLoggerService,
  ) {}

  @Cron(HOURLY_CRON)
  async runHourly(): Promise<void> {
    try {
      await this.persistHourlyAverageUseCase.execute()
    } catch (error) {
      this.appLogger.logError('persist_hourly_average_scheduler_failed', error)
    }
  }
}
