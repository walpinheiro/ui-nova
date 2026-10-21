import { computed, nextTick, onMounted, onUnmounted, ref, watch } from 'vue'
import type { VTabsProps } from './VTabs.types'
import { mountVTabs } from './mountVTabs'

export function useVTabs(props: VTabsProps, emit?: (event: 'update:modelValue', value: string) => void) {
  const config = computed(() => mountVTabs(props))
  const inner = ref<string>(props.modelValue ?? config.value.selected)

  watch(
    () => props.modelValue,
    (value) => {
      if (value !== undefined) inner.value = value
    },
  )

  const selected = computed(() => props.modelValue ?? inner.value)
  const listRef = ref<HTMLElement | null>(null)
  const hasOverflow = ref(false)
  const overflowOpen = ref(false)
  const indicatorStyle = ref<Record<string, string>>({ opacity: '0' })

  const updateIndicator = async () => {
    await nextTick()
    const list = listRef.value
    if (!list) return
    const active = list.querySelector<HTMLElement>('[role="tab"][aria-selected="true"]')
    if (!active) {
      indicatorStyle.value = { opacity: '0' }
      return
    }
    const left = active.offsetLeft
    const top = active.offsetTop
    const width = active.offsetWidth
    const height = active.offsetHeight
    const variant = config.value.variant

    if (variant === 'pill') {
      indicatorStyle.value = {
        opacity: '1',
        top: '0px',
        bottom: 'auto',
        transform: `translate(${left}px, ${top}px)`,
        width: `${width}px`,
        height: `${height}px`,
      }
      return
    }

    indicatorStyle.value = {
      opacity: '1',
      transform: `translateX(${left}px)`,
      width: `${width}px`,
    }
  }

  const checkOverflow = () => {
    const list = listRef.value
    if (!list) return
    hasOverflow.value = list.scrollWidth > list.clientWidth + 1
  }

  let resizeObserver: ResizeObserver | undefined

  onMounted(() => {
    void updateIndicator()
    checkOverflow()
    if (typeof ResizeObserver !== 'undefined' && listRef.value) {
      resizeObserver = new ResizeObserver(() => {
        void updateIndicator()
        checkOverflow()
      })
      resizeObserver.observe(listRef.value)
    }
    window.addEventListener('resize', checkOverflow)
  })

  onUnmounted(() => {
    resizeObserver?.disconnect()
    window.removeEventListener('resize', checkOverflow)
  })

  watch(selected, () => {
    void updateIndicator()
  })

  watch(
    () => [config.value.variant, config.value.size, config.value.items.length],
    () => {
      void updateIndicator()
      checkOverflow()
    },
  )

  const rootAttrs = computed(() => ({
    class: [
      'v-tabs',
      `v-tabs--${config.value.size}`,
      `v-tabs--${config.value.variant}`,
      { 'v-tabs--overflow': hasOverflow.value },
    ],
    'data-test-id': 'v-tabs',
    'data-variant': config.value.variant,
    'data-size': config.value.size,
  }))

  const vmConfig = computed(() => ({ ...config.value, selected: selected.value }))

  const select = (value: string, disabled = false) => {
    if (config.value.disabled || disabled) return
    inner.value = value
    emit?.('update:modelValue', value)
    overflowOpen.value = false
    void updateIndicator()
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
    if (next !== null) {
      event.preventDefault()
      const target = enabled[next]
      select(target.item.value)
      const el = document.querySelector<HTMLElement>(`[data-test-id="v-tabs-tab-${target.item.value}"]`)
      el?.focus()
    }
  }

  const toggleOverflow = () => {
    overflowOpen.value = !overflowOpen.value
  }

  const closeOverflow = () => {
    overflowOpen.value = false
  }

  return {
    config: vmConfig,
    rootAttrs,
    listRef,
    indicatorStyle,
    hasOverflow,
    overflowOpen,
    select,
    onKeydown,
    toggleOverflow,
    closeOverflow,
    updateIndicator,
  }
}
