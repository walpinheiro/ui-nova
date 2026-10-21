export { }
const isVitest = typeof process !== 'undefined' && !!process.env.VITEST

if (isVitest) {
  const { describe, it, expect } = await import('vitest')
  describe('VAutoLayoutGrid e2e (playwright only)', () => {
    it('placeholder', () => expect(true).toBe(true))
  })
} else {
  const { test, expect: pwExpect } = await import('@playwright/test')

  test('VAutoLayoutGrid renders auto-fit grid', async ({ page }) => {
    await page.goto('http://localhost:8321/VAutoLayoutGrid.html')
    await page.waitForFunction(() => (window as unknown as { __ready?: boolean }).__ready === true)
    await pwExpect(page.getByTestId('v-auto-layout-grid')).toHaveCSS('display', 'grid')
  })
}
