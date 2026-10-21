// VTreeNavigation e2e (Playwright). NOT executed by vitest.
// Local validation harness: http://localhost:8321/VTreeNavigation.html
export { }
const isVitest = typeof process !== 'undefined' && !!process.env.VITEST

if (isVitest) {
  const { describe, it, expect } = await import('vitest')
  describe('VTreeNavigation e2e (playwright only, skipped under vitest)', () => {
    it('placeholder', () => {
      expect(true).toBe(true)
    })
  })
} else {
  const { test, expect: pwExpect } = await import('@playwright/test')

  test('VTreeNavigation renders tree with poster tokens', async ({ page }) => {
    await page.goto('http://localhost:8321/VTreeNavigation.html')
    await page.waitForFunction(() => (window as unknown as { __ready?: boolean }).__ready === true)
    const tree = page.locator('#st-hero [data-test-id="tree-navigation"]')
    await pwExpect(tree).toBeVisible()
    await pwExpect(tree).toHaveAttribute('role', 'tree')
    await pwExpect(tree).toHaveCSS('background-color', 'rgb(255, 255, 255)')
    await pwExpect(tree).toHaveCSS('border-radius', '12px')
  })

  test('VTreeNavigation hero tree shows workspace, nested nodes and count badges', async ({ page }) => {
    await page.goto('http://localhost:8321/VTreeNavigation.html')
    await page.waitForFunction(() => (window as unknown as { __ready?: boolean }).__ready === true)
    const hero = page.locator('#st-hero')
    await pwExpect(hero.getByTestId('tree-node--workspace')).toBeVisible()
    await pwExpect(hero.getByTestId('tree-node--vueui-nova')).toBeVisible()
    await pwExpect(hero.getByTestId('tree-node--workspace').getByTestId('tree-node-count')).toHaveText('12')
  })

  test('VTreeNavigation selected node has indicator and selected background', async ({ page }) => {
    await page.goto('http://localhost:8321/VTreeNavigation.html')
    await page.waitForFunction(() => (window as unknown as { __ready?: boolean }).__ready === true)
    const selected = page.locator('#st-hero [data-test-id="tree-node--vueui-nova"]')
    await pwExpect(selected).toHaveAttribute('aria-selected', 'true')
    await pwExpect(selected).toHaveCSS('background-color', 'rgb(238, 242, 255)')
    await pwExpect(selected).toHaveCSS('border-left-color', 'rgb(79, 70, 229)')
  })

  test('VTreeNavigation variants and sizes render distinctly', async ({ page }) => {
    await page.goto('http://localhost:8321/VTreeNavigation.html')
    await page.waitForFunction(() => (window as unknown as { __ready?: boolean }).__ready === true)
    for (const v of ['file', 'settings', 'simple']) {
      await pwExpect(page.locator(`[data-variant="${v}"]`).first()).toBeVisible()
    }
    const sizes = page.locator('#st-sizes [data-test-id="tree-navigation"]')
    const smallHeight = await sizes.nth(0).locator('[data-test-id^="tree-node--"]').first().evaluate((el) => getComputedStyle(el).minHeight)
    const largeHeight = await sizes.nth(2).locator('[data-test-id^="tree-node--"]').first().evaluate((el) => getComputedStyle(el).minHeight)
    pwExpect(smallHeight).toBe('28px')
    pwExpect(largeHeight).toBe('44px')
  })

  test('VTreeNavigation toggle expands and collapses branch', async ({ page }) => {
    await page.goto('http://localhost:8321/VTreeNavigation.html')
    await page.waitForFunction(() => (window as unknown as { __ready?: boolean }).__ready === true)
    const hero = page.locator('#st-hero')
    const workspace = hero.getByTestId('tree-node--workspace')
    await pwExpect(workspace).toHaveAttribute('aria-expanded', 'true')
    await hero.getByTestId('tree-node-toggle--workspace').click()
    await pwExpect(hero.getByTestId('tree-node--projects')).toBeHidden()
    await hero.getByTestId('tree-node-toggle--workspace').click()
    await pwExpect(hero.getByTestId('tree-node--projects')).toBeVisible()
  })

  test('VTreeNavigation keyboard navigation and focus ring', async ({ page }) => {
    await page.goto('http://localhost:8321/VTreeNavigation.html')
    await page.waitForFunction(() => (window as unknown as { __ready?: boolean }).__ready === true)
    const home = page.locator('#st-interaction [data-test-id="tree-node--home"]')
    await home.focus()
    await pwExpect(home).toBeFocused()
    await page.keyboard.press('ArrowDown')
    await pwExpect(page.locator('#st-interaction [data-test-id="tree-node--about"]')).toBeFocused()
    await page.keyboard.press('Enter')
    await pwExpect(page.locator('#st-interaction [data-test-id="tree-node--about"]')).toHaveAttribute('aria-selected', 'true')
  })

  test('VTreeNavigation disabled and loading expose ARIA', async ({ page }) => {
    await page.goto('http://localhost:8321/VTreeNavigation.html')
    await page.waitForFunction(() => (window as unknown as { __ready?: boolean }).__ready === true)
    const disabled = page.locator('#st-disabled [data-test-id="tree-navigation"]').first()
    await pwExpect(disabled).toHaveAttribute('aria-disabled', 'true')
    await pwExpect(disabled).toHaveCSS('opacity', '0.5')
    const loading = page.locator('#st-disabled [data-test-id="tree-navigation"]').nth(1)
    await pwExpect(loading).toHaveAttribute('aria-busy', 'true')
    await pwExpect(loading.getByTestId('tree-navigation-loader')).toBeVisible()
  })
}
