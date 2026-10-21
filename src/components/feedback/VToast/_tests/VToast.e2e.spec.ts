import { test, expect } from '@playwright/test'
test('VToast story renders', async ({ page }) => {
  await page.goto('/iframe.html?id=feedback-vtoast--default&viewMode=story')
  await expect(page.getByTestId('v-toast')).toBeVisible()
})
