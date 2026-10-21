// Detects Storybook/Vite error overlays, empty roots, page errors and console errors for every story.
// Usage: node scripts/check-stories.cjs [--filter regex] [--theme light|dark] [--out report.json]
const path = require('node:path')
const os = require('node:os')
const fs = require('node:fs')
if (!process.env.PLAYWRIGHT_BROWSERS_PATH) process.env.PLAYWRIGHT_BROWSERS_PATH = path.join(os.homedir(), 'AppData', 'Local', 'ms-playwright')
const { chromium } = require('@playwright/test')
const args = process.argv.slice(2)
const get = (k, d) => { const i = args.indexOf(k); return i >= 0 ? args[i + 1] : d }
const filter = new RegExp(get('--filter', '.'), 'i')
const themes = get('--theme', 'both') === 'both' ? ['light', 'dark'] : [get('--theme')]
const out = get('--out', '')
const BASE = process.env.STORYBOOK_URL || 'http://localhost:6006'
;(async () => {
  const index = await (await fetch(`${BASE}/index.json`)).json()
  const ids = Object.values(index.entries).filter((e) => e.type === 'story' && filter.test(e.id)).map((e) => e.id)
  const browser = await chromium.launch()
  const page = await browser.newPage({ viewport: { width: 1280, height: 800 }, reducedMotion: 'reduce' })
  const problems = []
  let ok = 0
  for (const id of ids) for (const theme of themes) {
    const errs = []
    const onErr = (e) => errs.push(`pageerror: ${e.message}`)
    const onCon = (m) => { if (m.type() === 'error') errs.push(`console: ${m.text().slice(0, 200)}`) }
    page.on('pageerror', onErr); page.on('console', onCon)
    try {
      await page.goto(`${BASE}/iframe.html?id=${id}&viewMode=story&globals=theme:${theme}`, { waitUntil: 'load' })
      await page.waitForTimeout(700)
      const r = await page.evaluate(() => {
        const root = document.querySelector('#storybook-root')
        const sb = document.querySelector('.sb-show-errordisplay')
        const sbMsg = document.querySelector('#error-message')?.textContent || ''
        return {
          overlay: !!document.querySelector('vite-error-overlay'),
          sbError: document.body.classList.contains('sb-show-errordisplay'),
          sbMsg: sbMsg.slice(0, 200),
          empty: !root || root.children.length === 0 || (root.innerText || '').trim() === '' && root.querySelectorAll('svg,img,canvas,input,button,[class]').length === 0,
          rect: root ? root.getBoundingClientRect().height : 0,
        }
      })
      const issues = []
      if (r.overlay) issues.push('vite-error-overlay')
      if (r.sbError) issues.push(`storybook-error: ${r.sbMsg}`)
      if (r.empty) issues.push('empty #storybook-root')
      issues.push(...errs.filter((e) => !/favicon|Failed to load resource.*(404)/.test(e)))
      if (issues.length) problems.push({ id, theme, issues }); else ok++
    } catch (e) { problems.push({ id, theme, issues: [`exception: ${e.message}`] }) }
    page.off('pageerror', onErr); page.off('console', onCon)
  }
  await browser.close()
  console.log(`checked ${ids.length} stories x ${themes.length} themes; clean: ${ok}; problems: ${problems.length}`)
  for (const p of problems) console.log(`${p.id} [${p.theme}] -> ${p.issues.join(' | ')}`)
  if (out) fs.writeFileSync(out, JSON.stringify({ checkedAt: new Date().toISOString(), stories: ids.length, problems }, null, 2))
})()
