import type { IconifyIcon } from '@iconify/types'
import plusIcon from '@iconify-icons/keyline-icons/plus'
import folderOpenIcon from '@iconify-icons/keyline-icons/folder-open'
import deleteIcon from '@iconify-icons/keyline-icons/delete'
import rotateCcwIcon from '@iconify-icons/keyline-icons/rotate-ccw'
import rotateCwIcon from '@iconify-icons/keyline-icons/rotate-cw'
import boldIcon from '@iconify-icons/keyline-icons/bold'
import italicIcon from '@iconify-icons/keyline-icons/italic'
import underlineIcon from '@iconify-icons/keyline-icons/underline'
import linkIcon from '@iconify-icons/keyline-icons/link'
import hardDriveIcon from '@iconify-icons/keyline-icons/hard-drive'
import imageIcon from '@iconify-icons/keyline-icons/image'
import fileTextIcon from '@iconify-icons/keyline-icons/file-text'
import listIcon from '@iconify-icons/keyline-icons/list'
import moreHorizontalIcon from '@iconify-icons/keyline-icons/more-horizontal'
import shareIcon from '@iconify-icons/keyline-icons/share'
import downloadIcon from '@iconify-icons/keyline-icons/download'
import copyIcon from '@iconify-icons/keyline-icons/copy'
import moveIcon from '@iconify-icons/keyline-icons/move'
import searchIcon from '@iconify-icons/keyline-icons/search'
import squareIcon from '@iconify-icons/keyline-icons/square'
import scanIcon from '@iconify-icons/keyline-icons/scan'
import type { VToolbarButtonProps, VToolbarButtonVariant } from './VToolbar.types'

const VARIANTS: VToolbarButtonVariant[] = ['default', 'primary', 'toggle']

const KEYLINE_ICONS: Record<string, IconifyIcon> = {
  plus: plusIcon,
  new: plusIcon,
  open: folderOpenIcon,
  folder: folderOpenIcon,
  delete: deleteIcon,
  trash: deleteIcon,
  undo: rotateCcwIcon,
  redo: rotateCwIcon,
  bold: boldIcon,
  italic: italicIcon,
  underline: underlineIcon,
  link: linkIcon,
  save: hardDriveIcon,
  image: imageIcon,
  doc: fileTextIcon,
  list: listIcon,
  'more-h': moreHorizontalIcon,
  more: moreHorizontalIcon,
  share: shareIcon,
  download: downloadIcon,
  duplicate: copyIcon,
  'move-to': moveIcon,
  move: moveIcon,
  pan: moveIcon,
  select: squareIcon,
  square: squareIcon,
  zoom: searchIcon,
  search: searchIcon,
  scan: scanIcon,
}

export function resolveToolbarIcon(icon?: string): IconifyIcon | undefined {
  if (!icon) return undefined
  return KEYLINE_ICONS[icon.toLowerCase()]
}

export function mountVToolbarButton(props: VToolbarButtonProps) {
  const variant: VToolbarButtonVariant = VARIANTS.includes(props.variant as VToolbarButtonVariant)
    ? (props.variant as VToolbarButtonVariant)
    : 'default'
  const iconKey = props.icon?.toLowerCase()
  const iconData = iconKey ? KEYLINE_ICONS[iconKey] : undefined
  const testSuffix = iconKey?.replace(/[^a-z0-9-]/g, '') || (props.label?.toLowerCase().replace(/\s+/g, '-') ?? 'action')
  const accessibleName = props.ariaLabel ?? props.label ?? props.icon ?? 'Toolbar action'

  return {
    variant,
    iconData,
    iconKey,
    testSuffix,
    accessibleName,
    hasMenu: Boolean(props.menu?.length),
    disabled: Boolean(props.disabled),
    active: Boolean(props.active),
  } as const
}
