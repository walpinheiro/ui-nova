import type { VWindowProps } from './VWindow.types'

const SIZES = ['sm', 'md', 'lg'] as const
const VARIANTS = ['default', 'minimal', 'borderless', 'modal'] as const

type Dim = number | string | undefined

/** number → "Npx"; string numérica → "Npx"; demais strings passam (%, px, rem...). */
export function toCssDim(value: Dim): string | undefined {
  if (value === undefined || value === null) return undefined
  if (typeof value === 'number' && Number.isFinite(value)) return `${value}px`
  const s = String(value).trim()
  if (s === '') return undefined
  if (/^\d+(\.\d+)?$/.test(s)) return `${s}px`
  return s
}

export function mountVWindow(props: VWindowProps) {
  const size = SIZES.includes(props.size as never) ? (props.size as (typeof SIZES)[number]) : 'md'
  const variant = VARIANTS.includes(props.variant as never)
    ? (props.variant as (typeof VARIANTS)[number])
    : 'default'
  const open = props.open ?? props.modelValue ?? true
  const width = toCssDim(props.width)
  const height = toCssDim(props.height)
  const isMinimal = variant === 'minimal'
  const isBorderless = variant === 'borderless'
  return {
    size,
    variant,
    active: props.active,
    disabled: Boolean(props.disabled || props.loading),
    loading: Boolean(props.loading),
    resizable: Boolean(props.resizable),
    showActions: props.showActions !== false,
    showTrafficLights: props.showTrafficLights !== undefined ? props.showTrafficLights : !isMinimal,
    showAppIcon: props.showAppIcon !== undefined ? props.showAppIcon : !isMinimal && variant === 'default',
    showMinimize: props.showMinimize !== undefined ? props.showMinimize : !isMinimal,
    showSidebar: props.showSidebar !== undefined ? props.showSidebar : !(isMinimal || isBorderless),
    open: Boolean(open),
    title: props.title ?? '',
    width,
    height,
  } as const
}
