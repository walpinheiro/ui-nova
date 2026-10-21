// VInspectorPanel e2e (Playwright). NOT executed by vitest: when this file is picked
// up by `vitest run`, only the placeholder suite below is registered. Under
// the Playwright runner (VITEST unset) the real browser tests run against the
// local validation harness at http://localhost:8321/VInspectorPanel.html
// (served from .val-harness/, see harness-server: `node scripts/val-harness-server.cjs`).
export {}
const isVitest = typeof process !== 'undefined' && !!process.env.VITEST

if (isVitest) {
  const { describe, it, expect } = await import('vitest')
  describe('VInspectorPanel e2e (playwright only, skipped under vitest)', () => {
    it('placeholder', () => {
      expect(true).toBe(true)
    })
  })
} else {
  const { test, expect: pwExpect } = await import('@playwright/test')

  test('VInspectorPanel default renders complementary panel with token width and radius', async ({ page }) => {
    await page.goto('http://localhost:8321/VInspectorPanel.html')
    await page.waitForFunction(() => (window as unknown as { __ready?: boolean }).__ready === true)
    const panel = page.locator('#st-default [data-test-id="v-inspector-panel"]').first()
    await pwExpect(panel).toBeVisible()
    await pwExpect(panel).toHaveAttribute('role', 'complementary')
    await pwExpect(panel).toHaveAttribute('data-size', 'default')
    await pwExpect(panel).toHaveCSS('background-color', 'rgb(255, 255, 255)')
    await pwExpect(panel).toHaveCSS('border-radius', '16px')
    await pwExpect(panel).toHaveCSS('width', '360px')
  })

  test('VInspectorPanel variants render distinct tab sets', async ({ page }) => {
    await page.goto('http://localhost:8321/VInspectorPanel.html')
    await page.waitForFunction(() => (window as unknown as { __ready?: boolean }).__ready === true)
    await pwExpect(page.locator('#docs-inspector-variant-default [data-test-id="v-inspector-panel-tab-interactions"]')).toBeVisible()
    await pwExpect(page.locator('#docs-inspector-variant-minimal [data-test-id="v-inspector-panel-tab-interactions"]')).toHaveCount(0)
    await pwExpect(page.locator('#docs-inspector-variant-tabs [data-test-id="v-inspector-panel-tab-meta"]')).toBeVisible()
    await pwExpect(page.locator('#docs-inspector-variant-floating [data-test-id="v-inspector-panel-tabs"]')).toHaveCount(0)
  })

  test('VInspectorPanel sizes render distinct widths', async ({ page }) => {
    await page.goto('http://localhost:8321/VInspectorPanel.html')
    await page.waitForFunction(() => (window as unknown as { __ready?: boolean }).__ready === true)
    const compact = await page.locator('#docs-inspector-size-compact [data-test-id="v-inspector-panel"]').evaluate((el) => getComputedStyle(el).width)
    const defaultWidth = await page.locator('#docs-inspector-size-default [data-test-id="v-inspector-panel"]').evaluate((el) => getComputedStyle(el).width)
    const wide = await page.locator('#docs-inspector-size-wide [data-test-id="v-inspector-panel"]').evaluate((el) => getComputedStyle(el).width)
    pwExpect(compact).toBe('320px')
    pwExpect(defaultWidth).toBe('360px')
    pwExpect(wide).toBe('440px')
    pwExpect(parseFloat(compact)).toBeLessThan(parseFloat(defaultWidth))
    pwExpect(parseFloat(defaultWidth)).toBeLessThan(parseFloat(wide))
  })

  test('VInspectorPanel tabs, sections, hover row and focus field work', async ({ page }) => {
    await page.goto('http://localhost:8321/VInspectorPanel.html')
    await page.waitForFunction(() => (window as unknown as { __ready?: boolean }).__ready === true)
    const panel = page.locator('#st-interactive [data-test-id="v-inspector-panel"]')
    await page.locator('#st-interactive [data-test-id="v-inspector-panel-tab-styles"]').click()
    await pwExpect(page.locator('#st-interactive [data-test-id="v-inspector-panel-tab-styles"]')).toHaveAttribute('aria-selected', 'true')
    const layout = page.locator('#st-interactive [data-test-id="v-inspector-panel-section-layout"] button')
    await layout.click()
    await pwExpect(page.locator('#st-interactive [data-test-id="v-inspector-panel-section-layout"]')).toHaveAttribute('data-expanded', 'true')
    const row = page.locator('#st-interactive [data-test-id="v-inspector-panel-field-label"]')
    await row.hover()
    const hoverBg = await row.evaluate((el) => getComputedStyle(el).backgroundColor)
    pwExpect(hoverBg).not.toBe('rgba(0, 0, 0, 0)')
    const field = page.locator('#st-interactive [data-test-id="v-inspector-panel-field-label"] input')
    await field.focus()
    await pwExpect(field).toBeFocused()
    await pwExpect(field).toHaveCSS('outline-width', '2px')
    await pwExpect(field).toHaveCSS('outline-color', 'rgb(99, 102, 241)')
  })

  test('VInspectorPanel loading, disabled and collapsed group states expose ARIA', async ({ page }) => {
    await page.goto('http://localhost:8321/VInspectorPanel.html')
    await page.waitForFunction(() => (window as unknown as { __ready?: boolean }).__ready === true)
    const loading = page.locator('#docs-inspector-state-loading [data-test-id="v-inspector-panel"]')
    await pwExpect(loading).toHaveAttribute('aria-busy', 'true')
    await pwExpect(loading.locator('[data-test-id="v-inspector-panel-skeleton"]')).toBeVisible()
    const disabled = page.locator('#docs-inspector-state-disabled [data-test-id="v-inspector-panel"]')
    await pwExpect(disabled).toHaveAttribute('aria-disabled', 'true')
    await pwExpect(disabled).toHaveCSS('opacity', '0.5')
    const collapsed = page.locator('#docs-inspector-state-collapsed-group [data-test-id="v-inspector-panel-section-general"]')
    await pwExpect(collapsed).toHaveAttribute('data-expanded', 'false')
  })

  test('VInspectorPanel Escape closes and returns focus to trigger', async ({ page }) => {
    await page.goto('http://localhost:8321/VInspectorPanel.html')
    await page.waitForFunction(() => (window as unknown as { __ready?: boolean }).__ready === true)
    const trigger = page.getByTestId('v-inspector-panel-trigger')
    await page.locator('#st-interactive [data-test-id="v-inspector-panel-close"]').click()
    await pwExpect(page.locator('#st-interactive [data-test-id="v-inspector-panel"]')).toHaveAttribute('data-open', 'false')
    await trigger.click()
    await pwExpect(page.locator('#st-interactive [data-test-id="v-inspector-panel"]')).toHaveAttribute('data-open', 'true')
    await page.locator('#st-interactive [data-test-id="v-inspector-panel"]').focus()
    await page.keyboard.press('Escape')
    await pwExpect(page.locator('#st-interactive [data-test-id="v-inspector-panel"]')).toHaveAttribute('data-open', 'false')
    await pwExpect(trigger).toBeFocused()
  })

  test('VInspectorPanel close button is keyboard-focusable with visible ring', async ({ page }) => {
    await page.goto('http://localhost:8321/VInspectorPanel.html')
    await page.waitForFunction(() => (window as unknown as { __ready?: boolean }).__ready === true)
    const close = page.locator('#st-interactive [data-test-id="v-inspector-panel-close"]')
    await close.focus()
    await pwExpect(close).toBeFocused()
    await pwExpect(close).toHaveCSS('outline-width', '2px')
    await pwExpect(close).toHaveCSS('outline-color', 'rgb(99, 102, 241)')
  })
}
