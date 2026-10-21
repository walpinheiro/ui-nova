import { onUnmounted, ref } from 'vue'
import { AI_CHAT_SEED_MESSAGES, AI_CHAT_STEPS } from './templateNavigation'

export interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  text: string
  pending?: boolean
}

export function useAiChatConversation() {
  const messages = ref<ChatMessage[]>([...AI_CHAT_SEED_MESSAGES])
  const prompt = ref('')
  const busy = ref(false)
  const chipStatus = ref<'pending' | 'success' | 'error'>('success')
  const chipDuration = ref(1240)
  const chipLabel = ref('search_docs')
  const thoughtDuration = ref(0)
  const thoughtExpanded = ref(false)
  const showThinking = ref(false)

  let timers: ReturnType<typeof setTimeout>[] = []

  function schedule(fn: () => void, ms: number) {
    timers.push(setTimeout(fn, ms))
  }

  function clearTimers() {
    timers.forEach(clearTimeout)
    timers = []
  }

  function runAssistantFlow(userText: string) {
    clearTimers()
    busy.value = true
    showThinking.value = true
    chipStatus.value = 'pending'
    chipDuration.value = 0
    chipLabel.value = 'search_docs'
    thoughtDuration.value = 0
    thoughtExpanded.value = false

    messages.value.push({
      id: `u-${Date.now()}`,
      role: 'user',
      text: userText,
    })

    schedule(() => {
      chipStatus.value = 'success'
      chipDuration.value = 1180
    }, 1200)

    schedule(() => {
      thoughtDuration.value = 3400
      thoughtExpanded.value = true
    }, 2600)

    schedule(() => {
      messages.value.push({
        id: `a-${Date.now()}`,
        role: 'assistant',
        text:
          'Use `VSplitView` para reader + canvas, `VTabs` no centro e `VPromptBar` com `motion="expressive"` para o chat. Todas as animações vêm dos tokens `--v-motion-*` e `--v-ease-spring`.',
      })
      showThinking.value = false
      busy.value = false
      prompt.value = ''
    }, 4200)
  }

  function onSend() {
    const text = prompt.value.trim()
    if (!text || busy.value) return
    runAssistantFlow(text)
  }

  onUnmounted(clearTimers)

  return {
    messages,
    prompt,
    busy,
    chipStatus,
    chipDuration,
    chipLabel,
    thoughtDuration,
    thoughtExpanded,
    showThinking,
    steps: AI_CHAT_STEPS,
    onSend,
  }
}
