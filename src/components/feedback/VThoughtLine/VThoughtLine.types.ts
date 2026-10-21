import type { VMotionLevel } from '../../../motion/types'

export interface VThoughtLineStep {
  id?: string
  label: string
}

export interface VThoughtLineProps {
  label?: string
  steps?: VThoughtLineStep[]
  duration?: number
  motion?: VMotionLevel
  defaultExpanded?: boolean
  ariaLabel?: string
}

export type VThoughtLineEmit = {
  (event: 'update:expanded', value: boolean): void
}
