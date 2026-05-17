import { test, expect } from '@playwright/test'
import { waitForRatesAndCharts } from './helpers/wait'

const CHART_VISIBLE_TIMEOUT_MS = 10_000

const PAIRS = ['ETH-USDC', 'ETH-USDT', 'ETH-BTC'] as const

test.describe('RateChart real data rendering', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    await waitForRatesAndCharts(page)
  })

  test('should transition all charts from loading spinner to chart container', async ({ page }) => {
    for (const pair of PAIRS) {
      await expect(page.getByTestId(`rate-chart-${pair}`)).toBeVisible({
        timeout: CHART_VISIBLE_TIMEOUT_MS,
      })
      await expect(page.getByTestId(`chart-loading-${pair}`)).not.toBeVisible()
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
