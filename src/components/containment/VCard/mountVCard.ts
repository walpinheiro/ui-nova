import type { IconifyIcon } from '@iconify/types'
import checkIcon from '@iconify-icons/keyline-icons/check'
import type {
  VCardMediaPlacement,
  VCardProps,
  VCardRefineFrameStage,
  VCardSize,
  VCardVariant,
} from './VCard.types'

const SIZES: VCardSize[] = ['sm', 'md', 'lg']
const VARIANTS: VCardVariant[] = ['elevated', 'outlined', 'filled', 'interactive']
const MEDIA_PLACEMENTS: VCardMediaPlacement[] = ['top', 'start', 'end', 'bottom']
const REFINE_FRAME_STAGES: VCardRefineFrameStage[] = ['queued', 'generating', 'refining', 'complete']

export const V_CARD_SELECTED_ICON: IconifyIcon = checkIcon

export const V_CARD_REFINE_FRAME_LABELS: Record<VCardRefineFrameStage, string> = {
  queued: 'Queued',
  generating: 'Generating',
  refining: 'Refining',
  complete: 'Complete',
}

export function mountVCard(props: VCardProps) {
  const size: VCardSize = SIZES.includes(props.size as VCardSize) ? (props.size as VCardSize) : 'md'
  const variant: VCardVariant = VARIANTS.includes(props.variant as VCardVariant)
    ? (props.variant as VCardVariant)
    : 'elevated'
  const mediaPlacement: VCardMediaPlacement = MEDIA_PLACEMENTS.includes(
    props.mediaPlacement as VCardMediaPlacement,
  )
    ? (props.mediaPlacement as VCardMediaPlacement)
    : 'top'
  const loading = Boolean(props.loading)
  const selected = Boolean(props.selected)
  const actionable = (variant === 'interactive' || Boolean(props.interactive)) && !loading
  const refineFrame = REFINE_FRAME_STAGES.includes(props.refineFrame as VCardRefineFrameStage)
    ? (props.refineFrame as VCardRefineFrameStage)
    : undefined

  return {
    size,
    variant,
    mediaPlacement,
    loading,
    selected,
    actionable,
    refineFrame,
    refineFrameLabel: refineFrame ? V_CARD_REFINE_FRAME_LABELS[refineFrame] : undefined,
    showRefineFrame: Boolean(refineFrame),
    refineFrameActive: refineFrame === 'generating' || refineFrame === 'refining',
  } as const
}
