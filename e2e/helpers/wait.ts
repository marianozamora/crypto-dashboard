import type { Page } from '@playwright/test'

const waitForConnection = async (page: Page): Promise<void> => {
  await page.waitForSelector('[data-testid="badge"]', { timeout: 10_000 })
}

const waitForRates = async (page: Page): Promise<void> => {
  await page.waitForSelector('[data-testid="price-tag"]', { timeout: 15_000 })
}

const getPriceText = async (page: Page, pair: string): Promise<string | null> => {
  const selector = `[data-testid="pair-card-${pair}"] [data-testid="price-tag"]`
  return page.locator(selector).textContent()
}

export { waitForConnection, waitForRates, getPriceText }
