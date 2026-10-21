import type { IconifyIcon } from '@iconify/types'
import checkIcon from '@iconify-icons/keyline-icons/check'
import type { ResolvedVStepperStep, VStepperProps, VStepperSize, VStepperStep, VStepperStepState } from './VStepper.types'

export const STEPPER_CHECK_ICON: IconifyIcon = checkIcon

const SIZES: VStepperSize[] = ['sm', 'md', 'lg']

export const DEFAULT_STEPPER_STEPS: VStepperStep[] = [
  { value: 'account', label: 'Account' },
  { value: 'profile', label: 'Profile' },
  { value: 'review', label: 'Review' },
  { value: 'confirm', label: 'Confirm' },
]

function resolveStepState(index: number, currentIndex: number): VStepperStepState {
  if (index < currentIndex) return 'completed'
  if (index === currentIndex) return 'current'
  return 'upcoming'
}

export function resolveStepperSteps(
  steps: VStepperStep[],
  modelValue?: string | number,
): { steps: ResolvedVStepperStep[]; currentIndex: number } {
  const currentIndex = Math.max(
    0,
    steps.findIndex((step) => step.value === modelValue),
  )

  return {
    currentIndex,
    steps: steps.map((step, index) => ({
      ...step,
      index,
      state: resolveStepState(index, currentIndex),
    })),
  }
}

export function mountVStepper(props: VStepperProps) {
  const size: VStepperSize = SIZES.includes(props.size as VStepperSize)
    ? (props.size as VStepperSize)
    : 'md'
  const steps = props.steps ?? DEFAULT_STEPPER_STEPS
  const resolved = resolveStepperSteps(steps, props.modelValue ?? steps[0]?.value)

  return {
    size,
    variant: props.variant ?? 'default',
    steps: resolved.steps,
    currentIndex: resolved.currentIndex,
    currentValue: resolved.steps[resolved.currentIndex]?.value ?? steps[0]?.value,
    disabled: Boolean(props.disabled || props.loading),
    loading: Boolean(props.loading),
  } as const
}
