// VDropdownMenu e2e (Playwright). NOT executed by vitest: when this file is picked
// up by `vitest run`, only the placeholder suite below is registered. Under
// the Playwright runner (VITEST unset) the real browser tests run against the
// local validation harness at http://localhost:8321/VDropdownMenu.html
// (served from .val-harness/, see harness-server: `node scripts/val-harness-server.cjs`).
export {}
const isVitest = typeof process !== 'undefined' && !!process.env.VITEST

if (isVitest) {
  const { describe, it, expect } = await import('vitest')
  describe('VDropdownMenu e2e (playwright only, skipped under vitest)', () => {
    it('placeholder', () => {
      expect(true).toBe(true)
    })
  })
} else {
  const { test, expect: pwExpect } = await import('@playwright/test')

  test('VDropdownMenu default trigger renders with poster tokens', async ({ page }) => {
    await page.goto('http://localhost:8321/VDropdownMenu.html')
    await page.waitForFunction(() => (window as unknown as { __ready?: boolean }).__ready === true)
    const trigger = page.locator('#st-variants [data-variant="secondary"] [data-test-id="dropdown-trigger"]').first()
    await pwExpect(trigger).toBeVisible()
    await pwExpect(trigger).toHaveCSS('border-radius', '12px')
    await pwExpect(trigger).toHaveCSS('padding-left', '16px')
    await pwExpect(trigger).toHaveCSS('min-height', '40px')
    await pwExpect(trigger).toHaveAttribute('aria-haspopup', 'menu')
  })

  test('VDropdownMenu primary/ghost/destructive variants render distinctly', async ({ page }) => {
    await page.goto('http://localhost:8321/VDropdownMenu.html')
    await page.waitForFunction(() => (window as unknown as { __ready?: boolean }).__ready === true)
    const primary = page.locator('#st-variants [data-variant="primary"] [data-test-id="dropdown-trigger"]').first()
    await pwExpect(primary).toHaveCSS('background-color', 'rgb(79, 70, 229)')
    await pwExpect(primary).toHaveCSS('color', 'rgb(255, 255, 255)')
    const ghost = page.locator('#st-variants [data-variant="ghost"] [data-test-id="dropdown-trigger"]').first()
    const ghostBg = await ghost.evaluate((el) => getComputedStyle(el).backgroundColor)
    pwExpect(['rgba(0, 0, 0, 0)', 'transparent'].some((v) => ghostBg === v)).toBe(true)
    const destructive = page.locator('#st-variants [data-variant="destructive"] [data-test-id="dropdown-trigger"]').first()
    await pwExpect(destructive).toHaveCSS('color', 'rgb(185, 28, 28)')
  })

  test('VDropdownMenu opens menu with shadow, radius and item height', async ({ page }) => {
    await page.goto('http://localhost:8321/VDropdownMenu.html')
    await page.waitForFunction(() => (window as unknown as { __ready?: boolean }).__ready === true)
    const menu = page.locator('#st-open [data-test-id="dropdown-menu"]').first()
    await pwExpect(menu).toBeVisible()
    await pwExpect(menu).toHaveCSS('min-width', '200px')
    await pwExpect(menu).toHaveCSS('border-radius', '8px')
    await pwExpect(menu).toHaveCSS('box-shadow', 'rgba(0, 0, 0, 0.08) 0px 8px 24px 0px')
    const item = page.locator('#st-open [data-test-id="dropdown-item-view"]').first()
    await pwExpect(item).toHaveCSS('min-height', '36px')
    await pwExpect(item).toHaveCSS('padding-left', '16px')
  })

  test('VDropdownMenu focus-visible and sizes render distinctly', async ({ page }) => {
    await page.goto('http://localhost:8321/VDropdownMenu.html')
    await page.waitForFunction(() => (window as unknown as { __ready?: boolean }).__ready === true)
    const trigger = page.locator('#st-hover [data-test-id="dropdown-trigger"]').first()
    await trigger.focus()
    await pwExpect(trigger).toBeFocused()
    await pwExpect(trigger).toHaveCSS('outline-width', '2px')
    await pwExpect(trigger).toHaveCSS('outline-color', 'rgb(99, 102, 241)')
    const sm = page.locator('#st-sizes [data-size="sm"] [data-test-id="dropdown-trigger"]').first()
    const lg = page.locator('#st-sizes [data-size="lg"] [data-test-id="dropdown-trigger"]').first()
    await pwExpect(sm).toHaveCSS('min-height', '32px')
    await pwExpect(lg).toHaveCSS('min-height', '48px')
  })

  test('VDropdownMenu keyboard opens with Enter and renders items', async ({ page }) => {
    await page.goto('http://localhost:8321/VDropdownMenu.html')
    await page.waitForFunction(() => (window as unknown as { __ready?: boolean }).__ready === true)
    const trigger = page.locator('#st-keyboard [data-test-id="dropdown-trigger"]').first()
    const menu = page.locator('#st-keyboard [data-test-id="dropdown-menu"]')
    await trigger.focus()
    await page.keyboard.press('Enter')
    await pwExpect(menu).toBeVisible()
    await pwExpect(trigger).toHaveAttribute('aria-expanded', 'true')
    await pwExpect(page.locator('#st-keyboard [data-test-id="dropdown-item-view"]')).toBeVisible()
    await pwExpect(page.locator('#st-keyboard [data-test-id="dropdown-item-destructive"]')).toBeVisible()
  })

  test('VDropdownMenu disabled/loading expose ARIA and destructive item is marked', async ({ page }) => {
    await page.goto('http://localhost:8321/VDropdownMenu.html')
    await page.waitForFunction(() => (window as unknown as { __ready?: boolean }).__ready === true)
    const disabled = page.locator('#st-disabled [data-test-id="dropdown-trigger"]').first()
    await pwExpect(disabled).toHaveAttribute('aria-disabled', 'true')
    const loading = page.locator('#st-disabled [data-test-id="dropdown-trigger"]').nth(1)
    await pwExpect(loading).toHaveAttribute('aria-busy', 'true')
    await pwExpect(page.locator('#st-open [data-test-id="dropdown-item-destructive"]')).toBeVisible()
    await pwExpect(page.locator('#st-open [data-test-id="dropdown-separator"]')).toBeVisible()
  })
}
