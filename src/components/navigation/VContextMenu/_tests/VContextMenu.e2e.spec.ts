import { test, expect } from '@playwright/test'
test('VContextMenu story renders', async ({ page }) => {
  await page.goto('/iframe.html?id=navigation-vcontextmenu--default&viewMode=story')
  await expect(page.getByTestId('v-context-menu')).toBeVisible()
})
