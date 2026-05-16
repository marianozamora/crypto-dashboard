import { Injectable, Inject } from '@nestjs/common'
import type { OnModuleInit, OnApplicationShutdown } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import WebSocket from 'ws'
import type { MessageEvent } from 'ws'
import { VALID_PAIRS, currencyPairFromFinnhub } from '@domain/value-objects/currency-pair.vo'
import type { CurrencyPairValue } from '@domain/value-objects/currency-pair.vo'
import { AppLoggerService } from '@logger/app-logger.service'
import { PROCESS_RATE_TICK_USE_CASE } from '@application/use-cases/process-rate-tick.use-case'
import type { ProcessRateTickUseCase } from '@application/use-cases/process-rate-tick.use-case'
import type { Env } from '@config/env.validation'
import { FINNHUB_WS_URL, FINNHUB_SYMBOL_MAP, RECONNECT_DELAYS_MS } from './finnhub.config'

type FinnhubTrade = {
  readonly p: number
  readonly s: string
  readonly t: number
  readonly v: number
}

type FinnhubMessage = {
  readonly type: string
  readonly data?: readonly FinnhubTrade[]
}

const isFinnhubTrade = (value: unknown): value is FinnhubTrade => {
  if (typeof value !== 'object' || value === null) return false
  const v = value as unknown as Record<string, unknown>
  return typeof v['p'] === 'number' && typeof v['s'] === 'string' && typeof v['t'] === 'number'
}

const isFinnhubMessage = (value: unknown): value is FinnhubMessage => {
  if (typeof value !== 'object' || value === null) return false
  const v = value as unknown as Record<string, unknown>
  if (typeof v['type'] !== 'string') return false
  return v['data'] === undefined || (Array.isArray(v['data']) && v['data'].every(isFinnhubTrade))
}

@Injectable()
export class FinnhubWsAdapter implements OnModuleInit, OnApplicationShutdown {
  private ws: WebSocket | null = null
  private reconnectAttempt = 0
  private isShuttingDown = false

  constructor(
    @Inject(PROCESS_RATE_TICK_USE_CASE)
    private readonly processRateTickUseCase: ProcessRateTickUseCase,
    private readonly appLogger: AppLoggerService,
    private readonly configService: ConfigService<Env, true>,
  ) {}

  onModuleInit(): void {
    this.connect()
  }

  onApplicationShutdown(): void {
    this.isShuttingDown = true
    this.unsubscribeAll()
    this.ws?.close()
    this.appLogger.logError('finnhub_ws_shutdown', new Error('Graceful shutdown'))
  }

  isConnected(): boolean {
    return this.ws !== null && this.ws.readyState === WebSocket.OPEN
  }

  private connect(): void {
    const apiKey = this.configService.get('FINNHUB_API_KEY')
    const url = `${FINNHUB_WS_URL}?token=${apiKey}`
    this.ws = new WebSocket(url)
    this.ws.onopen = (): void => this.onOpen()
    this.ws.onmessage = (event): void => this.onMessage(event)
    this.ws.onclose = (): void => this.onClose()
    this.ws.onerror = (error): void => this.onError(error)
  }

  private onOpen(): void {
    this.reconnectAttempt = 0
    this.subscribeAll()
  }

  private onMessage(event: MessageEvent): void {
    try {
      const raw = event.data.toString()
      const parsed: unknown = JSON.parse(raw)
      if (!isFinnhubMessage(parsed) || parsed.type !== 'trade' || !parsed.data) return
      for (const trade of parsed.data) {
        this.handleTick(trade)
      }
    } catch (error) {
      this.appLogger.logError('finnhub_ws_parse_error', error)
    }
  }

  private handleTick(trade: FinnhubTrade): void {
    let pair: CurrencyPairValue
    try {
      pair = currencyPairFromFinnhub(trade.s)
    } catch (error) {
      this.appLogger.logError('invalid_pair_tick', error)
      return
    }
    this.processRateTickUseCase.execute(pair, trade.p, trade.t).catch((error) => {
      this.appLogger.logError('invalid_price_tick', error)
    })
  }

  private onClose(): void {
    if (this.isShuttingDown) return
    this.scheduleReconnect()
  }

  private onError(error: unknown): void {
    this.appLogger.logError('finnhub_ws_error', error)
  }

  private scheduleReconnect(): void {
    const index = Math.min(this.reconnectAttempt, RECONNECT_DELAYS_MS.length - 1)
    const delay = RECONNECT_DELAYS_MS[index]
    this.appLogger.logReconnectionAttempt(this.reconnectAttempt, delay)
    setTimeout((): void => this.connect(), delay)
    this.reconnectAttempt = Math.min(this.reconnectAttempt + 1, RECONNECT_DELAYS_MS.length - 1)
  }

  private subscribeAll(): void {
    for (const pair of VALID_PAIRS) {
      this.ws?.send(JSON.stringify({ type: 'subscribe', symbol: FINNHUB_SYMBOL_MAP[pair] }))
    }
  }

  private unsubscribeAll(): void {
    for (const pair of VALID_PAIRS) {
      this.ws?.send(JSON.stringify({ type: 'unsubscribe', symbol: FINNHUB_SYMBOL_MAP[pair] }))
    }
  }
}
