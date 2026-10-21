import type { VGridCols } from '../shared/gridUtils'

export type VMasonryGridVariant = 'default' | 'image-first' | 'content-first' | 'mixed-media' | 'magazine'
export type VMasonryGridState = 'default' | 'loading' | 'empty'

export interface VMasonryGridProps {
  cols?: VGridCols
  gap?: number
  variant?: VMasonryGridVariant
  loading?: boolean
  empty?: boolean
  ariaLabel?: string
}

export interface VMasonryItemProps {
  id?: string
  title?: string
  category?: string
  selected?: boolean
  interactive?: boolean
  likes?: number
}
