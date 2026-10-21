#!/usr/bin/env node
/**
 * Storybook coverage check.
 * Uso: node scripts/storybook-coverage.cjs [url-do-storybook | caminho/index.json]
 *  - default: http://localhost:6007
 * Verifica, para cada export público de src/index.ts:
 *   (a) ao menos uma story  (b) uma docs entry (autodocs ou MDX)
 * Saída: tabela + evidence/docs-coverage.json. Exit 1 se algo público não tem story/docs.
 */
const fs = require('node:fs')
const path = require('node:path')
const root = path.resolve(__dirname, '..')
const src = (...p) => path.join(root, 'src', ...p)
const read = (f) => (fs.existsSync(f) ? fs.readFileSync(f, 'utf8') : '')

// ---------- 1. exports públicos ----------
const indexTs = read(src('index.ts'))
const compDirs = [...indexTs.matchAll(/export \* from '\.\/components\/([^/]+)\/([^']+)'/g)].map((m) => ({
  cat: m[1], dir: m[2], abs: src('components', m[1], m[2]),
}))

const units = [] // { kind, name, dir, impl, parts:[] }
for (const c of compDirs) {
  const idx = read(path.join(c.abs, 'index.ts'))
  const names = [...idx.matchAll(/export \{ default as (V\w+) \}/g)].map((m) => m[1])
  const main = names.find((n) => n === c.dir) || names[0] || c.dir
  const vue = path.join(c.abs, main + '.vue')
  const lines = read(vue).split('\n').length
  const implemented = fs.existsSync(vue) && lines > 3
  units.push({ kind: 'componente', name: main, dir: c.abs, implemented, parts: names.filter((n) => n !== main) })
}

// composables
const compFile = read(src('composables', 'index.ts'))
const composables = []
for (const m of compFile.matchAll(/export \* from '\.\/(\w+)'/g)) {
  const f = read(src('composables', m[1] + '.ts'))
  for (const fn of f.matchAll(/export function (use\w+)/g)) composables.push(fn[1])
}
const motionExports = []
for (const file of ['springs', 'gestures']) {
  for (const m of read(src('motion', file + '.ts')).matchAll(/export (?:function|const) (\w+)/g)) motionExports.push(m[1])
}
const tokenApi = [...read(src('tokens', 'live.ts')).matchAll(/^\s+(setToken|resetTokens|listTokens|KNOWN_TOKENS),/gm)].map((m) => m[1])

// pastas vazias / sem .vue = não implementado
const notImpl = []
for (const cat of fs.readdirSync(src('components'))) {
  if (cat.startsWith('_')) continue
  const catDir = src('components', cat)
  if (!fs.statSync(catDir).isDirectory()) continue
  for (const d of fs.readdirSync(catDir)) {
    if (!/^V/.test(d)) continue
    const dd = path.join(catDir, d)
    if (!fs.statSync(dd).isDirectory()) continue
    const hasVue = fs.readdirSync(dd).some((f) => /^V\w+\.vue$/.test(f))
    if (!hasVue) notImpl.push(`${cat}/${d}`)
  }
}

// ---------- 2. index.json ----------
async function loadIndex(arg) {
  if (fs.existsSync(arg)) return JSON.parse(fs.readFileSync(arg, 'utf8'))
  const url = arg.replace(/\/$/, '') + (arg.endsWith('.json') ? '' : '/index.json')
  const res = await fetch(url)
  if (!res.ok) throw new Error(`HTTP ${res.status} em ${url}`)
  return res.json()
}

;(async () => {
  const arg = process.argv[2] || 'http://localhost:6007'
  let index
  try { index = await loadIndex(arg) } catch (e) {
    console.error('Não foi possível ler index.json de', arg, '-', e.message); process.exit(2)
  }
  const entries = Object.values(index.entries || index.stories || {})
  const norm = (p) => path.resolve(root, p).replace(/\\/g, '/').toLowerCase()
  const withDir = entries.map((e) => ({ ...e, dir: path.dirname(norm(e.importPath)), file: norm(e.importPath) }))
  const sourceOf = (e) => read(path.resolve(root, e.importPath))

  const rows = []
  for (const u of units) {
    const dir = u.dir.replace(/\\/g, '/').toLowerCase()
    const vueRe = new RegExp('\\b' + u.name + '\\.vue')
    const here = withDir.filter((e) => e.dir === dir || vueRe.test(sourceOf(e)))
    const stories = here.filter((e) => e.type === 'story')
    const docs = here.filter((e) => e.type === 'docs')
    // sub-componentes devem aparecer em algum arquivo de story/mdx da pasta
    const text = [...new Set(here.map((e) => e.file))].map((f) => read(f)).join('\n')
    const missingParts = u.parts.filter((p) => !new RegExp('\\b' + p + '\\b').test(text))
    rows.push({
      kind: u.kind, name: u.name, implemented: u.implemented,
      stories: stories.length, docs: docs.length, missingParts,
      ok: !u.implemented || (stories.length > 0 && docs.length > 0 && missingParts.length === 0),
    })
  }

  const apiRows = []
  const check = (kind, name) => {
    const re = new RegExp('\\b' + name + '\\b')
    const hit = withDir.filter((e) => re.test(sourceOf(e)))
    const titles = [...new Set(hit.map((e) => e.title))]
    const stories = hit.filter((e) => e.type === 'story').length
    const docs = hit.filter((e) => e.type === 'docs').length
    apiRows.push({ kind, name, implemented: true, stories, docs, missingParts: [], ok: stories > 0 && docs > 0, titles: titles.slice(0, 3) })
  }
  composables.forEach((n) => check('composable', n))
  tokenApi.forEach((n) => check('tokens', n))
  motionExports.forEach((n) => check('motion', n))

  const all = [...rows, ...apiRows]
  const pad = (s, n) => String(s).padEnd(n)
  console.log(pad('TIPO', 11), pad('NOME', 28), pad('STORIES', 8), pad('DOCS', 5), 'STATUS')
  for (const r of all) {
    const st = r.ok ? 'OK' : 'FALHA' + (r.missingParts.length ? ` (sem story p/ ${r.missingParts.join(', ')})` : '')
    console.log(pad(r.kind, 11), pad(r.name, 28), pad(r.stories, 8), pad(r.docs, 5), st)
  }
  const failures = all.filter((r) => !r.ok)
  const total = all.length
  const pct = Math.round(((total - failures.length) / total) * 1000) / 10
  console.log(`\nCobertura: ${total - failures.length}/${total} (${pct}%)  | stories totais: ${entries.filter((e) => e.type === 'story').length}, docs: ${entries.filter((e) => e.type === 'docs').length}`)
  console.log(`Não implementado (pasta sem .vue, não é falha): ${notImpl.length}`)
  notImpl.forEach((n) => console.log('  - ' + n))

  const out = { generatedAt: new Date().toISOString(), source: arg, total, covered: total - failures.length, percent: pct, failures: failures.map((f) => f.name), rows: all, naoImplementado: notImpl }
  fs.mkdirSync(path.join(root, 'evidence'), { recursive: true })
  fs.writeFileSync(path.join(root, 'evidence', 'docs-coverage.json'), JSON.stringify(out, null, 2))
  if (failures.length) { console.error('\nFALHAS:', failures.map((f) => f.name).join(', ')); process.exit(1) }
})()
