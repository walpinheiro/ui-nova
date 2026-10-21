/**
 * @vitest-environment jsdom
 */
import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import VAudioRecorder from '../VAudioRecorder.vue'
import { formatClock, mountVAudioRecorder } from '../mountVAudioRecorder'

describe('mountVAudioRecorder', () => {
  it('formats the clock', () => {
    expect(formatClock(0)).toBe('0:00')
    expect(formatClock(4.6)).toBe('0:04')
    expect(formatClock(75)).toBe('1:15')
  })

  it('keeps the newest samples while recording and fills the rest with empty slots', () => {
    const config = mountVAudioRecorder({ state: 'recording', levels: [0.2, 0.5], bars: 8 })
    expect(config.waveform.filter((bar) => !bar.empty)).toHaveLength(2)
    expect(config.waveform[7].empty).toBe(true)
  })

  it('marks played bars by playback progress', () => {
    const config = mountVAudioRecorder({ state: 'playing', levels: Array(16).fill(0.5), bars: 8, elapsed: 5, duration: 10 })
    expect(config.waveform.filter((bar) => bar.played)).toHaveLength(4)
  })
})

describe('VAudioRecorder', () => {
  it('emits pause and save while recording', async () => {
    const wrapper = mount(VAudioRecorder, { props: { state: 'recording', elapsed: 4 } })
    expect(wrapper.get('[data-test-id="v-audio-recorder-time"]').text()).toBe('0:04')
    await wrapper.get('[data-test-id="v-audio-recorder-toggle"]').trigger('click')
    await wrapper.get('[data-test-id="v-audio-recorder-primary"]').trigger('click')
    expect(wrapper.emitted('pause')).toHaveLength(1)
    expect(wrapper.emitted('save')).toHaveLength(1)
  })

  it('emits play/stop/discard/close for a finished take', async () => {
    const ready = mount(VAudioRecorder, { props: { state: 'ready' } })
    expect(ready.find('[data-test-id="v-audio-recorder-toggle"]').exists()).toBe(false)
    await ready.get('[data-test-id="v-audio-recorder-primary"]').trigger('click')
    await ready.get('[data-test-id="v-audio-recorder-discard"]').trigger('click')
    await ready.get('[data-test-id="v-audio-recorder-close"]').trigger('click')
    expect(ready.emitted('play')).toHaveLength(1)
    expect(ready.emitted('discard')).toHaveLength(1)
    expect(ready.emitted('close')).toHaveLength(1)

    const playing = mount(VAudioRecorder, { props: { state: 'playing' } })
    await playing.get('[data-test-id="v-audio-recorder-primary"]').trigger('click')
    expect(playing.emitted('stop')).toHaveLength(1)
  })
})
