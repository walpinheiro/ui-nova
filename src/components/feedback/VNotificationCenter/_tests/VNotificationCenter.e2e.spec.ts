import { test, expect } from '@playwright/test'
test('VNotificationCenter story renders', async ({ page }) => {
  await page.goto('/iframe.html?id=feedback-vnotificationcenter--default&viewMode=story')
  await expect(page.getByTestId('v-notification-center')).toBeVisible()
})
