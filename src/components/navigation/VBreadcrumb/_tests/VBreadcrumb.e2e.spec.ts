// VBreadcrumb e2e (Playwright). NOT executed by vitest: when this file is picked
// up by `vitest run`, only the placeholder suite below is registered. Under
// the Playwright runner (VITEST unset) the real browser tests run against the
// local validation harness at http://localhost:8321/VBreadcrumb.html
// (served from .val-harness/, see harness-server: `pnpm harness`).
export {}
const isVitest = typeof process !== 'undefined' && !!process.env.VITEST

if (isVitest) {
  const { describe, it, expect } = await import('vitest')
  describe('VBreadcrumb e2e (playwright only, skipped under vitest)', () => {
    it('placeholder', () => {
      expect(true).toBe(true)
    })
  })
} else {
  const { test, expect: pwExpect } = await import('@playwright/test')

  test('VBreadcrumb default renders nav landmark, home icon and current page', async ({ page }) => {
    await page.goto('http://localhost:8321/VBreadcrumb.html')
    await page.waitForFunction(() => (window as unknown as { __ready?: boolean }).__ready === true)
    const nav = page.locator('#st-default [data-test-id="v-breadcrumb"]').first()
    await pwExpect(nav).toBeVisible()
    await pwExpect(nav).toHaveAttribute('aria-label', 'Breadcrumb')
    await pwExpect(nav.locator('[data-test-id="v-breadcrumb-home-icon"]')).toBeVisible()
    await pwExpect(nav.locator('[data-test-id="v-breadcrumb-current"]')).toHaveAttribute('aria-current', 'page')
    await pwExpect(nav.locator('[data-test-id="v-breadcrumb-current"]')).toHaveCSS('font-weight', '600')
  })

  test('VBreadcrumb compact hides home icon and sizes differ', async ({ page }) => {
    await page.goto('http://localhost:8321/VBreadcrumb.html')
    await page.waitForFunction(() => (window as unknown as { __ready?: boolean }).__ready === true)
    const compact = page.locator('#st-compact [data-test-id="v-breadcrumb"]').first()
    await pwExpect(compact.locator('[data-test-id="v-breadcrumb-home-icon"]')).toHaveCount(0)
    const small = page.locator('#st-sizes [data-test-id="v-breadcrumb"]').nth(0)
    const large = page.locator('#st-sizes [data-test-id="v-breadcrumb"]').nth(2)
    const smallSize = await small.evaluate((el) => getComputedStyle(el).fontSize)
    const largeSize = await large.evaluate((el) => getComputedStyle(el).fontSize)
    pwExpect(smallSize).not.toBe(largeSize)
  })

  test('VBreadcrumb focus-visible shows ring on links', async ({ page }) => {
    await page.goto('http://localhost:8321/VBreadcrumb.html')
    await page.waitForFunction(() => (window as unknown as { __ready?: boolean }).__ready === true)
    const link = page.locator('#st-default [data-test-id="v-breadcrumb-link"]').first()
    await link.focus()
    await pwExpect(link).toBeFocused()
    await pwExpect(link).toHaveCSS('outline-width', '2px')
    await pwExpect(link).toHaveCSS('outline-color', 'rgb(99, 102, 241)')
  })

  test('VBreadcrumb overflow opens menu with motion and keyboard escape', async ({ page }) => {
    await page.goto('http://localhost:8321/VBreadcrumb.html')
    await page.waitForFunction(() => (window as unknown as { __ready?: boolean }).__ready === true)
    const overflowBtn = page.locator('#st-overflow [data-test-id="v-breadcrumb-overflow"]').first()
    await overflowBtn.click()
    const menu = page.locator('[data-test-id="v-breadcrumb-overflow-menu"]').first()
    await pwExpect(menu).toBeVisible()
    await page.keyboard.press('Escape')
    await pwExpect(menu).toHaveCount(0)
  })

}
