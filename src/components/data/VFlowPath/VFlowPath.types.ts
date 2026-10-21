import type { IconifyIcon } from '@iconify/types'

export type VFlowStatus = 'success' | 'warning' | 'error' | 'neutral' | 'active'

export interface VFlowNode {
  id: string | number
  title: string
  subtitle?: string
  icon?: IconifyIcon
}

export interface VFlowMetric {
  value: string | number
  label: string
}

export interface VFlowEdge {
  /** Metrics shown in the connector chip (e.g. `9.1 KB context`). */
  metrics?: VFlowMetric[]
  /** Connector color + accessible status. Defaults to `success`. */
  status?: VFlowStatus
  /** Accessible description of the edge (e.g. "handoff"). */
  label?: string
}

export interface VFlowPathProps {
  nodes?: VFlowNode[]
  /** `edges[i]` connects `nodes[i]` → `nodes[i + 1]`. */
  edges?: VFlowEdge[]
  /** Animated dash on `active` edges. */
  animated?: boolean
  ariaLabel?: string
  dataTestId?: string
}
