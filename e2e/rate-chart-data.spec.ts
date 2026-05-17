import { test, expect } from '@playwright/test'
import { waitForRates, waitForCharts } from './helpers/wait'

const CHART_VISIBLE_TIMEOUT_MS = 10_000

const PAIRS = ['ETH-USDC', 'ETH-USDT', 'ETH-BTC'] as const

const hasChartPaths = (pair: string): boolean => {
  const chart = document.querySelector(`[data-testid="rate-chart-${pair}"]`)
  return chart?.querySelector('svg path') !== null
}

test.describe('RateChart real data rendering', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    await waitForRates(page)
    await waitForCharts(page)
  })

  test('should transition all charts from loading spinner to chart container', async ({ page }) => {
    for (const pair of PAIRS) {
      await expect(page.getByTestId(`rate-chart-${pair}`)).toBeVisible({
        timeout: CHART_VISIBLE_TIMEOUT_MS,
      })
      await expect(page.getByTestId(`chart-loading-${pair}`)).not.toBeVisible()
    }
  })

  test('should render SVG path elements with real price data in each chart', async ({ page }) => {
    for (const pair of PAIRS) {
      await page.getByTestId(`rate-chart-${pair}`).waitFor({ timeout: CHART_VISIBLE_TIMEOUT_MS })
      const hasPaths = await page.evaluate(hasChartPaths, pair)
      expect(hasPaths, `Chart for ${pair} should have SVG path elements`).toBe(true)
    }
  })

  test('should show chart for ETH/USDC pair', async ({ page }) => {
    await expect(page.getByTestId('rate-chart-ETH-USDC')).toBeVisible({
      timeout: CHART_VISIBLE_TIMEOUT_MS,
    })
  })

  test('should show chart for ETH/USDT pair', async ({ page }) => {
    await expect(page.getByTestId('rate-chart-ETH-USDT')).toBeVisible({
      timeout: CHART_VISIBLE_TIMEOUT_MS,
    })
  })

  test('should show chart for ETH/BTC pair', async ({ page }) => {
    await expect(page.getByTestId('rate-chart-ETH-BTC')).toBeVisible({
      timeout: CHART_VISIBLE_TIMEOUT_MS,
    })
  })
})
