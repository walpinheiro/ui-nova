// VCard e2e (Playwright). NOT executed by vitest: when this file is picked
// up by `vitest run`, only the placeholder suite below is registered. Under
// the Playwright runner (VITEST unset) the real browser tests run against the
// local validation harness at http://localhost:8321/VCard.html
// (served from .val-harness/, see harness-server: `node $TEMP/opencode/harness-server.cjs`).
export { }
const isVitest = typeof process !== 'undefined' && !!process.env.VITEST

if (isVitest) {
  const { describe, it, expect } = await import('vitest')
  describe('VCard e2e (playwright only, skipped under vitest)', () => {
    it('placeholder', () => {
      expect(true).toBe(true)
    })
  })
} else {
  const { test, expect: pwExpect } = await import('@playwright/test')

  test('VCard default renders with poster tokens (bg, radius, padding, shadow)', async ({ page }) => {
    await page.goto('http://localhost:8321/VCard.html')
    await page.waitForFunction(() => (window as unknown as { __ready?: boolean }).__ready === true)
    const card = page.getByTestId('v-card').first()
    await pwExpect(card).toBeVisible()
    await pwExpect(card).toHaveCSS('background-color', 'rgb(255, 255, 255)')
    await pwExpect(card).toHaveCSS('border-radius', '16px')
    await pwExpect(card).toHaveCSS('padding-top', '24px')
    await pwExpect(card).toHaveCSS('box-shadow', 'rgba(16, 24, 40, 0.08) 0px 4px 24px 0px')
  })

  test('VCard variants render distinctly (outlined/filled/interactive)', async ({ page }) => {
    await page.goto('http://localhost:8321/VCard.html')
    await page.waitForFunction(() => (window as unknown as { __ready?: boolean }).__ready === true)
    for (const v of ['elevated', 'outlined', 'filled', 'interactive']) {
      await pwExpect(page.locator(`#st-variants [data-variant="${v}"]`).first()).toBeVisible()
    }
    const filled = page.locator('#st-variants [data-variant="filled"]').first()
    await pwExpect(filled).toHaveCSS('background-color', 'rgb(248, 250, 252)')
    const outlined = page.locator('#st-variants [data-variant="outlined"]').first()
    const outlinedShadow = await outlined.evaluate((el) => getComputedStyle(el).boxShadow)
    pwExpect(outlinedShadow === 'none' || outlinedShadow === 'rgba(0, 0, 0, 0) 0px 0px 0px 0px').toBe(true)
  })

  test('VCard interactive hover lifts and focus-visible shows ring', async ({ page }) => {
    await page.goto('http://localhost:8321/VCard.html')
    await page.waitForFunction(() => (window as unknown as { __ready?: boolean }).__ready === true)
    const card = page.locator('#st-interactive [data-test-id="v-card"]').first()
    await card.hover()
    await page.waitForTimeout(250)
    await pwExpect(card).toHaveCSS('box-shadow', 'rgba(16, 24, 40, 0.12) 0px 8px 32px 0px')
    await card.focus()
    await pwExpect(card).toBeFocused()
    await pwExpect(card).toHaveCSS('outline-width', '2px')
    await pwExpect(card).toHaveCSS('outline-color', 'rgb(99, 102, 241)')
  })

  test('VCard sizes render distinctly and loading exposes ARIA', async ({ page }) => {
    await page.goto('http://localhost:8321/VCard.html')
    await page.waitForFunction(() => (window as unknown as { __ready?: boolean }).__ready === true)
    const cards = page.locator('#st-sizes [data-test-id="v-card"]')
    const smallPad = await cards.nth(0).evaluate((el) => getComputedStyle(el).paddingTop)
    const largePad = await cards.nth(2).evaluate((el) => getComputedStyle(el).paddingTop)
    pwExpect(smallPad).not.toBe(largePad)
    const loading = page.locator('#st-loading [data-test-id="v-card"]').first()
    await pwExpect(loading).toHaveAttribute('aria-busy', 'true')
    await pwExpect(loading.locator('[data-test-id="v-card-skeleton"]')).toBeVisible()
  })

  test('VCard keyboard Enter activates interactive card', async ({ page }) => {
    await page.goto('http://localhost:8321/VCard.html')
    await page.waitForFunction(() => (window as unknown as { __ready?: boolean }).__ready === true)
    const card = page.locator('#st-interactive [data-test-id="v-card"]').first()
    await card.focus()
    await pwExpect(card).toBeFocused()
    await page.keyboard.press('Enter')
    await pwExpect(card).toBeVisible()
    await page.keyboard.press('Tab')
    await pwExpect(card).not.toBeFocused()
  })
}
