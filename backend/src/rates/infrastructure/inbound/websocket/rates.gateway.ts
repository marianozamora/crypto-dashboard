import { Injectable } from '@nestjs/common'
import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets'
import type { OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets'
import { Server, Socket } from 'socket.io'
import type { RateUpdate, MarketCommentary } from '@crypto/shared'
import { SOCKET_EVENTS } from '@crypto/shared'
import type { CurrencyPairValue } from '@domain/value-objects/currency-pair.vo'
import type { RateStreamPort } from '@domain/ports/outbound/rate-stream.port'
import { AppLoggerService } from '@logger/app-logger.service'

@WebSocketGateway({ cors: { origin: process.env['FRONTEND_URL'] ?? 'http://localhost:5173' } })
@Injectable()
export class RatesGateway implements RateStreamPort, OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  private readonly server!: Server

  private readonly lastKnownRates: Map<CurrencyPairValue, RateUpdate>

  constructor(private readonly appLogger: AppLoggerService) {
    this.lastKnownRates = new Map()
  }

  handleConnection(client: Socket): void {
    this.appLogger.logClientConnected(client.id)
    for (const rate of this.lastKnownRates.values()) {
      client.emit(SOCKET_EVENTS.RATE_UPDATE, rate)
    }
  }

  handleDisconnect(client: Socket): void {
    this.appLogger.logClientDisconnected(client.id)
  }

  emit(update: RateUpdate): void {
    this.lastKnownRates.set(update.pair, update)
    this.server.emit(SOCKET_EVENTS.RATE_UPDATE, update)
  }

  emitCommentary(commentary: MarketCommentary): void {
    this.server.emit(SOCKET_EVENTS.COMMENTARY_UPDATE, commentary)
  }

  getConnectedClientCount(): number {
    return this.server.sockets.sockets.size
  }
}
