import type { IconifyIcon } from '@iconify/types'
import plusIcon from '@iconify-icons/keyline-icons/plus'
import xIcon from '@iconify-icons/keyline-icons/x'
import type { VTagInputProps, VTagInputSize } from './VTagInput.types'

export const V_TAG_INPUT_REMOVE_ICON: IconifyIcon = xIcon
export const V_TAG_INPUT_ADD_ICON: IconifyIcon = plusIcon

const SIZES: VTagInputSize[] = ['sm', 'md', 'lg']

export function mountVTagInput(props: VTagInputProps) {
  const size: VTagInputSize = SIZES.includes(props.size as VTagInputSize) ? (props.size as VTagInputSize) : 'md'
  const disabled = Boolean(props.disabled)
  const readonly = Boolean(props.readonly)
  const closable = props.closable !== false && !readonly
  const multiline = Boolean(props.multiline)
  const suggestions = props.suggestions ?? []
  const hasSuggestions = suggestions.length > 0
  const placeholder = props.placeholder ?? 'Add a tag…'
  const emptyText = props.emptyText ?? 'No tags yet.'
  const delimiters = props.delimiters ?? ['enter', 'comma']
  const allowDuplicates = Boolean(props.allowDuplicates)

  let variant: 'default' | 'suggestions' | 'closable' | 'readonly' | 'multiline' = 'default'
  if (readonly) variant = 'readonly'
  else if (multiline) variant = 'multiline'
  else if (hasSuggestions) variant = 'suggestions'

  return {
    size,
    tagSize: (size === 'sm' ? 'sm' : 'md') as 'sm' | 'md',
    disabled,
    readonly,
    closable,
    multiline,
    suggestions,
    hasSuggestions,
    placeholder,
    emptyText,
    delimiters,
    allowDuplicates,
    variant,
    removeIcon: V_TAG_INPUT_REMOVE_ICON,
    addIcon: V_TAG_INPUT_ADD_ICON,
  } as const
}

export function slugifyTag(value: string): string {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
}
