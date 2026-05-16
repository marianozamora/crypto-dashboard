import type { CurrencyPair as CurrencyPairType } from '@crypto/shared'

const VALID_PAIRS = ['ETH/USDC', 'ETH/USDT', 'ETH/BTC'] as const

const FINNHUB_TO_PAIR: Readonly<Record<string, CurrencyPairType>> = {
  'BINANCE:ETHUSDC': 'ETH/USDC',
  'BINANCE:ETHUSDT': 'ETH/USDT',
  'BINANCE:ETHBTC': 'ETH/BTC',
}

class InvalidCurrencyPairError extends Error {
  constructor(value: string) {
    super(`Invalid currency pair: "${value}". Valid pairs: ${VALID_PAIRS.join(', ')}`)
    this.name = 'InvalidCurrencyPairError'
  }
}

function isValidPair(value: string): value is CurrencyPairType {
  return (VALID_PAIRS as readonly string[]).includes(value)
}

class CurrencyPair {
  private constructor(private readonly value: CurrencyPairType) {}

  static create(value: string): CurrencyPair {
    if (!isValidPair(value)) throw new InvalidCurrencyPairError(value)
    return new CurrencyPair(value)
  }

  static fromFinnhubSymbol(symbol: string): CurrencyPair {
    const pair = FINNHUB_TO_PAIR[symbol]
    if (pair === undefined) throw new InvalidCurrencyPairError(symbol)
    return new CurrencyPair(pair)
  }

  getValue(): CurrencyPairType {
    return this.value
  }
}

export { CurrencyPair, InvalidCurrencyPairError }
