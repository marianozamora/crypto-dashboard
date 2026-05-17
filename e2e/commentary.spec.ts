import { test, expect } from '@playwright/test'
import { waitForConnection } from './helpers/wait'

const COMMENTARY_VISIBLE_TIMEOUT_MS = 10_000

test.describe('AI commentary widget', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    await waitForConnection(page)
  })

  test('should show loading state before commentary arrives', async ({ page }) => {
    await expect(page.getByTestId('commentary-loading')).toBeVisible({
      timeout: COMMENTARY_VISIBLE_TIMEOUT_MS,
    })
  })

  test('should display commentary section title', async ({ page }) => {
    await expect(page.getByText('AI Market Commentary')).toBeVisible({
      timeout: COMMENTARY_VISIBLE_TIMEOUT_MS,
    })
  })

  test('should show expected loading message text', async ({ page }) => {
    await expect(page.getByText('Commentary generates every hour...')).toBeVisible({
      timeout: COMMENTARY_VISIBLE_TIMEOUT_MS,
    })
  })

  test('should keep showing loading state since commentary generates hourly', async ({ page }) => {
    await page.waitForTimeout(2_000)
    await expect(page.getByTestId('commentary-loading')).toBeVisible()
    await expect(page.getByTestId('commentary-text')).not.toBeVisible()
  })
})
