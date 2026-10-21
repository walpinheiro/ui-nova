#!/usr/bin/env node
/**
 * Enriquece a documentação do Storybook de forma idempotente:
 *  1. gera src/docs/_generated/argtypes.json (descrições/opções das props a partir de *.types.ts);
 *  2. insere `parameters.docs.description.story` (pt-BR) em toda story de src/components/** e src/foundations/** que não tem;
 *  3. nos MDX de componente: troca a frase genérica pelo "Objetivo" do DESIGN-SPEC e adiciona a seção "Uso";
 *  4. em stories sem MDX: insere `parameters.docs.description.component` (a partir do DESIGN-SPEC) quando faltar.
 * Uso: node scripts/storybook-enrich-docs.cjs [--dry]
 */
const fs = require('node:fs')
const path = require('node:path')
const ts = require('typescript')
const root = path.resolve(__dirname, '..')
const DRY = process.argv.includes('--dry')

const walk = (dir, out = []) => {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    if (e.name === 'node_modules' || e.name.startsWith('.')) continue
    const p = path.join(dir, e.name)
    if (e.isDirectory()) walk(p, out)
    else out.push(p)
  }
  return out
}
const srcFiles = walk(path.join(root, 'src'))

// ---------- 1. argtypes.json ----------
const aliasOptions = {}
const sfCache = {}
const parse = (f) => (sfCache[f] ||= ts.createSourceFile(f, fs.readFileSync(f, 'utf8'), ts.ScriptTarget.Latest, true))
const literalUnion = (node) => {
  if (!node) return null
  if (ts.isParenthesizedTypeNode(node)) return literalUnion(node.type)
  if (ts.isLiteralTypeNode(node) && ts.isStringLiteral(node.literal)) return [node.literal.text]
  if (ts.isUnionTypeNode(node)) {
    const out = []
    for (const t of node.types) {
      const r = literalUnion(t)
      if (!r) return null
      out.push(...r)
    }
    return out
  }
  return null
}
for (const f of srcFiles.filter((f) => /\.ts$/.test(f) && !/stories|_tests|\.d\.ts/.test(f))) {
  parse(f).forEachChild((n) => {
    if (ts.isTypeAliasDeclaration(n)) {
      const r = literalUnion(n.type)
      if (r) aliasOptions[n.name.text] = r
    }
  })
}

const PROP_PT = {
  modelValue: 'Valor controlado (`v-model`).',
  value: 'Valor do item.',
  disabled: 'Desativa a interação e aplica o estilo de desabilitado.',
  loading: 'Exibe o estado de carregamento.',
  readonly: 'Somente leitura: mostra o valor sem permitir edição.',
  required: 'Marca o campo como obrigatório.',
  size: 'Tamanho do componente.',
  variant: 'Variante visual.',
  layout: 'Layout/disposição do componente.',
  shape: 'Formato do contorno (ex.: `pill`).',
  label: 'Texto do rótulo.',
  title: 'Título exibido.',
  description: 'Texto descritivo secundário.',
  placeholder: 'Texto de ajuda exibido quando vazio.',
  helperText: 'Texto de apoio abaixo do campo.',
  errorMessage: 'Mensagem de erro (ativa o estado inválido).',
  successMessage: 'Mensagem de sucesso (ativa o estado de sucesso).',
  clearable: 'Mostra um botão para limpar o valor.',
  clearLabel: 'Rótulo acessível do botão de limpar.',
  ariaLabel: 'Rótulo acessível (`aria-label`).',
  ariaLabelledby: 'Id do elemento que rotula o componente (`aria-labelledby`).',
  dismissible: 'Permite dispensar/fechar o componente.',
  dismissLabel: 'Rótulo acessível do botão de fechar.',
  closable: 'Exibe o botão de fechar.',
  open: 'Controla a abertura (`v-model:open`).',
  items: 'Lista de itens a renderizar.',
  options: 'Lista de opções selecionáveis.',
  columns: 'Definição das colunas.',
  rows: 'Linhas de dados.',
  motion: 'Nível de movimento: `default`, `expressive` ou `none` (respeita `prefers-reduced-motion`).',
  icon: 'Ícone (objeto Iconify).',
  iconStart: 'Ícone no início.',
  iconEnd: 'Ícone no fim.',
  href: 'URL de destino; renderiza como link.',
  to: 'Destino de navegação (router-link).',
  active: 'Marca o item como ativo/selecionado.',
  activeItem: 'Valor do item ativo (`v-model:active-item`).',
  collapsed: 'Estado recolhido (somente ícones).',
  width: 'Largura do componente.',
  height: 'Altura do componente.',
  min: 'Valor mínimo.',
  max: 'Valor máximo.',
  step: 'Incremento a cada passo.',
  name: 'Nome do campo (`name`).',
  id: 'Identificador do elemento (`id`).',
  checked: 'Estado marcado.',
  indeterminate: 'Estado indeterminado.',
  duration: 'Duração em milissegundos.',
  placement: 'Posição do overlay em relação ao gatilho.',
  side: 'Lado em que o overlay aparece.',
  align: 'Alinhamento do conteúdo.',
  dot: 'Exibe um ponto indicador.',
  tone: 'Tom semântico da cor.',
  count: 'Quantidade exibida.',
  total: 'Total de itens.',
  page: 'Página atual (`v-model:page`).',
  pageSize: 'Itens por página.',
  searchable: 'Habilita campo de busca.',
  multiple: 'Permite seleção múltipla.',
  maxLength: 'Número máximo de caracteres.',
  rowsCount: 'Número de linhas visíveis.',
  autofocus: 'Foca o elemento ao montar.',
  type: 'Tipo do elemento/campo.',
  mode: 'Modo de funcionamento.',
  orientation: 'Orientação: horizontal ou vertical.',
  src: 'URL da imagem.',
  alt: 'Texto alternativo da imagem.',
  initials: 'Iniciais exibidas quando não há imagem.',
  status: 'Indicador de status.',
  closeOnEscape: 'Fecha ao pressionar Esc.',
  closeOnOverlay: 'Fecha ao clicar no fundo (overlay).',
  showProgress: 'Mostra a barra de progresso do tempo restante.',
  accordion: 'Abrir um item fecha os irmãos.',
  expandedSections: 'Ids de grupos/itens abertos (controlado).',
  showFooter: 'Exibe o rodapé padrão.',
  showCollapseToggle: 'Exibe o botão de recolher/expandir.',
  filterOnSearch: 'A busca filtra os itens e expande os ancestrais dos resultados.',
  panels: 'Renderiza os painéis das abas (`false` usa as abas como navegação).',
}
const unionNote = (opts) => 'Valores: ' + opts.map((o) => '`' + o + '`').join(', ') + '.'

const argtypes = {}
for (const f of srcFiles.filter((f) => /\.types\.ts$/.test(f))) {
  parse(f).forEachChild((n) => {
    if (!ts.isInterfaceDeclaration(n) || !/Props$/.test(n.name.text)) return
    const comp = n.name.text.replace(/Props$/, '')
    const props = {}
    for (const m of n.members) {
      if (!ts.isPropertySignature(m) || !m.name) continue
      const name = m.name.getText()
      let doc = ''
      const jd = m.jsDoc && m.jsDoc[0]
      if (jd && jd.comment) doc = typeof jd.comment === 'string' ? jd.comment : jd.comment.map((c) => c.text).join('')
      let opts = literalUnion(m.type)
      if (!opts && m.type && ts.isTypeReferenceNode(m.type)) opts = aliasOptions[m.type.typeName.getText()] || null
      const typeText = m.type ? m.type.getText().replace(/\s+/g, ' ') : ''
      let description = doc.trim()
      if (!description) description = PROP_PT[name] || `Prop \`${name}\` (\`${typeText.length > 60 ? typeText.slice(0, 57) + '…' : typeText}\`).`
      if (opts && !/Valores:/.test(description)) description += ' ' + unionNote(opts)
      props[name] = { description, ...(opts ? { options: opts } : {}) }
    }
    argtypes[comp] = props
  })
}
const genDir = path.join(root, 'src', 'docs', '_generated')
if (!DRY) {
  fs.mkdirSync(genDir, { recursive: true })
  fs.writeFileSync(path.join(genDir, 'argtypes.json'), JSON.stringify(argtypes, null, 2) + '\n')
}
console.log('argtypes:', Object.keys(argtypes).length, 'componentes')

// ---------- 2. story descriptions ----------
const WORDS = {
  default: 'padrão', primary: 'primária', secondary: 'secundária', ghost: 'ghost', outline: 'contorno', destructive: 'destrutiva',
  inverse: 'inversa', icon: 'ícone', icons: 'ícones', loading: 'carregando', disabled: 'desabilitado', sizes: 'tamanhos', size: 'tamanho',
  small: 'pequeno', large: 'grande', medium: 'médio', with: 'com', without: 'sem', error: 'erro', success: 'sucesso', warning: 'aviso',
  info: 'informação', danger: 'perigo', collapsed: 'recolhido', expanded: 'expandido', active: 'ativo', controlled: 'controlado',
  basic: 'básico', variants: 'variantes', variant: 'variante', states: 'estados', state: 'estado', all: 'todos', pill: 'pill',
  nested: 'aninhado', floating: 'flutuante', label: 'rótulo', helper: 'texto de apoio', text: 'texto', invalid: 'inválido',
  readonly: 'somente leitura', required: 'obrigatório', clearable: 'limpável', placeholder: 'placeholder', checked: 'marcado',
  indeterminate: 'indeterminado', multiple: 'múltiplo', search: 'busca', filter: 'filtro', dark: 'escuro', light: 'claro',
  custom: 'personalizado', cells: 'células', actions: 'ações', navigation: 'navegação', badge: 'badge', dot: 'ponto', tones: 'tons',
  overflow: 'overflow', narrow: 'estreito', no: 'sem', motion: 'movimento', empty: 'vazio', long: 'longo', short: 'curto', open: 'aberto',
  closed: 'fechado', group: 'grupo', groups: 'grupos', item: 'item', items: 'itens', header: 'cabeçalho', footer: 'rodapé', menu: 'menu',
  and: 'e', or: 'ou', to: 'para', of: 'de', in: 'em', on: 'em', for: 'para', by: 'por', at: 'em', states: 'estados', all: 'todos', every: 'cada', only: 'somente', inline: 'inline', banner: 'banner', full: 'completo', width: 'largura', height: 'altura', hover: 'hover', focus: 'foco', pressed: 'pressionado', filled: 'preenchido', mixed: 'misto', rtl: 'RTL', stack: 'pilha', toggle: 'alternador', chevron: 'chevron', chevrons: 'chevrons', collapsible: 'recolhível', link: 'link', as: 'como', slot: 'slot', slots: 'slots', content: 'conteúdo', title: 'título', subtitle: 'subtítulo', image: 'imagem', images: 'imagens', avatar: 'avatar', user: 'usuário', loadingstate: 'carregando', controlled: 'controlado', uncontrolled: 'não controlado', preset: 'preset', presets: 'presets', interactive: 'interativo', playground: 'playground',
  multi: 'multi', level: 'nível', accordion: 'acordeão', workspace: 'workspace', portfolio: 'portfólio', playground: 'playground',
}
const humanize = (name) => {
  const ws = name.replace(/([a-z0-9])([A-Z])/g, '$1 $2').replace(/([A-Z]+)([A-Z][a-z])/g, '$1 $2').split(/[\s_]+/).filter(Boolean)
  return ws.map((w) => WORDS[w.toLowerCase()] || w).join(' ')
}
const esc = (s) => "'" + s.replace(/\\/g, '\\\\').replace(/'/g, "\\'").replace(/\n/g, ' ') + "'"

function scalarArgs(obj) {
  const out = []
  const argsProp = obj.properties.find((p) => ts.isPropertyAssignment(p) && p.name.getText() === 'args')
  if (!argsProp || !ts.isObjectLiteralExpression(argsProp.initializer)) return out
  for (const p of argsProp.initializer.properties) {
    if (!ts.isPropertyAssignment(p)) continue
    const v = p.initializer
    const k = p.name.getText()
    if (ts.isStringLiteral(v) || ts.isNoSubstitutionTemplateLiteral(v)) out.push(`${k}="${v.text.length > 28 ? v.text.slice(0, 27) + '…' : v.text}"`)
    else if (ts.isNumericLiteral(v) || v.kind === ts.SyntaxKind.TrueKeyword || v.kind === ts.SyntaxKind.FalseKeyword) out.push(`${k}=${v.getText()}`)
  }
  return out.slice(0, 5)
}

function describeStory(name, obj, label, text) {
  const exportName = name
  let human = humanize(exportName)
  human = human.charAt(0).toUpperCase() + human.slice(1)
  const parts = [`Variação **${human}**.`]
  const args = scalarArgs(obj)
  if (name === 'Default') parts.push('Estado padrão do componente; use a aba **Controls** para experimentar as props ao vivo.')
  if (args.length) parts.push('Props: ' + args.map((a) => '`' + a + '`').join(', ') + '.')
  const bodyText = obj.getText()
  if (/v-model/.test(bodyText) || /\bref\(/.test(bodyText)) parts.push('Interativo: o estado é mantido na própria story (`v-model`).')
  const slots = [...new Set([...bodyText.matchAll(/#([a-zA-Z][\w-]*)/g)].map((m) => m[1]))].filter((s) => !/^[0-9a-f]{3,8}$/i.test(s))
  if (slots.length) parts.push('Slots usados: ' + slots.slice(0, 5).map((s) => '`#' + s + '`').join(', ') + '.')
  if (obj.properties.some((p) => p.name && p.name.getText() === 'play')) parts.push('Inclui interação automatizada (`play`).')
  return parts.join(' ')
}

const propText = (p) => p.name && (ts.isIdentifier(p.name) || ts.isStringLiteral(p.name)) ? p.name.text : ''
const findProp = (obj, name) => obj.properties.find((p) => ts.isPropertyAssignment(p) && propText(p) === name)
const unwrap = (e) => {
  while (e && (ts.isAsExpression(e) || ts.isSatisfiesExpression(e) || ts.isParenthesizedExpression(e))) e = e.expression
  return e
}
const indentOf = (text, pos) => {
  const ls = text.lastIndexOf('\n', pos - 1) + 1
  return /^\s*/.exec(text.slice(ls))[0]
}

function planInsert(text, obj, kind, value) {
  // kind: 'story' | 'component'. retorna [{pos, text}] ou null
  const base = indentOf(text, obj.getStart())
  const ind = base + '  '
  const docsBody = (ind2) => `docs: { description: { ${kind}: ${esc(value)} } }`
  const params = findProp(obj, 'parameters')
  if (!params) {
    if (obj.properties.length === 0) {
      return [{ pos: obj.getStart(), end: obj.getEnd(), text: `{\n${ind}parameters: {\n${ind}  ${docsBody()},\n${ind}},\n${base}}` }]
    }
    const first = obj.properties[0]
    const multiline = text.slice(obj.getStart(), first.getStart()).includes('\n')
    if (multiline) return [{ pos: first.getStart(), text: `parameters: {\n${ind}  ${docsBody()},\n${ind}},\n${ind}` }]
    return [{ pos: first.getStart(), text: `parameters: { ${docsBody()} }, ` }]
  }
  const pv = unwrap(params.initializer)
  if (!pv || !ts.isObjectLiteralExpression(pv)) return null
  const docs = findProp(pv, 'docs')
  const pind = indentOf(text, params.getStart()) + '  '
  if (!docs) {
    const first = pv.properties[0]
    if (!first) return [{ pos: pv.getStart(), end: pv.getEnd(), text: `{ ${docsBody()} }` }]
    const multiline = text.slice(pv.getStart(), first.getStart()).includes('\n')
    return [{ pos: first.getStart(), text: multiline ? `${docsBody()},\n${pind}` : `${docsBody()}, ` }]
  }
  const dv = unwrap(docs.initializer)
  if (!dv || !ts.isObjectLiteralExpression(dv)) return null
  const desc = findProp(dv, 'description')
  if (!desc) {
    const first = dv.properties[0]
    const dind = indentOf(text, docs.getStart()) + '  '
    if (!first) return [{ pos: dv.getStart(), end: dv.getEnd(), text: `{ description: { ${kind}: ${esc(value)} } }` }]
    const multiline = text.slice(dv.getStart(), first.getStart()).includes('\n')
    return [{ pos: first.getStart(), text: multiline ? `description: { ${kind}: ${esc(value)} },\n${dind}` : `description: { ${kind}: ${esc(value)} }, ` }]
  }
  const ddv = unwrap(desc.initializer)
  if (!ddv || !ts.isObjectLiteralExpression(ddv)) return null
  if (findProp(ddv, kind)) return []
  const first = ddv.properties[0]
  if (!first) return [{ pos: ddv.getStart(), end: ddv.getEnd(), text: `{ ${kind}: ${esc(value)} }` }]
  const multiline = text.slice(ddv.getStart(), first.getStart()).includes('\n')
  const dd = indentOf(text, desc.getStart()) + '  '
  return [{ pos: first.getStart(), text: multiline ? `${kind}: ${esc(value)},\n${dd}` : `${kind}: ${esc(value)}, ` }]
}

function objectOf(init) {
  const u = unwrap(init)
  return u && ts.isObjectLiteralExpression(u) ? u : null
}

function objective(dir) {
  const spec = path.join(dir, 'DESIGN-SPEC.md')
  if (!fs.existsSync(spec)) return ''
  const t = fs.readFileSync(spec, 'utf8')
  const m = /##\s*1\)[^\n]*\n+([\s\S]*?)(?:\n\s*\n|$)/.exec(t)
  if (!m) return ''
  let s = m[1].replace(/\s+/g, ' ').trim()
  if (s.length > 420) {
    const cut = s.slice(0, 420)
    s = cut.slice(0, Math.max(cut.lastIndexOf('. '), 200) + 1)
  }
  return s
}

let storyAdded = 0, compAdded = 0, skipped = []
const storyFiles = srcFiles.filter((f) => /\.stories\.ts$/.test(f) && /[\\/]src[\\/](components|foundations)[\\/]/.test(f))
for (const f of storyFiles) {
  const text = fs.readFileSync(f, 'utf8')
  const sf = parse(f)
  const edits = []
  const hasMdx = fs.existsSync(f.replace(/\.stories\.ts$/, '.mdx'))
  sf.forEachChild((n) => {
    if (!ts.isVariableStatement(n)) return
    const exported = !!(n.modifiers && n.modifiers.some((m) => m.kind === ts.SyntaxKind.ExportKeyword))
    for (const d of n.declarationList.declarations) {
      const name = d.name.getText()
      if (!exported && name !== 'meta') continue
      const obj = d.initializer && objectOf(d.initializer)
      if (name === 'meta') {
        if (!obj || hasMdx) continue
        if (/description:\s*\{[^}]*component\s*:/.test(obj.getText())) continue
        const desc = objective(path.dirname(f))
        if (!desc) { skipped.push(`${path.relative(root, f)} (sem DESIGN-SPEC: descrição do componente manual)`); continue }
        const plan = planInsert(text, obj, 'component', desc)
        if (plan) { edits.push(...plan); compAdded++ }
        continue
      }
      if (!obj) {
        if (d.initializer && /Template|bind\(/.test(d.initializer.getText())) skipped.push(`${path.relative(root, f)}#${name} (não é objeto literal)`)
        continue
      }
      if (/story\s*:/.test(obj.getText()) && /description/.test(obj.getText())) continue
      const plan = planInsert(text, obj, 'story', describeStory(name, obj))
      if (plan === null) { skipped.push(`${path.relative(root, f)}#${name} (parameters não-literal)`); continue }
      if (plan.length) { edits.push(...plan); storyAdded++ }
    }
  })
  if (!edits.length) continue
  edits.sort((a, b) => b.pos - a.pos)
  let out = text
  for (const e of edits) out = out.slice(0, e.pos) + e.text + out.slice(e.end ?? e.pos)
  if (!DRY) fs.writeFileSync(f, out)
}
console.log(`stories com descrição adicionada: ${storyAdded}; descrições de componente: ${compAdded}`)
if (skipped.length) console.log('Pulados:\n  ' + skipped.join('\n  '))

// ---------- 3. MDX de componente ----------
let mdxUpdated = 0
for (const f of srcFiles.filter((f) => /[\\/]src[\\/]components[\\/].*\.mdx$/.test(f))) {
  let t = fs.readFileSync(f, 'utf8')
  const orig = t
  const dir = path.dirname(f)
  const cname = path.basename(f, '.mdx')
  const obj = objective(dir)
  if (obj) t = t.replace(/Componente VueUI Nova para \*\*[^*]+\*\*, seguindo tokens semânticos e Light Mode como referência principal\./, obj)
  if (!/^## Uso/m.test(t)) {
    // snippet a partir dos args escalares do meta
    const sfile = path.join(dir, cname + '.stories.ts')
    let attrs = ''
    if (fs.existsSync(sfile)) {
      const sf = parse(sfile)
      sf.forEachChild((n) => {
        if (!ts.isVariableStatement(n)) return
        for (const d of n.declarationList.declarations) {
          if (d.name.getText() !== 'meta') continue
          const o = objectOf(d.initializer)
          if (!o) continue
          const a = findProp(o, 'args')
          if (!a || !ts.isObjectLiteralExpression(a.initializer)) continue
          for (const p of a.initializer.properties) {
            if (!ts.isPropertyAssignment(p)) continue
            const v = p.initializer
            const k = p.name.getText().replace(/[A-Z]/g, (c) => '-' + c.toLowerCase())
            if (ts.isStringLiteral(v)) attrs += ` ${k}="${v.text.replace(/"/g, '&quot;')}"`
            else if (ts.isNumericLiteral(v)) attrs += ` :${k}="${v.getText()}"`
            else if (v.kind === ts.SyntaxKind.TrueKeyword) attrs += ` ${k}`
            else if (v.kind === ts.SyntaxKind.FalseKeyword) attrs += ` :${k}="false"`
          }
        }
      })
    }
    const section = [
      '## Uso',
      '```vue',
      '<script setup lang="ts">',
      `import { ${cname} } from 'vueui-nova-kit'`,
      '</script>',
      '',
      '<template>',
      `  <${cname}${attrs} />`,
      '</template>',
      '```',
      'Todas as props, eventos e slots estão na tabela **Props** abaixo; cada variação tem uma story com o código ("Show code").',
      '',
    ].join('\n')
    t = t.replace(/\n## Variations/, `\n${section}\n## Variations`)
    if (!/^## Uso/m.test(t)) t += '\n' + section
  }
  if (t !== orig) { mdxUpdated++; if (!DRY) fs.writeFileSync(f, t) }
}
console.log('MDX atualizados:', mdxUpdated)
