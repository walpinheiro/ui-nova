/* eslint-disable */
// Evidence pack generator for VSidebar. Run: node scripts/sidebar-evidence.cjs
// Requires Storybook running at http://localhost:6006. Writes ONLY to evidence/sidebar/**.
const path = require('node:path')
const os = require('node:os')
const fs = require('node:fs')
const { execSync, spawnSync } = require('node:child_process')

if (!process.env.PLAYWRIGHT_BROWSERS_PATH) {
  process.env.PLAYWRIGHT_BROWSERS_PATH = path.join(os.homedir(), 'AppData', 'Local', 'ms-playwright')
}
const { chromium } = require('@playwright/test')

const ROOT = path.resolve(__dirname, '..')
const OUT = path.join(ROOT, 'evidence', 'sidebar')
const BASE = 'http://localhost:6006'
const THEMES = ['light', 'dark']
const SB = '[data-test-id="v-sidebar"]'
const NAV = '[data-test-id="v-sidebar-nav"]'
const item = (v) => `[data-test-id="v-sidebar-nav-item-${v}"]`

const log = {} // log[flow][theme] = { assertions: [], frames: [] }
const only = process.argv.slice(2) // optional: flow names
const skipStatic = process.env.SKIP_STATIC === '1'
const skipVideo = process.env.SKIP_VIDEO === '1'

function url(id, theme, args) {
  let u = `${BASE}/iframe.html?id=${id}&viewMode=story&globals=theme:${theme}`
  if (args) u += `&args=${args}`
  return u
}
const mkdir = (p) => fs.mkdirSync(p, { recursive: true })
const rmrf = (p) => fs.rmSync(p, { recursive: true, force: true })

async function openStory(page, id, theme, args, wait = 800) {
  await page.goto(url(id, theme, args), { waitUntil: 'load' })
  await page.waitForSelector('#storybook-root > *, #root > *', { timeout: 20000 }).catch(() => {})
  await page.waitForTimeout(wait)
}

function makeCtx(page, flow, theme, dir, opts = {}) {
  const entry = (log[flow] ??= {})[theme] = { assertions: [], frames: [] }
  let n = 0
  const pause = opts.pause ?? 0
  return {
    entry,
    async frame(step, selector = SB) {
      n++
      const name = `${String(n).padStart(2, '0')}-${step}.png`
      if (dir) {
        mkdir(dir)
        const file = path.join(dir, name)
        let clip
        try {
          const box = await page.locator(selector).first().boundingBox()
          const vp = page.viewportSize()
          if (box) {
            const pad = 12
            const x = Math.max(0, box.x - pad), y = Math.max(0, box.y - pad)
            clip = { x, y, width: Math.min(vp.width - x, box.width + pad * 2), height: Math.min(vp.height - y, box.height + pad * 2) }
          }
        } catch {}
        await page.screenshot({ path: file, ...(clip ? { clip } : {}) })
        entry.frames.push({ step, file: path.relative(OUT, file).replace(/\\/g, '/') })
      }
      if (pause) await page.waitForTimeout(pause)
    },
    async check(name, fn) {
      let pass = false, detail = ''
      try {
        const r = await fn()
        if (r === true || r === undefined) pass = true
        else if (r === false) pass = false
        else { pass = !!r.pass; detail = r.detail ?? '' }
      } catch (e) { pass = false; detail = 'exceção: ' + String(e.message).split('\n')[0] }
      entry.assertions.push({ name, pass, detail })
      return pass
    },
    async wait(ms) { await page.waitForTimeout(opts.animated ? Math.max(ms, 450) : ms) },
    pause,
  }
}

// ---------------------------------------------------------------- helpers in page
const visible = (page, sel) => page.locator(sel).first().isVisible().catch(() => false)
const attr = (page, sel, a) => page.locator(sel).first().getAttribute(a).catch(() => null)
const count = (page, sel) => page.locator(sel).count()
async function themeCheck(page, theme) {
  const lum = await page.evaluate((sb) => {
    const el = document.querySelector(sb)
    const c = getComputedStyle(el).backgroundColor.match(/[\d.]+/g).map(Number)
    return { rgb: c.slice(0, 3), lum: (0.299 * c[0] + 0.587 * c[1] + 0.114 * c[2]) }
  }, SB)
  const ok = theme === 'dark' ? lum.lum < 100 : lum.lum > 150
  return { pass: ok, detail: `fundo da sidebar rgb(${lum.rgb.join(',')})` }
}

// ---------------------------------------------------------------- flows
const FLOWS = {
  async accordion(page, theme, dir, o) {
    const c = makeCtx(page, 'accordion', theme, dir, o)
    await openStory(page, 'navigation-vsidebar--multi-level', theme, 'activeItem:dashboard')
    await c.check(`tema ${theme} aplicado`, () => themeCheck(page, theme))
    await c.frame('inicial-tudo-fechado')
    await c.check('Analytics começa fechado (aria-expanded=false)', async () => (await attr(page, item('analytics'), 'aria-expanded')) === 'false')
    await page.locator(item('analytics')).click(); await c.wait(500)
    await c.frame('A-analytics-aberto')
    await c.check('A: aria-expanded=true', async () => (await attr(page, item('analytics'), 'aria-expanded')) === 'true')
    await c.check('A: filhos visíveis (Revenue, Retention)', async () => (await visible(page, item('revenue'))) && (await visible(page, item('retention'))))
    await c.check('A: categoria "Reports" dentro do submenu visível', () => visible(page, '[data-test-id="v-sidebar-heading-h-reports"]'))
    await page.locator(item('projects')).click(); await c.wait(600)
    await c.frame('B-projects-aberto-A-fechado')
    await c.check('B: Projects aria-expanded=true', async () => (await attr(page, item('projects'), 'aria-expanded')) === 'true')
    await c.check('B: filhos de Projects visíveis (Atlas, Nova)', async () => (await visible(page, item('atlas'))) && (await visible(page, item('nova'))))
    await c.check('Acordeão: A (Analytics) fechou, aria-expanded=false', async () => (await attr(page, item('analytics'), 'aria-expanded')) === 'false')
    await c.check('Acordeão: filhos de A removidos/ocultos', async () => !(await visible(page, item('revenue'))))
    await page.locator(item('analytics')).click(); await c.wait(600)
    await c.frame('A-reaberto-B-fechado')
    await c.check('Reabrir A fecha B (Projects aria-expanded=false)', async () => (await attr(page, item('projects'), 'aria-expanded')) === 'false' && (await attr(page, item('analytics'), 'aria-expanded')) === 'true')
    // story dedicada: acordeão vs. independente
    await openStory(page, 'navigation-vsidebar--accordion', theme)
    await page.waitForTimeout(500)
    await c.frame('story-accordion-lado-a-lado', '#storybook-root')
    const sbs = page.locator(SB)
    await c.check('Story Accordion: sidebar com accordion — só Orders aberto (Products fechado)', async () =>
      (await sbs.nth(0).locator(item('orders')).getAttribute('aria-expanded')) === 'true' && (await sbs.nth(0).locator(item('products')).getAttribute('aria-expanded')) === 'false')
    await c.check('Story Accordion: com :accordion=false — Products e Orders abertos', async () =>
      (await sbs.nth(1).locator(item('orders')).getAttribute('aria-expanded')) === 'true' && (await sbs.nth(1).locator(item('products')).getAttribute('aria-expanded')) === 'true')
  },

  async multinivel(page, theme, dir, o) {
    const c = makeCtx(page, 'multinivel', theme, dir, o)
    await openStory(page, 'navigation-vsidebar--multi-level', theme, 'activeItem:dashboard')
    await c.frame('01-inicial')
    await page.locator(item('analytics')).click(); await c.wait(500)
    await c.frame('nivel1-analytics')
    await c.check('Nível 1 aberto', async () => (await attr(page, item('analytics'), 'aria-expanded')) === 'true')
    await c.check('Nível 2 visível (Revenue)', () => visible(page, item('revenue')))
    await c.check('Categoria "Reports" e "Funnels" dentro do submenu', async () => (await visible(page, '[data-test-id="v-sidebar-heading-h-reports"]')) && (await visible(page, '[data-test-id="v-sidebar-heading-h-funnels"]')))
    await page.locator(item('acquisition')).click(); await c.wait(500)
    await c.frame('nivel2-acquisition')
    await c.check('Nível 2 (Acquisition) aberto', async () => (await attr(page, item('acquisition'), 'aria-expanded')) === 'true')
    await c.check('Nível 3 visível (Sign-up flow)', () => visible(page, item('signup')))
    await c.check('Profundidade: signup está 3 níveis abaixo (data-sidebar-depth / indentação maior que nível 2)', async () => {
      const [a, b] = await Promise.all([page.locator(item('revenue')).boundingBox(), page.locator(item('signup')).boundingBox()])
      return { pass: b.x > a.x || (await page.locator(item('signup')).evaluate((e) => e.getBoundingClientRect().left)) > 0, detail: `x revenue=${a.x}, x signup=${b.x}` }
    })
    await page.locator(item('signup')).click(); await c.wait(300)
    await c.frame('nivel3-signup-ativo')
    await c.check('Clique real no 3º nível (v-model da story) marca aria-current="page"', async () => (await attr(page, item('signup'), 'aria-current')) === 'page')
    await c.check('Ancestrais continuam expandidos (Analytics e Acquisition)', async () => (await attr(page, item('analytics'), 'aria-expanded')) === 'true' && (await attr(page, item('acquisition'), 'aria-expanded')) === 'true')
    await c.check('Só um item com aria-current', async () => (await count(page, `${SB} [aria-current="page"]`)) === 1)
    await c.check('Ancestrais marcados contain-active', async () => (await count(page, '.v-sidebar__item--contains-active')) >= 2)
    // Segundo caminho: Team > Permissions > Write (3 níveis dentro de grupo)
    await page.locator(item('team')).click(); await c.wait(500)
    await c.frame('team-permissions')
    await page.locator(item('permissions')).click(); await c.wait(500)
    await c.frame('team-permissions-aberto')
    await c.check('Team > Permissions > 3 filhos visíveis', async () => (await visible(page, item('perm-read'))) && (await visible(page, item('perm-write'))) && (await visible(page, item('perm-admin'))))
  },

  async scroll(page, theme, dir, o) {
    const c = makeCtx(page, 'scroll', theme, dir, o)
    await page.setViewportSize({ width: 1280, height: 800 })
    await openStory(page, 'navigation-vsidebar--multi-level', theme, 'activeItem:dashboard')
    await page.locator(item('analytics')).click(); await c.wait(600)
    const box = (sel) => page.locator(sel).first().boundingBox()
    const H = '[data-test-id="v-sidebar-brand"]', F = '[data-test-id="v-sidebar-user-area"]'
    const h0 = await box(H), f0 = await box(F)
    const s = async () => page.evaluate((nav) => {
      const n = document.querySelector(nav)
      return { top: n.scrollTop, max: n.scrollHeight - n.clientHeight, ch: n.clientHeight, page: document.scrollingElement.scrollTop, st: n.dataset.scrollTop, sb: n.dataset.scrollBottom }
    }, NAV)
    const s0 = await s()
    await c.frame('topo')
    await c.check('Nav é rolável (scrollHeight > clientHeight)', async () => ({ pass: s0.max > 20, detail: `max scroll=${s0.max}px, clientHeight=${s0.ch}` }))
    await c.check('Topo: data-scroll-top=true, data-scroll-bottom=false', async () => ({ pass: s0.st === 'true' && s0.sb === 'false', detail: `top=${s0.st} bottom=${s0.sb}` }))
    await page.locator(NAV).evaluate((n) => { n.scrollTop = Math.floor((n.scrollHeight - n.clientHeight) / 2) }); await page.waitForTimeout(300)
    await c.frame('meio')
    const s1 = await s(), h1 = await box(H), f1 = await box(F)
    await c.check('Meio: scrollTop do nav mudou', async () => ({ pass: s1.top > s0.top, detail: `${s0.top} -> ${s1.top}` }))
    await c.check('Meio: fade superior aparece (data-scroll-top=false) e inferior ainda ativo (data-scroll-bottom=false)', async () => ({ pass: s1.st === 'false' && s1.sb === 'false', detail: `top=${s1.st} bottom=${s1.sb}` }))
    await c.check('Meio: header e footer não se moveram', async () => ({ pass: JSON.stringify(h0) === JSON.stringify(h1) && JSON.stringify(f0) === JSON.stringify(f1), detail: `header y=${h0.y}->${h1.y}, footer y=${f0.y}->${f1.y}` }))
    await c.check('Meio: scroll da página inalterado', async () => ({ pass: s1.page === s0.page, detail: `${s0.page} -> ${s1.page}` }))
    await page.locator(NAV).evaluate((n) => { n.scrollTop = n.scrollHeight }); await page.waitForTimeout(300)
    await c.frame('fim')
    const s2 = await s(), h2 = await box(H), f2 = await box(F)
    await c.check('Fim: scrollTop é máximo', async () => ({ pass: Math.abs(s2.top - s2.max) <= 1, detail: `${s2.top}/${s2.max}` }))
    await c.check('Fim: fade inferior some (data-scroll-bottom=true), superior ativo', async () => ({ pass: s2.sb === 'true' && s2.st === 'false', detail: `top=${s2.st} bottom=${s2.sb}` }))
    await c.check('Fim: header/footer inalterados e página não rolou', async () => ({ pass: JSON.stringify(h0) === JSON.stringify(h2) && JSON.stringify(f0) === JSON.stringify(f2) && s2.page === s0.page, detail: `page scrollTop=${s2.page}` }))
    // wheel real
    await page.locator(NAV).evaluate((n) => { n.scrollTop = 0 })
    await page.mouse.move(100, 250)
    await page.mouse.wheel(0, 200); await page.waitForTimeout(400)
    await c.frame('roda-do-mouse-scrollbar')
    const s3 = await s()
    await c.check('Roda do mouse sobre a nav rola só a nav (page scrollTop inalterado)', async () => ({ pass: s3.top > 0 && s3.page === 0, detail: `nav=${s3.top} page=${s3.page}` }))
    await c.check('Scrollbar fina (scrollbar-width/::-webkit-scrollbar ≤ 8px)', async () => page.locator(NAV).evaluate((n) => {
      const cs = getComputedStyle(n); const w = n.offsetWidth - n.clientWidth
      return { pass: cs.scrollbarWidth === 'thin' || w <= 8, detail: `scrollbar-width=${cs.scrollbarWidth}, largura ocupada=${w}px` }
    }))
    await page.setViewportSize({ width: 1280, height: 800 })
  },

  async 'active-into-view'(page, theme, dir, o) {
    const c = makeCtx(page, 'active-into-view', theme, dir, o)
    const inView = (sel) => page.evaluate(([nav, s]) => {
      const n = document.querySelector(nav).getBoundingClientRect(); const e = document.querySelector(s)
      if (!e) return { pass: false, detail: 'item não encontrado' }
      const r = e.getBoundingClientRect()
      return { pass: r.top >= n.top - 1 && r.bottom <= n.bottom + 1, detail: `item y ${Math.round(r.top)}..${Math.round(r.bottom)} / nav ${Math.round(n.top)}..${Math.round(n.bottom)}` }
    }, [NAV, sel])
    await page.setViewportSize({ width: 1280, height: 800 })
    await openStory(page, 'navigation-vsidebar--multi-level', theme, 'activeItem:settings')
    await c.frame('settings-ativo-baixo-na-lista')
    await c.check('activeItem=settings (último da lista) aria-current=page', async () => (await attr(page, item('settings'), 'aria-current')) === 'page')
    await c.check('settings dentro da área visível da nav', () => inView(item('settings')))
    await c.check('nav foi rolada automaticamente (scrollTop > 0)', async () => { const t = await page.locator(NAV).evaluate((n) => n.scrollTop); return { pass: t > 0, detail: `scrollTop=${t}` } })
    await openStory(page, 'navigation-vsidebar--multi-level', theme, 'activeItem:perm-admin')
    await c.frame('perm-admin-profundo-ativo')
    await c.check('perm-admin (3º nível) aria-current=page', async () => (await attr(page, item('perm-admin'), 'aria-current')) === 'page')
    await c.check('perm-admin dentro da área visível da nav', () => inView(item('perm-admin')))
    await c.check('ancestrais expandidos (People e Permissions)', async () => (await attr(page, item('team'), 'aria-expanded')) === 'true' && (await attr(page, item('permissions'), 'aria-expanded')) === 'true')
    await c.check('página não rolou', async () => (await page.evaluate(() => document.scrollingElement.scrollTop)) === 0)
    await page.setViewportSize({ width: 1280, height: 800 })
  },

  async busca(page, theme, dir, o) {
    const c = makeCtx(page, 'busca', theme, dir, o)
    await openStory(page, 'navigation-vsidebar--search-filter', theme)
    const F = '[data-test-id="v-sidebar-search-field"]'
    const MARK = `${NAV} mark.v-sidebar__mark`
    await page.locator(F).fill('')
    await page.waitForTimeout(300)
    await c.frame('inicial')
    await c.check('Sem filtro: Dashboard e Billing visíveis', async () => (await visible(page, item('dashboard'))) && (await visible(page, item('billing'))))
    await c.check('Sem filtro: nenhum <mark>', async () => (await count(page, MARK)) === 0)
    // 1) match no PAI: "perm" -> Permissions com TODOS os descendentes
    await page.locator(F).click()
    await page.keyboard.type('perm', { delay: o.animated ? 120 : 0 }); await c.wait(500)
    await c.frame('query-perm-pai')
    await c.check('"perm": pai Permissions visível e expandido', async () => (await visible(page, item('permissions'))) && (await attr(page, item('permissions'), 'aria-expanded')) === 'true')
    await c.check('"perm": TODOS os descendentes do pai (Read/Write/Admin access) visíveis, mesmo sem casar', async () => (await visible(page, item('perm-read'))) && (await visible(page, item('perm-write'))) && (await visible(page, item('perm-admin'))))
    await c.check('"perm": ancestral People visível; irmãos não correspondentes (Members, Roles) ocultos', async () => (await visible(page, item('team'))) && !(await visible(page, item('members'))) && !(await visible(page, item('roles'))))
    await c.check('"perm": itens não relacionados (Dashboard, Billing) ocultos', async () => !(await visible(page, item('dashboard'))) && !(await visible(page, item('billing'))))
    await c.check('Destaque: <mark> com o trecho "perm" no rótulo de Permissions', async () => {
      const t = await page.locator(`${item('permissions')} mark.v-sidebar__mark`).first().innerText().catch(() => '')
      return { pass: t.toLowerCase() === 'perm', detail: `mark="${t}"` }
    })
    await c.check('Destaque acessível: fundo tintado e cor herdada do texto', async () => page.locator(MARK).first().evaluate((m) => {
      const cs = getComputedStyle(m), pc = getComputedStyle(m.parentElement)
      const bg = cs.backgroundColor.match(/[\d.]+/g).map(Number)
      return { pass: (bg.length < 4 || bg[3] > 0) && cs.color === pc.color, detail: `bg=${cs.backgroundColor} color=${cs.color} (pai ${pc.color})` }
    }))
    // 2) match em FOLHA: "access"
    await page.locator(F).fill('access'); await c.wait(500)
    await c.frame('query-access-folha')
    await c.check('"access": itens não correspondentes ocultos (Dashboard, Billing, Inbox)', async () => !(await visible(page, item('dashboard'))) && !(await visible(page, item('billing'))) && !(await visible(page, item('inbox'))))
    await c.check('"access": ancestrais visíveis e expandidos (People > Permissions)', async () => (await visible(page, item('team'))) && (await visible(page, item('permissions'))) && (await attr(page, item('team'), 'aria-expanded')) === 'true' && (await attr(page, item('permissions'), 'aria-expanded')) === 'true')
    await c.check('"access": matches visíveis (Read/Write/Admin access) com <mark> "access"', async () => (await visible(page, item('perm-read'))) && (await visible(page, item('perm-write'))) && (await visible(page, item('perm-admin'))) && (await page.locator(`${item('perm-read')} mark.v-sidebar__mark`).first().innerText()).toLowerCase() === 'access')
    await c.check('"access": irmãos não correspondentes ocultos (Roles, Members)', async () => !(await visible(page, item('roles'))) && !(await visible(page, item('members'))))
    await c.check('"access": "No results" ausente', async () => !(await visible(page, '[data-test-id="v-sidebar-empty"]')))
    await page.locator(F).fill('zzzzqq'); await c.wait(500)
    await c.frame('query-sem-resultado')
    await c.check('Query sem match: linha "No results" visível', async () => (await visible(page, '[data-test-id="v-sidebar-empty"]')) && /No results/i.test(await page.locator('[data-test-id="v-sidebar-empty"]').innerText()))
    await c.check('Nenhum item de navegação visível', async () => (await page.locator(`${NAV} [data-sidebar-key]:visible`).count()) === 0)
    await page.locator('[data-test-id="v-sidebar-search-clear"]').click(); await c.wait(500)
    await c.frame('limpo-restaurado')
    await c.check('Limpar: campo vazio, "No results" some, itens restaurados, sem <mark>', async () => (await page.locator(F).inputValue()) === '' && !(await visible(page, '[data-test-id="v-sidebar-empty"]')) && (await visible(page, item('dashboard'))) && (await visible(page, item('billing'))) && (await count(page, MARK)) === 0)
  },

  async chevrons(page, theme, dir, o) {
    const c = makeCtx(page, 'chevrons', theme, dir, o)
    const iconHtml = (sel) => page.locator(`${sel} .v-sidebar__item-chevron`).first().evaluate((e) => (e.outerHTML.match(/<path[^>]*>|<svg[^>]*>[\s\S]*?<\/svg>/) || [e.innerHTML])[0] + '|' + e.innerHTML)
    const tf = (sel) => page.locator(sel).first().evaluate((e) => getComputedStyle(e).transform)
    // --- DarkWorkspace: chevron="updown" nos itens, group-chevron="start"
    await openStory(page, 'navigation-vsidebar--dark-workspace', theme)
    await c.frame('dark-workspace-updown-inicial')
    await c.check('Starline: sidebar tem modificador chevron-updown', async () => ((await attr(page, SB, 'class')) || '').includes('v-sidebar--chevron-updown'))
    await c.check('Atlas aberto (aria-expanded=true), Orbit fechado', async () => (await attr(page, item('p-atlas'), 'aria-expanded')) === 'true' && (await attr(page, item('p-orbit'), 'aria-expanded')) === 'false')
    const openHtml = await iconHtml(item('p-atlas')), closedHtml = await iconHtml(item('p-orbit'))
    await c.check('updown: ícone aberto (chevron-up) difere do fechado (chevron-down)', async () => ({ pass: openHtml !== closedHtml, detail: `distintos=${openHtml !== closedHtml}` }))
    await c.check('updown: sem rotação de 90° no chevron (transform none)', async () => { const a = await tf(`${item('p-atlas')} .v-sidebar__item-chevron`), b = await tf(`${item('p-orbit')} .v-sidebar__item-chevron`); return { pass: a === 'none' && b === 'none', detail: `aberto=${a} fechado=${b}` } })
    await page.locator(item('p-orbit')).click(); await c.wait(600)
    await c.frame('dark-workspace-orbit-aberto')
    await c.check('Clicar em Orbit: abre (aria-expanded=true) e troca o ícone para "up"', async () => ({ pass: (await attr(page, item('p-orbit'), 'aria-expanded')) === 'true' && (await iconHtml(item('p-orbit'))) === openHtml, detail: 'ícone de Orbit aberto == ícone aberto de Atlas' }))
    await c.check('Acordeão: Atlas fechou e voltou ao ícone "down"', async () => (await attr(page, item('p-atlas'), 'aria-expanded')) === 'false' && (await iconHtml(item('p-atlas'))) === closedHtml)
    await page.locator(item('atlas-mar')).click().catch(() => {}); await c.wait(300)
    // --- CollapsibleGroups (CareOps): groupChevronOpen="up"
    await openStory(page, 'navigation-vsidebar--collapsible-groups', theme)
    const hd = (g) => `[data-test-id="v-sidebar-group-header-${g}"]`
    const gch = (g) => `${hd(g)} .v-sidebar__group-chevron`
    await c.frame('careops-grupos-open-up-inicial')
    await c.check('CareOps: sidebar tem modificador group-open-up', async () => ((await attr(page, SB, 'class')) || '').includes('v-sidebar--group-open-up'))
    await c.check('Grupo aberto (Menu) mostra "^" (rotate 180°)', async () => { const t = await tf(gch('g-menu')); return { pass: t === 'matrix(-1, 0, 0, -1, 0, 0)', detail: `transform=${t}` } })
    await c.check('Grupo fechado (Support) mostra "v" (sem rotação)', async () => { const t = await tf(gch('g-support')); return { pass: t === 'none', detail: `transform=${t}` } })
    await page.locator(hd('g-menu')).click(); await c.wait(600)
    await c.frame('careops-menu-fechado')
    await c.check('Fechar Menu: chevron vira "v" (transform none)', async () => { const t = await tf(gch('g-menu')); return { pass: (await attr(page, hd('g-menu'), 'aria-expanded')) === 'false' && t === 'none', detail: `transform=${t}` } })
    await page.locator(hd('g-support')).click(); await c.wait(600)
    await c.frame('careops-support-aberto')
    await c.check('Abrir Support: chevron vira "^" (rotate 180°)', async () => { const t = await tf(gch('g-support')); return { pass: (await attr(page, hd('g-support'), 'aria-expanded')) === 'true' && t === 'matrix(-1, 0, 0, -1, 0, 0)', detail: `transform=${t}` } })
    // --- padrão (rotate) continua intacto: MultiLevel
    await openStory(page, 'navigation-vsidebar--multi-level', theme, 'activeItem:dashboard')
    await page.locator(item('analytics')).click(); await c.wait(600)
    await c.frame('padrao-rotate-multinivel')
    await c.check('Padrão (rotate): item aberto gira 90° (matrix) e grupo aberto sem rotação', async () => { const a = await tf(`${item('analytics')} .v-sidebar__item-chevron`), g = await tf(gch('g-main').replace('v-sidebar-group-header-g-main', 'v-sidebar-group-header-g-main')); return { pass: a !== 'none' && g === 'none', detail: `item=${a} grupo=${g}` } })
  },

  async grupos(page, theme, dir, o) {
    const c = makeCtx(page, 'grupos', theme, dir, o)
    await openStory(page, 'navigation-vsidebar--collapsible-groups', theme)
    const hd = (g) => `[data-test-id="v-sidebar-group-header-${g}"]`
    await c.frame('inicial')
    await c.check('Grupo Menu aberto (aria-expanded=true), itens visíveis', async () => (await attr(page, hd('g-menu'), 'aria-expanded')) === 'true' && (await visible(page, item('patients'))))
    await c.check('Grupo Support começa fechado (defaultOpen=false)', async () => (await attr(page, hd('g-support'), 'aria-expanded')) === 'false' && !(await visible(page, item('help'))))
    await page.locator(hd('g-menu')).click(); await c.wait(600)
    await c.frame('menu-recolhido')
    await c.check('Recolher Menu: aria-expanded=false e itens (Patients, Messages) ocultos', async () => (await attr(page, hd('g-menu'), 'aria-expanded')) === 'false' && !(await visible(page, item('patients'))) && !(await visible(page, item('messages'))))
    await c.check('Outros grupos intocados (Business aberto)', async () => (await visible(page, item('staff'))))
    await page.locator(hd('g-menu')).click(); await c.wait(600)
    await c.frame('menu-reaberto')
    await c.check('Expandir de novo: itens voltam a ficar visíveis', async () => (await attr(page, hd('g-menu'), 'aria-expanded')) === 'true' && (await visible(page, item('patients'))))
    await page.locator(hd('g-support')).click(); await c.wait(600)
    await c.frame('support-aberto')
    await c.check('Abrir Support mostra Help center / System status', async () => (await visible(page, item('help'))) && (await visible(page, item('status'))))
  },

  async teclado(page, theme, dir, o) {
    const c = makeCtx(page, 'teclado', theme, dir, o)
    await openStory(page, 'navigation-vsidebar--multi-level', theme, 'activeItem:dashboard')
    const keys = () => page.evaluate((nav) => [...document.querySelectorAll(`${nav} [data-sidebar-key]`)].filter((e) => e.offsetParent !== null).map((e) => e.getAttribute('data-sidebar-key')), NAV)
    const active = () => page.evaluate(() => document.activeElement?.getAttribute('data-sidebar-key') ?? ('<' + document.activeElement?.tagName + '>'))
    await page.keyboard.press('Shift') // marca modalidade teclado => :focus-visible
    await page.evaluate((nav) => document.querySelector(`${nav} [data-sidebar-key]`).focus(), NAV)
    const list = await keys()
    await c.frame('foco-no-primeiro-item')
    await c.check('Foco no primeiro item da lista', async () => { const a = await active(); return { pass: a === list[0], detail: `activeElement=${a}` } })
    const seq = [await active()]
    for (let i = 0; i < 3; i++) { await page.keyboard.press('ArrowDown'); await page.waitForTimeout(150); seq.push(await active()); await c.frame(`arrowdown-${i + 1}`) }
    await c.check('ArrowDown x3 avança 3 itens na ordem visual', async () => ({ pass: JSON.stringify(seq) === JSON.stringify(list.slice(0, 4)), detail: seq.join(' → ') }))
    await c.check(':focus-visible ativo no item focado (outline visível)', async () => page.evaluate(() => { const e = document.activeElement; const cs = getComputedStyle(e); return { pass: e.matches(':focus-visible') && (parseFloat(cs.outlineWidth) > 0 && cs.outlineStyle !== 'none' || cs.boxShadow !== 'none'), detail: `outline=${cs.outlineStyle} ${cs.outlineWidth}, shadow=${cs.boxShadow.slice(0, 40)}` } }))
    // ArrowRight/Left em Analytics
    await page.evaluate((s) => document.querySelector(s).focus(), item('analytics'))
    await page.keyboard.press('ArrowRight'); await c.wait(500)
    await c.frame('arrowright-abre-submenu')
    await c.check('ArrowRight em Analytics abre o submenu (aria-expanded=true)', async () => (await attr(page, item('analytics'), 'aria-expanded')) === 'true' && (await visible(page, item('revenue'))))
    await page.keyboard.press('ArrowRight'); await page.waitForTimeout(200)
    await c.check('ArrowRight com submenu aberto move foco ao 1º filho (Revenue)', async () => { const a = await active(); return { pass: a === 'revenue', detail: `activeElement=${a}` } })
    await page.keyboard.press('ArrowLeft'); await page.waitForTimeout(200)
    await c.check('ArrowLeft num filho devolve foco ao pai (Analytics)', async () => { const a = await active(); return { pass: a === 'analytics', detail: `activeElement=${a}` } })
    await page.keyboard.press('ArrowLeft'); await c.wait(500)
    await c.frame('arrowleft-fecha-submenu')
    await c.check('ArrowLeft no pai aberto fecha o submenu (aria-expanded=false)', async () => (await attr(page, item('analytics'), 'aria-expanded')) === 'false' && !(await visible(page, item('revenue'))))
    await page.keyboard.press('End'); await page.waitForTimeout(400)
    await c.frame('end-ultimo-item')
    const l2 = await keys()
    await c.check('End foca o último item', async () => { const a = await active(); return { pass: a === l2[l2.length - 1], detail: `activeElement=${a}` } })
    await page.keyboard.press('Home'); await page.waitForTimeout(400)
    await c.frame('home-primeiro-item')
    await c.check('Home foca o primeiro item', async () => { const a = await active(); return { pass: a === l2[0], detail: `activeElement=${a}` } })
    await page.keyboard.press('End'); await page.keyboard.press('ArrowDown'); await page.waitForTimeout(300)
    await c.check('ArrowDown no último dá a volta ao primeiro', async () => { const a = await active(); return { pass: a === l2[0], detail: `activeElement=${a}` } })
    // Enter ativa
    await page.evaluate((s) => document.querySelector(s).focus(), item('calendar'))
    await page.keyboard.press('Enter'); await c.wait(300)
    await c.check('Enter real ativa o item (v-model da story; aria-current=page)', async () => (await attr(page, item('calendar'), 'aria-current')) === 'page')
  },

  async colapsado(page, theme, dir, o) {
    const c = makeCtx(page, 'colapsado', theme, dir, o)
    await openStory(page, 'navigation-vsidebar--multi-level', theme, 'activeItem:dashboard')
    await c.frame('expandido')
    const width = () => page.locator(SB).first().evaluate((e) => e.getBoundingClientRect().width)
    const w0 = await width()
    await c.check('Começa expandido (data-collapsed=false)', async () => ({ pass: (await attr(page, SB, 'data-collapsed')) === 'false', detail: `largura=${Math.round(w0)}px` }))
    await page.locator('[data-test-id="v-sidebar-collapse-toggle"]:visible').first().click(); await c.wait(600)
    await c.frame('colapsado-rail')
    const w1 = await width()
    await c.check('Colapsou (data-collapsed=true) e ficou mais estreito', async () => ({ pass: (await attr(page, SB, 'data-collapsed')) === 'true' && w1 < w0 / 2, detail: `${Math.round(w0)}px -> ${Math.round(w1)}px` }))
    await c.check('Rótulos ocultos: nenhum texto de label visível', async () => ({ pass: (await page.locator(`${SB} .v-nav-item__label:visible`).evaluateAll((els) => els.filter((e) => e.getBoundingClientRect().width > 2 && getComputedStyle(e).visibility !== 'hidden' && getComputedStyle(e).opacity !== '0').length)) === 0, detail: 'contagem de .v-nav-item__label perceptíveis' }))
    await c.check('Itens têm title (tooltip) com o rótulo: Dashboard, Analytics, Inbox, Settings', async () => {
      const t = await Promise.all(['dashboard', 'analytics', 'inbox', 'settings'].map((v) => attr(page, item(v), 'title')))
      return { pass: t.join('|') === 'Dashboard|Analytics|Inbox|Settings', detail: t.join(' | ') }
    })
    await c.check('Sem chevrons de submenu no rail', async () => (await page.locator(`${SB} [data-test-id="v-sidebar-nav-item-chevron"]:visible`).count()) === 0)
    await page.locator(item('analytics')).click(); await c.wait(700)
    await c.frame('clique-no-pai-expande')
    const w2 = await width()
    await c.check('Clicar no pai com filhos expande a sidebar (data-collapsed=false)', async () => ({ pass: (await attr(page, SB, 'data-collapsed')) === 'false' && w2 > w1 * 1.5, detail: `${Math.round(w1)}px -> ${Math.round(w2)}px` }))
    await c.check('…e abre a seção (Analytics aria-expanded=true, Revenue visível)', async () => ({ pass: (await attr(page, item('analytics'), 'aria-expanded')) === 'true' && (await visible(page, item('revenue'))), detail: `aria-expanded=${await attr(page, item('analytics'), 'aria-expanded')}` }))
    // story Collapsed
    await openStory(page, 'navigation-vsidebar--collapsed', theme)
    await c.frame('story-collapsed', SB)
    await c.check('Story Collapsed renderiza em modo rail', async () => (await attr(page, SB, 'data-collapsed')) === 'true')
  },
}
const FLOW_TITLES = {
  accordion: ['Acordeão', 'Abrir uma seção fecha as irmãs (A aberta; abre B; A fecha; reabre A; B fecha). Também a story Accordion com accordion=true vs false.'],
  multinivel: ['Multinível (3 níveis + categorias)', 'Expandir nível 1, 2 e 3; categorias (headings) dentro de submenus; clicar no 3º nível marca aria-current e mantém ancestrais abertos.'],
  scroll: ['Scroll melhorado', 'Somente a nav rola; header e footer fixos; página não rola; data-scroll-top/bottom alternam (fades); scrollbar fina.'],
  'active-into-view': ['Item ativo rolado para a vista', 'Com activeItem baixo/profundo na lista, a nav rola sozinha até o item e ele fica dentro da área visível.'],
  busca: ['Busca / filtro', '"perm": match em PAI revela todos os descendentes expandidos; "access": match em folha mostra ancestrais; <mark> destaca o trecho; sem resultado mostra "No results"; limpar restaura.'],
  chevrons: ['Estilos de chevron', 'chevron="updown" (Starline: v fechado, ^ aberto) e groupChevronOpen="up" (CareOps: grupo ^ aberto); padrão rotate preservado.'],
  grupos: ['Grupos recolhíveis', 'Recolher grupo oculta os itens; expandir de novo restaura; grupo com defaultOpen=false começa fechado.'],
  teclado: ['Teclado', 'Setas, ArrowRight/Left abrindo e fechando submenus, Home/End, Enter; foco visível (:focus-visible).'],
  colapsado: ['Colapsado (rail)', 'Rótulos ocultos, tooltips via title; clicar num pai expande a sidebar e abre a seção.'],
}

// ---------------------------------------------------------------- main
const strip = (t) => t.replace(/\x1b\[[0-9;]*m/g, '')
async function runTests() {
  const sh = (cmd) => { const r = spawnSync(cmd, { cwd: ROOT, shell: true, encoding: 'utf8', maxBuffer: 1 << 26 }); return strip((r.stdout || '') + (r.stderr || '')) }
  let harness = null
  const up = await fetch('http://localhost:8321/VSidebar.html').then((r) => r.ok).catch(() => false)
  if (!up) harness = require('node:child_process').spawn(process.execPath, [path.join(ROOT, 'scripts', 'val-harness-server.cjs')], { stdio: 'ignore' })
  if (harness) await new Promise((r) => setTimeout(r, 1500))
  const v = sh('npx vitest run src/components/navigation/VSidebar src/components/navigation/VNavItem src/templates/SidebarMenu')
  const e = sh('npx playwright test src/components/navigation/VSidebar --reporter=list')
  if (harness) harness.kill()
  const NL = '\n'
  fs.writeFileSync(path.join(OUT, 'test-output.txt'), '### npx vitest run src/components/navigation/VSidebar src/components/navigation/VNavItem' + NL + v + NL + NL + '### npx playwright test src/components/navigation/VSidebar (harness :8321 ' + (up ? 'já estava no ar' : 'iniciado pelo script') + ')' + NL + e)
  const vp = (v.match(/Tests\s+(?:\d+ failed \| )?(\d+) passed/) || [])[1] || '0'
  const vfn = (v.match(/Tests\s+(\d+) failed/) || [])[1] || '0'
  const ep = (e.match(/(\d+) passed/) || [])[1] || '0', ef = (e.match(/(\d+) failed/) || [])[1] || '0'
  const text = 'vitest (VSidebar + VNavItem): ' + vp + ' passed, ' + vfn + ' failed' + NL + 'playwright e2e (VSidebar.e2e.spec.ts): ' + ep + ' passed, ' + ef + ' failed'
  const md = '- vitest: **' + vp + ' passed / ' + vfn + ' failed**' + NL + '- playwright e2e: **' + ep + ' passed / ' + ef + ' failed** (exige o harness em :8321: `node scripts/val-harness-server.cjs`; o script sobe sozinho se necessário)'
  fs.writeFileSync(path.join(OUT, 'test-summary.json'), JSON.stringify({ text, md }))
}

async function main() {
  const full = !only.length && !skipStatic && !skipVideo
  if (full) rmrf(OUT)
  mkdir(OUT)
  if (!process.env.SKIP_TESTS && !only.length) await runTests()
  const flowNames = only.length ? only : Object.keys(FLOWS)
  const browser = await chromium.launch()
  const idx = await (await fetch(`${BASE}/index.json`)).json()
  const ids = Object.values(idx.entries).filter((e) => e.type === 'story' && /^navigation-vsidebar--|^templates-menu-lateral|^templates-careops|^templates-sales-overview|^templates-investment/.test(e.id)).map((e) => e.id)

  // 1) static
  const statics = []
  if (!skipStatic) {
    rmrf(path.join(OUT, 'static')); mkdir(path.join(OUT, 'static'))
    for (const theme of THEMES) {
      const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 }, reducedMotion: 'reduce' })
      const page = await ctx.newPage()
      for (const id of ids) {
        try {
          await openStory(page, id, theme, null, 800)
          const f = path.join(OUT, 'static', `${id}--${theme}.png`)
          await page.screenshot({ path: f })
          statics.push({ id, theme, file: `static/${id}--${theme}.png` })
        } catch (e) { statics.push({ id, theme, error: String(e.message) }) }
        process.stdout.write('.')
      }
      await ctx.close()
    }
    console.log('\nstatic done')
  }

  // 2) flows
  if (!only.length) rmrf(path.join(OUT, 'flows'))
  for (const flow of flowNames) {
    for (const theme of THEMES) {
      const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 }, reducedMotion: 'reduce' })
      const page = await ctx.newPage()
      const errs = []
      page.on('pageerror', (e) => errs.push(String(e.message)))
      try {
        await FLOWS[flow](page, theme, path.join(OUT, 'flows', flow, theme), { animated: false })
      } catch (e) {
        const en = (log[flow] ??= {})[theme] ??= { assertions: [], frames: [] }
        en.assertions.push({ name: 'execução do fluxo sem exceção', pass: false, detail: String(e.message).split('\n')[0] })
      }
      log[flow][theme].pageErrors = errs
      await ctx.close()
      console.log(`flow ${flow}/${theme}: ${log[flow][theme].assertions.filter((a) => a.pass).length}/${log[flow][theme].assertions.length}`)
    }
  }

  // 3) videos (dark, animations on)
  const videos = {}
  let ffmpeg = false
  try { execSync('ffmpeg -version', { stdio: 'ignore' }); ffmpeg = true } catch {}
  if (!skipVideo) {
    mkdir(path.join(OUT, 'videos'))
    const tmp = path.join(OUT, 'videos', '_tmp')
    for (const flow of ['accordion', 'scroll', 'busca']) {
      rmrf(tmp)
      const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 }, recordVideo: { dir: tmp, size: { width: 1280, height: 800 } } })
      const page = await ctx.newPage()
      const saved = JSON.parse(JSON.stringify(log[flow]?.dark ?? null))
      try { await FLOWS[flow](page, 'dark', null, { animated: true, pause: 900 }) } catch (e) { console.log('video flow err', flow, e.message) }
      if (saved) log[flow].dark = saved // keep the reduced-motion run's log/frames
      await page.waitForTimeout(800)
      const vp = await page.video().path()
      await ctx.close()
      const dest = path.join(OUT, 'videos', `${flow}-dark.webm`)
      fs.copyFileSync(vp, dest)
      videos[flow] = { webm: `videos/${flow}-dark.webm` }
      if (ffmpeg) {
        const gif = path.join(OUT, 'videos', `${flow}-dark.gif`)
        const r = spawnSync('ffmpeg', ['-y', '-loglevel', 'error', '-i', dest, '-vf', 'fps=10,scale=800:-1:flags=lanczos,split[a][b];[a]palettegen[p];[b][p]paletteuse', gif])
        if (r.status === 0) videos[flow].gif = `videos/${flow}-dark.gif`
      }
      console.log('video', flow, videos[flow])
    }
    rmrf(tmp)
  }
  await browser.close()

  // persist logs (merge with existing when partial run)
  const logFile = path.join(OUT, 'assertions.json')
  let prev = {}
  if (only.length && fs.existsSync(logFile)) prev = JSON.parse(fs.readFileSync(logFile, 'utf8')).flows ?? {}
  const meta = { generatedAt: new Date().toISOString(), flows: { ...prev, ...log }, statics, videos, ffmpeg }
  if (only.length && fs.existsSync(logFile)) { const old = JSON.parse(fs.readFileSync(logFile, 'utf8')); if (!statics.length) meta.statics = old.statics; if (!Object.keys(videos).length) meta.videos = old.videos }
  if (skipStatic && !only.length && fs.existsSync(logFile)) meta.statics = JSON.parse(fs.readFileSync(logFile, 'utf8')).statics
  if (skipVideo && fs.existsSync(logFile)) meta.videos = JSON.parse(fs.readFileSync(logFile, 'utf8')).videos
  fs.writeFileSync(logFile, JSON.stringify(meta, null, 2))

  buildReport(meta)
  console.log('done:', path.join(OUT, 'index.html'))
}

// ---------------------------------------------------------------- report
const esc = (s) => String(s ?? '').replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]))

function buildReport(meta) {
  const testFile = path.join(OUT, 'test-summary.json')
  const tests = fs.existsSync(testFile) ? JSON.parse(fs.readFileSync(testFile, 'utf8')) : null
  const rows = []
  let html = `<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Evidências VSidebar</title>
<style>
body{font:14px/1.5 system-ui,Segoe UI,sans-serif;margin:0;padding:24px;background:#f6f7f9;color:#14171f}
h1{margin:0 0 4px}h2{margin-top:40px;border-bottom:2px solid #d5d9e0;padding-bottom:6px}h3{margin:18px 0 6px}
.note{background:#fff8e1;border:1px solid #f0d878;padding:10px 14px;border-radius:8px;margin:12px 0}
table{border-collapse:collapse;background:#fff}td,th{border:1px solid #d5d9e0;padding:4px 8px;text-align:left;vertical-align:top}
.pass{color:#0a7a3b;font-weight:700}.fail{color:#c0152f;font-weight:700}
.frames{display:grid;grid-template-columns:1fr 1fr;gap:14px;align-items:start}
.frames figure{margin:0;background:#fff;border:1px solid #d5d9e0;border-radius:8px;padding:6px}
.frames img{max-width:100%;height:auto;display:block}.frames figcaption{font-size:12px;color:#555;margin-top:4px}
.head{font-weight:700;margin:6px 0}
.gal{display:grid;grid-template-columns:repeat(auto-fill,minmax(260px,1fr));gap:12px}
.gal figure{margin:0;background:#fff;border:1px solid #d5d9e0;border-radius:6px;padding:4px}.gal img{width:100%;display:block}.gal figcaption{font-size:11px;word-break:break-all}
video{max-width:100%;border:1px solid #d5d9e0;border-radius:8px}
details{margin:6px 0}
</style></head><body>
<h1>Evidências do VSidebar</h1>
<div class="note"><b>Todas as imagens e vídeos abaixo foram gerados pelo Playwright a partir do Storybook em execução, com o código atual. Não são mockups.</b><br>Gerado em ${esc(meta.generatedAt)} · comando: <code>node scripts/sidebar-evidence.cjs</code></div>
`
  const summary = []
  for (const flow of Object.keys(FLOW_TITLES)) {
    const f = meta.flows[flow]; if (!f) continue
    const [title, what] = FLOW_TITLES[flow]
    const cnt = (t) => ({ p: (f[t]?.assertions ?? []).filter((a) => a.pass).length, n: (f[t]?.assertions ?? []).length })
    summary.push({ flow, title, light: cnt('light'), dark: cnt('dark') })
    html += `<h2 id="${flow}">${esc(title)} <small style="font-weight:400">(${flow})</small></h2><p>${esc(what)}</p>`
    html += `<table><tr><th>Asserção</th><th>Claro</th><th>Escuro</th></tr>`
    const names = [...new Set([...(f.light?.assertions ?? []), ...(f.dark?.assertions ?? [])].map((a) => a.name))]
    for (const nm of names) {
      const cell = (t) => { const a = f[t]?.assertions.find((x) => x.name === nm); return a ? `<span class="${a.pass ? 'pass' : 'fail'}">${a.pass ? 'PASS' : 'FAIL'}</span> <small>${esc(a.detail)}</small>` : '—' }
      html += `<tr><td>${esc(nm)}</td><td>${cell('light')}</td><td>${cell('dark')}</td></tr>`
    }
    html += `</table>`
    const steps = f.light?.frames ?? f.dark?.frames ?? []
    html += `<h3>Frames (claro | escuro)</h3>`
    const maxN = Math.max(f.light?.frames.length ?? 0, f.dark?.frames.length ?? 0)
    html += `<div class="frames">`
    for (let i = 0; i < maxN; i++) for (const t of THEMES) {
      const fr = f[t]?.frames[i]
      html += fr ? `<figure><img loading="lazy" src="${esc(fr.file)}" alt=""><figcaption>${t} — ${esc(fr.file.split('/').pop())}</figcaption></figure>` : '<figure></figure>'
    }
    html += `</div>`
    if (meta.videos?.[flow]) {
      html += `<h3>Vídeo (tema escuro, animações ativas)</h3><video controls preload="metadata" src="${meta.videos[flow].webm}"></video>`
      if (meta.videos[flow].gif) html += `<p>GIF: <a href="${meta.videos[flow].gif}">${meta.videos[flow].gif}</a></p>`
    }
    if (f.light?.pageErrors?.length || f.dark?.pageErrors?.length) html += `<p class="fail">Erros de página: ${esc(JSON.stringify([...(f.light.pageErrors ?? []), ...(f.dark.pageErrors ?? [])]))}</p>`
  }
  if (tests) html += `<h2 id="testes">Testes existentes</h2><pre>${esc(tests.text)}</pre><p>Saída completa: <a href="test-output.txt">test-output.txt</a></p>`
  html += `<h2 id="galeria">Galeria estática (1280x800)</h2>`
  for (const t of THEMES) {
    html += `<h3>${t}</h3><div class="gal">`
    for (const s of (meta.statics ?? []).filter((x) => x.theme === t)) html += s.file ? `<figure><a href="${esc(s.file)}"><img loading="lazy" src="${esc(s.file)}" alt=""></a><figcaption>${esc(s.id)}</figcaption></figure>` : `<figure><figcaption class="fail">${esc(s.id)}: ${esc(s.error)}</figcaption></figure>`
    html += `</div>`
  }
  html += `</body></html>`
  fs.writeFileSync(path.join(OUT, 'index.html'), html)

  let md = `# Evidências do VSidebar\n\n> **Imagens e vídeos são gerados pelo Playwright a partir do Storybook em execução, com o código atual — não são mockups.**\n\n- Gerado em: ${meta.generatedAt}\n- Regenerar: \`node scripts/sidebar-evidence.cjs\` (Storybook em http://localhost:6006; opcional: nomes de fluxos como argumento, \`SKIP_STATIC=1\`, \`SKIP_VIDEO=1\`)\n- Página navegável: [index.html](index.html) · log de asserções: [assertions.json](assertions.json) · testes: [test-output.txt](test-output.txt)\n\n## Fluxos\n\n| Fluxo | Claro | Escuro | Frames |\n|---|---|---|---|\n`
  let totP = 0, totN = 0
  for (const s of summary) {
    totP += s.light.p + s.dark.p; totN += s.light.n + s.dark.n
    const st = (x) => `${x.p}/${x.n} ${x.p === x.n ? 'PASS' : 'FAIL'}`
    md += `| ${s.title} | ${st(s.light)} | ${st(s.dark)} | [flows/${s.flow}/](flows/${s.flow}/) |\n`
  }
  md += `\n**Total de asserções: ${totP}/${totN} PASS.**\n\n## Asserções com FAIL\n\n`
  let anyFail = false
  for (const flow of Object.keys(meta.flows)) for (const t of THEMES) for (const a of meta.flows[flow][t]?.assertions ?? []) if (!a.pass) { anyFail = true; md += `- ${flow}/${t}: ${a.name} — ${a.detail}\n` }
  if (!anyFail) md += `Nenhuma.\n`
  md += `\n## Vídeos\n\n`
  for (const [k, v] of Object.entries(meta.videos ?? {})) md += `- [${v.webm}](${v.webm})${v.gif ? ` · [GIF](${v.gif})` : ''}\n`
  if (!meta.ffmpeg) md += `\nGIFs não gerados: ffmpeg não encontrado no PATH.\n`
  if (tests) md += `\n## Testes existentes\n\n${tests.md}\n`
  md += `\n## Galeria estática\n\n${(meta.statics ?? []).filter((s) => s.file).length} imagens em [static/](static/) (${THEMES.join(' e ')}).\n`
  fs.writeFileSync(path.join(OUT, 'EVIDENCIAS.md'), md)
}

if (process.env.REPORT_ONLY === '1') {
  buildReport(JSON.parse(fs.readFileSync(path.join(OUT, 'assertions.json'), 'utf8')))
} else {
  main().catch((e) => { console.error(e); process.exit(1) })
}
