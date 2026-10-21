export {}
import type { ChildProcess } from 'node:child_process'

const isVitest = typeof process !== 'undefined' && !!process.env.VITEST

if (isVitest) {
  const { describe, it, expect } = await import('vitest')
  describe('VAlert e2e (playwright only, skipped under vitest)', () => {
    it('placeholder', () => {
      expect(true).toBe(true)
    })
  })
} else {
  const { test, expect } = await import('@playwright/test')
  const { request } = await import('node:http')
  const { spawn } = await import('node:child_process')
  type Page = import('@playwright/test').Page

const viteOrigin = 'http://127.0.0.1:5173'
let viteProcess: ChildProcess | undefined

function isViteReady() {
  return new Promise<boolean>((resolve) => {
    const probe = request(`${viteOrigin}/@vite/client`, { method: 'GET' }, (response) => {
      response.resume()
      resolve(Boolean(response.statusCode && response.statusCode < 500))
    })
    probe.on('error', () => resolve(false))
    probe.setTimeout(500, () => {
      probe.destroy()
      resolve(false)
    })
    probe.end()
  })
}

test.beforeAll(async () => {
  if (await isViteReady()) return

  viteProcess = spawn('pnpm.cmd', ['exec', 'vite', '--host', '127.0.0.1', '--port', '5173'], {
    cwd: process.cwd(),
    stdio: 'ignore',
    windowsHide: true,
  })

  for (let attempt = 0; attempt < 40; attempt += 1) {
    if (await isViteReady()) return
    await new Promise((resolve) => setTimeout(resolve, 250))
  }

  viteProcess?.kill()
  throw new Error('Vite did not become ready on http://127.0.0.1:5173')
})

test.afterAll(() => {
  viteProcess?.kill()
})

const defaultProps = {
  variant: 'info',
  size: 'md',
  layout: 'inline',
  title: 'New update available!',
  description: 'Version 2.4 includes performance improvements.',
  dismissible: true,
}

async function mountAlert(page: Page, props: Record<string, unknown> = {}) {
  const serializedProps = JSON.stringify({ ...defaultProps, ...props })
  await page.goto(viteOrigin + '/@vite/client')
  await page.setContent(`
    <!doctype html>
    <html>
      <head>
        <script type="module">
          import { createApp, h } from '${viteOrigin}/node_modules/.vite/deps/vue.js?v=0e1db65d'
          import VAlert from '${viteOrigin}/src/components/feedback/VAlert/VAlert.vue'
          import '${viteOrigin}/src/index.scss'
          createApp({ render: () => h(VAlert, ${serializedProps}) }).mount('#app')
          window.__ready = true
        </script>
      </head>
      <body><div id="app"></div></body>
    </html>
  `)
  await page.waitForFunction(() => (window as unknown as { __ready?: boolean }).__ready === true, undefined, { timeout: 5000 })
  await expect(page.getByTestId('v-alert')).toBeVisible()
}

test.beforeEach(async ({ page }) => {
  await mountAlert(page)
})

test('renders the documented anatomy and semantic defaults', async ({ page }) => {
  const alert = page.getByTestId('v-alert')
  await expect(alert).toHaveAttribute('role', 'alert')
  await expect(alert).toHaveAttribute('data-variant', 'info')
  await expect(alert).toHaveAttribute('data-size', 'md')
  await expect(page.getByTestId('v-alert-icon')).toBeVisible()
  await expect(page.getByTestId('v-alert-title')).toContainText('New update available!')
  await expect(page.getByTestId('v-alert-description')).toContainText('Version 2.4')
  await expect(page.getByTestId('v-alert-close')).toBeVisible()
  await alert.screenshot({ path: 'test-results/VAlert-default.png' })
})

test('matches the poster semantic surfaces and vertical size tokens', async ({ page }) => {
  const surfaces = {
    info: 'rgb(219, 234, 254)',
    success: 'rgb(209, 250, 229)',
    warning: 'rgb(254, 243, 199)',
    danger: 'rgb(254, 226, 226)',
    neutral: 'rgb(248, 250, 252)',
  } as const

  for (const [variant, background] of Object.entries(surfaces)) {
    await mountAlert(page, { variant })
    await expect(page.getByTestId('v-alert')).toHaveCSS('background-color', background)
  }

  for (const [size, padding] of Object.entries({ sm: '8px', md: '12px', lg: '16px' })) {
    await mountAlert(page, { size })
    await expect(page.getByTestId('v-alert')).toHaveCSS('padding-top', padding)
  }
})

test('dismisses with keyboard and removes the alert after its close transition', async ({ page }) => {
  const close = page.getByTestId('v-alert-close')
  await close.focus()
  await expect(close).toBeFocused()
  await page.keyboard.press('Enter')
  await expect(page.getByTestId('v-alert')).toBeHidden()
})

test('exposes focus, hover and pressed close-button states', async ({ page }) => {
  const close = page.getByTestId('v-alert-close')
  await close.hover()
  const hoverBackground = await close.evaluate((element) => getComputedStyle(element).backgroundColor)
  expect(hoverBackground).not.toBe('rgba(0, 0, 0, 0)')
  expect(hoverBackground).not.toBe('transparent')
  await close.focus()
  await expect(close).toBeFocused()
  await expect(close).toHaveCSS('outline-width', '2px')
  await close.dispatchEvent('mousedown')
  await expect(close).toBeVisible()
})

test('uses the poster geometry and exposes loading and disabled semantics', async ({ page }) => {
  const alert = page.getByTestId('v-alert')
  const close = page.getByTestId('v-alert-close')

  await expect(alert).toHaveCSS('border-radius', '12px')
  await expect(alert).toHaveCSS('padding-left', '16px')
  await expect(alert).toHaveCSS('padding-right', '16px')
  await expect(alert).toHaveCSS('gap', '12px')
  await expect(alert).toHaveCSS('font-size', '14px')
  const lineHeight = await alert.evaluate((element) => Number.parseFloat(getComputedStyle(element).lineHeight))
  expect(Math.round(lineHeight)).toBe(20)
  await expect(page.getByTestId('v-alert-icon')).toHaveCSS('width', '16px')
  await expect(close.locator('svg')).toHaveCSS('width', '14px')

  await mountAlert(page, { loading: true })
  await expect(page.getByTestId('v-alert')).toHaveAttribute('aria-busy', 'true')
  await expect(page.getByTestId('v-alert-close')).toBeDisabled()
  await expect(page.getByTestId('v-alert-spinner')).toHaveAttribute('role', 'status')

  await mountAlert(page, { disabled: true })
  await expect(page.getByTestId('v-alert')).toHaveAttribute('aria-disabled', 'true')
  await expect(page.getByTestId('v-alert')).toHaveAttribute('data-state', 'disabled')
  await expect(page.getByTestId('v-alert-close')).toBeDisabled()
})

test('renders a full-width flex banner and stacks on a narrow viewport', async ({ page }) => {
  await mountAlert(page, { layout: 'banner' })
  await expect(page.getByTestId('v-alert')).toHaveCSS('display', 'flex')
  await page.setViewportSize({ width: 375, height: 800 })
  const box = await page.getByTestId('v-alert').boundingBox()
  expect(box?.width).toBeGreaterThan(300)
})

test('respects reduced motion for dismissal', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await mountAlert(page)
  const transition = await page.getByTestId('v-alert').evaluate((element) => getComputedStyle(element).transitionDuration)
  expect(transition).toBe('0s')
})
}
