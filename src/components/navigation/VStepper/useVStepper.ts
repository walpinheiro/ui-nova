import { computed } from 'vue'
import type { ResolvedVStepperStep, VStepperEmits, VStepperProps } from './VStepper.types'
import { mountVStepper } from './mountVStepper'

type EmitFn = <K extends keyof VStepperEmits>(event: K, ...args: VStepperEmits[K]) => void

export function useVStepper(props: VStepperProps, emit: EmitFn) {
  const config = computed(() => mountVStepper(props))

  const rootAttrs = computed<Record<string, unknown>>(() => ({
    class: [
      'v-stepper',
      `v-stepper--${config.value.size}`,
      `v-stepper--${config.value.variant}`,
      {
        'v-stepper--disabled': config.value.disabled,
        'v-stepper--loading': config.value.loading,
      },
    ],
    role: 'navigation',
    'aria-label': props.ariaLabel ?? 'Progress',
    'aria-disabled': config.value.disabled || undefined,
    'aria-busy': config.value.loading || undefined,
    'data-test-id': 'v-stepper',
    'data-size': config.value.size,
    'data-variant': config.value.variant,
    'data-state': config.value.loading
      ? 'loading'
      : config.value.disabled
        ? 'disabled'
        : 'default',
  }))

  function stepAttrs(step: ResolvedVStepperStep): Record<string, unknown> {
    const isDisabled = config.value.disabled || step.disabled
    return {
      class: [
        'v-stepper__step',
        `v-stepper__step--${step.state}`,
        { 'v-stepper__step--disabled': isDisabled },
      ],
      'data-test-id': `v-stepper-step-${step.value}`,
      'data-state': step.state,
      'aria-current': step.state === 'current' ? 'step' : undefined,
      'aria-disabled': isDisabled || undefined,
    }
  }

  function markerAttrs(step: ResolvedVStepperStep): Record<string, unknown> {
    const isDisabled = config.value.disabled || step.disabled
    return {
      class: [
        'v-stepper__marker',
        `v-stepper__marker--${step.state}`,
      ],
      type: 'button' as const,
      disabled: isDisabled || undefined,
      tabindex: step.state === 'current' ? 0 : -1,
      'aria-label': `${step.label}, step ${step.index + 1} of ${config.value.steps.length}`,
      'data-test-id': `v-stepper-marker-${step.value}`,
    }
  }

  function connectorAttrs(step: ResolvedVStepperStep): Record<string, unknown> {
    return {
      class: [
        'v-stepper__connector',
        {
          'v-stepper__connector--completed': step.state === 'completed',
        },
      ],
      'aria-hidden': true as const,
      'data-test-id': `v-stepper-connector-${step.value}`,
    }
  }

  function onStepClick(step: ResolvedVStepperStep) {
    if (config.value.disabled || step.disabled) return
    emit('update:modelValue', step.value)
    emit('step-click', step)
  }

  function onStepKeydown(event: KeyboardEvent, step: ResolvedVStepperStep) {
    if (config.value.disabled || step.disabled) return

    const steps = config.value.steps
    const current = steps.findIndex((item) => item.value === step.value)

    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      onStepClick(step)
      return
    }

    if (event.key === 'ArrowRight' || event.key === 'ArrowDown') {
      event.preventDefault()
      const next = steps.slice(current + 1).find((item) => !item.disabled)
      if (next) focusMarker(next.value)
      return
    }

    if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
      event.preventDefault()
      const previous = [...steps.slice(0, current)].reverse().find((item) => !item.disabled)
      if (previous) focusMarker(previous.value)
    }
  }

  function focusMarker(value: string | number) {
    if (typeof document === 'undefined') return
    const marker = document.querySelector(`[data-test-id="v-stepper-marker-${value}"]`) as HTMLElement | null
    marker?.focus()
  }

  return {
    config,
    rootAttrs,
    stepAttrs,
    markerAttrs,
    connectorAttrs,
    onStepClick,
    onStepKeydown,
  }
}
