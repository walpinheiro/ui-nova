<script setup lang="ts">
import { computed } from 'vue'
import './VAudioRecorder.scss'
import binIcon from '@iconify-icons/keyline-icons/bin'
import playIcon from '@iconify-icons/keyline-icons/play-fill'
import pauseIcon from '@iconify-icons/keyline-icons/pause'
import checkIcon from '@iconify-icons/keyline-icons/check'
import micIcon from '@iconify-icons/keyline-icons/mic'
import xIcon from '@iconify-icons/keyline-icons/x'
import { VIcon } from '../../primitives/VIcon'
import { mountVAudioRecorder } from './mountVAudioRecorder'
import type { VAudioRecorderEmits, VAudioRecorderProps } from './VAudioRecorder.types'

const props = withDefaults(defineProps<VAudioRecorderProps>(), {
  state: 'ready',
  elapsed: 0,
  duration: 0,
  bars: 32,
  size: 'md',
  closable: true,
  disabled: false,
  ariaLabel: 'Voice note',
})

const emit = defineEmits<VAudioRecorderEmits>()
const config = computed(() => mountVAudioRecorder(props))

const primary = computed(() => {
  switch (config.value.state) {
    case 'recording':
    case 'paused':
      return { icon: checkIcon, label: 'Save recording', event: 'save' as const }
    case 'playing':
      return { icon: pauseIcon, label: 'Pause playback', event: 'stop' as const }
    default:
      return { icon: playIcon, label: 'Play recording', event: 'play' as const }
  }
})

function onPrimary() {
  const event = primary.value.event
  if (event === 'save') emit('save')
  else if (event === 'stop') emit('stop')
  else emit('play')
}

function onToggle() {
  if (config.value.state === 'recording') emit('pause')
  else emit('resume')
}
</script>

<template>
  <div
    class="v-audio-recorder"
    :class="[`v-audio-recorder--${config.size}`, `v-audio-recorder--${config.state}`, { 'is-disabled': disabled }]"
    role="group"
    :aria-label="ariaLabel"
    :data-test-id="dataTestId ?? 'v-audio-recorder'"
    :data-state="config.state"
  >
    <div class="v-audio-recorder__pill">
      <span class="v-audio-recorder__time" data-test-id="v-audio-recorder-time">
        <span v-if="config.capturing" class="v-audio-recorder__rec-dot" aria-hidden="true" />
        <span role="timer" aria-live="off">{{ config.time }}</span>
      </span>

      <span
        class="v-audio-recorder__wave"
        role="img"
        :aria-label="config.capturing ? 'Live audio level' : `Playback ${Math.round(config.progress * 100)}%`"
      >
        <span
          v-for="bar in config.waveform"
          :key="bar.key"
          class="v-audio-recorder__bar"
          :class="{ 'is-empty': bar.empty, 'is-played': bar.played }"
          :style="bar.empty ? undefined : { height: `${bar.height * 100}%` }"
        />
      </span>

      <span class="v-audio-recorder__actions">
        <button
          type="button"
          class="v-audio-recorder__btn"
          aria-label="Discard recording"
          :disabled="disabled"
          data-test-id="v-audio-recorder-discard"
          @click="emit('discard')"
        >
          <VIcon :icon="binIcon" size="sm" />
        </button>
        <button
          v-if="config.capturing"
          type="button"
          class="v-audio-recorder__btn"
          :aria-label="config.state === 'recording' ? 'Pause recording' : 'Resume recording'"
          :disabled="disabled"
          data-test-id="v-audio-recorder-toggle"
          @click="onToggle"
        >
          <VIcon :icon="config.state === 'recording' ? pauseIcon : micIcon" size="sm" />
        </button>
        <button
          type="button"
          class="v-audio-recorder__btn v-audio-recorder__btn--primary"
          :aria-label="primary.label"
          :disabled="disabled"
          data-test-id="v-audio-recorder-primary"
          @click="onPrimary"
        >
          <VIcon :icon="primary.icon" size="sm" />
        </button>
      </span>
    </div>

    <button
      v-if="closable"
      type="button"
      class="v-audio-recorder__btn v-audio-recorder__close"
      aria-label="Close"
      data-test-id="v-audio-recorder-close"
      @click="emit('close')"
    >
      <VIcon :icon="xIcon" size="sm" />
    </button>
  </div>
</template>
