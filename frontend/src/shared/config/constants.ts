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

const CHART_LINE_COLOR = '#4da6ff'
const CHART_LINE_STROKE_WIDTH = 2
const CHART_GRID_COLOR = 'rgba(255,255,255,0.04)'
const CHART_AXIS_COLOR = 'rgba(255,255,255,0.25)'
const CHART_AXIS_FONT_SIZE = 10
const CHART_Y_AXIS_WIDTH = 60

export {
  CURRENCY_PAIRS,
  WS_URL,
  MAX_CHART_TICKS,
  RECONNECT_DELAYS_MS,
  PAIR_LABELS,
  PAIR_CURRENCY_SYMBOLS,
  CHART_LINE_COLOR,
  CHART_LINE_STROKE_WIDTH,
  CHART_GRID_COLOR,
  CHART_AXIS_COLOR,
  CHART_AXIS_FONT_SIZE,
  CHART_Y_AXIS_WIDTH,
}
