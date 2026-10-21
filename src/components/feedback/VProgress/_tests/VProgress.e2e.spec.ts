import { test, expect } from '@playwright/test'
test('VProgress story renders', async ({ page }) => {
  await page.goto('/iframe.html?id=feedback-vprogress--linear&viewMode=story')
  await expect(page.getByTestId('progress-container')).toBeVisible()
})
