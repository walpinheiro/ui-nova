<script setup lang="ts">
import './VTagInput.scss'
import { VIcon } from '../../primitives/VIcon'
import { VTag } from '../../primitives/VTag'
import { useVTagInput } from './useVTagInput'
import type { VTagInputProps } from './VTagInput.types'

const props = withDefaults(defineProps<VTagInputProps>(), {
  modelValue: () => [],
  suggestions: () => [],
  placeholder: 'Add a tag…',
  disabled: false,
  readonly: false,
  closable: true,
  multiline: false,
  delimiters: () => ['enter', 'comma'],
  allowDuplicates: false,
  size: 'md',
  emptyText: 'No tags yet.',
})

const emit = defineEmits<{
  'update:modelValue': [value: string[]]
  add: [tag: string]
  remove: [tag: string]
  focus: [payload: FocusEvent]
  blur: [payload: FocusEvent]
}>()

const {
  config,
  rootRef,
  inputRef,
  rootAttrs,
  inputAttrs,
  tags,
  open,
  highlightedIndex,
  leavingTags,
  liveMessage,
  liveId,
  listboxId,
  filteredSuggestions,
  tagTestId,
  onInput,
  onFocus,
  onBlur,
  onKeydown,
  onPaste,
  removeTag,
  onSuggestionClick,
} = useVTagInput(props, emit)
</script>

<template>
  <div
    :ref="(el) => { rootRef = el as HTMLElement | null }"
    v-bind="rootAttrs"
  >
    <p
      v-if="!tags.length && !config.readonly && config.emptyText"
      class="v-tag-input__empty"
      data-test-id="v-tag-empty"
    >
      {{ config.emptyText }}
    </p>

    <div class="v-tag-input__inner">
      <VTag
        v-for="tag in tags"
        :key="tag"
        variant="soft"
        :removable="config.closable && !config.readonly"
        :size="config.tagSize"
        :disabled="config.disabled"
        :leaving="leavingTags.includes(tag)"
        dataTestId="v-tag"
        removeTestId="v-tag-remove"
        :removeLabel="`Remove ${tag}`"
        :data-test-tag="tagTestId(tag)"
        @remove="removeTag(tag)"
      >
        {{ tag }}
      </VTag>

      <input
        v-if="!config.readonly"
        :ref="(el) => { inputRef = el as HTMLInputElement | null }"
        v-bind="inputAttrs"
        @input="onInput"
        @focus="onFocus"
        @blur="onBlur"
        @keydown="onKeydown"
        @paste="onPaste"
      />
    </div>

    <ul
      v-if="open && filteredSuggestions.length"
      :id="listboxId"
      class="v-tag-input__suggestions"
      data-test-id="v-tag-suggestions"
      role="listbox"
    >
      <li
        v-for="(suggestion, index) in filteredSuggestions"
        :key="suggestion"
        class="v-tag-input__suggestion"
        :class="{ 'v-tag-input__suggestion--highlighted': highlightedIndex === index }"
        role="option"
        :aria-selected="highlightedIndex === index ? 'true' : 'false'"
        :data-highlighted="highlightedIndex === index ? 'true' : undefined"
        :data-test-id="`v-tag-suggestion-${suggestion}`"
        @mousedown.prevent="onSuggestionClick(suggestion)"
      >
        <span>{{ suggestion }}</span>
        <button
          type="button"
          class="v-tag-input__suggestion-add"
          :data-test-id="`v-tag-suggestion-add-${suggestion}`"
          :aria-label="`Add ${suggestion}`"
          @mousedown.prevent="onSuggestionClick(suggestion)"
        >
          <VIcon :icon="config.addIcon" size="sm" />
        </button>
      </li>
    </ul>

    <span
      :id="liveId"
      class="v-tag-input__live"
      aria-live="polite"
      aria-atomic="true"
    >
      {{ liveMessage }}
    </span>
  </div>
</template>
