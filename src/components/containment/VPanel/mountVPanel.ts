import type { IconifyIcon } from '@iconify/types'
import fileTextIcon from '@iconify-icons/keyline-icons/file-text'
import folderIcon from '@iconify-icons/keyline-icons/folder'
import settingsIcon from '@iconify-icons/keyline-icons/settings'
import infoIcon from '@iconify-icons/keyline-icons/info'
import type { VPanelHeadingLevel, VPanelProps, VPanelSize, VPanelVariant } from './VPanel.types'

const SIZES: VPanelSize[] = ['sm', 'md', 'lg']
const VARIANTS: VPanelVariant[] = ['default', 'bordered', 'elevated', 'filled']
const HEADINGS: VPanelHeadingLevel[] = ['2', '3']

const KEYLINE_ICONS: Record<string, IconifyIcon> = {
  document: fileTextIcon,
  folder: folderIcon,
  settings: settingsIcon,
  info: infoIcon,
}

export function mountVPanel(props: VPanelProps) {
  const size: VPanelSize = SIZES.includes(props.size as VPanelSize) ? (props.size as VPanelSize) : 'md'
  const rawVariant = props.variant as string | undefined
  const legacy: Record<string, VPanelVariant> = { primary: 'filled', subtle: 'filled' }
  const variant: VPanelVariant = rawVariant && legacy[rawVariant]
    ? legacy[rawVariant]
    : VARIANTS.includes(props.variant as VPanelVariant)
      ? (props.variant as VPanelVariant)
      : 'default'
  const headingLevel: VPanelHeadingLevel = HEADINGS.includes(props.headingLevel as VPanelHeadingLevel)
    ? (props.headingLevel as VPanelHeadingLevel)
    : '3'
  const iconData = props.icon ? KEYLINE_ICONS[props.icon.toLowerCase()] : undefined
  const isOpen = props.open ?? props.modelValue ?? true

  return {
    size,
    variant,
    headingLevel,
    iconData,
    isOpen: Boolean(isOpen),
  } as const
}
