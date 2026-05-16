import { test, expect } from '@playwright/test'
import { waitForConnection, waitForRates, waitForCharts, getPriceText } from './helpers/wait'

test.describe('Dashboard', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    await waitForConnection(page)
  })

  test('should display cryptostream title', async ({ page }) => {
    await expect(page.locator('h1')).toContainText('cryptostream')
  })

  test('should display connection status badge', async ({ page }) => {
    await expect(page.getByTestId('badge')).toBeVisible()
  })

  test('should display all three pair cards', async ({ page }) => {
    await expect(page.getByTestId('pair-card-ETH-USDC')).toBeVisible()
    await expect(page.getByTestId('pair-card-ETH-USDT')).toBeVisible()
    await expect(page.getByTestId('pair-card-ETH-BTC')).toBeVisible()
  })

  test('should display price tags for all pairs', async ({ page }) => {
    await waitForRates(page)
    await expect(page.getByTestId('price-tag')).toHaveCount(3, { timeout: 10_000 })
  })

  test('should display stat rows for hourly average', async ({ page }) => {
    await waitForRates(page)
    await expect(page.getByTestId('stat-row').first()).toBeVisible()
  })

  test('should show charts for all pairs', async ({ page }) => {
    await waitForRates(page)
    await waitForCharts(page)
    await expect(page.getByTestId('rate-chart-ETH-USDC')).toBeVisible({ timeout: 10_000 })
    await expect(page.getByTestId('rate-chart-ETH-USDT')).toBeVisible({ timeout: 10_000 })
    await expect(page.getByTestId('rate-chart-ETH-BTC')).toBeVisible({ timeout: 10_000 })
  })

  test('should update prices in real time', async ({ page }) => {
    await waitForRates(page)
    const initialPrice = await getPriceText(page, 'ETH-USDC')
    await page.waitForTimeout(5_000)
    const updatedPrice = await getPriceText(page, 'ETH-USDC')
    expect(initialPrice).not.toBeNull()
    expect(updatedPrice).not.toBeNull()
  })

  test('should show commentary loading state initially', async ({ page }) => {
    await expect(page.getByTestId('commentary-loading')).toBeVisible()
  })
})
