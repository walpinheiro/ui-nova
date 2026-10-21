export type VWindowSize = 'sm' | 'md' | 'lg'
export type VWindowVariant = 'default' | 'minimal' | 'borderless' | 'modal'
export interface VWindowProps {
  title?: string
  modelValue?: boolean
  open?: boolean
  size?: VWindowSize
  variant?: VWindowVariant
  active?: boolean
  disabled?: boolean
  loading?: boolean
  resizable?: boolean
  showActions?: boolean
  showTrafficLights?: boolean
  showAppIcon?: boolean
  showMinimize?: boolean
  showSidebar?: boolean
  width?: number | string
  height?: number | string
  ariaLabel?: string
}
export type VWindowEmits = {
  (e: 'update:modelValue', value: boolean): void
  (e: 'close'): void
  (e: 'minimize'): void
  (e: 'maximize'): void
  (e: 'resize', direction: string): void
}
