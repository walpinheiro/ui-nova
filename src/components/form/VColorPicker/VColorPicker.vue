<script setup lang="ts">
import './VColorPicker.scss'
import { VIcon } from '../../primitives/VIcon'
import { parseColor } from '../_shared/colorUtils'
import { useVColorPicker } from './useVColorPicker'
import type { VColorPickerProps } from './VColorPicker.types'

const props = withDefaults(defineProps<VColorPickerProps>(), {
  modelValue: '#6366F1',
  variant: 'popover',
  size: 'md',
  disabled: false,
  showAlpha: false,
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
  change: [value: string]
  'open-change': [value: boolean]
}>()

const {
  config,
  triggerRef,
  panelRef,
  open,
  rootAttrs,
  placement,
  positionStyle,
  previewStyle,
  checkerStyle,
  saturationBg,
  satX,
  satY,
  hexInput,
  hexError,
  recent,
  liveMessage,
  hsl,
  toggle,
  setColor,
  updateFromSaturation,
  updateHue,
  updateAlpha,
  commitHex,
  clearRecent,
  onTriggerKeydown,
  rgbToHex,
  rgb,
} = useVColorPicker(props, emit)

const isSelectedColor = (color: string) => rgbToHex(parseColor(color)) === rgbToHex(rgb.value)

function pointerPosition(event: PointerEvent | MouseEvent, element: HTMLElement) {
  const rect = element.getBoundingClientRect()
  const x = ((event.clientX - rect.left) / rect.width) * 100
  const y = ((event.clientY - rect.top) / rect.height) * 100
  return { x, y }
}

function onSaturationPointerDown(event: PointerEvent) {
  const target = event.currentTarget as HTMLElement
  const move = (moveEvent: PointerEvent) => {
    const { x, y } = pointerPosition(moveEvent, target)
    updateFromSaturation(x, y)
  }
  const up = () => {
    target.releasePointerCapture(event.pointerId)
    target.removeEventListener('pointermove', move)
    target.removeEventListener('pointerup', up)
  }
  target.setPointerCapture(event.pointerId)
  target.addEventListener('pointermove', move)
  target.addEventListener('pointerup', up)
  const { x, y } = pointerPosition(event, target)
  updateFromSaturation(x, y)
}

function onTrackPointerDown(event: PointerEvent, updater: (percent: number) => void) {
  const target = event.currentTarget as HTMLElement
  const apply = (moveEvent: PointerEvent) => {
    const rect = target.getBoundingClientRect()
    updater(((moveEvent.clientX - rect.left) / rect.width) * 100)
  }
  const up = () => {
    target.releasePointerCapture(event.pointerId)
    target.removeEventListener('pointermove', apply)
    target.removeEventListener('pointerup', up)
  }
  target.setPointerCapture(event.pointerId)
  target.addEventListener('pointermove', apply)
  target.addEventListener('pointerup', up)
  apply(event)
}
</script>

<template>
  <div v-bind="rootAttrs">
    <span v-if="config.label" class="v-color-picker__label">{{ config.label }}</span>

    <div
      v-if="config.variant === 'inline' || config.variant === 'preset'"
      class="v-color-picker__inline-row"
    >
      <button
        v-for="(color, index) in config.variant === 'preset' ? config.presets : config.inlineSwatches"
        :key="`${color}-${index}`"
        type="button"
        class="v-color-picker__swatch"
        :class="{ 'v-color-picker__swatch--selected': isSelectedColor(color) }"
        :style="{ backgroundColor: color }"
        :data-test-id="config.variant === 'preset' ? `v-color-picker-preset-${index}` : 'v-color-picker-trigger'"
        :disabled="config.disabled || undefined"
        :aria-label="`Select color ${color}`"
        @click="setColor(color)"
      >
        <VIcon v-if="isSelectedColor(color)" :icon="config.checkIcon" size="sm" />
      </button>
    </div>

    <template v-else>
      <div ref="triggerRef" class="v-color-picker__anchor">
      <div class="v-color-picker__trigger-row">
        <button
          type="button"
          class="v-color-picker__trigger"
          data-test-id="v-color-picker-trigger"
          :style="previewStyle"
          :disabled="config.disabled || undefined"
          :aria-expanded="open"
          :aria-haspopup="'dialog'"
          :aria-disabled="config.disabled || undefined"
          @click="toggle"
          @keydown="onTriggerKeydown"
        >
          <span class="v-color-picker__trigger-checker" :style="checkerStyle" aria-hidden="true" />
          <span class="v-color-picker__trigger-fill" :style="{ backgroundColor: previewStyle.backgroundColor }" />
          <VIcon
            v-if="props.selected"
            class="v-color-picker__trigger-selected"
            :icon="config.checkIcon"
            size="sm"
          />
        </button>

        <input
          v-if="config.variant === 'hex'"
          v-model="hexInput"
          class="v-color-picker__hex-inline"
          data-test-id="v-color-picker-hex-input"
          :disabled="config.disabled || undefined"
          @change="commitHex"
          @keydown.enter.prevent="commitHex"
        />

        <button
          type="button"
          class="v-color-picker__chevron"
          :disabled="config.disabled || undefined"
          aria-label="Toggle color picker"
          @click="toggle"
        >
          <VIcon :icon="open ? config.chevronUpIcon : config.chevronDownIcon" size="sm" />
        </button>
      </div>

        <div
          v-if="open"
          ref="panelRef"
          class="v-color-picker__popover v-color-picker__popover--open"
          :class="`v-color-picker__popover--${placement}`"
          data-test-id="v-color-picker-popover"
          role="dialog"
          aria-label="Color picker"
          :style="positionStyle"
        >
          <div
            class="v-color-picker__saturation"
            data-test-id="v-color-picker-saturation"
            :style="{ backgroundColor: saturationBg }"
            @pointerdown="onSaturationPointerDown"
          >
            <span class="v-color-picker__saturation-white" />
            <span class="v-color-picker__saturation-black" />
            <span
              class="v-color-picker__handle"
              data-test-id="v-color-picker-saturation-handle"
              :style="{ left: `${satX}%`, top: `${satY}%` }"
            />
          </div>

          <div class="v-color-picker__sliders">
            <div
              class="v-color-picker__hue"
              data-test-id="v-color-picker-hue"
              @pointerdown="onTrackPointerDown($event, updateHue)"
            >
              <span
                class="v-color-picker__handle v-color-picker__handle--track"
                data-test-id="v-color-picker-hue-handle"
                :style="{ left: `${(hsl.h / 360) * 100}%` }"
              />
            </div>

            <div
              v-if="config.showAlpha || config.variant === 'opacity'"
              class="v-color-picker__opacity"
              data-test-id="v-color-picker-opacity"
              :style="{ backgroundImage: `${checkerStyle.backgroundImage}` }"
              @pointerdown="onTrackPointerDown($event, updateAlpha)"
            >
              <span class="v-color-picker__opacity-fill" :style="{ backgroundColor: previewStyle.backgroundColor }" />
              <span
                class="v-color-picker__handle v-color-picker__handle--track"
                data-test-id="v-color-picker-opacity-handle"
                :style="{ left: `${hsl.a * 100}%` }"
              />
            </div>
          </div>

          <div class="v-color-picker__fields">
            <span
              class="v-color-picker__preview"
              data-test-id="v-color-picker-preview"
              :style="previewStyle"
            />
            <label class="v-color-picker__hex-field">
              <span class="v-color-picker__field-label">HEX</span>
              <input
                v-model="hexInput"
                data-test-id="v-color-picker-hex-input"
                @change="commitHex"
                @keydown.enter.prevent="commitHex"
              />
            </label>
            <label
              v-if="config.showAlpha || config.variant === 'opacity'"
              class="v-color-picker__alpha-field"
            >
              <span class="v-color-picker__field-label">Opacity</span>
              <select
                data-test-id="v-color-picker-alpha-select"
                :value="`${Math.round(hsl.a * 100)}%`"
                @change="updateAlpha(Number(($event.target as HTMLSelectElement).value.replace('%', '')))"
              >
                <option v-for="step in [0, 25, 50, 75, 100]" :key="step" :value="`${step}%`">{{ step }}%</option>
              </select>
            </label>
          </div>
          <p v-if="hexError" class="v-color-picker__hex-error" role="alert">{{ hexError }}</p>

          <div v-if="recent.length" class="v-color-picker__recent" data-test-id="v-color-picker-recent">
            <button
              v-for="color in recent"
              :key="color"
              type="button"
              class="v-color-picker__recent-swatch"
              :style="{ backgroundColor: color }"
              :aria-label="`Recent color ${color}`"
              @click="setColor(color)"
            />
            <button
              type="button"
              class="v-color-picker__recent-clear"
              data-test-id="v-color-picker-recent-clear"
              @click="clearRecent"
            >
              Clear
            </button>
          </div>
        </div>
      </div>
    </template>

    <span class="v-color-picker__live" aria-live="polite">{{ liveMessage }}</span>
  </div>
</template>
