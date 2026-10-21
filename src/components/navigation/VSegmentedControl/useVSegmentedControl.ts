import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useSpringValue } from '../../../composables/useSpringValue'
import type { VSegmentedControlProps } from './VSegmentedControl.types'
import { mountVSegmentedControl } from './mountVSegmentedControl'

export function useVSegmentedControl(
  props: VSegmentedControlProps,
  emit?: (event: 'update:modelValue', value: string) => void,
) {
  const config = computed(() => mountVSegmentedControl(props))
  const inner = ref(config.value.selected)
  const trackRef = ref<HTMLElement | null>(null)
  const segmentRefs = ref<HTMLElement[]>([])
  const indicator = ref({ width: 0, height: 0, x: 0 })
  const isExpressive = computed(() => props.motion === 'expressive')
  const targetX = ref(0)
  const targetWidth = ref(0)
  const targetHeight = ref(0)
  const springX = useSpringValue(targetX, { stiffness: 320, damping: 24 })
  const springWidth = useSpringValue(targetWidth, { stiffness: 280, damping: 22 })
  const springHeight = useSpringValue(targetHeight, { stiffness: 280, damping: 22 })

  watch(
    () => props.modelValue,
    (value) => {
      if (value !== undefined) inner.value = value
    },
  )

  const selected = computed(() => props.modelValue ?? inner.value)

  const rootAttrs = computed(() => ({
    class: [
      'v-segmented-control',
      `v-segmented-control--${config.value.size}`,
      `v-segmented-control--${config.value.variant}`,
      {
        'v-segmented-control--disabled': config.value.disabled,
        'v-segmented-control--expressive': isExpressive.value,
        'v-segmented-control--full-width': props.fullWidth,
      },
    ],
    role: 'radiogroup',
    'aria-disabled': config.value.disabled || undefined,
    'aria-label': props.ariaLabel,
    'data-test-id': 'v-segmented-control',
    'data-variant': config.value.variant,
    'data-size': config.value.size,
  }))

  const vmConfig = computed(() => ({ ...config.value, selected: selected.value }))

  const indicatorStyle = computed(() => {
    if (!indicator.value.width) return { opacity: '0' }
    const x = isExpressive.value ? springX.value.value : indicator.value.x
    const width = isExpressive.value ? springWidth.value.value : indicator.value.width
    const height = isExpressive.value ? springHeight.value.value : indicator.value.height
    const scaleX = isExpressive.value ? 1 + Math.min(Math.abs(springX.value.value - indicator.value.x) * 0.002, 0.08) : 1
    return {
      width: `${width}px`,
      height: `${height}px`,
      transform: `translateX(${x}px) scaleX(${scaleX})`,
      opacity: '1',
    }
  })

  const setSegmentRef = (el: HTMLElement | null, index: number) => {
    if (!el) return
    segmentRefs.value[index] = el
  }

  const updateIndicator = () => {
    nextTick(() => {
      const index = config.value.items.findIndex((item) => item.value === selected.value)
      const el = segmentRefs.value[index]
      if (!el) return
      const next = {
        width: el.offsetWidth,
        height: el.offsetHeight,
        x: el.offsetLeft,
      }
      indicator.value = next
      if (isExpressive.value) {
        targetX.value = next.x
        targetWidth.value = next.width
        targetHeight.value = next.height
      }
    })
  }

  let resizeObserver: ResizeObserver | undefined

  onMounted(() => {
    updateIndicator()
    if (typeof ResizeObserver !== 'undefined' && trackRef.value) {
      resizeObserver = new ResizeObserver(() => updateIndicator())
      resizeObserver.observe(trackRef.value)
    }
  })

  onBeforeUnmount(() => {
    resizeObserver?.disconnect()
  })

  watch([selected, () => props.options, () => props.size, () => props.variant], updateIndicator)

  const select = (value: string, disabled = false) => {
    if (config.value.disabled || disabled) return
    inner.value = value
    emit?.('update:modelValue', value)
    updateIndicator()
  }

  const onKeydown = (event: KeyboardEvent, index: number) => {
    const items = config.value.items
    const enabled = items.map((item, i) => ({ item, i })).filter(({ item }) => !item.disabled)
    if (enabled.length === 0) return
    const currentPos = enabled.findIndex(({ i }) => i === index)
    let next: number | null = null
    if (event.key === 'ArrowRight') next = currentPos === -1 ? 0 : (currentPos + 1) % enabled.length
    else if (event.key === 'ArrowLeft') next = currentPos === -1 ? enabled.length - 1 : (currentPos - 1 + enabled.length) % enabled.length
    else if (event.key === 'Home') next = 0
    else if (event.key === 'End') next = enabled.length - 1
    else if (event.key === ' ' || event.key === 'Enter') {
      event.preventDefault()
      select(items[index].value, items[index].disabled)
      return
    }
    if (next !== null) {
      event.preventDefault()
      const target = enabled[next]
      select(target.item.value)
      segmentRefs.value[target.i]?.focus()
    }
  }

  const segmentAriaLabel = (item: (typeof config.value.items)[number]) => {
    if (item.label) return undefined
    return item.ariaLabel ?? item.value
  }

  return {
    config: vmConfig,
    rootAttrs,
    trackRef,
    indicatorStyle,
    setSegmentRef,
    select,
    onKeydown,
    segmentAriaLabel,
  }
}
