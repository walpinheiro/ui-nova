// VPagination e2e (Playwright). NOT executed by vitest: when this file is picked
// up by `vitest run`, only the placeholder suite below is registered. Under
// the Playwright runner (VITEST unset) the real browser tests run against the
// local validation harness at http://localhost:8321/VPagination.html
// (served from .val-harness/, see harness-server: `pnpm harness`).
export {}
const isVitest = typeof process !== 'undefined' && !!process.env.VITEST

if (isVitest) {
  const { describe, it, expect } = await import('vitest')
  describe('VPagination e2e (playwright only, skipped under vitest)', () => {
    it('placeholder', () => {
      expect(true).toBe(true)
    })
  })
} else {
  const { test, expect: pwExpect } = await import('@playwright/test')

  test('VPagination default renders nav with page items', async ({ page }) => {
    await page.goto('http://localhost:8321/VPagination.html')
    await page.waitForFunction(() => (window as unknown as { __ready?: boolean }).__ready === true)
    const nav = page.locator('#st-default [data-test-id="v-pagination"]').first()
    await pwExpect(nav).toBeVisible()
    await pwExpect(nav).toHaveAttribute('aria-label', 'Pagination')
    await pwExpect(nav.locator('[data-test-id="v-pagination-page-3"]')).toHaveAttribute('aria-current', 'page')
    const controls = nav.locator('[data-test-id="v-pagination-controls"]')
    await pwExpect(controls).toHaveCSS('border-width', '1px')
  })

  test('VPagination ellipsis variant shows start and end ellipsis', async ({ page }) => {
    await page.goto('http://localhost:8321/VPagination.html')
    await page.waitForFunction(() => (window as unknown as { __ready?: boolean }).__ready === true)
    const nav = page.locator('#st-ellipsis [data-test-id="v-pagination"]').first()
    await pwExpect(nav.locator('[data-test-id="v-pagination-ellipsis"]')).toHaveCount(2)
    await pwExpect(nav.locator('[data-test-id="v-pagination-page-9"]')).toHaveAttribute('aria-current', 'page')
  })

  test('VPagination compact renders prev/next labels only', async ({ page }) => {
    await page.goto('http://localhost:8321/VPagination.html')
    await page.waitForFunction(() => (window as unknown as { __ready?: boolean }).__ready === true)
    const nav = page.locator('#st-compact [data-test-id="v-pagination"]').first()
    await pwExpect(nav.getByTestId('v-pagination-prev')).toContainText('Prev')
    await pwExpect(nav.getByTestId('v-pagination-next')).toContainText('Next')
    await pwExpect(nav.locator('[data-test-id^="v-pagination-page-"]')).toHaveCount(0)
  })

  test('VPagination page size and result count render inline', async ({ page }) => {
    await page.goto('http://localhost:8321/VPagination.html')
    await page.waitForFunction(() => (window as unknown as { __ready?: boolean }).__ready === true)
    const nav = page.locator('#st-page-size [data-test-id="v-pagination"]').first()
    await pwExpect(nav.getByTestId('v-pagination-page-size')).toBeVisible()
    await pwExpect(nav.locator('.v-dropdown-menu__trigger')).toBeVisible()
    await pwExpect(nav.getByTestId('v-pagination-result-count')).toContainText('Showing 21–30 of 240 results')
    await pwExpect(nav.locator('.v-pagination__toolbar--with-meta')).toHaveCSS('justify-content', 'space-between')
  })

  test('VPagination sizes render distinctly and active page uses primary bg', async ({ page }) => {
    await page.goto('http://localhost:8321/VPagination.html')
    await page.waitForFunction(() => (window as unknown as { __ready?: boolean }).__ready === true)
    const sections = page.locator('#st-sizes [data-test-id="v-pagination"]')
    const smallH = await sections.nth(0).locator('[data-test-id="v-pagination-page-3"]').evaluate((el) => getComputedStyle(el).height)
    const largeH = await sections.nth(2).locator('[data-test-id="v-pagination-page-3"]').evaluate((el) => getComputedStyle(el).height)
    pwExpect(smallH).not.toBe(largeH)
    pwExpect(smallH).toBe('28px')
    pwExpect(largeH).toBe('44px')
    const activeBg = await sections.nth(1).locator('[data-test-id="v-pagination-page-3"]').evaluate((el) => getComputedStyle(el).backgroundColor)
    pwExpect(activeBg).toBe('rgb(79, 70, 229)')
  })

  test('VPagination boundary pages disable prev/next appropriately', async ({ page }) => {
    await page.goto('http://localhost:8321/VPagination.html')
    await page.waitForFunction(() => (window as unknown as { __ready?: boolean }).__ready === true)
    const first = page.locator('#st-boundary [data-test-id="v-pagination"]').first()
    await pwExpect(first.getByTestId('v-pagination-prev')).toBeDisabled()
    const last = page.locator('#st-boundary [data-test-id="v-pagination"]').nth(1)
    await pwExpect(last.getByTestId('v-pagination-next')).toBeDisabled()
  })

  test('VPagination hover and focus-visible on controls', async ({ page }) => {
    await page.goto('http://localhost:8321/VPagination.html')
    await page.waitForFunction(() => (window as unknown as { __ready?: boolean }).__ready === true)
    const prev = page.locator('#st-default [data-test-id="v-pagination-prev"]').first()
    await prev.hover()
    const hoverBg = await prev.evaluate((el) => getComputedStyle(el).backgroundColor)
    pwExpect(hoverBg).not.toBe('rgb(255, 255, 255)')
    await prev.focus()
    await pwExpect(prev).toBeFocused()
    await pwExpect(prev).toHaveCSS('outline-width', '2px')
    await pwExpect(prev).toHaveCSS('outline-color', 'rgb(99, 102, 241)')
  })

  test('VPagination keyboard navigation changes page', async ({ page }) => {
    await page.goto('http://localhost:8321/VPagination.html')
    await page.waitForFunction(() => (window as unknown as { __ready?: boolean }).__ready === true)
    const page4 = page.locator('#st-default [data-test-id="v-pagination-page-4"]').first()
    await page4.focus()
    await page.keyboard.press('Enter')
    await pwExpect(page.locator('#st-default [data-test-id="v-pagination-page-4"]')).toHaveAttribute('aria-current', 'page')
    const prev = page.locator('#st-default [data-test-id="v-pagination-prev"]').first()
    await prev.focus()
    await page.keyboard.press('ArrowRight')
    await pwExpect(page.locator('#st-default [data-test-id="v-pagination-page-5"]')).toHaveAttribute('aria-current', 'page')
  })

  test('VPagination disabled and loading expose ARIA and visual state', async ({ page }) => {
    await page.goto('http://localhost:8321/VPagination.html')
    await page.waitForFunction(() => (window as unknown as { __ready?: boolean }).__ready === true)
    const disabled = page.locator('#st-disabled [data-test-id="v-pagination"]').first()
    await pwExpect(disabled).toHaveAttribute('aria-disabled', 'true')
    await pwExpect(disabled).toHaveAttribute('data-state', 'disabled')
    await pwExpect(disabled).toHaveClass(/v-pagination--disabled/)
    const loading = page.locator('#st-disabled [data-test-id="v-pagination"]').nth(1)
    await pwExpect(loading).toHaveAttribute('aria-busy', 'true')
    await pwExpect(loading).toHaveAttribute('data-state', 'loading')
    await pwExpect(loading).toHaveClass(/v-pagination--loading/)
    await pwExpect(loading.locator('[data-test-id="v-pagination-loader"]')).toBeVisible()
  })
}
