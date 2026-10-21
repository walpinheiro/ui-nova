import settingsIcon from '@iconify-icons/keyline-icons/settings'
import xIcon from '@iconify-icons/keyline-icons/x'
import chevronDownIcon from '@iconify-icons/keyline-icons/chevron-down'
import chevronRightIcon from '@iconify-icons/keyline-icons/chevron-right'
import type {
  VInspectorPanelProps,
  VInspectorPanelSection,
  VInspectorPanelSize,
  VInspectorPanelTab,
  VInspectorPanelVariant,
} from './VInspectorPanel.types'

const SIZES: VInspectorPanelSize[] = ['compact', 'default', 'wide']
const VARIANTS: VInspectorPanelVariant[] = ['default', 'minimal', 'tabs', 'floating']

const DEFAULT_TABS: Record<VInspectorPanelVariant, VInspectorPanelTab[]> = {
  default: [
    { value: 'properties', label: 'Properties' },
    { value: 'styles', label: 'Styles' },
    { value: 'interactions', label: 'Interactions' },
  ],
  minimal: [
    { value: 'properties', label: 'Properties' },
    { value: 'styles', label: 'Styles' },
  ],
  tabs: [
    { value: 'properties', label: 'Properties' },
    { value: 'styles', label: 'Styles' },
    { value: 'meta', label: 'Meta' },
  ],
  floating: [],
}

const DEFAULT_SECTIONS: VInspectorPanelSection[] = [
  { value: 'general', label: 'General', expanded: true, tab: 'properties' },
  { value: 'layout', label: 'Layout', tab: 'properties' },
  { value: 'appearance', label: 'Appearance', tab: 'styles' },
  { value: 'advanced', label: 'Advanced', tab: 'interactions' },
]

export function mountVInspectorPanel(props: VInspectorPanelProps) {
  const size: VInspectorPanelSize = SIZES.includes(props.size as VInspectorPanelSize)
    ? (props.size as VInspectorPanelSize)
    : 'default'
  const variant: VInspectorPanelVariant = VARIANTS.includes(props.variant as VInspectorPanelVariant)
    ? (props.variant as VInspectorPanelVariant)
    : 'default'
  const open = Boolean(props.open ?? props.modelValue ?? true)
  const tabs = props.tabs ?? DEFAULT_TABS[variant]
  const sections = props.sections ?? DEFAULT_SECTIONS
  const activeTab = props.activeTab ?? tabs[0]?.value ?? 'properties'
  const expandedSections = props.expandedSections ?? sections.filter((section) => section.expanded).map((section) => section.value)

  return {
    size,
    variant,
    open,
    tabs,
    sections,
    activeTab,
    expandedSections,
    showTabs: variant !== 'floating' && tabs.length > 0,
    showClose: props.showClose ?? true,
    dismissible: props.dismissible ?? true,
    disabled: Boolean(props.disabled || props.loading),
    loading: Boolean(props.loading),
    icons: {
      settings: settingsIcon,
      close: xIcon,
      chevronDown: chevronDownIcon,
      chevronRight: chevronRightIcon,
    },
  } as const
}
