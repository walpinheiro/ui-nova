// VSegmentedControl e2e (Playwright). NOT executed by vitest: when this file is picked
// up by `vitest run`, only the placeholder suite below is registered. Under
// the Playwright runner (VITEST unset) the real browser tests run against the
// local validation harness at http://localhost:8321/VSegmentedControl.html
// (served from .val-harness/, see harness-server: `pnpm harness`).
export {}
const isVitest = typeof process !== 'undefined' && !!process.env.VITEST

if (isVitest) {
  const { describe, it, expect } = await import('vitest')
  describe('VSegmentedControl e2e (playwright only, skipped under vitest)', () => {
    it('placeholder', () => {
      expect(true).toBe(true)
    })
  })
} else {
  const { test, expect: pwExpect } = await import('@playwright/test')

  test('VSegmentedControl default renders with segmented tokens', async ({ page }) => {
    await page.goto('http://localhost:8321/VSegmentedControl.html')
    await page.waitForFunction(() => (window as unknown as { __ready?: boolean }).__ready === true)
    const control = page.getByTestId('v-segmented-control').first()
    await pwExpect(control).toBeVisible()
    await pwExpect(control).toHaveAttribute('role', 'radiogroup')
    await pwExpect(control).toHaveCSS('background-color', 'rgb(248, 250, 252)')
    await pwExpect(control).toHaveCSS('border-radius', '12px')
    await pwExpect(control.getByTestId('v-segmented-control-indicator')).toBeVisible()
  })

  test('VSegmentedControl pill and sizes render distinctly', async ({ page }) => {
    await page.goto('http://localhost:8321/VSegmentedControl.html')
    await page.waitForFunction(() => (window as unknown as { __ready?: boolean }).__ready === true)
    const pill = page.locator('#st-pill [data-test-id="v-segmented-control"]').first()
    await pwExpect(pill).toHaveAttribute('data-variant', 'pill')
    const sizes = page.locator('#st-sizes [data-test-id="v-segmented-control"]')
    const smallHeight = await sizes.nth(0).locator('[data-test-id="v-segmented-control-track"]').evaluate((el) => getComputedStyle(el).minHeight)
    const largeHeight = await sizes.nth(2).locator('[data-test-id="v-segmented-control-track"]').evaluate((el) => getComputedStyle(el).minHeight)
    pwExpect(smallHeight).toBe('28px')
    pwExpect(largeHeight).toBe('44px')
  })

  test('VSegmentedControl hover and focus-visible show interactive feedback', async ({ page }) => {
    await page.goto('http://localhost:8321/VSegmentedControl.html')
    await page.waitForFunction(() => (window as unknown as { __ready?: boolean }).__ready === true)
    const segment = page.locator('#st-text [data-test-id="v-segmented-control-segment-month"]')
    await segment.hover({ force: true })
    await page.waitForFunction(
      (selector) => {
        const el = document.querySelector(selector)
        if (!el) return false
        const bg = getComputedStyle(el).backgroundColor
        return bg !== 'rgba(0, 0, 0, 0)' && bg !== 'transparent'
      },
      '#st-text [data-test-id="v-segmented-control-segment-month"]',
    )
    const hoverBg = await segment.evaluate((el) => getComputedStyle(el).backgroundColor)
    pwExpect(hoverBg).toMatch(/238,\s*242,\s*255/)
    await segment.focus()
    await pwExpect(segment).toBeFocused()
    await pwExpect(segment).toHaveCSS('outline-width', '2px')
    await pwExpect(segment).toHaveCSS('outline-color', 'rgb(99, 102, 241)')
  })

  test('VSegmentedControl click and keyboard change selection with radio semantics', async ({ page }) => {
    await page.goto('http://localhost:8321/VSegmentedControl.html')
    await page.waitForFunction(() => (window as unknown as { __ready?: boolean }).__ready === true)
    const control = page.locator('#st-text [data-test-id="v-segmented-control"]').first()
    const day = control.getByRole('radio', { name: 'Day' })
    const week = control.getByRole('radio', { name: 'Week' })
    await pwExpect(day).toHaveAttribute('aria-checked', 'true')
    await week.click()
    await pwExpect(week).toHaveAttribute('aria-checked', 'true')
    await pwExpect(day).toHaveAttribute('aria-checked', 'false')
    await day.focus()
    await page.keyboard.press('ArrowRight')
    await pwExpect(week).toHaveAttribute('aria-checked', 'true')
    await pwExpect(week).toBeFocused()
  })

  test('VSegmentedControl disabled exposes aria-disabled', async ({ page }) => {
    await page.goto('http://localhost:8321/VSegmentedControl.html')
    await page.waitForFunction(() => (window as unknown as { __ready?: boolean }).__ready === true)
    const disabled = page.locator('#st-disabled [data-test-id="v-segmented-control"]').first()
    await pwExpect(disabled).toHaveAttribute('aria-disabled', 'true')
    await pwExpect(disabled).toHaveCSS('opacity', '0.5')
  })
}
