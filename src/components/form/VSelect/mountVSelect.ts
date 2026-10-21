import type { IconifyIcon } from '@iconify/types'
import checkIcon from '@iconify-icons/keyline-icons/check'
import chevronDownIcon from '@iconify-icons/keyline-icons/chevron-down'
import circleAlertIcon from '@iconify-icons/keyline-icons/circle-alert'
import folderIcon from '@iconify-icons/keyline-icons/folder'
import layersIcon from '@iconify-icons/keyline-icons/layers'
import searchIcon from '@iconify-icons/keyline-icons/search'
import userIcon from '@iconify-icons/keyline-icons/user'
import xIcon from '@iconify-icons/keyline-icons/x'
import type { VSelectOption, VSelectProps, VSelectSize } from './VSelect.types'

export const V_SELECT_UI_ICONS = {
  check: checkIcon,
  chevronDown: chevronDownIcon,
  clear: xIcon,
  error: circleAlertIcon,
} as const

export const V_SELECT_LEADING_ICONS: Record<string, IconifyIcon> = {
  search: searchIcon,
  user: userIcon,
  layers: layersIcon,
  folder: folderIcon,
  category: layersIcon,
  categories: layersIcon,
}

export const DEFAULT_VSELECT_OPTIONS: VSelectOption[] = [
  { value: 'product', label: 'Product' },
  { value: 'marketing', label: 'Marketing' },
  { value: 'development', label: 'Development' },
  { value: 'design', label: 'Design' },
  { value: 'human-resources', label: 'Human Resources' },
]

const SIZES: VSelectSize[] = ['sm', 'md', 'lg']

export function resolveVSelectLeadingIcon(icon?: string): IconifyIcon | undefined {
  if (!icon) return undefined
  return V_SELECT_LEADING_ICONS[icon.toLowerCase()]
}

export function mountVSelect(props: VSelectProps) {
  const size: VSelectSize = SIZES.includes(props.size as VSelectSize) ? (props.size as VSelectSize) : 'md'
  const options = props.options ?? DEFAULT_VSELECT_OPTIONS
  const disabled = Boolean(props.disabled)
  const hasError = Boolean(props.errorMessage)
  const selectedOption = options.find((option) => option.value === props.modelValue)
  const leadingIconData = resolveVSelectLeadingIcon(props.leadingIcon)
  const clearValue = props.clearValue ?? ''
  const clearable = Boolean(props.clearable)

  return {
    size,
    options,
    disabled,
    hasError,
    selectedOption,
    displayLabel: selectedOption?.label ?? props.placeholder ?? 'Select option',
    hasValue: Boolean(selectedOption && props.modelValue !== clearValue),
    leadingIconData,
    placeholder: props.placeholder ?? 'Select option',
    errorIcon: V_SELECT_UI_ICONS.error,
    clearable,
    clearValue,
    clearIcon: V_SELECT_UI_ICONS.clear,
  } as const
}
