// VDialog e2e (Playwright). NOT executed by vitest: when this file is picked
// up by `vitest run`, only the placeholder suite below is registered. Under
// the Playwright runner (VITEST unset) the real browser tests run against the
// local validation harness at http://localhost:8321/VDialog.html
// (served from .val-harness/, see scripts/val-harness-server.cjs).
export {}
const isVitest = typeof process !== 'undefined' && !!process.env.VITEST

if (isVitest) {
  const { describe, it, expect } = await import('vitest')
  describe('VDialog e2e (playwright only, skipped under vitest)', () => {
    it('placeholder', () => {
      expect(true).toBe(true)
    })
  })
} else {
  const { test, expect: pwExpect } = await import('@playwright/test')

  test('VDialog renders the poster surface and modal semantics', async ({ page }) => {
    await page.goto('http://localhost:8321/VDialog.html')
    await page.waitForFunction(() => (window as unknown as { __ready?: boolean }).__ready === true)
    const root = page.locator('#st-default-dialog [data-test-id="v-dialog"]')
    const panel = page.locator('#st-default-dialog [data-test-id="dialog-container"]')
    await pwExpect(panel).toBeVisible()
    await pwExpect(panel).toHaveAttribute('role', 'dialog')
    await pwExpect(panel).toHaveAttribute('aria-modal', 'true')
    await pwExpect(panel).toHaveCSS('background-color', 'rgb(255, 255, 255)')
    await pwExpect(panel).toHaveCSS('border-radius', '16px')
    await pwExpect(panel).toHaveCSS('max-width', '480px')
    await pwExpect(root).toHaveAttribute('data-state', 'open')
    await pwExpect(page.locator('#st-default-dialog [data-test-id="dialog-backdrop"]')).toBeVisible()
    await pwExpect(page.locator('#st-default-dialog [data-test-id="dialog-close-button"] [data-test-id="v-icon"]')).toBeVisible()
  })

  test('VDialog opens, traps focus, dismisses with Escape and returns focus', async ({ page }) => {
    await page.goto('http://localhost:8321/VDialog.html')
    await page.waitForFunction(() => (window as unknown as { __ready?: boolean }).__ready === true)
    const trigger = page.getByTestId('dialog-trigger-open')
    const root = page.locator('#st-interactive [data-test-id="v-dialog"]')
    await trigger.click()
    const panel = page.locator('#st-interactive [data-test-id="dialog-container"]')
    await pwExpect(panel).toBeVisible()
    await pwExpect(page.locator('#st-interactive [data-test-id="dialog-close-button"]')).toBeFocused()

    await page.locator('#st-interactive [data-test-id="dialog-action-confirm"]').focus()
    await page.keyboard.press('Tab')
    await pwExpect(page.locator('#st-interactive [data-test-id="dialog-close-button"]')).toBeFocused()
    await page.keyboard.press('Shift+Tab')
    await pwExpect(page.locator('#st-interactive [data-test-id="dialog-action-confirm"]')).toBeFocused()

    await panel.press('Escape')
    await pwExpect(root).toHaveAttribute('data-state', 'closed')
    await pwExpect(trigger).toBeFocused()
  })

  test('VDialog closes from the backdrop and exposes focus-visible close state', async ({ page }) => {
    await page.goto('http://localhost:8321/VDialog.html')
    await page.waitForFunction(() => (window as unknown as { __ready?: boolean }).__ready === true)
    const trigger = page.getByTestId('dialog-trigger-open')
    await trigger.click()
    const close = page.locator('#st-interactive [data-test-id="dialog-close-button"]')
    await page.locator('#st-interactive [data-test-id="dialog-action-confirm"]').focus()
    await page.keyboard.press('Tab')
    await pwExpect(close).toBeFocused()
    await pwExpect(close).toHaveCSS('outline-width', '2px')
    await pwExpect(close).toHaveCSS('outline-color', 'rgb(99, 102, 241)')

    await page.locator('#st-interactive [data-test-id="dialog-backdrop"]').click({ position: { x: 4, y: 4 } })
    await pwExpect(page.locator('#st-interactive [data-test-id="v-dialog"]')).toHaveAttribute('data-state', 'closed')
  })

  test('VDialog size stories keep the 320/480/640 poster widths', async ({ page }) => {
    await page.goto('http://localhost:8321/VDialog.html')
    await page.waitForFunction(() => (window as unknown as { __ready?: boolean }).__ready === true)
    for (const [id, width] of [
      ['st-size-sm', '320px'],
      ['st-size-md', '480px'],
      ['st-size-lg', '640px'],
    ]) {
      await pwExpect(page.locator(`#${id} [data-test-id="dialog-container"]`)).toHaveCSS('max-width', width)
    }
  })
}
