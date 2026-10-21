import type { VMotionLevel } from '../../../motion/types'

export interface VSwipeRowAction {
  key: string
  label: string
  intent?: 'default' | 'destructive'
}

export interface VSwipeRowProps {
  actions?: VSwipeRowAction[]
  disabled?: boolean
  motion?: VMotionLevel
}
