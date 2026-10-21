import type { VMotionLevel } from '../../../motion/types'

export type VAgentChipStatus = 'pending' | 'success' | 'error'

export interface VAgentChipProps {
  label?: string
  status?: VAgentChipStatus
  durationMs?: number
  motion?: VMotionLevel
  ariaLabel?: string
  retryLabel?: string
}

export type VAgentChipEmit = {
  (event: 'retry'): void
}
