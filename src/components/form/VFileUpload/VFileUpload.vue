<script setup lang="ts">
import './VFileUpload.scss'
import { VIcon } from '../../primitives/VIcon'
import { VButton } from '../VButton'
import { useVFileUpload } from './useVFileUpload'
import type { VFileUploadProps } from './VFileUpload.types'

const props = withDefaults(defineProps<VFileUploadProps>(), {
  modelValue: () => [],
  variant: 'dropzone',
  size: 'md',
  multiple: true,
  disabled: false,
  autoUpload: true,
  simulateUpload: true,
})

const emit = defineEmits<{
  'update:modelValue': [value: File[]]
  change: [value: File[]]
  upload: [item: import('./VFileUpload.types').VFileUploadFile]
  error: [payload: { file: File; message: string }]
  remove: [file: File]
}>()

const {
  config,
  inputId,
  helperId,
  inputRef,
  items,
  rootAttrs,
  describedBy,
  openPicker,
  onInputChange,
  onDrop,
  onDragOver,
  onDragLeave,
  onKeydown,
  removeItem,
  resolveIcon,
  formatFileSize,
} = useVFileUpload(props, emit)
</script>

<template>
  <div v-bind="rootAttrs">
    <label v-if="config.label" class="v-file-upload__label" :for="inputId">
      {{ config.label }}
    </label>

    <input
      :id="inputId"
      ref="inputRef"
      class="v-file-upload__native-input"
      type="file"
      data-test-id="file-upload-input"
      :accept="config.accept || undefined"
      :multiple="config.multiple || undefined"
      :disabled="config.disabled || undefined"
      :aria-describedby="describedBy"
      tabindex="-1"
      @change="onInputChange"
    />

    <div
      v-if="config.variant === 'dropzone'"
      class="v-file-upload__dropzone"
      data-test-id="file-upload-dropzone"
      role="button"
      tabindex="0"
      :aria-disabled="config.disabled || undefined"
      :aria-describedby="describedBy"
      @click="openPicker"
      @keydown="onKeydown"
      @dragover="onDragOver"
      @dragleave="onDragLeave"
      @drop="onDrop"
    >
      <span class="v-file-upload__icon" data-test-id="file-upload-icon" aria-hidden="true">
        <slot name="icon">
          <VIcon :icon="config.uploadIcon" size="lg" />
        </slot>
      </span>
      <div class="v-file-upload__content" data-test-id="file-upload-content">
        <slot>
          <p class="v-file-upload__title">{{ config.dropzoneTitle }}</p>
          <p class="v-file-upload__hint">{{ config.dropzoneHint }}</p>
        </slot>
      </div>
      <p
        v-if="config.helperText"
        :id="helperId"
        class="v-file-upload__helper"
        data-test-id="file-upload-helper-text"
      >
        {{ config.helperText }}
      </p>
    </div>

    <VButton
      v-else-if="config.variant === 'button'"
      data-test-id="file-upload-button-trigger"
      :size="config.size"
      variant="primary"
      :disabled="config.disabled"
      @click="openPicker"
    >
      <template #icon>
        <VIcon :icon="config.uploadIcon" size="sm" />
      </template>
      {{ config.buttonLabel }}
    </VButton>

    <div
      v-else-if="config.variant === 'image'"
      class="v-file-upload__image-grid"
      data-test-id="file-upload-image-preview"
    >
      <button
        v-for="item in items"
        :key="item.id"
        type="button"
        class="v-file-upload__image-tile"
        :aria-label="`Remove ${item.name}`"
        @click="removeItem(item)"
      >
        <span class="v-file-upload__item-name">{{ item.name }}</span>
      </button>
      <button
        type="button"
        class="v-file-upload__image-add"
        data-test-id="file-upload-dropzone"
        :disabled="config.disabled || undefined"
        @click="openPicker"
      >
        <VIcon :icon="config.uploadIcon" size="md" />
      </button>
    </div>

    <ul
      v-if="items.length && config.variant !== 'image'"
      class="v-file-upload__list"
      :class="{ 'v-file-upload__list--compact': config.variant === 'compact' }"
      :data-test-id="config.variant === 'compact' ? 'file-upload-compact-list' : undefined"
    >
      <li
        v-for="item in items"
        :key="item.id"
        class="v-file-upload__item"
        data-test-id="file-upload-file-item"
      >
        <span class="v-file-upload__item-icon" aria-hidden="true">
          <VIcon :icon="resolveIcon(item.file.type)" size="sm" />
        </span>
        <div class="v-file-upload__item-body">
          <span class="v-file-upload__item-name" data-test-id="file-upload-file-name">{{ item.name }}</span>
          <span class="v-file-upload__item-size" data-test-id="file-upload-file-size">
            {{ formatFileSize(item.size) }}
          </span>
          <div v-if="item.status === 'uploading'" class="v-file-upload__progress" data-test-id="file-upload-progress-bar">
            <span class="v-file-upload__progress-fill" :style="{ width: `${item.progress}%` }" />
          </div>
          <p v-else-if="item.status === 'complete'" class="v-file-upload__status v-file-upload__status--complete" data-test-id="file-upload-status-complete">
            <VIcon :icon="config.successIcon" size="sm" />
            Upload complete
          </p>
          <p v-else-if="item.status === 'error'" class="v-file-upload__status v-file-upload__status--error" data-test-id="file-upload-status-error">
            <VIcon :icon="config.errorIcon" size="sm" />
            Failed to upload / {{ item.errorMessage ?? 'File type not supported' }}
          </p>
        </div>
        <button
          type="button"
          class="v-file-upload__remove"
          data-test-id="file-upload-remove-button"
          :aria-label="`Remove ${item.name}`"
          @click="removeItem(item)"
        >
          <VIcon :icon="config.removeIcon" size="sm" />
        </button>
      </li>
    </ul>
  </div>
</template>
