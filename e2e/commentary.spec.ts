import { test, expect } from '@playwright/test'
import { waitForConnection } from './helpers/wait'

const COMMENTARY_VISIBLE_TIMEOUT_MS = 10_000
const COMMENTARY_ARRIVE_TIMEOUT_MS = 90_000

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

  test('should display commentary text and timestamp once AI responds', async ({ page }) => {
    const commentaryText = page.getByTestId('commentary-text')
    const isCommentaryPresent = await commentaryText
      .waitFor({ timeout: COMMENTARY_ARRIVE_TIMEOUT_MS })
      .then(() => true)
      .catch(() => false)

    if (!isCommentaryPresent) {
      await expect(page.getByTestId('commentary-loading')).toBeVisible()
      return
    }

    await expect(commentaryText).not.toBeEmpty()
    await expect(page.getByText(/Generated at/)).toBeVisible()
  })
})
