import { test, expect } from '@playwright/test'
test('VEmptyState story renders', async ({ page }) => {
  await page.goto('/iframe.html?id=feedback-vemptystate--default&viewMode=story')
  await expect(page.getByTestId('v-empty-state')).toBeVisible()
})
