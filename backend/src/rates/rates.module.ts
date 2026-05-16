import { Module } from '@nestjs/common'
import { AppLoggerService } from '@logger/app-logger.service'
import { RATE_REPOSITORY_PORT } from '@domain/ports/outbound/rate-repository.port'
import type { RateRepositoryPort } from '@domain/ports/outbound/rate-repository.port'
import { RATE_STREAM_PORT } from '@domain/ports/outbound/rate-stream.port'
import type { RateStreamPort } from '@domain/ports/outbound/rate-stream.port'
import {
  PROCESS_RATE_TICK_USE_CASE,
  createProcessRateTickUseCase,
} from '@application/use-cases/process-rate-tick.use-case'
import type { ProcessRateTickUseCase } from '@application/use-cases/process-rate-tick.use-case'
import {
  GET_HOURLY_AVERAGE_USE_CASE,
  createGetHourlyAverageUseCase,
} from '@application/use-cases/get-hourly-average.use-case'
import type { GetHourlyAverageUseCase } from '@application/use-cases/get-hourly-average.use-case'
import {
  PERSIST_HOURLY_AVERAGE_USE_CASE,
  createPersistHourlyAverageUseCase,
} from '@application/use-cases/persist-hourly-average.use-case'
import type { PersistHourlyAverageUseCase } from '@application/use-cases/persist-hourly-average.use-case'

@Module({
  providers: [
    AppLoggerService,
    {
      provide: PROCESS_RATE_TICK_USE_CASE,
      useFactory: (stream: RateStreamPort, logger: AppLoggerService): ProcessRateTickUseCase =>
        createProcessRateTickUseCase(stream, logger),
      inject: [RATE_STREAM_PORT, AppLoggerService],
    },
    {
      provide: GET_HOURLY_AVERAGE_USE_CASE,
      useFactory: (repo: RateRepositoryPort): GetHourlyAverageUseCase =>
        createGetHourlyAverageUseCase(repo),
      inject: [RATE_REPOSITORY_PORT],
    },
    {
      provide: PERSIST_HOURLY_AVERAGE_USE_CASE,
      useFactory: (
        repo: RateRepositoryPort,
        processRateTick: ProcessRateTickUseCase,
        logger: AppLoggerService,
      ): PersistHourlyAverageUseCase =>
        createPersistHourlyAverageUseCase(repo, processRateTick, logger),
      inject: [RATE_REPOSITORY_PORT, PROCESS_RATE_TICK_USE_CASE, AppLoggerService],
    },
  ],
  exports: [PROCESS_RATE_TICK_USE_CASE, GET_HOURLY_AVERAGE_USE_CASE, PERSIST_HOURLY_AVERAGE_USE_CASE],
})
export class RatesModule {}
