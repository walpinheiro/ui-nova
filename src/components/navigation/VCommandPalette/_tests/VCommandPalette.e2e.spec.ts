// VCommandPalette e2e (Playwright). Under vitest only the placeholder runs.
// Playwright tests hit the local validation harness at http://localhost:8321/VCommandPalette.html
export {}

const isVitest = typeof process !== 'undefined' && Boolean(process.env.VITEST)

if (isVitest) {
  const { describe, it, expect } = await import('vitest')
  describe('VCommandPalette e2e (playwright only, skipped under vitest)', () => {
    it('placeholder', () => {
      expect(true).toBe(true)
    })
  })
} else {
  const { test, expect } = await import('@playwright/test')

  test('VCommandPalette default renders poster surface and dialog semantics', async ({ page }) => {
    await page.goto('http://localhost:8321/VCommandPalette.html')
    await page.waitForFunction(() => (window as unknown as { __ready?: boolean }).__ready === true)
    const root = page.getByTestId('command-palette').first()
    await expect(root).toBeVisible()
    await expect(root).toHaveAttribute('data-state', 'open')
    const panel = page.getByTestId('command-palette-size-default').first()
    await expect(panel).toBeVisible()
    await expect(panel).toHaveAttribute('role', 'dialog')
    await expect(panel).toHaveAttribute('aria-modal', 'true')
    await expect(panel).toHaveCSS('max-width', '480px')
    await expect(page.getByTestId('command-palette-backdrop').first()).toBeVisible()
    await expect(page.getByTestId('command-palette-input').first()).toBeVisible()
    await expect(page.getByTestId('command-palette-group-recent').first()).toBeVisible()
    await expect(page.getByTestId('command-palette-result-selected').first()).toBeVisible()
  })

  test('VCommandPalette keyboard navigation selects results and Escape closes', async ({ page }) => {
    await page.goto('http://localhost:8321/VCommandPalette.html')
    await page.waitForFunction(() => (window as unknown as { __ready?: boolean }).__ready === true)
    const stage = page.locator('#st-keyboard')
    const input = stage.getByTestId('command-palette-input')
    await input.focus()
    await expect(input).toBeFocused()
    await page.keyboard.press('ArrowDown')
    await expect(stage.getByTestId('command-palette-result-selected')).toContainText('View documentation')
    await page.keyboard.press('Escape')
    await expect(stage.getByTestId('command-palette')).toHaveAttribute('data-state', 'closed')
  })

  test('VCommandPalette variants and sizes render distinct surfaces', async ({ page }) => {
    await page.goto('http://localhost:8321/VCommandPalette.html')
    await page.waitForFunction(() => (window as unknown as { __ready?: boolean }).__ready === true)
    await expect(page.locator('#st-variants [data-variant="global-search"]').first()).toBeVisible()
    await expect(page.locator('#st-variants [data-variant="quick-actions"]').first()).toBeVisible()
    await expect(page.locator('#st-variants [data-variant="file-switcher"]').first()).toBeVisible()
    await expect(page.locator('#st-variants [data-variant="settings-palette"]').first()).toBeVisible()
    await expect(page.getByTestId('command-palette-size-compact').first()).toHaveCSS('max-width', '320px')
    await expect(page.getByTestId('command-palette-size-default').first()).toHaveCSS('max-width', '480px')
    await expect(page.getByTestId('command-palette-size-wide').first()).toHaveCSS('max-width', '640px')
  })

  test('VCommandPalette loading and empty states expose stable test ids', async ({ page }) => {
    await page.goto('http://localhost:8321/VCommandPalette.html')
    await page.waitForFunction(() => (window as unknown as { __ready?: boolean }).__ready === true)
    await expect(page.getByTestId('command-palette-state-loading').first()).toBeVisible()
    await expect(page.getByTestId('command-palette-state-empty').first()).toBeVisible()
  })

  test('VCommandPalette search focus shows visible ring', async ({ page }) => {
    await page.goto('http://localhost:8321/VCommandPalette.html')
    await page.waitForFunction(() => (window as unknown as { __ready?: boolean }).__ready === true)
    const input = page.locator('#st-interactive [data-test-id="command-palette-input"]').first()
    await input.focus()
    await expect(input).toBeFocused()
    await expect(input).toHaveCSS('box-shadow', /rgb\(99, 102, 241\)/)
  })
}
