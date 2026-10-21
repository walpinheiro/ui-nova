// VSidebar e2e (Playwright). NOT executed by vitest: when this file is picked
// up by `vitest run`, only the placeholder suite below is registered. Under
// the Playwright runner (VITEST unset) the real browser tests run against the
// local validation harness at http://localhost:8321/VSidebar.html
// (served from .val-harness/, see harness-server: `pnpm harness`).
export { }
const isVitest = typeof process !== 'undefined' && !!process.env.VITEST

if (isVitest) {
  const { describe, it, expect } = await import('vitest')
  describe('VSidebar e2e (playwright only, skipped under vitest)', () => {
    it('placeholder', () => {
      expect(true).toBe(true)
    })
  })
} else {
  const { test, expect: pwExpect } = await import('@playwright/test')

  test('VSidebar default renders with poster width, brand and active item', async ({ page }) => {
    await page.goto('http://localhost:8321/VSidebar.html')
    await page.waitForFunction(() => (window as unknown as { __ready?: boolean }).__ready === true)
    const sidebar = page.locator('#st-default [data-test-id="v-sidebar"]').first()
    await pwExpect(sidebar).toBeVisible()
    await pwExpect(sidebar).toHaveCSS('width', '240px')
    await pwExpect(page.locator('#st-default [data-test-id="v-sidebar-brand"]')).toContainText('VueUI Nova')
    await pwExpect(page.locator('#st-default [data-test-id="v-sidebar-nav-item-dashboard"]')).toHaveAttribute('aria-current', 'page')
  })

  test('VSidebar sizes render distinctly (rail/standard/wide)', async ({ page }) => {
    await page.goto('http://localhost:8321/VSidebar.html')
    await page.waitForFunction(() => (window as unknown as { __ready?: boolean }).__ready === true)
    await pwExpect(page.locator('#st-sizes [data-size="sm"]').first()).toHaveCSS('width', '64px')
    await pwExpect(page.locator('#st-sizes [data-size="md"]').first()).toHaveCSS('width', '240px')
    await pwExpect(page.locator('#st-sizes [data-size="lg"]').first()).toHaveCSS('width', '320px')
  })

  test('VSidebar collapse toggle switches to icon-only rail', async ({ page }) => {
    await page.goto('http://localhost:8321/VSidebar.html')
    await page.waitForFunction(() => (window as unknown as { __ready?: boolean }).__ready === true)
    const sidebar = page.locator('#st-interactive [data-test-id="v-sidebar"]').first()
    await pwExpect(sidebar).toHaveAttribute('data-collapsed', 'false')
    await page.locator('#st-interactive [data-test-id="v-sidebar-collapse-toggle"]').click()
    await pwExpect(sidebar).toHaveAttribute('data-collapsed', 'true')
    await pwExpect(sidebar).toHaveCSS('width', '64px')
    await pwExpect(sidebar.locator('.v-sidebar__brand-name')).toHaveCount(0)
  })

  test('VSidebar hover and focus-visible show interactive states', async ({ page }) => {
    await page.goto('http://localhost:8321/VSidebar.html')
    await page.waitForFunction(() => (window as unknown as { __ready?: boolean }).__ready === true)
    const item = page.locator('#st-interactive [data-test-id="v-sidebar-nav-item-analytics"]').first()
    await item.hover()
    await pwExpect(item).toHaveCSS('background-color', 'rgb(245, 248, 255)')
    await item.focus()
    await pwExpect(item).toBeFocused()
    await pwExpect(item).toHaveCSS('outline-width', '2px')
  })

  test('VSidebar nested section toggles children and keyboard selects item', async ({ page }) => {
    await page.goto('http://localhost:8321/VSidebar.html')
    await page.waitForFunction(() => (window as unknown as { __ready?: boolean }).__ready === true)
    const team = page.locator('#st-interactive [data-test-id="v-sidebar-nav-item-team"]').first()
    await team.click()
    await pwExpect(page.locator('#st-interactive [data-test-id="v-sidebar-nested-child-overview"]')).toHaveCount(0)
    await team.click()
    await pwExpect(page.locator('#st-interactive [data-test-id="v-sidebar-nested-child-overview"]')).toBeVisible()
    const members = page.locator('#st-interactive [data-test-id="v-sidebar-nav-item-members"]').first()
    await members.click()
    await pwExpect(members).toHaveAttribute('aria-current', 'page')
  })

  test('VSidebar disabled exposes ARIA and user area renders poster defaults', async ({ page }) => {
    await page.goto('http://localhost:8321/VSidebar.html')
    await page.waitForFunction(() => (window as unknown as { __ready?: boolean }).__ready === true)
    const disabled = page.locator('#st-states [data-test-id="v-sidebar"]').first()
    await pwExpect(disabled).toHaveAttribute('aria-disabled', 'true')
    await pwExpect(disabled).toHaveCSS('opacity', '0.5')
    const user = page.locator('#st-default [data-test-id="v-sidebar-user-area"]').first()
    await pwExpect(user).toContainText('Alex Chen')
    await pwExpect(user).toContainText('alex@nova.dev')
  })

  // Storybook-driven (http://localhost:6006): only the nav scrolls.
  test('VSidebar MultiLevel: nav scrolls while header and footer stay visible', async ({ page }) => {
    await page.setViewportSize({ width: 1100, height: 760 })
    await page.goto('http://localhost:6006/iframe.html?id=navigation-vsidebar--multi-level&viewMode=story')
    const nav = page.locator('[data-test-id="v-sidebar-nav"]')
    await nav.waitFor()
    const metrics = await nav.evaluate((el) => ({ scrollHeight: el.scrollHeight, clientHeight: el.clientHeight }))
    pwExpect(metrics.scrollHeight).toBeGreaterThan(metrics.clientHeight)

    const aside = page.locator('[data-test-id="v-sidebar"]')
    const asideHeight = await aside.evaluate((el) => el.getBoundingClientRect().height)
    pwExpect(asideHeight).toBeLessThanOrEqual(640)

    await nav.evaluate((el) => { el.scrollTop = 0 })
    const before = await nav.evaluate((el) => el.scrollTop)
    await nav.hover()
    await page.mouse.wheel(0, 400)
    await page.waitForTimeout(250)
    const after = await nav.evaluate((el) => el.scrollTop)
    pwExpect(after).toBeGreaterThan(before)

    await pwExpect(page.locator('[data-test-id="v-sidebar-brand"]')).toBeInViewport()
    await pwExpect(page.locator('[data-test-id="v-sidebar-search"]')).toBeInViewport()
    await pwExpect(page.locator('[data-test-id="v-sidebar-user-area"]')).toBeInViewport()
    await pwExpect(aside).toBeInViewport()
    await pwExpect(nav).toHaveAttribute('data-scroll-top', 'false')

    // The sidebar itself (and the page) never scrolls.
    pwExpect(await aside.evaluate((el) => el.scrollTop)).toBe(0)
    pwExpect(await page.evaluate(() => window.scrollY)).toBe(0)
  })
}
