type CurrencyPair = 'ETH/USDC' | 'ETH/USDT' | 'ETH/BTC'

type ConnectionState = 'connecting' | 'connected' | 'disconnected'

type RateUpdate = {
  readonly pair: CurrencyPair
  readonly price: number
  readonly timestamp: string
  readonly hourlyAverage: number
}

type HourlyAverage = {
  readonly pair: CurrencyPair
  readonly average: number
  readonly periodStart: string
  readonly periodEnd: string
}

type RateTick = {
  readonly pair: CurrencyPair
  readonly price: number
  readonly timestamp: string
}

export type { CurrencyPair, ConnectionState, RateUpdate, HourlyAverage, RateTick }
