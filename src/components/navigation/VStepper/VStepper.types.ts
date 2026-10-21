export type VStepperSize = 'sm' | 'md' | 'lg'
export type VStepperVariant = 'default' | 'primary' | 'subtle'
export type VStepperStepState = 'completed' | 'current' | 'upcoming'

export interface VStepperStep {
  value: string | number
  label: string
  description?: string
  disabled?: boolean
}

export interface ResolvedVStepperStep extends VStepperStep {
  index: number
  state: VStepperStepState
}

export interface VStepperProps {
  modelValue?: string | number
  steps?: VStepperStep[]
  disabled?: boolean
  loading?: boolean
  size?: VStepperSize
  variant?: VStepperVariant
  ariaLabel?: string
}

export type VStepperEmits = {
  'update:modelValue': [value: string | number]
  'step-click': [step: VStepperStep]
}
