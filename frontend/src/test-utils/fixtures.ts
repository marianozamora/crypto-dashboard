import type { RateUpdate, MarketCommentary } from '@crypto/shared'

// ─── Raw values ────────────────────────────────────────────────────────────────

const MOCK_TIMESTAMP_1 = '2025-01-15T10:30:00.000Z'
const MOCK_TIMESTAMP_2 = '2025-01-15T10:31:00.000Z'

const ETH_USDC_PRICE = 2341.56
const ETH_USDC_PRICE_ABOVE_AVG = 2400.0
const ETH_USDC_PRICE_BELOW_AVG = 2280.0
const ETH_USDC_PRICE_TICK_2 = 2350.0
const ETH_USDC_HOURLY_AVG = 2310.0

const ETH_BTC_PRICE = 0.052134
const ETH_BTC_HOURLY_AVG = 0.051

// ─── Expected formatted output (for test assertions) ──────────────────────────

const EXPECTED_ETH_USDC_PRICE = '2,341.56'
const EXPECTED_ETH_USDC_HOURLY_AVG = '$2,310.00'
const EXPECTED_CHANGE_ABOVE_AVG = '+1.37%'
const EXPECTED_CHANGE_BELOW_AVG = '-1.30%'

// ─── RateUpdate fixtures ───────────────────────────────────────────────────────

const ETH_USDC_RATE: RateUpdate = {
  pair: 'ETH/USDC',
  price: ETH_USDC_PRICE,
  timestamp: MOCK_TIMESTAMP_1,
  hourlyAverage: ETH_USDC_HOURLY_AVG,
}

const ETH_USDC_RATE_ABOVE_AVG: RateUpdate = {
  ...ETH_USDC_RATE,
  price: ETH_USDC_PRICE_ABOVE_AVG,
}

const ETH_USDC_RATE_BELOW_AVG: RateUpdate = {
  ...ETH_USDC_RATE,
  price: ETH_USDC_PRICE_BELOW_AVG,
}

const ETH_USDC_RATE_TICK_2: RateUpdate = {
  ...ETH_USDC_RATE,
  price: ETH_USDC_PRICE_TICK_2,
  timestamp: MOCK_TIMESTAMP_2,
}

const ETH_BTC_RATE: RateUpdate = {
  pair: 'ETH/BTC',
  price: ETH_BTC_PRICE,
  timestamp: MOCK_TIMESTAMP_1,
  hourlyAverage: ETH_BTC_HOURLY_AVG,
}

// ─── MarketCommentary fixture ──────────────────────────────────────────────────

const MOCK_COMMENTARY: MarketCommentary = {
  text: 'ETH markets show strong momentum — ETH/USDC gained 1.37% above its hourly average of $2,310.00. ETH/USDT and ETH/BTC show similar upward pressure.',
  generatedAt: MOCK_TIMESTAMP_1,
  pairs: ['ETH/USDT', 'ETH/USDC', 'ETH/BTC'],
}

export {
  MOCK_TIMESTAMP_1,
  MOCK_TIMESTAMP_2,
  ETH_USDC_PRICE,
  ETH_USDC_PRICE_ABOVE_AVG,
  ETH_USDC_PRICE_BELOW_AVG,
  ETH_USDC_PRICE_TICK_2,
  ETH_USDC_HOURLY_AVG,
  ETH_BTC_PRICE,
  ETH_BTC_HOURLY_AVG,
  EXPECTED_ETH_USDC_PRICE,
  EXPECTED_ETH_USDC_HOURLY_AVG,
  EXPECTED_CHANGE_ABOVE_AVG,
  EXPECTED_CHANGE_BELOW_AVG,
  ETH_USDC_RATE,
  ETH_USDC_RATE_ABOVE_AVG,
  ETH_USDC_RATE_BELOW_AVG,
  ETH_USDC_RATE_TICK_2,
  ETH_BTC_RATE,
  MOCK_COMMENTARY,
}
