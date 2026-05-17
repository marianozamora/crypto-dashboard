import { Injectable, Inject } from '@nestjs/common'
import { Cron } from '@nestjs/schedule'
import { ConfigService } from '@nestjs/config'
import {
  GENERATE_COMMENTARY_USE_CASE,
} from '@ai/application/use-cases/generate-commentary.use-case'
import type { GenerateCommentaryUseCase } from '@ai/application/use-cases/generate-commentary.use-case'
import { RatesGateway } from '@rates/infrastructure/inbound/websocket/rates.gateway'
import { AppLoggerService } from '@logger/app-logger.service'
import { HOURLY_CRON } from '@shared/config/constants'
import type { Env } from '@config/env.validation'

@Injectable()
export class CommentaryScheduler {
  constructor(
    @Inject(GENERATE_COMMENTARY_USE_CASE)
    private readonly generateCommentaryUseCase: GenerateCommentaryUseCase,
    private readonly ratesGateway: RatesGateway,
    private readonly appLogger: AppLoggerService,
    private readonly configService: ConfigService<Env, true>,
  ) {}

  @Cron(HOURLY_CRON)
  async runHourly(): Promise<void> {
    if (!this.configService.get('ANTHROPIC_API_KEY', { infer: true })) return
    try {
      const commentary = await this.generateCommentaryUseCase.execute()
      this.ratesGateway.emitCommentary(commentary)
      this.appLogger.logCommentaryEmitted(commentary.generatedAt)
    } catch (error) {
      this.appLogger.logError('commentary_scheduler_failed', error)
    }
  }
}
