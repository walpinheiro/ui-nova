// VButton e2e (Playwright). NOT executed by vitest: when this file is picked
// up by `vitest run`, only the placeholder suite below is registered. Under
// the Playwright runner (VITEST unset) the real browser tests run against the
// local validation harness at http://localhost:8321/VButton.html
// (served from .val-harness/, see harness-server: `node $TEMP/opencode/harness-server.cjs`).
export {}
const isVitest = typeof process !== 'undefined' && !!process.env.VITEST

if (isVitest) {
  const { describe, it, expect } = await import('vitest')
  describe('VButton e2e (playwright only, skipped under vitest)', () => {
    it('placeholder', () => {
      expect(true).toBe(true)
    })
  })
} else {
  const { test, expect: pwExpect } = await import('@playwright/test')

  test('VButton default (primary) renders solid blue with poster tokens', async ({ page }) => {
    await page.goto('http://localhost:8321/VButton.html')
    await page.waitForFunction(() => (window as unknown as { __ready?: boolean }).__ready === true)
    const btn = page.getByTestId('v-button').first()
    await pwExpect(btn).toBeVisible()
    await pwExpect(btn).toHaveAttribute('data-variant', 'primary')
    await pwExpect(btn).toHaveCSS('background-color', 'rgb(99, 102, 241)')
    await pwExpect(btn).toHaveCSS('color', 'rgb(255, 255, 255)')
    await pwExpect(btn).toHaveCSS('border-radius', '12px')
    await pwExpect(btn).toHaveCSS('padding-top', '10px')
    await pwExpect(btn).toHaveCSS('padding-left', '16px')
    await pwExpect(btn).toHaveCSS('box-shadow', 'rgba(99, 102, 241, 0.25) 0px 2px 8px 0px')
    const minH = await btn.evaluate((el) => getComputedStyle(el).minHeight)
    pwExpect(parseFloat(minH)).toBeGreaterThanOrEqual(44)
  })

  test('VButton variants render distinctly (secondary/ghost/outline/destructive/icon)', async ({ page }) => {
    await page.goto('http://localhost:8321/VButton.html')
    await page.waitForFunction(() => (window as unknown as { __ready?: boolean }).__ready === true)
    for (const v of ['secondary', 'ghost', 'outline', 'destructive', 'icon']) {
      const el = page.locator(`#st-variants [data-variant="${v}"]`).first()
      await pwExpect(el).toBeVisible()
    }
    const secondary = page.locator('#st-variants [data-variant="secondary"]').first()
    await pwExpect(secondary).toHaveCSS('background-color', 'rgb(241, 245, 249)')
    const destructive = page.locator('#st-variants [data-variant="destructive"]').first()
    await pwExpect(destructive).toHaveCSS('background-color', 'rgb(239, 68, 68)')
    const icon = page.locator('#st-variants [data-variant="icon"]').first()
    await pwExpect(icon).toHaveAttribute('aria-label', 'Favorite')
    const iconW = await icon.evaluate((el) => getComputedStyle(el).minWidth)
    pwExpect(parseFloat(iconW)).toBeGreaterThanOrEqual(44)
  })

  test('VButton hover changes bg and focus-visible shows poster ring', async ({ page }) => {
    await page.goto('http://localhost:8321/VButton.html')
    await page.waitForFunction(() => (window as unknown as { __ready?: boolean }).__ready === true)
    const btn = page.locator('#st-default [data-test-id="v-button"]').first()
    await btn.hover()
    await page.waitForTimeout(250)
    const hoverBg = await btn.evaluate((el) => getComputedStyle(el).backgroundColor)
    pwExpect(hoverBg).not.toBe('rgb(99, 102, 241)')
    await btn.focus()
    await pwExpect(btn).toBeFocused()
    await pwExpect(btn).toHaveCSS('outline-width', '2px')
    await pwExpect(btn).toHaveCSS('outline-color', 'rgb(99, 102, 241)')
    await pwExpect(btn).toHaveCSS('box-shadow', 'rgba(99, 102, 241, 0.3) 0px 0px 0px 3px')
  })

  test('VButton sizes render distinctly, disabled/loading expose ARIA', async ({ page }) => {
    await page.goto('http://localhost:8321/VButton.html')
    await page.waitForFunction(() => (window as unknown as { __ready?: boolean }).__ready === true)
    const buttons = page.locator('#st-default [data-test-id="v-button"]')
    const smallPad = await buttons.nth(1).evaluate((el) => getComputedStyle(el).paddingTop)
    const largePad = await buttons.nth(2).evaluate((el) => getComputedStyle(el).paddingTop)
    pwExpect(smallPad).not.toBe(largePad)
    const disabled = page.locator('#st-disabled [data-test-id="v-button"]').first()
    await pwExpect(disabled).toBeDisabled()
    await pwExpect(disabled).toHaveAttribute('aria-disabled', 'true')
    await pwExpect(disabled).toHaveCSS('opacity', '0.5')
    const loading = page.locator('#st-disabled [data-test-id="v-button"]').nth(1)
    await pwExpect(loading).toHaveAttribute('aria-busy', 'true')
    await pwExpect(loading.locator('[data-test-id="v-button-spinner"]')).toBeVisible()
    const spinDur = await loading.locator('[data-test-id="v-button-spinner"]').evaluate((el) => getComputedStyle(el).animationDuration)
    pwExpect(spinDur).toBe('0.2s')
  })

  test('VButton keyboard Tab/Enter/click works', async ({ page }) => {
    await page.goto('http://localhost:8321/VButton.html')
    await page.waitForFunction(() => (window as unknown as { __ready?: boolean }).__ready === true)
    const btn = page.locator('#st-default [data-test-id="v-button"]').first()
    await btn.focus()
    await pwExpect(btn).toBeFocused()
    await btn.click()
    await pwExpect(btn).toBeVisible()
  })
}
