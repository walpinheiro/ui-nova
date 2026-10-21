/**
 * @vitest-environment jsdom
 */
import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import VPromptBar from '../VPromptBar.vue'
import { mountVPromptBar } from '../mountVPromptBar'

const root = (wrapper: ReturnType<typeof mount>) => wrapper.get('[data-test-id="v-prompt-bar"]')

class MockSpeechRecognition {
  continuous = false
  interimResults = false
  lang = 'pt-BR'
  onresult: ((event: SpeechRecognitionEvent) => void) | null = null
  onerror: ((event: SpeechRecognitionErrorEvent) => void) | null = null
  onend: (() => void) | null = null
  start = vi.fn()
  stop = vi.fn(() => {
    this.onend?.()
  })
  abort = vi.fn()
}

let recognition: MockSpeechRecognition

beforeEach(() => {
  recognition = new MockSpeechRecognition()
  vi.stubGlobal('SpeechRecognition', vi.fn(() => recognition))
})

afterEach(() => {
  vi.unstubAllGlobals()
  vi.useRealTimers()
})

describe('mountVPromptBar', () => {
  it('defaults dictation-friendly config', () => {
    const config = mountVPromptBar({})
    expect(config.placeholder).toBe('Ask anything…')
    expect(config.motion).toBe('expressive')
  })
})

describe('VPromptBar', () => {
  it('renders textarea, attach, voice and send controls', () => {
    const wrapper = mount(VPromptBar, { props: { modelValue: '' } })
    expect(root(wrapper).attributes('data-state')).toBe('idle')
    expect(wrapper.get('[data-test-id="v-prompt-bar-input"]').exists()).toBe(true)
    expect(wrapper.get('[data-test-id="v-prompt-bar-attach"]').exists()).toBe(true)
    expect(wrapper.get('[data-test-id="v-prompt-bar-voice"]').exists()).toBe(true)
    expect(wrapper.get('[data-test-id="v-prompt-bar-send"]').exists()).toBe(true)
    expect(wrapper.find('.v-prompt-bar__actions').exists()).toBe(true)
  })

  it('aligns attach and action controls to the same size token', () => {
    const wrapper = mount(VPromptBar, { props: { modelValue: '' } })
    const attach = wrapper.get('[data-test-id="v-prompt-bar-attach"]').element as HTMLElement
    const send = wrapper.get('[data-test-id="v-prompt-bar-send"]').element as HTMLElement
    expect(getComputedStyle(attach).width).toBe(getComputedStyle(send).width)
    expect(getComputedStyle(attach).height).toBe(getComputedStyle(send).height)
  })

  it('emits update:modelValue on input', async () => {
    const wrapper = mount(VPromptBar, { props: { modelValue: '' } })
    const textarea = wrapper.get('[data-test-id="v-prompt-bar-input"]').element as HTMLTextAreaElement
    textarea.value = 'Hello agent'
    await wrapper.get('[data-test-id="v-prompt-bar-input"]').trigger('input')
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['Hello agent'])
  })

  it('auto-resizes textarea without forcing scroll on short content', async () => {
    const wrapper = mount(VPromptBar, { props: { modelValue: 'Short prompt' } })
    const textarea = wrapper.get('[data-test-id="v-prompt-bar-input"]').element as HTMLTextAreaElement
    Object.defineProperty(textarea, 'scrollHeight', { value: 48, configurable: true })
    await wrapper.get('[data-test-id="v-prompt-bar-input"]').trigger('input')
    await nextTick()
    expect(textarea.style.overflowY).toBe('hidden')
    expect(textarea.style.height).toBe('48px')
  })

  it('enables send only when there is text and emits send on click', async () => {
    const wrapper = mount(VPromptBar, { props: { modelValue: 'Draft' } })
    const send = wrapper.get('[data-test-id="v-prompt-bar-send"]')
    expect((send.element as HTMLButtonElement).disabled).toBe(false)
    await send.trigger('click')
    expect(wrapper.emitted('send')).toHaveLength(1)
  })

  it('shows stop action while busy', async () => {
    const wrapper = mount(VPromptBar, { props: { modelValue: 'Working', busy: true } })
    expect(root(wrapper).attributes('data-state')).toBe('busy')
    expect(wrapper.get('[data-test-id="v-prompt-bar-stop"]').exists()).toBe(true)
    await wrapper.get('[data-test-id="v-prompt-bar-stop"]').trigger('click')
    expect(wrapper.emitted('stop')).toHaveLength(1)
  })

  it('starts speech recognition and appends transcript on stop', async () => {
    vi.useFakeTimers()
    const wrapper = mount(VPromptBar, { props: { modelValue: 'Existing' } })
    const voice = wrapper.get('[data-test-id="v-prompt-bar-voice"]')

    await voice.trigger('click')
    expect(recognition.start).toHaveBeenCalled()
    expect(wrapper.emitted('dictation-start')).toHaveLength(1)
    expect(voice.attributes('aria-pressed')).toBe('true')

    recognition.onresult?.({
      resultIndex: 0,
      results: {
        length: 1,
        0: { 0: { transcript: 'novo texto' }, isFinal: true, length: 1 },
      },
    } as SpeechRecognitionEvent)

    await wrapper.setProps({ modelValue: 'Existing novo texto' })
    await voice.trigger('click')
    expect(recognition.stop).toHaveBeenCalled()
    expect(wrapper.emitted('dictation-stop')).toHaveLength(1)
  })

  it('streams interim transcript into the prompt field', async () => {
    const wrapper = mount(VPromptBar, { props: { modelValue: '' } })
    await wrapper.get('[data-test-id="v-prompt-bar-voice"]').trigger('click')

    recognition.onresult?.({
      resultIndex: 0,
      results: {
        length: 1,
        0: { 0: { transcript: 'testando' }, isFinal: false, length: 1 },
      },
    } as SpeechRecognitionEvent)

    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual(['testando'])
  })

  it('hides voice control when dictation is false', () => {
    const wrapper = mount(VPromptBar, { props: { modelValue: '', dictation: false } })
    expect(wrapper.find('[data-test-id="v-prompt-bar-voice"]').exists()).toBe(false)
  })

  it('disables voice when speech recognition is unavailable', () => {
    vi.unstubAllGlobals()
    const wrapper = mount(VPromptBar, { props: { modelValue: '' } })
    const voice = wrapper.get('[data-test-id="v-prompt-bar-voice"]')
    expect((voice.element as HTMLButtonElement).disabled).toBe(true)
    expect(voice.classes()).toContain('v-prompt-bar__voice--unsupported')
  })

  it('submits on Enter without shift', async () => {
    const wrapper = mount(VPromptBar, { props: { modelValue: 'Go' } })
    await wrapper.get('[data-test-id="v-prompt-bar-input"]').trigger('keydown', { key: 'Enter' })
    expect(wrapper.emitted('send')).toHaveLength(1)
  })

  it('does not submit on Shift+Enter', async () => {
    const wrapper = mount(VPromptBar, { props: { modelValue: 'Go' } })
    await wrapper.get('[data-test-id="v-prompt-bar-input"]').trigger('keydown', { key: 'Enter', shiftKey: true })
    expect(wrapper.emitted('send')).toBeUndefined()
  })

  it('reflects disabled state', async () => {
    const wrapper = mount(VPromptBar, { props: { modelValue: 'Locked', disabled: true } })
    expect(root(wrapper).attributes('data-state')).toBe('disabled')
    expect((wrapper.get('[data-test-id="v-prompt-bar-send"]').element as HTMLButtonElement).disabled).toBe(true)
    await nextTick()
    expect((wrapper.get('[data-test-id="v-prompt-bar-input"]').element as HTMLTextAreaElement).disabled).toBe(true)
  })
})
