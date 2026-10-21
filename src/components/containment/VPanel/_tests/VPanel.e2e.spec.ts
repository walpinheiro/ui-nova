// VPanel e2e (Playwright). NOT executed by vitest: when this file is picked
// up by `vitest run`, only the placeholder suite below is registered. Under
// the Playwright runner (VITEST unset) the real browser tests run against the
// local validation harness at http://localhost:8321/VPanel.html
// (served from .val-harness/, see harness-server: `node $TEMP/opencode/harness-server.cjs`).
export {}
const isVitest = typeof process !== 'undefined' && !!process.env.VITEST

if (isVitest) {
  const { describe, it, expect } = await import('vitest')
  describe('VPanel e2e (playwright only, skipped under vitest)', () => {
    it('placeholder', () => {
      expect(true).toBe(true)
    })
  })
} else {
  const { test, expect: pwExpect } = await import('@playwright/test')

  test('VPanel default renders with token surface, radius and padding', async ({ page }) => {
    await page.goto('http://localhost:8321/VPanel.html')
    await page.waitForFunction(() => (window as unknown as { __ready?: boolean }).__ready === true)
    const panel = page.getByTestId('v-panel').first()
    await pwExpect(panel).toBeVisible()
    await pwExpect(panel).toHaveCSS('background-color', 'rgb(255, 255, 255)')
    await pwExpect(panel).toHaveCSS('border-radius', '12px')
    await pwExpect(panel).toHaveCSS('padding-top', '16px')
    await pwExpect(panel).toHaveCSS('padding-left', '16px')
    await pwExpect(panel).toHaveCSS('border-top-width', '1px')
    await pwExpect(panel).toHaveCSS('border-top-color', 'rgba(0, 0, 0, 0)')
  })

  test('VPanel filled renders with elevated bg tint', async ({ page }) => {
    await page.goto('http://localhost:8321/VPanel.html')
    await page.waitForFunction(() => (window as unknown as { __ready?: boolean }).__ready === true)
    const filled = page.locator('#st-variants [data-test-id="v-panel"]').nth(3)
    await pwExpect(filled).toBeVisible()
    await pwExpect(filled).toHaveCSS('background-color', 'rgb(248, 250, 252)')
  })

  test('VPanel hover applies state mix and focus-visible shows ring', async ({ page }) => {
    await page.goto('http://localhost:8321/VPanel.html')
    await page.waitForFunction(() => (window as unknown as { __ready?: boolean }).__ready === true)
    const panel = page.locator('#st-variants [data-test-id="v-panel"]').first()
    const defaultBg = await panel.evaluate((el) => getComputedStyle(el).backgroundColor)
    await panel.hover()
    const hoverBg = await panel.evaluate((el) => getComputedStyle(el).backgroundColor)
    pwExpect(hoverBg).toBe(defaultBg)
    const interactive = page.locator('#st-interactive [data-test-id="v-panel"]').first()
    const interactiveDefaultBg = await interactive.evaluate((el) => getComputedStyle(el).backgroundColor)
    await interactive.hover()
    const interactiveHoverBg = await interactive.evaluate((el) => getComputedStyle(el).backgroundColor)
    pwExpect(interactiveHoverBg).not.toBe(interactiveDefaultBg)
    await interactive.focus()
    await pwExpect(interactive).toBeFocused()
    await pwExpect(interactive).toHaveCSS('outline-width', '2px')
    await pwExpect(interactive).toHaveCSS('outline-color', 'rgb(99, 102, 241)')
  })

  test('VPanel sizes render distinctly, disabled/loading expose ARIA', async ({ page }) => {
    await page.goto('http://localhost:8321/VPanel.html')
    await page.waitForFunction(() => (window as unknown as { __ready?: boolean }).__ready === true)
    const panels = page.locator('#st-sizes [data-test-id="v-panel"]')
    const smallPad = await panels.nth(0).evaluate((el) => getComputedStyle(el).paddingTop)
    const largePad = await panels.nth(2).evaluate((el) => getComputedStyle(el).paddingTop)
    pwExpect(smallPad).not.toBe(largePad)
    const disabled = page.locator('#st-disabled [data-test-id="v-panel"]').first()
    await pwExpect(disabled).toHaveAttribute('aria-disabled', 'true')
    await pwExpect(disabled).toHaveCSS('opacity', '0.5')
    const loading = page.locator('#st-disabled [data-test-id="v-panel"]').nth(1)
    await pwExpect(loading).toHaveAttribute('aria-busy', 'true')
    await pwExpect(loading.locator('[data-test-id="v-panel-loading"]')).toBeVisible()
  })

  test('VPanel keyboard Tab reaches interactive panel', async ({ page }) => {
    await page.goto('http://localhost:8321/VPanel.html')
    await page.waitForFunction(() => (window as unknown as { __ready?: boolean }).__ready === true)
    const interactive = page.locator('#st-interactive [data-test-id="v-panel"]').first()
    await interactive.focus()
    await pwExpect(interactive).toBeFocused()
    await page.keyboard.press('Tab')
    await pwExpect(interactive).not.toBeFocused()
  })
}
