<script setup lang="ts">
import './VPromptBar.scss'
import { VIcon } from '../../primitives/VIcon'
import { useVPromptBar } from './useVPromptBar'
import type { VPromptBarProps } from './VPromptBar.types'
import { V_MOTION_DEFAULT } from '../../../motion/types'

const props = withDefaults(defineProps<VPromptBarProps>(), {
  modelValue: '',
  busy: false,
  placeholder: 'Ask anything…',
  motion: V_MOTION_DEFAULT,
  disabled: false,
  dictation: true,
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
  send: []
  stop: []
  'dictation-start': []
  'dictation-stop': []
  'dictation-error': [message: string]
}>()
const {
  config,
  textareaRef,
  rootAttrs,
  textareaAttrs,
  attachAttrs,
  actionAttrs,
  showVoice,
  voiceExpanded,
  voiceAttrs,
  micIcon,
  voiceBars,
  voiceElapsed,
  onVoiceToggle,
  onInput,
  onKeydown,
  onActionClick,
} = useVPromptBar(props, emit)
</script>

<template>
  <div v-bind="rootAttrs">
    <slot name="attachment">
      <button v-bind="attachAttrs">
        <VIcon :icon="config.attachIcon" size="sm" />
      </button>
    </slot>

    <textarea
      ref="textareaRef"
      v-bind="textareaAttrs"
      @input="onInput"
      @keydown="onKeydown"
    />

    <div class="v-prompt-bar__actions">
      <button
        v-if="showVoice"
        v-bind="voiceAttrs"
        @click="onVoiceToggle"
      >
        <VIcon v-if="!voiceExpanded" :icon="micIcon" size="sm" />
        <span v-else class="v-prompt-bar__voice-eq" aria-hidden="true">
          <span
            v-for="bar in voiceBars"
            :key="bar"
            class="v-prompt-bar__voice-bar"
            :style="{ animationDelay: `${bar * 80}ms` }"
          />
        </span>
        <span v-if="voiceExpanded" class="v-prompt-bar__voice-time">
          {{ voiceElapsed }}s
        </span>
      </button>

      <button v-bind="actionAttrs" @click="onActionClick">
        <span class="v-prompt-bar__action-icon v-prompt-bar__action-icon--send" aria-hidden="true">
          <VIcon :icon="config.sendIcon" size="sm" />
        </span>
        <span class="v-prompt-bar__action-icon v-prompt-bar__action-icon--stop" aria-hidden="true">
          <VIcon :icon="config.stopIcon" size="sm" />
        </span>
      </button>
    </div>
  </div>
</template>
