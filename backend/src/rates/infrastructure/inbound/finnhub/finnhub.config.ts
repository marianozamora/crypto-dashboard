import type { CurrencyPairValue } from '@domain/value-objects/currency-pair.vo'

const FINNHUB_WS_URL = 'wss://ws.finnhub.io'

const FINNHUB_SYMBOL_MAP: Record<CurrencyPairValue, string> = {
  'ETH/USDC': 'BINANCE:ETHUSDC',
  'ETH/USDT': 'BINANCE:ETHUSDT',
  'ETH/BTC': 'BINANCE:ETHBTC',
}

const RECONNECT_DELAYS_MS: readonly number[] = [1_000, 2_000, 4_000, 8_000, 16_000, 30_000]

export { FINNHUB_WS_URL, FINNHUB_SYMBOL_MAP, RECONNECT_DELAYS_MS }
