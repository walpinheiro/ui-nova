import { computed, nextTick, onMounted, onUnmounted, ref, watch } from 'vue'
import { isMotionDisabled, useReducedMotion } from '../../../composables/useReducedMotion'
import type { VPromptBarEmit, VPromptBarProps } from './VPromptBar.types'
import { mountVPromptBar } from './mountVPromptBar'
import { useVPromptBarVoice } from './useVPromptBarVoice'

const PROMPT_MAX_HEIGHT_PX = 144

export function useVPromptBar(props: VPromptBarProps, emit: VPromptBarEmit) {
  const config = computed(() => mountVPromptBar(props))
  const textareaRef = ref<HTMLTextAreaElement | null>(null)
  const modelValue = computed(() => props.modelValue ?? '')
  const reduced = useReducedMotion()

  const motionDisabled = computed(() => isMotionDisabled(config.value.motion, reduced.value))
  const isExpressive = computed(() => config.value.motion === 'expressive' && !motionDisabled.value)
  const canSend = computed(() => !config.value.disabled && !config.value.busy && config.value.modelValue.trim().length > 0)

  const rootAttrs = computed(() => ({
    class: [
      'v-prompt-bar',
      {
        'v-prompt-bar--busy': config.value.busy,
        'v-prompt-bar--disabled': config.value.disabled,
        'v-prompt-bar--expressive': isExpressive.value,
      },
    ],
    'data-test-id': 'v-prompt-bar',
    'data-state': config.value.busy ? 'busy' : config.value.disabled ? 'disabled' : 'idle',
  }))

  const textareaAttrs = computed(() => ({
    class: 'v-prompt-bar__input',
    'data-test-id': 'v-prompt-bar-input',
    value: config.value.modelValue,
    placeholder: config.value.placeholder,
    rows: 1,
    disabled: config.value.disabled,
    'aria-label': props.ariaLabel ?? config.value.placeholder,
    'aria-busy': config.value.busy || undefined,
  }))

  const attachAttrs = computed(() => ({
    type: 'button' as const,
    class: 'v-prompt-bar__attach',
    'data-test-id': 'v-prompt-bar-attach',
    'aria-label': config.value.attachLabel,
    disabled: config.value.disabled || undefined,
  }))

  const actionAttrs = computed(() => ({
    type: 'button' as const,
    class: [
      'v-prompt-bar__action',
      {
        'v-prompt-bar__action--busy': config.value.busy,
        'v-prompt-bar__action--ready': canSend.value,
      },
    ],
    'data-test-id': config.value.busy ? 'v-prompt-bar-stop' : 'v-prompt-bar-send',
    'aria-label': config.value.busy ? config.value.stopLabel : config.value.sendLabel,
    disabled: config.value.disabled || (!config.value.busy && !canSend.value) || undefined,
  }))

  const adjustHeight = () => {
    const el = textareaRef.value
    if (!el || (el.clientWidth === 0 && typeof ResizeObserver !== 'undefined')) return

    const minHeight = Number.parseFloat(getComputedStyle(el).minHeight) || 32
    el.style.height = `${minHeight}px`
    const scrollHeight = el.scrollHeight
    const nextHeight = Math.min(Math.max(scrollHeight, minHeight), PROMPT_MAX_HEIGHT_PX)
    el.style.height = `${nextHeight}px`
    el.style.overflowY = scrollHeight > PROMPT_MAX_HEIGHT_PX ? 'auto' : 'hidden'
  }

  const onInput = (event: Event) => {
    emit('update:modelValue', (event.target as HTMLTextAreaElement).value)
    void nextTick(adjustHeight)
  }

  const onKeydown = (event: KeyboardEvent) => {
    if (event.key !== 'Enter' || event.shiftKey) return
    event.preventDefault()
    if (config.value.busy) {
      onStop()
      return
    }
    onSend()
  }

  const onSend = () => {
    if (!canSend.value) return
    emit('send')
  }

  const onStop = () => {
    if (!config.value.busy) return
    emit('stop')
  }

  const onActionClick = () => {
    if (config.value.busy) onStop()
    else onSend()
  }

  const voice = useVPromptBarVoice(props, modelValue, isExpressive, emit)

  const voiceElapsed = computed(() => voice.elapsed.value.toFixed(1))

  watch(modelValue, () => {
    void nextTick(adjustHeight)
  })

  let resizeObserver: ResizeObserver | null = null

  onMounted(() => {
    const el = textareaRef.value
    if (!el) return

    if (typeof ResizeObserver !== 'undefined') {
      resizeObserver = new ResizeObserver(() => {
        adjustHeight()
      })
      resizeObserver.observe(el)
    }

    requestAnimationFrame(() => {
      adjustHeight()
    })
  })

  onUnmounted(() => {
    resizeObserver?.disconnect()
    resizeObserver = null
  })

  return {
    config,
    textareaRef,
    rootAttrs,
    textareaAttrs,
    attachAttrs,
    actionAttrs,
    canSend,
    isExpressive,
    showVoice: voice.showVoice,
    voiceExpanded: voice.voiceExpanded,
    voiceAttrs: voice.voiceAttrs,
    micIcon: voice.micIcon,
    voiceBars: voice.bars,
    voiceElapsed,
    onVoiceToggle: voice.toggle,
    onInput,
    onKeydown,
    onActionClick,
  }
}
