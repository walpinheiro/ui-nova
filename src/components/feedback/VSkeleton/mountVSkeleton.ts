import type { VSkeletonProps, VSkeletonSize, VSkeletonVariant } from './VSkeleton.types'

const SIZES: VSkeletonSize[] = ['xs', 'sm', 'md', 'lg']
const VARIANTS: VSkeletonVariant[] = ['text', 'avatar', 'card', 'table-row', 'chart']

export function mountVSkeleton(props: VSkeletonProps) {
  const size = SIZES.includes(props.size as VSkeletonSize) ? (props.size as VSkeletonSize) : 'md'
  const variant = VARIANTS.includes(props.variant as VSkeletonVariant)
    ? (props.variant as VSkeletonVariant)
    : 'text'
  const disabled = Boolean(props.disabled)
  const paused = Boolean(props.paused)
  const animated = props.animated ?? true
  const shimmering = animated && !disabled && !paused
  const lines = Math.max(1, props.lines ?? 3)

  const state = disabled
    ? 'disabled'
    : paused
      ? 'paused'
      : animated
        ? 'animated'
        : 'default'

  return {
    size,
    variant,
    disabled,
    paused,
    animated,
    shimmering,
    lines,
    busy: animated && !disabled,
    state,
  } as const
}
