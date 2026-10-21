import { computed, onBeforeUnmount, ref, useId, watch } from 'vue'
import {
  clamp,
  colorToCss,
  getContrastColor,
  hexToRgb,
  hslToRgb,
  normalizeHexInput,
  parseColor,
  rgbToHex,
  rgbToHsl,
  type HslColor,
  type RgbColor,
} from '../_shared/colorUtils'
import { useOverlayPosition } from '../_shared/useOverlayPosition'
import { mountVColorPicker } from './mountVColorPicker'
import type { VColorPickerProps, VColorPickerState } from './VColorPicker.types'

type VColorPickerEmit = {
  (event: 'update:modelValue', value: string): void
  (event: 'change', value: string): void
  (event: 'open-change', value: boolean): void
}

export function useVColorPicker(props: VColorPickerProps, emit: VColorPickerEmit) {
  const config = computed(() => mountVColorPicker(props))
  const generatedId = useId()
  const triggerRef = ref<HTMLElement | null>(null)
  const panelRef = ref<HTMLElement | null>(null)
  const open = ref(false)
  const hexInput = ref('')
  const hexError = ref('')
  const recent = ref<string[]>([])
  const liveMessage = ref('')
  const selectedPreset = ref<string | null>(null)

  const rgb = ref<RgbColor>(parseColor(props.modelValue))
  const hsl = ref<HslColor>(rgbToHsl(rgb.value))
  const satX = ref(hsl.value.s)
  const satY = ref(100 - hsl.value.l)

  const { placement, positionStyle, updatePosition, bindListeners, unbindListeners } = useOverlayPosition(
    triggerRef,
    panelRef,
    open,
  )

  const syncFromModel = (value?: string) => {
    rgb.value = parseColor(value)
    hsl.value = rgbToHsl(rgb.value)
    satX.value = hsl.value.s
    satY.value = clamp(100 - hsl.value.l, 0, 100)
    hexInput.value = rgbToHex(rgb.value, config.value.showAlpha)
  }

  syncFromModel(props.modelValue)

  watch(
    () => props.modelValue,
    (value) => {
      if (value !== rgbToHex(rgb.value, config.value.showAlpha)) syncFromModel(value)
    },
  )

  const currentCss = computed(() => colorToCss(rgb.value))
  const previewStyle = computed(() => ({
    backgroundColor: currentCss.value,
    color: getContrastColor(rgb.value),
  }))
  const checkerStyle = computed(() => ({
    backgroundImage:
      'linear-gradient(45deg, #ccc 25%, transparent 25%), linear-gradient(-45deg, #ccc 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #ccc 75%), linear-gradient(-45deg, transparent 75%, #ccc 75%)',
    backgroundSize: '8px 8px',
    backgroundPosition: '0 0, 0 4px, 4px -4px, -4px 0',
  }))

  const dataState = computed<VColorPickerState>(() => {
    if (config.value.disabled) return 'disabled'
    if (open.value) return 'open'
    if (props.selected || selectedPreset.value === rgbToHex(rgb.value)) return 'selected'
    return 'default'
  })

  const rootAttrs = computed(() => ({
    class: [
      'v-color-picker',
      `v-color-picker--${config.value.variant}`,
      `v-color-picker--${config.value.size}`,
      { 'v-color-picker--open': open.value, 'v-color-picker--disabled': config.value.disabled },
    ],
    'data-test-id': 'v-color-picker',
    'data-variant': config.value.variant,
    'data-size': config.value.size,
    'data-state': dataState.value,
  }))

  const announce = (value: string) => {
    liveMessage.value = `Selected color ${value}`
  }

  const emitColor = () => {
    const hex = rgbToHex(rgb.value, config.value.showAlpha)
    hexInput.value = hex
    emit('update:modelValue', hex)
    emit('change', hex)
    announce(hex)
  }

  const applyHsl = (next: Partial<HslColor>) => {
    hsl.value = {
      h: next.h ?? hsl.value.h,
      s: next.s ?? hsl.value.s,
      l: next.l ?? hsl.value.l,
      a: next.a ?? hsl.value.a,
    }
    rgb.value = hslToRgb(hsl.value)
    emitColor()
  }

  const updateFromSaturation = (xPercent: number, yPercent: number) => {
    satX.value = clamp(xPercent, 0, 100)
    satY.value = clamp(yPercent, 0, 100)
    applyHsl({ s: satX.value, l: 100 - satY.value })
  }

  const updateHue = (percent: number) => {
    applyHsl({ h: clamp(percent, 0, 100) * 3.6 })
  }

  const updateAlpha = (percent: number) => {
    rgb.value = { ...rgb.value, a: clamp(percent, 0, 100) / 100 }
    hsl.value.a = rgb.value.a
    emitColor()
  }

  const setColor = (hex: string, pushRecent = true) => {
    const parsed = hexToRgb(hex)
    if (!parsed) return
    rgb.value = parsed
    hsl.value = rgbToHsl(parsed)
    satX.value = hsl.value.s
    satY.value = clamp(100 - hsl.value.l, 0, 100)
    selectedPreset.value = rgbToHex(parsed)
    emitColor()
    if (pushRecent) {
      const normalized = rgbToHex(parsed)
      recent.value = [normalized, ...recent.value.filter((entry) => entry !== normalized)].slice(0, 6)
    }
  }

  const commitHex = () => {
    const normalized = normalizeHexInput(hexInput.value)
    const parsed = hexToRgb(normalized)
    if (!parsed) {
      hexError.value = 'Invalid HEX value'
      hexInput.value = rgbToHex(rgb.value, config.value.showAlpha)
      return
    }
    hexError.value = ''
    setColor(normalized, true)
  }

  const clearRecent = () => {
    recent.value = []
  }

  const setOpen = async (value: boolean) => {
    if (config.value.disabled) return
    open.value = value
    emit('open-change', value)
    if (value) {
      bindListeners()
      await updatePosition()
    } else {
      unbindListeners()
    }
  }

  const toggle = () => setOpen(!open.value)

  const onDocumentPointerDown = (event: MouseEvent) => {
    const target = event.target as Node
    if (triggerRef.value?.contains(target) || panelRef.value?.contains(target)) return
    void setOpen(false)
  }

  watch(open, (value) => {
    if (value) document.addEventListener('mousedown', onDocumentPointerDown)
    else document.removeEventListener('mousedown', onDocumentPointerDown)
  })

  onBeforeUnmount(() => {
    document.removeEventListener('mousedown', onDocumentPointerDown)
    unbindListeners()
  })

  const onTriggerKeydown = (event: KeyboardEvent) => {
    if (config.value.disabled) return
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      toggle()
    }
    if (event.key === 'Escape' && open.value) {
      event.preventDefault()
      void setOpen(false)
    }
  }

  const saturationBg = computed(() => `hsl(${hsl.value.h} 100% 50%)`)

  return {
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
    rgb,
    hsl,
    currentCss,
    toggle,
    setOpen,
    setColor,
    updateFromSaturation,
    updateHue,
    updateAlpha,
    commitHex,
    clearRecent,
    onTriggerKeydown,
    rgbToHex,
  }
}
