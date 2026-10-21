// VDrawer e2e (Playwright). Under vitest only the placeholder suite runs.
export {}

const isVitest = typeof process !== 'undefined' && Boolean(process.env.VITEST)

if (isVitest) {
  const { describe, it, expect } = await import('vitest')
  describe('VDrawer e2e (playwright only, skipped under vitest)', () => {
    it('placeholder', () => {
      expect(true).toBe(true)
    })
  })
} else {
  const { test, expect: pwExpect } = await import('@playwright/test')

  test('VDrawer renders dialog with token surface, radius and shadow', async ({ page }) => {
    await page.goto('http://localhost:8321/VDrawer.html')
    await page.waitForFunction(() => (window as unknown as { __ready?: boolean }).__ready === true)
    const panel = page.locator('#st-interactive [data-test-id="drawer-container"]').first()
    await pwExpect(panel).toBeVisible()
    await pwExpect(panel).toHaveAttribute('role', 'dialog')
    await pwExpect(panel).toHaveAttribute('aria-modal', 'true')
    await pwExpect(panel).toHaveCSS('background-color', 'rgb(255, 255, 255)')
    await pwExpect(panel).toHaveCSS('border-radius', '12px 0px 0px 12px')
  })

  test('VDrawer placements and sizes render distinctly', async ({ page }) => {
    await page.goto('http://localhost:8321/VDrawer.html')
    await page.waitForFunction(() => (window as unknown as { __ready?: boolean }).__ready === true)
    const placements = page.locator('#st-placements [data-test-id="drawer-container"]')
    await pwExpect(placements).toHaveCount(4)
    for (let i = 0; i < 4; i++) await pwExpect(placements.nth(i)).toBeVisible()
    const sizes = page.locator('#st-sizes [data-test-id="drawer-container"]')
    await pwExpect(sizes).toHaveCount(3)
    const sm = await sizes.nth(0).evaluate((el) => getComputedStyle(el).width)
    const lg = await sizes.nth(2).evaluate((el) => getComputedStyle(el).width)
    pwExpect(sm).not.toBe(lg)
    pwExpect(parseFloat(sm)).toBeLessThan(parseFloat(lg))
  })

  test('VDrawer open/closed + disabled/loading expose state and ARIA', async ({ page }) => {
    await page.goto('http://localhost:8321/VDrawer.html')
    await page.waitForFunction(() => (window as unknown as { __ready?: boolean }).__ready === true)
    const openRoots = page.locator('#st-open [data-test-id="v-drawer"]')
    await pwExpect(openRoots.first()).toHaveAttribute('data-state', 'open')
    await pwExpect(openRoots.nth(1)).toHaveAttribute('data-state', /^(closed|closing)$/)
    await pwExpect(page.locator('#st-open [data-test-id="drawer-container"]')).toHaveCount(1)
    const disabled = page.locator('#st-disabled [data-test-id="drawer-container"]').first()
    await pwExpect(disabled).toHaveAttribute('aria-disabled', 'true')
    const loading = page.locator('#st-disabled [data-test-id="drawer-container"]').nth(1)
    await pwExpect(loading).toHaveAttribute('aria-busy', 'true')
    await pwExpect(loading.locator('.v-drawer__loader')).toBeVisible()
  })

  test('VDrawer opens via trigger click and closes via close button', async ({ page }) => {
    await page.goto('http://localhost:8321/VDrawer.html')
    await page.waitForFunction(() => (window as unknown as { __ready?: boolean }).__ready === true)
    const root = page.locator('#st-interactive [data-test-id="v-drawer"]').first()
    const trigger = page.locator('#st-interactive [data-test-id="drawer-trigger-open"]')
    await page.locator('#st-interactive [data-test-id="drawer-close-button"]').click()
    await pwExpect(root).toHaveAttribute('data-state', 'closed')
    await trigger.click()
    await pwExpect(root).toHaveAttribute('data-state', 'open')
    await pwExpect(page.locator('#st-interactive [data-test-id="drawer-container"]')).toBeVisible()
    await page.locator('#st-interactive [data-test-id="drawer-close-button"]').click()
    await pwExpect(root).toHaveAttribute('data-state', 'closed')
  })

  test('VDrawer Escape closes and backdrop click dismisses', async ({ page }) => {
    await page.goto('http://localhost:8321/VDrawer.html')
    await page.waitForFunction(() => (window as unknown as { __ready?: boolean }).__ready === true)
    const root = page.locator('#st-interactive [data-test-id="v-drawer"]').first()
    const trigger = page.locator('#st-interactive [data-test-id="drawer-trigger-open"]')
    await page.locator('#st-interactive [data-test-id="drawer-close-button"]').click()
    await pwExpect(root).toHaveAttribute('data-state', 'closed')
    await trigger.click()
    const panel = page.locator('#st-interactive [data-test-id="drawer-container"]')
    await pwExpect(panel).toBeVisible()
    await panel.press('Escape')
    await pwExpect(root).toHaveAttribute('data-state', 'closed')
    await trigger.click()
    await pwExpect(root).toHaveAttribute('data-state', 'open')
    await page.locator('#st-interactive [data-test-id="drawer-overlay"]').click({ position: { x: 5, y: 5 } })
    await pwExpect(root).toHaveAttribute('data-state', 'closed')
  })

  test('VDrawer close button is keyboard-focusable with visible ring', async ({ page }) => {
    await page.goto('http://localhost:8321/VDrawer.html')
    await page.waitForFunction(() => (window as unknown as { __ready?: boolean }).__ready === true)
    const close = page.locator('#st-interactive [data-test-id="drawer-close-button"]')
    await pwExpect(close).toBeVisible()
    await close.focus()
    await pwExpect(close).toBeFocused()
    await pwExpect(close).toHaveCSS('outline-width', '2px')
    await pwExpect(close).toHaveCSS('outline-color', 'rgb(99, 102, 241)')
  })

  test('VDrawer title is a heading labelled by the dialog', async ({ page }) => {
    await page.goto('http://localhost:8321/VDrawer.html')
    await page.waitForFunction(() => (window as unknown as { __ready?: boolean }).__ready === true)
    const panel = page.locator('#st-interactive [data-test-id="drawer-container"]').first()
    const title = page.locator('#st-interactive [data-test-id="drawer-title"]').first()
    await pwExpect(title).toHaveJSProperty('tagName', 'H2')
    const id = await title.getAttribute('id')
    pwExpect(id).toBeTruthy()
    await pwExpect(panel).toHaveAttribute('aria-labelledby', id as string)
  })

  test('VDrawer traps Tab/Shift+Tab and returns focus to the trigger', async ({ page }) => {
    await page.goto('http://localhost:8321/VDrawer.html')
    await page.waitForFunction(() => (window as unknown as { __ready?: boolean }).__ready === true)
    const root = page.locator('#st-trap [data-test-id="v-drawer"]').first()
    const trigger = page.locator('#st-trap [data-test-id="drawer-trigger-trap"]')
    await page.locator('#st-trap [data-test-id="drawer-container"]').press('Escape')
    await pwExpect(root).toHaveAttribute('data-state', 'closed')
    await trigger.click()
    await pwExpect(root).toHaveAttribute('data-state', 'open')
    await pwExpect(page.locator('#st-trap [data-test-id="drawer-close-button"]')).toBeFocused()
    await page.locator('#st-trap [data-test-id="drawer-action-last"]').focus()
    await page.keyboard.press('Tab')
    await pwExpect(page.locator('#st-trap [data-test-id="drawer-close-button"]')).toBeFocused()
    await page.keyboard.press('Shift+Tab')
    await pwExpect(page.locator('#st-trap [data-test-id="drawer-action-last"]')).toBeFocused()
    await page.locator('#st-trap [data-test-id="drawer-container"]').press('Escape')
    await pwExpect(root).toHaveAttribute('data-state', 'closed')
    await pwExpect(trigger).toBeFocused()
  })

  test('VDrawer size stories keep the 320/480/640 poster widths', async ({ page }) => {
    await page.goto('http://localhost:8321/VDrawer.html')
    await page.waitForFunction(() => (window as unknown as { __ready?: boolean }).__ready === true)
    const sizes = page.locator('#st-sizes [data-test-id="drawer-container"]')
    const widths = await Promise.all([0, 1, 2].map((i) => sizes.nth(i).evaluate((el) => getComputedStyle(el).width)))
    pwExpect(widths).toEqual(['320px', '480px', '640px'])
  })
}
