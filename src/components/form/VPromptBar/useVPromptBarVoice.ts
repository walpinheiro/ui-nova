import { computed, onBeforeUnmount, ref, type Ref } from 'vue'
import { useSpeechDictation } from '../../../composables/useSpeechDictation'
import type { VPromptBarEmit, VPromptBarProps } from './VPromptBar.types'
import { V_PROMPT_BAR_VOICE_ICON } from './mountVPromptBar'

export function useVPromptBarVoice(
  props: VPromptBarProps,
  modelValue: Ref<string>,
  isExpressive: { value: boolean },
  emit: VPromptBarEmit,
) {
  const elapsed = ref(0)
  const dictationError = ref<string | null>(null)
  let timer: ReturnType<typeof setInterval> | null = null
  let interimPrefix = ''

  const appendTranscript = (text: string) => {
    const chunk = text.trim()
    if (!chunk) return
    const current = modelValue.value
    const needsSpace = current.length > 0 && !/\s$/.test(current)
    emit('update:modelValue', `${current}${needsSpace ? ' ' : ''}${chunk}`)
  }

  const speech = useSpeechDictation({
    lang: props.dictationLang,
    onResult: (transcript, isFinal) => {
      if (isFinal) {
        appendTranscript(transcript)
        interimPrefix = modelValue.value
        return
      }
      const base = interimPrefix
      const needsSpace = base.length > 0 && !/\s$/.test(base)
      emit('update:modelValue', `${base}${needsSpace ? ' ' : ''}${transcript}`)
    },
    onError: (message) => {
      dictationError.value = message
      emit('dictation-error', message)
      stop()
    },
  })

  const recording = computed(() => speech.listening.value)
  const showVoice = computed(() => props.dictation !== false)
  const voiceExpanded = computed(() => showVoice.value && recording.value && isExpressive.value)
  const isSupported = computed(() => speech.isSupported)

  const voiceAttrs = computed(() => ({
    type: 'button' as const,
    class: [
      'v-prompt-bar__voice',
      {
        'v-prompt-bar__voice--recording': recording.value,
        'v-prompt-bar__voice--expanded': voiceExpanded.value,
        'v-prompt-bar__voice--unsupported': !isSupported.value,
      },
    ],
    'data-test-id': 'v-prompt-bar-voice',
    'aria-label': props.dictationLabel ?? (isSupported.value ? 'Dictation' : 'Dictation unavailable'),
    'aria-pressed': recording.value,
    disabled: props.disabled || !isSupported.value || undefined,
    title: dictationError.value ?? undefined,
  }))

  const micIcon = V_PROMPT_BAR_VOICE_ICON
  const bars = [0, 1, 2, 3, 4]

  const clearTimer = () => {
    if (timer) clearInterval(timer)
    timer = null
  }

  const start = () => {
    if (recording.value || props.disabled || !isSupported.value) return
    dictationError.value = null
    interimPrefix = modelValue.value
    if (!speech.start()) return
    elapsed.value = 0
    clearTimer()
    timer = setInterval(() => {
      elapsed.value += 0.1
    }, 100)
    emit('dictation-start')
  }

  const stop = () => {
    if (!recording.value && !timer) return
    speech.stop()
    clearTimer()
    interimPrefix = modelValue.value
    emit('dictation-stop')
  }

  const toggle = () => {
    if (recording.value) stop()
    else start()
  }

  onBeforeUnmount(() => {
    stop()
  })

  return {
    showVoice,
    voiceExpanded,
    voiceAttrs,
    micIcon,
    bars,
    elapsed,
    recording,
    isSupported,
    dictationError,
    toggle,
  }
}
