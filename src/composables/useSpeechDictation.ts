import { onBeforeUnmount, ref } from 'vue'

export type SpeechDictationResultHandler = (transcript: string, isFinal: boolean) => void

interface SpeechRecognitionEvent extends Event {
  readonly resultIndex: number
  readonly results: {
    readonly length: number
    item(index: number): {
      readonly isFinal: boolean
      readonly length: number
      item(index: number): { readonly transcript: string }
      [index: number]: { readonly transcript: string }
    }
    [index: number]: {
      readonly isFinal: boolean
      readonly length: number
      [index: number]: { readonly transcript: string }
    }
  }
}

interface SpeechRecognitionErrorEvent extends Event {
  readonly error: string
  readonly message?: string
}

type SpeechRecognitionLike = {
  lang: string
  continuous: boolean
  interimResults: boolean
  onresult: ((event: SpeechRecognitionEvent) => void) | null
  onerror: ((event: SpeechRecognitionErrorEvent) => void) | null
  onend: (() => void) | null
  start: () => void
  stop: () => void
  abort: () => void
}

declare global {
  interface Window {
    SpeechRecognition?: new () => SpeechRecognitionLike
    webkitSpeechRecognition?: new () => SpeechRecognitionLike
  }
}

export function isSpeechDictationSupported() {
  if (typeof window === 'undefined') return false
  return Boolean(window.SpeechRecognition || window.webkitSpeechRecognition)
}

export function createSpeechRecognition() {
  if (typeof window === 'undefined') return null
  const Ctor = window.SpeechRecognition ?? window.webkitSpeechRecognition
  return Ctor ? new Ctor() : null
}

export function useSpeechDictation(options: {
  lang?: string
  onResult: SpeechDictationResultHandler
  onError?: (message: string) => void
}) {
  const listening = ref(false)
  let recognition: SpeechRecognitionLike | null = null

  const ensureRecognition = () => {
    if (recognition) return recognition
    recognition = createSpeechRecognition()
    if (!recognition) return null

    recognition.continuous = true
    recognition.interimResults = true
    recognition.lang = options.lang ?? 'pt-BR'

    recognition.onresult = (event) => {
      for (let index = event.resultIndex; index < event.results.length; index += 1) {
        const result = event.results[index]
        const transcript = result[0]?.transcript?.trim()
        if (!transcript) continue
        options.onResult(transcript, result.isFinal)
      }
    }

    recognition.onerror = (event) => {
      options.onError?.(event.error || 'speech-recognition-failed')
      stop()
    }

    recognition.onend = () => {
      listening.value = false
    }

    return recognition
  }

  const start = () => {
    const instance = ensureRecognition()
    if (!instance) {
      options.onError?.('not-supported')
      return false
    }
    if (listening.value) return true

    try {
      instance.start()
      listening.value = true
      return true
    } catch {
      options.onError?.('start-failed')
      listening.value = false
      return false
    }
  }

  const stop = () => {
    if (!recognition || !listening.value) return
    try {
      recognition.stop()
    } catch {
      recognition.abort()
    }
    listening.value = false
  }

  onBeforeUnmount(() => {
    if (recognition && listening.value) {
      try {
        recognition.abort()
      } catch {
        /* noop */
      }
    }
    recognition = null
    listening.value = false
  })

  return {
    listening,
    isSupported: isSpeechDictationSupported(),
    start,
    stop,
  }
}
