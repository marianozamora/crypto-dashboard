import { Injectable, Logger } from '@nestjs/common'
import type { CurrencyPairValue } from '@domain/value-objects/currency-pair.vo'

@Injectable()
export class AppLoggerService {
  private readonly logger = new Logger(AppLoggerService.name)

  logRateTick(pair: CurrencyPairValue, price: number): void {
    this.logger.log(
      JSON.stringify({ event: 'rate_tick', pair, price, timestamp: new Date().toISOString() }),
    )
  }

  logReconnectionAttempt(attempt: number, delayMs: number): void {
    this.logger.warn(
      JSON.stringify({
        event: 'reconnection_attempt',
        attempt,
        delayMs,
        timestamp: new Date().toISOString(),
      }),
    )
  }

  logClientConnected(clientId: string): void {
    this.logger.log(
      JSON.stringify({ event: 'client_connected', clientId, timestamp: new Date().toISOString() }),
    )
  }

  logClientDisconnected(clientId: string): void {
    this.logger.log(
      JSON.stringify({
        event: 'client_disconnected',
        clientId,
        timestamp: new Date().toISOString(),
      }),
    )
  }

  logHourlyAverageCalculated(pair: CurrencyPairValue, average: number): void {
    this.logger.log(
      JSON.stringify({
        event: 'hourly_average_calculated',
        pair,
        average,
        timestamp: new Date().toISOString(),
      }),
    )
  }

  logCommentaryEmitted(generatedAt: string): void {
    this.logger.log(
      JSON.stringify({ event: 'commentary_emitted', generatedAt, timestamp: new Date().toISOString() }),
    )
  }

  logError(event: string, error: unknown): void {
    const message = error instanceof Error ? error.message : String(error)
    this.logger.error(
      JSON.stringify({ event, error: message, timestamp: new Date().toISOString() }),
    )
  }
}
