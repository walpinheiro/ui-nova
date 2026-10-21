// VBadge e2e (Playwright). NOT executed by vitest: when this file is picked
// up by `vitest run`, only the placeholder suite below is registered. Under
// the Playwright runner (VITEST unset) the real browser tests run against the
// local validation harness at http://localhost:8321/VBadge.html
// (served from .val-harness/, see harness-server: `pnpm harness`).
export { }
const isVitest = typeof process !== 'undefined' && !!process.env.VITEST

if (isVitest) {
  const { describe, it, expect } = await import('vitest')
  describe('VBadge e2e (playwright only, skipped under vitest)', () => {
    it('placeholder', () => {
      expect(true).toBe(true)
    })
  })
} else {
  const { test, expect: pwExpect } = await import('@playwright/test')

  test('VBadge hero renders poster examples with stable anatomy', async ({ page }) => {
    await page.goto('http://localhost:8321/VBadge.html')
    await page.waitForFunction(() => (window as unknown as { __ready?: boolean }).__ready === true)
    await pwExpect(page.getByTestId('badge-status-new')).toBeVisible()
    await pwExpect(page.getByTestId('badge-status-new').getByTestId('badge-label')).toHaveText('New')
    await pwExpect(page.getByTestId('badge-status-beta').getByTestId('badge-label')).toHaveText('Beta')
    await pwExpect(page.getByTestId('badge-status-active')).toHaveClass(/v-badge--success/)
    await pwExpect(page.getByTestId('badge-status-warning').getByTestId('badge-icon').getByTestId('v-icon')).toBeVisible()
    await pwExpect(page.getByTestId('badge-status-count').getByTestId('badge-count')).toHaveText('12')
    await pwExpect(page.getByTestId('badge-status-online').getByTestId('badge-dot')).toBeVisible()
    await pwExpect(page.getByTestId('badge-status-pro').getByTestId('badge-icon').getByTestId('v-icon')).toBeVisible()
  })

  test('VBadge variants expose semantic surfaces and pill geometry', async ({ page }) => {
    await page.goto('http://localhost:8321/VBadge.html')
    await page.waitForFunction(() => (window as unknown as { __ready?: boolean }).__ready === true)
    const neutral = page.locator('#st-variants .v-badge--neutral').first()
    const success = page.locator('#st-variants .v-badge--success').first()
    const outlined = page.locator('#st-variants .v-badge--outlined').first()
    const radius = await neutral.evaluate((el) => getComputedStyle(el).borderRadius)
    pwExpect(['50%', '9999px']).toContain(radius)
    await pwExpect(success).toHaveCSS('background-color', 'rgb(209, 250, 229)')
    await pwExpect(outlined).toHaveCSS('background-color', 'rgba(0, 0, 0, 0)')
    await pwExpect(outlined).toHaveCSS('color', 'rgb(79, 70, 229)')
  })

  test('VBadge sizes scale typography', async ({ page }) => {
    await page.goto('http://localhost:8321/VBadge.html')
    await page.waitForFunction(() => (window as unknown as { __ready?: boolean }).__ready === true)
    const xs = page.locator('#st-sizes .v-badge--xs').first()
    const lg = page.locator('#st-sizes .v-badge--lg').first()
    const xsSize = await xs.evaluate((el) => getComputedStyle(el).fontSize)
    const lgSize = await lg.evaluate((el) => getComputedStyle(el).fontSize)
    pwExpect(xsSize).not.toBe(lgSize)
  })

  test('VBadge interactive badge is keyboard accessible with focus ring', async ({ page }) => {
    await page.goto('http://localhost:8321/VBadge.html')
    await page.waitForFunction(() => (window as unknown as { __ready?: boolean }).__ready === true)
    const badge = page.getByTestId('badge-interactive')
    await pwExpect(badge).toHaveRole('button')
    await badge.focus()
    await pwExpect(badge).toBeFocused()
    await pwExpect(badge).toHaveAttribute('aria-pressed', 'false')
    await pwExpect(badge).toHaveCSS('outline-width', '2px')
    await pwExpect(badge).toHaveCSS('outline-color', 'rgb(99, 102, 241)')
    await page.keyboard.press('Enter')
    await pwExpect(badge).toHaveAttribute('aria-pressed', 'true')
    await pwExpect(badge).toHaveClass(/v-badge--selected/)
    await page.keyboard.press('Space')
    await pwExpect(badge).toHaveAttribute('aria-pressed', 'false')
  })

  test('VBadge states expose disabled and loading semantics', async ({ page }) => {
    await page.goto('http://localhost:8321/VBadge.html')
    await page.waitForFunction(() => (window as unknown as { __ready?: boolean }).__ready === true)
    const disabled = page.locator('#st-states [data-test-id="badge"][aria-disabled="true"]').first()
    const loading = page.locator('#st-states [data-test-id="badge"][aria-busy="true"]').first()
    await pwExpect(disabled).toBeVisible()
    await pwExpect(loading.getByTestId('badge-loader')).toBeVisible()
  })
}
