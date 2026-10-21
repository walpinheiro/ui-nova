import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..')
const scss = fs.readFileSync(path.join(root, 'src/tokens/_tokens.scss'), 'utf8')

const mixinStart = scss.indexOf('@mixin v-tokens {')
const mixinEnd = scss.indexOf('\n}', mixinStart)
const mixin = scss.slice(mixinStart, mixinEnd)

/** Derivados de marca — devem usar var(--v-color-*) no mixin, nunca #{$hex}. */
const BRAND_DERIVED_TOKENS = new Set([
  '--v-color-primary',
  '--v-color-primary-hover',
  '--v-color-focus',
  '--v-button-bg',
  '--v-button-shadow',
  '--v-button-focus-ring',
  '--v-sidebar-item-hover-bg',
  '--v-sidebar-item-active-bg',
  '--v-sidebar-item-active-color',
  '--v-tree-item-active-bg',
  '--v-tree-item-selected-bg',
  '--v-tree-indicator-color',
  '--v-tree-focus-ring-color',
  '--v-segmented-indicator-bg',
  '--v-segmented-hover-bg',
  '--v-segmented-pressed-bg',
  '--v-toolbar-icon-hover-bg',
  '--v-toolbar-icon-active-bg',
  '--v-toolbar-icon-active-color',
  '--v-toolbar-primary-bg',
  '--v-toolbar-primary-hover',
  '--v-toolbar-primary-text',
  '--v-dropdown-hover-bg',
  '--v-dropdown-item-selected-bg',
  '--v-tabs-hover-bg',
  '--v-inspector-accent',
  '--v-gallery-selected-border',
  '--v-gallery-selected-bg',
  '--v-table-row-selected-bg',
  '--v-table-sorted-column-bg',
  '--v-table-sort-active-color',
  '--v-table-sort-focus-ring',
  '--vf-primary',
  '--vf-primary-hover',
  '--vf-chip-bg',
  '--vf-chip-text',
  '--vf-focus-ring',
  '--v-breadcrumb-item-active-color',
  '--v-breadcrumb-current-color',
  '--v-section-bg-tinted',
])

const lines = mixin.match(/^\s+(--v-[^:]+):([^;]+);/gm) ?? []
const violations = []

for (const line of lines) {
  const match = line.match(/^\s+(--v-[a-z0-9-]+):\s*(.+);$/)
  if (!match) continue
  const [, name, value] = match
  if (!BRAND_DERIVED_TOKENS.has(name)) continue
  const trimmed = value.trim()
  if (trimmed.startsWith('var(--v-')) continue
  if (trimmed.includes('var(--v-color-primary')) continue
  violations.push({ name, value: trimmed })
}

const brandHex = /#(?:6366f1|4f46e5|4338ca|eef2ff|e0e7ff|818cf8)/gi
const hardcodedBrand = []

function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) walk(full)
    else if (entry.name.endsWith('.scss') && brandHex.test(fs.readFileSync(full, 'utf8'))) {
      hardcodedBrand.push(path.relative(root, full))
    }
  }
}

walk(path.join(root, 'src/components'))

let failed = false

if (violations.length) {
  failed = true
  console.error('Tokens derivados de marca sem cascata var():')
  for (const v of violations) console.error(`  ${v.name}: ${v.value}`)
}

if (hardcodedBrand.length) {
  failed = true
  console.error('SCSS de componentes com hex indigo fixo:')
  for (const f of hardcodedBrand) console.error(`  ${f}`)
}

if (failed) process.exit(1)

console.log(`OK: cascata de marca validada (${BRAND_DERIVED_TOKENS.size} tokens derivados).`)
