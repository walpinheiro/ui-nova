export { }
const isVitest = typeof process !== 'undefined' && !!process.env.VITEST

if (isVitest) {
  const { describe, it, expect } = await import('vitest')
  describe('VMasonryGrid e2e (playwright only)', () => {
    it('placeholder', () => expect(true).toBe(true))
  })
} else {
  const { test, expect: pwExpect } = await import('@playwright/test')

  test('VMasonryGrid renders column layout', async ({ page }) => {
    await page.goto('http://localhost:8321/VMasonryGrid.html')
    await page.waitForFunction(() => (window as unknown as { __ready?: boolean }).__ready === true)
    await pwExpect(page.getByTestId('masonry-grid')).toBeVisible()
  })
}
