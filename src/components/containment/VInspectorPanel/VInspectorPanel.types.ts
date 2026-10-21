export type VInspectorPanelSize = 'compact' | 'default' | 'wide'
export type VInspectorPanelVariant = 'default' | 'minimal' | 'tabs' | 'floating'

export interface VInspectorPanelTab {
  value: string
  label: string
  disabled?: boolean
}

export interface VInspectorPanelSection {
  value: string
  label: string
  expanded?: boolean
  disabled?: boolean
  tab?: string
}

export interface VInspectorPanelProps {
  /** Controls visibility. `v-model:open` (primary) — `modelValue` accepted as alias. */
  open?: boolean
  modelValue?: boolean
  title?: string
  tabs?: VInspectorPanelTab[]
  activeTab?: string
  sections?: VInspectorPanelSection[]
  expandedSections?: string[]
  size?: VInspectorPanelSize
  variant?: VInspectorPanelVariant
  showClose?: boolean
  /** Escape closes the panel and returns focus to the opener. */
  dismissible?: boolean
  disabled?: boolean
  loading?: boolean
  ariaLabel?: string
}

export type VInspectorPanelEmits = {
  'update:open': [value: boolean]
  'update:modelValue': [value: boolean]
  'update:activeTab': [value: string]
  'update:expandedSections': [value: string[]]
  'open-change': [value: boolean]
  'tab-change': [value: string]
  'section-toggle': [value: string, expanded: boolean]
  close: []
  dismiss: []
}
