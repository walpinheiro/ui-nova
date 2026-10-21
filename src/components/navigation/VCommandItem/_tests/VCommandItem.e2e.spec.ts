import { test, expect } from '@playwright/test'
test('VCommandItem story renders', async ({ page }) => {
  await page.goto('/iframe.html?id=navigation-vcommanditem--default&viewMode=story')
  await expect(page.getByTestId('v-command-item')).toBeVisible()
})
