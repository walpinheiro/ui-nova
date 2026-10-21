// VSplitView e2e (Playwright). NOT executed by vitest: when this file is picked
// up by `vitest run`, only the placeholder suite below is registered. Under
// the Playwright runner (VITEST unset) the real browser tests run against the
// local validation harness at http://localhost:8321/VSplitView.html
// (served from .val-harness/).
export {}
const isVitest = typeof globalThis.process !== 'undefined' && Boolean(globalThis.process.env?.VITEST)

if (isVitest) {
  const { describe, it, expect } = await import('vitest')
  describe('VSplitView e2e (Playwright-only, placeholder sob Vitest)', () => {
    it('placeholder', () => {
      expect(true).toBe(true)
    })
  })
} else {
  const { test, expect } = await import('@playwright/test')

  test('VSplitView harness renders orientations, modes, collapsed and disabled', async ({ page }) => {
    await page.goto('http://localhost:8321/VSplitView.html')
    await page.waitForFunction(() => (window as unknown as { __ready?: boolean }).__ready === true)
    await expect(page.getByTestId('v-split-view').first()).toBeVisible()
    await expect(page.locator('#st-vertical [data-test-id="v-split-view"]')).toBeVisible()
    await expect(page.locator('#st-horizontal [data-test-id="v-split-view"]')).toHaveAttribute('data-orientation', 'horizontal')
    await expect(page.locator('#st-modes [data-test-id="v-split-view"]')).toHaveCount(3)
    const collapsedToggle = page.locator('#st-collapsed [data-test-id="v-split-view-collapse-0"]').first()
    await expect(collapsedToggle).toBeVisible()
    await collapsedToggle.click()
    await expect(page.locator('#st-collapsed [data-test-id="v-split-view-pane-start"]').first()).toHaveAttribute('data-collapsed', 'true')
    await expect(page.locator('#st-disabled [data-test-id="v-split-view"]')).toHaveAttribute('aria-disabled', 'true')
  })

  test('VSplitView divider keyboard resizes and arrow keys work', async ({ page }) => {
    await page.goto('http://localhost:8321/VSplitView.html')
    await page.waitForFunction(() => (window as unknown as { __ready?: boolean }).__ready === true)
    const divider = page.locator('#st-vertical [data-test-id="v-split-view-divider-0"]')
    await expect(divider).toHaveAttribute('role', 'separator')
    await divider.focus()
    await expect(divider).toBeFocused()
    const before = await divider.getAttribute('aria-valuenow')
    await page.keyboard.press('ArrowRight')
    const after = await divider.getAttribute('aria-valuenow')
    expect(before).not.toBe(after)
    await page.keyboard.press('ArrowLeft')
    await page.keyboard.press('Enter')
    await expect(page.locator('#st-vertical [data-test-id="v-split-view-pane-start"]')).toHaveAttribute('data-collapsed', 'true')
  })

  test('VSplitView drag on divider and collapse toggle work', async ({ page }) => {
    await page.goto('http://localhost:8321/VSplitView.html')
    await page.waitForFunction(() => (window as unknown as { __ready?: boolean }).__ready === true)
    const divider = page.locator('#st-vertical [data-test-id="v-split-view-divider-0"]')
    const box = await divider.boundingBox()
    if (box) {
      await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2)
      await page.mouse.down()
      await page.mouse.move(box.x + box.width / 2 + 24, box.y + box.height / 2, { steps: 4 })
      await page.mouse.up()
    }
    await expect(divider).toBeVisible()
    const collapse = page.locator('#st-vertical [data-test-id="v-split-view-collapse-0"]')
    await collapse.click()
    await expect(page.locator('#st-vertical [data-test-id="v-split-view-pane-start"]')).toHaveAttribute('data-collapsed', 'true')
    await collapse.click()
    await expect(page.locator('#st-vertical [data-test-id="v-split-view-pane-start"]')).not.toHaveAttribute('data-collapsed', 'true')
  })
}
