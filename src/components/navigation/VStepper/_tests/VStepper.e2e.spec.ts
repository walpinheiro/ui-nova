import { test, expect } from '@playwright/test'
test('VStepper story renders', async ({ page }) => {
  await page.goto('/iframe.html?id=navigation-vstepper--default&viewMode=story')
  await expect(page.getByTestId('v-stepper')).toBeVisible()
})
