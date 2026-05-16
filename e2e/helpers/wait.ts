import type { Page } from '@playwright/test'

const RATE_TIMEOUT = 45_000

const waitForConnection = async (page: Page): Promise<void> => {
  await page.waitForSelector('[data-testid="badge"]', { timeout: 10_000 })
}

const waitForRates = async (page: Page): Promise<void> => {
  await page.waitForFunction(
    () => document.querySelectorAll('[data-testid="price-tag"]').length >= 3,
    { timeout: RATE_TIMEOUT },
  )
}

const waitForCharts = async (page: Page): Promise<void> => {
  await page.waitForSelector('[data-testid^="rate-chart-"]', { timeout: RATE_TIMEOUT })
}

const getPriceText = async (page: Page, pair: string): Promise<string | null> => {
  const selector = `[data-testid="pair-card-${pair}"] [data-testid="price-tag"]`
  return page.locator(selector).textContent({ timeout: RATE_TIMEOUT })
}

export { waitForConnection, waitForRates, waitForCharts, getPriceText }
