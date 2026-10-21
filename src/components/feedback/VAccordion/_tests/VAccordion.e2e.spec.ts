import path from 'node:path'
import { test, expect, type Page } from '@playwright/test'

const workspaceRoot = process.cwd()

async function mountAccordion(page: Page) {
  await page.goto('about:blank')
  await page.setContent('<main id="app"></main>')
  await page.addStyleTag({ path: path.join(workspaceRoot, 'dist/vueui-nova-kit.css') })
  await page.addScriptTag({ path: path.join(workspaceRoot, '.val-harness/vue.global.js') })
  await page.addScriptTag({ path: path.join(workspaceRoot, 'dist/vueui-nova.umd.js') })
  await page.evaluate(`(() => {
    const { createApp, h, ref } = window.Vue
    const { VAccordion, VAccordionItem } = window.VueUiNova
    const open = ref('pricing')
    const items = [
      ['what-is', 'What is VueUI Nova?', 'VueUI Nova is a modern UI library for Vue 3, designed for speed and clarity.'],
      ['pricing', 'How does pricing work?', 'VueUI Nova is open source and free for personal use. We also offer a Pro plan with advanced components, team collaboration, and priority support.'],
      ['commercial', 'Can I use it in commercial projects?', 'Yes. Use VueUI Nova in commercial projects under the project license.'],
      ['help', 'Where can I get help?', 'Read the documentation or open an issue in the project repository.']
    ]
    const Root = {
      setup() {
        return () => h(VAccordion, {
          modelValue: open.value,
          'onUpdate:modelValue': (value) => { open.value = value },
          ariaLabel: 'Frequently asked questions'
        }, {
          default: () => items.map(([id, title, body]) => h(VAccordionItem, { id, title }, { default: () => h('p', body) }))
        })
      }
    }
    createApp(Root).mount('#app')
    window.__ready = true
  })()`)
  await page.waitForFunction(() => (window as Window & { __ready?: boolean }).__ready === true)
}

test.describe('VAccordion', () => {
  test('renders the reference FAQ anatomy and initial expanded state', async ({ page }) => {
    await mountAccordion(page)
    const accordion = page.getByTestId('v-accordion')
    await expect(accordion).toBeVisible()
    await expect(page.getByTestId('accordion-trigger-what-is')).toHaveAttribute('aria-expanded', 'false')
    await expect(page.getByTestId('accordion-trigger-pricing')).toHaveAttribute('aria-expanded', 'true')
    await expect(page.getByTestId('accordion-panel-pricing')).toContainText('VueUI Nova is open source')
    await expect(page.getByTestId('accordion-trigger-commercial')).toHaveAttribute('aria-expanded', 'false')
    await expect(page.getByTestId('accordion-trigger-help')).toHaveAttribute('aria-expanded', 'false')
  })

  test('toggles items with mouse and keeps single mode exclusive', async ({ page }) => {
    await mountAccordion(page)
    await page.getByTestId('accordion-trigger-what-is').click()
    await expect(page.getByTestId('accordion-trigger-what-is')).toHaveAttribute('aria-expanded', 'true')
    await expect(page.getByTestId('accordion-trigger-pricing')).toHaveAttribute('aria-expanded', 'false')

    await page.getByTestId('accordion-trigger-what-is').click()
    await expect(page.getByTestId('accordion-trigger-what-is')).toHaveAttribute('aria-expanded', 'false')
  })

  test('supports keyboard navigation and visible focus', async ({ page }) => {
    await mountAccordion(page)
    const first = page.getByTestId('accordion-trigger-what-is')
    const second = page.getByTestId('accordion-trigger-pricing')
    await first.focus()
    await expect(first).toBeFocused()
    await first.press('ArrowDown')
    await expect(second).toBeFocused()
    await second.press('Space')
    await expect(second).toHaveAttribute('aria-expanded', 'false')
  })

  test('exposes the linked region semantics', async ({ page }) => {
    await mountAccordion(page)
    const trigger = page.getByTestId('accordion-trigger-pricing')
    const panel = page.getByTestId('accordion-panel-pricing')
    const panelId = await panel.getAttribute('id')
    const triggerId = await trigger.getAttribute('id')
    await expect(trigger).toHaveAttribute('aria-controls', panelId ?? '')
    await expect(panel).toHaveAttribute('role', 'region')
    await expect(panel).toHaveAttribute('aria-labelledby', triggerId ?? '')
  })

  test('disables accordion motion when reduced motion is requested', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' })
    await mountAccordion(page)
    const duration = await page.getByTestId('accordion-panel-wrap-pricing').evaluate((element) => getComputedStyle(element).transitionDuration)
    expect(duration.split(',').every((value) => value.trim() === '0s' || value.trim() === '0ms')).toBe(true)
  })
})
