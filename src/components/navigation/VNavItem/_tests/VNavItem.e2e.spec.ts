import { test, expect } from '@playwright/test'
test('VNavItem story renders', async ({ page }) => {
  await page.goto('/iframe.html?id=navigation-vnavitem--default&viewMode=story')
  await expect(page.getByTestId('v-nav-item')).toBeVisible()
})
