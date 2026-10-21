// VToolbar e2e (Playwright). NOT executed by vitest: when this file is picked
// up by `vitest run`, only the placeholder suite below is registered. Under
// the Playwright runner (VITEST unset) the real browser tests run against the
// local validation harness at http://localhost:8321/VToolbar.html
// (served from .val-harness/, see harness-server: `pnpm harness`).
export { }
const isVitest = typeof process !== 'undefined' && !!process.env.VITEST

if (isVitest) {
  const { describe, it, expect } = await import('vitest')
  describe('VToolbar e2e (playwright only, skipped under vitest)', () => {
    it('placeholder', () => {
      expect(true).toBe(true)
    })
  })
} else {
  const { test, expect: pwExpect } = await import('@playwright/test')

  test('VToolbar default renders with poster tokens (bg, radius, height)', async ({ page }) => {
    await page.goto('http://localhost:8321/VToolbar.html')
    await page.waitForFunction(() => (window as unknown as { __ready?: boolean }).__ready === true)
    const toolbar = page.getByTestId('v-toolbar').first()
    await pwExpect(toolbar).toBeVisible()
    await pwExpect(toolbar).toHaveCSS('background-color', 'rgb(255, 255, 255)')
    await pwExpect(toolbar).toHaveCSS('border-radius', '8px')
    await pwExpect(toolbar).toHaveCSS('min-height', '40px')
  })

  test('VToolbar variants render distinctly (compact/floating/editor)', async ({ page }) => {
    await page.goto('http://localhost:8321/VToolbar.html')
    await page.waitForFunction(() => (window as unknown as { __ready?: boolean }).__ready === true)
    for (const v of ['default', 'compact', 'floating', 'editor']) {
      await pwExpect(page.locator(`#st-variants [data-variant="${v}"]`).first()).toBeVisible()
    }
    const floating = page.locator('#st-variants [data-variant="floating"]').first()
    await pwExpect(floating).toHaveCSS('box-shadow', 'rgba(16, 24, 40, 0.1) 0px 4px 16px 0px')
  })

  test('VToolbar hover/focus on buttons and primary action styling', async ({ page }) => {
    await page.goto('http://localhost:8321/VToolbar.html')
    await page.waitForFunction(() => (window as unknown as { __ready?: boolean }).__ready === true)
    const undo = page.getByTestId('v-toolbar-button-undo').first()
    const box = await undo.boundingBox()
    pwExpect(box).toBeTruthy()
    await page.mouse.move(box!.x + box!.width / 2, box!.y + box!.height / 2)
    await pwExpect(undo).toHaveCSS('background-color', 'rgb(238, 242, 255)')
    const save = page.getByTestId('v-toolbar-primary-action').first()
    await pwExpect(save).toHaveCSS('background-color', 'rgb(99, 102, 241)')
    await undo.focus()
    await pwExpect(undo).toBeFocused()
    await pwExpect(undo).toHaveCSS('outline-width', '2px')
  })

  test('VToolbar sizes, disabled/loading and overflow menu', async ({ page }) => {
    await page.goto('http://localhost:8321/VToolbar.html')
    await page.waitForFunction(() => (window as unknown as { __ready?: boolean }).__ready === true)
    const toolbars = page.locator('#st-sizes [data-test-id="v-toolbar"]')
    const smallHeight = await toolbars.nth(0).evaluate((el) => getComputedStyle(el).minHeight)
    const largeHeight = await toolbars.nth(2).evaluate((el) => getComputedStyle(el).minHeight)
    pwExpect(smallHeight).toBe('32px')
    pwExpect(largeHeight).toBe('48px')
    const disabled = page.locator('#st-disabled [data-test-id="v-toolbar"]').first()
    await pwExpect(disabled).toHaveAttribute('aria-disabled', 'true')
    const loading = page.locator('#st-disabled [data-test-id="v-toolbar"]').nth(1)
    await pwExpect(loading).toHaveAttribute('aria-busy', 'true')
    await pwExpect(loading.locator('[data-test-id="v-toolbar-loader"]')).toBeVisible()
    await page.getByTestId('v-toolbar-overflow-trigger').first().click()
    await pwExpect(page.getByTestId('v-toolbar-overflow-menu')).toBeVisible()
    await pwExpect(page.getByTestId('v-toolbar-overflow-item-share')).toBeVisible()
  })

  test('VToolbar keyboard ArrowRight moves focus between buttons', async ({ page }) => {
    await page.goto('http://localhost:8321/VToolbar.html')
    await page.waitForFunction(() => (window as unknown as { __ready?: boolean }).__ready === true)
    const undo = page.getByTestId('v-toolbar-button-undo').first()
    await undo.focus()
    await pwExpect(undo).toBeFocused()
    await page.keyboard.press('ArrowRight')
    await pwExpect(page.getByTestId('v-toolbar-button-redo').first()).toBeFocused()
  })

  test('VToolbar exposes toolbar role with group divider spacer anatomy', async ({ page }) => {
    await page.goto('http://localhost:8321/VToolbar.html')
    await page.waitForFunction(() => (window as unknown as { __ready?: boolean }).__ready === true)
    const toolbar = page.locator('#st-variants [data-test-id="v-toolbar"]').first()
    await pwExpect(toolbar).toHaveAttribute('role', 'toolbar')
    await pwExpect(toolbar.locator('[data-test-id="v-toolbar-group"]')).toBeVisible()
    await pwExpect(toolbar.locator('[data-test-id="v-toolbar-divider"]')).toBeVisible()
    await pwExpect(toolbar.locator('[data-test-id="v-toolbar-spacer"]')).toHaveCount(1)
    await pwExpect(toolbar.locator('[data-test-id="v-toolbar-primary-action"]')).toContainText('Save')
  })
}
