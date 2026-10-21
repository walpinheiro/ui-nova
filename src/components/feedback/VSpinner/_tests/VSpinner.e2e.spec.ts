import { test, expect } from '@playwright/test'
test('VSpinner story renders', async ({ page }) => {
  await page.goto('/iframe.html?id=feedback-vspinner--default&viewMode=story')
  await expect(page.getByTestId('v-spinner')).toBeVisible()
})
