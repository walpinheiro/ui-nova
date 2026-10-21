import type { IconifyIcon } from '@iconify/types'
import checkIcon from '@iconify-icons/keyline-icons/check'
import chevronLeftIcon from '@iconify-icons/keyline-icons/chevron-left'
import chevronRightIcon from '@iconify-icons/keyline-icons/chevron-right'
import imageIcon from '@iconify-icons/keyline-icons/image'
import xIcon from '@iconify-icons/keyline-icons/x'
import type { VImageGalleryProps } from './VImageGallery.types'

export const V_IMAGE_GALLERY_ICONS = {
  check: checkIcon,
  close: xIcon,
  prev: chevronLeftIcon,
  next: chevronRightIcon,
  empty: imageIcon,
} satisfies Record<string, IconifyIcon>

export function mountVImageGallery(props: VImageGalleryProps) {
  const layout = props.layout ?? 'grid'
  const size = props.size ?? 'md'
  const images = props.images ?? []

  return {
    layout,
    size,
    images,
    selectable: Boolean(props.selectable),
    multiple: Boolean(props.multiple),
    isEmpty: images.length === 0 && !props.loading,
    testId: props.dataTestId ?? 'v-image-gallery',
    columns: props.columns ?? (layout === 'grid' ? 3 : undefined),
  } as const
}
