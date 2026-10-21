// VPopover e2e (Playwright). NOT executed by vitest: when this file is picked
// up by `vitest run`, only the placeholder suite below is registered. Under
// the Playwright runner (VITEST unset) the real browser tests run against the
// local validation harness at http://localhost:8321/VPopover.html
// (served from .val-harness/, see harness-server: `node $TEMP/opencode/harness-server.cjs`).
export {}
const isVitest = typeof process !== 'undefined' && !!process.env.VITEST

if (isVitest) {
  const { describe, it, expect } = await import('vitest')
  describe('VPopover e2e (playwright only, skipped under vitest)', () => {
    it('placeholder', () => {
      expect(true).toBe(true)
    })
  })
} else {
  const { test, expect: pwExpect } = await import('@playwright/test')

  test('VPopover default renders trigger and opens dialog with poster tokens', async ({ page }) => {
    await page.goto('http://localhost:8321/VPopover.html')
    await page.waitForFunction(() => (window as unknown as { __ready?: boolean }).__ready === true)
    const root = page.locator('#st-default [data-test-id="v-popover"]').first()
    await pwExpect(root).toBeVisible()
    await pwExpect(root).toHaveAttribute('data-state', 'closed')
    const trigger = page.locator('#st-default [data-test-id="v-popover-trigger"]').first()
    await pwExpect(trigger).toHaveAttribute('aria-haspopup', 'dialog')
    await trigger.click()
    const container = page.locator('[data-test-id="v-popover-container"]').first()
    await pwExpect(container).toBeVisible()
    await pwExpect(container).toHaveAttribute('role', 'dialog')
    await pwExpect(container).toHaveCSS('background-color', 'rgb(255, 255, 255)')
    await pwExpect(container).toHaveCSS('border-radius', '12px')
    await pwExpect(container).toHaveCSS('box-shadow', 'rgba(16, 24, 40, 0.12) 0px 8px 24px 0px')
    await pwExpect(page.locator('[data-test-id="v-popover-arrow"]').first()).toBeVisible()
    await pwExpect(page.locator('[data-test-id="v-popover-title"]').first()).toHaveText('Quick tip')
  })

  test('VPopover closes on escape and click outside', async ({ page }) => {
    await page.goto('http://localhost:8321/VPopover.html')
    await page.waitForFunction(() => (window as unknown as { __ready?: boolean }).__ready === true)
    const trigger = page.locator('#st-default [data-test-id="v-popover-trigger"]').first()
    await trigger.click()
    await pwExpect(page.locator('[data-test-id="v-popover-container"]').first()).toBeVisible()
    await page.keyboard.press('Escape')
    await pwExpect(page.locator('[data-test-id="v-popover-container"]')).toHaveCount(0)
    await trigger.click()
    await pwExpect(page.locator('[data-test-id="v-popover-container"]').first()).toBeVisible()
    await page.mouse.click(8, 8)
    await pwExpect(page.locator('[data-test-id="v-popover-container"]')).toHaveCount(0)
  })

  test('VPopover sizes render with distinct max-width and padding', async ({ page }) => {
    await page.goto('http://localhost:8321/VPopover.html')
    await page.waitForFunction(() => (window as unknown as { __ready?: boolean }).__ready === true)
    const sizes = page.locator('#st-sizes [data-test-id="v-popover"]')
    await pwExpect(sizes).toHaveCount(3)
    await sizes.nth(0).locator('[data-test-id="v-popover-trigger"]').click()
    const smallContainer = page.locator('.v-popover__container--sm[data-test-id="v-popover-container"]')
    await pwExpect(smallContainer).toBeVisible()
    const smallMax = await smallContainer.evaluate((el) => getComputedStyle(el).maxWidth)
    const smallPad = await smallContainer.evaluate((el) => getComputedStyle(el).paddingTop)
    await page.keyboard.press('Escape')
    await pwExpect(smallContainer).toHaveCount(0)
    await sizes.nth(2).locator('[data-test-id="v-popover-trigger"]').click()
    const largeContainer = page.locator('.v-popover__container--lg[data-test-id="v-popover-container"]')
    await pwExpect(largeContainer).toBeVisible()
    const largeMax = await largeContainer.evaluate((el) => getComputedStyle(el).maxWidth)
    const largePad = await largeContainer.evaluate((el) => getComputedStyle(el).paddingTop)
    pwExpect(smallMax).not.toBe(largeMax)
    pwExpect(smallPad).not.toBe(largePad)
  })

  test('VPopover hover trigger opens on mouseenter', async ({ page }) => {
    await page.goto('http://localhost:8321/VPopover.html')
    await page.waitForFunction(() => (window as unknown as { __ready?: boolean }).__ready === true)
    const trigger = page.locator('#st-hover [data-test-id="v-popover-trigger"]').first()
    await trigger.hover()
    await pwExpect(page.locator('[data-test-id="v-popover-container"]').first()).toBeVisible()
  })

  test('VPopover disabled blocks interaction and trigger focus-visible shows ring', async ({ page }) => {
    await page.goto('http://localhost:8321/VPopover.html')
    await page.waitForFunction(() => (window as unknown as { __ready?: boolean }).__ready === true)
    const disabled = page.locator('#st-disabled [data-test-id="v-popover"]').first()
    await pwExpect(disabled).toHaveAttribute('data-state', 'disabled')
    await disabled.locator('[data-test-id="v-popover-trigger"]').click({ force: true })
    await pwExpect(page.locator('[data-test-id="v-popover-container"]')).toHaveCount(0)
    const focusTrigger = page.locator('#st-default [data-test-id="v-popover-trigger"]').first()
    await focusTrigger.locator('button').focus()
    await pwExpect(focusTrigger.locator('button')).toBeFocused()
    await pwExpect(focusTrigger).toHaveCSS('outline-width', '2px')
    await pwExpect(focusTrigger).toHaveCSS('outline-color', 'rgb(99, 102, 241)')
  })
}
