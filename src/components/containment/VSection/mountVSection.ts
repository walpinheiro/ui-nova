import type { IconifyIcon } from '@iconify/types'
import userIcon from '@iconify-icons/keyline-icons/user'
import settingsIcon from '@iconify-icons/keyline-icons/settings'
import folderIcon from '@iconify-icons/keyline-icons/folder'
import infoIcon from '@iconify-icons/keyline-icons/info'
import type { VSectionHeadingLevel, VSectionProps, VSectionSize, VSectionVariant } from './VSection.types'

const SIZES: VSectionSize[] = ['sm', 'md', 'lg']
const VARIANTS: VSectionVariant[] = ['default', 'elevated', 'bordered', 'borderless', 'tinted']
const HEADINGS: VSectionHeadingLevel[] = ['2', '3']

const KEYLINE_ICONS: Record<string, IconifyIcon> = {
  user: userIcon,
  settings: settingsIcon,
  folder: folderIcon,
  info: infoIcon,
}

export function mountVSection(props: VSectionProps) {
  const size: VSectionSize = SIZES.includes(props.size as VSectionSize) ? (props.size as VSectionSize) : 'md'
  const rawVariant = props.variant as string | undefined
  const legacy: Record<string, VSectionVariant> = { primary: 'tinted', subtle: 'borderless' }
  const variant: VSectionVariant = rawVariant && legacy[rawVariant]
    ? legacy[rawVariant]
    : VARIANTS.includes(props.variant as VSectionVariant)
      ? (props.variant as VSectionVariant)
      : 'default'
  const headingLevel: VSectionHeadingLevel = HEADINGS.includes(props.headingLevel as VSectionHeadingLevel)
    ? (props.headingLevel as VSectionHeadingLevel)
    : '2'
  const iconData = props.icon ? KEYLINE_ICONS[props.icon.toLowerCase()] : undefined

  return {
    size,
    variant,
    headingLevel,
    iconData,
  } as const
}
