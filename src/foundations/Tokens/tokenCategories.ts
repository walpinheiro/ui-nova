export interface TokenCategory {
  id: string
  label: string
  test: (name: string) => boolean
}

/** Ordem importa: primeira regra que bater classifica o token. */
export const TOKEN_CATEGORIES: TokenCategory[] = [
  {
    id: 'layout',
    label: 'Layout / z-index',
    test: (n) =>
      n.startsWith('--v-flex-') ||
      n.startsWith('--v-stack-') ||
      n.startsWith('--v-z-index-'),
  },
  { id: 'space', label: 'Espaçamento', test: (n) => n.startsWith('--v-space-') },
  {
    id: 'radius',
    label: 'Radius',
    test: (n) => n.startsWith('--v-radius-') || n.includes('-radius') || n.endsWith('-radius'),
  },
  { id: 'color', label: 'Cor', test: (n) => n.startsWith('--v-color-') },
  {
    id: 'typography',
    label: 'Tipografia',
    test: (n) => n.startsWith('--v-font-') || n.startsWith('--v-line-height-'),
  },
  { id: 'shadow', label: 'Sombra', test: (n) => n.startsWith('--v-shadow-') },
  {
    id: 'border-focus',
    label: 'Borda e foco',
    test: (n) =>
      n.startsWith('--v-border-') ||
      n.startsWith('--v-focus-') ||
      n === '--v-sr-only-size',
  },
  {
    id: 'motion',
    label: 'Motion e easing',
    test: (n) =>
      n.startsWith('--v-motion-') ||
      n.startsWith('--v-ease-') ||
      n.startsWith('--v-gesture-') ||
      n.startsWith('--v-split-transition-') ||
      n.startsWith('--v-tooltip-warm-'),
  },
  {
    id: 'state',
    label: 'Estado e loader',
    test: (n) =>
      n.startsWith('--v-state-') ||
      n.startsWith('--v-skeleton-') ||
      n.startsWith('--v-loader-'),
  },
  {
    id: 'chip-tag',
    label: 'Chip / Tag',
    test: (n) => n.startsWith('--v-chip-') || n.startsWith('--v-tag-'),
  },
  {
    id: 'field',
    label: 'Campo (shared)',
    test: (n) => n.startsWith('--v-field-'),
  },
  { id: 'button', label: 'Button', test: (n) => n.startsWith('--v-button-') },
  { id: 'checkbox', label: 'Checkbox', test: (n) => n.startsWith('--v-checkbox-') },
  { id: 'switch', label: 'Switch', test: (n) => n.startsWith('--v-switch-') },
  { id: 'slider', label: 'Slider', test: (n) => n.startsWith('--v-slider-') },
  { id: 'radio', label: 'Radio', test: (n) => n.startsWith('--v-radiogroup-') },
  { id: 'text-input', label: 'Text input', test: (n) => n.startsWith('--v-text-input-') },
  { id: 'textarea', label: 'Textarea', test: (n) => n.startsWith('--v-textarea-') },
  { id: 'number-input', label: 'Number input', test: (n) => n.startsWith('--v-number-input-') },
  { id: 'otp', label: 'OTP', test: (n) => n.startsWith('--v-otp-') },
  { id: 'select', label: 'Select', test: (n) => n.startsWith('--v-select-') },
  { id: 'searchfield', label: 'Search field', test: (n) => n.startsWith('--v-searchfield-') },
  { id: 'password', label: 'Password', test: (n) => n.startsWith('--v-password-') },
  { id: 'date-picker', label: 'Date picker', test: (n) => n.startsWith('--v-date-picker-') },
  { id: 'date-range', label: 'Date range', test: (n) => n.startsWith('--v-date-range-') },
  { id: 'tag-input', label: 'Tag input', test: (n) => n.startsWith('--v-tag-input-') },
  { id: 'file-upload', label: 'File upload', test: (n) => n.startsWith('--v-file-upload-') },
  { id: 'color-picker', label: 'Color picker', test: (n) => n.startsWith('--v-color-picker-') },
  { id: 'prompt-bar', label: 'Prompt bar', test: (n) => n.startsWith('--v-prompt-bar-') },
  { id: 'toast', label: 'Toast', test: (n) => n.startsWith('--v-toast-') },
  { id: 'tooltip', label: 'Tooltip', test: (n) => n.startsWith('--v-tooltip-') },
  {
    id: 'spinner-progress',
    label: 'Spinner / Progress',
    test: (n) => n.startsWith('--v-spinner-') || n.startsWith('--v-progress-'),
  },
  { id: 'notification', label: 'Notification', test: (n) => n.startsWith('--v-notification-') },
  { id: 'thought-line', label: 'Thought line', test: (n) => n.startsWith('--v-thought-line-') },
  { id: 'card', label: 'Card', test: (n) => n.startsWith('--v-card-') },
  { id: 'panel', label: 'Panel', test: (n) => n.startsWith('--v-panel-') },
  { id: 'section', label: 'Section', test: (n) => n.startsWith('--v-section-') },
  { id: 'window', label: 'Window', test: (n) => n.startsWith('--v-window-') },
  { id: 'avatar', label: 'Avatar', test: (n) => n.startsWith('--v-avatar-') },
  { id: 'gallery', label: 'Gallery', test: (n) => n.startsWith('--v-gallery-') },
  { id: 'table', label: 'Table', test: (n) => n.startsWith('--v-table-') },
  { id: 'filter-bar', label: 'Filter bar', test: (n) => n.startsWith('--v-filter-bar-') },
  { id: 'grid', label: 'Grid / layout', test: (n) => n.startsWith('--v-grid-') || n.startsWith('--v-grid-demo-') },
  { id: 'appshell', label: 'App shell', test: (n) => n.startsWith('--v-appshell-') },
  { id: 'widget', label: 'Widget', test: (n) => n.startsWith('--v-widget-') || n.startsWith('--v-dashboard-widget-') },
  { id: 'toolbar', label: 'Toolbar', test: (n) => n.startsWith('--v-toolbar-') },
  { id: 'swipe-row', label: 'Swipe row', test: (n) => n.startsWith('--v-swipe-row-') },
  { id: 'breadcrumb', label: 'Breadcrumb', test: (n) => n.startsWith('--v-breadcrumb-') },
  { id: 'icon', label: 'Ícone', test: (n) => n.startsWith('--v-icon-') },
  { id: 'tree', label: 'Tree', test: (n) => n.startsWith('--v-tree-') },
  { id: 'dropdown', label: 'Dropdown', test: (n) => n.startsWith('--v-dropdown-') },
  { id: 'popover', label: 'Popover', test: (n) => n.startsWith('--v-popover-') },
  { id: 'sidebar', label: 'Sidebar', test: (n) => n.startsWith('--v-sidebar-') },
  { id: 'tabs', label: 'Tabs', test: (n) => n.startsWith('--v-tabs-') },
  { id: 'breakpoint', label: 'Breakpoint', test: (n) => n.startsWith('--v-breakpoint-') },
  { id: 'vf', label: 'VueUI legacy (vf-)', test: (n) => n.startsWith('--vf-') },
]

export function getTokenCategory(name: string): string {
  return TOKEN_CATEGORIES.find((c) => c.test(name))?.label ?? 'Outros'
}

export function isColorToken(name: string, value: string): boolean {
  if (!name.startsWith('--v-color-')) return false
  if (/^#|^rgb|^hsl|^color\(/i.test(value)) return true
  return /^[0-9a-f]{3,8}$/i.test(value.replace('#', ''))
}
