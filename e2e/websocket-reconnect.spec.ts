import { test, expect } from '@playwright/test'
import { waitForRates } from './helpers/wait'

const DISCONNECT_SETTLE_MS = 5_000
const RECONNECT_TIMEOUT_MS = 25_000

const waitForBadgeText = async (
  page: import('@playwright/test').Page,
  texts: readonly string[],
  timeout: number,
): Promise<void> => {
  await page.waitForFunction(
    (expected: readonly string[]) => {
      const badge = document.querySelector('[data-testid="badge"]')
      const text = badge?.textContent?.trim() ?? ''
      return expected.includes(text)
    },
    texts,
    { timeout },
  )
}

test.describe('WebSocket reconnection', () => {
  test('should show disconnected state when offline', async ({ page }) => {
    await page.goto('/')
    await waitForRates(page)

    await page.context().setOffline(true)
    await waitForBadgeText(page, ['Disconnected', 'Connecting...'], DISCONNECT_SETTLE_MS)

    const text = await page.getByTestId('badge').textContent()
    expect(['Disconnected', 'Connecting...']).toContain(text?.trim())

    await page.context().setOffline(false)
  })

  test('should reconnect and resume prices after coming back online', async ({ page }) => {
    await page.goto('/')
    await waitForRates(page)

    await page.context().setOffline(true)
    await waitForBadgeText(page, ['Disconnected', 'Connecting...'], DISCONNECT_SETTLE_MS)

    await page.context().setOffline(false)
    await waitForBadgeText(page, ['Connected'], RECONNECT_TIMEOUT_MS)

    await expect(page.getByTestId('badge')).toContainText('Connected')
  })

  test('should restore live prices after reconnection', async ({ page }) => {
    await page.goto('/')
    await waitForRates(page)

    await page.context().setOffline(true)
    await waitForBadgeText(page, ['Disconnected', 'Connecting...'], DISCONNECT_SETTLE_MS)

    await page.context().setOffline(false)
    await waitForRates(page)

    await expect(page.getByTestId('price-tag')).toHaveCount(3, { timeout: RECONNECT_TIMEOUT_MS })
  })
})
