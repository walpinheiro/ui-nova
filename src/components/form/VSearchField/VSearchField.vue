<script setup lang="ts">
import './VSearchField.scss'
import { VIcon } from '../../primitives/VIcon'
import { VSpinner } from '../../feedback/VSpinner'
import { useVSearchField } from './useVSearchField'
import type { VSearchFieldProps } from './VSearchField.types'

const props = withDefaults(defineProps<VSearchFieldProps>(), {
  modelValue: '',
  size: 'md',
  disabled: false,
  loading: false,
  shortcut: false,
  clearable: true,
  suggestions: () => [],
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
  clear: []
  search: [value: string]
  select: [suggestion: import('./VSearchField.types').VSearchFieldSuggestion]
  focus: [payload: FocusEvent]
  blur: [payload: FocusEvent]
  shortcut: []
}>()

const {
  config,
  inputRef,
  panelRef,
  rootAttrs,
  controlAttrs,
  inputAttrs,
  listboxId,
  filteredSuggestions,
  showPanel,
  showClear,
  clearAriaLabel,
  selectedIndex,
  onInput,
  onFocus,
  onBlur,
  clear,
  onClearKeydown,
  onInputKeydown,
  selectSuggestion,
  onShortcutClick,
} = useVSearchField(props, emit)
</script>

<template>
  <div v-bind="rootAttrs">
    <label
      v-if="props.label"
      class="v-searchfield__label"
      :for="inputAttrs.id"
      data-test-id="v-searchfield-label"
    >
      {{ props.label }}
    </label>

    <div class="v-searchfield__control-shell">
      <div v-bind="controlAttrs">
        <span
          v-if="!config.loading"
          class="v-searchfield__icon"
          data-test-id="v-searchfield-icon"
          aria-hidden="true"
        >
          <slot name="icon">
            <VIcon :icon="config.leadingIcon" size="sm" />
          </slot>
        </span>

        <span
          v-else
          class="v-searchfield__loading"
          data-test-id="v-searchfield-loading"
          aria-hidden="true"
        >
          <VSpinner variant="inline" size="sm" label="" aria-label="Searching" />
        </span>

        <input
          ref="inputRef"
          v-bind="(inputAttrs as Record<string, unknown>)"
          @input="onInput"
          @focus="onFocus"
          @blur="onBlur"
          @keydown="onInputKeydown"
        />

        <div class="v-searchfield__trailing" data-test-id="v-searchfield-trailing">
          <button
            v-if="showClear"
            type="button"
            class="v-searchfield__clear"
            data-test-id="v-searchfield-clear"
            :aria-label="clearAriaLabel"
            @click="clear"
            @keydown="onClearKeydown"
          >
            <VIcon :icon="config.clearIcon" size="sm" />
          </button>

          <button
            v-if="config.showShortcut"
            type="button"
            class="v-searchfield__shortcut"
            data-test-id="v-searchfield-shortcut"
            :aria-label="`Focus search (${config.shortcutKeys})`"
            :disabled="config.disabled"
            @click="onShortcutClick"
          >
            {{ config.shortcutKeys }}
          </button>
        </div>
      </div>

      <div
        v-if="showPanel"
        ref="panelRef"
        :id="listboxId"
        class="v-searchfield__panel"
        data-test-id="v-searchfield-panel"
        role="listbox"
        @mousedown.prevent
      >
        <button
          v-for="(suggestion, index) in filteredSuggestions"
          :key="`${suggestion.value}-${index}`"
          :id="`${inputAttrs.id}-option-${index}`"
          type="button"
          class="v-searchfield__option"
          :class="{ 'v-searchfield__option--active': selectedIndex === index }"
          role="option"
          :aria-selected="selectedIndex === index"
          :data-test-id="`v-searchfield-option-${index}`"
          @click="selectSuggestion(suggestion, index)"
          @mouseenter="selectedIndex = index"
        >
          <span v-if="suggestion.icon" class="v-searchfield__option-icon" aria-hidden="true">
            <VIcon
              v-if="typeof suggestion.icon !== 'string'"
              :icon="suggestion.icon"
              size="sm"
            />
          </span>
          <span class="v-searchfield__option-label">{{ suggestion.label }}</span>
          <span v-if="suggestion.category" class="v-searchfield__option-category">
            {{ suggestion.category }}
          </span>
        </button>
      </div>
    </div>
  </div>
</template>
