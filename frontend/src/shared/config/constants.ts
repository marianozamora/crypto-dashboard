import type { CurrencyPair } from '@crypto/shared'

const CURRENCY_PAIRS: readonly CurrencyPair[] = ['ETH/USDC', 'ETH/USDT', 'ETH/BTC'] as const

const WS_URL: string = import.meta.env['VITE_WS_URL'] ?? 'http://localhost:3001'

const MAX_CHART_TICKS = 50

const RECONNECT_DELAYS_MS: readonly number[] = [
  1_000,
  2_000,
  4_000,
  8_000,
  16_000,
  30_000,
] as const

const PAIR_LABELS: Record<CurrencyPair, string> = {
  'ETH/USDC': 'ETH / USDC',
  'ETH/USDT': 'ETH / USDT',
  'ETH/BTC': 'ETH / BTC',
} as const

const PAIR_CURRENCY_SYMBOLS: Record<CurrencyPair, string> = {
  'ETH/USDC': '$',
  'ETH/USDT': '$',
  'ETH/BTC': '₿',
} as const

export {
  CURRENCY_PAIRS,
  WS_URL,
  MAX_CHART_TICKS,
  RECONNECT_DELAYS_MS,
  PAIR_LABELS,
  PAIR_CURRENCY_SYMBOLS,
}
