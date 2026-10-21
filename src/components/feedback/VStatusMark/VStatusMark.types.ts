import type { VMotionLevel } from '../../../motion/types'

export type VStatusMarkState = 'idle' | 'running' | 'success' | 'error'
export type VStatusMarkSize = 'sm' | 'md' | 'lg'

export interface VStatusMarkProps {
  state?: VStatusMarkState
  size?: VStatusMarkSize
  label?: string
  motion?: VMotionLevel
}
