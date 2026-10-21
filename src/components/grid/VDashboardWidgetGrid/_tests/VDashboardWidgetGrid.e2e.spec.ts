export { }
const isVitest = typeof process !== 'undefined' && !!process.env.VITEST

if (isVitest) {
  const { describe, it, expect } = await import('vitest')
  describe('VDashboardWidgetGrid e2e (playwright only)', () => {
    it('placeholder', () => expect(true).toBe(true))
  })
} else {
  const { test, expect: pwExpect } = await import('@playwright/test')

  test('VDashboardWidgetGrid renders dashboard canvas', async ({ page }) => {
    await page.goto('http://localhost:8321/VDashboardWidgetGrid.html')
    await page.waitForFunction(() => (window as unknown as { __ready?: boolean }).__ready === true)
    await pwExpect(page.getByTestId('v-dashboard-widget-grid')).toBeVisible()
    await pwExpect(page.getByTestId('v-dashboard-widget-total-revenue')).toBeVisible()
  })
}
