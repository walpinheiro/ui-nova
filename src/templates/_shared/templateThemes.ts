export interface TemplateThemePreset {
  id: string
  label: string
  swatch: string
  vars: Record<string, string>
}

const PRIMARY_SCALE = ['50', '100', '200', '300', '400', '500', '600', '700', '800', '900'] as const

function buildPrimaryVars(scale: Record<(typeof PRIMARY_SCALE)[number], string>): Record<string, string> {
  const vars: Record<string, string> = {}
  for (const step of PRIMARY_SCALE) {
    vars[`--v-color-primary-${step}`] = scale[step]
  }
  vars['--v-color-primary'] = scale['600']
  vars['--v-color-primary-hover'] = scale['700']
  vars['--v-color-focus'] = scale['500']
  // Aliases de componente no subtree — só necessários se algum consumidor
  // ainda ler --v-button-bg etc.; estilos usam var(--v-color-primary-*) directo.
  vars['--v-sidebar-item-active-bg'] = scale['50']
  vars['--v-sidebar-item-active-color'] = scale['600']
  vars['--v-sidebar-item-hover-bg'] = scale['50']
  vars['--v-tree-item-active-bg'] = scale['50']
  vars['--v-tree-item-selected-bg'] = scale['50']
  vars['--v-tree-indicator-color'] = scale['600']
  vars['--v-button-bg'] = scale['500']
  vars['--v-segmented-indicator-bg'] = scale['500']
  return vars
}

export const TEMPLATE_THEME_PRESETS: TemplateThemePreset[] = [
  {
    id: 'indigo',
    label: 'Indigo',
    swatch: '#4f46e5',
    vars: buildPrimaryVars({
      '50': '#eef2ff',
      '100': '#e0e7ff',
      '200': '#c7d2fe',
      '300': '#a5b4fc',
      '400': '#818cf8',
      '500': '#6366f1',
      '600': '#4f46e5',
      '700': '#4338ca',
      '800': '#3730a3',
      '900': '#312e81',
    }),
  },
  {
    id: 'teal',
    label: 'Teal',
    swatch: '#0d9488',
    vars: buildPrimaryVars({
      '50': '#f0fdfa',
      '100': '#ccfbf1',
      '200': '#99f6e4',
      '300': '#5eead4',
      '400': '#2dd4bf',
      '500': '#14b8a6',
      '600': '#0d9488',
      '700': '#0f766e',
      '800': '#115e59',
      '900': '#134e4a',
    }),
  },
  {
    id: 'rose',
    label: 'Rose',
    swatch: '#e11d48',
    vars: buildPrimaryVars({
      '50': '#fff1f2',
      '100': '#ffe4e6',
      '200': '#fecdd3',
      '300': '#fda4af',
      '400': '#fb7185',
      '500': '#f43f5e',
      '600': '#e11d48',
      '700': '#be185d',
      '800': '#9f1239',
      '900': '#881337',
    }),
  },
  {
    id: 'amber',
    label: 'Amber',
    swatch: '#d97706',
    vars: buildPrimaryVars({
      '50': '#fffbeb',
      '100': '#fef3c7',
      '200': '#fde68a',
      '300': '#fcd34d',
      '400': '#fbbf24',
      '500': '#f59e0b',
      '600': '#d97706',
      '700': '#b45309',
      '800': '#92400e',
      '900': '#78350f',
    }),
  },
]

export const DEFAULT_TEMPLATE_THEME_ID = TEMPLATE_THEME_PRESETS[0].id

export function getTemplateThemePreset(id: string): TemplateThemePreset {
  return TEMPLATE_THEME_PRESETS.find((preset) => preset.id === id) ?? TEMPLATE_THEME_PRESETS[0]
}

export function getTemplateThemeVars(id: string): Record<string, string> {
  return getTemplateThemePreset(id).vars
}

export function formatTemplateThemeCss(id: string): string {
  const preset = getTemplateThemePreset(id)
  const lines = Object.entries(preset.vars).map(([name, value]) => `  ${name}: ${value};`)
  return `:root {\n${lines.join('\n')}\n}`
}
