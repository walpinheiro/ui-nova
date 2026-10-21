export type VImageGalleryLayout = 'grid' | 'masonry' | 'carousel'
export type VImageGallerySize = 'sm' | 'md' | 'lg'

export interface VGalleryImage {
  src: string
  alt: string
  id?: string
}

export interface VImageGalleryProps {
  images?: VGalleryImage[]
  layout?: VImageGalleryLayout
  size?: VImageGallerySize
  selectable?: boolean
  multiple?: boolean
  modelValue?: number[]
  loading?: boolean
  columns?: number
  dataTestId?: string
}
