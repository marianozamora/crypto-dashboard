const VALID_PAIRS = ['ETH/USDC', 'ETH/USDT', 'ETH/BTC'] as const

type CurrencyPairValue = (typeof VALID_PAIRS)[number]

const FINNHUB_SYMBOL_MAP: Readonly<Record<string, CurrencyPairValue>> = {
  'BINANCE:ETHUSDC': 'ETH/USDC',
  'BINANCE:ETHUSDT': 'ETH/USDT',
  'BINANCE:ETHBTC': 'ETH/BTC',
}

class InvalidCurrencyPairError extends Error {
  constructor(value: string) {
    super(`Invalid currency pair: ${value}. Valid: ${VALID_PAIRS.join(', ')}`)
    this.name = 'InvalidCurrencyPairError'
  }
}

const createCurrencyPair = (value: string): CurrencyPairValue => {
  if (!(VALID_PAIRS as readonly string[]).includes(value)) {
    throw new InvalidCurrencyPairError(value)
  }
  return value as CurrencyPairValue
}

const currencyPairFromFinnhub = (symbol: string): CurrencyPairValue => {
  const pair = FINNHUB_SYMBOL_MAP[symbol]
  if (!pair) throw new InvalidCurrencyPairError(symbol)
  return pair
}

export { VALID_PAIRS, createCurrencyPair, currencyPairFromFinnhub, InvalidCurrencyPairError }
export type { CurrencyPairValue }
