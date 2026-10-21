export interface FunctionalClassRow {
  className: string
  property: string
  token: string
  notes?: string
}

export const RADIUS_FUNCTIONAL_CLASSES: FunctionalClassRow[] = [
  { className: 'rounded-0', property: 'border-radius', token: '--v-radius-0' },
  { className: 'rounded-4', property: 'border-radius', token: '--v-radius-4' },
  { className: 'rounded-8', property: 'border-radius', token: '--v-radius-8' },
  { className: 'rounded-12', property: 'border-radius', token: '--v-radius-12' },
  { className: 'rounded-16', property: 'border-radius', token: '--v-radius-16' },
  { className: 'rounded-24', property: 'border-radius', token: '--v-radius-24' },
  { className: 'rounded-sm', property: 'border-radius', token: '--v-radius-sm', notes: 'Alias de --v-radius-8' },
  { className: 'rounded-md', property: 'border-radius', token: '--v-radius-md', notes: 'Alias de --v-radius-12' },
  { className: 'rounded-lg', property: 'border-radius', token: '--v-radius-lg', notes: 'Alias de --v-radius-16' },
  {
    className: 'rounded-full',
    property: 'border-radius',
    token: '--v-radius-full / --v-radius-circle',
    notes: 'Círculo (50%). Não use em chips retangulares — prefira --v-radius-pill',
  },
]

export const RADIUS_CSS_VARS: FunctionalClassRow[] = [
  { className: 'var(--v-radius-pill)', property: 'border-radius', token: '--v-radius-pill', notes: 'Cápsula: tags, badges, tabs pill' },
  { className: 'var(--v-radius-circle)', property: 'border-radius', token: '--v-radius-circle', notes: 'Círculo perfeito em quadrados' },
  { className: 'var(--v-card-radius)', property: 'border-radius', token: '--v-card-radius', notes: 'Token de componente VCard' },
  { className: 'var(--v-chip-radius)', property: 'border-radius', token: '--v-chip-radius', notes: 'Herda --v-radius-pill' },
]

export const SPACING_FUNCTIONAL_CLASSES: FunctionalClassRow[] = [
  { className: 'p-0 … p-24', property: 'padding', token: '--v-space-{n}', notes: 'p-0, p-1, p-2, p-3, p-4, p-6, p-8, p-12, p-16, p-24' },
  { className: 'm-0 … m-24', property: 'margin', token: '--v-space-{n}', notes: 'Mesma escala do padding' },
  { className: 'px-* / py-*', property: 'padding-inline / block', token: '--v-space-{n}' },
  { className: 'mx-* / my-*', property: 'margin-inline / block', token: '--v-space-{n}' },
  { className: 'gap-0 … gap-24', property: 'gap', token: '--v-space-{n}', notes: 'Flex e grid nos componentes' },
  { className: 'left-* / top-* / right-* / bottom-*', property: 'inset', token: '--v-space-{n}' },
]

export const SPACING_SCALE = [
  { token: '--v-space-0', key: '0', px: '0' },
  { token: '--v-space-1', key: '1', px: '4px' },
  { token: '--v-space-2', key: '2', px: '8px' },
  { token: '--v-space-3', key: '3', px: '12px' },
  { token: '--v-space-4', key: '4', px: '16px' },
  { token: '--v-space-6', key: '6', px: '24px' },
  { token: '--v-space-8', key: '8', px: '32px' },
  { token: '--v-space-12', key: '12', px: '48px' },
  { token: '--v-space-16', key: '16', px: '64px' },
  { token: '--v-space-24', key: '24', px: '96px' },
] as const

export const BORDER_FUNCTIONAL_CLASSES: FunctionalClassRow[] = [
  { className: 'border', property: 'border-width', token: '--v-border-width', notes: 'Default 1px' },
  { className: 'border-focus', property: 'border-width', token: '--v-border-width-focus', notes: '2px — destaque' },
  { className: 'border-border', property: 'border-color', token: '--v-color-border' },
  { className: 'border-border-disabled', property: 'border-color', token: '--v-color-border-disabled' },
  { className: 'border-dashed', property: 'border-style', token: '—', notes: 'Estilo; cor/largura ainda vêm dos tokens' },
  { className: 'border-0', property: 'border-width', token: '0', notes: 'Remove borda' },
]

export const BORDER_CSS_VARS: FunctionalClassRow[] = [
  { className: 'outline + offset', property: 'focus ring', token: '--v-focus-ring-width, --v-focus-ring-offset, --v-color-focus' },
  { className: 'var(--v-field-border-width-strong)', property: 'border-width', token: '--v-field-border-width-strong', notes: 'OTP, file upload, gallery' },
  { className: 'var(--v-gallery-border-width)', property: 'border-width', token: '--v-gallery-border-width' },
]

export const COLOR_FUNCTIONAL_CLASSES: FunctionalClassRow[] = [
  { className: 'bg-bg', property: 'background', token: '--v-color-bg' },
  { className: 'bg-surface', property: 'background', token: '--v-color-surface' },
  { className: 'bg-elevated', property: 'background', token: '--v-color-elevated' },
  { className: 'bg-primary', property: 'background', token: '--v-color-primary' },
  { className: 'bg-primary-500', property: 'background', token: '--v-color-primary-500' },
  { className: 'bg-neutral-50 … 900', property: 'background', token: '--v-color-neutral-{n}' },
  { className: 'text-text', property: 'color', token: '--v-color-text' },
  { className: 'text-muted', property: 'color', token: '--v-color-text-muted' },
  { className: 'text-on-primary', property: 'color', token: '--v-color-on-primary' },
  { className: 'text-primary', property: 'color', token: '--v-color-primary' },
  { className: 'bg-success / text-success', property: 'background / color', token: '--v-color-success-*' },
  { className: 'bg-error / text-error', property: 'background / color', token: '--v-color-error-*' },
  { className: 'bg-warning / text-warning', property: 'background / color', token: '--v-color-warning-*' },
  { className: 'bg-info / text-info', property: 'background / color', token: '--v-color-info-*' },
]

export const COLOR_PALETTE_GROUPS = [
  {
    id: 'neutral',
    label: 'Neutros (slate)',
    tokens: ['50', '100', '200', '300', '400', '500', '600', '700', '800', '900'].map(
      (n) => `--v-color-neutral-${n}`,
    ),
  },
  {
    id: 'primary',
    label: 'Brand primary (indigo)',
    tokens: ['50', '100', '200', '300', '400', '500', '600', '700', '800', '900'].map(
      (n) => `--v-color-primary-${n}`,
    ),
  },
  {
    id: 'semantic',
    label: 'Semânticas',
    tokens: [
      '--v-color-success-soft',
      '--v-color-success-base',
      '--v-color-success-strong',
      '--v-color-info-soft',
      '--v-color-info-base',
      '--v-color-warning-soft',
      '--v-color-warning-base',
      '--v-color-error-soft',
      '--v-color-error-base',
    ],
  },
  {
    id: 'aliases',
    label: 'Aliases de superfície',
    tokens: [
      '--v-color-bg',
      '--v-color-surface',
      '--v-color-surface-muted',
      '--v-color-text',
      '--v-color-text-muted',
      '--v-color-border',
      '--v-color-primary',
      '--v-color-focus',
    ],
  },
] as const

export const CUSTOM_THEME_PRESET = {
  label: 'Tema customizado (exemplo)',
  vars: {
    '--v-color-primary': '#0d9488',
    '--v-color-primary-hover': '#0f766e',
    '--v-color-primary-500': '#14b8a6',
    '--v-color-primary-600': '#0d9488',
    '--v-color-focus': '#2dd4bf',
    '--v-color-success-base': '#059669',
    '--v-color-error-base': '#dc2626',
  },
} as const

export const LAYOUT_FUNCTIONAL_CLASSES: FunctionalClassRow[] = [
  { className: 'flex + gap-*', property: 'display / gap', token: '--v-space-{n}', notes: 'Flex row/col; gap-2, gap-4, gap-6…' },
  { className: 'var(--v-flex-gap-md)', property: 'gap', token: '--v-flex-gap-md', notes: 'Alias semântico (= --v-space-4)' },
  { className: 'var(--v-stack-gap-md)', property: 'gap (coluna)', token: '--v-stack-gap-md', notes: 'Stacks verticais' },
  { className: 'z-dropdown', property: 'z-index', token: '--v-z-index-dropdown' },
  { className: 'z-modal', property: 'z-index', token: '--v-z-index-modal' },
  { className: 'z-toast', property: 'z-index', token: '--v-z-index-toast' },
  { className: 'z-tooltip', property: 'z-index', token: '--v-z-index-tooltip' },
  { className: 'max-w-grid', property: 'max-width', token: '--v-grid-max-width' },
  { className: 'sm: / md: / lg:', property: 'breakpoint', token: '--v-breakpoint-sm/md/lg', notes: 'Screens no Tailwind' },
]

export const LAYOUT_Z_INDEX_SCALE = [
  { token: '--v-z-index-base', key: 'base', value: '0' },
  { token: '--v-z-index-sticky', key: 'sticky', value: '100' },
  { token: '--v-z-index-dropdown', key: 'dropdown', value: '1000' },
  { token: '--v-z-index-popover', key: 'popover', value: '1000' },
  { token: '--v-z-index-drawer', key: 'drawer', value: '1100' },
  { token: '--v-z-index-modal', key: 'modal', value: '1200' },
  { token: '--v-z-index-toast', key: 'toast', value: '1300' },
  { token: '--v-z-index-tooltip', key: 'tooltip', value: '1400' },
] as const

export const TYPOGRAPHY_FUNCTIONAL_CLASSES: FunctionalClassRow[] = [
  { className: 'text-display-1', property: 'font-size', token: '--v-font-size-display-1' },
  { className: 'text-h1 … text-h5', property: 'font-size', token: '--v-font-size-h*' },
  { className: 'text-text-large / medium / small', property: 'font-size', token: '--v-font-size-text-*' },
  { className: 'text-caption', property: 'font-size', token: '--v-font-size-caption' },
  { className: 'leading-h1 …', property: 'line-height', token: '--v-line-height-*' },
  { className: 'font-regular / semibold / bold', property: 'font-weight', token: '--v-font-weight-*' },
  { className: 'font-sans', property: 'font-family', token: '--v-font-family-sans' },
]

export const SHADOW_FUNCTIONAL_CLASSES: FunctionalClassRow[] = [
  { className: 'shadow-sm', property: 'box-shadow', token: '--v-shadow-sm' },
  { className: 'shadow-md', property: 'box-shadow', token: '--v-shadow-md' },
  { className: 'shadow-lg', property: 'box-shadow', token: '--v-shadow-lg' },
  { className: 'shadow-xl', property: 'box-shadow', token: '--v-shadow-xl' },
]

export const MOTION_FUNCTIONAL_CLASSES: FunctionalClassRow[] = [
  { className: 'duration-fast / normal / slow', property: 'transition-duration', token: '--v-motion-fast/normal/slow' },
  { className: 'ease-standard / out / in / spring', property: 'transition-timing-function', token: '--v-ease-*' },
  { className: 'opacity-disabled / loading', property: 'opacity', token: '--v-state-disabled-opacity / loading' },
  { className: 'var(--v-state-press-scale)', property: 'transform scale', token: '--v-state-press-scale', notes: 'Press feedback em botões e chips' },
  { className: 'var(--v-state-enter-scale)', property: 'transform scale', token: '--v-state-enter-scale', notes: 'Entrada de overlays' },
]
