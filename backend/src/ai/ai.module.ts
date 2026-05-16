import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { AppLoggerService } from '@logger/app-logger.service'
import { AI_COMMENTARY_PORT } from '@ai/domain/ports/outbound/ai-commentary.port'
import type { AiCommentaryPort } from '@ai/domain/ports/outbound/ai-commentary.port'
import { PROCESS_RATE_TICK_USE_CASE } from '@application/use-cases/process-rate-tick.use-case'
import type { ProcessRateTickUseCase } from '@application/use-cases/process-rate-tick.use-case'
import {
  GENERATE_COMMENTARY_USE_CASE,
  createGenerateCommentaryUseCase,
} from '@ai/application/use-cases/generate-commentary.use-case'
import type { GenerateCommentaryUseCase } from '@ai/application/use-cases/generate-commentary.use-case'
import { ClaudeCommentaryAdapter } from '@ai/infrastructure/outbound/claude/claude-commentary.adapter'
import { CommentaryScheduler } from '@ai/infrastructure/inbound/commentary.scheduler'
import { RatesModule } from '../rates/rates.module'

@Module({
  imports: [RatesModule, ConfigModule],
  providers: [
    AppLoggerService,
    ClaudeCommentaryAdapter,
    { provide: AI_COMMENTARY_PORT, useExisting: ClaudeCommentaryAdapter },
    {
      provide: GENERATE_COMMENTARY_USE_CASE,
      useFactory: (
        aiCommentary: AiCommentaryPort,
        processRateTick: ProcessRateTickUseCase,
        logger: AppLoggerService,
      ): GenerateCommentaryUseCase =>
        createGenerateCommentaryUseCase(aiCommentary, processRateTick, logger),
      inject: [AI_COMMENTARY_PORT, PROCESS_RATE_TICK_USE_CASE, AppLoggerService],
    },
    CommentaryScheduler,
  ],
  exports: [GENERATE_COMMENTARY_USE_CASE],
})
export class AiModule {}
