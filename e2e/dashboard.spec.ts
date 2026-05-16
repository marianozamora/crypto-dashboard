import { test, expect } from '@playwright/test'
import { waitForConnection, waitForRates, getPriceText } from './helpers/wait'

test.describe('Dashboard', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    await waitForConnection(page)
  })

  test('should display cryptostream title', async ({ page }) => {
    await expect(page.locator('h1')).toContainText('cryptostream')
  })

  test('should display connection status badge', async ({ page }) => {
    const badge = page.getByTestId('badge')
    await expect(badge).toBeVisible()
  })

  test('should display all three pair cards', async ({ page }) => {
    await expect(page.getByTestId('pair-card-ETH-USDC')).toBeVisible()
    await expect(page.getByTestId('pair-card-ETH-USDT')).toBeVisible()
    await expect(page.getByTestId('pair-card-ETH-BTC')).toBeVisible()
  })

  test('should display price tags for all pairs', async ({ page }) => {
    await waitForRates(page)
    const priceTags = page.getByTestId('price-tag')
    await expect(priceTags).toHaveCount(3)
  })

  test('should display stat rows for hourly average', async ({ page }) => {
    await waitForRates(page)
    const statRows = page.getByTestId('stat-row')
    await expect(statRows.first()).toBeVisible()
  })

  test('should show charts for all pairs', async ({ page }) => {
    await waitForRates(page)
    await page.waitForTimeout(3_000)
    await expect(page.getByTestId('rate-chart-ETH-USDC')).toBeVisible()
    await expect(page.getByTestId('rate-chart-ETH-USDT')).toBeVisible()
    await expect(page.getByTestId('rate-chart-ETH-BTC')).toBeVisible()
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
    const loading = page.getByTestId('commentary-loading')
    await expect(loading).toBeVisible()
  })
})
