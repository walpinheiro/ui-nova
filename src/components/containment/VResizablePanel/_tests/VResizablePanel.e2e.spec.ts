// VResizablePanel e2e (Playwright). NOT executed by vitest: when this file is picked
// up by `vitest run`, only the placeholder suite below is registered. Under
// the Playwright runner (VITEST unset) the real browser tests run against the
// local validation harness at http://localhost:8321/VResizablePanel.html
// (served from .val-harness/, see harness-server: `node $TEMP/opencode/harness-server.cjs`).
export { }
const isVitest = typeof process !== 'undefined' && !!process.env.VITEST

if (isVitest) {
  const { describe, it, expect } = await import('vitest')
  describe('VResizablePanel e2e (playwright only, skipped under vitest)', () => {
    it('placeholder', () => {
      expect(true).toBe(true)
    })
  })
} else {
  const { test, expect: pwExpect } = await import('@playwright/test')

  test('VResizablePanel default renders with token surface, radius and live width', async ({ page }) => {
    await page.goto('http://localhost:8321/VResizablePanel.html')
    await page.waitForFunction(() => (window as unknown as { __ready?: boolean }).__ready === true)
    const panel = page.getByTestId('v-resizable-panel').first()
    await pwExpect(panel).toBeVisible()
    await pwExpect(panel).toHaveCSS('background-color', 'rgb(255, 255, 255)')
    await pwExpect(panel).toHaveCSS('border-radius', '12px')
    await pwExpect(panel).toHaveAttribute('data-variant', 'left')
    const width = await panel.evaluate((el) => (el as HTMLElement).style.width)
    pwExpect(width).toBe('320px')
  })

  test('VResizablePanel size presets render 240/320/480 live widths', async ({ page }) => {
    await page.goto('http://localhost:8321/VResizablePanel.html')
    await page.waitForFunction(() => (window as unknown as { __ready?: boolean }).__ready === true)
    pwExpect(await page.getByTestId('docs-resizable-size-240').evaluate((el) => (el as HTMLElement).style.width)).toBe('240px')
    pwExpect(await page.getByTestId('docs-resizable-size-320').evaluate((el) => (el as HTMLElement).style.width)).toBe('320px')
    pwExpect(await page.getByTestId('docs-resizable-size-480').evaluate((el) => (el as HTMLElement).style.width)).toBe('480px')
  })

  test('VResizablePanel variants expose spec data-variant values', async ({ page }) => {
    await page.goto('http://localhost:8321/VResizablePanel.html')
    await page.waitForFunction(() => (window as unknown as { __ready?: boolean }).__ready === true)
    for (const variant of ['left', 'right', 'bottom', 'collapsible']) {
      await pwExpect(page.getByTestId(`docs-resizable-variant-${variant}`)).toHaveAttribute('data-variant', variant)
    }
    await pwExpect(page.getByTestId('docs-resizable-variant-bottom')).toHaveAttribute('data-orientation', 'horizontal')
  })

  test('VResizablePanel handle is a focusable separator with ARIA values and focus ring', async ({ page }) => {
    await page.goto('http://localhost:8321/VResizablePanel.html')
    await page.waitForFunction(() => (window as unknown as { __ready?: boolean }).__ready === true)
    const handle = page.locator('#st-default [data-test-id="v-resizable-panel-handle"]').first()
    await pwExpect(handle).toHaveAttribute('role', 'separator')
    await pwExpect(handle).toHaveAttribute('tabindex', '0')
    await pwExpect(handle).toHaveAttribute('aria-orientation', 'vertical')
    await pwExpect(handle).toHaveAttribute('aria-valuenow', '320')
    await handle.focus()
    await pwExpect(handle).toBeFocused()
    await pwExpect(handle).toHaveCSS('outline-width', '2px')
    await pwExpect(handle).toHaveCSS('outline-color', 'rgb(99, 102, 241)')
  })

  test('VResizablePanel keyboard resizes and announces via aria-valuenow/text', async ({ page }) => {
    await page.goto('http://localhost:8321/VResizablePanel.html')
    await page.waitForFunction(() => (window as unknown as { __ready?: boolean }).__ready === true)
    const handle = page.locator('#st-keyboard [data-test-id="v-resizable-panel-handle"]').first()
    await handle.focus()
    await page.keyboard.press('ArrowRight')
    await pwExpect(handle).toHaveAttribute('aria-valuenow', '336')
    await pwExpect(handle).toHaveAttribute('aria-valuetext', '336px')
    await page.keyboard.press('Home')
    await pwExpect(handle).toHaveAttribute('aria-valuenow', '200')
    await page.keyboard.press('End')
    await pwExpect(handle).toHaveAttribute('aria-valuenow', '480')
  })

  test('VResizablePanel drag handle resizes live with thin handle and tooltip', async ({ page }) => {
    await page.goto('http://localhost:8321/VResizablePanel.html')
    await page.waitForFunction(() => (window as unknown as { __ready?: boolean }).__ready === true)
    const panel = page.locator('#st-drag [data-test-id="v-resizable-panel"]').first()
    const handle = panel.getByTestId('v-resizable-panel-handle')
    await pwExpect(handle).toHaveCSS('width', '8px')
    await pwExpect(handle).toHaveCSS('height', '40px')
    await pwExpect(handle).toHaveCSS('background-color', 'rgb(255, 255, 255)')
    const box = await handle.boundingBox()
    pwExpect(box).not.toBeNull()
    const startWidth = await panel.evaluate((el) => (el as HTMLElement).style.width)
    pwExpect(startWidth).toBe('320px')
    await page.mouse.move(box!.x + box!.width / 2, box!.y + box!.height / 2)
    await page.mouse.down()
    await page.mouse.move(box!.x + 60, box!.y + box!.height / 2, { steps: 5 })
    const liveWidth = await panel.evaluate((el) => (el as HTMLElement).style.width)
    pwExpect(liveWidth).not.toBe('320px')
    await page.mouse.up()
    const finalWidth = await panel.evaluate((el) => (el as HTMLElement).style.width)
    pwExpect(finalWidth).not.toBe('320px')
    await pwExpect(panel.getByTestId('v-resizable-panel-drag-tooltip')).toHaveText('Drag to resize')
    await pwExpect(panel.getByTestId('v-resizable-panel-min')).toBeAttached()
    await pwExpect(panel.getByTestId('v-resizable-panel-max')).toBeAttached()
  })

  test('VResizablePanel collapsible trigger toggles with aria-expanded', async ({ page }) => {
    await page.goto('http://localhost:8321/VResizablePanel.html')
    await page.waitForFunction(() => (window as unknown as { __ready?: boolean }).__ready === true)
    const panel = page.locator('#st-collapsible [data-test-id="v-resizable-panel"]').first()
    const trigger = panel.getByTestId('v-resizable-panel-collapse-trigger')
    await pwExpect(trigger).toHaveAttribute('aria-expanded', 'true')
    await trigger.click()
    await pwExpect(trigger).toHaveAttribute('aria-expanded', 'false')
    await pwExpect(panel).toHaveAttribute('data-state', 'collapsed')
    await trigger.click()
    await pwExpect(trigger).toHaveAttribute('aria-expanded', 'true')
  })

  test('VResizablePanel disabled exposes ARIA and blocks interaction', async ({ page }) => {
    await page.goto('http://localhost:8321/VResizablePanel.html')
    await page.waitForFunction(() => (window as unknown as { __ready?: boolean }).__ready === true)
    const disabled = page.locator('#st-disabled [data-test-id="v-resizable-panel"]').first()
    await pwExpect(disabled).toHaveAttribute('aria-disabled', 'true')
    await pwExpect(disabled).toHaveAttribute('data-state', 'disabled')
    const loading = page.locator('#st-disabled [data-test-id="v-resizable-panel"]').nth(1)
    await pwExpect(loading).toHaveAttribute('aria-busy', 'true')
    await pwExpect(loading.locator('.v-resizable-panel__loader')).toBeVisible()
  })

  test('VResizablePanel states row exposes spec data-test-ids and handle visuals', async ({ page }) => {
    await page.goto('http://localhost:8321/VResizablePanel.html')
    await page.waitForFunction(() => (window as unknown as { __ready?: boolean }).__ready === true)
    for (const state of ['default', 'hover', 'focus', 'dragging', 'collapsed', 'disabled']) {
      await pwExpect(page.getByTestId(`docs-resizable-state-${state}`)).toBeVisible()
    }
    const hoverHandle = page.getByTestId('docs-resizable-state-hover').locator('.v-resizable-panel__handle')
    await pwExpect(hoverHandle).toHaveCSS('border-radius', '4px')
    const hoverGripColor = await hoverHandle.locator('.v-resizable-panel__handle-grip').evaluate(
      (el) => getComputedStyle(el).backgroundColor,
    )
    pwExpect(hoverGripColor).toBe('rgb(99, 102, 241)')
    await pwExpect(page.getByTestId('docs-resizable-state-disabled')).toHaveAttribute('aria-disabled', 'true')
  })

  test('VResizablePanel bottom drag increases height and aria-live announces size', async ({ page }) => {
    await page.goto('http://localhost:8321/VResizablePanel.html')
    await page.waitForFunction(() => (window as unknown as { __ready?: boolean }).__ready === true)
    const panel = page.getByTestId('docs-resizable-variant-bottom')
    const handle = panel.getByTestId('v-resizable-panel-handle')
    const box = await handle.boundingBox()
    pwExpect(box).not.toBeNull()
    await page.mouse.move(box!.x + box!.width / 2, box!.y + box!.height / 2)
    await page.mouse.down()
    await page.mouse.move(box!.x + box!.width / 2, box!.y + 40, { steps: 4 })
    const liveHeight = await panel.evaluate((el) => (el as HTMLElement).style.height)
    pwExpect(liveHeight).not.toBe('240px')
    await page.mouse.up()
    await pwExpect(panel.getByTestId('v-resizable-panel-live')).toContainText('Panel size')
  })
}
