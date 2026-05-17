import { test, expect } from '@playwright/test'
import { waitForConnection } from './helpers/wait'

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

  test('should show commentary loading state initially', async ({ page }) => {
    await expect(page.getByTestId('commentary-loading')).toBeVisible()
  })
})
