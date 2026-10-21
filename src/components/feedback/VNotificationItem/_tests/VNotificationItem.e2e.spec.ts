import { test, expect } from '@playwright/test'
test('VNotificationItem story renders', async ({ page }) => {
  await page.goto('/iframe.html?id=feedback-vnotificationitem--default&viewMode=story')
  await expect(page.getByTestId('v-notification-item')).toBeVisible()
})
