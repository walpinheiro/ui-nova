// VCardGrid e2e (Playwright). See VSection.e2e.spec.ts for harness notes.
export { }
const isVitest = typeof process !== 'undefined' && !!process.env.VITEST

if (isVitest) {
  const { describe, it, expect } = await import('vitest')
  describe('VCardGrid e2e (playwright only)', () => {
    it('placeholder', () => expect(true).toBe(true))
  })
} else {
  const { test, expect: pwExpect } = await import('@playwright/test')

  test('VCardGrid renders grid layout', async ({ page }) => {
    await page.goto('http://localhost:8321/VCardGrid.html')
    await page.waitForFunction(() => (window as unknown as { __ready?: boolean }).__ready === true)
    const grid = page.getByTestId('v-cardgrid').first()
    await pwExpect(grid).toBeVisible()
    await pwExpect(grid).toHaveCSS('display', 'grid')
  })
}
