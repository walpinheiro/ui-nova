import type { IconifyIcon } from '@iconify/types'
import searchIcon from '@iconify-icons/keyline-icons/search'
import terminalIcon from '@iconify-icons/keyline-icons/terminal'
import xIcon from '@iconify-icons/keyline-icons/x'
import type { VSearchFieldProps, VSearchFieldSize, VSearchFieldVariant } from './VSearchField.types'

export const V_SEARCH_FIELD_SEARCH_ICON: IconifyIcon = searchIcon
export const V_SEARCH_FIELD_COMMAND_ICON: IconifyIcon = terminalIcon
export const V_SEARCH_FIELD_CLEAR_ICON: IconifyIcon = xIcon

const SIZES: VSearchFieldSize[] = ['sm', 'md', 'lg']
const VARIANTS: VSearchFieldVariant[] = ['standard', 'shortcut', 'command']

export function mountVSearchField(props: VSearchFieldProps) {
  const size: VSearchFieldSize = SIZES.includes(props.size as VSearchFieldSize) ? (props.size as VSearchFieldSize) : 'md'
  const variant: VSearchFieldVariant = VARIANTS.includes(props.variant as VSearchFieldVariant)
    ? (props.variant as VSearchFieldVariant)
    : props.shortcut
      ? 'shortcut'
      : 'standard'
  const disabled = Boolean(props.disabled)
  const loading = Boolean(props.loading)
  const clearable = props.clearable !== false
  const showShortcut = variant === 'shortcut' || variant === 'command' || Boolean(props.shortcut)
  const leadingIcon = variant === 'command' ? V_SEARCH_FIELD_COMMAND_ICON : V_SEARCH_FIELD_SEARCH_ICON

  return {
    size,
    variant,
    disabled,
    loading,
    clearable,
    showShortcut,
    leadingIcon,
    clearIcon: V_SEARCH_FIELD_CLEAR_ICON,
    shortcutKeys: props.shortcutKeys ?? '⌘K',
    suggestions: props.suggestions ?? [],
  } as const
}
