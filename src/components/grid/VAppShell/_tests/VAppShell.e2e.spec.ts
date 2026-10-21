export { }
const isVitest = typeof process !== 'undefined' && !!process.env.VITEST

if (isVitest) {
  const { describe, it, expect } = await import('vitest')
  describe('VAppShell e2e (playwright only)', () => {
    it('placeholder', () => expect(true).toBe(true))
  })
} else {
  const { test, expect: pwExpect } = await import('@playwright/test')

  test('VAppShell renders layout regions', async ({ page }) => {
    await page.goto('http://localhost:8321/VAppShell.html')
    await page.waitForFunction(() => (window as unknown as { __ready?: boolean }).__ready === true)
    await pwExpect(page.getByTestId('v-appshell')).toBeVisible()
    await pwExpect(page.getByTestId('v-appshell-content')).toBeVisible()
  })
}
