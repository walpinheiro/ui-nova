/**
 * Capture validation harness screenshots for lote 1 + 2 components.
 * Usage: node scripts/capture-evidence.cjs
 * Requires harness server at http://localhost:8321 (pnpm harness)
 */
const fs = require('node:fs')
const path = require('node:path')
const { chromium } = require('@playwright/test')

const BASE = 'http://localhost:8321'
const OUT = path.join(__dirname, '..', 'doc', 'evidence')

const COMPONENTS = [
  // lote 1 — containment
  'VCard', 'VPanel', 'VSection', 'VSheet', 'VSplitView',
  'VInspectorPanel', 'VResizablePanel', 'VWindow',
  // lote 2 — navigation
  'VTabs', 'VBreadcrumb', 'VDropdownMenu', 'VPopover', 'VSidebar',
  'VToolbar', 'VCommandPalette', 'VSegmentedControl', 'VTreeNavigation', 'VPagination',
  // lote 3 — feedback
  'VBadge',
]

async function main() {
  fs.mkdirSync(OUT, { recursive: true })
  const browser = await chromium.launch()
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } })

  for (const name of COMPONENTS) {
    const url = `${BASE}/${name}.html`
    try {
      await page.goto(url, { waitUntil: 'networkidle', timeout: 15000 })
      await page.waitForFunction(() => window.__ready === true, { timeout: 10000 })
      if (name === 'VPopover') {
        await page.locator('#st-default [data-test-id="v-popover-trigger"]').first().click()
        await page.waitForSelector('[data-test-id="v-popover-container"]', { state: 'visible', timeout: 5000 })
      }
      if (name === 'VDropdownMenu') {
        await page.locator('#st-open [data-test-id="dropdown-trigger"]').first().click()
        await page.waitForSelector('[data-test-id="dropdown-menu"]', { state: 'visible', timeout: 5000 })
      }
      await page.waitForTimeout(300)
      const outPath = path.join(OUT, `${name}.png`)
      await page.screenshot({ path: outPath, fullPage: true })
      console.log(`✓ ${name}`)
    } catch (err) {
      console.error(`✗ ${name}: ${err.message}`)
    }
  }

  await browser.close()
  console.log(`\nEvidence saved to ${OUT}`)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
