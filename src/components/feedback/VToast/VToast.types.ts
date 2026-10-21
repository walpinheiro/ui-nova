import type { VMotionLevel } from '../../../motion/types'

export type VToastSize = 'sm' | 'md' | 'lg'
export type VToastVariant = 'success' | 'info' | 'warning' | 'error' | 'loading'
export type VToastPlacement =
  | 'top-right'
  | 'top-left'
  | 'bottom-right'
  | 'bottom-left'
  | 'top-center'
  | 'bottom-center'

export interface VToastProps {
  message?: string
  variant?: VToastVariant
  size?: VToastSize
  duration?: number
  closable?: boolean
  showProgress?: boolean
  loading?: boolean
  disabled?: boolean
  dismissLabel?: string
  ariaLabel?: string
  modelValue?: boolean
  motion?: VMotionLevel
}

export interface VToastEmits {
  'update:modelValue': [value: boolean]
  close: []
}

export interface VToastQueueItem {
  id: string
  message: string
  variant?: VToastVariant
  size?: VToastSize
  duration?: number
  closable?: boolean
  showProgress?: boolean
}

export interface VToastQueueOptions {
  message: string
  variant?: VToastVariant
  size?: VToastSize
  duration?: number
  closable?: boolean
  showProgress?: boolean
}
