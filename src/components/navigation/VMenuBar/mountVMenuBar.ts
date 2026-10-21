import type { VMenuBarMenu, VMenuBarProps, VMenuBarSize, VMenuBarVariant } from './VMenuBar.types'

const SIZES: VMenuBarSize[] = ['sm', 'md', 'lg']
const VARIANTS: VMenuBarVariant[] = ['default', 'primary', 'subtle']

export const DEFAULT_MENU_BAR_ITEMS: VMenuBarMenu[] = [
  {
    value: 'file',
    label: 'File',
    children: [
      { value: 'new', label: 'New', shortcut: '⌘N' },
      { value: 'open', label: 'Open…', shortcut: '⌘O' },
      { value: 'divider-1', label: '', divider: true },
      { value: 'save', label: 'Save', shortcut: '⌘S' },
      { value: 'save-as', label: 'Save As…', shortcut: '⇧⌘S' },
      { value: 'divider-2', label: '', divider: true },
      { value: 'quit', label: 'Quit', shortcut: '⌘Q' },
    ],
  },
  {
    value: 'edit',
    label: 'Edit',
    children: [
      { value: 'undo', label: 'Undo', shortcut: '⌘Z' },
      { value: 'redo', label: 'Redo', shortcut: '⇧⌘Z' },
      { value: 'divider-edit-1', label: '', divider: true },
      { value: 'cut', label: 'Cut', shortcut: '⌘X' },
      { value: 'copy', label: 'Copy', shortcut: '⌘C' },
      { value: 'paste', label: 'Paste', shortcut: '⌘V' },
    ],
  },
  {
    value: 'view',
    label: 'View',
    children: [
      { value: 'zoom-in', label: 'Zoom In', shortcut: '⌘+' },
      { value: 'zoom-out', label: 'Zoom Out', shortcut: '⌘-' },
      { value: 'divider-view-1', label: '', divider: true },
      { value: 'fullscreen', label: 'Enter Full Screen', shortcut: '⌃⌘F' },
    ],
  },
  {
    value: 'help',
    label: 'Help',
    children: [
      { value: 'docs', label: 'Documentation' },
      { value: 'shortcuts', label: 'Keyboard Shortcuts' },
      { value: 'divider-help-1', label: '', divider: true },
      { value: 'about', label: 'About' },
    ],
  },
]

export function mountVMenuBar(props: VMenuBarProps) {
  const size: VMenuBarSize = SIZES.includes(props.size as VMenuBarSize)
    ? (props.size as VMenuBarSize)
    : 'md'
  const variant: VMenuBarVariant = VARIANTS.includes(props.variant as VMenuBarVariant)
    ? (props.variant as VMenuBarVariant)
    : 'default'

  return {
    size,
    variant,
    items: props.items ?? DEFAULT_MENU_BAR_ITEMS,
    disabled: Boolean(props.disabled || props.loading),
    loading: Boolean(props.loading),
    openOnHover: Boolean(props.openOnHover),
    hoverDelay: props.hoverDelay ?? 150,
  } as const
}
