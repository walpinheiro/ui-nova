export type VTreeNavigationSize = 'sm' | 'md' | 'lg'
export type VTreeNavigationVariant = 'file' | 'settings' | 'documentation' | 'simple'

export interface VTreeNavigationItem {
  key: string
  label: string
  icon?: string
  count?: number
  disabled?: boolean
  children?: VTreeNavigationItem[]
  lazy?: boolean
  [field: string]: unknown
}

export interface VTreeNavigationFlatNode {
  item: VTreeNavigationItem
  depth: number
  hasChildren: boolean
  isExpanded: boolean
  parentKey: string | null
}

export interface VTreeNavigationProps {
  active?: string | string[]
  expandedKeys?: string[]
  items?: VTreeNavigationItem[]
  multiple?: boolean
  showCounts?: boolean
  iconField?: string
  lazy?: boolean
  loadChildren?: (node: VTreeNavigationItem) => Promise<VTreeNavigationItem[]>
  disabled?: boolean
  loading?: boolean
  size?: VTreeNavigationSize
  variant?: VTreeNavigationVariant | 'default' | 'primary' | 'subtle'
  ariaLabel?: string
}

export type VTreeNavigationEmit = {
  (event: 'update:active', value: string | string[]): void
  (event: 'update:expandedKeys', value: string[]): void
  (event: 'select', value: string | string[]): void
}
