import type { RateUpdate } from '@crypto/shared'
import { createCurrencyPair, VALID_PAIRS } from '@domain/value-objects/currency-pair.vo'
import type { CurrencyPairValue } from '@domain/value-objects/currency-pair.vo'
import { createPrice } from '@domain/value-objects/price.vo'
import type { Price } from '@domain/value-objects/price.vo'
import { calculateHourlyAverage } from '@domain/services/rate-aggregator.service'
import type { RateTickForAggregation } from '@domain/services/rate-aggregator.service'
import type { RateStreamPort } from '@domain/ports/outbound/rate-stream.port'
import { AppLoggerService } from '@logger/app-logger.service'

const PROCESS_RATE_TICK_USE_CASE = Symbol('ProcessRateTickUseCase')

type ProcessRateTickUseCase = {
  execute(pair: string, price: number, timestamp: number): Promise<void>
  getTicksForPair(pair: CurrencyPairValue): readonly RateTickForAggregation[]
}

type TicksMap = Map<CurrencyPairValue, RateTickForAggregation[]>

const MAX_TICKS_PER_PAIR = 3_600

const initTicksMap = (): TicksMap => new Map(VALID_PAIRS.map((pair) => [pair, []]))

const addTick = (map: TicksMap, pair: CurrencyPairValue, price: Price, timestamp: number): void => {
  const ticks = map.get(pair) ?? []
  ticks.push({ price, timestamp })
  if (ticks.length > MAX_TICKS_PER_PAIR) ticks.shift()
  map.set(pair, ticks)
}

const buildRateUpdate = (
  pair: CurrencyPairValue,
  price: Price,
  timestamp: number,
  ticks: readonly RateTickForAggregation[],
): RateUpdate => ({
  pair,
  price: price.value,
  timestamp: new Date(timestamp).toISOString(),
  hourlyAverage: calculateHourlyAverage(ticks) ?? price.value,
})

const createProcessRateTickUseCase = (
  rateStream: RateStreamPort,
  appLogger: AppLoggerService,
): ProcessRateTickUseCase => {
  const ticksMap: TicksMap = initTicksMap()

  return {
    execute: async (pair, price, timestamp): Promise<void> => {
      const currencyPair = createCurrencyPair(pair)
      const priceVO = createPrice(price)
      addTick(ticksMap, currencyPair, priceVO, timestamp)
      const ticks = ticksMap.get(currencyPair) ?? []
      rateStream.emit(buildRateUpdate(currencyPair, priceVO, timestamp, ticks))
      appLogger.logRateTick(currencyPair, price)
    },
    getTicksForPair: (pair): readonly RateTickForAggregation[] => ticksMap.get(pair) ?? [],
  }
}

export { PROCESS_RATE_TICK_USE_CASE, createProcessRateTickUseCase }
export type { ProcessRateTickUseCase }
