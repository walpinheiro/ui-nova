export {}
const isVitest = typeof process !== 'undefined' && !!process.env.VITEST

if (isVitest) {
  const { describe, it, expect } = await import('vitest')
  describe('VBanner e2e (playwright only, skipped under vitest)', () => {
    it('placeholder', () => {
      expect(true).toBe(true)
    })
  })
} else {
  const { test, expect } = await import('@playwright/test')

  const harness = 'http://127.0.0.1:8321/VBanner.html'

  async function openBannerHarness(page: import('@playwright/test').Page) {
    await page.goto(harness)
    await page.waitForFunction(() => (window as unknown as { __ready?: boolean }).__ready === true)
  }

  test.describe('VBanner', () => {
    test('renders the reference anatomy and token-backed default styling', async ({ page }) => {
      await openBannerHarness(page)
      const banner = page.locator('.case-default [data-test-id="v-banner"]')

      await expect(banner).toBeVisible()
      await expect(banner).toHaveAttribute('role', 'status')
      await expect(banner).toHaveAttribute('data-variant', 'info')
      await expect(banner).toHaveAttribute('data-size', 'md')
      await expect(banner.locator('[data-test-id="v-banner-icon"] [data-test-id="v-icon"]')).toBeVisible()
      await expect(banner.locator('[data-test-id="v-banner-title"]')).toHaveText('New version available')
      await expect(banner.locator('[data-test-id="v-banner-description"]')).toContainText('performance improvements')
      await expect(banner.locator('[data-test-id="v-banner-actions"]')).toBeVisible()
      await expect(banner.getByRole('button', { name: 'Dismiss banner' })).toBeVisible()
      await expect(banner).toHaveCSS('background-color', 'rgb(248, 250, 255)')
      await expect(banner).toHaveCSS('border-radius', '12px')
      await expect(banner).toHaveCSS('padding-top', '12px')
    })

    test('renders every variant with semantic roles and distinct state styling', async ({ page }) => {
      await openBannerHarness(page)

      for (const variant of ['info', 'success', 'warning', 'error', 'neutral']) {
        await expect(page.locator(`.case-variant-${variant} [data-test-id="v-banner"]`)).toBeVisible()
      }

      await expect(page.locator('.case-variant-warning [data-test-id="v-banner"]')).toHaveAttribute('role', 'alert')
      await expect(page.locator('.case-variant-error [data-test-id="v-banner"]')).toHaveAttribute('role', 'alert')
      await expect(page.locator('.case-variant-success [data-test-id="v-banner"]')).toHaveCSS('background-color', 'rgb(209, 250, 229)')
    })

    test('supports focus-visible action, Escape dismissal and disabled/loading states', async ({ page }) => {
      await openBannerHarness(page)

      const action = page.locator('.case-action [data-test-id="v-banner-actions"] button')
      await action.focus()
      await expect(action).toBeFocused()
      await expect(action).toHaveCSS('outline-width', '2px')

      await page.keyboard.press('Escape')
      await expect(page.locator('.case-action [data-test-id="v-banner-dismissed-placeholder"]')).toBeVisible()

      const disabled = page.locator('.case-disabled [data-test-id="v-banner"]')
      await expect(disabled).toHaveCSS('opacity', '0.5')
      await expect(disabled.getByTestId('v-banner-dismiss')).toBeDisabled()

      const loading = page.locator('.case-loading [data-test-id="v-banner"]')
      await expect(loading).toHaveAttribute('aria-busy', 'true')
      await expect(loading.getByTestId('v-banner-loader')).toHaveAttribute('role', 'status')
    })

    test('keeps the banner usable without horizontal overflow on narrow viewports', async ({ page }) => {
      await page.setViewportSize({ width: 360, height: 800 })
      await openBannerHarness(page)

      const banner = page.locator('.case-default [data-test-id="v-banner"]')
      await expect(banner).toBeVisible()
      await expect(banner.locator('[data-test-id="v-banner-title"]')).toBeVisible()
      await expect(banner.getByRole('button', { name: 'Dismiss banner' })).toBeVisible()
      const viewport = await page.evaluate(() => ({
        viewport: document.documentElement.clientWidth,
        content: document.documentElement.scrollWidth,
      }))
      expect(viewport.content).toBeLessThanOrEqual(viewport.viewport)
    })

    test('disables non-essential motion when reduced motion is requested', async ({ page }) => {
      await page.emulateMedia({ reducedMotion: 'reduce' })
      await openBannerHarness(page)

      const banner = page.locator('.case-default [data-test-id="v-banner"]')
      await expect(banner).toHaveCSS('transition-duration', '0s')
      const loading = page.locator('.case-loading [data-test-id="v-banner-loader"]')
      await expect(loading).toHaveCSS('animation-duration', '0s')
    })
  })
}
