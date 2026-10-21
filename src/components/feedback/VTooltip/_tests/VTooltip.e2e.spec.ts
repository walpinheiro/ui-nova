import { test, expect } from '@playwright/test'
test('VTooltip story renders', async ({ page }) => {
  await page.goto('/iframe.html?id=feedback-vtooltip--default&viewMode=story')
  await expect(page.getByTestId('v-tooltip')).toBeVisible()
})
