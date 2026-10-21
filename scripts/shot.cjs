// Story screenshot tool.
// Usage: node scripts/shot.cjs --filter <substr|regex> [--theme light|dark|both] [--out dir]
//        [--width 1280] [--height 800] [--full] [--list] [--wait ms] [--motion]
const path = require('node:path')
const os = require('node:os')
const fs = require('node:fs')

if (!process.env.PLAYWRIGHT_BROWSERS_PATH) {
  process.env.PLAYWRIGHT_BROWSERS_PATH = path.join(os.homedir(), 'AppData', 'Local', 'ms-playwright')
}
const { chromium } = require('@playwright/test')

const args = process.argv.slice(2)
const opt = { theme: 'light', out: 'evidence/shots', width: 1280, height: 800, full: false, list: false, wait: 600, motion: false, filter: '' }
for (let i = 0; i < args.length; i++) {
  const a = args[i]
  if (a === '--filter') opt.filter = args[++i]
  else if (a === '--theme') opt.theme = args[++i]
  else if (a === '--out') opt.out = args[++i]
  else if (a === '--width') opt.width = Number(args[++i])
  else if (a === '--height') opt.height = Number(args[++i])
  else if (a === '--full') opt.full = true
  else if (a === '--list') opt.list = true
  else if (a === '--wait') opt.wait = Number(args[++i])
  else if (a === '--motion') opt.motion = true
}
const BASE = process.env.STORYBOOK_URL || 'http://localhost:6006'

;(async () => {
  if (!opt.filter && !opt.list) {
    console.error('Usage: node scripts/shot.cjs --filter <substr|regex> [--theme light|dark|both] [--out dir] [--width 1280] [--height 800] [--full] [--list] [--wait ms] [--motion]')
    process.exit(1)
  }
  const index = await (await fetch(`${BASE}/index.json`)).json()
  let re
  try { re = new RegExp(opt.filter || '.', 'i') } catch { re = null }
  const ids = Object.values(index.entries)
    .filter((e) => e.type === 'story' && (re ? re.test(e.id) : e.id.includes(opt.filter)))
    .map((e) => e.id)
  if (opt.list) { console.log(ids.join('\n')); return }
  if (!ids.length) { console.error('No stories matched'); process.exit(1) }
  const themes = opt.theme === 'both' ? ['light', 'dark'] : [opt.theme]
  fs.mkdirSync(opt.out, { recursive: true })
  const browser = await chromium.launch()
  const page = await browser.newPage({ viewport: { width: opt.width, height: opt.height }, reducedMotion: opt.motion ? 'no-preference' : 'reduce' })
  const saved = []
  for (const id of ids) {
    for (const theme of themes) {
      try {
        await page.goto(`${BASE}/iframe.html?id=${id}&viewMode=story&globals=theme:${theme}`, { waitUntil: 'load' })
        await page.waitForFunction(() => { const r = document.querySelector('#storybook-root'); return r && r.children.length > 0 }, null, { timeout: 15000 })
        await page.waitForLoadState('networkidle').catch(() => {})
        await page.waitForTimeout(opt.wait)
        const file = path.join(opt.out, `${id}--${theme}.png`)
        await page.screenshot({ path: file, fullPage: opt.full })
        saved.push(file)
      } catch (e) {
        console.error(`FAIL ${id} (${theme}): ${e.message}`)
      }
    }
  }
  await browser.close()
  console.log(saved.join('\n'))
})()
