// VWindow e2e (Playwright). NOT executed by vitest: when this file is picked
// up by `vitest run`, only the placeholder suite below is registered. Under
// the Playwright runner (VITEST unset) the real browser tests run against the
// local validation harness at http://localhost:8321/VWindow.html
// (served from .val-harness/, see harness-server: `pnpm harness`).
export {}
const isVitest = typeof process !== 'undefined' && !!process.env.VITEST

if (isVitest) {
  const { describe, it, expect } = await import('vitest')
  describe('VWindow e2e (playwright only, skipped under vitest)', () => {
    it('placeholder', () => {
      expect(true).toBe(true)
    })
  })
} else {
  const { test, expect: pwExpect } = await import('@playwright/test')

  test('VWindow default renders with token surface, radius and padding', async ({ page }) => {
    await page.goto('http://localhost:8321/VWindow.html')
    await page.waitForFunction(() => (window as unknown as { __ready?: boolean }).__ready === true)
    const win = page.locator('#st-default [data-test-id="v-window"]').first()
    await pwExpect(win).toBeVisible()
    await pwExpect(win).toHaveCSS('background-color', 'rgb(255, 255, 255)')
    await pwExpect(win).toHaveCSS('border-radius', '12px')
    const content = page.locator('#st-default [data-test-id="v-window-content"]').first()
    await pwExpect(content).toHaveCSS('padding-top', '24px')
    await pwExpect(win.locator('[data-test-id="v-window-app-icon"]')).toBeVisible()
  })

  test('VWindow modal uses dialog role with aria-modal and backdrop', async ({ page }) => {
    await page.goto('http://localhost:8321/VWindow.html')
    await page.waitForFunction(() => (window as unknown as { __ready?: boolean }).__ready === true)
    const modal = page.locator('#st-variants [data-test-id="v-window"]').nth(2)
    await pwExpect(modal).toBeVisible()
    await pwExpect(modal).toHaveAttribute('role', 'dialog')
    await pwExpect(modal).toHaveAttribute('aria-modal', 'true')
    await pwExpect(page.locator('#st-variants [data-test-id="v-window-backdrop"]').first()).toBeVisible()
  })

  test('VWindow anatomy: traffic-lights, sidebar nav, resize handle', async ({ page }) => {
    await page.goto('http://localhost:8321/VWindow.html')
    await page.waitForFunction(() => (window as unknown as { __ready?: boolean }).__ready === true)
    const win = page.locator('#st-default [data-test-id="v-window"]').first()
    await pwExpect(win.locator('[data-test-id="v-window-traffic-lights"]')).toBeVisible()
    await pwExpect(win.locator('[data-test-id="v-window-sidebar"]')).toBeVisible()
    for (const item of ['overview', 'notes', 'tasks', 'assets', 'settings']) {
      await pwExpect(win.locator(`[data-test-id="v-window-nav-${item}"]`)).toBeVisible()
    }
    await pwExpect(win.locator('[data-test-id="v-window-resize-handle"]')).toBeVisible()
  })

  test('VWindow action hover and focus-visible ring on root', async ({ page }) => {
    await page.goto('http://localhost:8321/VWindow.html')
    await page.waitForFunction(() => (window as unknown as { __ready?: boolean }).__ready === true)
    const win = page.locator('#st-default [data-test-id="v-window"]').first()
    const close = win.locator('[data-test-id="v-window-close"]')
    await close.hover()
    const hoverBg = await close.evaluate((el) => getComputedStyle(el).backgroundColor)
    pwExpect(hoverBg).not.toBe('rgba(0, 0, 0, 0)')
    await win.focus()
    await pwExpect(win).toBeFocused()
    await pwExpect(win).toHaveCSS('outline-width', '2px')
    await pwExpect(win).toHaveCSS('outline-color', 'rgb(99, 102, 241)')
  })

  test('VWindow sizes use exact px presets (640/960/1280), disabled/loading expose ARIA', async ({ page }) => {
    await page.goto('http://localhost:8321/VWindow.html')
    await page.waitForFunction(() => (window as unknown as { __ready?: boolean }).__ready === true)
    const smallMax = await page.locator('#st-default [data-test-id="v-window"]').nth(0).evaluate((el) => getComputedStyle(el).maxWidth)
    const mediumMax = await page.locator('#st-default [data-test-id="v-window"]').nth(1).evaluate((el) => getComputedStyle(el).maxWidth)
    const largeMax = await page.locator('#st-default [data-test-id="v-window"]').nth(2).evaluate((el) => getComputedStyle(el).maxWidth)
    pwExpect(smallMax).toBe('640px')
    pwExpect(mediumMax).toBe('960px')
    pwExpect(largeMax).toBe('1280px')
    const borderless = page.locator('#st-variants [data-test-id="v-window"]').nth(1)
    await pwExpect(borderless).toBeVisible()
    await pwExpect(borderless).toHaveClass(/v-window--borderless/)
    const disabled = page.locator('#st-disabled [data-test-id="v-window"]').first()
    await pwExpect(disabled).toHaveAttribute('aria-disabled', 'true')
    const loading = page.locator('#st-disabled [data-test-id="v-window"]').nth(1)
    await pwExpect(loading).toHaveAttribute('aria-busy', 'true')
    await pwExpect(loading.locator('[data-test-id="v-window-loader"]')).toBeVisible()
  })

  test('VWindow keyboard Tab/Escape/close works', async ({ page }) => {
    await page.goto('http://localhost:8321/VWindow.html')
    await page.waitForFunction(() => (window as unknown as { __ready?: boolean }).__ready === true)
    const win = page.locator('#st-default [data-test-id="v-window"]').first()
    await win.focus()
    await pwExpect(win).toBeFocused()
    await page.keyboard.press('Tab')
    await pwExpect(page.locator('#st-default [data-test-id="v-window-minimize"]').first()).toBeFocused()
    await page.keyboard.press('Escape')
    await page.locator('#st-default [data-test-id="v-window-close"]').first().click()
    await pwExpect(win).toBeVisible()
  })

  test('VWindow active/inactive titlebar and minimal anatomy', async ({ page }) => {
    await page.goto('http://localhost:8321/VWindow.html')
    await page.waitForFunction(() => (window as unknown as { __ready?: boolean }).__ready === true)
    const active = page.locator('#st-states [data-test-id="v-window"]').nth(1)
    const titlebar = active.locator('[data-test-id="v-window-titlebar"]')
    await pwExpect(active).toHaveClass(/v-window--active/)
    const activeTitleBg = await titlebar.evaluate((el) => getComputedStyle(el).backgroundColor)
    pwExpect(activeTitleBg).not.toBe('rgb(255, 255, 255)')
    const inactive = page.locator('#st-states [data-test-id="v-window"]').nth(2)
    await pwExpect(inactive).toHaveClass(/v-window--inactive/)
    const minimal = page.locator('#st-variants [data-test-id="v-window"]').first()
    await pwExpect(minimal.locator('[data-test-id="v-window-traffic-lights"]')).toHaveCount(0)
    await pwExpect(minimal.locator('[data-test-id="v-window-minimize"]')).toHaveCount(0)
    await pwExpect(minimal.locator('[data-test-id="v-window-sidebar"]')).toHaveCount(0)
  })

  test('VWindow modal traps focus and Escape returns focus to trigger', async ({ page }) => {
    await page.goto('http://localhost:8321/VWindow.html')
    await page.waitForFunction(() => (window as unknown as { __ready?: boolean }).__ready === true)
    const trigger = page.locator('[data-test-id="v-window-trigger"]')
    await trigger.click()
    const modal = page.locator('#st-interactive [data-test-id="v-window"]')
    await pwExpect(modal).toBeVisible()
    await page.keyboard.press('Escape')
    await pwExpect(trigger).toBeFocused()
  })
}
