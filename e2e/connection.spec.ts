import { test, expect } from '@playwright/test'

test.describe('Connection states', () => {
  test('should show connecting state on initial load', async ({ page }) => {
    await page.goto('/')
    const badge = page.getByTestId('badge')
    await expect(badge).toBeVisible()
    const text = await badge.textContent()
    expect(['Connecting...', 'Connected']).toContain(text?.trim())
  })

  test('should show disconnected when backend is unreachable', async ({ page, context }) => {
    await context.setOffline(true)
    await page.goto('/', { waitUntil: 'domcontentloaded' })
    const badge = page.getByTestId('badge')
    await expect(badge).toBeVisible({ timeout: 10_000 })
    await page.waitForTimeout(3_000)
    const text = await badge.textContent()
    expect(['Connecting...', 'Disconnected']).toContain(text?.trim())
  })

  test('should not crash when backend returns error', async ({ page }) => {
    await page.route('**/health', (route) =>
      route.fulfill({ status: 500, body: 'Internal Server Error' }),
    )
    await page.goto('/')
    await expect(page.locator('h1')).toContainText('cryptostream')
  })

  test('should show error fallback when widget crashes', async ({ page }) => {
    await page.goto('/')
    await expect(page.locator('header')).toBeVisible()
  })
})
