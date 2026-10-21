// VSheet e2e (Playwright). NOT executed by vitest: when this file is picked
// up by `vitest run`, only the placeholder suite below is registered. Under
// the Playwright runner (VITEST unset) the real browser tests run against the
// local validation harness at http://localhost:8321/VSheet.html
// (served from .val-harness/, see scripts/val-harness-server.cjs).
export {}
const isVitest = typeof process !== 'undefined' && !!process.env.VITEST

if (isVitest) {
  const { describe, it, expect } = await import('vitest')
  describe('VSheet e2e (playwright only, skipped under vitest)', () => {
    it('placeholder', () => {
      expect(true).toBe(true)
    })
  })
} else {
  const { test, expect: pwExpect } = await import('@playwright/test')

  test('VSheet renders dialog with token surface, radius and shadow', async ({ page }) => {
    await page.goto('http://localhost:8321/VSheet.html')
    await page.waitForFunction(() => (window as unknown as { __ready?: boolean }).__ready === true)
    const panel = page.locator('#st-interactive [data-test-id="v-sheet-panel"]').first()
    await pwExpect(panel).toBeVisible()
    await pwExpect(panel).toHaveAttribute('role', 'dialog')
    await pwExpect(panel).toHaveAttribute('aria-modal', 'true')
    await pwExpect(panel).toHaveCSS('background-color', 'rgb(255, 255, 255)')
    await pwExpect(panel).toHaveCSS('border-radius', '12px 0px 0px 12px')
  })

  test('VSheet full height variant renders immersive panel', async ({ page }) => {
    await page.goto('http://localhost:8321/VSheet.html')
    await page.waitForFunction(() => (window as unknown as { __ready?: boolean }).__ready === true)
    const root = page.locator('#st-full-height [data-test-id="v-sheet"]').first()
    await pwExpect(root).toHaveClass(/v-sheet--full-height/)
    await pwExpect(root).toHaveAttribute('data-side', 'right')
    await pwExpect(page.locator('#st-full-height [data-test-id="v-sheet-panel"]').first()).toBeVisible()
  })

  test('VSheet sides and sizes render distinctly', async ({ page }) => {
    await page.goto('http://localhost:8321/VSheet.html')
    await page.waitForFunction(() => (window as unknown as { __ready?: boolean }).__ready === true)
    const sides = page.locator('#st-sides [data-test-id="v-sheet-panel"]')
    await pwExpect(sides).toHaveCount(3)
    for (let i = 0; i < 3; i++) await pwExpect(sides.nth(i)).toBeVisible()
    const sizes = page.locator('#st-sizes [data-test-id="v-sheet-panel"]')
    await pwExpect(sizes).toHaveCount(4)
    const sm = await sizes.nth(0).evaluate((el) => getComputedStyle(el).width)
    const xl = await sizes.nth(3).evaluate((el) => getComputedStyle(el).width)
    pwExpect(sm).not.toBe(xl)
    pwExpect(parseFloat(sm)).toBeLessThan(parseFloat(xl))
  })

  test('VSheet open/closed + disabled/loading expose state and ARIA', async ({ page }) => {
    await page.goto('http://localhost:8321/VSheet.html')
    await page.waitForFunction(() => (window as unknown as { __ready?: boolean }).__ready === true)
    const openRoots = page.locator('#st-open [data-test-id="v-sheet"]')
    await pwExpect(openRoots.first()).toHaveAttribute('data-state', 'open')
    await pwExpect(openRoots.nth(1)).toHaveAttribute('data-state', /^(closed|closing)$/)
    await pwExpect(page.locator('#st-open [data-test-id="v-sheet-panel"]')).toHaveCount(1)
    const disabled = page.locator('#st-disabled [data-test-id="v-sheet-panel"]').first()
    await pwExpect(disabled).toHaveAttribute('aria-disabled', 'true')
    const loading = page.locator('#st-disabled [data-test-id="v-sheet-panel"]').nth(1)
    await pwExpect(loading).toHaveAttribute('aria-busy', 'true')
    await pwExpect(loading.locator('.v-sheet__loader')).toBeVisible()
  })

  test('VSheet opens via trigger click and closes via close button', async ({ page }) => {
    await page.goto('http://localhost:8321/VSheet.html')
    await page.waitForFunction(() => (window as unknown as { __ready?: boolean }).__ready === true)
    const root = page.locator('#st-interactive [data-test-id="v-sheet"]').first()
    const trigger = page.getByTestId('v-sheet-trigger')
    // Close the initially-open sheet first so the trigger is clickable.
    await page.locator('#st-interactive [data-test-id="v-sheet-close"]').click()
    await pwExpect(root).toHaveAttribute('data-state', 'closed')
    await trigger.click()
    await pwExpect(root).toHaveAttribute('data-state', 'open')
    await pwExpect(page.locator('#st-interactive [data-test-id="v-sheet-panel"]')).toBeVisible()
    await page.locator('#st-interactive [data-test-id="v-sheet-close"]').click()
    await pwExpect(root).toHaveAttribute('data-state', 'closed')
  })

  test('VSheet Escape closes and backdrop click dismisses', async ({ page }) => {
    await page.goto('http://localhost:8321/VSheet.html')
    await page.waitForFunction(() => (window as unknown as { __ready?: boolean }).__ready === true)
    const root = page.locator('#st-interactive [data-test-id="v-sheet"]').first()
    const trigger = page.getByTestId('v-sheet-trigger')
    await page.locator('#st-interactive [data-test-id="v-sheet-close"]').click()
    await pwExpect(root).toHaveAttribute('data-state', 'closed')
    await trigger.click()
    const panel = page.locator('#st-interactive [data-test-id="v-sheet-panel"]')
    await pwExpect(panel).toBeVisible()
    await panel.press('Escape')
    await pwExpect(root).toHaveAttribute('data-state', 'closed')
    await trigger.click()
    await pwExpect(root).toHaveAttribute('data-state', 'open')
    await page.locator('#st-interactive [data-test-id="v-sheet-backdrop"]').click({ position: { x: 5, y: 5 } })
    await pwExpect(root).toHaveAttribute('data-state', 'closed')
  })

  test('VSheet close button is keyboard-focusable with visible ring', async ({ page }) => {
    await page.goto('http://localhost:8321/VSheet.html')
    await page.waitForFunction(() => (window as unknown as { __ready?: boolean }).__ready === true)
    const close = page.locator('#st-interactive [data-test-id="v-sheet-close"]')
    await pwExpect(close).toBeVisible()
    await close.focus()
    await pwExpect(close).toBeFocused()
    await pwExpect(close).toHaveCSS('outline-width', '2px')
    await pwExpect(close).toHaveCSS('outline-color', 'rgb(99, 102, 241)')
  })

  test('VSheet title is a heading labelled by the dialog', async ({ page }) => {
    await page.goto('http://localhost:8321/VSheet.html')
    await page.waitForFunction(() => (window as unknown as { __ready?: boolean }).__ready === true)
    const panel = page.locator('#st-interactive [data-test-id="v-sheet-panel"]').first()
    const title = page.locator('#st-interactive [data-test-id="v-sheet-title"]').first()
    await pwExpect(title).toHaveJSProperty('tagName', 'H2')
    const id = await title.getAttribute('id')
    pwExpect(id).toBeTruthy()
    await pwExpect(panel).toHaveAttribute('aria-labelledby', id as string)
  })

  test('VSheet traps Tab/Shift+Tab and moves initial focus into the panel', async ({ page }) => {
    await page.goto('http://localhost:8321/VSheet.html')
    await page.waitForFunction(() => (window as unknown as { __ready?: boolean }).__ready === true)
    const root = page.locator('#st-trap [data-test-id="v-sheet"]').first()
    // Reopen via the trigger so the open transition (and initial focus) is deterministic
    // even with several demo sheets mounted open on the same page.
    await page.locator('#st-trap [data-test-id="v-sheet-panel"]').press('Escape')
    await pwExpect(root).toHaveAttribute('data-state', 'closed')
    await page.locator('#st-trap [data-test-id="v-sheet-trigger-trap"]').click()
    await pwExpect(root).toHaveAttribute('data-state', 'open')
    const panel = page.locator('#st-trap [data-test-id="v-sheet-panel"]')
    await pwExpect(panel).toBeVisible()
    // Initial focus moves into the panel (first focusable: close button).
    await pwExpect(page.locator('#st-trap [data-test-id="v-sheet-close"]')).toBeFocused()
    // Forward Tab from the last focusable wraps to the first.
    await page.locator('#st-trap [data-test-id="trap-last"]').focus()
    // Forward Tab from the last focusable wraps to the first.
    await page.locator('#st-trap [data-test-id="trap-last"]').focus()
    await page.keyboard.press('Tab')
    await pwExpect(page.locator('#st-trap [data-test-id="v-sheet-close"]')).toBeFocused()
    // Shift+Tab from the first focusable wraps to the last.
    await page.keyboard.press('Shift+Tab')
    await pwExpect(page.locator('#st-trap [data-test-id="trap-last"]')).toBeFocused()
  })

  test('VSheet Escape closes and returns focus to the trigger', async ({ page }) => {
    await page.goto('http://localhost:8321/VSheet.html')
    await page.waitForFunction(() => (window as unknown as { __ready?: boolean }).__ready === true)
    const trigger = page.locator('#st-trap [data-test-id="v-sheet-trigger-trap"]')
    // Close the initially-open trap sheet via Escape, then reopen from the trigger
    // so the opener identity is known for the return-focus assertion.
    await page.locator('#st-trap [data-test-id="v-sheet-panel"]').press('Escape')
    await pwExpect(page.locator('#st-trap [data-test-id="v-sheet"]')).toHaveAttribute('data-state', 'closed')
    await trigger.focus()
    await trigger.click()
    const panel = page.locator('#st-trap [data-test-id="v-sheet-panel"]')
    await pwExpect(panel).toBeVisible()
    await panel.press('Escape')
    await pwExpect(page.locator('#st-trap [data-test-id="v-sheet"]')).toHaveAttribute('data-state', 'closed')
    await pwExpect(trigger).toBeFocused()
  })
}
