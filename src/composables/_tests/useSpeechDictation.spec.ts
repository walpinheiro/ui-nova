/**
 * @vitest-environment jsdom
 */
import { describe, expect, it, vi } from 'vitest'
import { createSpeechRecognition, isSpeechDictationSupported, useSpeechDictation } from '../useSpeechDictation'

class MockSpeechRecognition {
  continuous = false
  interimResults = false
  lang = 'pt-BR'
  onresult: ((event: SpeechRecognitionEvent) => void) | null = null
  onerror: ((event: SpeechRecognitionErrorEvent) => void) | null = null
  onend: (() => void) | null = null
  start = vi.fn(() => {
    this.onresult?.({
      resultIndex: 0,
      results: {
        length: 1,
        0: { 0: { transcript: 'olá mundo' }, isFinal: true, length: 1 },
      },
    } as SpeechRecognitionEvent)
  })
  stop = vi.fn(() => {
    this.onend?.()
  })
  abort = vi.fn()
}

describe('useSpeechDictation', () => {
  it('detects browser support', () => {
    vi.stubGlobal('SpeechRecognition', MockSpeechRecognition)
    expect(isSpeechDictationSupported()).toBe(true)
    expect(createSpeechRecognition()).toBeTruthy()
    vi.unstubAllGlobals()
  })

  it('streams final transcripts to callback', () => {
    vi.stubGlobal('SpeechRecognition', MockSpeechRecognition)
    const onResult = vi.fn()
    const dictation = useSpeechDictation({ onResult })

    dictation.start()
    expect(onResult).toHaveBeenCalledWith('olá mundo', true)
    dictation.stop()
    vi.unstubAllGlobals()
  })
})
