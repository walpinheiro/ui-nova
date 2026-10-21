import { test, expect } from '@playwright/test'
test('VMenuBar story renders', async ({ page }) => {
  await page.goto('/iframe.html?id=navigation-vmenubar--default&viewMode=story')
  await expect(page.getByTestId('v-menu-bar')).toBeVisible()
})
