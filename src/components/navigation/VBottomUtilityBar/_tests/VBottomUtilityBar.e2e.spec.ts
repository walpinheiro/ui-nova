import { test, expect } from '@playwright/test'
test('VBottomUtilityBar story renders', async ({ page }) => {
  await page.goto('/iframe.html?id=navigation-vbottomutilitybar--default&viewMode=story')
  await expect(page.getByTestId('v-bottom-utility-bar')).toBeVisible()
})
