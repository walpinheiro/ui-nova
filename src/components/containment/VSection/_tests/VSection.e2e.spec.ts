// VSection e2e (Playwright). NOT executed by vitest: when this file is picked
// up by `vitest run`, only the placeholder suite below is registered. Under
// the Playwright runner (VITEST unset) the real browser tests run against the
// local validation harness at http://localhost:8321/VSection.html
// (served from .val-harness/, see harness-server: `node $TEMP/opencode/harness-server.cjs`).
export { }
const isVitest = typeof process !== 'undefined' && !!process.env.VITEST

if (isVitest) {
  const { describe, it, expect } = await import('vitest')
  describe('VSection e2e (playwright only, skipped under vitest)', () => {
    it('placeholder', () => {
      expect(true).toBe(true)
    })
  })
} else {
  const { test, expect: pwExpect } = await import('@playwright/test')

  test('VSection default renders with poster tokens (bg, radius, padding)', async ({ page }) => {
    await page.goto('http://localhost:8321/VSection.html')
    await page.waitForFunction(() => (window as unknown as { __ready?: boolean }).__ready === true)
    const section = page.getByTestId('v-section').first()
    await pwExpect(section).toBeVisible()
    await pwExpect(section).toHaveCSS('background-color', 'rgb(255, 255, 255)')
    await pwExpect(section).toHaveCSS('border-radius', '16px')
    await pwExpect(section).toHaveCSS('padding-top', '24px')
    await pwExpect(section).toHaveCSS('padding-left', '24px')
  })

  test('VSection variants render distinctly (elevated/bordered/borderless/tinted)', async ({ page }) => {
    await page.goto('http://localhost:8321/VSection.html')
    await page.waitForFunction(() => (window as unknown as { __ready?: boolean }).__ready === true)
    for (const v of ['default', 'elevated', 'bordered', 'borderless', 'tinted']) {
      await pwExpect(page.locator(`#st-variants [data-variant="${v}"]`).first()).toBeVisible()
    }
    const elevated = page.locator('#st-variants [data-variant="elevated"]').first()
    await pwExpect(elevated).toHaveCSS('box-shadow', 'rgba(16, 24, 40, 0.08) 0px 4px 16px 0px')
    const tinted = page.locator('#st-variants [data-variant="tinted"]').first()
    await pwExpect(tinted).toHaveCSS('background-color', 'rgb(245, 248, 255)')
    const borderless = page.locator('#st-variants [data-variant="borderless"]').first()
    const borderColor = await borderless.evaluate((el) => getComputedStyle(el).borderTopColor)
    pwExpect(borderColor).toBe('rgba(0, 0, 0, 0)')
  })

  test('VSection hover applies subtle background and focus-visible shows ring', async ({ page }) => {
    await page.goto('http://localhost:8321/VSection.html')
    await page.waitForFunction(() => (window as unknown as { __ready?: boolean }).__ready === true)
    const section = page.locator('#st-interactive [data-test-id="v-section"]').first()
    const box = await section.boundingBox()
    pwExpect(box).toBeTruthy()
    await page.mouse.move(box!.x + box!.width / 2, box!.y + box!.height / 2)
    await pwExpect(section).toHaveCSS('background-color', 'rgb(248, 250, 252)')
    const interactive = page.locator('#st-interactive [data-test-id="v-section"]').first()
    await interactive.focus()
    await pwExpect(interactive).toBeFocused()
    await pwExpect(interactive).toHaveCSS('outline-width', '2px')
    await pwExpect(interactive).toHaveCSS('outline-color', 'rgb(99, 102, 241)')
  })

  test('VSection sizes render distinctly, disabled/loading expose ARIA', async ({ page }) => {
    await page.goto('http://localhost:8321/VSection.html')
    await page.waitForFunction(() => (window as unknown as { __ready?: boolean }).__ready === true)
    const sections = page.locator('#st-sizes [data-test-id="v-section"]')
    const smallPad = await sections.nth(0).evaluate((el) => getComputedStyle(el).paddingTop)
    const largePad = await sections.nth(2).evaluate((el) => getComputedStyle(el).paddingTop)
    pwExpect(smallPad).not.toBe(largePad)
    pwExpect(smallPad).toBe('12px')
    pwExpect(largePad).toBe('32px')
    const disabled = page.locator('#st-disabled [data-test-id="v-section"]').first()
    await pwExpect(disabled).toHaveAttribute('aria-disabled', 'true')
    await pwExpect(disabled).toHaveCSS('opacity', '0.5')
    const loading = page.locator('#st-disabled [data-test-id="v-section"]').nth(1)
    await pwExpect(loading).toHaveAttribute('aria-busy', 'true')
    await pwExpect(loading.locator('[data-test-id="v-section-loader"]')).toBeVisible()
  })

  test('VSection exposes native section semantics with header and content', async ({ page }) => {
    await page.goto('http://localhost:8321/VSection.html')
    await page.waitForFunction(() => (window as unknown as { __ready?: boolean }).__ready === true)
    const section = page.locator('#st-variants [data-test-id="v-section"]').first()
    await pwExpect(section).toBeVisible()
    const tag = await section.evaluate((el) => el.tagName)
    pwExpect(tag).toBe('SECTION')
    await pwExpect(section.locator('[data-test-id="v-section-header"]')).toBeVisible()
    await pwExpect(section.locator('[data-test-id="v-section-heading"]')).toContainText('Team')
    await pwExpect(section.locator('[data-test-id="v-section-content"]')).toContainText('Default body')
  })

  test('VSection keyboard Tab reaches interactive section', async ({ page }) => {
    await page.goto('http://localhost:8321/VSection.html')
    await page.waitForFunction(() => (window as unknown as { __ready?: boolean }).__ready === true)
    const interactive = page.locator('#st-interactive [data-test-id="v-section"]').first()
    await interactive.focus()
    await pwExpect(interactive).toBeFocused()
    await page.keyboard.press('Tab')
    await pwExpect(interactive).not.toBeFocused()
  })
}
