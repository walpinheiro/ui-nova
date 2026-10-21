export {}
const isVitest = typeof process !== 'undefined' && !!process.env.VITEST

if (isVitest) {
  const { describe, it, expect } = await import('vitest')
  describe('VSkeleton e2e (playwright only, skipped under vitest)', () => {
    it('placeholder', () => {
      expect(true).toBe(true)
    })
  })
} else {
  const { test, expect } = await import('@playwright/test')

  test('VSkeleton story renders', async ({ page }) => {
    await page.goto('/iframe.html?id=feedback-vskeleton--default&viewMode=story')
    await expect(page.getByTestId('v-skeleton')).toBeVisible()
  })
}
