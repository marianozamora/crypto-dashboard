import { test, expect } from '@playwright/test'
import { waitForConnection } from './helpers/wait'

const VISIBLE_TIMEOUT_MS = 10_000

test.describe('AI commentary widget', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    await waitForConnection(page)
  })

  test('should render commentary widget with title and loading state before commentary arrives', async ({ page }) => {
    await expect(page.getByText('AI Market Commentary')).toBeVisible({ timeout: VISIBLE_TIMEOUT_MS })
    await expect(page.getByTestId('commentary-loading')).toBeVisible({ timeout: VISIBLE_TIMEOUT_MS })
    await expect(page.getByText('Commentary generates every hour...')).toBeVisible()
  })

  test('should not show commentary text before AI has responded', async ({ page }) => {
    await expect(page.getByTestId('commentary-loading')).toBeVisible({ timeout: VISIBLE_TIMEOUT_MS })
    await expect(page.getByTestId('commentary-text')).not.toBeVisible()
  })
})
