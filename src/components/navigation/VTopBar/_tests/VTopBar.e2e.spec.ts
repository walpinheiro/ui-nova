import { test, expect } from '@playwright/test'
test('VTopBar story renders', async ({ page }) => {
  await page.goto('/iframe.html?id=navigation-vtopbar--default&viewMode=story')
  await expect(page.getByTestId('v-top-bar')).toBeVisible()
})
