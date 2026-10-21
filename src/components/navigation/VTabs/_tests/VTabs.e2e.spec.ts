// VTabs e2e (Playwright). NOT executed by vitest: when this file is picked
// up by `vitest run`, only the placeholder suite below is registered. Under
// the Playwright runner (VITEST unset) the real browser tests run against the
// local validation harness at http://localhost:8321/VTabs.html
// (served from .val-harness/, see harness-server: `node $TEMP/opencode/harness-server.cjs`).
export {}
const isVitest = typeof process !== 'undefined' && !!process.env.VITEST

if (isVitest) {
  const { describe, it, expect } = await import('vitest')
  describe('VTabs e2e (playwright only, skipped under vitest)', () => {
    it('placeholder', () => {
      expect(true).toBe(true)
    })
  })
} else {
  const { test, expect: pwExpect } = await import('@playwright/test')

  test('VTabs underline renders tablist with indicator and muted labels', async ({ page }) => {
    await page.goto('http://localhost:8321/VTabs.html')
    await page.waitForFunction(() => (window as unknown as { __ready?: boolean }).__ready === true)
    const tabs = page.locator('#st-variants [data-variant="underline"]').first()
    await pwExpect(tabs).toBeVisible()
    await pwExpect(tabs.locator('[data-test-id="v-tabs-list"]')).toHaveAttribute('role', 'tablist')
    await pwExpect(tabs.locator('[data-test-id="v-tabs-indicator"]')).toBeVisible()
    const active = tabs.getByRole('tab', { name: 'Overview' })
    await pwExpect(active).toHaveAttribute('aria-selected', 'true')
    await pwExpect(active).toHaveCSS('color', 'rgb(79, 70, 229)')
    await pwExpect(tabs.locator('[data-test-id="v-tabs-indicator"]')).toHaveCSS('height', '2px')
  })

  test('VTabs pill variant renders elevated track and active white label', async ({ page }) => {
    await page.goto('http://localhost:8321/VTabs.html')
    await page.waitForFunction(() => (window as unknown as { __ready?: boolean }).__ready === true)
    const pill = page.locator('#st-variants [data-variant="pill"]').first()
    await pwExpect(pill).toBeVisible()
    const active = pill.getByRole('tab', { name: 'General' })
    await pwExpect(active).toHaveCSS('color', 'rgb(255, 255, 255)')
    const list = pill.locator('[data-test-id="v-tabs-list"]')
    await pwExpect(list).toHaveCSS('background-color', 'rgb(248, 250, 252)')
  })

  test('VTabs hover applies tint and focus-visible shows ring', async ({ page }) => {
    await page.goto('http://localhost:8321/VTabs.html')
    await page.waitForFunction(() => (window as unknown as { __ready?: boolean }).__ready === true)
    const tabs = page.locator('#st-variants [data-variant="underline"]').first()
    const features = tabs.getByRole('tab', { name: 'Features' })
    await features.hover()
    await pwExpect(features).toHaveCSS('background-color', 'rgb(245, 248, 255)')
    await features.focus()
    await pwExpect(features).toBeFocused()
    await pwExpect(features).toHaveCSS('outline-width', '2px')
    await pwExpect(features).toHaveCSS('outline-color', 'rgb(99, 102, 241)')
  })

  test('VTabs sizes render distinct heights and disabled tabs are not interactive', async ({ page }) => {
    await page.goto('http://localhost:8321/VTabs.html')
    await page.waitForFunction(() => (window as unknown as { __ready?: boolean }).__ready === true)
    const sections = page.locator('#st-sizes [data-test-id="v-tabs"]')
    const smallHeight = await sections.nth(0).getByRole('tab').first().evaluate((el) => getComputedStyle(el).height)
    const largeHeight = await sections.nth(2).getByRole('tab').first().evaluate((el) => getComputedStyle(el).height)
    pwExpect(smallHeight).toBe('32px')
    pwExpect(largeHeight).toBe('48px')
    const disabled = page.locator('#st-states [data-test-id="v-tabs"]').nth(1)
    await pwExpect(disabled.getByRole('tab', { name: 'Overview' })).toHaveAttribute('aria-disabled', 'true')
  })

  test('VTabs keyboard arrows change selection with tab semantics', async ({ page }) => {
    await page.goto('http://localhost:8321/VTabs.html')
    await page.waitForFunction(() => (window as unknown as { __ready?: boolean }).__ready === true)
    const tabs = page.locator('#st-variants [data-variant="underline"]').first()
    const first = tabs.getByRole('tab', { name: 'Overview' })
    await first.focus()
    await pwExpect(first).toHaveAttribute('aria-selected', 'true')
    const second = tabs.getByRole('tab', { name: 'Features' })
    await page.keyboard.press('ArrowRight')
    await pwExpect(second).toHaveAttribute('aria-selected', 'true')
    await pwExpect(second).toBeFocused()
    await page.keyboard.press('ArrowLeft')
    await pwExpect(first).toHaveAttribute('aria-selected', 'true')
    await pwExpect(tabs.locator('[data-test-id="v-tabs-panel-overview"]')).toBeVisible()
  })

  test('VTabs overflow exposes menu control when tabs do not fit', async ({ page }) => {
    await page.goto('http://localhost:8321/VTabs.html')
    await page.waitForFunction(() => (window as unknown as { __ready?: boolean }).__ready === true)
    const overflow = page.locator('#st-overflow [data-test-id="v-tabs-overflow"]').first()
    await pwExpect(overflow).toBeVisible()
    await pwExpect(overflow).toHaveAttribute('aria-label', 'More tabs')
    await overflow.click()
    await pwExpect(page.locator('[data-test-id="v-tabs-overflow-menu"]').first()).toBeVisible()
  })
}
