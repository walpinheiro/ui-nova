import { computed, onBeforeUnmount, onMounted, ref, useId, watch } from 'vue'
import { formatCountdown, mountVOtpInput, sanitizeOtpValue } from './mountVOtpInput'
import type { VOtpInputProps, VOtpInputState } from './VOtpInput.types'

type VOtpInputEmit = {
  (event: 'update:modelValue', value: string): void
  (event: 'complete', value: string): void
  (event: 'resend'): void
  (event: 'focus', payload: FocusEvent): void
  (event: 'blur', payload: FocusEvent): void
}

export function useVOtpInput(props: VOtpInputProps, emit: VOtpInputEmit) {
  const config = computed(() => mountVOtpInput(props))
  const generatedId = useId()
  const rootId = computed(() => props.id ?? `v-otp-input-${generatedId}`)
  const inputId = computed(() => `${rootId.value}-hidden`)
  const helperId = computed(() => `${rootId.value}-helper`)
  const errorId = computed(() => `${rootId.value}-error`)
  const hiddenRef = ref<HTMLInputElement | null>(null)
  const focused = ref(false)
  const shaking = ref(false)
  const countdown = ref(config.value.resendCooldown)
  let countdownTimer: ReturnType<typeof setInterval> | null = null

  const value = computed(() => sanitizeOtpValue(props.modelValue ?? '', config.value.length))
  const activeIndex = computed(() => Math.min(value.value.length, config.value.length - 1))

  const dataState = computed<VOtpInputState>(() => {
    if (config.value.disabled) return 'disabled'
    if (config.value.hasError) return 'error'
    if (config.value.hasSuccess) return 'success'
    if (!value.value.length) return focused.value ? 'active' : 'empty'
    if (value.value.length === config.value.length) return 'filled'
    return focused.value ? 'active' : 'filled'
  })

  const describedBy = computed(() => {
    const ids: string[] = []
    if (props.helperText) ids.push(helperId.value)
    if (config.value.hasError) ids.push(errorId.value)
    return ids.length ? ids.join(' ') : undefined
  })

  const slotChars = computed(() => {
    const chars = value.value.split('')
    while (chars.length < config.value.length) chars.push('')
    return chars
  })

  const displayChar = (char: string) => {
    if (!char) return ''
    return config.value.masked ? '•' : char
  }

  const setValue = (next: string, complete = false) => {
    const sanitized = sanitizeOtpValue(next, config.value.length)
    emit('update:modelValue', sanitized)
    if (complete || sanitized.length === config.value.length) {
      emit('complete', sanitized)
    }
  }

  const focusInput = () => hiddenRef.value?.focus()

  const onHiddenInput = (event: Event) => {
    const next = (event.target as HTMLInputElement).value
    setValue(next, config.value.autoSubmit && sanitizeOtpValue(next, config.value.length).length === config.value.length)
  }

  const onHiddenKeydown = (event: KeyboardEvent) => {
    if (config.value.disabled) return
    if (event.key === 'ArrowLeft') {
      event.preventDefault()
      return
    }
    if (event.key === 'ArrowRight') {
      event.preventDefault()
    }
  }

  const onHiddenPaste = (event: ClipboardEvent) => {
    const text = event.clipboardData?.getData('text') ?? ''
    if (!text) return
    event.preventDefault()
    const sanitized = sanitizeOtpValue(text, config.value.length)
    setValue(sanitized, config.value.autoSubmit && sanitized.length === config.value.length)
  }

  const onSlotClick = () => focusInput()

  const triggerShake = () => {
    shaking.value = true
    window.setTimeout(() => { shaking.value = false }, 280)
  }

  watch(() => props.errorMessage, (message) => {
    if (message) triggerShake()
  })

  const startCountdown = () => {
    countdown.value = config.value.resendCooldown
    if (!countdown.value) return
    if (countdownTimer) clearInterval(countdownTimer)
    countdownTimer = setInterval(() => {
      countdown.value = Math.max(0, countdown.value - 1)
      if (countdown.value === 0 && countdownTimer) {
        clearInterval(countdownTimer)
        countdownTimer = null
      }
    }, 1000)
  }

  const onResend = () => {
    if (countdown.value > 0 || config.value.disabled) return
    emit('resend')
    startCountdown()
  }

  onMounted(() => {
    if (config.value.resendCooldown) startCountdown()
  })

  onBeforeUnmount(() => {
    if (countdownTimer) clearInterval(countdownTimer)
  })

  const rootAttrs = computed(() => ({
    id: rootId.value,
    class: [
      'v-otp-input',
      `v-otp-input--${config.value.size}`,
      {
        'v-otp-input--disabled': config.value.disabled,
        'v-otp-input--error': config.value.hasError,
        'v-otp-input--success': config.value.hasSuccess,
        'v-otp-input--shaking': shaking.value,
        'v-otp-input--expressive': props.motion === 'expressive',
      },
    ],
    'data-test-id': 'v-otp-input',
    'data-length': String(config.value.length),
    'data-variant': config.value.variant,
    'data-state': dataState.value,
  }))

  const hiddenAttrs = computed(() => ({
    id: inputId.value,
    class: 'v-otp-input__hidden',
    'data-test-id': 'v-otp-hidden-input',
    value: value.value,
    inputmode: 'numeric' as const,
    autocomplete: 'one-time-code',
    maxlength: config.value.length,
    disabled: config.value.disabled || undefined,
    'aria-label': props.ariaLabel ?? 'Verification code',
    'aria-invalid': config.value.hasError ? 'true' : undefined,
    'aria-describedby': describedBy.value,
  }))

  return {
    config,
    hiddenRef,
    rootAttrs,
    hiddenAttrs,
    slotChars,
    activeIndex,
    helperId,
    errorId,
    countdown,
    shaking,
    displayChar,
    formatCountdown,
    onHiddenInput,
    onHiddenKeydown,
    onHiddenPaste,
    onSlotClick,
    onResend,
    onFocus: (event: FocusEvent) => { focused.value = true; emit('focus', event) },
    onBlur: (event: FocusEvent) => { focused.value = false; emit('blur', event) },
  }
}
